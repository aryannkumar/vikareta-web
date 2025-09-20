"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface ProcurementJourneyProps {
  isMobile?: boolean;
  className?: string;
}

// Simple, clean procurement illustration for homepage
export function ProcurementJourney({ isMobile = false, className = '' }: ProcurementJourneyProps) {
  const truckWidth = isMobile ? 120 : 140;
  const planeWidth = isMobile ? 110 : 140;

  return (
    <div className={`relative w-full min-h-[52vh] md:min-h-[56vh] overflow-hidden ${className}`}>
      {/* Matte background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-white to-blue-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900" />

      {/* Story captions along the path */}
      <div className="absolute top-6 left-6 right-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs md:text-sm text-gray-600 dark:text-gray-300 z-10">
        {[
          { label: 'RFQ Posted', delay: 0 },
          { label: 'Supplier Match', delay: 0.1 },
          { label: 'Contract & Compliance', delay: 0.2 },
          { label: 'Fulfillment & Delivery', delay: 0.3 },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: s.delay }}
            className="flex items-center gap-2 justify-start md:justify-center"
          >
            <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500" />
            <span className="font-medium">{s.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Connection path with moving indicator */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="journeyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fb923c" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <path
          id="mainPath"
          d={isMobile ? 'M 30 220 C 160 160, 200 260, 330 220' : 'M 60 260 C 240 200, 420 320, 680 260'}
          stroke="url(#journeyGradient)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="10,6"
          opacity="0.5"
        />
      </svg>

      {/* Moving dot along path (simulated) */}
      <motion.div
        className="absolute bottom-36 md:bottom-40 left-6 md:left-10"
        animate={{ x: [0, isMobile ? 280 : 560] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]" />
      </motion.div>

      {/* Factory - left */}
      <motion.div className="absolute left-4 lg:left-8 bottom-16 lg:bottom-20 z-10" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <svg width={isMobile ? '160' : '200'} height={isMobile ? '100' : '120'} viewBox="0 0 200 120" className="text-gray-600">
          <rect x="20" y="50" width="60" height="60" fill="currentColor" opacity="0.8" />
          <rect x="90" y="60" width="45" height="50" fill="currentColor" opacity="0.9" />
          <rect x="145" y="45" width="30" height="65" fill="currentColor" opacity="0.7" />
          <rect x="35" y="25" width="8" height="30" className="fill-gray-500" />
          <rect x="105" y="30" width="6" height="35" className="fill-gray-500" />
          <rect x="28" y="65" width="6" height="6" className="fill-amber-400" />
          <rect x="38" y="65" width="6" height="6" className="fill-amber-400" />
          <rect x="28" y="75" width="6" height="6" className="fill-amber-300" />
          <rect x="50" y="70" width="6" height="6" className="fill-amber-400" />
          <rect x="98" y="70" width="8" height="8" className="fill-amber-400" />
          <rect x="110" y="70" width="8" height="8" className="fill-amber-300" />
          <rect x="98" y="85" width="8" height="8" className="fill-amber-400" />
          <rect x="8" y="95" width="20" height="15" className="fill-orange-600" opacity="0.8" />
        </svg>
      </motion.div>

      {/* Port - center right with gentle bobbing */}
      <motion.div className="absolute right-1/4 bottom-8 lg:bottom-12 z-10" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
        <motion.svg width={isMobile ? '180' : '220'} height={isMobile ? '100' : '120'} viewBox="0 0 220 120" className="text-blue-600" animate={{ y: [0, -3, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
          <rect x="40" y="95" width="6" height="20" className="fill-yellow-600" />
          <rect x="37" y="30" width="12" height="75" className="fill-yellow-600" />
          <rect x="37" y="35" width="90" height="6" className="fill-yellow-600" />
          <rect x="120" y="30" width="8" height="15" className="fill-yellow-700" />
          <rect x="140" y="70" width="70" height="30" fill="currentColor" opacity="0.9" />
          <rect x="148" y="58" width="12" height="12" className="fill-blue-800" />
          <rect x="165" y="58" width="12" height="12" className="fill-blue-800" />
          <rect x="182" y="58" width="12" height="12" className="fill-blue-800" />
          <rect x="185" y="45" width="20" height="25" className="fill-blue-800" />
          <circle cx="195" cy="55" r="3" className="fill-yellow-400" />
        </motion.svg>
      </motion.div>

      {/* Plane - fly across top right to left */}
      <motion.div className="absolute right-8 top-10 md:right-12 md:top-12 z-30" animate={{ x: [0, -80, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}>
        <svg width={planeWidth} height={isMobile ? '42' : '52'} viewBox="0 0 140 52" className="text-indigo-600">
          <ellipse cx="70" cy="26" rx="46" ry="10" fill="currentColor" opacity="0.9" />
          <rect x="34" y="22" width="72" height="5" fill="currentColor" />
          <rect x="42" y="18" width="56" height="3" fill="currentColor" />
          <rect x="20" y="24" width="20" height="6" className="fill-indigo-700" />
          <rect x="28" y="19" width="12" height="5" className="fill-indigo-700" />
          <rect x="110" y="16" width="6" height="12" className="fill-indigo-700" />
          <circle cx="60" cy="24" r="1.5" className="fill-blue-200" />
          <circle cx="68" cy="24" r="1.5" className="fill-blue-200" />
          <circle cx="76" cy="24" r="1.5" className="fill-blue-200" />
        </svg>
      </motion.div>

      {/* Truck - moves along bottom path */}
      <motion.div className="absolute bottom-24 md:bottom-28 z-20" initial={{ x: isMobile ? 10 : 20 }} animate={{ x: [isMobile ? 10 : 20, isMobile ? 320 : 640] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}>
        <svg width={truckWidth} height={isMobile ? '52' : '62'} viewBox="0 0 140 60" className="text-orange-600">
          <rect x="15" y="20" width="70" height="25" fill="currentColor" opacity="0.9" />
          <rect x="90" y="25" width="35" height="20" fill="currentColor" opacity="0.95" />
          <circle cx="30" cy="48" r="6" className="fill-gray-800" />
          <circle cx="55" cy="48" r="6" className="fill-gray-800" />
          <circle cx="110" cy="48" r="6" className="fill-gray-800" />
          <circle cx="30" cy="48" r="3" className="fill-gray-600" />
          <circle cx="55" cy="48" r="3" className="fill-gray-600" />
          <circle cx="110" cy="48" r="3" className="fill-gray-600" />
          <rect x="18" y="16" width="64" height="6" className="fill-orange-700" />
          <circle cx="120" cy="30" r="2" className="fill-yellow-300" />
          <circle cx="120" cy="38" r="2" className="fill-yellow-300" />
        </svg>
      </motion.div>
    </div>
  );
}

export default ProcurementJourney;
