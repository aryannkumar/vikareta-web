"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface ProcurementJourneyProps {
  isMobile?: boolean;
  className?: string;
}

// Lightweight, story-driven scene illustrating the procurement lifecycle
export function ProcurementJourney({ isMobile = false, className = '' }: ProcurementJourneyProps) {
  const prefersReducedMotion = useReducedMotion();
  const animate = !prefersReducedMotion && !isMobile;

  return (
    <div
      className={`relative aspect-[16/10] sm:aspect-[16/9] max-w-4xl mx-auto overflow-hidden rounded-2xl bg-gradient-to-br from-white/60 to-blue-50/40 dark:from-gray-800/60 dark:to-blue-900/20 border border-blue-200/30 dark:border-blue-700/30 ${className}`}
      style={{
        WebkitMaskImage:
          'radial-gradient(1200px at 50% 20%, rgba(0,0,0,1), rgba(0,0,0,0.6))',
      }}
    >
      {/* Subtle background grid */}
      <div className="absolute inset-0 opacity-[0.08] dark:opacity-[0.12]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="text-blue-900 dark:text-blue-100" />
        </svg>
      </div>

      {/* Factory (Sourcing) - Left */}
      <div className="absolute left-4 sm:left-8 bottom-10 sm:bottom-14 select-none will-change-transform">
        <svg width="190" height="120" viewBox="0 0 190 120" className="text-gray-600 dark:text-gray-400 fill-current">
          {/* Buildings */}
          <rect x="10" y="40" width="45" height="70" opacity="0.8" />
          <rect x="60" y="55" width="55" height="55" opacity="0.9" />
          <rect x="120" y="35" width="40" height="75" opacity="0.7" />
          {/* Chimney */}
          <rect x="25" y="15" width="20" height="35" className="text-gray-500" />
          {/* Smoke */}
          {!prefersReducedMotion && (
            <motion.g
              initial={{ opacity: 0.4, y: 0 }}
              animate={animate ? { y: [-6, -12, -6], opacity: [0.4, 0.7, 0.4] } : {}}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <circle cx="35" cy="10" r="6" className="text-gray-400" fill="currentColor" />
              <circle cx="42" cy="4" r="4" className="text-gray-300" fill="currentColor" />
            </motion.g>
          )}
          {/* Windows */}
          <rect x="15" y="50" width="6" height="6" className="text-amber-400" fill="currentColor" />
          <rect x="27" y="50" width="6" height="6" className="text-amber-400" fill="currentColor" />
          <rect x="70" y="66" width="8" height="8" className="text-amber-400" fill="currentColor" />
          <rect x="86" y="66" width="8" height="8" className="text-amber-400" fill="currentColor" />
        </svg>
      </div>

      {/* Truck (Logistics) moving from Factory to Port */}
      <motion.div
        className="absolute bottom-20 left-0 select-none will-change-transform"
        initial={{ x: -120, opacity: 0.9 }}
        animate={animate ? { x: ['5%', '35%', '60%'], opacity: [0.9, 1, 0.95] } : { x: '25%' }}
        transition={{ duration: 14, repeat: animate ? Infinity : 0, ease: 'linear' }}
      >
        <svg width="150" height="60" viewBox="0 0 120 48" className="text-orange-600 fill-current">
          <rect x="10" y="18" width="60" height="22" opacity="0.95" />
          <rect x="72" y="22" width="35" height="18" opacity="0.9" />
          <circle cx="28" cy="42" r="6" className="text-gray-700" fill="currentColor" />
          <circle cx="56" cy="42" r="6" className="text-gray-700" fill="currentColor" />
          <circle cx="92" cy="42" r="6" className="text-gray-700" fill="currentColor" />
        </svg>
      </motion.div>

      {/* Port + Ship (Ocean Freight) - Center */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-10 select-none will-change-transform">
        {/* Crane */}
        <svg width="240" height="120" viewBox="0 0 240 120" className="text-gray-500 fill-current">
          <line x1="30" y1="90" x2="30" y2="30" stroke="#f59e0b" strokeWidth="4" />
          <line x1="30" y1="40" x2="90" y2="40" stroke="#f59e0b" strokeWidth="4" />
          <rect x="90" y="35" width="10" height="8" className="text-amber-500" />
        </svg>

        {/* Ship */}
        <motion.div
          initial={{ x: -40, y: 0, opacity: 0.95 }}
          animate={animate ? { x: [0, 60, 0], y: [0, -2, 0] } : {}}
          transition={{ duration: 12, repeat: animate ? Infinity : 0, ease: 'easeInOut' }}
        >
          <svg width="200" height="90" viewBox="0 0 180 70" className="text-blue-700 fill-current">
            <path d="M10 40h150l-15 18H25L10 40z" opacity="0.9" />
            <rect x="136" y="28" width="18" height="12" />
            <circle cx="145" cy="23" r="4" className="text-amber-400" fill="currentColor" />
          </svg>
          {!prefersReducedMotion && (
            <motion.div
              className="mx-auto -mt-1 w-28 h-2 rounded-full bg-blue-300/50 blur-[2px]"
              animate={animate ? { scaleX: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] } : {}}
              transition={{ duration: 4, repeat: animate ? Infinity : 0, ease: 'easeInOut' }}
            />
          )}
        </motion.div>
      </div>

      {/* Air (Global Reach) */}
      <motion.div
        className="absolute top-6 left-4 sm:left-12 select-none will-change-transform"
        initial={{ x: -180, opacity: 0 }}
        animate={animate ? { x: ['-10%', '110%'], opacity: [0.9, 1, 0.9] } : { x: '20%', opacity: 1 }}
        transition={{ duration: 16, repeat: animate ? Infinity : 0, ease: 'easeInOut', delay: 2 }}
      >
        <svg width="140" height="64" viewBox="0 0 120 50" className="text-blue-600 fill-current">
          <ellipse cx="40" cy="25" rx="30" ry="8" opacity="0.95" />
          <rect x="25" y="20" width="40" height="3" />
          <rect x="34" y="16" width="26" height="3" />
          <rect x="10" y="23" width="10" height="6" />
          <rect x="13" y="19" width="6" height="4" />
        </svg>
      </motion.div>

      {/* Vikareta Hub (Marketplace) */}
      <div className="absolute right-6 sm:right-10 top-1/3 -translate-y-1/2 select-none">
        <motion.div
          className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 shadow-2xl border border-white/20 flex items-center justify-center"
          animate={animate ? { scale: [1, 1.06, 1], boxShadow: ['0 0 25px rgba(245, 158, 11, .35)', '0 0 45px rgba(245, 158, 11, .5)', '0 0 25px rgba(245, 158, 11, .35)'] } : {}}
          transition={{ duration: 4, repeat: animate ? Infinity : 0, ease: 'easeInOut' }}
        >
          {/* Minimal V mark */}
          <svg width="42" height="42" viewBox="0 0 48 48" className="text-white">
            <path d="M10 14 L22 36 L26 36 L38 14 L32 14 L24 30 L16 14 Z" fill="currentColor" />
          </svg>
        </motion.div>
      </div>

      {/* Value Flow: Rupee symbols moving to hub */}
      {Array.from({ length: prefersReducedMotion || isMobile ? 3 : 7 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-yellow-900"
          initial={{ left: '-5%', top: `${25 + (i % 4) * 12}%`, opacity: 0, scale: 0.6 }}
          animate={animate ? { left: 'calc(100% - 100px)', top: ['40%', '38%', '40%'], opacity: [0, 1, 0.2], scale: [0.6, 1, 0.6], rotate: [0, 10, -10, 0] } : { left: 'calc(75%)', top: '40%', opacity: 1 }}
          transition={{ duration: 6 + i * 0.6, repeat: animate ? Infinity : 0, delay: i * 0.5, ease: 'easeInOut' }}
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full shadow-md flex items-center justify-center text-base font-bold">₹</div>
        </motion.div>
      ))}

      {/* Analytics bars near hub */}
      <div className="absolute right-4 sm:right-10 top-1/3 translate-y-20 flex gap-2">
        {[10, 16, 12, 20].map((h, idx) => (
          <motion.div
            key={idx}
            className="w-2 sm:w-2.5 rounded bg-blue-500/70"
            initial={{ height: h }}
            animate={animate ? { height: [h * 0.6, h, h * 0.8, h], opacity: [0.7, 1, 0.9, 1] } : { height: h }}
            transition={{ duration: 3 + idx * 0.4, repeat: animate ? Infinity : 0, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Ocean strip at bottom */}
      <div className="absolute left-0 right-0 bottom-0 h-16 bg-gradient-to-t from-blue-400/25 to-blue-300/15 pointer-events-none" />
    </div>
  );
}

export default ProcurementJourney;
