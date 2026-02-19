import React, { useEffect, useRef } from 'react';

interface PreviewFrameProps {
  code: string | null;
}

const PreviewFrame: React.FC<PreviewFrameProps> = ({ code }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current && code) {
        // We use srcDoc for a sandboxed render of the string.
        iframeRef.current.srcdoc = code;
    }
  }, [code]);

  if (!code) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-slate-500 bg-slate-900/50 rounded-lg border-2 border-dashed border-slate-700/50">
        <div className="mb-4 p-4 bg-slate-800 rounded-full shadow-lg shadow-black/20">
            <svg className="w-12 h-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
        </div>
        <p className="font-medium text-lg text-slate-400">Awaiting Experiment</p>
        <p className="text-sm">Enter a topic (e.g., Bearings, Prisms) to generate a lab.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-slate-900 rounded-lg shadow-xl shadow-black/20 border border-slate-800 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-8 bg-slate-950 border-b border-slate-800 flex items-center px-3 gap-1.5">
            <div className="w-3 h-3 rounded-full bg-slate-700"></div>
            <div className="w-3 h-3 rounded-full bg-slate-700"></div>
            <div className="w-3 h-3 rounded-full bg-slate-700"></div>
            <div className="ml-auto text-xs text-slate-500 font-mono">index.html</div>
        </div>
      <iframe
        ref={iframeRef}
        title="Visualization Preview"
        className="w-full h-[calc(100%-2rem)] mt-8 bg-slate-900"
        sandbox="allow-scripts allow-popups allow-same-origin" 
      />
    </div>
  );
};

export default PreviewFrame;