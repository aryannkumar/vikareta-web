'use client';

import React from 'react';

// Simple theme provider - just light theme with minimal orange accents
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export const useTheme = () => ({
  theme: 'light' as const,
  resolvedTheme: 'light' as const,
  setTheme: () => {},
});