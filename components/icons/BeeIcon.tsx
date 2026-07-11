import React from 'react';

export const BeeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    fill="none"
    {...props}
  >
    {/* Shield Background */}
    <path 
      d="M32 4 L56 16 V38 C56 48 46 56 32 60 C18 56 8 48 8 38 V16 Z" 
      fill="#111827" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinejoin="round"
    />
    
    {/* Subtle Shield Highlight */}
    <path 
      d="M32 6 L53 17 V37 C53 45 44 53 32 57 V6 Z" 
      fill="#1F2937" 
      opacity="0.5"
    />

    {/* The AI Scanning Laser (Targeting the mite) */}
    <line x1="24" y1="22" x2="42" y2="42" stroke="#10B981" strokeWidth="2" strokeDasharray="3,2" />
    <line x1="28" y1="28" x2="42" y2="42" stroke="#10B981" strokeWidth="1" strokeDasharray="2,2" opacity="0.6" />

    {/* Targeting Reticle around Mite */}
    <circle cx="42" cy="42" r="10" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4,2" fill="none" />
    <path d="M42 29 V33" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M42 51 V55" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M29 42 H33" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M51 42 H55" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />

    {/* Varroa Mite (The enemy, crab-like oval parasite) */}
    {/* Legs */}
    <path d="M35 39 Q32 36 29 38" stroke="#991B1B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M34 42 Q30 41 28 44" stroke="#991B1B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M35 45 Q31 46 30 50" stroke="#991B1B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    
    <path d="M49 39 Q52 36 55 38" stroke="#991B1B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M50 42 Q54 41 56 44" stroke="#991B1B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M49 45 Q53 46 54 50" stroke="#991B1B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    
    {/* Mite Body */}
    <ellipse cx="42" cy="42" rx="7" ry="5.5" fill="#7F1D1D" stroke="#EF4444" strokeWidth="1.5" />
    <ellipse cx="42" cy="40.5" rx="5" ry="3.5" fill="#991B1B" />
    
    {/* Combat Strike (Slash / Energy Spark hitting the mite) */}
    <path d="M33 33 L41 41 M41 33 L33 41" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
    <path d="M36 36 L48 48" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="42" cy="42" r="3" fill="#FBBF24" opacity="0.9" />

    {/* Majestic Fighting Bee (Swooping down from top left) */}
    {/* Legs */}
    <path d="M20 28 L17 33" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 29 L22 35" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
    <path d="M28 28 L27 34" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />

    {/* Abdomen (with golden and dark stripes) */}
    <path 
      d="M26 24 C31 26 36 29 40 31 C42 32 43 31 43 29 C42 27 38 24 33 21 C29 19 27 21 26 24 Z" 
      fill="#FBBF24" 
      stroke="#D97706" 
      strokeWidth="1"
    />
    {/* Stripes on Abdomen */}
    <path d="M29 22.5 L31.5 27" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M32.5 24 L35 28.5" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M36 25.5 L38.5 29.8" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" />
    {/* Sharp Stinger aiming at the mite */}
    <path d="M40 31 L45 34 L42 29 Z" fill="#111827" stroke="#D97706" strokeWidth="0.5" />

    {/* Thorax (fuzzy middle section) */}
    <ellipse cx="22" cy="22" rx="5.5" ry="4.5" fill="#D97706" stroke="#B45309" strokeWidth="1" />
    <ellipse cx="21" cy="22" rx="4" ry="3.5" fill="#F59E0B" />

    {/* Head */}
    <circle cx="16" cy="19" r="3.5" fill="#1F2937" />
    <circle cx="15" cy="18" r="1.5" fill="#E5E7EB" opacity="0.3" />
    {/* Antennae */}
    <path d="M15 16 Q13 12 9 13" stroke="#1F2937" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    <path d="M16 16 Q16 11 13 10" stroke="#1F2937" strokeWidth="1.2" strokeLinecap="round" fill="none" />

    {/* Wings (Glowing / translucent blue) */}
    {/* Back Wing */}
    <path 
      d="M21 18 C19 10 27 6 29 11 C30 14 26 18 23 19 Z" 
      fill="#E0F2FE" 
      stroke="#38BDF8" 
      strokeWidth="1" 
      opacity="0.7" 
    />
    {/* Front Wing */}
    <path 
      d="M23 19 C21 8 32 4 34 10 C35 14 29 20 25 21 Z" 
      fill="#F0F9FF" 
      stroke="#0284C7" 
      strokeWidth="1.2" 
      opacity="0.9" 
    />
  </svg>
);
