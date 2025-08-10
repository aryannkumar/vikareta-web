import { apiClient } from './client';

export interface FeaturedService {
  id: string;
  name: string;
  basePrice: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  provider: {
    id: string;
    name: string;
    location: string;
    verified: boolean;
    experience: string;
  };
  category: string;
  available: boolean;
  deliveryTime: string;
  featured: boolean;
  featuredUntil: string;
  promotionType: 'standard' | 'premium' | 'creative';
  tags: string[];
  description: string;
  serviceType: 'one-time' | 'monthly' | 'project-based';
  specifications: Record<string, any>;
}

export interface FeaturedServicesResponse {
  success: boolean;
  data: {
    services: FeaturedService[];
    total: number;
    hasMore: boolean;
  };
}

export interface FeaturedServiceResponse {
  success: boolean;
  data: FeaturedService;
}

export interface FeaturedServicesStatsResponse {
  success: boolean;
  data: {
    totalFeatured: number;
    activeFeatured: number;
    expiredFeatured: number;
    totalViews: number;
    totalInquiries: number;
    conversionRate: number;
    averageRating: number;
    byCategory: Record<string, number>;
  };
}

export const featuredServicesApi = {
  // Get all featured services
  getFeaturedServices: async (params?: {
    limit?: number;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    serviceType?: string;
  }): Promise<FeaturedServicesResponse> => {
    const searchParams = new URLSearchParams();

    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category) searchParams.append('category', params.category);
    if (params?.minPrice) searchParams.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice) searchParams.append('maxPrice', params.maxPrice.toString());
    if (params?.serviceType) searchParams.append('serviceType', params.serviceType);

    const response = await apiClient.get(`/services?featured=true&${searchParams.toString()}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch featured services');
    }
    return {
      success: true,
      data: {
        services: (response.data as any)?.services || response.data || [],
        total: (response.data as any)?.total || (Array.isArray(response.data) ? response.data.length : 0),
        hasMore: (response.data as any)?.hasMore || false,
      },
    };
  },

  // Get specific featured service
  getFeaturedService: async (id: string): Promise<FeaturedServiceResponse> => {
    const response = await apiClient.get(`/services/${id}`);
    return {
      success: response.success,
      data: response.data as FeaturedService,
    };
  },

  // Promote a service as featured (for dashboard)
  promoteService: async (data: {
    serviceId: string;
    promotionType?: 'standard' | 'premium' | 'creative';
    duration?: number;
    providerId: string;
  }) => {
    const response = await apiClient.post('/featured-services', data);
    return response;
  },

  // Remove featured status
  removeFeaturedStatus: async (serviceId: string, providerId: string) => {
    const response = await apiClient.delete(`/featured-services/${serviceId}?providerId=${providerId}`);
    return response;
  },

  // Get featured services statistics
  getFeaturedServicesStats: async (providerId?: string): Promise<FeaturedServicesStatsResponse> => {
    const params = providerId ? `?providerId=${providerId}` : '';
    const response = await apiClient.get(`/featured-services/stats${params}`);
    return {
      success: response.success,
      data: response.data as FeaturedServicesStatsResponse['data'],
    };
  }
};