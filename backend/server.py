import os
import json
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv


load_dotenv()  # Load environment variables from .env file

# Import your existing graph builder
from graph import build_graph

app = FastAPI()

# Allow React to communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with your React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResearchRequest(BaseModel):
    question: str

@app.post("/api/research")
def run_research(req: ResearchRequest):
    
    graph = build_graph()
    
    initial_state = {
        "question": req.question,
        "sub_questions": [], "sources": [], "scored_sources"    : [],
        "avg_score": 0.0, "critique": "", "loop_count": 0,
        "report": "", "confidence": "", "used_fallback": False
    }

    def event_generator():
        # Stream updates from the LangGraph execution
        for event in graph.stream(initial_state, stream_mode="updates"):
            for node_name, output_state in event.items():
                # Yield the current node and the new state back to React
                payload = {
                    "active_node": node_name,
                    "state": output_state
                }
                yield f"data: {json.dumps(payload)}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

# Run this file with: uvicorn server:app --reload