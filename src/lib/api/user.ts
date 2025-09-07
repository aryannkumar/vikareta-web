import { apiClient } from './client';

export interface User {
  id: string;
  email: string;
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
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  businessName?: string;
  gstin?: string;
  avatar?: string;
  bio?: string;
  website?: string;
  location?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  verificationTier: string;
  isVerified: boolean;
}

export interface UpdateUserProfile {
  firstName?: string;
  lastName?: string;
  businessName?: string;
  gstin?: string;
  avatar?: string;
  bio?: string;
  website?: string;
  location?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface UserDocument {
  id: string;
  documentType: string;
  documentNumber: string;
  documentUrl: string;
  verificationStatus: string;
  verifiedAt?: string;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingAddress {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export const userApi = {
  // Get current user profile
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get<UserProfile>('/auth/me');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch profile');
    }
    return response.data;
  },

  // Update user profile
  async updateProfile(data: UpdateUserProfile): Promise<UserProfile> {
    const response = await apiClient.put<UserProfile>('/auth/profile', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update profile');
    }
    return response.data;
  },

  // Upload avatar
  async uploadAvatar(file: File): Promise<{ avatar: string }> {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await apiClient.upload('/users/avatar', formData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to upload avatar');
    }
    return response.data as { avatar: string };
  },

  // Get user documents
  async getDocuments(): Promise<UserDocument[]> {
    const response = await apiClient.get<UserDocument[]>('/users/documents');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch documents');
    }
    return response.data;
  },

  // Upload document
  async uploadDocument(documentType: string, documentNumber: string, file: File): Promise<UserDocument> {
    const formData = new FormData();
    formData.append('documentType', documentType);
    formData.append('documentNumber', documentNumber);
    formData.append('document', file);
    const response = await apiClient.upload('/users/documents', formData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to upload document');
    }
    return response.data as UserDocument;
  },

  // Get shipping addresses
  async getShippingAddresses(): Promise<ShippingAddress[]> {
    const response = await apiClient.get<ShippingAddress[]>('/users/shipping-addresses');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch shipping addresses');
    }
    return response.data;
  },

  // Add shipping address
  async addShippingAddress(address: Omit<ShippingAddress, 'id' | 'createdAt' | 'updatedAt'>): Promise<ShippingAddress> {
    const response = await apiClient.post<ShippingAddress>('/users/shipping-addresses', address);
    if (!response.success) {
      throw new Error(response.error || 'Failed to add shipping address');
    }
    return response.data;
  },

  // Update shipping address
  async updateShippingAddress(id: string, address: Partial<ShippingAddress>): Promise<ShippingAddress> {
    const response = await apiClient.put<ShippingAddress>(`/users/shipping-addresses/${id}`, address);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update shipping address');
    }
    return response.data;
  },

  // Delete shipping address
  async deleteShippingAddress(id: string): Promise<void> {
    const response = await apiClient.delete(`/users/shipping-addresses/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete shipping address');
    }
  },

  // Set default shipping address
  async setDefaultShippingAddress(id: string): Promise<void> {
    const response = await apiClient.patch(`/users/shipping-addresses/${id}/default`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to set default shipping address');
    }
  },

  // Get user statistics
  async getStats(): Promise<{
    totalOrders: number;
    totalSpent: number;
    activeRFQs: number;
    wishlistCount: number;
  }> {
    const response = await apiClient.get('/users/stats');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch user stats');
    }
    return response.data as {
      totalOrders: number;
      totalSpent: number;
      activeRFQs: number;
      wishlistCount: number;
    };
  },

  // Change password
  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    const response = await apiClient.post('/auth/change-password', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to change password');
    }
  },

  // Send email verification
  async sendEmailVerification(): Promise<void> {
    const response = await apiClient.post('/auth/send-verification-email');
    if (!response.success) {
      throw new Error(response.error || 'Failed to send verification email');
    }
  },

  // Verify email
  async verifyEmail(token: string): Promise<void> {
    const response = await apiClient.get(`/auth/verify-email/${token}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to verify email');
    }
  },

  // Enable 2FA
  async enable2FA(): Promise<{ secret: string; qrCode: string }> {
    const response = await apiClient.post('/auth/2fa/enable');
    if (!response.success) {
      throw new Error(response.error || 'Failed to enable 2FA');
    }
    return response.data as { secret: string; qrCode: string };
  },

  // Disable 2FA
  async disable2FA(): Promise<void> {
    const response = await apiClient.post('/auth/2fa/disable');
    if (!response.success) {
      throw new Error(response.error || 'Failed to disable 2FA');
    }
  },

  // Verify 2FA
  async verify2FA(code: string): Promise<void> {
    const response = await apiClient.post('/auth/2fa/verify', { code });
    if (!response.success) {
      throw new Error(response.error || 'Failed to verify 2FA');
    }
  },

  // Get user sessions
  async getSessions(): Promise<Array<{
    id: string;
    deviceInfo: any;
    location: any;
    isCurrent: boolean;
    lastActivity: string;
    createdAt: string;
  }>> {
    const response = await apiClient.get('/auth/sessions');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch sessions');
    }
    return response.data as Array<{
      id: string;
      deviceInfo: any;
      location: any;
      isCurrent: boolean;
      lastActivity: string;
      createdAt: string;
    }>;
  },

  // Revoke session
  async revokeSession(sessionId: string): Promise<void> {
    const response = await apiClient.delete(`/auth/sessions/${sessionId}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to revoke session');
    }
  },

  // Revoke all sessions
  async revokeAllSessions(): Promise<void> {
    const response = await apiClient.delete('/auth/sessions');
    if (!response.success) {
      throw new Error(response.error || 'Failed to revoke all sessions');
    }
  }
};