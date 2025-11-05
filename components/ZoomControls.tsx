import React from 'react';
import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';
import { ExpandIcon } from './icons/ExpandIcon';

interface ZoomControlsProps {
    scale: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onZoomReset: () => void;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({ scale, onZoomIn, onZoomOut, onZoomReset }) => {
    return (
        <div className="flex items-center justify-center space-x-2 bg-gray-900/50 p-2 rounded-full border border-gray-700 w-fit mx-auto">
            <button 
                onClick={onZoomOut}
                className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                aria-label="Zoom out"
            >
                <MinusIcon className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium w-12 text-center tabular-nums">{Math.round(scale * 100)}%</span>
             <button 
                onClick={onZoomIn}
                className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                aria-label="Zoom in"
            >
                <PlusIcon className="w-5 h-5" />
            </button>
            <div className="border-l border-gray-600 h-5 mx-1"></div>
             <button 
                onClick={onZoomReset}
                className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                aria-label="Reset zoom"
            >
                <ExpandIcon className="w-5 h-5" />
            </button>
        </div>
    );
};
