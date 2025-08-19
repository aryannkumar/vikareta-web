"use client";

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Determines if motion should be enabled.
 * Honors user OS preference, but allows explicit override via:
 * - localStorage key `motion` = 'on' | 'off'
 * - env NEXT_PUBLIC_FORCE_MOTION = '1' to always enable
 */
export function useMotionEnabled() {
  const prefersReduced = useReducedMotion();
  const [override, setOverride] = useState<'on' | 'off' | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const v = window.localStorage.getItem('motion');
        if (v === 'on' || v === 'off') setOverride(v);
      } catch {}
    }
  }, []);

  const forced = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_FORCE_MOTION === '1';

  if (forced) return true;
  if (override === 'on') return true;
  if (override === 'off') return false;

  return !prefersReduced;
}
