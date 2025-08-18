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

export const marketplaceApi = {
  // Get trending products
  getTrendingProducts: async (filters?: MarketplaceFilters): Promise<TrendingResponse> => {
    const searchParams = new URLSearchParams();
    
    if (filters?.location) searchParams.append('location', filters.location);
    if (filters?.category) searchParams.append('category', filters.category);
    if (filters?.minPrice) searchParams.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) searchParams.append('maxPrice', filters.maxPrice.toString());
    if (filters?.sortBy) searchParams.append('sortBy', filters.sortBy);

    const response = await apiClient.get(`/marketplace/trending/products?${searchParams.toString()}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch trending products');
    }
    
    return {
      success: true,
      data: (response.data as TrendingItem[]) || []
    };
  },

  // Get trending services
  getTrendingServices: async (filters?: MarketplaceFilters): Promise<TrendingResponse> => {
    const searchParams = new URLSearchParams();
    
    if (filters?.location) searchParams.append('location', filters.location);
    if (filters?.category) searchParams.append('category', filters.category);
    if (filters?.minPrice) searchParams.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) searchParams.append('maxPrice', filters.maxPrice.toString());
    if (filters?.sortBy) searchParams.append('sortBy', filters.sortBy);

    const response = await apiClient.get(`/marketplace/trending/services?${searchParams.toString()}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch trending services');
    }
    
    return {
      success: true,
      data: (response.data as TrendingItem[]) || []
    };
  },

  // Get nearby businesses
  getNearbyBusinesses: async (filters?: MarketplaceFilters): Promise<NearbyBusinessesResponse> => {
    const searchParams = new URLSearchParams();
    
    if (filters?.location) searchParams.append('location', filters.location);
    if (filters?.category) searchParams.append('category', filters.category);
    if (filters?.radius) searchParams.append('radius', filters.radius.toString());
    if (filters?.sortBy) searchParams.append('sortBy', filters.sortBy);

  const response = await apiClient.get(`/marketplace/businesses?${searchParams.toString()}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch nearby businesses');
    }
    
    return {
      success: true,
      data: (response.data as NearbyBusiness[]) || []
    };
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

    return {
      success: true,
      data: (response.data as NearbyBusiness[]) || []
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

    return {
      success: true,
      data: (response.data as NearbyBusiness[]) || []
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
    
    return {
      success: true,
      data: (response.data as any) || {
        products: [],
        services: [],
        businesses: [],
        total: 0
      }
    };
  }
};