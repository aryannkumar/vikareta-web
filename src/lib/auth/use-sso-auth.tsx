/**
 * Web Auth Provider - Using Unified Vikareta Auth System
 * Simplified provider that uses the unified authentication
 */

'use client';

import React, { createContext, useContext } from 'react';
import { useVikaretaAuth, VikaretaAuthProvider, VikaretaUser } from '@/lib/auth/vikareta';

// Web User type for backward compatibility
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name: string; // Computed from firstName + lastName
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

// Convert VikaretaUser to legacy User format for backward compatibility
function convertUser(vikaretaUser: VikaretaUser | null): User | null {
  if (!vikaretaUser) return null;
  
  const fullName = [vikaretaUser.firstName, vikaretaUser.lastName]
    .filter(Boolean)
    .join(' ') || 'User';
    
  // Handle super_admin by mapping to admin for backward compatibility
  const userType = vikaretaUser.userType === 'super_admin' ? 'admin' : (vikaretaUser.userType || 'buyer');
  
  return {
    id: vikaretaUser.id,
    email: vikaretaUser.email || '',
    firstName: vikaretaUser.firstName,
    lastName: vikaretaUser.lastName,
    name: fullName,
    userType: userType as 'buyer' | 'seller' | 'admin' | 'both',
    role: userType as 'buyer' | 'seller' | 'admin' | 'both', // Backward compatibility
    verified: vikaretaUser.isVerified || false,
    avatar: undefined, // Not available in VikaretaUser
    createdAt: vikaretaUser.createdAt || new Date().toISOString(),
  };
}

export function WebAuthProvider({ children }: { children: React.ReactNode }) {
  // Use the unified Vikareta auth system underneath
  return (
    <VikaretaAuthProvider>
      <WebAuthBridge>
        {children}
      </WebAuthBridge>
    </VikaretaAuthProvider>
  );
}

function WebAuthBridge({ children }: { children: React.ReactNode }) {
  const vikaretaAuth = useVikaretaAuth();
  
  // Convert to legacy format
  const user = convertUser(vikaretaAuth.user);
  
  const authContextValue: AuthContextType = {
    user,
    isAuthenticated: vikaretaAuth.isAuthenticated,
    loading: vikaretaAuth.isLoading,
    logout: vikaretaAuth.logout,
    refreshSession: async () => {
      // The unified system handles session refresh automatically
      await vikaretaAuth.refreshToken();
    },
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useWebAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useWebAuth must be used within a WebAuthProvider');
  }
  return context;
}

// Backward compatibility exports
export const useSSOAuth = useWebAuth;
export const SSOAuthProvider = WebAuthProvider;