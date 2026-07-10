import React, { useRef, useEffect, useCallback, useState } from 'react';
import type { Mite } from '../types';

interface AnnotatedImageProps {
  imageUrl: string;
  mites: Mite[];
  onMiteAdd: (mite: Mite) => void;
  onMiteRemove: (index: number) => void;
  isFineTuning: boolean;
  scale: number;
  blurLevel: number;
  saturationLevel: number;
  temperatureLevel: number;
  tintLevel: number;
  isThresholding: boolean;
  thresholdLevel: number;
  focusCenter?: { x: number; y: number };
}

export const AnnotatedImage: React.FC<AnnotatedImageProps> = ({ imageUrl, mites, onMiteAdd, onMiteRemove, isFineTuning, scale, blurLevel, saturationLevel, temperatureLevel, tintLevel, isThresholding, thresholdLevel, focusCenter }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const mouseDownPos = useRef({x: 0, y: 0});
  
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });
  
  const drawImage = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width: canvasWidth, height: canvasHeight } = canvas.getBoundingClientRect();

    if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
    }

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = canvas.width / canvas.height;

    let drawWidth = canvas.width;
    let drawHeight = canvas.height;
    let offsetX = 0;
    let offsetY = 0;

    if (imgRatio > canvasRatio) {
      drawHeight = canvas.width / imgRatio;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawWidth = canvas.height * imgRatio;
      offsetX = (canvas.width - drawWidth) / 2;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

    if (isThresholding || temperatureLevel !== 0 || tintLevel !== 0) {
      const imageData = ctx.getImageData(offsetX, offsetY, drawWidth, drawHeight);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        // Apply Temperature (Warmth: Yellow vs Blue)
        if (temperatureLevel !== 0) {
          r += temperatureLevel;
          b -= temperatureLevel;
        }

        // Apply Tint (Green vs Magenta)
        if (tintLevel !== 0) {
          g += tintLevel;
          r -= tintLevel / 2;
          b -= tintLevel / 2;
        }

        // Clamp values
        r = Math.min(255, Math.max(0, r));
        g = Math.min(255, Math.max(0, g));
        b = Math.min(255, Math.max(0, b));

        if (isThresholding) {
          const brightness = (r + g + b) / 3;
          const color = brightness >= thresholdLevel ? 255 : 0;
          data[i] = color;
          data[i + 1] = color;
          data[i + 2] = color;
        } else {
          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;
        }
      }
      ctx.putImageData(imageData, offsetX, offsetY);
    }
  }, [isThresholding, thresholdLevel, temperatureLevel, tintLevel]);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    img.onload = () => {
      imageRef.current = img;
      drawImage();
    };
  }, [imageUrl, drawImage]);

  useEffect(() => {
    drawImage();
  }, [blurLevel, saturationLevel, temperatureLevel, tintLevel, isThresholding, thresholdLevel, drawImage]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resizeObserver = new ResizeObserver(() => {
      drawImage();
    });
    resizeObserver.observe(canvas);
    return () => resizeObserver.disconnect();
  }, [drawImage]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (viewport && scale > 1 && focusCenter) {
      const scrollX = (focusCenter.x / 100) * viewport.scrollWidth - viewport.clientWidth / 2;
      const scrollY = (focusCenter.y / 100) * viewport.scrollHeight - viewport.clientHeight / 2;
      viewport.scrollTo({ left: scrollX, top: scrollY, behavior: 'smooth' });
    } else if (scale === 1 && viewport) {
      viewport.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
    }
  }, [scale, focusCenter]);
  
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const dist = Math.sqrt(
      Math.pow(e.clientX - mouseDownPos.current.x, 2) + 
      Math.pow(e.clientY - mouseDownPos.current.y, 2)
    );

    // Only register a click if the mouse hasn't moved much (i.e. it's not a pan)
    if (dist > 5) {
      return;
    }

    if (!isFineTuning) return;

    const viewport = e.currentTarget;
    const rect = viewport.getBoundingClientRect();
    
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const contentX = clickX + viewport.scrollLeft;
    const contentY = clickY + viewport.scrollTop;

    const contentWidth = viewport.scrollWidth;
    const contentHeight = viewport.scrollHeight;
    
    const x = (contentX / contentWidth) * 100;
    const y = (contentY / contentHeight) * 100;

    if (x >= 0 && x <= 100 && y >= 0 && y <= 100) {
      onMiteAdd({ x, y });
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    mouseDownPos.current = { x: e.clientX, y: e.clientY };

    if (isFineTuning || !viewportRef.current || scale <= 1) return;
    e.preventDefault();
    setIsPanning(true);
    setPanStart({
      x: e.clientX,
      y: e.clientY,
      scrollLeft: viewportRef.current.scrollLeft,
      scrollTop: viewportRef.current.scrollTop,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanning || !viewportRef.current) return;
    e.preventDefault();
    const dx = e.clientX - panStart.x;
    const dy = e.clientY - panStart.y;
    viewportRef.current.scrollLeft = panStart.scrollLeft - dx;
    viewportRef.current.scrollTop = panStart.scrollTop - dy;
  };

  const handleMouseUpOrLeave = () => {
    setIsPanning(false);
  };

  const getCursorClass = () => {
    if (isFineTuning) return 'cursor-crosshair';
    if (isPanning) return 'cursor-grabbing';
    if (scale > 1) return 'cursor-grab';
    return '';
  };

  const viewportClasses = `relative w-full aspect-square overflow-auto rounded-lg bg-gray-900/50 ${getCursorClass()}`;

  return (
    <div
      ref={viewportRef}
      className={viewportClasses}
      onClick={handleImageClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
    >
      <div 
        className="relative" 
        style={{ width: `${scale * 100}%`, height: `${scale * 100}%` }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ filter: `blur(${blurLevel}px) saturate(${saturationLevel}%)`}}
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
