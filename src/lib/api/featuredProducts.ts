import { apiClient } from './client';

export interface FeaturedProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  supplier: {
    id: string;
    name: string;
    location: string;
    verified: boolean;
  };
  category: string;
  inStock: boolean;
  minOrderQuantity: number;
  featured: boolean;
  featuredUntil: string;
  promotionType: 'standard' | 'premium' | 'organic';
  tags: string[];
  description: string;
  specifications: Record<string, any>;
}

export interface FeaturedProductsResponse {
  success: boolean;
  data: {
    products: FeaturedProduct[];
    total: number;
    hasMore: boolean;
  };
}

export interface FeaturedProductResponse {
  success: boolean;
  data: FeaturedProduct;
}

export interface FeaturedStatsResponse {
  success: boolean;
  data: {
    totalFeatured: number;
    activeFeatured: number;
    expiredFeatured: number;
    totalViews: number;
    totalClicks: number;
    conversionRate: number;
    byCategory: Record<string, number>;
  };
}

export const featuredApi = {
  // Get all featured products
  getFeaturedProducts: async (params?: {
    limit?: number;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<FeaturedProductsResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category) searchParams.append('category', params.category);
    if (params?.minPrice) searchParams.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice) searchParams.append('maxPrice', params.maxPrice.toString());

    const response = await apiClient.get(`/featured/products?${searchParams.toString()}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch featured products');
    }
    return {
      success: true,
      data: {
        products: (response.data as any)?.products || response.data || [],
        total: (response.data as any)?.total || (Array.isArray(response.data) ? response.data.length : 0),
        hasMore: (response.data as any)?.hasMore || false,
      },
    };
  },

  // Get specific featured product
  getFeaturedProduct: async (id: string): Promise<FeaturedProductResponse> => {
    const response = await apiClient.get(`/featured/products/${id}`);
    return {
      success: response.success,
      data: response.data as FeaturedProduct,
    };
  },

  // Promote a product as featured (for dashboard)
  promoteProduct: async (data: {
    productId: string;
    promotionType?: 'standard' | 'premium' | 'organic';
    duration?: number;
    supplierId: string;
  }) => {
    const response = await apiClient.post('/featured/products', data);
    return response;
  },

  // Remove featured status
  removeFeaturedStatus: async (productId: string, supplierId: string) => {
    const response = await apiClient.delete(`/featured/products/${productId}?supplierId=${supplierId}`);
    return response;
  },

  // Get featured products statistics
  getFeaturedStats: async (supplierId?: string): Promise<FeaturedStatsResponse> => {
    const params = supplierId ? `?supplierId=${supplierId}` : '';
    const response = await apiClient.get(`/featured/stats${params}`);
    return {
      success: response.success,
      data: response.data as FeaturedStatsResponse['data'],
    };
  }
};