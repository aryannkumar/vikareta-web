import { useState, useEffect } from 'react';
import { SSOAuthClient, User } from '@/lib/auth/sso-client';
import { syncSSOToSubdomains, handlePostLoginRedirect } from '@/lib/utils/cross-domain-auth';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ssoClient = new SSOAuthClient();

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const currentUser = await ssoClient.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      // 401 is expected when not logged in
      if (err instanceof Error && !err.message.includes('401')) {
        setError(err.message);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Store where the user started the login flow so we can return them
      if (typeof window !== 'undefined') {
        try { localStorage.setItem('auth_return_url', window.location.href); } catch {}
      }

      const result = await ssoClient.login({ email, password });
      
      if (result.success && result.user) {
        setUser(result.user);

  // Best-effort: request SSO tokens from backend and silently sync them
  // to configured subdomains so the user can navigate cross-domain
  // without an additional login. Non-blocking for user-visible login.
  try { syncSSOToSubdomains(); } catch {}

        // Redirect back to where user started (if any)
        try { handlePostLoginRedirect(); } catch {}
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
      await ssoClient.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  const refreshSession = async () => {
    try {
      await ssoClient.refreshToken();
      await checkSession();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Session refresh failed');
      setUser(null);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    refreshSession,
  };
}