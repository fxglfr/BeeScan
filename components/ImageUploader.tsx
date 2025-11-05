import React, { useRef, useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageChange: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageChange(event.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onImageChange(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const uploaderClasses = `w-full aspect-square bg-gray-900/70 rounded-lg border-2 border-dashed flex items-center justify-center p-4 transition-all duration-300 ${isDragging ? 'border-yellow-400 bg-gray-800 scale-105' : 'border-gray-600 hover:border-yellow-400 hover:bg-gray-800'}`;

  return (
    <div 
      className={uploaderClasses}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onClick={handleUploadClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/jpeg, image/png, image/webp"
      />
      <div className="text-center cursor-pointer space-y-3">
          <UploadIcon className="w-12 h-12 mx-auto text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-300">
            {isDragging ? 'Drop Image Here' : 'Upload Lange Photo'}
          </h3>
          <p className="text-sm text-gray-500">
            Click to select or drag & drop an image
          </p>
        </div>
    </div>
  );
};