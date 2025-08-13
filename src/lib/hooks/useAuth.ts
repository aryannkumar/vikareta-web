'use client';

import React, { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { authApi, type User, type LoginCredentials, type RegisterData } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast-provider';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await authApi.getCurrentUser();
      if (response.success) {
        setUser(response.data);
      } else {
        localStorage.removeItem('auth_token');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('auth_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const response = await authApi.login(credentials);
      if (response.success) {
        localStorage.setItem('auth_token', response.data.token);
        setUser(response.data.user);
        toast.success('Welcome back!', `Logged in as ${response.data.user.name}`);
        return true;
      } else {
        // Extract proper error message from response
        let errorMessage = 'Invalid credentials';
        if (response.error) {
          if (typeof response.error === 'string') {
            errorMessage = response.error;
          } else if (typeof response.error === 'object' && response.error !== null && 'message' in response.error) {
            errorMessage = (response.error as any).message;
          }
        }

        // Show user-friendly error messages
        if (errorMessage.includes('INVALID_CREDENTIALS') || errorMessage.includes('Invalid credentials')) {
          toast.error('Login Failed', 'Invalid email or password. Please try again.');
        } else if (errorMessage.includes('USER_NOT_FOUND')) {
          toast.error('Account Not Found', 'No account found with this email.');
        } else if (errorMessage.includes('ACCOUNT_LOCKED')) {
          toast.error('Account Locked', 'Account temporarily locked. Contact support.');
        } else {
          toast.error('Login Failed', errorMessage.length > 60 ? errorMessage.substring(0, 60) + '...' : errorMessage);
        }
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);

      // Handle network or other errors
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('Network error')) {
          toast.error('Connection Error', 'Please check your internet connection and try again.');
        } else {
          toast.error('Login Failed', error.message);
        }
      } else {
        toast.error('Login Failed', 'An unexpected error occurred during login');
      }
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      const response = await authApi.register(data);
      if (response.success) {
        localStorage.setItem('auth_token', response.data.token);
        setUser(response.data.user);
        toast.success('Welcome!', `Account created for ${response.data.user.name}`);
        return true;
      } else {
        // Extract proper error message from response
        let errorMessage = 'Failed to create account';
        if (response.error) {
          if (typeof response.error === 'string') {
            errorMessage = response.error;
          } else if (typeof response.error === 'object' && response.error !== null && 'message' in response.error) {
            errorMessage = (response.error as any).message;
          }
        }

        // Show user-friendly error messages
        if (errorMessage.includes('USER_EXISTS') || errorMessage.includes('already exists')) {
          toast.error('Account Already Exists', 'This email or phone is already registered. Try logging in instead.');
        } else if (errorMessage.includes('VALIDATION_ERROR')) {
          toast.error('Invalid Information', 'Please check your details and try again.');
        } else {
          toast.error('Registration Failed', errorMessage.length > 60 ? errorMessage.substring(0, 60) + '...' : errorMessage);
        }
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);

      // Handle network or other errors
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('Network error')) {
          toast.error('Connection Error', 'Please check your internet connection and try again.');
        } else {
          toast.error('Registration Failed', error.message);
        }
      } else {
        toast.error('Registration Failed', 'An unexpected error occurred during registration');
      }
      return false;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
      router.push('/auth/login');
      toast.info('Logged Out', 'You have been logged out successfully');
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authApi.getCurrentUser();
      if (response.success) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated: !!user,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}