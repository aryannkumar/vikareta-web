import React, { useState } from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  showText?: boolean;
  priority?: boolean;
}

export function Logo({ className = 'h-12 w-auto', showText = false, priority = false }: LogoProps) {
  const [imageError, setImageError] = useState(false);

  // Extract height from className for dynamic sizing
  const getImageSize = (className: string) => {
    const heightMatch = className.match(/h-(\d+)/);
    if (heightMatch) {
      const size = parseInt(heightMatch[1]) * 4; // Convert Tailwind h-X to pixels (X * 0.25rem * 16)
      return Math.max(48, Math.min(240, size)); // Clamp between 48-240px for better visibility
    }
    return 48; // Default size - larger than before
  };

  const imageSize = getImageSize(className);

  // Fallback SVG logo with premium design - no background circle
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
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Main logo shape - Modern V without background */}
      <g transform="translate(20 16)">
        {/* V shape with gradient */}
        <path 
          d="M8 12 L22 52 L28 52 L42 12 L36 12 L26 44 L14 12 Z" 
          fill="url(#primaryGradient)" 
          filter="url(#glow)"
        />
        
        {/* Accent dot */}
        <circle cx="44" cy="16" r="4" fill="url(#accentGradient)" />
        
        {/* Underline accent */}
        <rect x="8" y="58" width="34" height="4" rx="2" fill="url(#accentGradient)" opacity="0.8" />
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
