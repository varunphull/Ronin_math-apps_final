import React, { useState, KeyboardEvent, useRef } from 'react';
import { Send, Loader2, Image as ImageIcon, X } from 'lucide-react';

interface InputAreaProps {
  onGenerate: (prompt: string, imageBase64?: string) => void;
  isLoading: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if ((prompt.trim() || selectedImage) && !isLoading) {
      onGenerate(prompt, selectedImage || undefined);
      setPrompt('');
      setSelectedImage(null);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-slate-900 p-4 border-t border-slate-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.2)] z-20">
      <div className="max-w-4xl mx-auto relative flex flex-col gap-2">
        
        {/* Image Preview */}
        {selectedImage && (
          <div className="relative inline-block w-fit animate-in fade-in slide-in-from-bottom-2">
            <img 
              src={selectedImage} 
              alt="Upload preview" 
              className="h-20 w-auto rounded-lg border border-slate-700 shadow-sm" 
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 bg-slate-800 text-slate-400 hover:text-white rounded-full p-1 border border-slate-600 shadow-sm"
            >
              <X size={12} />
            </button>
          </div>
        )}

        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={selectedImage ? "Describe what to solve in this image..." : "Describe a Cambridge STEM concept (or upload a math problem)..."}
            className="w-full pl-4 pr-24 py-4 rounded-xl border border-slate-700 bg-slate-800 focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none shadow-inner text-slate-200 placeholder:text-slate-500 min-h-[60px] max-h-[120px]"
            rows={2}
            disabled={isLoading}
          />
          
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload} 
            />
            
            <button
              onClick={triggerFileInput}
              disabled={isLoading}
              className={`p-2 rounded-lg transition-colors ${selectedImage ? 'text-emerald-400 bg-emerald-950/30' : 'text-slate-400 hover:text-indigo-300 hover:bg-slate-700'}`}
              title="Upload math problem image"
            >
              <ImageIcon size={20} />
            </button>

            <button
              onClick={handleSubmit}
              disabled={(!prompt.trim() && !selectedImage) || isLoading}
              className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors shadow-lg shadow-indigo-900/20"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputArea;