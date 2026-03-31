import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Brain, Search, CheckCircle, PenTool, AlertCircle, Loader2, Sparkles, Newspaper } from 'lucide-react';

const AgentNode = ({ title, icon: Icon, isActive, isDone }) => (
  <div className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-500 w-32 relative z-10
    ${isActive ? 'border-blue-500 bg-blue-50 shadow-[0_0_20px_rgba(59,130,246,0.3)] scale-110' : 
      isDone ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-white opacity-40'}`}>
    <div className={`p-3 rounded-full mb-2 transition-colors duration-500 ${isActive ? 'bg-blue-600 text-white animate-pulse' : 
      isDone ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
      <Icon size={24} />
    </div>
    <span className={`font-bold text-xs uppercase tracking-wider ${isActive ? 'text-blue-700' : isDone ? 'text-emerald-700' : 'text-gray-400'}`}>
      {title}
    </span>
  </div>
);

export default function ResearchAssistant() {
  const [question, setQuestion] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeNode, setActiveNode] = useState(null);
  const [completedNodes, setCompletedNodes] = useState([]);
  const [graphState, setGraphState] = useState(null);
  const [error, setError] = useState('');

  const abortControllerRef = useRef(null);

  const startResearch = async (e) => {
    e.preventDefault();
    if (!question) {
      setError('Please enter a research question.');
      return;
    }

    setError('');
    setIsProcessing(true);
    setActiveNode('planner');
    setCompletedNodes([]);
    setGraphState(null);

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('http://localhost:8000/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }), // Only sending the question now
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) throw new Error('Backend server connection failed.');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n\n');
        buffer = parts.pop(); 

        for (const part of parts) {
          if (part.startsWith('data: ')) {
            try {
              const payload = JSON.parse(part.substring(6));
              setActiveNode(payload.active_node);
              
              setCompletedNodes(prev => {
                const nodes = new Set(prev);
                if (payload.active_node === 'researcher') nodes.add('planner');
                if (payload.active_node === 'critic') nodes.add('researcher');
                if (payload.active_node === 'writer') { nodes.add('critic'); nodes.add('researcher'); }
                return Array.from(nodes);
              });

              setGraphState(payload.state);
            } catch (err) { console.error('Stream Parse Error:', err); }
          }
        }
      }
      
      setIsProcessing(false);
      setActiveNode(null);
      setCompletedNodes(['planner', 'researcher', 'critic', 'writer']);

    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 p-4 md:p-12 font-sans selection:bg-blue-100">
      <div className="max-w-5xl mx-auto space-y-10">
        
        <header className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-2 bg-blue-50 rounded-2xl mb-2">
            <Sparkles className="text-blue-600 mr-2" size={20} />
            <span className="text-blue-700 font-bold text-sm tracking-widest uppercase">AI Research Engine</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-slate-900">ResearchPilot</h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">Deep autonomous research powered by LangGraph.</p>
        </header>

        {/* Simplified Input Section */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <form onSubmit={startResearch} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Research Question</label>
              <textarea value={question} onChange={(e) => setQuestion(e.target.value)} rows="3"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-lg"
                placeholder="Ex: What are the current breakthroughs in nuclear fusion as of 2026?" />
            </div>
            
            <div className="flex items-center justify-between">
              {error && <div className="text-red-500 text-sm font-medium flex items-center gap-2"><AlertCircle size={18}/>{error}</div>}
              <button type="submit" disabled={isProcessing} 
                className={`px-10 py-4 rounded-2xl font-bold text-white shadow-lg transition-all flex items-center gap-3 ml-auto
                ${isProcessing ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-1'}`}>
                {isProcessing ? <><Loader2 size={20} className="animate-spin"/> Analyzing...</> : <><Search size={20}/> Launch Research</>}
              </button>
            </div>
          </form>
        </section>

        {/* Pipeline Animation */}
        {(isProcessing || graphState) && (
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
             <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                <AgentNode title="Planner" icon={Brain} isActive={activeNode === 'planner'} isDone={completedNodes.includes('planner')} />
                <div className={`hidden md:block h-1 flex-1 transition-colors duration-1000 ${completedNodes.includes('planner') ? 'bg-emerald-500' : 'bg-slate-100'}`} />
                <AgentNode title="Researcher" icon={Search} isActive={activeNode === 'researcher'} isDone={completedNodes.includes('researcher')} />
                <div className={`hidden md:block h-1 flex-1 transition-colors duration-1000 ${completedNodes.includes('researcher') ? 'bg-emerald-500' : 'bg-slate-100'}`} />
                <AgentNode title="Critic" icon={CheckCircle} isActive={activeNode === 'critic'} isDone={completedNodes.includes('critic')} />
                <div className={`hidden md:block h-1 flex-1 transition-colors duration-1000 ${completedNodes.includes('critic') ? 'bg-emerald-500' : 'bg-slate-100'}`} />
                <AgentNode title="Writer" icon={PenTool} isActive={activeNode === 'writer'} isDone={completedNodes.includes('writer')} />
              </div>

              {graphState && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Sub-Questions</h4>
                    <ul className="space-y-2">
                      {graphState.sub_questions?.map((q, i) => (
                        <li key={i} className="text-sm font-medium text-slate-700">{i+1}. {q}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-center">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Sources</h4>
                    <span className="text-4xl font-black text-slate-800">{graphState.sources?.length || 0}</span>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-center">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Quality Score</h4>
                    <span className={`text-4xl font-black ${graphState.avg_score >= 0.6 ? 'text-emerald-600' : 'text-orange-500'}`}>
                      {graphState.avg_score ? (graphState.avg_score * 100).toFixed(0) : '0'}%
                    </span>
                  </div>
                </div>
              )}
             </div>
          </div>
        )}

        {/* Report Content */}
        {graphState?.report && !isProcessing && (
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="bg-[#0f172a] p-10 md:p-14 text-white relative">
              <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                  <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">Research Analysis</h2>
                  <p className="text-slate-400 text-lg font-medium">Confidence Grade: {graphState.confidence}</p>
                </div>
              </div>
            </div>
            
            <div className="p-10 md:p-16">
              <article className="max-w-none">
                <ReactMarkdown
                  components={{
                    h2: ({node, ...props}) => <h2 className="text-3xl font-black text-slate-900 mt-12 mb-6 pb-3 border-b-2 border-slate-100" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-xl font-bold text-blue-700 mt-8 mb-4 uppercase" {...props} />,
                    p: ({node, children, ...props}) => {
                      const formatted = React.Children.map(children, child => {
                        if (typeof child === 'string') {
                          return child.split(/(\[\d+\])/g).map((part, i) => 
                            /(\[\d+\])/.test(part) ? 
                            <span key={i} className="mx-1 inline-flex items-center justify-center bg-blue-100 text-blue-700 text-[10px] font-bold h-5 px-1.5 rounded-md border border-blue-200 shadow-sm">{part.replace(/[\[\]]/g, '')}</span> 
                            : part
                          );
                        }
                        return child;
                      });
                      return <p className="text-slate-700 leading-relaxed mb-6 text-lg font-medium" {...props}>{formatted}</p>;
                    },
                    ul: ({node, ...props}) => <ul className="space-y-3 my-6 list-none" {...props} />,
                    li: ({node, ...props}) => (
                      <li className="flex items-start gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100" {...props}>
                        <div className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                        <div className="text-slate-800 text-lg leading-snug">{props.children}</div>
                      </li>
                    ),
                    a: ({node, ...props}) => <a className="text-blue-600 hover:text-blue-800 underline break-all font-semibold" target="_blank" rel="noopener noreferrer" {...props} />
                  }}
                >
                  {graphState.report}
                </ReactMarkdown>
              </article>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}