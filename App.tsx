import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultsDisplay } from './components/ResultsDisplay';
import { AnnotatedImage } from './components/AnnotatedImage';
import { Tutorial } from './components/Tutorial';
import { ZoomControls } from './components/ZoomControls';
import { FilterControls } from './components/FilterControls';
import { Toast } from './components/Toast';
import { analyzeImage, improveAnalysis } from './services/geminiService';
import type { AnalysisResult, Mite } from './types';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isImprovingAi, setIsImprovingAi] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [mites, setMites] = useState<Mite[]>([]);
  const [isFineTuning, setIsFineTuning] = useState<boolean>(false);
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1);
  const [blurLevel, setBlurLevel] = useState<number>(0);
  const [showImprovementToast, setShowImprovementToast] = useState<boolean>(false);

  useEffect(() => {
    const tutorialSeen = localStorage.getItem('beeScanTutorialSeen');
    if (!tutorialSeen) {
      setShowTutorial(true);
    }
  }, []);

  const handleCloseTutorial = () => {
    localStorage.setItem('beeScanTutorialSeen', 'true');
    setShowTutorial(false);
  };

  const handleImageChange = (file: File) => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setResult(null);
    setError(null);
    setIsLoading(false);
    setMites([]);
    setIsFineTuning(false);
    setScale(1);
    setBlurLevel(0);
  };

  const handleAnalyzeClick = useCallback(async () => {
    if (!imageFile) {
      setError("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setMites([]);
    setIsFineTuning(false);

    try {
      const analysisResult = await analyzeImage(imageFile);
      setResult(analysisResult);
      setMites(analysisResult.mites || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);
  
  const handleReset = () => {
    setImageFile(null);
    if(imageUrl) {
        URL.revokeObjectURL(imageUrl);
    }
    setImageUrl(null);
    setResult(null);
    setError(null);
    setIsLoading(false);
    setMites([]);
    setIsFineTuning(false);
    setScale(1);
    setBlurLevel(0);
  };

  const handleAddMite = (mite: Mite) => {
    setMites(prevMites => [...prevMites, mite]);
  };

  const handleRemoveMite = (index: number) => {
    setMites(prevMites => prevMites.filter((_, i) => i !== index));
  };

  const handleFineTuneToggle = () => {
    setIsFineTuning(prev => !prev);
  }
  
  const handleZoomIn = () => setScale(s => Math.min(s * 1.2, 5));
  const handleZoomOut = () => setScale(s => Math.max(s / 1.2, 0.5));
  const handleZoomReset = () => setScale(1);

  const handleBlurChange = (level: number) => {
    setBlurLevel(level);
  };

  const handleSaveAnalysis = () => {
    if (!result) return;

    const analysisData = {
      mite_count: mites.length,
      observations: result.observations,
      mites: mites,
      analysis_date: new Date().toISOString(),
    };

    const jsonString = JSON.stringify(analysisData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    a.download = `beecan-analysis-${timestamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImproveAi = async () => {
    if (!imageFile || !result) return;
    setIsImprovingAi(true);
    setError(null);
    try {
      await improveAnalysis(imageFile, result, mites);
      setShowImprovementToast(true);
      setTimeout(() => setShowImprovementToast(false), 4000); // Hide after 4s
    } catch (err) {
      setError(err instanceof Error ? `Feedback Error: ${err.message}` : "Failed to send feedback to the AI.");
    } finally {
      setIsImprovingAi(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      {showTutorial && <Tutorial onClose={handleCloseTutorial} />}
      <Toast
        message="Thank you! The AI will learn from your feedback."
        isVisible={showImprovementToast}
        onClose={() => setShowImprovementToast(false)}
      />
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <main className="mt-8 bg-gray-800/50 rounded-2xl shadow-2xl p-6 md:p-10 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="flex flex-col space-y-4">
               {imageUrl ? (
                <>
                  <AnnotatedImage
                    imageUrl={imageUrl}
                    mites={mites}
                    onMiteAdd={handleAddMite}
                    onMiteRemove={handleRemoveMite}
                    isFineTuning={isFineTuning}
                    scale={scale}
                    blurLevel={blurLevel}
                  />
                  <div className="space-y-3 pt-1">
                    <ZoomControls
                      scale={scale}
                      onZoomIn={handleZoomIn}
                      onZoomOut={handleZoomOut}
                      onZoomReset={handleZoomReset}
                    />
                    <FilterControls 
                      blurLevel={blurLevel}
                      onBlurChange={handleBlurChange}
                    />
                  </div>
                </>
              ) : (
                <ImageUploader onImageChange={handleImageChange} />
              )}
              {imageUrl && (
                <div className="flex space-x-4 w-full pt-2">
                  <button
                    onClick={handleAnalyzeClick}
                    disabled={isLoading || !!result}
                    className="flex-grow bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? 'Analyzing...' : (result ? 'Analysis Complete' : 'Analyze Image')}
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
                mites={mites}
                isFineTuning={isFineTuning}
                onFineTuneToggle={handleFineTuneToggle}
                onSaveAnalysis={handleSaveAnalysis}
                onImproveAi={handleImproveAi}
                isImprovingAi={isImprovingAi}
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