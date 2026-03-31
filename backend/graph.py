from langgraph.graph import StateGraph, END
from typing import TypedDict

from agents.planner import planner_node
from agents.researcher import researcher_node
from agents.critic import critic_node
from agents.writer import writer_node

# this is the shared "memory" of the whole pipeline
# every node reads from this and writes back to it
class State(TypedDict):
    question: str
    sub_questions: list
    sources: list          # raw sources from tavily
    scored_sources: list   # sources after critic grades them
    avg_score: float
    critique: str          # feedback from critic to researcher
    loop_count: int
    report: str
    confidence: str        # HIGH, MEDIUM, LOW
    used_fallback: bool    # true if we ran out of loops with bad sources


# this function decides what happens after the critic runs
# either we go back and search again, or we move on to writing
def after_critic(state):
    MAX_LOOPS = 3
    GOOD_ENOUGH = 0.6

    if state["loop_count"] >= MAX_LOOPS:
        print(f"  [graph] hit max loops ({MAX_LOOPS}), moving to writer anyway")
        return "writer"

    if state["avg_score"] < GOOD_ENOUGH:
        print(f"  [graph] score {state['avg_score']:.2f} is too low, searching again...")
        return "researcher"

    print(f"  [graph] score {state['avg_score']:.2f} is good enough, writing report")
    return "writer"


def build_graph():
    g = StateGraph(State)

    g.add_node("planner", planner_node)
    g.add_node("researcher", researcher_node)
    g.add_node("critic", critic_node)
    g.add_node("writer", writer_node)

    g.set_entry_point("planner")
    g.add_edge("planner", "researcher")
    g.add_edge("researcher", "critic")

    # this is the key part - conditional routing based on source quality
    g.add_conditional_edges("critic", after_critic, {
        "researcher": "researcher",
        "writer": "writer"
    })

    g.add_edge("writer", END)

    return g.compile()
