/**
 * Vikareta Platform - Personalization Hook
 * React hook for managing guest user personalization
 * Integrates with auth system and provides reactive state
 */

'use client';

import { useState, useEffect, useCallback, useContext } from 'react';
import { vikaretaPersonalization } from '../vikareta-personalization';
import { GuestPersonalizationData, PersonalizationPreferences, CartItem } from '../vikareta-auth-types';
import { useVikaretaAuth } from './use-vikareta-auth';

export interface UsePersonalizationReturn {
  // State
  personalization: GuestPersonalizationData | null;
  isLoading: boolean;
  error: string | null;

  // Preferences
  updatePreferences: (preferences: Partial<PersonalizationPreferences>) => Promise<boolean>;
  getPreferences: () => PersonalizationPreferences | null;

  // Browsing History
  addToRecentlyViewed: (productId: string) => Promise<boolean>;
  addToSearchHistory: (searchTerm: string) => Promise<boolean>;
  updateCategoryView: (categoryId: string) => Promise<boolean>;

  // Cart Management
  addToCart: (productId: string, quantity?: number, variant?: Record<string, any>) => Promise<boolean>;
  removeFromCart: (productId: string) => Promise<boolean>;
  updateCartQuantity: (productId: string, quantity: number) => Promise<boolean>;
  getCartItems: () => CartItem[];

  // Wishlist
  toggleWishlist: (productId: string) => Promise<{ success: boolean; wasAdded: boolean }>;
  isInWishlist: (productId: string) => boolean;

  // Recommendations
  getRecommendations: () => Promise<{
    recentlyViewed: string[];
    recommendedProducts: string[];
    trendingCategories: string[];
    suggestedSearches: string[];
  } | null>;

  // Session Tracking
  trackPageView: (page?: string) => Promise<void>;
  trackTimeSpent: (seconds: number) => Promise<void>;

  // Utility
  refresh: () => Promise<void>;
  clear: () => Promise<boolean>;
}

/**
 * Personalization hook for all users
 * Works for both authenticated and unauthenticated users
 */
