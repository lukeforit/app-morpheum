import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '../Button';

interface SingleViewProps {
  resultUrl: string;
  onDownload: () => void;
}

export const SingleView: React.FC<SingleViewProps> = ({ resultUrl, onDownload }) => {
  return (
    <div className="relative w-full h-full overflow-hidden group flex items-center justify-center">
       <img src={resultUrl} alt="Generated" className="w-full h-full object-contain max-h-[75vh]" />
       <div className="absolute top-4 left-4 bg-indigo-600/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white z-20 pointer-events-none shadow-lg shadow-indigo-500/20 border border-indigo-400/20">Generated Result</div>
       <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30">
          <Button variant="primary" onClick={onDownload} icon={<Download size={16} />}>Download</Button>
        </div>
    </div>
  );
};