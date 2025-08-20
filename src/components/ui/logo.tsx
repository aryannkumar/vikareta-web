import React, { useState } from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  showText?: boolean;
  priority?: boolean;
}

export function Logo({ className = 'h-10 w-10', showText = false, priority = false }: LogoProps) {
  const [imageError, setImageError] = useState(false);

  // Extract height from className for dynamic sizing
  const getImageSize = (className: string) => {
    const heightMatch = className.match(/h-(\d+)/);
    if (heightMatch) {
      const size = parseInt(heightMatch[1]) * 4; // Convert Tailwind h-X to pixels (X * 0.25rem * 16)
      return Math.max(40, Math.min(200, size)); // Clamp between 40-200px
    }
    return 40; // Default size
  };

  const imageSize = getImageSize(className);

  // Fallback SVG logo with premium design
  const FallbackLogo = () => (
    <svg 
      className={className} 
      viewBox="0 0 96 96" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      role="img" 
      aria-label="Vikareta"
    >
      <defs>
        <linearGradient id="primaryGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FB923C" />
          <stop offset="50%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
        <linearGradient id="accentGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Background circle with gradient */}
      <circle cx="48" cy="48" r="44" fill="url(#primaryGradient)" opacity="0.1" />
      
      {/* Main logo shape - Modern V */}
      <g transform="translate(24 20)">
        {/* V shape with gradient */}
        <path 
          d="M8 12 L20 44 L24 44 L36 12 L32 12 L22 38 L12 12 Z" 
          fill="url(#primaryGradient)" 
          filter="url(#glow)"
        />
        
        {/* Accent dot */}
        <circle cx="38" cy="15" r="3" fill="url(#accentGradient)" />
        
        {/* Underline accent */}
        <rect x="8" y="48" width="28" height="3" rx="1.5" fill="url(#accentGradient)" opacity="0.7" />
      </g>
    </svg>
  );

  return (
    <div className={`flex items-center gap-2 ${showText ? 'space-x-3' : ''}`}>
      {!imageError ? (
        <Image
          src="/img/logo.png"
          alt="Vikareta Logo"
          width={imageSize}
          height={imageSize}
          className={`${className} object-contain logo-hover`}
          priority={priority}
          onError={() => setImageError(true)}
          onLoad={() => setImageError(false)}
        />
      ) : (
        <FallbackLogo />
      )}
      
      {showText && (
        <span className="text-2xl font-bold text-gradient-orange-blue font-lexend">
          Vikareta
        </span>
      )}
    </div>
  );
}

export default Logo;
