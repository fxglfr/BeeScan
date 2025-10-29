
import React, { useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  imageUrl: string | null;
  onImageChange: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ imageUrl, onImageChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageChange(event.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full aspect-square bg-gray-900/70 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center p-4 transition-all duration-300 hover:border-yellow-400 hover:bg-gray-800">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/jpeg, image/png, image/webp"
      />
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Hive inspection board"
          className="max-w-full max-h-full object-contain rounded-md"
        />
      ) : (
        <div
          className="text-center cursor-pointer space-y-3"
          onClick={handleUploadClick}
        >
          <UploadIcon className="w-12 h-12 mx-auto text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-300">
            Upload Lange Photo
          </h3>
          <p className="text-sm text-gray-500">
            Click to select or drag & drop an image
          </p>
        </div>
      )}
    </div>
  );
};
