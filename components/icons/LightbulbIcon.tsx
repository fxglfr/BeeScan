import React from 'react';

export const LightbulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.311a7.5 7.5 0 0 1-7.5 0c-1.42 0-2.798-.31-4.007-.906l.763-1.145a2.25 2.25 0 0 1 2.164-.925c1.244.044 2.22.684 2.957 1.233m6.09-1.233c.737-.549 1.713-1.189 2.957-1.233a2.25 2.25 0 0 1 2.164.925l.763 1.145c-1.21.596-2.587.906-4.007.906a7.5 7.5 0 0 1-7.5 0" 
    />
  </svg>
);