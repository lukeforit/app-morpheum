import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { Editor } from './components/Editor';
import { ProcessedImage } from './types';

function App() {
  const [imageState, setImageState] = useState<ProcessedImage | null>(null);

  const handleImageSelect = (file: File) => {
    // Revoke previous URL if it exists to prevent memory leaks
    if (imageState?.originalUrl) {
      URL.revokeObjectURL(imageState.originalUrl);
    }

    const url = URL.createObjectURL(file);
    setImageState({
      originalUrl: url,
      originalFile: file,
      resultUrl: null,
      prompt: '',
      isLoading: false,
      error: null
    });
  };

  const handleReset = () => {
    if (imageState?.originalUrl) {
      URL.revokeObjectURL(imageState.originalUrl);
    }
    if (imageState?.resultUrl) {
      // If resultUrl was a blob, revoke it (currently base64, so not needed strictly but good practice if logic changes)
    }
    setImageState(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b]">
      <Header />
      
      <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!imageState ? (
          <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8">
            <div className="text-center space-y-4 max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
                Turn Game Specs into <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  Reality Specs
                </span>
              </h1>
              <p className="text-lg text-gray-400">
                Upload your game screenshots or photos and use AI to transform them into photorealistic masterpieces, apply filters, or edit elements with simple text prompts.
              </p>
            </div>
            
            <ImageUploader onImageSelect={handleImageSelect} />
            
            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 w-full max-w-4xl text-center">
               <div className="p-4 rounded-xl bg-[#18181b] border border-[#27272a]">
                 <div className="text-indigo-400 font-bold mb-2">Game to Reality</div>
                 <p className="text-xs text-gray-500">Transform low-poly or stylized game shots into 8k realistic photos.</p>
               </div>
               <div className="p-4 rounded-xl bg-[#18181b] border border-[#27272a]">
                 <div className="text-purple-400 font-bold mb-2">Smart Editing</div>
                 <p className="text-xs text-gray-500">Add or remove objects, change lighting, and apply styles with text.</p>
               </div>
               <div className="p-4 rounded-xl bg-[#18181b] border border-[#27272a]">
                 <div className="text-pink-400 font-bold mb-2">Gemini 2.5 Flash</div>
                 <p className="text-xs text-gray-500">Powered by Google's latest vision-language model for speed and accuracy.</p>
               </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0 animate-in fade-in zoom-in duration-300">
            <Editor 
              imageState={imageState} 
              setImageState={setImageState}
              onReset={handleReset}
              onReplace={handleImageSelect}
            />
          </div>
        )}
      </main>

      <footer className="py-6 text-center text-sm text-gray-600 border-t border-[#27272a] mt-auto">
        <p>© 2025 RealityEngine. Built with Gemini API & React.</p>
      </footer>
    </div>
  );
}

export default App;