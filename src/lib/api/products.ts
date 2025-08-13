import { apiClient } from './client';

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
  subcategory?: {
    id: string;
    name: string;
    slug: string;
  };
  brand?: string;
  sku: string;
  inStock: boolean;
  stockQuantity: number;
  minOrderQuantity: number;
  maxOrderQuantity?: number;
  unit: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  specifications: Record<string, unknown>;
  features: string[];
  tags: string[];
  supplier: {
    id: string;
    name: string;
    logo?: string;
    avatar?: string;
    location: string;
    rating: number;
    totalReviews: number;
    verified: boolean;
    experience?: string;
    completedOrders?: number;
    responseTime?: string;
  };
  reviews: {
    average: number;
    total: number;
    breakdown: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
    list?: ProductReview[];
  };
  variants?: ProductVariant[];
  relatedProducts?: string[];
  shippingInfo: {
    freeShipping: boolean;
    shippingCost?: number;
    estimatedDelivery: string;
    availableLocations: string[];
  };
  returnPolicy?: string;
  warranty?: string;
  certifications: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  sku: string;
  inStock: boolean;
  stockQuantity: number;
  attributes: Record<string, string>;
}

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  verified: boolean;
  helpful: number;
  createdAt: string;
}

export interface ProductFilters {
  category?: string;
  subcategory?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  rating?: number;
  location?: string;
  sortBy?: 'price' | 'createdAt' | 'title' | 'stockQuantity';
  page?: number;
  limit?: number;
  search?: string;
}

export const productsApi = {
  async getProducts(filters?: ProductFilters) {
    return apiClient.get<{
      products: Product[];
      total: number;
      page: number;
      totalPages: number;
      filters: {
        categories: Array<{ id: string; name: string; count: number }>;
        brands: Array<{ name: string; count: number }>;
        priceRange: { min: number; max: number };
      };
    }>('/products', filters);
  },

  async getProduct(id: string) {
    return apiClient.get<Product>(`/products/${id}`);
  },

  async getProductReviews(productId: string, page: number = 1, limit: number = 10) {
    return apiClient.get<{
      reviews: ProductReview[];
      total: number;
      page: number;
      totalPages: number;
    }>(`/products/${productId}/reviews`, { page, limit });
  },

  async addProductReview(productId: string, review: {
    rating: number;
    title: string;
    comment: string;
    images?: string[];
  }) {
    return apiClient.post<ProductReview>(`/products/${productId}/reviews`, review);
  },

  async getRelatedProducts(productId: string, limit: number = 8) {
    return apiClient.get<Product[]>(`/products/${productId}/related`, { limit });
  },

  async searchProducts(query: string, filters?: Omit<ProductFilters, 'search'>) {
    return apiClient.get<{
      products: Product[];
      total: number;
      suggestions: string[];
    }>('/products/search', { q: query, ...filters });
  },

  async getFeaturedProducts(limit: number = 12) {
    return apiClient.get<Product[]>('/products', { featured: true, limit });
  },

  async getProductsByCategory(categoryId: string, filters?: Omit<ProductFilters, 'category'>) {
    return apiClient.get<{
      products: Product[];
      total: number;
      page: number;
      totalPages: number;
      category: {
        id: string;
        name: string;
        description: string;
        image?: string;
      };
    }>(`/categories/${categoryId}/products`, filters);
  },

  async addToWishlist(productId: string) {
    return apiClient.post(`/products/${productId}/wishlist`);
  },

  async removeFromWishlist(productId: string) {
    return apiClient.delete(`/products/${productId}/wishlist`);
  },

  async reportProduct(productId: string, reason: string, description?: string) {
    return apiClient.post(`/products/${productId}/report`, { reason, description });
  },

  async contactSupplier(productId: string, data: {
    subject: string;
    message: string;
    quantity: number;
    contactInfo: {
      name: string;
      email: string;
      phone: string;
    };
  }) {
    return apiClient.post(`/products/${productId}/contact-supplier`, data);
  },

  async requestQuote(productId: string, data: {
    quantity: number;
    variantId?: string;
    deliveryLocation: string;
    timeline: string;
    contactInfo: {
      name: string;
      email: string;
      phone: string;
    };
  }) {
    return apiClient.post(`/products/${productId}/request-quote`, data);
  },

  async checkAvailability(productId: string, quantity: number, variantId?: string) {
    return apiClient.get<{
      available: boolean;
      maxQuantity: number;
      estimatedDelivery: string;
    }>(`/products/${productId}/availability`, { quantity, variantId });
  }
};