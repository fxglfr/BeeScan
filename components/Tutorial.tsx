import React, { useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { MagnifyIcon } from './icons/MagnifyIcon';
import { TargetIcon } from './icons/TargetIcon';
import { BeeIcon } from './icons/BeeIcon';

interface TutorialProps {
  onClose: () => void;
}

const tutorialSteps = [
  {
    icon: BeeIcon,
    title: 'Welcome to BeeScan!',
    content: 'This quick tutorial will guide you through using AI to detect Varroa mites on your hive inspection boards.',
  },
  {
    icon: UploadIcon,
    title: '1. Upload a Photo',
    content: 'Start by uploading a clear, top-down photo of your inspection board (lange). You can click to select a file or simply drag and drop it into the upload area.',
  },
  {
    icon: MagnifyIcon,
    title: '2. Analyze the Image',
    content: 'Once your image is uploaded, click the "Analyze Image" button. Our AI will carefully scan the photo to identify and count potential Varroa mites.',
  },
  {
    icon: TargetIcon,
    title: '3. Fine-Tune the Results',
    content: 'After analysis, you can fine-tune the count. Click "Fine-Tune Results" to add markers for any missed mites or remove any incorrect ones by clicking on them.',
  },
];

export const Tutorial: React.FC<TutorialProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const { icon: Icon, title, content } = tutorialSteps[currentStep];

  return (
    <>
      <div className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-6 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 animate-fade-in-up">
        <div className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center bg-gray-900 rounded-full border-2 border-yellow-500/50">
                <Icon className="w-8 h-8 text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
            <p className="text-gray-400 mb-6">{content}</p>
        </div>

        <div className="flex items-center justify-between">
            <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
            >
                Skip
            </button>
            <div className="flex items-center space-x-2">
                {tutorialSteps.map((_, index) => (
                    <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentStep ? 'bg-yellow-400' : 'bg-gray-600'
                        }`}
                    />
                ))}
            </div>
            <div className="flex items-center space-x-3">
                {currentStep > 0 && (
                     <button
                        onClick={handlePrev}
                        className="bg-gray-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        Prev
                    </button>
                )}
                <button
                    onClick={handleNext}
                    className="bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors"
                >
                    {currentStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
                </button>
            </div>
        </div>
      </div>
    </>
  );
};
