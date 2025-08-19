"use client";

import { useEffect } from 'react';

export default function MotionBoot() {
  useEffect(() => {
    const root = document.documentElement;
    const forced = process.env.NEXT_PUBLIC_FORCE_MOTION === '1';
    let enable = forced;
    try {
      const v = window.localStorage.getItem('motion');
      if (v === 'on') enable = true;
      if (v === 'off') enable = false;
    } catch {}

    const apply = (on: boolean) => {
      if (on) root.setAttribute('data-motion', 'on');
      else root.removeAttribute('data-motion');
    };

    apply(enable);

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'motion') {
        apply(e.newValue === 'on');
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return null;
}
