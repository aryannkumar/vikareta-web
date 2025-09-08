'use client';

import { useState, useEffect, useCallback } from 'react';
import { useVikaretaAuth } from '@/lib/auth/vikareta/hooks/use-vikareta-auth';
import { userPreferencesApi, type UserPreference, type CategoryPreference, type UserInterest, type PersonalizedRecommendation, type TrendingCategory } from '@/lib/api/userPreferences';

interface PersonalizationState {
  userPreferences: UserPreference | null;
  categoryPreferences: CategoryPreference[];
  userInterests: UserInterest[];
  personalizedRecommendations: PersonalizedRecommendation[];
  trendingCategories: TrendingCategory[];
  personalizedCategories: any[];
  searchHistory: any[];
  loading: {
    preferences: boolean;
    categories: boolean;
    recommendations: boolean;
    trending: boolean;
    searchHistory: boolean;
  };
  error: string | null;
}

export function useUserPreferences() {
  const { isAuthenticated, user } = useVikaretaAuth();

  const [state, setState] = useState<PersonalizationState>({
    userPreferences: null,
    categoryPreferences: [],
    userInterests: [],
    personalizedRecommendations: [],
    trendingCategories: [],
    personalizedCategories: [],
    searchHistory: [],
    loading: {
      preferences: false,
      categories: false,
      recommendations: false,
      trending: false,
      searchHistory: false,
    },
    error: null,
  });

  // Load user preferences
  const loadUserPreferences = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    try {
      setState(prev => ({ ...prev, loading: { ...prev.loading, preferences: true }, error: null }));
      const preferences = await userPreferencesApi.getUserPreferences();
      setState(prev => ({ ...prev, userPreferences: preferences, loading: { ...prev.loading, preferences: false } }));
    } catch (error) {
      console.error('Failed to load user preferences:', error);
      setState(prev => ({
        ...prev,
        loading: { ...prev.loading, preferences: false },
        error: error instanceof Error ? error.message : 'Failed to load preferences'
      }));
    }
  }, [isAuthenticated, user]);

  // Load category preferences
  const loadCategoryPreferences = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    try {
      setState(prev => ({ ...prev, loading: { ...prev.loading, categories: true } }));
      const preferences = await userPreferencesApi.getCategoryPreferences();
      setState(prev => ({ ...prev, categoryPreferences: preferences, loading: { ...prev.loading, categories: false } }));
    } catch (error) {
      console.error('Failed to load category preferences:', error);
      setState(prev => ({ ...prev, loading: { ...prev.loading, categories: false } }));
    }
  }, [isAuthenticated, user]);

  // Load personalized recommendations
  const loadPersonalizedRecommendations = useCallback(async (limit: number = 10) => {
    if (!isAuthenticated || !user) return;

    try {
      setState(prev => ({ ...prev, loading: { ...prev.loading, recommendations: true } }));
      const recommendations = await userPreferencesApi.getPersonalizedRecommendations(limit);
      setState(prev => ({
        ...prev,
        personalizedRecommendations: recommendations,
        loading: { ...prev.loading, recommendations: false }
      }));
    } catch (error) {
      console.error('Failed to load personalized recommendations:', error);
      setState(prev => ({ ...prev, loading: { ...prev.loading, recommendations: false } }));
    }
  }, [isAuthenticated, user]);

  // Load trending categories
  const loadTrendingCategories = useCallback(async (period: 'daily' | 'weekly' | 'monthly' = 'weekly', limit: number = 10) => {
    try {
      setState(prev => ({ ...prev, loading: { ...prev.loading, trending: true } }));
      const trending = await userPreferencesApi.getTrendingCategories(period, limit);
      setState(prev => ({
        ...prev,
        trendingCategories: trending,
        loading: { ...prev.loading, trending: false }
      }));
    } catch (error) {
      console.error('Failed to load trending categories:', error);
      setState(prev => ({ ...prev, loading: { ...prev.loading, trending: false } }));
    }
  }, []);

  // Load personalized categories
  const loadPersonalizedCategories = useCallback(async (limit: number = 12) => {
    if (!isAuthenticated || !user) {
      // For non-authenticated users, load default categories
      try {
        setState(prev => ({ ...prev, loading: { ...prev.loading, categories: true } }));
        const categories = await userPreferencesApi.getPersonalizedCategories(limit);
        setState(prev => ({
          ...prev,
          personalizedCategories: categories,
          loading: { ...prev.loading, categories: false }
        }));
      } catch (error) {
        console.error('Failed to load personalized categories:', error);
        setState(prev => ({ ...prev, loading: { ...prev.loading, categories: false } }));
      }
      return;
    }

    try {
      setState(prev => ({ ...prev, loading: { ...prev.loading, categories: true } }));
      const categories = await userPreferencesApi.getPersonalizedCategories(limit);
      setState(prev => ({
        ...prev,
        personalizedCategories: categories,
        loading: { ...prev.loading, categories: false }
      }));
    } catch (error) {
      console.error('Failed to load personalized categories:', error);
      setState(prev => ({ ...prev, loading: { ...prev.loading, categories: false } }));
    }
  }, [isAuthenticated, user]);

  // Load search history
  const loadSearchHistory = useCallback(async (limit: number = 20) => {
    if (!isAuthenticated || !user) return;

    try {
      setState(prev => ({ ...prev, loading: { ...prev.loading, searchHistory: true } }));
      const history = await userPreferencesApi.getSearchHistory(limit);
      setState(prev => ({
        ...prev,
        searchHistory: history,
        loading: { ...prev.loading, searchHistory: false }
      }));
    } catch (error) {
      console.error('Failed to load search history:', error);
      setState(prev => ({ ...prev, loading: { ...prev.loading, searchHistory: false } }));
    }
  }, [isAuthenticated, user]);

  // Update user preferences
  const updateUserPreferences = useCallback(async (updates: any) => {
    if (!isAuthenticated || !user) return;

    try {
      setState(prev => ({ ...prev, loading: { ...prev.loading, preferences: true } }));

      let preferences;
      if (state.userPreferences) {
        preferences = await userPreferencesApi.updateUserPreferences(updates);
      } else {
        preferences = await userPreferencesApi.createUserPreferences(updates);
      }

      setState(prev => ({
        ...prev,
        userPreferences: preferences,
        loading: { ...prev.loading, preferences: false }
      }));

      return preferences;
    } catch (error) {
      console.error('Failed to update user preferences:', error);
      setState(prev => ({
        ...prev,
        loading: { ...prev.loading, preferences: false },
        error: error instanceof Error ? error.message : 'Failed to update preferences'
      }));
      throw error;
    }
  }, [isAuthenticated, user, state.userPreferences]);

  // Track category interaction
  const trackCategoryInteraction = useCallback(async (categoryId: string, action: 'view' | 'click' | 'purchase' | 'search') => {
    if (!isAuthenticated || !user) return;

    try {
      await userPreferencesApi.trackCategoryInteraction(categoryId, action);

      // Update local state if needed
      if (action === 'view' || action === 'click') {
        setState(prev => ({
          ...prev,
          categoryPreferences: prev.categoryPreferences.map(pref =>
            pref.categoryId === categoryId
              ? {
                  ...pref,
                  [action === 'view' ? 'viewCount' : 'clickCount']:
                    (action === 'view' ? pref.viewCount : pref.clickCount) + 1,
                  lastViewed: new Date().toISOString()
                }
              : pref
          )
        }));
      }
    } catch (error) {
      console.error('Failed to track category interaction:', error);
      // Don't throw error for tracking failures
    }
  }, [isAuthenticated, user]);

  // Track recommendation interaction
  const trackRecommendationInteraction = useCallback(async (recommendationId: string, action: 'view' | 'click' | 'purchase') => {
    if (!isAuthenticated || !user) return;

    try {
      await userPreferencesApi.trackRecommendationInteraction(recommendationId, action);

      // Update local state
      setState(prev => ({
        ...prev,
        personalizedRecommendations: prev.personalizedRecommendations.map(rec =>
          rec.id === recommendationId
            ? {
                ...rec,
                [action === 'view' ? 'isViewed' : action === 'click' ? 'isClicked' : 'isPurchased']: true
              }
            : rec
        )
      }));
    } catch (error) {
      console.error('Failed to track recommendation interaction:', error);
      // Don't throw error for tracking failures
    }
  }, [isAuthenticated, user]);

  // Add search query
  const addSearchQuery = useCallback(async (query: string, categoryId?: string) => {
    if (!isAuthenticated || !user) return;

    try {
      await userPreferencesApi.addSearchQuery(query, categoryId);
      // Optionally refresh search history
      await loadSearchHistory();
    } catch (error) {
      console.error('Failed to add search query:', error);
      // Don't throw error for search tracking failures
    }
  }, [isAuthenticated, user, loadSearchHistory]);

  // Load all personalization data
  const loadAllPersonalizationData = useCallback(async () => {
    await Promise.allSettled([
      loadUserPreferences(),
      loadCategoryPreferences(),
      loadPersonalizedRecommendations(),
      loadTrendingCategories(),
      loadPersonalizedCategories(),
      loadSearchHistory(),
    ]);
  }, [
    loadUserPreferences,
    loadCategoryPreferences,
    loadPersonalizedRecommendations,
    loadTrendingCategories,
    loadPersonalizedCategories,
    loadSearchHistory,
  ]);

  // Initialize personalization data when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      loadAllPersonalizationData();
    } else {
      // Reset state for non-authenticated users
      setState(prev => ({
        ...prev,
        userPreferences: null,
        categoryPreferences: [],
        userInterests: [],
        personalizedRecommendations: [],
        searchHistory: [],
      }));
    }
  }, [isAuthenticated, user, loadAllPersonalizationData]);

  // Load trending categories and personalized categories for all users
  useEffect(() => {
    loadTrendingCategories();
    loadPersonalizedCategories();
  }, [loadTrendingCategories, loadPersonalizedCategories]);

  return {
    // State
    ...state,

    // Actions
    loadUserPreferences,
    loadCategoryPreferences,
    loadPersonalizedRecommendations,
    loadTrendingCategories,
    loadPersonalizedCategories,
    loadSearchHistory,
    loadAllPersonalizationData,
    updateUserPreferences,
    trackCategoryInteraction,
    trackRecommendationInteraction,
    addSearchQuery,
  };
}