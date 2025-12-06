import React, { useState, useRef } from 'react';
import { ProcessedImage } from '../types';
import { PRESET_PROMPTS } from '../constants';
import { generateEditedImage } from '../services/geminiService';
import { ComparisonView } from './ComparisonView';
import { Button } from './Button';
import { Wand2, RefreshCw, Trash2, Camera, Film, Zap, PenTool, Upload } from 'lucide-react';

interface EditorProps {
  imageState: ProcessedImage;
  setImageState: React.Dispatch<React.SetStateAction<ProcessedImage | null>>;
  onReset: () => void;
  onReplace: (file: File) => void;
}

export const Editor: React.FC<EditorProps> = ({ imageState, setImageState, onReset, onReplace }) => {
  const [prompt, setPrompt] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setImageState(prev => prev ? { ...prev, isLoading: true, error: null } : null);

    try {
      const resultUrl = await generateEditedImage(imageState.originalFile, prompt);
      setImageState(prev => prev ? { 
        ...prev, 
        resultUrl, 
        isLoading: false, 
        prompt 
      } : null);
    } catch (error: any) {
      setImageState(prev => prev ? { 
        ...prev, 
        isLoading: false, 
        error: error.message || "Something went wrong" 
      } : null);
    }
  };

  const handlePresetClick = (presetPrompt: string) => {
    setPrompt(presetPrompt);
    // Auto-focus logic could go here, or even auto-submit if desired
  };

  const handleReplaceClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        onReplace(file);
      }
      // Reset value so the same file can be selected again if needed
      e.target.value = '';
    }
  };

  // Icons map for presets
  const getIcon = (name: string) => {
    switch (name) {
      case 'camera': return <Camera size={16} />;
      case 'film': return <Film size={16} />;
      case 'zap': return <Zap size={16} />;
      case 'pen-tool': return <PenTool size={16} />;
      default: return <Wand2 size={16} />;
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Top Bar Actions */}
      <div className="flex justify-between items-center shrink-0">
        <h2 className="text-lg font-semibold text-white">Editor Studio</h2>
        <div className="flex items-center gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*"
          />
          <button 
            onClick={handleReplaceClick}
            className="text-sm text-gray-400 hover:text-white flex items-center gap-2 transition-colors px-3 py-1 rounded-md hover:bg-[#27272a]"
          >
            <Upload size={14} /> Replace
          </button>
          
          <div className="w-px h-4 bg-[#27272a] mx-1"></div>
          
          <button 
            onClick={onReset}
            className="text-sm text-gray-400 hover:text-red-400 flex items-center gap-2 transition-colors px-3 py-1 rounded-md hover:bg-red-400/10"
          >
            <Trash2 size={14} /> Clear
          </button>
        </div>
      </div>

      {/* Main Comparison Area */}
      {/* flex-1 ensures it fills available space. min-h-0 allows it to shrink if needed (scroll behavior). relative establishes context. */}
      {/* Increased min-h to 600px for taller view */}
      <div className="flex-1 min-h-[600px] relative w-full bg-[#18181b] rounded-2xl border border-[#27272a] overflow-hidden">
        <div className="absolute inset-0">
          <ComparisonView 
            originalUrl={imageState.originalUrl} 
            resultUrl={imageState.resultUrl} 
            isLoading={imageState.isLoading}
          />
        </div>
      </div>

      {/* Error Message */}
      {imageState.error && (
        <div className="shrink-0 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm">
          Error: {imageState.error}
        </div>
      )}

      {/* Controls Area - Sticky Bottom on Mobile, Regular on Desktop */}
      <div className="shrink-0 bg-[#18181b] border border-[#27272a] rounded-xl p-4 md:p-6 shadow-2xl">
        
        {/* Preset Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {PRESET_PROMPTS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handlePresetClick(preset.prompt)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#27272a] hover:bg-[#3f3f46] border border-[#3f3f46] hover:border-gray-500 text-xs text-gray-300 hover:text-white transition-all duration-200"
              title={preset.prompt}
            >
              {getIcon(preset.icon)}
              {preset.label}
            </button>
          ))}
        </div>

        {/* Prompt Input */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe how you want to transform the image (e.g., 'Make it look like a realistic 4k photo')"
              className="w-full bg-[#09090b] text-white border border-[#3f3f46] rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none h-[52px] leading-tight placeholder-gray-500 text-sm"
            />
            <div className="absolute right-3 top-3 text-gray-500">
              <Wand2 size={18} />
            </div>
          </div>
          <Button 
            onClick={handleGenerate} 
            disabled={!prompt.trim() || imageState.isLoading}
            isLoading={imageState.isLoading}
            className="h-[52px] min-w-[120px]"
          >
            {imageState.resultUrl ? 'Regenerate' : 'Generate'}
          </Button>
        </div>
      </div>
    </div>
  );
};