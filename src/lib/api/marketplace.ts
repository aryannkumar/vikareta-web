import { apiClient } from './client';

export interface TrendingItem {
  id: string;
  name: string;
  description: string;
  price?: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  type: 'product' | 'service';
  provider: {
    id: string;
    name: string;
    location: string;
    verified: boolean;
  };
  promotionType: 'premium' | 'trending' | 'featured' | 'standard';
  trendingRank: number;
  views: number;
  likes: number;
  shares: number;
  tags: string[];
}

export interface NearbyBusiness {
  id: string;
  name: string;
  description: string;
  category: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  distance: number;
  address: string;
  workingHours: string;
  isOpen: boolean;
  employeeCount: number;
  productsCount: number;
  servicesCount: number;
  provider?: {
    id: string;
    name: string;
    location: string;
    verified: boolean;
  };
}

export interface MarketplaceFilters {
  location?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  radius?: number;
  sortBy?: 'trending' | 'rating' | 'distance' | 'price';
  type?: 'all' | 'businesses' | 'products' | 'services';
}

export interface TrendingResponse {
  success: boolean;
  data: TrendingItem[];
}

export interface NearbyBusinessesResponse {
  success: boolean;
  data: NearbyBusiness[];
}

export interface MarketplaceStatsResponse {
  success: boolean;
  data: {
    totalProducts: number;
    totalServices: number;
    totalBusinesses: number;
    totalViews: number;
    topCategories: Array<{
      name: string;
      count: number;
      growth: number;
    }>;
    topLocations: Array<{
      name: string;
      count: number;
      businesses: number;
    }>;
  };
}

// ===== MARKETPLACE LISTINGS INTERFACES =====
export interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  currency: string;
  images: string[];
  location: {
    city: string;
    state: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  seller: {
    id: string;
    name: string;
    rating: number;
    verified: boolean;
  };
  condition: 'new' | 'used' | 'refurbished';
  tags: string[];
  featured: boolean;
  promoted: boolean;
  status: 'active' | 'inactive' | 'sold' | 'expired';
  views: number;
  favorites: number;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

export interface MarketplaceSearchFilters {
  query?: string;
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: 'new' | 'used' | 'refurbished';
  location?: {
    city?: string;
    state?: string;
    country?: string;
    radius?: number; // in km
  };
  sellerRating?: number;
  verifiedSeller?: boolean;
  featured?: boolean;
  promoted?: boolean;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'date_desc' | 'date_asc' | 'rating_desc';
  page?: number;
  limit?: number;
}

export interface MarketplaceCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  subcategories: Array<{
    id: string;
    name: string;
    slug: string;
    description?: string;
  }>;
  totalListings: number;
  featured: boolean;
}

export interface CreateListingData {
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  currency: string;
  images: string[];
  location: {
    city: string;
    state: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  condition: 'new' | 'used' | 'refurbished';
  tags?: string[];
  featured?: boolean;
  promoted?: boolean;
}

export interface UpdateListingData extends Partial<CreateListingData> {
  status?: 'active' | 'inactive' | 'sold';
}

export interface MarketplaceStats {
  totalListings: number;
  activeListings: number;
  totalViews: number;
  totalFavorites: number;
  averagePrice: number;
  listingsByCategory: Record<string, number>;
  listingsByCondition: Record<string, number>;
  topCategories: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  recentActivity: Array<{
    type: 'listing_created' | 'listing_sold' | 'listing_expired';
    count: number;
    date: string;
  }>;
}

export class MarketplaceService {
  // ===== MARKETPLACE LISTINGS METHODS =====

  // Search marketplace listings
  static async searchListings(filters?: MarketplaceSearchFilters): Promise<{
    listings: MarketplaceListing[];
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
    searchTime: number;
    filters: MarketplaceSearchFilters;
  }> {
    const response = await apiClient.get<{
      listings: MarketplaceListing[];
      total: number;
      page: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
      searchTime: number;
      filters: MarketplaceSearchFilters;
    }>('/marketplace/listings/search', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to search marketplace listings');
    }
    return response.data;
  }

