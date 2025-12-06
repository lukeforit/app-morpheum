import React, { useState, useEffect } from 'react';
import { Maximize2, Columns, ScanLine } from 'lucide-react';
import { SplitView } from './comparison/SplitView';
import { SliderView } from './comparison/SliderView';
import { SingleView } from './comparison/SingleView';

interface ComparisonViewProps {
  originalUrl: string;
  resultUrl: string | null;
  isLoading: boolean;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ originalUrl, resultUrl, isLoading }) => {
  const [viewMode, setViewMode] = useState<'split' | 'single' | 'slider'>('split');

  // Reset view mode when result is cleared
  useEffect(() => {
    if (!resultUrl) {
      setViewMode('split');
    }
  }, [resultUrl]);

  const handleDownload = () => {
    if (resultUrl) {
      const link = document.createElement('a');
      link.href = resultUrl;
      link.download = `reality-engine-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // View Toggle Button Component
  const ViewToggle = ({ mode, icon: Icon, label }: { mode: 'split' | 'single' | 'slider', icon: any, label: string }) => (
    <button 
      onClick={() => setViewMode(mode)}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
        viewMode === mode 
          ? 'bg-white text-black shadow-md' 
          : 'text-gray-300 hover:text-white hover:bg-white/10'
      }`}
    >
      <Icon size={14} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <div className="relative w-full h-full">
      {/* Loading State Overlay */}
      {isLoading && (
          <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-[#18181b]/80 backdrop-blur-sm">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-[#27272a]"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin"></div>
            </div>
            <p className="text-gray-300 animate-pulse font-medium">Processing Image...</p>
            <p className="text-gray-500 text-xs mt-2">Powered by Gemini 2.5</p>
          </div>
      )}

      {/* Floating Controls Overlay - Only visible when we have a result */}
      {resultUrl && !isLoading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-xl">
           <ViewToggle mode="split" icon={Columns} label="Split" />
           <ViewToggle mode="slider" icon={ScanLine} label="Slider" />
           <ViewToggle mode="single" icon={Maximize2} label="Single" />
        </div>
      )}

      {/* Main Content Area */}
      <div className="w-full h-full">
        {/* Empty State / Original Only */}
        {!resultUrl && !isLoading && (
           <div className="w-full h-full flex items-center justify-center p-8">
             <div className="relative w-full h-full">
               <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white z-10 border border-white/10">
                 Original
               </div>
               <img 
                 src={originalUrl} 
                 alt="Original" 
                 className="w-full h-full object-contain"
               />
             </div>
           </div>
        )}

        {/* Comparison Views */}
        {resultUrl && !isLoading && (
          <>
            {viewMode === 'split' && (
              <SplitView 
                originalUrl={originalUrl} 
                resultUrl={resultUrl} 
                onDownload={handleDownload} 
              />
            )}

            {viewMode === 'single' && (
              <SingleView 
                resultUrl={resultUrl} 
                onDownload={handleDownload} 
              />
            )}

            {viewMode === 'slider' && (
              <SliderView 
                originalUrl={originalUrl} 
                resultUrl={resultUrl} 
                onDownload={handleDownload} 
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};