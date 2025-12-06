import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Download, ArrowLeftRight } from 'lucide-react';
import { Button } from '../Button';

interface SliderViewProps {
  originalUrl: string;
  resultUrl: string;
  onDownload: () => void;
}

export const SliderView: React.FC<SliderViewProps> = ({ originalUrl, resultUrl, onDownload }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDrag = useCallback((clientX: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleDrag(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    handleDrag(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        handleDrag(e.clientX);
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault();
        handleDrag(e.touches[0].clientX);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleDrag]);

  return (
    <div 
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      className="relative w-full h-full overflow-hidden select-none bg-[#131315] cursor-col-resize group"
      style={{ touchAction: 'none' }}
    >
      {/* Background Pattern - z-0 */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0" style={{
        backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}></div>

      {/* Layer 1: Generated Image (Background / Right Side) - z-10 */}
      <img 
        src={resultUrl} 
        alt="Generated" 
        draggable="false"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none z-10"
      />

      {/* Layer 2: Original Image (Foreground / Left Side) - z-20 */}
      {/* We clip the image itself. The 'inset' creates the reveal effect. */}
      <img 
        src={originalUrl} 
        alt="Original" 
        draggable="false"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none z-20"
        style={{
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
          WebkitClipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
        }}
      />

      {/* Slider Handle Line - z-30 */}
      <div 
        className="absolute top-0 bottom-0 w-0.5 bg-white z-30 pointer-events-none shadow-[0_0_10px_rgba(0,0,0,0.5)]"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50 shadow-lg">
          <ArrowLeftRight size={14} className="text-white drop-shadow-md" />
        </div>
      </div>

      {/* Labels - z-40 */}
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white z-40 pointer-events-none border border-white/10 opacity-70 group-hover:opacity-100 transition-opacity">
        Original
      </div>
      <div className="absolute top-4 right-4 bg-indigo-600/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white z-40 pointer-events-none border border-white/10 opacity-70 group-hover:opacity-100 transition-opacity">
        Generated
      </div>

       {/* Download Button - z-40 */}
       <div 
         className="absolute bottom-4 right-4 z-40 pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"
         onMouseDown={(e) => e.stopPropagation()}
         onTouchStart={(e) => e.stopPropagation()}
       >
         <Button variant="primary" onClick={onDownload} icon={<Download size={16} />}>
           Download
         </Button>
       </div>
    </div>
  );
};