export function usePersonalization(): UsePersonalizationReturn {
  const { user, isAuthenticated } = useVikaretaAuth();
  const [personalization, setPersonalization] = useState<GuestPersonalizationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Allow personalization for all users (authenticated or not)
  const canUsePersonalization = true;

  /**
   * Load personalization data
   */
  const loadPersonalization = useCallback(async () => {
    if (!canUsePersonalization) {
      setPersonalization(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const data = await vikaretaPersonalization.getGuestPersonalization();
      setPersonalization(data);
    } catch (err) {
      console.error('Failed to load personalization:', err);
      setError(err instanceof Error ? err.message : 'Failed to load personalization');
    } finally {
      setIsLoading(false);
    }
  }, [canUsePersonalization]);

  /**
   * Update preferences
   */
  const updatePreferences = useCallback(async (preferences: Partial<PersonalizationPreferences>): Promise<boolean> => {
    if (!canUsePersonalization) return false;

    try {
      const success = await vikaretaPersonalization.updatePreferences(preferences);
      if (success) {
        await loadPersonalization(); // Refresh data
      }
      return success;
    } catch (err) {
      console.error('Failed to update preferences:', err);
      setError(err instanceof Error ? err.message : 'Failed to update preferences');
      return false;
    }
  }, [canUsePersonalization, loadPersonalization]);

  /**
   * Get current preferences
   */
  const getPreferences = useCallback((): PersonalizationPreferences | null => {
    return personalization?.preferences || null;
  }, [personalization]);

  /**
   * Add product to recently viewed
   */
  const addToRecentlyViewed = useCallback(async (productId: string): Promise<boolean> => {
    if (!canUsePersonalization) return false;

    try {
      const success = await vikaretaPersonalization.addToRecentlyViewed(productId);
      if (success) {
        // Optimistically update local state
        setPersonalization(prev => {
          if (!prev) return prev;
          const recentlyViewed = [productId, ...prev.browsingHistory.recentlyViewed.filter(id => id !== productId)].slice(0, 20);
          return {
            ...prev,
            browsingHistory: {
              ...prev.browsingHistory,
              recentlyViewed,
            },
          };
        });
      }
      return success;
    } catch (err) {
      console.error('Failed to add to recently viewed:', err);
      return false;
    }
  }, [canUsePersonalization]);

  /**
   * Add search term to history
   */
  const addToSearchHistory = useCallback(async (searchTerm: string): Promise<boolean> => {
    if (!canUsePersonalization) return false;

    try {
      const success = await vikaretaPersonalization.addToSearchHistory(searchTerm);
      if (success) {
        // Optimistically update local state
        setPersonalization(prev => {
          if (!prev) return prev;
          const searchHistory = [searchTerm, ...prev.browsingHistory.searchHistory.filter(term => term !== searchTerm)].slice(0, 10);
          return {
            ...prev,
            browsingHistory: {
              ...prev.browsingHistory,
              searchHistory,
            },
          };
        });
      }
      return success;
    } catch (err) {
      console.error('Failed to add to search history:', err);
      return false;
    }
  }, [canUsePersonalization]);

  /**
   * Update category view count
   */
  const updateCategoryView = useCallback(async (categoryId: string): Promise<boolean> => {
    if (!canUsePersonalization) return false;

    try {
      const success = await vikaretaPersonalization.updateCategoryView(categoryId);
      if (success) {
        // Optimistically update local state
        setPersonalization(prev => {
          if (!prev) return prev;
          const categoryViews = { ...prev.browsingHistory.categoryViews };
          categoryViews[categoryId] = (categoryViews[categoryId] || 0) + 1;
          return {
            ...prev,
            browsingHistory: {
              ...prev.browsingHistory,
              categoryViews,
            },
          };
        });
      }
      return success;
    } catch (err) {
      console.error('Failed to update category view:', err);
      return false;
    }
  }, [canUsePersonalization]);

  /**
   * Add item to cart
   */
  const addToCart = useCallback(async (
    productId: string,
    quantity: number = 1,
    variant?: Record<string, any>
  ): Promise<boolean> => {
    if (!canUsePersonalization) return false;

    try {
      const success = await vikaretaPersonalization.addToCart(productId, quantity, variant);
      if (success) {
        await loadPersonalization(); // Refresh cart data
      }
      return success;
    } catch (err) {
      console.error('Failed to add to cart:', err);
      return false;
    }
  }, [canUsePersonalization, loadPersonalization]);

  /**
   * Remove item from cart
   */
  const removeFromCart = useCallback(async (productId: string): Promise<boolean> => {
    if (!canUsePersonalization) return false;

    try {
      const success = await vikaretaPersonalization.removeFromCart(productId);
      if (success) {
        await loadPersonalization(); // Refresh cart data
      }
      return success;
    } catch (err) {
      console.error('Failed to remove from cart:', err);
      return false;
    }
  }, [canUsePersonalization, loadPersonalization]);

  /**
   * Update cart item quantity
   */
  const updateCartQuantity = useCallback(async (productId: string, quantity: number): Promise<boolean> => {
    if (!canUsePersonalization) return false;

    try {
      const success = await vikaretaPersonalization.updateCartItemQuantity(productId, quantity);
      if (success) {
        await loadPersonalization(); // Refresh cart data
      }
      return success;
    } catch (err) {
      console.error('Failed to update cart quantity:', err);
      return false;
    }
  }, [canUsePersonalization, loadPersonalization]);

  /**
   * Get cart items
   */
  const getCartItems = useCallback((): CartItem[] => {
    return personalization?.cart.items || [];
  }, [personalization]);

  /**
   * Toggle product in wishlist
   */
  const toggleWishlist = useCallback(async (productId: string): Promise<{ success: boolean; wasAdded: boolean }> => {
    if (!canUsePersonalization) return { success: false, wasAdded: false };

    try {
      const result = await vikaretaPersonalization.toggleWishlist(productId);
      if (result.success) {
        await loadPersonalization(); // Refresh wishlist data
      }
      return result;
    } catch (err) {
      console.error('Failed to toggle wishlist:', err);
      return { success: false, wasAdded: false };
    }
  }, [canUsePersonalization, loadPersonalization]);

  /**
   * Check if product is in wishlist
   */
  const isInWishlist = useCallback((productId: string): boolean => {
    return personalization?.wishlist.includes(productId) || false;
  }, [personalization]);

  /**
   * Get personalized recommendations
   */
  const getRecommendations = useCallback(async () => {
    if (!canUsePersonalization) return null;

    try {
      return await vikaretaPersonalization.getPersonalizedRecommendations();
    } catch (err) {
      console.error('Failed to get recommendations:', err);
      return null;
    }
  }, [canUsePersonalization]);

  /**
   * Track page view
   */
  const trackPageView = useCallback(async (page?: string): Promise<void> => {
    if (!canUsePersonalization) return;

    try {
      await vikaretaPersonalization.trackPageView(page || window.location.pathname);
    } catch (err) {
      console.error('Failed to track page view:', err);
    }
  }, [canUsePersonalization]);

  /**
   * Track time spent on page
   */
  const trackTimeSpent = useCallback(async (seconds: number): Promise<void> => {
    if (!canUsePersonalization) return;

    try {
      await vikaretaPersonalization.trackTimeSpent(seconds);
    } catch (err) {
      console.error('Failed to track time spent:', err);
    }
  }, [canUsePersonalization]);

  /**
   * Refresh personalization data
   */
  const refresh = useCallback(async (): Promise<void> => {
    await loadPersonalization();
  }, [loadPersonalization]);

  /**
   * Clear personalization data
   */
  const clear = useCallback(async (): Promise<boolean> => {
    if (!canUsePersonalization) return false;

    try {
      const success = await vikaretaPersonalization.clearPersonalization();
      if (success) {
        setPersonalization(null);
      }
      return success;
    } catch (err) {
      console.error('Failed to clear personalization:', err);
      return false;
    }
  }, [canUsePersonalization]);

  // Load personalization data when component mounts or auth state changes
  useEffect(() => {
    loadPersonalization();
  }, [loadPersonalization]);

  // Clear personalization when user logs out or switches from guest
  useEffect(() => {
    if (!canUsePersonalization) {
      setPersonalization(null);
      setError(null);
    }
  }, [canUsePersonalization]);

  return {
    // State
    personalization,
    isLoading,
    error,

    // Preferences
    updatePreferences,
    getPreferences,

    // Browsing History
    addToRecentlyViewed,
    addToSearchHistory,
    updateCategoryView,

    // Cart Management
    addToCart,
    removeFromCart,
    updateCartQuantity,
    getCartItems,

    // Wishlist
    toggleWishlist,
    isInWishlist,

    // Recommendations
    getRecommendations,

    // Session Tracking
    trackPageView,
    trackTimeSpent,

    // Utility
    refresh,
    clear,
  };
}