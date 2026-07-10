import React from 'react';

export const SaturationIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    <path d="M12 22V2.69" />
    <path d="M12 22a8 8 0 0 1-8-8c0-2.21.89-4.21 2.34-5.66L12 2.69" />
  </svg>
);
