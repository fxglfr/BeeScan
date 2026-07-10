import React from 'react';

export const ThresholdIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor" 
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m-9-9h18" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 018-8v0a8 8 0 018 8v0a8 8 0 01-8 8v0a8 8 0 01-8-8z" clipPath="url(#clip0)"/>
        <defs>
            <clipPath id="clip0">
                <path d="M4 4h8v16H4z" />
            </clipPath>
        </defs>
    </svg>
);
