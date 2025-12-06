import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSelect(e.target.files[0]);
    }
  };

  const validateAndSelect = (file: File) => {
    if (file.type.startsWith('image/')) {
      onImageSelect(file);
    } else {
      alert("Please select a valid image file.");
    }
  };

  return (
    <div 
      className={`relative group w-full max-w-2xl mx-auto h-80 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden
        ${isDragging 
          ? 'border-indigo-500 bg-indigo-500/10' 
          : 'border-[#3f3f46] hover:border-gray-400 bg-[#18181b]'
        }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*"
      />
      
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="flex flex-col items-center gap-4 text-center p-6 z-10">
        <div className={`p-4 rounded-full transition-transform duration-300 ${isDragging ? 'scale-110 bg-indigo-500/20 text-indigo-400' : 'bg-[#27272a] text-gray-400 group-hover:text-white'}`}>
          {isDragging ? <Upload size={32} /> : <ImageIcon size={32} />}
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">Upload or drop your image</h3>
          <p className="text-gray-400 text-sm max-w-xs">
            Supports JPG, PNG, WEBP. Best results with game screenshots or high-contrast photos.
          </p>
        </div>
        <button className="px-4 py-2 bg-[#27272a] rounded-lg text-sm font-medium text-white group-hover:bg-[#3f3f46] transition-colors mt-2">
          Select File
        </button>
      </div>
    </div>
  );
};