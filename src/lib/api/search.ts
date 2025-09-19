import { apiClient } from './client';
import { Product } from './products';
import { Service } from './services';
import { Provider } from './providers';

export interface SearchResult {
  id: string;
  type: 'product' | 'service' | 'provider';
  name: string;
  description: string;
  price?: number;
  image: string;
  rating: number;
  reviewCount: number;
  provider?: {
    id: string;
    name: string;
    location: string;
    verified: boolean;
  };
  category: string;
  tags: string[];
  relevanceScore: number;
}

export interface SearchResponse {
  success: boolean;
  data: {
    results: SearchResult[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
    suggestions?: string[];
    facets: {
      types: Record<string, number>;
      categories: Record<string, number>;
      priceRanges: Record<string, number>;
      locations: Record<string, number>;
    };
  };
}

export interface SearchFilters {
  query: string;
  type?: 'product' | 'service' | 'provider';
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  rating?: number;
  verified?: boolean;
  sortBy?: 'createdAt' | 'price' | 'rating' | 'title';
  page?: number;
  limit?: number;
}

export interface AutocompleteResponse {
  success: boolean;
  data: {
    suggestions: string[];
    categories: string[];
    providers: string[];
  };
}

export const searchApi = {
  // Universal search across products, services, and providers
  search: async (filters: SearchFilters): Promise<SearchResponse> => {
    const searchParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    // Use the global search endpoint
    const response = await apiClient.get(`/search/global?${searchParams.toString()}`);
    if (!response.success) {
      throw new Error(response.error || 'Search failed');
    }
    return {
      success: true,
      data: {
        results: (response.data as any)?.results || [],
        total: (response.data as any)?.total || 0,
        page: (response.data as any)?.page || 1,
        limit: (response.data as any)?.limit || 10,
        hasMore: (response.data as any)?.hasMore || false,
        suggestions: (response.data as any)?.suggestions || [],
        facets: (response.data as any)?.facets || {
          types: {},
          categories: {},
          priceRanges: {},
          locations: {}
        }
      }
    };
  },

  // Get search suggestions for autocomplete
  getSuggestions: async (query: string, limit = 10): Promise<AutocompleteResponse> => {
    const response = await apiClient.get(`/search/suggestions?q=${encodeURIComponent(query)}&limit=${limit}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get suggestions');
    }
    return {
      success: true,
      data: {
        suggestions: (response.data as any)?.suggestions || [],
        categories: (response.data as any)?.categories || [],
        providers: (response.data as any)?.providers || []
      }
    };
  },

  // Search products only
  searchProducts: async (query: string, filters: Omit<SearchFilters, 'query' | 'type'> = {}): Promise<SearchResponse> => {
    return searchApi.search({ ...filters, query, type: 'product' });
  },

  // Search services only
  searchServices: async (query: string, filters: Omit<SearchFilters, 'query' | 'type'> = {}): Promise<SearchResponse> => {
    return searchApi.search({ ...filters, query, type: 'service' });
  },

  // Search providers only
  searchProviders: async (query: string, filters: Omit<SearchFilters, 'query' | 'type'> = {}): Promise<SearchResponse> => {
    return searchApi.search({ ...filters, query, type: 'provider' });
  },

  // Get popular/trending products
  getPopularProducts: async (categoryId?: string, limit = 20): Promise<{ success: boolean; data: SearchResult[] }> => {
    const params = new URLSearchParams();
    if (categoryId) params.append('categoryId', categoryId);
    params.append('limit', limit.toString());
    
    const response = await apiClient.get(`/search/popular?${params.toString()}`);
    return response.data as { success: boolean; data: SearchResult[] };
  },

  // Save search query (for analytics) - Note: This endpoint doesn't exist in backend yet
  saveSearch: async (query: string, resultCount: number): Promise<void> => {
    try {
      // This endpoint would need to be implemented in the backend
      console.log('Search analytics:', { query, resultCount, timestamp: new Date().toISOString() });
    } catch (error) {
      // Silently fail for analytics
      console.warn('Failed to save search analytics:', error);
    }
  }
};