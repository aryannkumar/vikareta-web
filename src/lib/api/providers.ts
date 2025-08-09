import { apiClient } from './client';

export interface Provider {
  id: string;
  name: string;
  description: string;
  avatar: string;
  coverImage: string;
  location: string;
  verified: boolean;
  experience: string;
  rating: number;
  reviewCount: number;
  completedProjects: number;
  responseTime: string;
  skills: string[];
  categories: string[];
  hourlyRate: number;
  available: boolean;
  languages: string[];
  joinedDate: string;
  certifications: Certification[];
  portfolio: PortfolioItem[];
  services: ProviderService[];
  reviews: ProviderReview[];
  businessInfo: {
    type: 'individual' | 'company';
    registrationNumber?: string;
    taxId?: string;
    website?: string;
    socialMedia?: {
      linkedin?: string;
      twitter?: string;
      facebook?: string;
      instagram?: string;
    };
  };
  contactInfo: {
    email: string;
    phone?: string;
    whatsapp?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
    };
  };
  stats: {
    totalEarnings: number;
    activeProjects: number;
    repeatClients: number;
    onTimeDelivery: number;
    clientSatisfaction: number;
  };
  workingHours?: {
    timezone: string;
    schedule: Record<string, { start: string; end: string; available: boolean }>;
  };
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  verified: boolean;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  technologies?: string[];
  projectUrl?: string;
  completedDate: string;
  client?: string;
  featured: boolean;
}

export interface ProviderService {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  deliveryTime: string;
  active: boolean;
}

export interface ProviderReview {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  projectType: string;
  verified: boolean;
  helpful: number;
}

export interface ProvidersResponse {
  success: boolean;
  data: {
    providers: Provider[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export interface ProviderResponse {
  success: boolean;
  data: Provider;
}

export interface ProvidersFilters {
  category?: string;
  skills?: string[];
  location?: string;
  minRating?: number;
  minHourlyRate?: number;
  maxHourlyRate?: number;
  experience?: string;
  available?: boolean;
  verified?: boolean;
  languages?: string[];
  search?: string;
  sortBy?: 'relevance' | 'rating' | 'experience' | 'projects' | 'rate-low' | 'rate-high';
  page?: number;
  limit?: number;
}

export const providersApi = {
  // Get all providers with filters
  getProviders: async (filters: ProvidersFilters = {}): Promise<ProvidersResponse> => {
    const searchParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });

    const response = await apiClient.get(`/providers?${searchParams.toString()}`);
    return response.data as ProvidersResponse;
  },

  // Get provider by ID
  getProvider: async (id: string): Promise<ProviderResponse> => {
    const response = await apiClient.get(`/providers/${id}`);
    return response.data as ProviderResponse;
  },

  // Search providers
  searchProviders: async (query: string, filters: Omit<ProvidersFilters, 'search'> = {}): Promise<ProvidersResponse> => {
    return providersApi.getProviders({ ...filters, search: query });
  },

  // Get providers by category
  getProvidersByCategory: async (category: string, filters: Omit<ProvidersFilters, 'category'> = {}): Promise<ProvidersResponse> => {
    return providersApi.getProviders({ ...filters, category });
  },

  // Get provider categories
  getCategories: async (): Promise<{ success: boolean; data: string[] }> => {
    const response = await apiClient.get('/providers/categories');
    return response.data as { success: boolean; data: string[] };
  },

  // Get provider skills
  getSkills: async (category?: string): Promise<{ success: boolean; data: string[] }> => {
    const params = category ? `?category=${category}` : '';
    const response = await apiClient.get(`/providers/skills${params}`);
    return response.data as { success: boolean; data: string[] };
  },

  // Contact provider
  contactProvider: async (providerId: string, message: {
    subject: string;
    message: string;
    projectType?: string;
    budget?: number;
    timeline?: string;
    contactInfo: {
      name: string;
      email: string;
      phone?: string;
      company?: string;
    };
  }): Promise<{ success: boolean; data: { messageId: string } }> => {
    const response = await apiClient.post(`/providers/${providerId}/contact`, message);
    return response.data as any;
  },

  // Hire provider
  hireProvider: async (providerId: string, project: {
    title: string;
    description: string;
    serviceId?: string;
    budget: number;
    timeline: string;
    requirements: string[];
    milestones?: {
      title: string;
      description: string;
      amount: number;
      dueDate: string;
    }[];
  }): Promise<{ success: boolean; data: { projectId: string } }> => {
    const response = await apiClient.post(`/providers/${providerId}/hire`, project);
    return response.data as any;
  },

  // Add provider review
  addReview: async (providerId: string, review: {
    rating: number;
    comment: string;
    projectType: string;
  }): Promise<{ success: boolean; data: ProviderReview }> => {
    const response = await apiClient.post(`/providers/${providerId}/reviews`, review);
    return response.data as { success: boolean; data: ProviderReview };
  },

  // Get provider reviews
  getReviews: async (providerId: string, page = 1, limit = 10): Promise<{
    success: boolean;
    data: {
      reviews: ProviderReview[];
      total: number;
      averageRating: number;
      ratingDistribution: Record<number, number>;
    };
  }> => {
    const response = await apiClient.get(`/providers/${providerId}/reviews?page=${page}&limit=${limit}`);
    return response.data as any;
  },

  // Get provider availability
  getAvailability: async (providerId: string): Promise<{
    success: boolean;
    data: {
      available: boolean;
      nextAvailableDate?: string;
      workingHours: Record<string, { start: string; end: string; available: boolean }>;
      timezone: string;
    };
  }> => {
    const response = await apiClient.get(`/providers/${providerId}/availability`);
    return response.data as any;
  },

  // Get provider portfolio
  getPortfolio: async (providerId: string): Promise<{
    success: boolean;
    data: PortfolioItem[];
  }> => {
    const response = await apiClient.get(`/providers/${providerId}/portfolio`);
    return response.data as any;
  },

  // Get similar providers
  getSimilarProviders: async (providerId: string, limit = 5): Promise<{
    success: boolean;
    data: Provider[];
  }> => {
    const response = await apiClient.get(`/providers/${providerId}/similar?limit=${limit}`);
    return response.data as any;
  }
};