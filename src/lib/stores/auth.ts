'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Secure SSO sync function
const syncSSOToSubdomains = async (targets: string[]) => {
  try {
    const syncPromises: Promise<void>[] = [];

    for (const host of targets) {
      const p = (async () => {
        try {
          // Use same-origin proxy to obtain SSO token with current cookies
          const csrfToken = typeof window !== 'undefined' ? 
            document.cookie.split(';').find(cookie => cookie.trim().startsWith('XSRF-TOKEN='))?.split('=')[1] : null;
          const resp = await fetch('/api/auth/sso-token', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              ...(csrfToken ? { 'X-XSRF-TOKEN': decodeURIComponent(csrfToken) } : {}),
            },
            body: JSON.stringify({ target: host }),
          });

          if (!resp.ok) return;
          const data = await resp.json();
          const token = data?.token;
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

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://api.vikareta.com/api').replace(/\/api\/api$/, '/api');

export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  businessName?: string;
  userType?: 'buyer' | 'seller' | 'both';
  verificationTier?: 'basic' | 'verified' | 'premium';
  isVerified?: boolean;
  phone?: string;
  gstin?: string;
  createdAt: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  businessName?: string;
  userType: 'buyer' | 'seller' | 'both';
  phone?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface SocialLoginData {
  provider: 'google' | 'linkedin';
  token: string;
}

interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  businessName?: string;
  phone?: string;
  gstin?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  refreshAuth: () => Promise<void>;
  register: (data: RegisterData) => Promise<boolean>;
  socialLogin: (data: SocialLoginData) => Promise<void>;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  try {
  // Get CSRF token from cookie (not localStorage for security)
  const csrfToken = typeof window !== 'undefined' ? 
    document.cookie.split(';').find(cookie => cookie.trim().startsWith('XSRF-TOKEN='))?.split('=')[1] : null;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
    ...(csrfToken ? { 'X-XSRF-TOKEN': csrfToken } : {}),
    ...options.headers,
      },
  // Default to sending credentials (cookies) so cookie-based auth/refresh works cross-origin
  credentials: (options as any).credentials ?? 'include',
  ...options,
    });

    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error('Invalid response format');
    }

    if (!response.ok) {
      const errorMessage = data.error?.message || data.message || `Request failed with status ${response.status}`;
      throw new Error(typeof errorMessage === 'string' ? errorMessage : 'Request failed');
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError && typeof error.message === 'string' && error.message.includes('fetch')) {
      throw new Error('Network error - please check your connection');
    }
    throw error;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (loginData: LoginData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify(loginData),
          });

          const { user } = response.data;
          
          // With HttpOnly cookies, no localStorage needed for tokens
          // Authentication is automatically handled by browser cookies
          
          // Secure SSO sync across domains using HttpOnly cookies
          try {
            await syncSSOToSubdomains(['dashboard.vikareta.com', 'admin.vikareta.com']);
          } catch (error) {
            console.warn('SSO sync failed:', error);
          }

          set({
            user,
            token: null, // No token storage in client
            refreshToken: null, // No refresh token in client
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          // Secure logout using HttpOnly cookies
          await apiCall('/auth/logout', {
            method: 'POST',
          });
        } catch {
          // Silent fail for logout
        }
        
        set({ 
          user: null, 
          token: null, 
          refreshToken: null, 
          isAuthenticated: false, 
          error: null 
        });
      },

      updateUser: (userData: Partial<User>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),

      refreshAuth: async () => {
        const { refreshToken } = get();

        try {
          // If we have a stored refresh token use it in the body (backward compat).
          // Otherwise attempt cookie-based refresh (credentials included by default in apiCall).
          const response = refreshToken
            ? await apiCall('/auth/refresh', {
                method: 'POST',
                body: JSON.stringify({ refreshToken }),
              })
            : await apiCall('/auth/refresh', { method: 'POST' });

          const { token: newToken, refreshToken: newRefreshToken } = response.data;
          
          // HttpOnly cookies are managed by the browser - no localStorage needed

          set({
            token: newToken,
            refreshToken: newRefreshToken,
          });
        } catch {
          get().logout();
        }
      },

      register: async (registerData: RegisterData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify(registerData),
          });

          const { user, token, refreshToken } = response.data;
          
          // HttpOnly cookies are managed by the browser - no localStorage needed

          set({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          
          return true;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Registration failed';
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      socialLogin: async (socialData: SocialLoginData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiCall(`/auth/${socialData.provider}`, {
            method: 'POST',
            body: JSON.stringify({ token: socialData.token }),
          });

          const { user, token, refreshToken } = response.data;
          
          // HttpOnly cookies are managed by the browser - no localStorage needed

          set({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Social login failed';
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      updateProfile: async (profileData: ProfileUpdateData) => {
        const { token } = get();
        if (!token) throw new Error('Not authenticated');

        set({ isLoading: true, error: null });
        
        try {
          const response = await apiCall('/auth/profile', {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(profileData),
          });

          const { user } = response.data;
          
          set({
            user,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      checkAuth: async () => {
        const { token } = get();
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        try {
          const response = await apiCall('/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const user = response.data;
          
          set({
            user,
            isAuthenticated: true,
            error: null,
          });
        } catch {
          // Silently logout on auth check failure
          set({ 
            user: null, 
            token: null, 
            refreshToken: null, 
            isAuthenticated: false, 
            error: null 
          });
          
          // HttpOnly cookies are cleared by the backend - no localStorage cleanup needed
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);