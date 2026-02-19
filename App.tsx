import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputArea from './components/InputArea';
import PreviewFrame from './components/PreviewFrame';
import CodeViewer from './components/CodeViewer';
import HistorySidebar from './components/HistorySidebar';
import { generateVisualizationCode } from './services/geminiService';
import { HistoryItem, ViewMode } from './types';
import { Code, Eye, PanelRightClose, PanelRightOpen, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [currentCode, setCurrentCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.PREVIEW);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem('vizkid_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('vizkid_history', JSON.stringify(history));
  }, [history]);

  const handleGenerate = async (prompt: string, imageBase64?: string) => {
    setLoading(true);
    setError(null);
    setCurrentPrompt(prompt);
    
    try {
      // Pass the image data if it exists
      const generatedCode = await generateVisualizationCode(prompt, imageBase64);
      setCurrentCode(generatedCode);
      
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        prompt: imageBase64 ? `(Image) ${prompt}` : prompt,
        code: generatedCode,
        timestamp: Date.now()
      };
      
      setHistory(prev => [newItem, ...prev]);
    } catch (err: any) {
        let errorMessage = "Something went wrong. Please try again.";
        if (err.message && err.message.includes('API_KEY')) {
            errorMessage = "API Configuration Error: Missing API Key.";
        } else if (err.message) {
            errorMessage = err.message;
        }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setCurrentCode(item.code);
    setCurrentPrompt(item.prompt);
    if (window.innerWidth < 768) {
        setShowHistory(false);
    }
  };

  const handleClearHistory = () => {
      setHistory([]);
      setCurrentCode(null);
      setCurrentPrompt('');
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200">
      <Header />
      
      <main className="flex-1 flex overflow-hidden relative">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Toolbar */}
          <div className="px-6 py-3 flex items-center justify-between bg-slate-900 border-b border-slate-800">
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
                <button
                    onClick={() => setViewMode(ViewMode.PREVIEW)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        viewMode === ViewMode.PREVIEW 
                        ? 'bg-slate-700 text-slate-100 shadow-sm' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                >
                    <Eye size={16} />
                    Preview
                </button>
                <button
                    onClick={() => setViewMode(ViewMode.CODE)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        viewMode === ViewMode.CODE 
                        ? 'bg-slate-700 text-slate-100 shadow-sm' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                >
                    <Code size={16} />
                    Code
                </button>
            </div>
            
            <button 
                onClick={() => setShowHistory(!showHistory)}
                className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-950/30 rounded-lg transition-colors"
                title={showHistory ? "Hide History" : "Show History"}
            >
                {showHistory ? <PanelRightClose size={20} /> : <PanelRightOpen size={20} />}
            </button>
          </div>

          {/* Canvas/Workspace */}
          <div className="flex-1 p-6 overflow-hidden relative bg-black/20">
            {error && (
                <div className="absolute top-6 left-6 right-6 z-30 bg-red-950/50 border border-red-800/50 text-red-300 px-4 py-3 rounded-lg flex items-center gap-3 shadow-lg animate-in fade-in slide-in-from-top-4 backdrop-blur-sm">
                    <AlertCircle size={20} />
                    <span className="font-medium">{error}</span>
                </div>
            )}
            
            <div className="h-full w-full max-w-6xl mx-auto shadow-2xl shadow-black/40 transition-all duration-300">
                {viewMode === ViewMode.PREVIEW ? (
                    <PreviewFrame code={currentCode} />
                ) : (
                    <CodeViewer code={currentCode} />
                )}
            </div>
          </div>

          <InputArea onGenerate={handleGenerate} isLoading={loading} />
        </div>

        {/* History Sidebar */}
        {showHistory && (
            <div className="absolute right-0 top-0 bottom-0 z-40 md:relative h-full animate-in slide-in-from-right duration-200">
                <HistorySidebar 
                    items={history} 
                    onSelect={handleSelectHistory} 
                    onClear={handleClearHistory}
                    selectedId={history.find(h => h.code === currentCode)?.id}
                />
            </div>
        )}
      </main>
    </div>
  );
};

export default App;