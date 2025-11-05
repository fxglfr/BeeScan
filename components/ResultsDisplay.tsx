import React from 'react';
import type { AnalysisResult, Mite } from '../types';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { SaveIcon } from './icons/SaveIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';

interface ResultsDisplayProps {
  isLoading: boolean;
  error: string | null;
  result: AnalysisResult | null;
  mites: Mite[];
  isFineTuning: boolean;
  onFineTuneToggle: () => void;
  onSaveAnalysis: () => void;
  onImproveAi: () => void;
  isImprovingAi: boolean;
}

const MiteCountCard: React.FC<{ count: number }> = ({ count }) => {
  const getInfestationLevel = (c: number) => {
    if (c === 0) return { level: 'None', color: 'text-green-400', ringColor: 'ring-green-400/30' };
    if (c <= 5) return { level: 'Low', color: 'text-yellow-400', ringColor: 'ring-yellow-400/30' };
    if (c <= 15) return { level: 'Moderate', color: 'text-orange-400', ringColor: 'ring-orange-400/30' };
    return { level: 'High', color: 'text-red-500', ringColor: 'ring-red-500/30' };
  };

  const { level, color, ringColor } = getInfestationLevel(count);

  return (
    <div className="text-center">
      <p className="text-gray-400 text-sm mb-2">Detected Mite Count</p>
      <div className={`mx-auto w-32 h-32 rounded-full flex items-center justify-center bg-gray-900 ring-4 ${ringColor}`}>
        <span className={`text-6xl font-bold ${color}`}>{count}</span>
      </div>
      <p className={`mt-4 font-semibold text-lg ${color}`}>{level} Infestation</p>
    </div>
  );
};

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
    isLoading, 
    error, 
    result, 
    mites, 
    isFineTuning, 
    onFineTuneToggle, 
    onSaveAnalysis,
    onImproveAi,
    isImprovingAi,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 space-y-4">
        <SpinnerIcon className="w-12 h-12" />
        <p className="font-semibold text-lg">Analyzing your image...</p>
        <p className="text-sm">The AI is carefully counting mites. This may take a moment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-center bg-red-900/20 border border-red-500/50 rounded-lg p-6">
        <div>
          <h3 className="text-red-400 font-bold text-lg mb-2">Analysis Failed</h3>
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  if (result) {
    const hasChanges = result && JSON.stringify(result.mites.sort((a,b) => a.x - b.x)) !== JSON.stringify([...mites].sort((a,b) => a.x - b.x));
    const showImproveButton = !isFineTuning && hasChanges;

    return (
      <div className="space-y-6 animate-fade-in">
        <MiteCountCard count={mites.length} />
        <div>
          <h4 className="font-semibold text-gray-300 mb-2">AI Observations:</h4>
          <p className="text-gray-400 bg-gray-900/50 p-4 rounded-md border border-gray-700 text-sm">
            {result.observations}
          </p>
        </div>
        <div className="pt-4 border-t border-gray-700 text-center">
            <div className="flex flex-col sm:flex-row sm:justify-center gap-3">
                <button
                onClick={onFineTuneToggle}
                className={`font-bold py-2 px-6 rounded-lg transition-colors duration-300 w-full sm:w-auto ${isFineTuning ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                >
                {isFineTuning ? '✓ Done Tuning' : 'Fine-Tune Results'}
                </button>
                {showImproveButton && (
                  <button
                    onClick={onImproveAi}
                    disabled={isImprovingAi}
                    className="font-bold py-2 px-6 rounded-lg transition-colors duration-300 bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center space-x-2 w-full sm:w-auto disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    {isImprovingAi ? <SpinnerIcon className="w-5 h-5" /> : <LightbulbIcon className="w-5 h-5" />}
                    <span>{isImprovingAi ? 'Improving...' : 'Improve AI'}</span>
                  </button>
                )}
                <button
                    onClick={onSaveAnalysis}
                    className="font-bold py-2 px-6 rounded-lg transition-colors duration-300 bg-gray-600 hover:bg-gray-500 text-white flex items-center justify-center space-x-2 w-full sm:w-auto"
                >
                    <SaveIcon className="w-5 h-5" />
                    <span>Save Analysis</span>
                </button>
            </div>
            {isFineTuning && (
                <p className="text-xs text-gray-400 mt-3 animate-fade-in">
                    Click on the image to add a marker, or click a marker to remove it.
                </p>
            )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full text-center text-gray-500">
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-300">Awaiting Analysis</h3>
        <p>Upload a photo of your hive inspection board and click "Analyze Image" to begin the Varroa mite count.</p>
      </div>
    </div>
  );
};