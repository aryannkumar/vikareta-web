import { apiClient } from './client';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  businessName?: string;
  phone?: string;
  gstin?: string;
  userType: string;
  verificationTier: string;
  isVerified: boolean;
  location?: string;
  avatar?: string;
  bio?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
  stats?: {
    totalOrders: number;
    totalSpent: number;
    reviewsGiven: number;
    averageRating: number;
  };
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  businessName?: string;
  phone?: string;
  gstin?: string;
  location?: string;
  bio?: string;
  website?: string;
  avatar?: string;
}

export const profileApi = {
  /**
   * Get current user profile
   */
  async getProfile() {
    return apiClient.get<UserProfile>('/users/profile');
  },

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileData) {
    return apiClient.put<UserProfile>('/users/profile', data);
  },

  /**
   * Upload avatar image
   */
  async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return apiClient.upload<{ avatarUrl: string }>('/users/avatar', formData);
  },

  /**
   * Get user statistics
   */
  async getUserStats() {
    return apiClient.get<{
      totalOrders: number;
      totalSpent: number;
      reviewsGiven: number;
      averageRating: number;
    }>('/users/stats');
  },
};