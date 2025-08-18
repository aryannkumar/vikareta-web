"use client";

import React, { useEffect, useState } from 'react';

export default function HeroParticles({ className = '' }: { className?: string }) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReduceMotion(mq.matches);
      const handler = () => setReduceMotion(mq.matches);
      if (mq.addEventListener) mq.addEventListener('change', handler);
      else mq.addListener(handler);
      return () => {
        if (mq.removeEventListener) mq.removeEventListener('change', handler);
        else mq.removeListener(handler);
      };
    }
    return;
  }, []);

  return (
    <svg className={`pointer-events-none absolute inset-0 w-full h-full ${className} hidden sm:block`} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="g1" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#FFEEEB" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#FFF4E6" stopOpacity="0.4" />
        </linearGradient>
        <filter id="blurSmall">
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>

      <g filter="url(#blurSmall)">
        <circle cx="10%" cy="20%" r="60" fill="url(#g1)"></circle>
        <circle cx="80%" cy="10%" r="90" fill="#FFF0E0" opacity="0.6"></circle>
        <circle cx="30%" cy="70%" r="50" fill="#FFE6D1" opacity="0.55"></circle>
      </g>

      <g opacity="0.9">
        <circle cx="15%" cy="25%" r="3" fill="#FF8A00">
          {!reduceMotion && (
            <>
              <animate attributeName="cy" values="25%;22%;25%" dur="6s" repeatCount="indefinite" />
              <animate attributeName="cx" values="15%;18%;15%" dur="8s" repeatCount="indefinite" />
            </>
          )}
        </circle>

        <circle cx="78%" cy="12%" r="2.5" fill="#007BFF">
          {!reduceMotion && <animate attributeName="cy" values="12%;10%;12%" dur="7s" repeatCount="indefinite" />}
        </circle>

        <circle cx="32%" cy="68%" r="2" fill="#FF6A00">
          {!reduceMotion && <animate attributeName="cy" values="68%;70%;68%" dur="5.8s" repeatCount="indefinite" />}
        </circle>
      </g>

    </svg>
  );
}
