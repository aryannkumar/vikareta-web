"use client";

import React from 'react';
import Link, { LinkProps } from 'next/link';
import { motion, MotionProps, AnimatePresence } from 'framer-motion';

// Premium page transition variants
const pageVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 1.02,
  },
};

// Stagger container for child elements
const staggerContainer = {
  hidden: { opacity: 0 },
  enter: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Individual item animation
const staggerItem = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
};

export const Entrance: React.FC<React.PropsWithChildren<MotionProps>> = ({ children, ...rest }) => {
  // Respect prefers-reduced-motion: if set, disable motion by rendering plain div
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return <div {...(rest as any)}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={pageVariants}
      className="w-full"
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export function AnimatedLink(props: LinkProps & { className?: string; children: React.ReactNode }) {
  return (
    <Link {...props} className={props.className}>
      <motion.span 
        whileHover={{ 
          y: -2, 
          scale: 1.02,
          transition: { duration: 0.2, ease: "easeOut" }
        }}
        whileTap={{ 
          scale: 0.98,
          transition: { duration: 0.1 }
        }}
        className="inline-block"
      >
        {props.children}
      </motion.span>
    </Link>
  );
}

// Premium button with micro-interactions
export const AnimatedButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
}> = ({ 
  children, 
  className = '', 
  variant = 'primary', 
  size = 'md',
  onClick,
  disabled = false 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/25';
  
  const variants = {
  primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl',
  outline: 'border-2 border-blue-600 text-blue-600 bg-white hover:bg-blue-600 hover:text-white dark:bg-gray-900 dark:text-blue-400',
  ghost: 'hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={{ 
        scale: disabled ? 1 : 1.02,
        y: disabled ? 0 : -1,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ 
        scale: disabled ? 1 : 0.98,
        transition: { duration: 0.1 }
      }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
};

// Stagger container for lists and grids
export const StaggerContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0.1 }) => {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="enter"
      className={className}
      style={{
        '--stagger-delay': `${delay}s`,
      } as React.CSSProperties}
    >
      {children}
    </motion.div>
  );
};

// Individual stagger item
export const StaggerItem: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <motion.div
      variants={staggerItem}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Floating animation for hero elements
export const FloatingElement: React.FC<{
  children?: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0 }) => {
  return (
    <motion.div
      className={`${className}`}
      animate={{
        y: [-10, 10, -10],
        transition: {
          duration: 6,
          ease: "easeInOut",
          repeat: Infinity,
          delay,
        },
      }}
    >
      {children}
    </motion.div>
  );
};

// Reveal animation for sections
export const RevealSection: React.FC<{
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}> = ({ children, className = '', direction = 'up' }) => {
  const directions = {
    up: { y: 50 },
    down: { y: -50 },
    left: { x: -50 },
    right: { x: 50 },
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...directions[direction],
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        x: 0,
      }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default Entrance;
