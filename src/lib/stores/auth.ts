'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  register: (data: RegisterData) => Promise<void>;
  socialLogin: (data: SocialLoginData) => Promise<void>;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
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

          const { user, token, refreshToken } = response.data;
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', token);
            if (refreshToken) {
              localStorage.setItem('refresh_token', refreshToken);
            }
            
            // Sync authentication across domains
            const { syncAuthAcrossDomains } = await import('../utils/cross-domain-auth');
            syncAuthAcrossDomains({ user, tokens: { accessToken: token, refreshToken } });
          }

          set({
            user,
            token,
            refreshToken,
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
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          
          // Sync logout across domains
          const { syncAuthAcrossDomains } = await import('../utils/cross-domain-auth');
          syncAuthAcrossDomains(null);
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
        if (!refreshToken) return;

        try {
          const response = await apiCall('/auth/refresh', {
            method: 'POST',
            body: JSON.stringify({ refreshToken }),
          });

          const { token: newToken, refreshToken: newRefreshToken } = response.data;
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', newToken);
            if (newRefreshToken) {
              localStorage.setItem('refresh_token', newRefreshToken);
            }
          }

          set({
            token: newToken,
            refreshToken: newRefreshToken,
          });
        } catch (error) {
          get().logout();
        }
      },

      register: async (registerData: RegisterData) => {
        set({ isLoading: true, error: null });
        
        try {
          console.log('Sending registration data to API:', registerData);
          const response = await apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify(registerData),
          });

          const { user, token, refreshToken } = response.data;
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', token);
            if (refreshToken) {
              localStorage.setItem('refresh_token', refreshToken);
            }
          }

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
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', token);
            if (refreshToken) {
              localStorage.setItem('refresh_token', refreshToken);
            }
          }

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
        } catch (error) {
          // Silently logout on auth check failure
          set({ 
            user: null, 
            token: null, 
            refreshToken: null, 
            isAuthenticated: false, 
            error: null 
          });
          
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
          }
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