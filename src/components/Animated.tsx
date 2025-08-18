"use client";

import React from 'react';
import Link, { LinkProps } from 'next/link';
import { motion, MotionProps } from 'framer-motion';
import { pageTransition } from '@/lib/motion';

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
      variants={pageTransition}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export function AnimatedLink(props: LinkProps & { className?: string; children: React.ReactNode }) {
  // Simple wrapper to allow subtle animation on navigation links
  return (
    <Link {...props}>
      <motion.span whileHover={{ y: -3, scale: 1.02 }} transition={{ duration: 0.18 }}>
        {props.children}
      </motion.span>
    </Link>
  );
}

export default Entrance;