  // Get marketplace listing by ID
  static async getListing(listingId: string): Promise<MarketplaceListing> {
    const response = await apiClient.get<MarketplaceListing>(`/marketplace/listings/${listingId}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch marketplace listing');
    }
    return response.data;
  }

  // Get user's marketplace listings
  static async getUserListings(userId?: string, filters?: {
    status?: 'active' | 'inactive' | 'sold' | 'expired';
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    listings: MarketplaceListing[];
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    const endpoint = userId ? `/marketplace/users/${userId}/listings` : '/marketplace/my-listings';
    const response = await apiClient.get<{
      listings: MarketplaceListing[];
      total: number;
      page: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    }>(endpoint, filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch user listings');
    }
    return response.data;
  }

  // Create new marketplace listing
  static async createListing(data: CreateListingData): Promise<MarketplaceListing> {
    const response = await apiClient.post<MarketplaceListing>('/marketplace/listings', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to create marketplace listing');
    }
    return response.data;
  }

  // Update marketplace listing
  static async updateListing(listingId: string, data: UpdateListingData): Promise<MarketplaceListing> {
    const response = await apiClient.put<MarketplaceListing>(`/marketplace/listings/${listingId}`, data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update marketplace listing');
    }
    return response.data;
  }

  // Delete marketplace listing
  static async deleteListing(listingId: string): Promise<void> {
    const response = await apiClient.delete(`/marketplace/listings/${listingId}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete marketplace listing');
    }
  }

  // Get marketplace categories
  static async getCategories(): Promise<MarketplaceCategory[]> {
    const response = await apiClient.get<MarketplaceCategory[]>('/marketplace/categories');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch marketplace categories');
    }
    return response.data;
  }

  // Get marketplace category by slug
  static async getCategoryBySlug(slug: string): Promise<MarketplaceCategory> {
    const response = await apiClient.get<MarketplaceCategory>(`/marketplace/categories/${slug}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch marketplace category');
    }
    return response.data;
  }

  // Get featured marketplace listings
  static async getFeaturedListings(limit?: number): Promise<MarketplaceListing[]> {
    const response = await apiClient.get<MarketplaceListing[]>('/marketplace/listings/featured', { limit });
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch featured listings');
    }
    return response.data;
  }

  // Get promoted marketplace listings
  static async getPromotedListings(limit?: number): Promise<MarketplaceListing[]> {
    const response = await apiClient.get<MarketplaceListing[]>('/marketplace/listings/promoted', { limit });
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch promoted listings');
    }
    return response.data;
  }

  // Add listing to favorites
  static async addToFavorites(listingId: string): Promise<void> {
    const response = await apiClient.post('/marketplace/favorites', { listingId });
    if (!response.success) {
      throw new Error(response.error || 'Failed to add listing to favorites');
    }
  }

  // Remove listing from favorites
  static async removeFromFavorites(listingId: string): Promise<void> {
    const response = await apiClient.delete(`/marketplace/favorites/${listingId}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to remove listing from favorites');
    }
  }

  // Get user's favorite listings
  static async getFavoriteListings(filters?: {
    page?: number;
    limit?: number;
  }): Promise<{
    listings: MarketplaceListing[];
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    const response = await apiClient.get<{
      listings: MarketplaceListing[];
      total: number;
      page: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    }>('/marketplace/favorites', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch favorite listings');
    }
    return response.data;
  }

  // Check if listing is favorited by user
  static async isFavorited(listingId: string): Promise<boolean> {
    const response = await apiClient.get<{ favorited: boolean }>(`/marketplace/favorites/${listingId}/check`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to check favorite status');
    }
    return response.data.favorited;
  }

  // Report marketplace listing
  static async reportListing(listingId: string, reason: string, description?: string): Promise<void> {
    const response = await apiClient.post('/marketplace/reports', {
      listingId,
      reason,
      description
    });
    if (!response.success) {
      throw new Error(response.error || 'Failed to report listing');
    }
  }

  // Contact seller
  static async contactSeller(listingId: string, message: string): Promise<void> {
    const response = await apiClient.post('/marketplace/contact', {
      listingId,
      message
    });
    if (!response.success) {
      throw new Error(response.error || 'Failed to contact seller');
    }
  }

