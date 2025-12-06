import React from 'react';
import { Aperture, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-4 px-6 border-b border-[#27272a] bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white">
            <Aperture size={20} />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Morpheum
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400 border border-[#27272a] px-3 py-1 rounded-full bg-[#18181b]">
          <Sparkles size={14} className="text-yellow-400" />
          <span>Powered by Gemini 2.5 Flash Image</span>
        </div>
      </div>
    </header>
  );
};