
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultsDisplay } from './components/ResultsDisplay';
import { analyzeImage } from './services/geminiService';
import type { AnalysisResult } from './types';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleImageChange = (file: File) => {
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  const handleAnalyzeClick = useCallback(async () => {
    if (!imageFile) {
      setError("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await analyzeImage(imageFile);
      setResult(analysisResult);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);
  
  const handleReset = () => {
    setImageFile(null);
    setImageUrl(null);
    setResult(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <main className="mt-8 bg-gray-800/50 rounded-2xl shadow-2xl p-6 md:p-10 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="flex flex-col items-center justify-center space-y-6">
              <ImageUploader imageUrl={imageUrl} onImageChange={handleImageChange} />
              {imageUrl && (
                <div className="flex space-x-4 w-full">
                  <button
                    onClick={handleAnalyzeClick}
                    disabled={isLoading || !imageUrl}
                    className="flex-grow bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? 'Analyzing...' : 'Analyze Image'}
                  </button>
                   <button
                    onClick={handleReset}
                    className="bg-gray-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-500 transition-colors duration-300"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center">
              <ResultsDisplay
                isLoading={isLoading}
                error={error}
                result={result}
              />
            </div>
          </div>
        </main>
        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>Powered by Gemini. For educational and informational purposes only.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