  // Get marketplace statistics
  static async getMarketplaceStats(): Promise<MarketplaceStats> {
    const response = await apiClient.get<MarketplaceStats>('/marketplace/stats');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch marketplace statistics');
    }
    return response.data;
  }

  // Get similar listings
  static async getSimilarListings(listingId: string, limit?: number): Promise<MarketplaceListing[]> {
    const response = await apiClient.get<MarketplaceListing[]>(`/marketplace/listings/${listingId}/similar`, { limit });
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch similar listings');
    }
    return response.data;
  }

  // Get trending searches
  static async getTrendingSearches(): Promise<Array<{
    query: string;
    count: number;
    trend: 'up' | 'down' | 'stable';
  }>> {
    const response = await apiClient.get<Array<{
      query: string;
      count: number;
      trend: 'up' | 'down' | 'stable';
    }>>('/marketplace/trending-searches');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch trending searches');
    }
    return response.data;
  }

  // Get location suggestions
  static async getLocationSuggestions(query: string): Promise<Array<{
    city: string;
    state: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  }>> {
    const response = await apiClient.get<Array<{
      city: string;
      state: string;
      country: string;
      coordinates?: {
        lat: number;
        lng: number;
      };
    }>>('/marketplace/locations/suggestions', { query });
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch location suggestions');
    }
    return response.data;
  }

  // Bulk update listings
  static async bulkUpdateListings(listingIds: string[], updates: UpdateListingData): Promise<{
    updated: number;
    failed: number;
    results: Array<{
      listingId: string;
      success: boolean;
      error?: string;
    }>;
  }> {
    const response = await apiClient.post<{
      updated: number;
      failed: number;
      results: Array<{
        listingId: string;
        success: boolean;
        error?: string;
      }>;
    }>('/marketplace/bulk-update', {
      listingIds,
      updates
    });
    if (!response.success) {
      throw new Error(response.error || 'Failed to bulk update listings');
    }
    return response.data;
  }

  // Get marketplace alerts/notifications
  static async getMarketplaceAlerts(): Promise<Array<{
    id: string;
    type: 'price_drop' | 'similar_listing' | 'outbid' | 'listing_expired';
    title: string;
    message: string;
    listingId?: string;
    read: boolean;
    createdAt: string;
  }>> {
    const response = await apiClient.get<Array<{
      id: string;
      type: 'price_drop' | 'similar_listing' | 'outbid' | 'listing_expired';
      title: string;
      message: string;
      listingId?: string;
      read: boolean;
      createdAt: string;
    }>>('/marketplace/alerts');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch marketplace alerts');
    }
    return response.data;
  }

  // Mark alert as read
  static async markAlertAsRead(alertId: string): Promise<void> {
    const response = await apiClient.put(`/marketplace/alerts/${alertId}/read`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to mark alert as read');
    }
  }

  // Create marketplace alert subscription
  static async createAlertSubscription(data: {
    query?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: {
      city?: string;
      state?: string;
      country?: string;
      radius?: number;
    };
    frequency: 'immediate' | 'daily' | 'weekly';
  }): Promise<{
    id: string;
    active: boolean;
    createdAt: string;
  }> {
    const response = await apiClient.post<{
      id: string;
      active: boolean;
      createdAt: string;
    }>('/marketplace/alert-subscriptions', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to create alert subscription');
    }
    return response.data;
  }

  // Get user's alert subscriptions
  static async getAlertSubscriptions(): Promise<Array<{
    id: string;
    query?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: {
      city?: string;
      state?: string;
      country?: string;
      radius?: number;
    };
    frequency: 'immediate' | 'daily' | 'weekly';
    active: boolean;
    createdAt: string;
    lastTriggered?: string;
  }>> {
    const response = await apiClient.get<Array<{
      id: string;
      query?: string;
      category?: string;
      minPrice?: number;
      maxPrice?: number;
      location?: {
        city?: string;
        state?: string;
        country?: string;
        radius?: number;
      };
      frequency: 'immediate' | 'daily' | 'weekly';
      active: boolean;
      createdAt: string;
      lastTriggered?: string;
    }>>('/marketplace/alert-subscriptions');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch alert subscriptions');
    }
    return response.data;
  }

  // Delete alert subscription
  static async deleteAlertSubscription(subscriptionId: string): Promise<void> {
    const response = await apiClient.delete(`/marketplace/alert-subscriptions/${subscriptionId}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete alert subscription');
    }
  }
}

export const marketplaceApi = {
  // Get trending products (using popular endpoint)
  getTrendingProducts: async (filters?: MarketplaceFilters): Promise<TrendingResponse> => {
    const searchParams = new URLSearchParams();
    searchParams.append('type', 'products');
    
    if (filters?.location) searchParams.append('location', filters.location);
    if (filters?.category) searchParams.append('categoryId', filters.category);
    if (filters?.sortBy) searchParams.append('sortBy', filters.sortBy);

    const response = await apiClient.get(`/marketplace/popular?${searchParams.toString()}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch trending products');
    }
    
    // Transform backend data to frontend format
    const responseData = Array.isArray(response.data) ? response.data : [];
    const transformedData = responseData.map((item: any) => ({
      id: item.id || Math.random().toString(),
      name: item.name || item.title || 'Product',
      description: item.description || '',
      price: item.price || 0,
      originalPrice: item.originalPrice,
      image: item.image || item.coverImage || '/api/placeholder/300/200',
      rating: item.rating || 4.5,
      reviewCount: item.reviewCount || 0,
      category: item.category || 'General',
      type: 'product' as const,
      provider: {
        id: item.provider?.id || item.sellerId || item.id,
        name: item.provider?.name || item.sellerName || item.businessName || 'Provider',
        location: item.provider?.location || item.location || 'Location',
        verified: item.provider?.verified || item.verified || false
      },
      promotionType: 'trending' as const,
      trendingRank: 1,
      views: item.views || 0,
      likes: item.likes || 0,
      shares: item.shares || 0,
      tags: item.tags || []
    }));

    return {
      success: true,
      data: transformedData
    };
  },

  // Get trending services (using featured endpoint)
  getTrendingServices: async (filters?: MarketplaceFilters): Promise<TrendingResponse> => {
    const searchParams = new URLSearchParams();
    searchParams.append('type', 'services');
    
    if (filters?.location) searchParams.append('location', filters.location);
    if (filters?.category) searchParams.append('categoryId', filters.category);
    if (filters?.sortBy) searchParams.append('sortBy', filters.sortBy);

    const response = await apiClient.get(`/marketplace/featured?${searchParams.toString()}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch trending services');
    }
    
    // Transform backend data to frontend format
    const responseData = Array.isArray(response.data) ? response.data : [];
    const transformedData = responseData.map((item: any) => ({
      id: item.id || Math.random().toString(),
      name: item.name || item.title || 'Service',
      description: item.description || '',
      price: item.price || 0,
      originalPrice: item.originalPrice,
      image: item.image || item.coverImage || '/api/placeholder/300/200',
      rating: item.rating || 4.5,
      reviewCount: item.reviewCount || 0,
      category: item.category || 'General',
      type: 'service' as const,
      provider: {
        id: item.provider?.id || item.sellerId || item.id,
        name: item.provider?.name || item.sellerName || item.businessName || 'Provider',
        location: item.provider?.location || item.location || 'Location',
        verified: item.provider?.verified || item.verified || false
      },
      promotionType: 'featured' as const,
      trendingRank: 1,
      views: item.views || 0,
      likes: item.likes || 0,
      shares: item.shares || 0,
      tags: item.tags || []
    }));

    return {
      success: true,
      data: transformedData
    };
  },

  // Get nearby businesses
  getNearbyBusinesses: async (filters?: MarketplaceFilters): Promise<NearbyBusinessesResponse> => {
    try {
      const searchParams = new URLSearchParams();
      
      if (filters?.location) searchParams.append('location', filters.location);
      if (filters?.category) searchParams.append('category', filters.category);
      if (filters?.radius) searchParams.append('radius', filters.radius.toString());
      if (filters?.sortBy) searchParams.append('sortBy', filters.sortBy);

      const response = await apiClient.get(`/marketplace/businesses?${searchParams.toString()}`);
      if (!response.success) {
        return { success: false, data: [] };
      }
      const payload = response.data as any;
      let arr: NearbyBusiness[] = [];
      if (Array.isArray(payload)) arr = payload;
      else if (Array.isArray(payload?.businesses)) arr = payload.businesses;
      else if (Array.isArray(payload?.data)) arr = payload.data;
      else if (Array.isArray(payload?.items)) arr = payload.items;

      // Heuristic: only include seller/provider businesses
      const isSellerEntity = (b: any) => {
        if (!b) return false;
        // explicit flags
        if (b.type === 'business' || b.type === 'seller') return true;
        if (b.userType === 'seller') return true;
        if (b.sellerId) return true;
        if (b.isSeller === true) return true;
        if (b.role === 'seller') return true;
        // seller embedded on product/service
        if (b.provider && b.provider.id) return true;
        if (b.seller && b.seller.id) return true;
        // fallback: typical user/business shape from backend
        if (b.businessName || b.firstName || b.lastName) return true;
        return false;
      };

      const filtered = (arr || []).filter(isSellerEntity);

      return {
        success: true,
        data: filtered
      };
    } catch (error) {
      console.error('getNearbyBusinesses failed', error);
      return { success: false, data: [] };
    }
  },

  // Get featured businesses
  getFeaturedBusinesses: async (filters?: MarketplaceFilters): Promise<NearbyBusinessesResponse> => {
    const searchParams = new URLSearchParams();
    if (filters?.location) searchParams.append('location', filters.location);
    if (filters?.category) searchParams.append('category', filters.category);
    if (filters?.radius) searchParams.append('radius', filters.radius.toString());
    if (filters?.sortBy) searchParams.append('sortBy', filters.sortBy);

    // request only businesses
    searchParams.append('type', 'businesses');

    const response = await apiClient.get(`/marketplace/featured?${searchParams.toString()}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch featured businesses');
    }
    const payload = response.data as any;
    let arr: NearbyBusiness[] = [];
    if (Array.isArray(payload)) arr = payload;
    else if (Array.isArray(payload?.businesses)) arr = payload.businesses;
    else if (Array.isArray(payload?.data)) arr = payload.data;
    else if (Array.isArray(payload?.items)) arr = payload.items;

    const isSellerEntity = (b: any) => {
      if (!b) return false;
      if (b.type === 'business' || b.type === 'seller') return true;
      if (b.userType === 'seller') return true;
      if (b.sellerId) return true;
      if (b.isSeller === true) return true;
      if (b.role === 'seller') return true;
      if (b.provider && b.provider.id) return true;
      if (b.seller && b.seller.id) return true;
      if (b.businessName || b.firstName || b.lastName) return true;
      return false;
    };

    const filtered = (arr || []).filter(isSellerEntity);

    return {
      success: true,
      data: filtered
    };
  },

  // Get popular businesses
  getPopularBusinesses: async (filters?: MarketplaceFilters): Promise<NearbyBusinessesResponse> => {
    const searchParams = new URLSearchParams();
    if (filters?.location) searchParams.append('location', filters.location);
    if (filters?.category) searchParams.append('category', filters.category);
    if (filters?.radius) searchParams.append('radius', filters.radius.toString());
    if (filters?.sortBy) searchParams.append('sortBy', filters.sortBy);

    // request only businesses
    searchParams.append('type', 'businesses');

    const response = await apiClient.get(`/marketplace/popular?${searchParams.toString()}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch popular businesses');
    }
    const payload = response.data as any;
    let arr: NearbyBusiness[] = [];
    if (Array.isArray(payload)) arr = payload;
    else if (Array.isArray(payload?.businesses)) arr = payload.businesses;
    else if (Array.isArray(payload?.data)) arr = payload.data;
    else if (Array.isArray(payload?.items)) arr = payload.items;

    const isSellerEntity = (b: any) => {
      if (!b) return false;
      if (b.type === 'business' || b.type === 'seller') return true;
      if (b.userType === 'seller') return true;
      if (b.sellerId) return true;
      if (b.isSeller === true) return true;
      if (b.role === 'seller') return true;
      if (b.provider && b.provider.id) return true;
      if (b.seller && b.seller.id) return true;
      if (b.businessName || b.firstName || b.lastName) return true;
      return false;
    };

    const filtered = (arr || []).filter(isSellerEntity);

    return {
      success: true,
      data: filtered
    };
  },

  // Get marketplace statistics
  getMarketplaceStats: async (location?: string): Promise<MarketplaceStatsResponse> => {
    const params = location ? `?location=${location}` : '';
    const response = await apiClient.get(`/marketplace/stats${params}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch marketplace stats');
    }
    
    return {
      success: true,
      data: response.data as MarketplaceStatsResponse['data']
    };
  },

  // Get a single business by id (maps to provider details)
  getBusinessById: async (id: string): Promise<{ success: boolean; data: any | null }> => {
    if (!id) return { success: false, data: null };
    
    try {
      // Backend exposes provider details at /api/providers/:id
      const response = await apiClient.get(`/providers/${encodeURIComponent(id)}`);
      if (!response.success) {
        return { success: false, data: null };
      }

      const payload = response.data as any;
      if (payload == null) return { success: true, data: null };
      // Normalize to business-like structure expected by UI
      const data = payload.data || payload;
      return { success: true, data };
    } catch (error) {
      console.error('getBusinessById failed for id', id, error);
      return { success: false, data: null };
    }
  },

  // Track item view (endpoint not implemented in backend yet)
  trackView: async (itemId: string, itemType: 'product' | 'service' | 'business') => {
    console.log('Tracking view:', { itemId, itemType, timestamp: new Date().toISOString() });
    return { success: true, message: 'View tracked (client-side only)' };
  },

  // Track item like (endpoint not implemented in backend yet)
  trackLike: async (itemId: string, itemType: 'product' | 'service' | 'business') => {
    console.log('Tracking like:', { itemId, itemType, timestamp: new Date().toISOString() });
    return { success: true, message: 'Like tracked (client-side only)' };
  },

  // Track item share (endpoint not implemented in backend yet)
  trackShare: async (itemId: string, itemType: 'product' | 'service' | 'business', platform: string) => {
    console.log('Tracking share:', { itemId, itemType, platform, timestamp: new Date().toISOString() });
    return { success: true, message: 'Share tracked (client-side only)' };
  },

  // Get promotional campaigns
  getPromotionalCampaigns: async (location?: string) => {
    const params = location ? `?location=${location}` : '';
    const response = await apiClient.get(`/marketplace/promotions${params}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch promotional campaigns');
    }
    
    return {
      success: true,
      data: (response.data as any[]) || []
    };
  },

  // Search marketplace
  searchMarketplace: async (query: string, filters?: MarketplaceFilters) => {
    const searchParams = new URLSearchParams();
    searchParams.append('q', query);
    
    if (filters?.location) searchParams.append('location', filters.location);
    if (filters?.category) searchParams.append('category', filters.category);
    if (filters?.minPrice) searchParams.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) searchParams.append('maxPrice', filters.maxPrice.toString());
    if (filters?.sortBy) searchParams.append('sortBy', filters.sortBy);

    const response = await apiClient.get(`/marketplace/search?${searchParams.toString()}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to search marketplace');
    }

    const payload = response.data as any;
    // search may return { products: [], services: [], businesses: [] } or direct array
    let arr: any[] = [];
    if (Array.isArray(payload)) arr = payload;
    else if (filters?.type && Array.isArray(payload?.[filters.type])) arr = payload[filters.type];
    else {
      for (const key of ['data', 'items', 'results', 'products', 'services', 'businesses']) {
        if (Array.isArray(payload?.[key])) {
          arr = payload[key];
          break;
        }
      }
    }

    // if searching businesses, filter to seller entities only
    if (filters?.type === 'businesses') {
      const isSellerEntity = (b: any) => {
        if (!b) return false;
        if (b.type === 'business' || b.type === 'seller') return true;
        if (b.userType === 'seller') return true;
        if (b.sellerId) return true;
        if (b.isSeller === true) return true;
        if (b.role === 'seller') return true;
        if (b.provider && b.provider.id) return true;
        if (b.seller && b.seller.id) return true;
        if (b.businessName || b.firstName || b.lastName) return true;
        return false;
      };
      arr = (arr || []).filter(isSellerEntity);
    }

    return { success: true, data: arr || [] };
  }
};