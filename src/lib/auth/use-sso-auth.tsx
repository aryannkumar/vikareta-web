/**
 * React Hook for SSO Authentication
 * Provides authentication state and methods across the application
 */

'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ssoAuth, User, LoginCredentials, AuthResponse } from './sso-client';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<boolean>;
    logout: () => Promise<void>;
    register: (userData: any) => Promise<boolean>;
    refreshSession: () => Promise<void>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function SSOAuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isAuthenticated = !!user;

    /**
     * Check session on app load and periodically
     */
    const checkSession = async () => {
        try {
            setIsLoading(true);
            const response = await ssoAuth.checkSession();

            if (response.success && response.user) {
                setUser(response.user);
                setError(null);
            } else {
                setUser(null);
                if (response.error?.code !== 'SESSION_ERROR') {
                    setError(response.error?.message || 'Session check failed');
                }
            }
        } catch (err) {
            console.error('Session check failed:', err);
            setUser(null);
            setError('Session check failed');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Login with credentials
     */
    const login = async (credentials: LoginCredentials): Promise<boolean> => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await ssoAuth.login(credentials);

            if (response.success && response.user) {
                setUser(response.user);
                return true;
            } else {
                setError(response.error?.message || 'Login failed');
                return false;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Login failed';
            setError(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Register new user
     */
    const register = async (userData: any): Promise<boolean> => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await ssoAuth.register(userData);

            if (response.success && response.user) {
                setUser(response.user);
                return true;
            } else {
                setError(response.error?.message || 'Registration failed');
                return false;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Registration failed';
            setError(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Logout and clear session
     */
    const logout = async () => {
        try {
            setIsLoading(true);
            await ssoAuth.logout();
            setUser(null);
            setError(null);
        } catch (err) {
            console.error('Logout failed:', err);
            // Clear local state even if logout request fails
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Refresh session manually
     */
    const refreshSession = async () => {
        await checkSession();
    };

    /**
     * Clear error state
     */
    const clearError = () => {
        setError(null);
    };

    // Check session on mount only if tokens/cookies exist
    useEffect(() => {
        const hasLocalAccess = typeof window !== 'undefined' && !!localStorage.getItem('vikareta_access_token');
        const hasLocalRefresh = typeof window !== 'undefined' && !!localStorage.getItem('vikareta_refresh_token');
        const hasCookieToken = typeof document !== 'undefined' && (document.cookie.includes('refresh_token') || document.cookie.includes('access_token'));

        if (hasLocalAccess || hasLocalRefresh || hasCookieToken) {
            checkSession();
        } else {
            setIsLoading(false);
        }
    }, []);

    // Set up periodic session check (every 5 minutes)
    useEffect(() => {
        if (!isAuthenticated) return;

        const interval = setInterval(() => {
            checkSession();
        }, 5 * 60 * 1000); // 5 minutes

        return () => clearInterval(interval);
    }, [isAuthenticated]);

    // Listen for storage events to sync logout across tabs
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'sso_logout' && e.newValue) {
                setUser(null);
                setError(null);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const value: AuthContextType = {
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        logout,
        register,
        refreshSession,
        clearError,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Hook to use SSO authentication
 */
export function useSSOAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useSSOAuth must be used within a SSOAuthProvider');
    }
    return context;
}

/**
 * Higher-order component for protected routes
 */
export function withSSOAuth<P extends object>(
    Component: React.ComponentType<P>
) {
    return function AuthenticatedComponent(props: P) {
        const { isAuthenticated, isLoading } = useSSOAuth();

        if (isLoading) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            );
        }

        if (!isAuthenticated) {
            // Redirect to login
            if (typeof window !== 'undefined') {
                window.location.href = '/auth/login';
            }
            return null;
        }

        return <Component {...props} />;
    };
}