import { apiClient } from './client';

export interface User {
  id: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  businessName?: string;
  gstin?: string;
  userType: string;
  role?: string;
  verificationTier: string;
  isVerified: boolean;
  isActive: boolean;
  avatar?: string;
  bio?: string;
  website?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginCredentials {
  email?: string;
  phone?: string;
  password: string;
}

export interface RegisterData {
  email?: string;
  phone?: string;
  password: string;
  firstName?: string;
  lastName?: string;
  businessName?: string;
  userType: string;
  gstin?: string;
  country?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  location?: string;
  address?: string;
}

export interface RegisterResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface UserSession {
  id: string;
  userId: string;
  deviceType: string;
  browser: string;
  os: string;
  ipAddress: string;
  location?: string;
  lastActivity: string;
  isCurrentSession: boolean;
  createdAt: string;
}

export interface SocialLoginData {
  provider: 'google' | 'linkedin' | 'digilocker';
  code?: string;
  state?: string;
}

export class AuthService {
  // Register a new user
  static async register(data: RegisterData): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>('/auth/register', data);
    if (!response.success) {
      throw new Error(response.error || 'Registration failed');
    }

    // Store tokens in localStorage for client-side use (similar to login)
    if (typeof window !== 'undefined' && response.data) {
      localStorage.setItem('accessToken', response.data.accessToken);
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      console.log('Registration successful, tokens stored in localStorage');
    }

    return response.data;
  }

  // Login user
  static async login(credentials: LoginCredentials): Promise<AuthTokens> {
    // Use Next.js API route instead of direct backend call for proper CSRF handling
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || 'Login failed');
    }

    const data = await response.json();

    // The response is { success: true, message: ..., data: { accessToken, user } }
    const authData = data.data;

    // Store tokens in localStorage for client-side use
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', authData.accessToken);
      localStorage.setItem('refreshToken', authData.refreshToken || '');
    }

    return authData;
  }

  // Logout from all devices (not available in backend, use regular logout)
  static async logoutAll(): Promise<void> {
    // Backend doesn't have logout-all endpoint, so we'll just logout current session
    const response = await apiClient.post('/auth/logout');
    if (!response.success) {
      throw new Error(response.error || 'Logout failed');
    }

    // Clear stored tokens
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  // Refresh access token
  static async refreshToken(): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<{ accessToken: string; refreshToken: string }>('/auth/refresh-token', {
      refreshToken
    });
    if (!response.success) {
      throw new Error(response.error || 'Token refresh failed');
    }

    // Update stored tokens
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }

    return response.data;
  }

  // Get current user profile
  static async getProfile(): Promise<{ user: User; subscription?: any }> {
    const response = await apiClient.get<{ user: User; subscription?: any }>('/auth/me');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch profile');
    }
    return response.data;
  }

  // Update user profile
  static async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>('/auth/me', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update profile');
    }
    return response.data;
  }

  // Change password
  static async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const response = await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword
    });
    if (!response.success) {
      throw new Error(response.error || 'Failed to change password');
    }
  }

  // Forgot password
  static async forgotPassword(email: string): Promise<void> {
    const response = await apiClient.post('/auth/forgot-password', { email });
    if (!response.success) {
      throw new Error(response.error || 'Failed to send password reset email');
    }
  }

  // Reset password
  static async resetPassword(token: string, password: string): Promise<void> {
    const response = await apiClient.post('/auth/reset-password', { token, password });
    if (!response.success) {
      throw new Error(response.error || 'Failed to reset password');
    }
  }

  // Send OTP
  static async sendOTP(identifier: string): Promise<void> {
    // Use Next.js API route instead of direct backend call
    const response = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ identifier }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || 'Failed to send OTP');
    }
  }

  // Verify OTP
  static async verifyOTP(identifier: string, otp: string): Promise<AuthTokens> {
    // Use Next.js API route instead of direct backend call
    const response = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ identifier, otp }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || 'Failed to verify OTP');
    }

    const data = await response.json();

    // The response is { success: true, message: ..., data: { accessToken, user } }
    const authData = data.data;

    // Store tokens
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', authData.accessToken);
      localStorage.setItem('refreshToken', authData.refreshToken || '');
    }

    return authData;
  }

  // Send verification email
  static async sendVerificationEmail(): Promise<void> {
    const response = await apiClient.post('/auth/send-verification-email');
    if (!response.success) {
      throw new Error(response.error || 'Failed to send verification email');
    }
  }

  // Verify email (GET with token in URL)
  static async verifyEmail(token: string): Promise<void> {
    const response = await apiClient.get(`/auth/verify-email/${token}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to verify email');
    }
  }

  // Two-factor authentication
  static async enableTwoFactor(): Promise<TwoFactorSetup> {
    const response = await apiClient.post<TwoFactorSetup>('/auth/2fa/enable');
    if (!response.success) {
      throw new Error(response.error || 'Failed to enable 2FA');
    }
    return response.data;
  }

  static async disableTwoFactor(): Promise<void> {
    const response = await apiClient.post('/auth/2fa/disable');
    if (!response.success) {
      throw new Error(response.error || 'Failed to disable 2FA');
    }
  }

  static async verifyTwoFactor(token: string): Promise<AuthTokens> {
    const response = await apiClient.post<AuthTokens>('/auth/2fa/verify', { token });
    if (!response.success) {
      throw new Error(response.error || 'Failed to verify 2FA token');
    }

    // Store tokens
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }

    return response.data;
  }

  // User sessions
  static async getSessions(): Promise<UserSession[]> {
    const response = await apiClient.get<UserSession[]>('/auth/sessions');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch sessions');
    }
    return response.data;
  }

  static async revokeSession(sessionId: string): Promise<void> {
    const response = await apiClient.delete(`/auth/sessions/${sessionId}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to revoke session');
    }
  }

  static async revokeAllSessions(): Promise<void> {
    const response = await apiClient.delete('/auth/sessions');
    if (!response.success) {
      throw new Error(response.error || 'Failed to revoke all sessions');
    }
  }

  // Social authentication
  static async googleLogin(): Promise<void> {
    // Redirect to Google OAuth
    const baseURL = process.env.NEXT_PUBLIC_API_BASE || 'https://api.vikareta.com';
    window.location.href = `${baseURL}/auth/google`;
  }

  static async linkedinLogin(): Promise<void> {
    // Redirect to LinkedIn OAuth
    const baseURL = process.env.NEXT_PUBLIC_API_BASE || 'https://api.vikareta.com';
    window.location.href = `${baseURL}/auth/linkedin`;
  }

  // DigiLocker login (not available in backend)
  static async digilockerLogin(): Promise<void> {
    throw new Error('DigiLocker authentication is not currently supported');
  }

  // Handle OAuth callback
  static async handleAuthCallback(token: string): Promise<AuthTokens> {
    // Store the token from callback
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }

    // Get user profile to complete authentication
    const profile = await this.getProfile();
    return {
      accessToken: token,
      refreshToken: '', // Will be set by refresh token endpoint
      user: profile.user
    };
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('accessToken');
    return !!token;
  }

  // Get stored access token
  static getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }

  // Get stored refresh token
  static getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
  }

  // Clear all stored auth data
  static clearAuthData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  // Initialize auth state (call this on app start)
  static async initializeAuth(): Promise<User | null> {
    try {
      if (!this.isAuthenticated()) {
        return null;
      }

      const profile = await this.getProfile();
      return profile.user;
    } catch (error) {
      // Token might be expired, clear it
      this.clearAuthData();
      return null;
    }
  }
}