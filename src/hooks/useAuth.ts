/**
 * Secure Authentication Hook - HttpOnly Cookie Based
 * Migrated from localStorage to HttpOnly cookies for security
 */

import { useState, useEffect, useCallback } from 'react';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name: string;
  role: 'buyer' | 'seller' | 'admin' | 'both';
  verified: boolean;
  avatar?: string;
  createdAt: string;
}

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  isAuthenticated: boolean;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

    const response = await fetch(endpoint, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return response.json();
  }, [getCSRFToken]);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await secureRequest('/api/auth/me');
      
      if (response.success && response.user) {
        setUser(response.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      // 401 is expected when not logged in
      if (err instanceof Error && !err.message.includes('401')) {
        setError(err.message);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [secureRequest]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Store return URL in URL parameter instead of localStorage for security
      const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

      const result = await secureRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      if (result.success && result.user) {
        setUser(result.user);

        // Secure SSO sync using HttpOnly cookies
        try { 
          await syncSSOToSubdomains(); 
        } catch (syncError) {
          console.warn('SSO sync failed:', syncError);
        }

        // Redirect handling
        try { 
          handlePostLoginRedirect(currentUrl); 
        } catch {}
        
        return true;
      } else {
        setError(result.error?.message || 'Login failed');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // Backend will clear HttpOnly cookies across all domains
      await secureRequest('/api/auth/logout', {
        method: 'POST',
      });
      
      setUser(null);
      setError(null);
      
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
      // Clear local state even if request fails
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshSession = async () => {
    try {
      await secureRequest('/api/auth/refresh', {
        method: 'POST',
      });
      await checkSession();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Session refresh failed');
      setUser(null);
    }
  };

  // Secure SSO sync function
  const syncSSOToSubdomains = async () => {
    try {
      const targets = ['dashboard.vikareta.com', 'admin.vikareta.com'];
      const syncPromises: Promise<void>[] = [];

      for (const host of targets) {
        const p = (async () => {
          try {
            const resp = await secureRequest('/api/auth/sso-token', {
              method: 'POST',
              body: JSON.stringify({ target: host }),
            });

            const token = resp?.token;
            if (!token) return;

            await new Promise<void>((resolve) => {
              const iframe = document.createElement('iframe');
              iframe.style.display = 'none';
              iframe.src = `https://${host}/sso/receive?token=${encodeURIComponent(token)}`;

              const cleanup = () => {
                try { window.removeEventListener('message', onMessage); } catch {}
                try { if (iframe.parentNode) iframe.parentNode.removeChild(iframe); } catch {}
                resolve();
              };

              const onMessage = (e: MessageEvent) => {
                if (e.origin === `https://${host}` && e.data?.sso === 'ok') {
                  cleanup();
                }
              };

              window.addEventListener('message', onMessage);
              document.body.appendChild(iframe);
              setTimeout(() => cleanup(), 5000);
            });
          } catch {}
        })();

        syncPromises.push(p);
      }

      await Promise.all(syncPromises);
    } catch {}
  };

  const handlePostLoginRedirect = (returnUrl?: string) => {
    if (typeof window === 'undefined') return;
    
    if (returnUrl && returnUrl !== window.location.href) {
      try {
        const url = new URL(returnUrl);
        const allowedHosts = ['vikareta.com', 'dashboard.vikareta.com', 'admin.vikareta.com'];
        
        if (allowedHosts.includes(url.hostname)) {
          window.location.href = returnUrl;
          return;
        }
      } catch {}
    }
    
    // Default redirect
    window.location.href = '/';
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    refreshSession,
    isAuthenticated: user !== null,
  };
}