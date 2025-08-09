import { apiClient } from './client';

export interface Service {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  originalPrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  provider: {
    id: string;
    name: string;
    location: string;
    verified: boolean;
    experience: string;
    avatar: string;
    responseTime: string;
    completedProjects: number;
  };
  category: string;
  subcategory?: string;
  available: boolean;
  deliveryTime: string;
  serviceType: 'one-time' | 'monthly' | 'project-based';
  tags: string[];
  features: string[];
  packages: ServicePackage[];
  reviews: ServiceReview[];
  faqs: ServiceFAQ[];
  specifications: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  price: number;
  features: string[];
  deliveryTime: string;
  revisions?: number;
  support?: string;
}

export interface ServiceReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  verified: boolean;
}

export interface ServiceFAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface ServicesResponse {
  success: boolean;
  data: {
    services: Service[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export interface ServiceResponse {
  success: boolean;
  data: Service;
}

export interface ServicesFilters {
  category?: string;
  subcategory?: string;
  serviceType?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  rating?: number;
  experience?: string;
  available?: boolean;
  search?: string;
  sortBy?: 'relevance' | 'price-low' | 'price-high' | 'rating' | 'newest';
  page?: number;
  limit?: number;
}

export const servicesApi = {
  // Get all services with filters
  getServices: async (filters: ServicesFilters = {}): Promise<ServicesResponse> => {
    const searchParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/services?${searchParams.toString()}`);
    return response.data as ServicesResponse;
  },

  // Get service by ID
  getService: async (id: string): Promise<ServiceResponse> => {
    const response = await apiClient.get(`/services/${id}`);
    return response.data as ServiceResponse;
  },

  // Search services
  searchServices: async (query: string, filters: Omit<ServicesFilters, 'search'> = {}): Promise<ServicesResponse> => {
    return servicesApi.getServices({ ...filters, search: query });
  },

  // Get services by category
  getServicesByCategory: async (category: string, filters: Omit<ServicesFilters, 'category'> = {}): Promise<ServicesResponse> => {
    return servicesApi.getServices({ ...filters, category });
  },

  // Get services by provider
  getServicesByProvider: async (providerId: string): Promise<ServicesResponse> => {
    const response = await apiClient.get(`/providers/${providerId}/services`);
    return response.data as ServicesResponse;
  },

  // Get service categories
  getCategories: async (): Promise<{ success: boolean; data: string[] }> => {
    const response = await apiClient.get('/services/categories');
    return response.data as { success: boolean; data: string[] };
  },

  // Get service subcategories
  getSubcategories: async (category: string): Promise<{ success: boolean; data: string[] }> => {
    const response = await apiClient.get(`/services/categories/${category}/subcategories`);
    return response.data as { success: boolean; data: string[] };
  },

  // Add service review
  addReview: async (serviceId: string, review: {
    rating: number;
    comment: string;
  }): Promise<{ success: boolean; data: ServiceReview }> => {
    const response = await apiClient.post(`/services/${serviceId}/reviews`, review);
    return response.data as { success: boolean; data: ServiceReview };
  },

  // Get service reviews
  getReviews: async (serviceId: string, page = 1, limit = 10): Promise<{
    success: boolean;
    data: {
      reviews: ServiceReview[];
      total: number;
      averageRating: number;
      ratingDistribution: Record<number, number>;
    };
  }> => {
    const response = await apiClient.get(`/services/${serviceId}/reviews?page=${page}&limit=${limit}`);
    return response.data as any;
  },

  // Contact service provider
  contactProvider: async (serviceId: string, message: {
    subject: string;
    message: string;
    contactInfo: {
      name: string;
      email: string;
      phone?: string;
    };
  }): Promise<{ success: boolean; data: { messageId: string } }> => {
    const response = await apiClient.post(`/services/${serviceId}/contact`, message);
    return response.data as any;
  },

  // Request service quote
  requestQuote: async (serviceId: string, requirements: {
    packageId?: string;
    customRequirements?: string;
    budget?: number;
    timeline?: string;
    contactInfo: {
      name: string;
      email: string;
      phone?: string;
      company?: string;
    };
  }): Promise<{ success: boolean; data: { quoteId: string } }> => {
    const response = await apiClient.post(`/services/${serviceId}/quote`, requirements);
    return response.data as any;
  }
};