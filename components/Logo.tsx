import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" /> {/* Indigo 500 */}
        <stop offset="100%" stopColor="#ec4899" /> {/* Pink 500 */}
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Outer Ring Segment */}
    <path 
      d="M85 50 A 35 35 0 0 1 50 85 A 35 35 0 0 1 15 50 A 35 35 0 0 1 50 15" 
      stroke="url(#logoGradient)" 
      strokeWidth="8" 
      strokeLinecap="round"
      opacity="0.8"
    />
    
    {/* Sound Waves / E Shape */}
    <path 
      d="M40 35 L40 65 M55 42 L55 58 M70 28 L70 45" 
      stroke="white" 
      strokeWidth="6" 
      strokeLinecap="round" 
    />
    
    {/* Sparkle Dot */}
    <circle cx="75" cy="25" r="6" fill="#ec4899" filter="url(#glow)" />
  </svg>
);
