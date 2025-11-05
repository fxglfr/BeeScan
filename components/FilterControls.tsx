import React from 'react';
import { BlurIcon } from './icons/BlurIcon';

interface FilterControlsProps {
    blurLevel: number;
    onBlurChange: (level: number) => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({ blurLevel, onBlurChange }) => {
    return (
        <div className="flex items-center justify-center space-x-3 bg-gray-900/50 p-2 rounded-full border border-gray-700 w-fit mx-auto animate-fade-in">
            <BlurIcon className="w-5 h-5 ml-2 text-gray-400" />
            <label htmlFor="blur-slider" className="sr-only">Noise Reduction</label>
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
    );
};