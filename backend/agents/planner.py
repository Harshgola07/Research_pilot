import json
import os
from langchain_google_genai import ChatGoogleGenerativeAI


def get_model():
    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash-lite",
        google_api_key=os.getenv("GOOGLE_API_KEY"),
        temperature=0.7
    )


def planner_node(state):
    print("\n[planner] breaking down the question...")

    model = get_model()

    prompt = f"""
You are a research assistant. Break this research question into 3 to 5 smaller sub-questions.
Each sub-question should be something you can search for on the web.

Research question: {state['question']}

Return ONLY a JSON object like this, no extra text:
{{
  "sub_questions": ["question 1", "question 2", "question 3"]
}}
"""

    response = model.invoke(prompt)
    text = response.content.strip()

    # gemini sometimes wraps the json in code blocks, strip those out
    if "```" in text:
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
        text = text.strip()

    try:
        data = json.loads(text)
        sub_questions = data["sub_questions"]
    except:
        # if parsing fails just split by newlines and hope for the best
        print("  [planner] json parsing failed, using fallback")
        sub_questions = [line.strip("- 1234567890.") for line in text.splitlines() if line.strip()]
        sub_questions = sub_questions[:5]

    print(f"  [planner] created {len(sub_questions)} sub-questions")
    for i, q in enumerate(sub_questions, 1):
        print(f"    {i}. {q}")

    return {
        **state,
        "sub_questions": sub_questions,
        "loop_count": 0
    }
