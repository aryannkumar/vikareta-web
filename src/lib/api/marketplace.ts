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

  // Get a single business by id
  getBusinessById: async (id: string): Promise<{ success: boolean; data: any | null }> => {
    if (!id) return { success: false, data: null };
    
    try {
      const response = await apiClient.get(`/marketplace/businesses/${encodeURIComponent(id)}`);
      if (!response.success) {
        return { success: false, data: null };
      }

      const payload = response.data as any;
      // backend may return { data: { business: {...} } } or { business: {...} } or direct object
      if (payload == null) return { success: true, data: null };
      if (payload.business) return { success: true, data: payload.business };
      if (payload.data && (payload.data.business || payload.data.provider)) return { success: true, data: payload.data.business || payload.data };
      return { success: true, data: payload };
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