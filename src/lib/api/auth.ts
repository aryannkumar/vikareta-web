import { apiClient } from './client';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'buyer' | 'seller' | 'admin';
  verified: boolean;
  createdAt: string;
  profile?: {
    company?: string;
    location?: string;
    bio?: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: 'buyer' | 'seller';
  company?: string;
  location?: string;
  acceptTerms: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const authApi = {
  async login(credentials: LoginCredentials) {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  },

  async register(data: RegisterData) {
    return apiClient.post<AuthResponse>('/auth/register', data);
  },

  async logout() {
    return apiClient.post('/auth/logout');
  },

  async getCurrentUser() {
    return apiClient.get<User>('/auth/me');
  },

  async refreshToken() {
    return apiClient.post<{ token: string; refreshToken: string }>('/auth/refresh');
  },

  async forgotPassword(data: ForgotPasswordData) {
    return apiClient.post('/auth/forgot-password', data);
  },

  async resetPassword(data: ResetPasswordData) {
    return apiClient.post('/auth/reset-password', data);
  },

  async changePassword(data: ChangePasswordData) {
    return apiClient.put('/auth/change-password', data);
  },

  async verifyEmail(token: string) {
    return apiClient.post('/auth/verify-email', { token });
  },

  async resendVerification() {
    return apiClient.post('/auth/resend-verification');
  },

  async updateProfile(data: Partial<User>) {
    return apiClient.put<User>('/auth/profile', data);
  },

  async deleteAccount() {
    return apiClient.delete('/auth/account');
  }
};