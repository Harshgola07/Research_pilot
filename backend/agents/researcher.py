import os
import time
from concurrent.futures import ThreadPoolExecutor
from tavily import TavilyClient

def make_better_query(original_query, critique):
    """Refines the search query if the critic provided feedback"""
    if not critique:
        return original_query

    extra = ""
    if "old" in critique or "outdated" in critique:
        extra += " 2025 2026"
    if "shallow" in critique or "vague" in critique:
        extra += " in depth research"
    if "low-quality" in critique or "unreliable" in critique:
        extra += " scholarly article"

    return original_query + extra

def perform_single_search(client, question, query):
    """Helper function to perform one search and return results"""
    try:
        # We perform the actual web search here
        results = client.search(query=query, max_results=3)
        
        extracted_sources = []
        for r in results.get("results", []):
            extracted_sources.append({
                "sub_question": question,
                "title": r.get("title", "no title"),
                "url": r.get("url", ""),
                "content": r.get("content", "")[:1200], # Keep a bit more for the critic
                "published_date": r.get("published_date", "unknown")
            })
        return extracted_sources
    
    except Exception as e:
        print(f"  [researcher] search failed for '{query[:30]}': {e}")
        return [{
            "sub_question": question,
            "title": "search failed",
            "url": "",
            "content": "",
            "published_date": "unknown",
            "error": str(e)
        }]

def researcher_node(state):
    loop = state["loop_count"]
    print(f"\n[researcher] searching (loop {loop + 1}) in parallel...")

    client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))
    all_sources = []
    
    # 1. Prepare all the queries first
    search_tasks = []
    for question in state["sub_questions"]:
        if loop == 0:
            query = question
        else:
            query = make_better_query(question, state.get("critique", ""))
        
        # We store the original question and the refined query as a pair
        search_tasks.append((question, query))

    # 2. Run searches in parallel
    # 'max_workers' is how many searches run at the exact same time
    with ThreadPoolExecutor(max_workers=5) as executor:
        # We map the search function to our list of tasks
        future_to_search = [
            executor.submit(perform_single_search, client, q, query) 
            for q, query in search_tasks
        ]
        
        for future in future_to_search:
            result_list = future.result() # This gathers the result when it's finished
            all_sources.extend(result_list)

    print(f"  [researcher] got {len(all_sources)} total sources quickly!")

    return {
        **state,
        "sources": all_sources,
        "loop_count": loop + 1
    }