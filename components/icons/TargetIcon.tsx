import React from 'react';

export const TargetIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor" 
        {...props}>
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M12 9v.01M15 12h.01M9 12h.01M12 6.75a5.25 5.25 0 0 1 5.25 5.25h.01M12 6.75a5.25 5.25 0 0 0-5.25 5.25H6.75m10.5-5.25a5.25 5.25 0 0 1-5.25 5.25m5.25-5.25a5.25 5.25 0 0 0-5.25 5.25M12 6.75v-1.5m-5.25 6.75h-1.5m13.5 0h-1.5m-5.25 6.75v-1.5M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" 
        />
    </svg>
);
