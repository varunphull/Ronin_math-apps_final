import React from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeViewerProps {
  code: string | null;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ code }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!code) {
    return (
      <div className="h-full w-full flex items-center justify-center text-slate-400 bg-slate-900 rounded-lg">
        <p className="font-mono text-sm">No code generated yet.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-slate-900 rounded-lg shadow-sm overflow-hidden flex flex-col relative">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
        <span className="text-xs text-slate-400 font-mono">generated_output.html</span>
        <button
          onClick={handleCopy}
          className="text-slate-400 hover:text-white transition-colors"
          title="Copy code"
        >
          {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
        </button>
      </div>
      <pre className="flex-1 overflow-auto p-4 text-sm font-mono text-slate-300 leading-relaxed scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeViewer;