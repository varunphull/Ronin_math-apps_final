import React from 'react';
import { History, Clock, Trash2, ChevronRight } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistorySidebarProps {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
  selectedId?: string;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ items, onSelect, onClear, selectedId }) => {
  return (
    <div className="h-full flex flex-col bg-slate-900 border-l border-slate-800 w-80 shadow-2xl shadow-black/50 z-30">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-200 font-semibold">
          <History size={18} />
          <h3>History</h3>
        </div>
        {items.length > 0 && (
          <button 
            onClick={onClear} 
            className="text-slate-500 hover:text-red-400 transition-colors p-1"
            title="Clear History"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {items.length === 0 ? (
          <div className="text-center py-10 text-slate-600">
            <Clock size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No labs created yet.</p>
          </div>
        ) : (
          items.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className={`w-full text-left p-3 rounded-lg border transition-all group ${
                selectedId === item.id 
                  ? 'bg-indigo-900/20 border-indigo-500/30 shadow-sm' 
                  : 'bg-slate-800/30 border-slate-800 hover:border-indigo-500/20 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <p className={`text-sm font-medium line-clamp-2 ${selectedId === item.id ? 'text-indigo-300' : 'text-slate-300'}`}>
                  {item.prompt}
                </p>
                {selectedId === item.id && <ChevronRight size={14} className="text-indigo-500 mt-1 flex-shrink-0" />}
              </div>
              <p className="text-xs text-slate-500 font-mono">
                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default HistorySidebar;