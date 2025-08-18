import React from 'react';

export function Logo({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Vikareta">
      <defs>
        <linearGradient id="l1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FB923C" />
          <stop offset="50%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="l2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>

      <rect width="96" height="96" rx="20" fill="url(#l1)" opacity="0.12" />
      <g transform="translate(18 18)">
        <circle cx="30" cy="18" r="18" fill="url(#l1)" />
        <rect x="12" y="36" width="36" height="12" rx="3" fill="url(#l2)" />
        <path d="M8 10 L14 24 L22 8 L30 24 L36 10" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.95} />
      </g>
    </svg>
  );
}

export default Logo;
