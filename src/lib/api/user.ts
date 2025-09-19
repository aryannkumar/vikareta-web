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
    const response = await apiClient.get<UserProfile>('/users/profile');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch profile');
    }
    return response.data;
  },

  // Update user profile
  async updateProfile(data: UpdateUserProfile): Promise<UserProfile> {
    const response = await apiClient.put<UserProfile>('/users/profile', data);
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
    const response = await apiClient.get<UserDocument[]>('/users/verification-documents');
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
    const response = await apiClient.upload('/users/verification-documents', formData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to upload document');
    }
    return response.data as UserDocument;
  },

  // Get shipping addresses
  async getShippingAddresses(): Promise<ShippingAddress[]> {
    throw new Error('Use shipping API for address management');
  },

  // Add shipping address
  async addShippingAddress(address: Omit<ShippingAddress, 'id' | 'createdAt' | 'updatedAt'>): Promise<ShippingAddress> {
    throw new Error('Use shipping API for address management');
  },

  // Update shipping address
  async updateShippingAddress(id: string, address: Partial<ShippingAddress>): Promise<ShippingAddress> {
    throw new Error('Use shipping API for address management');
  },

  // Delete shipping address
  async deleteShippingAddress(id: string): Promise<void> {
    throw new Error('Use shipping API for address management');
  },

  // Set default shipping address
  async setDefaultShippingAddress(id: string): Promise<void> {
    throw new Error('Use shipping API for address management');
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
    throw new Error('Change password endpoint not available');
  },

  // Send email verification
  async sendEmailVerification(): Promise<void> {
    throw new Error('Send email verification endpoint not available');
  },

  // Verify email
  async verifyEmail(token: string): Promise<void> {
    throw new Error('Verify email endpoint not available');
  },

  // Enable 2FA
  async enable2FA(): Promise<{ secret: string; qrCode: string }> {
    throw new Error('Enable 2FA endpoint not available');
  },

  // Disable 2FA
  async disable2FA(): Promise<void> {
    throw new Error('Disable 2FA endpoint not available');
  },

  // Verify 2FA
  async verify2FA(code: string): Promise<void> {
    throw new Error('Verify 2FA endpoint not available');
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
    throw new Error('Get sessions endpoint not available');
  },

  // Revoke session
  async revokeSession(sessionId: string): Promise<void> {
    throw new Error('Revoke session endpoint not available');
  },

  // Revoke all sessions
  async revokeAllSessions(): Promise<void> {
    throw new Error('Revoke all sessions endpoint not available');
  }
};