import json
import os
import time
from langchain_google_genai import ChatGoogleGenerativeAI

def get_model():
    # Sticking with gemini-2.5-flash-lite as it's better for high-volume tasks
    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash-lite", 
        google_api_key=os.getenv("GOOGLE_API_KEY"),
        temperature=0.1
    )

def score_source_batch(batch, model):
    """Sends a list of sources to the AI to be graded all at once"""
    
    # We build a big string containing the text of all 5 sources
    sources_text = ""
    for i, s in enumerate(batch):
        sources_text += f"\n--- SOURCE INDEX {i} ---\n"
        sources_text += f"Title: {s['title']}\n"
        sources_text += f"Question: {s['sub_question']}\n"
        sources_text += f"Content: {s['content'][:500]}\n"

    prompt = f"""
Rate how relevant each source is to its specific question. Give a score from 0.0 to 1.0.
{sources_text}

Return ONLY a JSON list of objects like this:
[
  {{"index": 0, "score": 0.9, "reason": "explanation"}},
  {{"index": 1, "score": 0.4, "reason": "explanation"}}
]
"""

    try:
        resp = model.invoke(prompt)
        text = resp.content.strip()

        # Clean up the AI response if it includes markdown code blocks
        if "```" in text:
            text = text.split("```")[1].replace("json", "").strip()

        results = json.loads(text)
        return results
    except Exception as e:
        print(f"  [critic] Error grading batch: {e}")
        return []

def adjust_for_domain(score, url):
    """Bumps score up or down based on the website name"""
    if not url: return score
    
    high_q = ["arxiv.org", "ieee.org", ".gov", ".edu", "nature.com", "pubmed", "nih.gov", "science.org"]
    low_q = ["reddit.com", "quora.com", "twitter.com", "x.com"]
    
    for domain in high_q:
        if domain in url: return min(1.0, score + 0.05)
    for domain in low_q:
        if domain in url: return max(0.0, score - 0.15)
    return score

def critic_node(state):
    print("\n[critic] grading sources...")
    model = get_model()
    all_sources = state["sources"]
    scored_results = []

    # 1. Separate valid sources from the ones that failed to load
    valid_sources = []
    for s in all_sources:
        if s.get("error") or not s.get("content"):
            # Mark failed ones as 0 immediately
            scored_results.append({**s, "score": 0.0, "reason": "no content found"})
        else:
            valid_sources.append(s)

    # 2. Process the valid sources in batches of 5
    # This loop handles remainders automatically (e.g., if you have 13, it does 5, 5, then 3)
    for i in range(0, len(valid_sources), 5):
        current_batch = valid_sources[i : i + 5]
        print(f"  [critic] processing sources {i} to {i + len(current_batch)}...")
        
        batch_grades = score_source_batch(current_batch, model)
        
        # Match the AI's grades back to our source objects
        for grade_data in batch_grades:
            idx = grade_data["index"]
            # Double check the index is valid for our current small batch
            if idx < len(current_batch):
                source = current_batch[idx]
                raw_score = grade_data.get("score", 0.5)
                
                final_score = adjust_for_domain(raw_score, source.get("url", ""))
                
                scored_results.append({
                    **source,
                    "score": final_score,
                    "reason": grade_data.get("reason", "graded")
                })
        
        # Pause briefly to stay under the 10 requests-per-minute limit
        if i + 5 < len(valid_sources):
            time.sleep(3)

    # 3. Final stats
    avg = 0.0
    if scored_results:
        avg = sum(s["score"] for s in scored_results) / len(scored_results)
    
    print(f"  [critic] average score: {avg:.2f}")

    return {
        **state,
        "scored_sources": scored_results,
        "avg_score": avg,
        "critique": "some sources are low quality" if avg < 0.6 else ""
    }