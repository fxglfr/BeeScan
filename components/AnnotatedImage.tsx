import React from 'react';
import type { Mite } from '../types';

interface AnnotatedImageProps {
  imageUrl: string;
  mites: Mite[];
  onMiteAdd: (mite: Mite) => void;
  onMiteRemove: (index: number) => void;
  isFineTuning: boolean;
  scale: number;
  blurLevel: number;
}

export const AnnotatedImage: React.FC<AnnotatedImageProps> = ({ imageUrl, mites, onMiteAdd, onMiteRemove, isFineTuning, scale, blurLevel }) => {
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isFineTuning) return;

    const viewport = e.currentTarget;
    const rect = viewport.getBoundingClientRect();
    
    // Calculate click position relative to the viewport's visible area
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Add scroll position to get click position on the scrollable content
    const contentX = clickX + viewport.scrollLeft;
    const contentY = clickY + viewport.scrollTop;

    // Get the total size of the scrollable content
    const contentWidth = viewport.scrollWidth;
    const contentHeight = viewport.scrollHeight;
    
    // Calculate percentage based on the full content size
    const x = (contentX / contentWidth) * 100;
    const y = (contentY / contentHeight) * 100;

    // Prevent adding mites outside of the valid range
    if (x >= 0 && x <= 100 && y >= 0 && y <= 100) {
      onMiteAdd({ x, y });
    }
  };

  const viewportClasses = `relative w-full aspect-square overflow-auto rounded-lg bg-gray-900/50 ${isFineTuning ? 'cursor-crosshair' : 'cursor-grab'}`;

  return (
    <div className={viewportClasses} onClick={handleImageClick}>
      <div 
        className="relative" 
        style={{ width: `${scale * 100}%`, height: `${scale * 100}%` }}
      >
        <img
          src={imageUrl}
          alt="Hive inspection board with annotations"
          className="w-full h-full object-contain transition-all duration-150"
          style={{ filter: `blur(${blurLevel}px)`}}
        />
        {mites.map((mite, index) => (
          <div
            key={index}
            className={`absolute w-5 h-5 rounded-full border-2 border-red-500 bg-red-500/30 -translate-x-1/2 -translate-y-1/2 transition-all ${isFineTuning ? 'cursor-pointer hover:bg-red-500/70' : ''}`}
            style={{ left: `${mite.x}%`, top: `${mite.y}%` }}
            onClick={(e) => {
              if (isFineTuning) {
                e.stopPropagation();
                onMiteRemove(index);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};