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
    // Backend doesn't have product-specific reviews endpoint, use generic /reviews with productId filter
    return apiClient.get<{
      reviews: ProductReview[];
      total: number;
      page: number;
      totalPages: number;
  }>(`/reviews`, { productId, page, limit });
  },

  async addProductReview(productId: string, review: {
    rating: number;
    title: string;
    comment: string;
    images?: string[];
  }) {
  return apiClient.post<ProductReview>(`/reviews`, { ...review, productId });
  },

  async getRelatedProducts(productId: string, limit: number = 8) {
  // Backend doesn't have related products endpoint, this would need to be implemented
  throw new Error('Related products are not currently supported');
  },

  async searchProducts(query: string, filters?: Omit<ProductFilters, 'search'>) {
    return apiClient.get<{
      products: Product[];
      total: number;
      suggestions: string[];
  }>('/search/products', { q: query, ...filters });
  },

  async getFeaturedProducts(limit: number = 12) {
  return apiClient.get<Product[]>('/products/featured', { limit });
  },

  async getProductsByCategory(categoryId: string, filters?: Omit<ProductFilters, 'category'>) {
    // Backend doesn't have category-specific products endpoint, use main products endpoint with category filter
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
  }>(`/products`, { ...filters, categoryId });
  },

  async addToWishlist(productId: string) {
  return apiClient.post('/wishlist', { productId });
  },

  async removeFromWishlist(productId: string) {
  return apiClient.delete(`/wishlist/products/${productId}`);
  },

  async reportProduct(productId: string, reason: string, description?: string) {
  // Backend doesn't have product report endpoint, this would need to be implemented
  throw new Error('Product reporting is not currently supported');
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
    // Backend doesn't have contact supplier endpoint, this would need to be implemented
    throw new Error('Contact supplier is not currently supported');
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
    // Backend doesn't have request quote endpoint, this would need to be implemented
    throw new Error('Request quote is not currently supported');
  },

  async checkAvailability(productId: string, quantity: number, variantId?: string) {
    // Backend doesn't have availability check endpoint, this would need to be implemented
    throw new Error('Availability check is not currently supported');
  }
};