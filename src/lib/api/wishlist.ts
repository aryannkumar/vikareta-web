import { apiClient } from './client';

export interface WishlistItem {
  id: string;
  type: 'product' | 'service' | 'business';
  itemId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  provider: string;
  providerId: string;
  category: string;
  rating: number;
  reviewCount: number;
  available: boolean;
  addedAt: string;
  // Business-specific fields
  location?: string;
  bio?: string;
  website?: string;
  isVerified?: boolean;
}

export interface AddToWishlistData {
  itemId: string;
  type: 'product' | 'service' | 'business';
}

export interface WishlistCheckResponse {
  inWishlist: boolean;
  wishlistId: string | null;
}

export const wishlistApi = {
  // Get user's wishlist
  async getWishlist() {
    return apiClient.get<WishlistItem[]>('/wishlist');
  },

  // Add item to wishlist
  async addToWishlist(data: AddToWishlistData) {
    return apiClient.post('/wishlist', data);
  },

  // Remove item from wishlist by wishlist ID
  async removeFromWishlist(wishlistId: string) {
    return apiClient.delete(`/wishlist/${wishlistId}`);
  },

  // Remove item from wishlist by item ID and type
  async removeItemFromWishlist(type: 'product' | 'service' | 'business', itemId: string) {
    return apiClient.delete(`/wishlist/item/${type}/${itemId}`);
  },

  // Check if item is in wishlist
  async checkWishlist(type: 'product' | 'service' | 'business', itemId: string) {
    return apiClient.get<WishlistCheckResponse>(`/wishlist/check/${type}/${itemId}`);
  },

  // Clear entire wishlist
  async clearWishlist() {
    return apiClient.delete('/wishlist');
  },
};