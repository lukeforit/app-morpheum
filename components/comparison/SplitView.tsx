import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '../Button';

interface SplitViewProps {
  originalUrl: string;
  resultUrl: string;
  onDownload: () => void;
}

export const SplitView: React.FC<SplitViewProps> = ({ originalUrl, resultUrl, onDownload }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full divide-y md:divide-y-0 md:divide-x divide-[#27272a]">
      <div className="relative w-full h-full overflow-hidden group">
        <img src={originalUrl} alt="Original" className="w-full h-full object-contain p-4" />
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white z-20 pointer-events-none border border-white/10">Original</div>
      </div>
      <div className="relative w-full h-full overflow-hidden group bg-[#131315]">
        <img src={resultUrl} alt="Generated" className="w-full h-full object-contain p-4" />
        <div className="absolute top-4 right-4 bg-indigo-600/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white z-40 pointer-events-none shadow-lg shadow-indigo-500/20 border border-indigo-400/20">Generated</div>
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30">
          <Button variant="primary" onClick={onDownload} icon={<Download size={16} />}>Download</Button>
        </div>
      </div>
    </div>
  );
};