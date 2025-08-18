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
  sortBy?: 'createdAt' | 'rating' | 'experience' | 'projects';
  page?: number;
  limit?: number;
}

// Providers API has been deprecated/removed on the backend.
// Keep a shim to avoid accidental 404 requests from the frontend — callers should be migrated
// to marketplace/businesses endpoints or removed.
export const providersApi = {
  _deprecatedWarning: () => console.warn('providersApi is deprecated. Use marketplaceApi or businesses endpoints instead.'),

  getProviders: async (): Promise<ProvidersResponse> => {
    providersApi._deprecatedWarning();
    return { success: false, data: { providers: [], total: 0, page: 1, limit: 0, hasMore: false } } as any;
  },

  getProvider: async (id: string): Promise<ProviderResponse> => {
    providersApi._deprecatedWarning();
    return { success: false, data: null as any } as any;
  },

  // The rest of the methods are kept as no-op stubs to avoid runtime errors
  searchProviders: async () => { providersApi._deprecatedWarning(); return { success: false, data: { providers: [], total: 0, page: 1, limit: 0, hasMore: false } } as any; },
  getProvidersByCategory: async () => { providersApi._deprecatedWarning(); return { success: false, data: { providers: [], total: 0, page: 1, limit: 0, hasMore: false } } as any; },
  getCategories: async () => { providersApi._deprecatedWarning(); return { success: false, data: [] } as any; },
  getSkills: async () => { providersApi._deprecatedWarning(); return { success: false, data: [] } as any; },
  contactProvider: async () => { providersApi._deprecatedWarning(); return { success: false, data: null } as any; },
  hireProvider: async () => { providersApi._deprecatedWarning(); return { success: false, data: null } as any; },
  addReview: async () => { providersApi._deprecatedWarning(); return { success: false, data: null } as any; },
  getReviews: async () => { providersApi._deprecatedWarning(); return { success: false, data: { reviews: [], total: 0, averageRating: 0, ratingDistribution: {} } } as any; },
  getAvailability: async () => { providersApi._deprecatedWarning(); return { success: false, data: null } as any; },
  getPortfolio: async () => { providersApi._deprecatedWarning(); return { success: false, data: [] } as any; },
  getSimilarProviders: async () => { providersApi._deprecatedWarning(); return { success: false, data: [] } as any; },
};