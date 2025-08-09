'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth';

interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const { checkAuth, isAuthenticated } = useAuthStore();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check if user is authenticated
        await checkAuth();
      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        setInitializing(false);
      }
    };

    initializeApp();
  }, [checkAuth]);

  if (initializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}