import React from 'react';

export const BlurIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        {...props}
    >
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M12 21.75c-4.28 0-8.22-3.41-8.22-7.65 0-4.24 3.94-10.35 8.22-10.35s8.22 6.11 8.22 10.35c0 4.24-3.94 7.65-8.22 7.65Z" 
        />
    </svg>
);