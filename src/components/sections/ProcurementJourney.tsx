"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface ProcurementJourneyProps {
  isMobile?: boolean;
  className?: string;
}

// High-quality Procurement Journey illustration for Vikareta B2B Marketplace
export function ProcurementJourney({ isMobile = false, className = '' }: ProcurementJourneyProps) {
  const truckWidth = isMobile ? 100 : 120;
  const shipWidth = isMobile ? 140 : 180;
  const planeWidth = isMobile ? 100 : 120;

  return (
    <div className={`relative w-full min-h-[60vh] md:min-h-[70vh] overflow-hidden ${className}`}>
      {/* Sky gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-blue-100 to-blue-50" />

      {/* Ocean waves at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 md:h-40 overflow-hidden">
        {/* Wave layers with different speeds */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-full"
          animate={{ x: [0, -60, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        >
          <svg className="absolute bottom-0 w-full h-32 md:h-40" viewBox="0 0 1200 200" preserveAspectRatio="none">
            <path d="M0,120 C300,100 600,140 900,120 C1050,110 1200,130 1200,120 L1200,200 L0,200 Z" fill="url(#oceanWave1)" />
          </svg>
        </motion.div>

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-full"
          animate={{ x: [0, 40, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear', delay: 1 }}
        >
          <svg className="absolute bottom-0 w-full h-32 md:h-40" viewBox="0 0 1200 200" preserveAspectRatio="none">
            <path d="M0,140 C250,120 500,160 750,140 C900,130 1050,150 1200,140 L1200,200 L0,200 Z" fill="url(#oceanWave2)" />
          </svg>
        </motion.div>

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-full"
          animate={{ x: [0, -80, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear', delay: 2 }}
        >
          <svg className="absolute bottom-0 w-full h-32 md:h-40" viewBox="0 0 1200 200" preserveAspectRatio="none">
            <path d="M0,160 C200,140 400,180 600,160 C800,140 1000,170 1200,160 L1200,200 L0,200 Z" fill="url(#oceanWave3)" />
          </svg>
        </motion.div>

        {/* Ocean gradients */}
        <svg className="absolute bottom-0 w-full h-32 md:h-40" viewBox="0 0 1200 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="oceanWave1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1e40af" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="oceanWave2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="oceanWave3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Connection paths */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Ground path: Warehouse → City */}
        <path
          d={isMobile ? 'M 80 280 C 120 260, 200 270, 280 260' : 'M 120 320 C 200 300, 400 310, 600 300'}
          stroke="url(#pathGradient)"
          strokeWidth="3"
          fill="none"
          strokeDasharray="8,4"
          opacity="0.7"
        />

        {/* Ocean path: Port → International */}
        <path
          d={isMobile ? 'M 200 320 C 180 330, 120 325, 60 320' : 'M 400 360 C 300 370, 150 365, 50 360'}
          stroke="url(#oceanWave1)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="6,3"
          opacity="0.5"
        />

        {/* Air path: Port → Global */}
        <path
          d={isMobile ? 'M 200 200 C 180 150, 120 120, 60 100' : 'M 400 240 C 300 180, 150 140, 50 120'}
          stroke="url(#pathGradient)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="4,2"
          opacity="0.4"
        />
      </svg>

      {/* Warehouse/Factory - Left side */}
      <motion.div
        className="absolute left-4 lg:left-8 bottom-24 lg:bottom-28 z-20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <svg width={isMobile ? '140' : '180'} height={isMobile ? '80' : '100'} viewBox="0 0 180 100" className="text-gray-700">
          {/* Factory building */}
          <rect x="20" y="40" width="50" height="50" fill="currentColor" opacity="0.9" />
          <rect x="80" y="50" width="40" height="40" fill="currentColor" opacity="0.95" />
          <rect x="130" y="35" width="25" height="55" fill="currentColor" opacity="0.85" />

          {/* Factory details */}
          <rect x="30" y="20" width="6" height="25" className="fill-gray-600" />
          <rect x="90" y="25" width="5" height="30" className="fill-gray-600" />
          <rect x="135" y="40" width="4" height="20" className="fill-gray-600" />

          {/* Windows with lights */}
          <rect x="25" y="45" width="4" height="4" className="fill-yellow-400" opacity="0.8" />
          <rect x="35" y="45" width="4" height="4" className="fill-yellow-400" opacity="0.8" />
          <rect x="25" y="55" width="4" height="4" className="fill-yellow-300" opacity="0.6" />
          <rect x="45" y="50" width="4" height="4" className="fill-yellow-400" opacity="0.8" />

          <rect x="85" y="55" width="5" height="5" className="fill-yellow-400" opacity="0.8" />
          <rect x="95" y="55" width="5" height="5" className="fill-yellow-300" opacity="0.6" />
          <rect x="85" y="70" width="5" height="5" className="fill-yellow-400" opacity="0.8" />

          {/* Loading dock */}
          <rect x="10" y="85" width="20" height="10" className="fill-gray-800" />
          <rect x="5" y="90" width="160" height="8" className="fill-gray-600" opacity="0.7" />
        </svg>
      </motion.div>

      {/* City/Marketplace - Right side */}
      <motion.div
        className="absolute right-4 lg:right-8 bottom-20 lg:bottom-24 z-20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <svg width={isMobile ? '120' : '160'} height={isMobile ? '70' : '90'} viewBox="0 0 160 90" className="text-slate-600">
          {/* City buildings */}
          <rect x="10" y="30" width="15" height="50" fill="currentColor" opacity="0.9" />
          <rect x="30" y="20" width="20" height="60" fill="currentColor" opacity="0.95" />
          <rect x="55" y="25" width="18" height="55" fill="currentColor" opacity="0.85" />
          <rect x="78" y="15" width="25" height="65" fill="currentColor" opacity="0.9" />
          <rect x="108" y="35" width="16" height="45" fill="currentColor" opacity="0.8" />
          <rect x="128" y="40" width="12" height="40" fill="currentColor" opacity="0.85" />

          {/* Building windows */}
          <rect x="12" y="35" width="3" height="3" className="fill-yellow-400" opacity="0.7" />
          <rect x="17" y="35" width="3" height="3" className="fill-yellow-400" opacity="0.7" />
          <rect x="12" y="45" width="3" height="3" className="fill-yellow-300" opacity="0.5" />
          <rect x="17" y="55" width="3" height="3" className="fill-yellow-400" opacity="0.7" />

          <rect x="32" y="25" width="4" height="4" className="fill-yellow-400" opacity="0.7" />
          <rect x="40" y="25" width="4" height="4" className="fill-yellow-400" opacity="0.7" />
          <rect x="32" y="35" width="4" height="4" className="fill-yellow-300" opacity="0.5" />
          <rect x="40" y="45" width="4" height="4" className="fill-yellow-400" opacity="0.7" />

          <rect x="80" y="20" width="5" height="5" className="fill-yellow-400" opacity="0.7" />
          <rect x="90" y="20" width="5" height="5" className="fill-yellow-400" opacity="0.7" />
          <rect x="80" y="30" width="5" height="5" className="fill-yellow-300" opacity="0.5" />
          <rect x="90" y="40" width="5" height="5" className="fill-yellow-400" opacity="0.7" />

          {/* Shopping carts/market elements */}
          <circle cx="20" cy="82" r="3" className="fill-gray-500" />
          <circle cx="25" cy="82" r="3" className="fill-gray-500" />
          <rect x="18" y="75" width="10" height="6" className="fill-gray-400" opacity="0.8" />

          <circle cx="45" cy="82" r="3" className="fill-gray-500" />
          <circle cx="50" cy="82" r="3" className="fill-gray-500" />
          <rect x="43" y="75" width="10" height="6" className="fill-gray-400" opacity="0.8" />
        </svg>
      </motion.div>

      {/* Dock/Port - Bottom center */}
      <motion.div
        className="absolute left-1/2 transform -translate-x-1/2 bottom-8 lg:bottom-12 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        <motion.svg
          width={isMobile ? '160' : '200'}
          height={isMobile ? '80' : '100'}
          viewBox="0 0 200 100"
          className="text-blue-700"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Dock structure */}
          <rect x="30" y="70" width="8" height="25" className="fill-yellow-600" />
          <rect x="25" y="25" width="16" height="70" className="fill-yellow-600" />
          <rect x="25" y="30" width="80" height="8" className="fill-yellow-600" />

          {/* Crane */}
          <rect x="110" y="20" width="6" height="60" className="fill-gray-600" />
          <rect x="100" y="15" width="26" height="8" className="fill-gray-600" />
          <rect x="95" y="10" width="6" height="15" className="fill-gray-600" />

          {/* Containers on dock */}
          <rect x="45" y="35" width="15" height="10" className="fill-red-500" opacity="0.9" />
          <rect x="65" y="35" width="15" height="10" className="fill-blue-500" opacity="0.9" />
          <rect x="85" y="35" width="15" height="10" className="fill-green-500" opacity="0.9" />

          {/* Dock lights */}
          <circle cx="35" cy="30" r="2" className="fill-yellow-400" opacity="0.8" />
          <circle cx="75" cy="30" r="2" className="fill-yellow-400" opacity="0.8" />
          <circle cx="115" cy="30" r="2" className="fill-yellow-400" opacity="0.8" />
        </motion.svg>
      </motion.div>

      {/* Animated Truck - Warehouse to City */}
      <motion.div
        className="absolute bottom-28 md:bottom-32 z-30"
        initial={{ x: isMobile ? -20 : -40, opacity: 0 }}
        animate={{
          x: [isMobile ? -20 : -40, isMobile ? 320 : 650],
          opacity: [0, 1, 1, 1, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0,
          opacity: { duration: 1, times: [0, 0.1, 0.9, 0.95, 1] }
        }}
      >
        <svg width={truckWidth} height={isMobile ? '45' : '55'} viewBox="0 0 120 55" className="text-orange-600">
          {/* Truck body */}
          <rect x="10" y="15" width="60" height="25" fill="currentColor" opacity="0.95" />
          <rect x="75" y="20" width="30" height="20" fill="currentColor" opacity="0.9" />

          {/* Truck cabin */}
          <rect x="5" y="10" width="20" height="15" fill="currentColor" opacity="0.9" />
          <rect x="15" y="5" width="8" height="10" className="fill-orange-700" />

          {/* Wheels */}
          <circle cx="20" cy="42" r="5" className="fill-gray-800" />
          <circle cx="50" cy="42" r="5" className="fill-gray-800" />
          <circle cx="85" cy="42" r="5" className="fill-gray-800" />
          <circle cx="20" cy="42" r="2.5" className="fill-gray-600" />
          <circle cx="50" cy="42" r="2.5" className="fill-gray-600" />
          <circle cx="85" cy="42" r="2.5" className="fill-gray-600" />

          {/* Cargo boxes */}
          <rect x="12" y="18" width="8" height="6" className="fill-blue-500" opacity="0.8" />
          <rect x="22" y="18" width="8" height="6" className="fill-red-500" opacity="0.8" />
          <rect x="32" y="18" width="8" height="6" className="fill-green-500" opacity="0.8" />

          {/* Headlights */}
          <circle cx="2" cy="18" r="1.5" className="fill-yellow-400" />
        </svg>
      </motion.div>

      {/* Animated Ship - Port to International */}
      <motion.div
        className="absolute bottom-12 md:bottom-16 z-25"
        initial={{ x: isMobile ? 350 : 750, opacity: 0 }}
        animate={{
          x: [isMobile ? 350 : 750, isMobile ? -150 : -250],
          opacity: [0, 1, 1, 1, 0],
          y: [0, -2, 2, -1, 0] // Gentle rocking motion
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
          opacity: { duration: 1, times: [0, 0.1, 0.9, 0.95, 1] },
          y: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
        }}
      >
        <svg width={shipWidth} height={isMobile ? '70' : '90'} viewBox="0 0 180 90" className="text-slate-700">
          {/* Ship hull */}
          <ellipse cx="90" cy="75" rx="70" ry="10" fill="currentColor" opacity="0.95" />
          <rect x="20" y="55" width="140" height="25" fill="currentColor" opacity="0.9" />

          {/* Ship superstructure */}
          <rect x="60" y="35" width="60" height="20" fill="currentColor" opacity="0.9" />
          <rect x="70" y="25" width="40" height="15" fill="currentColor" opacity="0.85" />

          {/* Ship details */}
          <rect x="40" y="58" width="8" height="12" className="fill-slate-600" />
          <rect x="60" y="58" width="8" height="12" className="fill-slate-600" />
          <rect x="80" y="58" width="8" height="12" className="fill-slate-600" />
          <rect x="100" y="58" width="8" height="12" className="fill-slate-600" />
          <rect x="120" y="58" width="8" height="12" className="fill-slate-600" />

          {/* Ship bridge */}
          <rect x="80" y="18" width="20" height="8" className="fill-slate-800" />

          {/* Containers on deck */}
          <rect x="30" y="38" width="12" height="8" className="fill-red-500" opacity="0.9" />
          <rect x="45" y="38" width="12" height="8" className="fill-blue-500" opacity="0.9" />
          <rect x="110" y="38" width="12" height="8" className="fill-green-500" opacity="0.9" />
          <rect x="125" y="38" width="12" height="8" className="fill-yellow-500" opacity="0.9" />

          {/* Ship mast and flag */}
          <rect x="88" y="8" width="4" height="35" className="fill-slate-600" />
          <rect x="92" y="8" width="8" height="6" className="fill-red-600" />

          {/* Ship lights */}
          <circle cx="25" cy="60" r="1.5" className="fill-yellow-400" opacity="0.8" />
          <circle cx="155" cy="60" r="1.5" className="fill-red-500" opacity="0.8" />
        </svg>
      </motion.div>

      {/* Animated Airplane - Port takeoff to Global landing */}
      <motion.div
        className="absolute z-40"
        initial={{ x: isMobile ? 150 : 350, y: isMobile ? 180 : 200, opacity: 0 }}
        animate={{
          x: [isMobile ? 150 : 350, isMobile ? -50 : -100],
          y: [isMobile ? 180 : 200, isMobile ? 80 : 100, isMobile ? 120 : 140],
          opacity: [0, 1, 1, 1, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
          opacity: { duration: 1, times: [0, 0.1, 0.9, 0.95, 1] }
        }}
      >
        <svg width={planeWidth} height={isMobile ? '40' : '50'} viewBox="0 0 120 50" className="text-indigo-600">
          {/* Airplane body */}
          <ellipse cx="60" cy="25" rx="40" ry="8" fill="currentColor" opacity="0.9" />
          <rect x="25" y="21" width="70" height="5" fill="currentColor" />
          <rect x="35" y="17" width="50" height="3" fill="currentColor" />

          {/* Wings */}
          <rect x="15" y="23" width="20" height="6" className="fill-indigo-700" />
          <rect x="85" y="23" width="20" height="6" className="fill-indigo-700" />

          {/* Tail */}
          <rect x="95" y="15" width="6" height="12" className="fill-indigo-700" />

          {/* Windows */}
          <circle cx="45" cy="23" r="1.5" className="fill-blue-200" />
          <circle cx="55" cy="23" r="1.5" className="fill-blue-200" />
          <circle cx="65" cy="23" r="1.5" className="fill-blue-200" />
          <circle cx="75" cy="23" r="1.5" className="fill-blue-200" />

          {/* Landing gear (down) */}
          <rect x="35" y="30" width="2" height="8" className="fill-gray-600" />
          <rect x="75" y="30" width="2" height="8" className="fill-gray-600" />
          <circle cx="36" cy="38" r="2" className="fill-gray-800" />
          <circle cx="76" cy="38" r="2" className="fill-gray-800" />
        </svg>
      </motion.div>

      {/* Animated Rupee Currency Flow */}
      {/* Rupee symbols along ground path */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`rupee-ground-${i}`}
          className="absolute bottom-32 md:bottom-36 z-35"
          initial={{ x: isMobile ? 40 : 80, opacity: 0 }}
          animate={{
            x: [isMobile ? 40 : 80, isMobile ? 260 : 580],
            opacity: [0, 1, 1, 0],
            scale: [0.8, 1, 1, 0.8]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 1.5, // Staggered timing
          }}
        >
          <div className="text-green-600 font-bold text-lg md:text-xl animate-pulse">
            ₹
          </div>
        </motion.div>
      ))}

      {/* Rupee symbols along ocean path */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`rupee-ocean-${i}`}
          className="absolute bottom-16 md:bottom-20 z-35"
          initial={{ x: isMobile ? 250 : 550, opacity: 0 }}
          animate={{
            x: [isMobile ? 250 : 550, isMobile ? 50 : 100],
            opacity: [0, 1, 1, 0],
            scale: [0.8, 1, 1, 0.8]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 3 + i * 2, // Staggered timing
          }}
        >
          <div className="text-blue-600 font-bold text-lg md:text-xl animate-pulse">
            ₹
          </div>
        </motion.div>
      ))}

      {/* Rupee symbols along air path */}
      {[...Array(2)].map((_, i) => (
        <motion.div
          key={`rupee-air-${i}`}
          className="absolute z-35"
          initial={{
            x: isMobile ? 200 : 400,
            y: isMobile ? 180 : 220,
            opacity: 0
          }}
          animate={{
            x: [isMobile ? 200 : 400, isMobile ? -50 : -100],
            y: [isMobile ? 180 : 220, isMobile ? 100 : 120],
            opacity: [0, 1, 1, 0],
            scale: [0.8, 1, 1, 0.8]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 5 + i * 3, // Staggered timing
          }}
        >
          <div className="text-purple-600 font-bold text-lg md:text-xl animate-pulse">
            ₹
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default ProcurementJourney;
