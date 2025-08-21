/**
 * Secure SSO Authentication Hook - HttpOnly Cookie Based
 * No localStorage for enhanced security
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name: string;
  userType: 'buyer' | 'seller' | 'admin' | 'both';
  role?: 'buyer' | 'seller' | 'admin' | 'both'; // For backwards compatibility
  verified: boolean;
  avatar?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SSOAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Helper function to get CSRF token
  const getCSRFToken = useCallback((): string | null => {
    if (typeof window === 'undefined') return null;
    
    const cookies = document.cookie.split(';');
    const csrfCookie = cookies.find(cookie => 
      cookie.trim().startsWith('XSRF-TOKEN=')
    );
    
    if (csrfCookie) {
      return decodeURIComponent(csrfCookie.split('=')[1]);
    }
    
    return null;
  }, []);

  // Secure API request helper
  const secureRequest = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    // Use the same API base as the main API client for consistency
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'https://api.vikareta.com';
    
    // Build full URL for backend API
    const fullUrl = endpoint.startsWith('http') ? endpoint : `${apiBase}${endpoint}`;
    
    const config: RequestInit = {
      credentials: 'include', // Critical: Always include HttpOnly cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add CSRF token for state-changing requests
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method || 'GET')) {
      const csrfToken = getCSRFToken();
      if (csrfToken) {
        config.headers = {
          ...config.headers,
          'X-XSRF-TOKEN': csrfToken,
        };
      }
    }

    const response = await fetch(fullUrl, config);
    
    if (!response.ok) {
      if (response.status === 401) {
        // Unauthorized - clear auth state
        setUser(null);
        setIsAuthenticated(false);
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return response.json();
  }, [getCSRFToken]);

  // Check current session using HttpOnly cookies
  const checkSession = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await secureRequest('/api/auth/me');
      
      if (response.success && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch {
      // 401 is expected when not logged in
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, [secureRequest]);

  // Secure logout function
  const logout = useCallback(async () => {
    try {
      // Import cross-domain logout utility
      const { performSecureLogout } = await import('../auth/cross-domain-logout');
      
      // Perform comprehensive cross-domain logout
      await performSecureLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state
      setUser(null);
      setIsAuthenticated(false);
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
  }, []);

  // Check session on mount
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Periodic session refresh (every 5 minutes)
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      checkSession();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated, checkSession]);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    logout,
    refreshSession: checkSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useSSOAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSSOAuth must be used within a SSOAuthProvider');
  }
  return context;
}