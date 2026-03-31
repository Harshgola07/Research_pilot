# ResearchPilot: Autonomous Multi-Agent Research Engine

ResearchPilot is a sophisticated deep-research assistant powered by a multi-agent LangGraph workflow. It takes a complex research question, autonomously breaks it down into sub-queries, navigates the web, validates sources through a rigorous "critic" process, loops back for better info if necessary, and compiles a comprehensive, styled intelligence report.

![ResearchPilot UI Screenshot](https://i.imgur.com/your_screenshot_placeholder.png) **

## 🔄 Multi-Agent Workflow Diagram

This application uses LangGraph to manage coordination between four specialized AI agents. The diagram below illustrates how information flows and how decision logic is applied, including the automatic research loop when data quality is low.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#e1f5fe', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#fff'}}}%%
graph TD
    %% Define Nodes
    Start((● Start))
    Planner
    Researcher
    Critic
    Decision{cite: Quality Check}
    Writer
    End((● End))

    %% Define Node Styles
    classDef agent fill:#e3f2fd,stroke:#1565c0,stroke-width:2px,rx:10,ry:10;
    classDef logic fill:#fff9c4,stroke:#fbc02d,stroke-width:2px;
    classDef standard fill:#f5f5f5,stroke:#9e9e9e,stroke-width:1px;

    class Planner,Researcher,Critic,Writer agent;
    class Decision logic;
    class Start,End standard;

    %% Define Flow
    Start -->|User Question| Planner
    Planner -->|Sub-questions| Researcher
    Researcher -->|Raw Sources| Critic
    Critic -->|Scored Sources + Critique| Decision

    %% Decision Logic (from graph.py after_critic)
    Decision ==>|Avg Score >= 0.6| Writer
    Decision -.->|Avg Score < 0.6 AND Loop < 3| Researcher
    Decision ==>|Fallback/Loop Limit| Writer

    Writer -->|Final Styled Report| End

    %% Sub-graphs for context
    subgraph "Web Tools"
        Tavily
    end
    Researcher -.-> Tavily


📂 Repository Structure
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


🛠️ Prerequisites
Before running this application, ensure you have the following installed:

Python 3.10 or higher

Node.js 18.x or higher

npm (usually comes with Node.js)

You will also need:

A Google Gemini API Key (for agent logic)

A Tavily API Key (for web search capability)


🚀 Step-by-Step Installation & Running
Follow these steps precisely to get the application running on your local machine.

Part 1: Backend Setup
Open a new terminal window and navigate to the root folder of the cloned repository.

1. Navigate to the backend folder:
cd backend

2. Create and activate a Python Virtual Environment (venv):
On Windows:
python -m venv venv
.\venv\Scripts\activate

On macOS/Linux:
python3 -m venv venv
source venv/bin/activate

3. Install backend dependencies:
pip install -r requirements.txt

Gemini said
This is a comprehensive, professional README.md file tailored for your GitHub repository. It includes a clear visual structure of your files, precise setup instructions based on our previous interactions (including the venv and .env setup), and a detailed workflow diagram of your multi-agent system.

Copy the entire block below and save it as README.md in the root of your project folder.

Markdown
# ResearchPilot: Autonomous Multi-Agent Research Engine

ResearchPilot is a sophisticated deep-research assistant powered by a multi-agent LangGraph workflow. It takes a complex research question, autonomously breaks it down into sub-queries, navigates the web, validates sources through a rigorous "critic" process, loops back for better info if necessary, and compiles a comprehensive, styled intelligence report.

![ResearchPilot UI Screenshot](https://i.imgur.com/your_screenshot_placeholder.png) **

## 🔄 Multi-Agent Workflow Diagram

This application uses LangGraph to manage coordination between four specialized AI agents. The diagram below illustrates how information flows and how decision logic is applied, including the automatic research loop when data quality is low.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#e1f5fe', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#fff'}}}%%
graph TD
    %% Define Nodes
    Start((● Start))
    Planner
    Researcher
    Critic
    Decision{cite: Quality Check}
    Writer
    End((● End))

    %% Define Node Styles
    classDef agent fill:#e3f2fd,stroke:#1565c0,stroke-width:2px,rx:10,ry:10;
    classDef logic fill:#fff9c4,stroke:#fbc02d,stroke-width:2px;
    classDef standard fill:#f5f5f5,stroke:#9e9e9e,stroke-width:1px;

    class Planner,Researcher,Critic,Writer agent;
    class Decision logic;
    class Start,End standard;

    %% Define Flow
    Start -->|User Question| Planner
    Planner -->|Sub-questions| Researcher
    Researcher -->|Raw Sources| Critic
    Critic -->|Scored Sources + Critique| Decision

    %% Decision Logic (from graph.py after_critic)
    Decision ==>|Avg Score >= 0.6| Writer
    Decision -.->|Avg Score < 0.6 AND Loop < 3| Researcher
    Decision ==>|Fallback/Loop Limit| Writer

    Writer -->|Final Styled Report| End

    %% Sub-graphs for context
    subgraph "Web Tools"
        Tavily
    end
    Researcher -.-> Tavily
📂 Repository Structure
The project is split into a Python FastAPI backend and a React/Vite frontend.

Plaintext
research-app/
├── backend/                  # Python FastAPI & LangGraph application
│   ├── .env.example          # Example environment variables
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
🛠️ Prerequisites
Before running this application, ensure you have the following installed:

Python 3.10 or higher

Node.js 18.x or higher

npm (usually comes with Node.js)

You will also need:

A Google Gemini API Key (for agent logic)

A Tavily API Key (for web search capability)

🚀 Step-by-Step Installation & Running
Follow these steps precisely to get the application running on your local machine.

Part 1: Backend Setup
Open a new terminal window and navigate to the root folder of the cloned repository.

1. Navigate to the backend folder:
cd backend

2. Create and activate a Python Virtual Environment (venv):
On Windows:
python -m venv venv
.\venv\Scripts\activate

On macOS/Linux:
python3 -m venv venv
source venv/bin/activate

3. Install backend dependencies:
pip install -r requirements.txt

4. Set up Environment Variables (.env):
open the .env file and paste your api keys 
GOOGLE_API_KEY=AIzaSy...your_gemini_key_here
TAVILY_API_KEY=tvly-...your_tavily_key_here

5. Start the FastAPI Server:
uvicorn server:app --reload

The backend is now running at http://localhost:8000. Keep this terminal open.


Part 2: Frontend Setup
Open a second terminal window. Navigate to the root folder of the repository again.

Gemini said
This is a comprehensive, professional README.md file tailored for your GitHub repository. It includes a clear visual structure of your files, precise setup instructions based on our previous interactions (including the venv and .env setup), and a detailed workflow diagram of your multi-agent system.

Copy the entire block below and save it as README.md in the root of your project folder.

Markdown
# ResearchPilot: Autonomous Multi-Agent Research Engine

ResearchPilot is a sophisticated deep-research assistant powered by a multi-agent LangGraph workflow. It takes a complex research question, autonomously breaks it down into sub-queries, navigates the web, validates sources through a rigorous "critic" process, loops back for better info if necessary, and compiles a comprehensive, styled intelligence report.

![ResearchPilot UI Screenshot](https://i.imgur.com/your_screenshot_placeholder.png) **

## 🔄 Multi-Agent Workflow Diagram

This application uses LangGraph to manage coordination between four specialized AI agents. The diagram below illustrates how information flows and how decision logic is applied, including the automatic research loop when data quality is low.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#e1f5fe', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#fff'}}}%%
graph TD
    %% Define Nodes
    Start((● Start))
    Planner
    Researcher
    Critic
    Decision{cite: Quality Check}
    Writer
    End((● End))

    %% Define Node Styles
    classDef agent fill:#e3f2fd,stroke:#1565c0,stroke-width:2px,rx:10,ry:10;
    classDef logic fill:#fff9c4,stroke:#fbc02d,stroke-width:2px;
    classDef standard fill:#f5f5f5,stroke:#9e9e9e,stroke-width:1px;

    class Planner,Researcher,Critic,Writer agent;
    class Decision logic;
    class Start,End standard;

    %% Define Flow
    Start -->|User Question| Planner
    Planner -->|Sub-questions| Researcher
    Researcher -->|Raw Sources| Critic
    Critic -->|Scored Sources + Critique| Decision

    %% Decision Logic (from graph.py after_critic)
    Decision ==>|Avg Score >= 0.6| Writer
    Decision -.->|Avg Score < 0.6 AND Loop < 3| Researcher
    Decision ==>|Fallback/Loop Limit| Writer

    Writer -->|Final Styled Report| End

    %% Sub-graphs for context
    subgraph "Web Tools"
        Tavily
    end
    Researcher -.-> Tavily
📂 Repository Structure
The project is split into a Python FastAPI backend and a React/Vite frontend.

Plaintext
research-app/
├── backend/                  # Python FastAPI & LangGraph application
│   ├── .env.example          # Example environment variables
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
🛠️ Prerequisites
Before running this application, ensure you have the following installed:

Python 3.10 or higher

Node.js 18.x or higher

npm (usually comes with Node.js)

You will also need:

A Google Gemini API Key (for agent logic)

A Tavily API Key (for web search capability)

🚀 Step-by-Step Installation & Running
Follow these steps precisely to get the application running on your local machine.

Part 1: Backend Setup
Open a new terminal window and navigate to the root folder of the cloned repository.

1. Navigate to the backend folder:

Bash
cd backend
2. Create and activate a Python Virtual Environment (venv):
On Windows:

Bash
python -m venv venv
.\venv\Scripts\activate
On macOS/Linux:

Bash
python3 -m venv venv
source venv/bin/activate
3. Install backend dependencies:

Bash
pip install fastapi uvicorn langchain-google-genai tavily-python langgraph pydantic python-dotenv
4. Set up Environment Variables (.env):
Copy the .env.example file to create your own .env file.

Bash
cp .env.example .env
Open the newly created .env file and paste your API keys:

Plaintext
GOOGLE_API_KEY=AIzaSy...your_gemini_key_here
TAVILY_API_KEY=tvly-...your_tavily_key_here
5. Start the FastAPI Server:

Bash
uvicorn server:app --reload
The backend is now running at http://localhost:8000. Keep this terminal open.

Part 2: Frontend Setup
Open a second terminal window. Navigate to the root folder of the repository again.

1. Navigate to the frontend folder:
cd frontend

2. Install frontend dependencies:
npm install

3. Start the Frontend Development Server:
npm run dev


🖥️ Usage
Open your browser to http://localhost:5173.

You should see the "ResearchPilot" UI.

Enter a complex research question (e.g., "What are the key technological hurdles for quantum computing scalability as of 2026?").

Click Launch Research.

Watch the Agent Pipeline widget animate live as the backend streams progress updates (Planner → Researcher → Critic → Writer).

The final, fully styled "Executive Summary" report will appear below the pipeline once complete, including confidence grades and clean citations.

🛡️ License
This project is licensed under the MIT License.