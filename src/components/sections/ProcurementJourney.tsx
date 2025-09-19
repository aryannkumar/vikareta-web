"use client";

import React from 'react';

interface ProcurementJourneyProps {
  isMobile?: boolean;
  className?: string;
}

// Simple, clean procurement illustration for homepage
export function ProcurementJourney({ isMobile = false, className = '' }: ProcurementJourneyProps) {

  return (
    <div
      className={`relative w-full min-h-[50vh] overflow-hidden ${className}`}
    >
      {/* Clean background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-orange-50/30" />
      
      {/* Factory - Left Side */}
      <div className="absolute left-4 lg:left-8 bottom-16 lg:bottom-20 z-10">
        <div>
          <svg 
            width={isMobile ? "160" : "200"} 
            height={isMobile ? "100" : "120"} 
            viewBox="0 0 200 120" 
            className="text-gray-600"
          >
            {/* Main factory building */}
            <rect x="20" y="50" width="60" height="60" fill="currentColor" opacity="0.8" />
            <rect x="90" y="60" width="45" height="50" fill="currentColor" opacity="0.9" />
            <rect x="145" y="45" width="30" height="65" fill="currentColor" opacity="0.7" />
            
            {/* Simple chimneys */}
            <rect x="35" y="25" width="8" height="30" className="fill-gray-500" />
            <rect x="105" y="30" width="6" height="35" className="fill-gray-500" />
            
            {/* Factory windows */}
            <rect x="28" y="65" width="6" height="6" className="fill-amber-400" />
            <rect x="38" y="65" width="6" height="6" className="fill-amber-400" />
            <rect x="28" y="75" width="6" height="6" className="fill-amber-300" />
            <rect x="50" y="70" width="6" height="6" className="fill-amber-400" />
            <rect x="98" y="70" width="8" height="8" className="fill-amber-400" />
            <rect x="110" y="70" width="8" height="8" className="fill-amber-300" />
            <rect x="98" y="85" width="8" height="8" className="fill-amber-400" />
            
            {/* Loading dock */}
            <rect x="8" y="95" width="20" height="15" className="fill-orange-600" opacity="0.8" />
          </svg>
        </div>
      </div>

      {/* Simple Truck - Static Position */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-24 lg:bottom-28 z-20">
        <svg 
          width={isMobile ? "120" : "140"} 
          height={isMobile ? "50" : "60"} 
          viewBox="0 0 140 60" 
          className="text-orange-600"
        >
          {/* Truck body */}
          <rect x="15" y="20" width="70" height="25" fill="currentColor" opacity="0.9" />
          <rect x="90" y="25" width="35" height="20" fill="currentColor" opacity="0.95" />
          
          {/* Wheels */}
          <circle cx="30" cy="48" r="6" className="fill-gray-800" />
          <circle cx="55" cy="48" r="6" className="fill-gray-800" />
          <circle cx="110" cy="48" r="6" className="fill-gray-800" />
          
          {/* Wheel details */}
          <circle cx="30" cy="48" r="3" className="fill-gray-600" />
          <circle cx="55" cy="48" r="3" className="fill-gray-600" />
          <circle cx="110" cy="48" r="3" className="fill-gray-600" />
          
          {/* Cargo container */}
          <rect x="18" y="16" width="64" height="6" className="fill-orange-700" />
          
          {/* Headlights */}
          <circle cx="120" cy="30" r="2" className="fill-yellow-300" />
          <circle cx="120" cy="38" r="2" className="fill-yellow-300" />
        </svg>
      </div>

      {/* Port Infrastructure - Center Right */}
      <div className="absolute right-1/4 bottom-8 lg:bottom-12 z-10">
        <div>
          <svg 
            width={isMobile ? "180" : "220"} 
            height={isMobile ? "100" : "120"} 
            viewBox="0 0 220 120" 
            className="text-blue-600"
          >
            {/* Port crane */}
            <rect x="40" y="95" width="6" height="20" className="fill-yellow-600" />
            <rect x="37" y="30" width="12" height="75" className="fill-yellow-600" />
            <rect x="37" y="35" width="90" height="6" className="fill-yellow-600" />
            <rect x="120" y="30" width="8" height="15" className="fill-yellow-700" />
            
            {/* Container ship */}
            <rect x="140" y="70" width="70" height="30" fill="currentColor" opacity="0.9" />
            <rect x="148" y="58" width="12" height="12" className="fill-blue-800" />
            <rect x="165" y="58" width="12" height="12" className="fill-blue-800" />
            <rect x="182" y="58" width="12" height="12" className="fill-blue-800" />
            
            {/* Ship cabin */}
            <rect x="185" y="45" width="20" height="25" className="fill-blue-800" />
            <circle cx="195" cy="55" r="3" className="fill-yellow-400" />
          </svg>
        </div>
      </div>

      {/* Simple Plane - Static Position */}
      <div className="absolute right-8 lg:right-16 top-16 lg:top-20 z-30">
        <svg 
          width={isMobile ? "100" : "120"} 
          height={isMobile ? "40" : "50"} 
          viewBox="0 0 120 50" 
          className="text-indigo-600"
        >
          {/* Plane body */}
          <ellipse cx="60" cy="25" rx="40" ry="10" fill="currentColor" opacity="0.9" />
          <rect x="30" y="21" width="60" height="5" fill="currentColor" />
          <rect x="38" y="17" width="44" height="3" fill="currentColor" />
          
          {/* Wings */}
          <rect x="15" y="23" width="16" height="6" className="fill-indigo-700" />
          <rect x="22" y="18" width="10" height="5" className="fill-indigo-700" />
          
          {/* Tail */}
          <rect x="95" y="15" width="6" height="12" className="fill-indigo-700" />
          
          {/* Windows */}
          <circle cx="50" cy="23" r="1.5" className="fill-blue-200" />
          <circle cx="58" cy="23" r="1.5" className="fill-blue-200" />
          <circle cx="66" cy="23" r="1.5" className="fill-blue-200" />
        </svg>
      </div>

      {/* Simple Connection Lines - Static */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-5">
        <defs>
          <linearGradient id="simpleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="rgb(245, 158, 11)" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        
        {!isMobile && (
          <>
            {/* Factory to Port */}
            <path
              d="M 120 280 Q 280 240 420 290"
              stroke="url(#simpleGradient)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="8,4"
              opacity="0.6"
            />
            
            {/* Port to Plane area */}
            <path
              d="M 420 290 Q 520 220 600 180"
              stroke="url(#simpleGradient)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="6,3"
              opacity="0.4"
            />
          </>
        )}
      </svg>

    </div>
  );
}

export default ProcurementJourney;
