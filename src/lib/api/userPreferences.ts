import { apiClient } from './client';

// User Preference Types
export interface UserPreference {
  id: string;
  userId: string;
  preferredCategories: string[];
  preferredSubcategories: string[];
  minPriceRange: number;
  maxPriceRange: number;
  preferredPriceRange: 'budget' | 'mid-range' | 'premium';
  preferredLocations: string[];
  deliveryRadius: number;
  preferredBusinessTypes: string[];
  preferredIndustries: string[];
  theme: 'light' | 'dark';
  language: string;
  currency: string;
  itemsPerPage: number;
  emailFrequency: 'never' | 'daily' | 'weekly' | 'monthly';
  smsFrequency: 'never' | 'important' | 'all';
  showRecommended: boolean;
  showTrending: boolean;
  showNearby: boolean;
  showNewArrivals: boolean;
  profileVisibility: 'public' | 'private' | 'business';
  showOnlineStatus: boolean;
  allowMessaging: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryPreference {
  id: string;
  userId: string;
  categoryId: string;
  viewCount: number;
  clickCount: number;
  purchaseCount: number;
  searchCount: number;
  preferenceScore: number;
  firstViewed: string;
  lastViewed: string;
  lastPurchased?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserInterest {
  id: string;
  userId: string;
  interestType: 'category' | 'industry' | 'location' | 'price_range';
  interestValue: string;
  strength: number;
  confidence: number;
  source: 'behavior' | 'explicit' | 'demographic';
  firstObserved: string;
  lastObserved: string;
  observationCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PersonalizedRecommendation {
  id: string;
  userId: string;
  categoryId?: string;
  productId?: string;
  serviceId?: string;
  recommendationType: 'category' | 'product' | 'service';
  recommendationScore: number;
  reason: string;
  isViewed: boolean;
  isClicked: boolean;
  isPurchased: boolean;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrendingCategory {
  id: string;
  categoryId: string;
  viewCount: number;
  searchCount: number;
  orderCount: number;
  trendingScore: number;
  growthRate: number;
  period: 'daily' | 'weekly' | 'monthly';
  periodStart: string;
  periodEnd: string;
  createdAt: string;
  updatedAt: string;
}

// Update User Preferences
export interface UpdateUserPreference {
  preferredCategories?: string[];
  preferredSubcategories?: string[];
  minPriceRange?: number;
  maxPriceRange?: number;
  preferredPriceRange?: 'budget' | 'mid-range' | 'premium';
  preferredLocations?: string[];
  deliveryRadius?: number;
  preferredBusinessTypes?: string[];
  preferredIndustries?: string[];
  theme?: 'light' | 'dark';
  language?: string;
  currency?: string;
  itemsPerPage?: number;
  emailFrequency?: 'never' | 'daily' | 'weekly' | 'monthly';
  smsFrequency?: 'never' | 'important' | 'all';
  showRecommended?: boolean;
  showTrending?: boolean;
  showNearby?: boolean;
  showNewArrivals?: boolean;
  profileVisibility?: 'public' | 'private' | 'business';
  showOnlineStatus?: boolean;
  allowMessaging?: boolean;
}

export const userPreferencesApi = {
  // User Preferences
  async getUserPreferences(): Promise<UserPreference> {
    const response = await apiClient.get<UserPreference>('/personalization/preferences');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch user preferences');
    }
    return response.data;
  },

  async updateUserPreferences(data: UpdateUserPreference): Promise<UserPreference> {
    const response = await apiClient.put<UserPreference>('/personalization/preferences', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update user preferences');
    }
    return response.data;
  },

  async createUserPreferences(data: UpdateUserPreference): Promise<UserPreference> {
    const response = await apiClient.post<UserPreference>('/personalization/preferences', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to create user preferences');
    }
    return response.data;
  },

  // Category Preferences
  async getCategoryPreferences(): Promise<CategoryPreference[]> {
    const response = await apiClient.get<CategoryPreference[]>('/personalization/category-preferences');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch category preferences');
    }
    return response.data;
  },

  async updateCategoryPreference(categoryId: string, data: Partial<CategoryPreference>): Promise<CategoryPreference> {
    const response = await apiClient.put<CategoryPreference>(`/personalization/category-preferences/${categoryId}`, data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update category preference');
    }
    return response.data;
  },

  async trackCategoryInteraction(categoryId: string, action: 'view' | 'click' | 'purchase' | 'search'): Promise<void> {
    const response = await apiClient.post('/personalization/category-interaction', {
      categoryId,
      action,
      timestamp: new Date().toISOString()
    });
    if (!response.success) {
      throw new Error(response.error || 'Failed to track category interaction');
    }
  },

  // User Interests
  async getUserInterests(): Promise<UserInterest[]> {
    const response = await apiClient.get<UserInterest[]>('/personalization/interests');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch user interests');
    }
    return response.data;
  },

  async updateUserInterest(interestId: string, data: Partial<UserInterest>): Promise<UserInterest> {
    const response = await apiClient.put<UserInterest>(`/personalization/interests/${interestId}`, data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update user interest');
    }
    return response.data;
  },

  // Personalized Recommendations
  async getPersonalizedRecommendations(limit: number = 10): Promise<PersonalizedRecommendation[]> {
    const response = await apiClient.get<PersonalizedRecommendation[]>(`/personalization/recommendations?limit=${limit}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch personalized recommendations');
    }
    return response.data;
  },

  async trackRecommendationInteraction(recommendationId: string, action: 'view' | 'click' | 'purchase'): Promise<void> {
    const response = await apiClient.post('/personalization/recommendation-interaction', {
      recommendationId,
      action,
      timestamp: new Date().toISOString()
    });
    if (!response.success) {
      throw new Error(response.error || 'Failed to track recommendation interaction');
    }
  },

  // Trending Categories
  async getTrendingCategories(period: 'daily' | 'weekly' | 'monthly' = 'weekly', limit: number = 10): Promise<TrendingCategory[]> {
    const response = await apiClient.get<TrendingCategory[]>(`/personalization/trending-categories?period=${period}&limit=${limit}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch trending categories');
    }
    return response.data;
  },

  // Personalized Categories for Home Page
  async getPersonalizedCategories(limit: number = 12): Promise<any[]> {
    const response = await apiClient.get<any[]>(`/personalization/categories?limit=${limit}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch personalized categories');
    }
    return response.data;
  },

  // Search History
  async getSearchHistory(limit: number = 20): Promise<any[]> {
    const response = await apiClient.get<any[]>(`/personalization/search-history?limit=${limit}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch search history');
    }
    return response.data;
  },

  async addSearchQuery(query: string, categoryId?: string): Promise<void> {
    const response = await apiClient.post('/personalization/search-history', {
      query,
      categoryId,
      timestamp: new Date().toISOString()
    });
    if (!response.success) {
      throw new Error(response.error || 'Failed to add search query');
    }
  },

  // Reset Personalization Data
  async resetPersonalizationData(): Promise<void> {
    const response = await apiClient.delete('/personalization/reset');
    if (!response.success) {
      throw new Error(response.error || 'Failed to reset personalization data');
    }
  }
};