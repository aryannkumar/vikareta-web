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
  categoryId?: string;
  subcategoryId?: string;
  providerId?: string;
  serviceType?: 'one_time' | 'recurring' | 'subscription';
  minPrice?: number;
  maxPrice?: number;
  location?: 'online' | 'on_site' | 'both';
  search?: string;
  sortBy?: 'price' | 'createdAt' | 'title' | 'rating';
  sortOrder?: 'asc' | 'desc';
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

    const response = await apiClient.get<any>(`/services?${searchParams.toString()}`);

    // Normalize various possible response shapes from backend
    // Possible shapes:
    // 1) { services: [...], total, page, limit, hasMore }
    // 2) [ ... ] (array of services)
    // 3) { data: { services: [...] } }
    const raw = response as any;

    let services: Service[] = [];
    let total = 0;
    let page = (filters.page as number) || 1;
    let limit = (filters.limit as number) || 12;
    let hasMore = false;

    if (raw && raw.data) {
      const d = raw.data;
      if (Array.isArray(d)) {
        services = d;
        total = d.length;
      } else if (Array.isArray(d.services)) {
        services = d.services;
        total = d.total || services.length;
        page = d.page || page;
        limit = d.limit || limit;
        hasMore = Boolean(d.hasMore);
      } else if (Array.isArray(d.data)) {
        services = d.data;
        total = services.length;
      }
    } else if (raw && Array.isArray(raw)) {
      services = raw;
      total = raw.length;
    } else if (raw && raw.services && Array.isArray(raw.services)) {
      services = raw.services;
      total = raw.total || services.length;
      page = raw.page || page;
      limit = raw.limit || limit;
      hasMore = Boolean(raw.hasMore);
    }

    return {
      success: response.success,
      data: {
        services,
        total,
        page,
        limit,
        hasMore,
      },
    } as ServicesResponse;
  },

  // Get service by ID
  getService: async (id: string): Promise<ServiceResponse> => {
    const response = await apiClient.get<Service>(`/services/${id}`);
    return {
      success: response.success,
      data: response.data as Service,
    } as ServiceResponse;
  },

  // Search services
  searchServices: async (query: string, filters: Omit<ServicesFilters, 'search'> = {}): Promise<ServicesResponse> => {
    return servicesApi.getServices({ ...filters, search: query });
  },

  // Get services by category
  getServicesByCategory: async (categoryId: string, filters: Omit<ServicesFilters, 'categoryId'> = {}): Promise<ServicesResponse> => {
    return servicesApi.getServices({ ...filters, categoryId });
  },

  // Get services by provider
  getServicesByProvider: async (providerId: string): Promise<ServicesResponse> => {
    // Provider-specific services endpoint not implemented in backend
    throw new Error('Provider services endpoint not available');
  },

  // Get service categories (uses main categories endpoint)
  getCategories: async (): Promise<{ success: boolean; data: string[] }> => {
    const response = await apiClient.get('/categories');
    const raw: any = response as any;
    if (raw.success && Array.isArray(raw.data)) {
      const categoryNames = raw.data.map((category: any) => category.name || category);
      return { success: true, data: categoryNames };
    }
    return { success: false, data: [] };
  },

  // Get featured services - using dedicated endpoint
  getFeaturedServices: async (limit: number = 12): Promise<ServicesResponse> => {
    const response = await apiClient.get<any>(`/services/featured?limit=${limit}`);

    // Normalize various possible response shapes from backend
    const raw = response as any;

    let services: Service[] = [];
    let total = 0;
    let page = 1;
    let limit_num = limit;
    let hasMore = false;

    if (raw && raw.data) {
      const d = raw.data;
      if (Array.isArray(d)) {
        services = d;
        total = d.length;
      } else if (Array.isArray(d.services)) {
        services = d.services;
        total = d.total || services.length;
        page = d.page || page;
        limit_num = d.limit || limit_num;
        hasMore = Boolean(d.hasMore);
      } else if (Array.isArray(d.data)) {
        services = d.data;
        total = services.length;
      }
    } else if (raw && Array.isArray(raw)) {
      services = raw;
      total = raw.length;
    } else if (raw && raw.services && Array.isArray(raw.services)) {
      services = raw.services;
      total = raw.total || services.length;
      page = raw.page || page;
      limit_num = raw.limit || limit_num;
      hasMore = Boolean(raw.hasMore);
    }

    return {
      success: response.success,
      data: {
        services,
        total,
        page,
        limit: limit_num,
        hasMore,
      },
    } as ServicesResponse;
  },

  // Add service review
  addReview: async (serviceId: string, review: {
    rating: number;
    comment: string;
  }): Promise<{ success: boolean; data: ServiceReview }> => {
    // Service reviews endpoint not implemented in backend
    throw new Error('Service reviews not available');
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
    // Service reviews endpoint not implemented in backend
    throw new Error('Service reviews not available');
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
    // Contact provider endpoint not implemented in backend
    throw new Error('Contact provider functionality not available');
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
    // Request quote endpoint not implemented in backend
    throw new Error('Request quote functionality not available');
  }
};