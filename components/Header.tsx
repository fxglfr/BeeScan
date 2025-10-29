
import React from 'react';
import { BeeIcon } from './icons/BeeIcon';

export const Header: React.FC = () => {
  return (
    <header className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left space-y-2 sm:space-y-0 sm:space-x-4">
      <BeeIcon className="w-12 h-12 text-yellow-400" />
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-yellow-400 tracking-tight">
          BeeScan
        </h1>
        <p className="text-gray-400 mt-1">AI-Powered Varroa Mite Detection</p>
      </div>
    </header>
  );
};
