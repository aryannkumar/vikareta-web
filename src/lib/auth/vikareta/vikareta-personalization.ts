/**
 * Vikareta Platform - Frontend Personalization Service
 * Client-side service for managing guest user personalization
 * Handles API communication and local storage caching
 */

import {
  GuestPersonalizationData,
  PersonalizationUpdate,
  PersonalizationPreferences,
  CartItem,
  ProductRecommendation
} from './vikareta-auth-types';

export class VikaretaPersonalizationService {
  private readonly API_BASE = '/api/personalization';
  private readonly CACHE_KEY = 'vikareta_guest_personalization';
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Get guest personalization data
   */
  async getGuestPersonalization(): Promise<GuestPersonalizationData | null> {
    try {
      // Check local cache first
      const cached = this.getCachedPersonalization();
      if (cached) {
        return cached;
      }

      const response = await fetch(`${this.API_BASE}/guest`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          return null; // No valid guest session
        }
        throw new Error('Failed to get personalization data');
      }

      const result = await response.json();
      if (result.success && result.data) {
        // Cache the data
        this.setCachedPersonalization(result.data);
        return result.data;
      }

      return null;
    } catch (error) {
      console.error('Failed to get guest personalization:', error);
      return null;
    }
  }

  /**
   * Update guest preferences
   */
  async updatePreferences(preferences: Partial<PersonalizationPreferences>): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/guest/preferences`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }

      const result = await response.json();

      // Clear cache to force refresh
      this.clearCache();

      return result.success;
    } catch (error) {
      console.error('Failed to update preferences:', error);
      return false;
    }
  }

  /**
   * Add product to recently viewed
   */
  async addToRecentlyViewed(productId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/guest/recently-viewed`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to recently viewed');
      }

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Failed to add to recently viewed:', error);
      return false;
    }
  }

  /**
   * Add search term to history
   */
  async addToSearchHistory(searchTerm: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/guest/search-history`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchTerm }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to search history');
      }

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Failed to add to search history:', error);
      return false;
    }
  }

  /**
   * Update category view count
   */
  async updateCategoryView(categoryId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/guest/category-view`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categoryId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update category view');
      }

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Failed to update category view:', error);
      return false;
    }
  }

  /**
   * Add item to cart
   */
  async addToCart(productId: string, quantity: number = 1, variant?: Record<string, any>): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/guest/cart`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity, variant }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      const result = await response.json();

      // Clear cache to force refresh
      this.clearCache();

      return result.success;
    } catch (error) {
      console.error('Failed to add to cart:', error);
      return false;
    }
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(productId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/guest/cart`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove from cart');
      }

      const result = await response.json();

      // Clear cache to force refresh
      this.clearCache();

      return result.success;
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      return false;
    }
  }

  /**
   * Update cart item quantity
   */
  async updateCartItemQuantity(productId: string, quantity: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/guest/cart/quantity`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!response.ok) {
        throw new Error('Failed to update cart item quantity');
      }

      const result = await response.json();

      // Clear cache to force refresh
      this.clearCache();

      return result.success;
    } catch (error) {
      console.error('Failed to update cart item quantity:', error);
      return false;
    }
  }

  /**
   * Toggle product in wishlist
   */
  async toggleWishlist(productId: string): Promise<{ success: boolean; wasAdded: boolean }> {
    try {
      const response = await fetch(`${this.API_BASE}/guest/wishlist/toggle`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle wishlist');
      }

      const result = await response.json();

      // Clear cache to force refresh
      this.clearCache();

      return {
        success: result.success,
        wasAdded: result.data?.wasAdded || false,
      };
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
      return { success: false, wasAdded: false };
    }
  }

  /**
   * Update session activity
   */
  async updateSessionActivity(activity: {
    pageViews?: number;
    timeSpent?: number;
    deviceInfo?: Record<string, any>;
  }): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/guest/session-activity`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activity),
      });

      if (!response.ok) {
        throw new Error('Failed to update session activity');
      }

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Failed to update session activity:', error);
      return false;
    }
  }

  /**
   * Get personalized recommendations
   */
  async getPersonalizedRecommendations(): Promise<{
    recentlyViewed: string[];
    recommendedProducts: string[];
    trendingCategories: string[];
    suggestedSearches: string[];
  } | null> {
    try {
      const response = await fetch(`${this.API_BASE}/guest/recommendations`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }

      const result = await response.json();
      return result.success ? result.data : null;
    } catch (error) {
      console.error('Failed to get personalized recommendations:', error);
      return null;
    }
  }

  /**
   * Clear personalization data
   */
  async clearPersonalization(): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/guest`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to clear personalization');
      }

      const result = await response.json();

      // Clear local cache
      this.clearCache();

      return result.success;
    } catch (error) {
      console.error('Failed to clear personalization:', error);
      return false;
    }
  }

  /**
   * Get cached personalization data
   */
  private getCachedPersonalization(): GuestPersonalizationData | null {
    try {
      if (typeof window === 'undefined') return null;

      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);

      // Check if cache is still valid
      if (Date.now() - timestamp > this.CACHE_DURATION) {
        localStorage.removeItem(this.CACHE_KEY);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to get cached personalization:', error);
      return null;
    }
  }

  /**
   * Set cached personalization data
   */
  private setCachedPersonalization(data: GuestPersonalizationData): void {
    try {
      if (typeof window === 'undefined') return;

      const cacheData = {
        data,
        timestamp: Date.now(),
      };

      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Failed to cache personalization:', error);
    }
  }

  /**
   * Clear local cache
   */
  private clearCache(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(this.CACHE_KEY);
      }
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  /**
   * Track page view
   */
  async trackPageView(page: string): Promise<void> {
    await this.updateSessionActivity({ pageViews: 1 });
  }

  /**
   * Track time spent on page
   */
  async trackTimeSpent(seconds: number): Promise<void> {
    await this.updateSessionActivity({ timeSpent: seconds });
  }

  /**
   * Get trending categories (public endpoint)
   */
  async getTrendingCategories(period: 'daily' | 'weekly' | 'monthly' = 'weekly', limit: number = 10): Promise<any[]> {
    try {
      const response = await fetch(`${this.API_BASE}/trending-categories?period=${period}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get trending categories');
      }

      const result = await response.json();
      return result.success ? result.data : [];
    } catch (error) {
      console.error('Failed to get trending categories:', error);
      return [];
    }
  }
}

// Export singleton instance
export const vikaretaPersonalization = new VikaretaPersonalizationService();