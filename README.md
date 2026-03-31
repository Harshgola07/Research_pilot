# ResearchPilot: Autonomous Multi-Agent Research Engine

ResearchPilot is a sophisticated deep-research assistant powered by a multi-agent LangGraph workflow. It takes a complex research question, autonomously breaks it down into sub-queries, navigates the web, validates sources through a rigorous "critic" process, loops back for better info if necessary, and compiles a comprehensive, styled intelligence report.

https://github.com/user-attachments/assets/461fb952-3a3a-4cb6-8b29-51bcb529f0e4


## 🔄 Multi-Agent Workflow Diagram

This application uses LangGraph to manage coordination between four specialized AI agents. The diagram below illustrates how information flows and how decision logic is applied, including the automatic research loop when data quality is low.

<img width="388" height="765" alt="image" src="https://github.com/user-attachments/assets/d1ecadf5-9a3f-4111-ba2f-3f9087f6313f" />

## 📂 Repository Structure
The project is split into a Python FastAPI backend and a React/Vite frontend.

research-app/  
├── backend/                  # Python FastAPI & LangGraph application  
│   ├── .env                  # Example environment variables  
│   ├── requirements.txt      # all backend dependencies  
│   ├── graph.py              # Main LangGraph workflow definition  
│   ├── server.py             # FastAPI server with SSE streaming  
│   └── agents/               # Individual specialized AI agents  
│       ├── __init__.py       # Makes 'agents' a Python package  
│       ├── planner.py        # Breaks down complex questions  
│       ├── researcher.py     # Performs targeted web searches (Tavily)  
│       ├── critic.py         # Grades source relevance and quality  
│       └── writer.py         # Compiles the final styled markdown report  
│  
└── frontend/                 # React frontend application  
    ├── src/  
    │   ├── App.jsx           # Main UI, logic, and streaming handler  
    │   ├── index.css         # Tailwind CSS entry point  
    │   └── main.jsx          # Vite entry point  
    ├── package.json  
    ├── tailwind.config.js    # Tailwind configuration (if using v3)  
    └── vite.config.js        # Vite configuration (with Tailwind v4 plugin)  


## 🛠️ Prerequisites
Before running this application, ensure you have the following installed:

-Python 3.10 or higher
-Node.js 18.x or higher
-npm (usually comes with Node.js)

You will also need:

-A Google Gemini API Key (for agent logic)
-A Tavily API Key (for web search capability)

## 🚀 Step-by-Step Installation & Running
Follow these steps precisely to get the application running on your local machine.

**Part 1: Backend Setup**
Open a new terminal window and navigate to the root folder of the cloned repository.

1. Navigate to the backend folder:
`cd backend`

2. Create and activate a Python Virtual Environment (venv):

On Windows:
```
python -m venv venv
.\venv\Scripts\activate
```

On macOS/Linux:
```
python3 -m venv venv
source venv/bin/activate
```

3. Install backend dependencies:
`pip install -r requirements.txt`

4. Set up Environment Variables (.env):
Open the .env file and paste your API keys:
```
GOOGLE_API_KEY = "your_gemini_key_here"
TAVILY_API_KEY = "your_tavily_key_here"
```

5. Start the FastAPI Server:
`uvicorn server:app --reload`
The backend is now running at http://localhost:8000. Keep this terminal open.

**Part 2: Frontend Setup**
Open a second terminal window. Navigate to the root folder of the repository again.

1. Navigate to the frontend folder:
`cd frontend`

2. Install frontend dependencies:
`npm install`

3. Start the Frontend Development Server:
`npm run dev`


## 🖥️ Usage

-Open your browser to http://localhost:5173.
-You should see the "ResearchPilot" UI.
-Enter a complex research question (e.g., "What are the key technological hurdles for quantum computing scalability as of 2026?").
-Click Launch Research.
-Watch the Agent Pipeline widget animate live as the backend streams progress updates (Planner → Researcher → Critic → Writer).
-The final, fully styled "Executive Summary" report will appear below the pipeline once complete, including confidence grades and clean citations.
