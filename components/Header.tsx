import React from 'react';
import { Network, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between shadow-md z-10 relative">
      <div className="flex items-center gap-3 max-w-[80%]">
        <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-500/20 shrink-0">
          <Network size={24} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-slate-100 tracking-tight whitespace-nowrap">Ronin's Maths Interactive Tool</h1>
          <p className="text-xs text-slate-400 font-medium leading-tight mt-1 hidden md:block">
            An interactive tool that brings math and physics concepts to life with SVG visualizations and real-time updates, perfect for young learners.
          </p>
          <p className="text-xs text-slate-400 font-medium mt-1 md:hidden">
            Interactive visualizations for math & physics.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-emerald-400 font-medium bg-slate-800/50 border border-slate-700 px-3 py-1.5 rounded-full shrink-0">
        <Sparkles size={16} />
        <span className="hidden sm:inline">Gemini Powered</span>
      </div>
    </header>
  );
};

export default Header;