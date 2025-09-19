"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface ProcurementJourneyProps {
  isMobile?: boolean;
  className?: string;
}

// Responsive, free-flowing procurement story across the full viewport
export function ProcurementJourney({ isMobile = false, className = '' }: ProcurementJourneyProps) {
  const prefersReducedMotion = useReducedMotion();
  const animate = !prefersReducedMotion;

  return (
    <div
      className={`relative w-full min-h-[60vh] lg:min-h-[70vh] overflow-hidden ${className}`}
    >
      {/* Dynamic background with floating elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-orange-50/20 dark:from-blue-950/20 dark:via-transparent dark:to-orange-950/10" />
      
      {/* Floating background elements */}
      {Array.from({ length: isMobile ? 8 : 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-300/40 dark:bg-blue-500/30 rounded-full"
          initial={{ 
            x: `${Math.random() * 100}%`, 
            y: `${Math.random() * 100}%`,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={animate ? {
            x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
            y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
            opacity: [0.3, 0.8, 0.3]
          } : {}}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: animate ? Infinity : 0,
            ease: 'linear',
            delay: Math.random() * 5
          }}
        />
      ))}

      {/* Factory Complex - Left Side */}
      <div className="absolute left-4 lg:left-8 bottom-16 lg:bottom-20 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <svg 
            width={isMobile ? "160" : "240"} 
            height={isMobile ? "100" : "140"} 
            viewBox="0 0 240 140" 
            className="text-gray-700 dark:text-gray-300"
          >
            {/* Main factory building */}
            <rect x="20" y="60" width="80" height="70" fill="currentColor" opacity="0.8" />
            <rect x="110" y="75" width="60" height="55" fill="currentColor" opacity="0.9" />
            <rect x="180" y="50" width="40" height="80" fill="currentColor" opacity="0.7" />
            
            {/* Chimneys */}
            <rect x="40" y="25" width="12" height="45" className="fill-gray-600 dark:fill-gray-400" />
            <rect x="130" y="35" width="10" height="50" className="fill-gray-600 dark:fill-gray-400" />
            
            {/* Animated smoke */}
            {!prefersReducedMotion && (
              <>
                <motion.g
                  animate={animate ? { 
                    y: [-5, -15, -5], 
                    opacity: [0.4, 0.8, 0.4],
                    scale: [0.8, 1.2, 0.8]
                  } : {}}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <circle cx="46" cy="20" r="8" className="fill-gray-400 dark:fill-gray-500" opacity="0.6" />
                  <circle cx="52" cy="12" r="6" className="fill-gray-300 dark:fill-gray-400" opacity="0.5" />
                  <circle cx="58" cy="8" r="4" className="fill-gray-200 dark:fill-gray-300" opacity="0.4" />
                </motion.g>
                <motion.g
                  animate={animate ? { 
                    y: [-3, -12, -3], 
                    opacity: [0.3, 0.7, 0.3],
                    scale: [0.9, 1.1, 0.9]
                  } : {}}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                >
                  <circle cx="135" cy="25" r="6" className="fill-gray-400 dark:fill-gray-500" opacity="0.5" />
                  <circle cx="140" cy="18" r="4" className="fill-gray-300 dark:fill-gray-400" opacity="0.4" />
                </motion.g>
              </>
            )}
            
            {/* Factory windows with lights */}
            <rect x="30" y="75" width="8" height="8" className="fill-amber-400" />
            <rect x="45" y="75" width="8" height="8" className="fill-amber-400" />
            <rect x="30" y="90" width="8" height="8" className="fill-amber-300" />
            <rect x="60" y="85" width="8" height="8" className="fill-amber-400" />
            <rect x="120" y="85" width="10" height="10" className="fill-amber-400" />
            <rect x="140" y="85" width="10" height="10" className="fill-amber-300" />
            <rect x="120" y="100" width="10" height="10" className="fill-amber-400" />
            
            {/* Loading dock */}
            <rect x="5" y="110" width="25" height="20" className="fill-orange-600" opacity="0.8" />
          </svg>
        </motion.div>
      </div>

      {/* Convoy of Trucks - Dynamic Movement */}
      {Array.from({ length: isMobile ? 2 : 3 }).map((_, index) => (
        <motion.div
          key={index}
          className="absolute bottom-24 lg:bottom-28 z-20"
          initial={{ x: '-15%', opacity: 0 }}
          animate={animate ? {
            x: ['0%', '25%', '50%', '75%', '95%'],
            opacity: [0, 1, 1, 1, 0]
          } : { x: `${20 + index * 25}%`, opacity: 1 }}
          transition={{
            duration: 18 + index * 2,
            repeat: animate ? Infinity : 0,
            ease: 'easeInOut',
            delay: index * 3
          }}
        >
          <svg 
            width={isMobile ? "120" : "160"} 
            height={isMobile ? "50" : "70"} 
            viewBox="0 0 160 70" 
            className="text-orange-600 dark:text-orange-500"
          >
            {/* Truck body */}
            <rect x="15" y="25" width="80" height="30" fill="currentColor" opacity="0.9" />
            <rect x="100" y="30" width="40" height="25" fill="currentColor" opacity="0.95" />
            
            {/* Wheels */}
            <circle cx="35" cy="58" r="8" className="fill-gray-800 dark:fill-gray-700" />
            <circle cx="65" cy="58" r="8" className="fill-gray-800 dark:fill-gray-700" />
            <circle cx="125" cy="58" r="8" className="fill-gray-800 dark:fill-gray-700" />
            
            {/* Wheel details */}
            <circle cx="35" cy="58" r="4" className="fill-gray-600" />
            <circle cx="65" cy="58" r="4" className="fill-gray-600" />
            <circle cx="125" cy="58" r="4" className="fill-gray-600" />
            
            {/* Cargo container */}
            <rect x="20" y="20" width="70" height="8" className="fill-orange-700 dark:fill-orange-600" />
            
            {/* Headlights */}
            <circle cx="142" cy="35" r="3" className="fill-yellow-300" />
            <circle cx="142" cy="45" r="3" className="fill-yellow-300" />
          </svg>
        </motion.div>
      ))}

      {/* Port Infrastructure - Center */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-8 lg:bottom-12 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
        >
          <svg 
            width={isMobile ? "200" : "300"} 
            height={isMobile ? "120" : "160"} 
            viewBox="0 0 300 160" 
            className="text-blue-700 dark:text-blue-400"
          >
            {/* Port crane */}
            <rect x="50" y="130" width="8" height="25" className="fill-yellow-600" />
            <rect x="46" y="40" width="16" height="100" className="fill-yellow-600" />
            <rect x="46" y="45" width="120" height="8" className="fill-yellow-600" />
            <rect x="160" y="40" width="12" height="20" className="fill-yellow-700" />
            
            {/* Crane movement */}
            <motion.rect 
              x="160" 
              y="40" 
              width="12" 
              height="20" 
              className="fill-red-600"
              animate={animate ? { x: [160, 180, 160] } : {}}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            
            {/* Container ship */}
            <rect x="180" y="90" width="100" height="40" fill="currentColor" opacity="0.9" />
            <rect x="190" y="75" width="15" height="15" className="fill-blue-800 dark:fill-blue-300" />
            <rect x="210" y="75" width="15" height="15" className="fill-blue-800 dark:fill-blue-300" />
            <rect x="230" y="75" width="15" height="15" className="fill-blue-800 dark:fill-blue-300" />
            <rect x="250" y="75" width="15" height="15" className="fill-blue-800 dark:fill-blue-300" />
            
            {/* Ship cabin */}
            <rect x="260" y="60" width="25" height="30" className="fill-blue-800 dark:fill-blue-300" />
            <circle cx="272" cy="70" r="4" className="fill-yellow-400" />
          </svg>
        </motion.div>
      </div>

      {/* Aircraft Fleet - Multiple planes at different heights */}
      {Array.from({ length: isMobile ? 2 : 4 }).map((_, index) => (
        <motion.div
          key={index}
          className="absolute z-30"
          initial={{ 
            x: '-20%', 
            y: `${15 + index * 8}%`,
            opacity: 0 
          }}
          animate={animate ? {
            x: ['0%', '110%'],
            opacity: [0, 1, 1, 0],
            rotate: [0, 2, -2, 0]
          } : { 
            x: `${10 + index * 20}%`, 
            y: `${15 + index * 8}%`,
            opacity: 0.8 
          }}
          transition={{
            duration: 20 + index * 3,
            repeat: animate ? Infinity : 0,
            ease: 'linear',
            delay: index * 4
          }}
        >
          <svg 
            width={isMobile ? "100" : "140"} 
            height={isMobile ? "40" : "60"} 
            viewBox="0 0 140 60" 
            className="text-indigo-600 dark:text-indigo-400"
          >
            {/* Plane body */}
            <ellipse cx="70" cy="30" rx="50" ry="12" fill="currentColor" opacity="0.9" />
            <rect x="35" y="25" width="70" height="6" fill="currentColor" />
            <rect x="45" y="20" width="50" height="4" fill="currentColor" />
            
            {/* Wings */}
            <rect x="15" y="28" width="20" height="8" className="fill-indigo-700 dark:fill-indigo-300" />
            <rect x="25" y="22" width="12" height="6" className="fill-indigo-700 dark:fill-indigo-300" />
            
            {/* Tail */}
            <rect x="115" y="18" width="8" height="16" className="fill-indigo-700 dark:fill-indigo-300" />
            
            {/* Windows */}
            <circle cx="60" cy="28" r="2" className="fill-blue-200" />
            <circle cx="70" cy="28" r="2" className="fill-blue-200" />
            <circle cx="80" cy="28" r="2" className="fill-blue-200" />
          </svg>
        </motion.div>
      ))}

      {/* Vikareta Hub - Larger, more prominent */}
      <div className="absolute right-8 lg:right-16 top-1/2 -translate-y-1/2 z-20">
        <motion.div
          className="relative flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
        >
          {/* Main hub building */}
          <motion.div
            className={`relative ${isMobile ? 'w-20 h-20' : 'w-32 h-32'} rounded-3xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 shadow-2xl border-2 border-white/30 flex items-center justify-center`}
            animate={animate ? { 
              scale: [1, 1.05, 1],
              boxShadow: [
                '0 0 30px rgba(245, 158, 11, .4)', 
                '0 0 50px rgba(245, 158, 11, .6)', 
                '0 0 30px rgba(245, 158, 11, .4)'
              ]
            } : {}}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* V logo */}
            <svg 
              width={isMobile ? "35" : "55"} 
              height={isMobile ? "35" : "55"} 
              viewBox="0 0 60 60" 
              className="text-white"
            >
              <path d="M12 16 L28 44 L32 44 L48 16 L40 16 L30 36 L20 16 Z" fill="currentColor" />
            </svg>
            
            {/* Pulsing ring */}
            <motion.div
              className="absolute inset-0 rounded-3xl border-2 border-orange-300"
              animate={animate ? { 
                scale: [1, 1.3, 1],
                opacity: [0.8, 0.3, 0.8]
              } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            />
          </motion.div>
          
          {/* Hub label */}
          <motion.div
            className="mt-2 px-3 py-1 bg-white/90 dark:bg-gray-800/90 rounded-full text-xs font-semibold text-gray-800 dark:text-gray-200 shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
          >
            Vikareta Hub
          </motion.div>
        </motion.div>
      </div>

      {/* Money Flow - Dynamic currency streams */}
      {Array.from({ length: isMobile ? 6 : 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute z-40"
          initial={{ 
            x: `${5 + (i % 3) * 30}%`, 
            y: `${70 + (i % 4) * 8}%`,
            scale: 0.5,
            opacity: 0 
          }}
          animate={animate ? {
            x: ['10%', '85%'],
            y: [`${60 + (i % 5) * 10}%`, `${45 + (i % 3) * 5}%`, `${50 + (i % 4) * 8}%`],
            scale: [0.5, 1.2, 0.8, 1],
            opacity: [0, 1, 1, 0.3],
            rotate: [0, 180, 360]
          } : { 
            x: `${40 + (i % 3) * 15}%`,
            y: `${50 + (i % 3) * 10}%`,
            scale: 1,
            opacity: 0.8 
          }}
          transition={{
            duration: 8 + (i % 3) * 2,
            repeat: animate ? Infinity : 0,
            delay: i * 0.8,
            ease: 'easeInOut'
          }}
        >
          <div className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 rounded-full shadow-lg flex items-center justify-center font-bold text-white border-2 border-yellow-300`}>
            ₹
          </div>
        </motion.div>
      ))}

      {/* Performance Analytics - Floating data visualizations */}
      <div className="absolute right-4 lg:right-12 bottom-16 lg:bottom-20 z-30">
        <motion.div
          className="flex flex-col items-center space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          {/* Analytics bars */}
          <div className="flex items-end gap-1 lg:gap-2">
            {[12, 20, 16, 28, 18, 24].map((height, idx) => (
              <motion.div
                key={idx}
                className={`${isMobile ? 'w-2' : 'w-3'} rounded-t bg-gradient-to-t from-blue-600 to-blue-400 shadow-sm`}
                initial={{ height: 4 }}
                animate={animate ? {
                  height: [4, height, height * 0.8, height],
                  opacity: [0.6, 1, 0.9, 1],
                  backgroundColor: [
                    'rgb(37, 99, 235)', 
                    'rgb(59, 130, 246)', 
                    'rgb(37, 99, 235)'
                  ]
                } : { height }}
                transition={{
                  duration: 3 + idx * 0.3,
                  repeat: animate ? Infinity : 0,
                  ease: 'easeInOut',
                  delay: idx * 0.2
                }}
              />
            ))}
          </div>
          
          {/* Success indicator */}
          <motion.div
            className="flex items-center space-x-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full text-xs font-medium text-green-800 dark:text-green-200"
            animate={animate ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Live Analytics</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Connection Lines - Showing data flow */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-5">
        <defs>
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.1" />
            <stop offset="50%" stopColor="rgb(59, 130, 246)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="rgb(245, 158, 11)" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        
        {!isMobile && (
          <>
            {/* Factory to Port */}
            <motion.path
              d="M 120 300 Q 300 250 500 320"
              stroke="url(#connectionGradient)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="10,5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={animate ? { 
                pathLength: [0, 1, 0],
                opacity: [0, 0.8, 0]
              } : { pathLength: 1, opacity: 0.4 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            
            {/* Port to Hub */}
            <motion.path
              d="M 500 320 Q 650 280 800 250"
              stroke="url(#connectionGradient)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="8,4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={animate ? { 
                pathLength: [0, 1, 0],
                opacity: [0, 0.6, 0]
              } : { pathLength: 1, opacity: 0.3 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            />
          </>
        )}
      </svg>

      {/* Global Network Indicators */}
      {Array.from({ length: isMobile ? 4 : 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-blue-400 rounded-full shadow-lg z-10"
          style={{
            left: `${15 + (i % 4) * 20 + Math.random() * 10}%`,
            top: `${20 + (i % 3) * 25 + Math.random() * 15}%`
          }}
          animate={animate ? {
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
            boxShadow: [
              '0 0 10px rgba(59, 130, 246, 0.5)',
              '0 0 20px rgba(59, 130, 246, 0.8)',
              '0 0 10px rgba(59, 130, 246, 0.5)'
            ]
          } : {}}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: 'easeInOut'
          }}
        />
      ))}

    </div>
  );
}

export default ProcurementJourney;
