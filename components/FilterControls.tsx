import React from 'react';
import { BlurIcon } from './icons/BlurIcon';
import { ThresholdIcon } from './icons/ThresholdIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { SaturationIcon } from './icons/SaturationIcon';
import { TemperatureIcon } from './icons/TemperatureIcon';
import { TintIcon } from './icons/TintIcon';

interface FilterControlsProps {
    blurLevel: number;
    onBlurChange: (level: number) => void;
    saturationLevel: number;
    onSaturationChange: (level: number) => void;
    temperatureLevel: number;
    onTemperatureChange: (level: number) => void;
    tintLevel: number;
    onTintChange: (level: number) => void;
    isThresholding: boolean;
    onThresholdToggle: () => void;
    thresholdLevel: number;
    onThresholdChange: (level: number) => void;
    optimalThreshold?: number;
    optimalSaturation?: number;
    optimalTemperature?: number;
    optimalTint?: number;
    onApplyAiFilter: () => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({ 
    blurLevel, 
    onBlurChange,
    saturationLevel,
    onSaturationChange,
    temperatureLevel,
    onTemperatureChange,
    tintLevel,
    onTintChange,
    isThresholding,
    onThresholdToggle,
    thresholdLevel,
    onThresholdChange,
    optimalThreshold,
    optimalSaturation,
    optimalTemperature,
    optimalTint,
    onApplyAiFilter
}) => {
    return (
        <div className="flex flex-col items-stretch justify-center gap-3 bg-gray-900/50 p-3 rounded-xl border border-gray-700 w-fit mx-auto animate-fade-in">
            {/* Blur Controls */}
            <div className="flex items-center space-x-2">
                <BlurIcon className="w-5 h-5 text-gray-400" />
                <label htmlFor="blur-slider" className="text-sm font-medium text-gray-300 w-28">Noise Reduction</label>
                <input
                    id="blur-slider"
                    type="range"
                    min="0"
                    max="5"
                    step="0.1"
                    value={blurLevel}
                    onChange={(e) => onBlurChange(parseFloat(e.target.value))}
                    className="w-32 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-sm"
                    aria-label="Noise Reduction slider"
                />
                <span className="text-sm font-medium w-10 text-center tabular-nums text-gray-300">{blurLevel.toFixed(1)}</span>
            </div>

            {/* Saturation Controls */}
            <div className="flex items-center space-x-2">
                <SaturationIcon className="w-5 h-5 text-gray-400" />
                <label htmlFor="saturation-slider" className="text-sm font-medium text-gray-300 w-28">Saturation</label>
                <input
                    id="saturation-slider"
                    type="range"
                    min="0"
                    max="200"
                    step="1"
                    value={saturationLevel}
                    onChange={(e) => onSaturationChange(parseInt(e.target.value, 10))}
                    className="w-32 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-sm"
                    aria-label="Saturation slider"
                />
                <span className="text-sm font-medium w-10 text-center tabular-nums text-gray-300">{saturationLevel}%</span>
            </div>

            {/* Temperature Controls */}
            <div className="flex items-center space-x-2">
                <TemperatureIcon className="w-5 h-5 text-gray-400" />
                <label htmlFor="temperature-slider" className="text-sm font-medium text-gray-300 w-28">Temperature</label>
                <input
                    id="temperature-slider"
                    type="range"
                    min="-100"
                    max="100"
                    step="1"
                    value={temperatureLevel}
                    onChange={(e) => onTemperatureChange(parseInt(e.target.value, 10))}
                    className="w-32 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-sm"
                    aria-label="Temperature slider"
                />
                <span className={`text-sm font-medium w-10 text-center tabular-nums ${temperatureLevel > 0 ? 'text-orange-400' : temperatureLevel < 0 ? 'text-blue-400' : 'text-gray-300'}`}>{temperatureLevel}</span>
            </div>

            {/* Tint Controls */}
            <div className="flex items-center space-x-2">
                <TintIcon className="w-5 h-5 text-gray-400" />
                <label htmlFor="tint-slider" className="text-sm font-medium text-gray-300 w-28">Tint</label>
                <input
                    id="tint-slider"
                    type="range"
                    min="-100"
                    max="100"
                    step="1"
                    value={tintLevel}
                    onChange={(e) => onTintChange(parseInt(e.target.value, 10))}
                    className="w-32 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-sm"
                    aria-label="Tint slider"
                />
                <span className={`text-sm font-medium w-10 text-center tabular-nums ${tintLevel > 0 ? 'text-pink-400' : tintLevel < 0 ? 'text-green-400' : 'text-gray-300'}`}>{tintLevel}</span>
            </div>

            {/* Threshold Controls */}
            <div className="flex items-center space-x-2">
                <ThresholdIcon className="w-5 h-5 text-gray-400" />
                <label htmlFor="threshold-toggle" className="text-sm font-medium text-gray-300 w-28">Threshold Mask</label>
                <label htmlFor="threshold-toggle-input" className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input type="checkbox" id="threshold-toggle-input" className="sr-only" checked={isThresholding} onChange={onThresholdToggle} />
                        <div className="block bg-gray-600 w-10 h-6 rounded-full"></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isThresholding ? 'transform translate-x-4 bg-yellow-400' : ''}`}></div>
                    </div>
                </label>
                <input
                    id="threshold-slider"
                    type="range"
                    min="0"
                    max="255"
                    step="1"
                    value={thresholdLevel}
                    onChange={(e) => onThresholdChange(parseInt(e.target.value, 10))}
                    className="w-20 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-sm disabled:opacity-50"
                    aria-label="Threshold level slider"
                    disabled={!isThresholding}
                />
                <span className={`text-sm font-medium w-10 text-center tabular-nums ${isThresholding ? 'text-gray-300' : 'text-gray-500'}`}>{thresholdLevel}</span>
            </div>
            
            {/* AI Auto Filter Button */}
            {optimalThreshold !== undefined && (
                <div className="border-t border-gray-700/50 pt-3 mt-1">
                    <button
                        onClick={onApplyAiFilter}
                        className="w-full flex items-center justify-center space-x-2 bg-teal-600/50 text-teal-200 font-semibold py-2 px-4 rounded-lg hover:bg-teal-600/80 hover:text-white transition-colors duration-300 border border-teal-500/50"
                    >
                        <SparklesIcon className="w-5 h-5" />
                        <span>Apply AI's Suggested Filter</span>
                    </button>
                </div>
            )}
        </div>
    );
};
