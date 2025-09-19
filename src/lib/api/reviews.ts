import { apiClient } from './client';

export interface Review {
  id: string;
  userId: string;
  productId?: string;
  serviceId?: string;
  businessId?: string;
  orderId?: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  isVerified: boolean;
  helpful: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  product?: {
    id: string;
    name: string;
    image?: string;
  };
  service?: {
    id: string;
    name: string;
    image?: string;
  };
  business?: {
    id: string;
    name: string;
    logo?: string;
  };
}

export interface CreateReviewData {
  productId?: string;
  serviceId?: string;
  businessId?: string;
  orderId?: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
}

export interface UpdateReviewData {
  rating?: number;
  title?: string;
  comment?: string;
  images?: string[];
}

export interface ReviewFilters {
  productId?: string;
  serviceId?: string;
  businessId?: string;
  userId?: string;
  rating?: number;
  isVerified?: boolean;
  sortBy?: 'createdAt' | 'rating' | 'helpful';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export class ReviewService {
  // Get all reviews with optional filters
  static async getReviews(filters?: ReviewFilters): Promise<{
    reviews: Review[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get('/reviews', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch reviews');
    }
    return response.data as {
      reviews: Review[];
      total: number;
      page: number;
      totalPages: number;
    };
  }

  // Get a specific review by ID
  static async getReviewById(id: string): Promise<Review> {
    const response = await apiClient.get(`/reviews/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch review');
    }
    return response.data as Review;
  }

  // Create a new review
  static async createReview(reviewData: CreateReviewData): Promise<Review> {
    const response = await apiClient.post('/reviews', reviewData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to create review');
    }
    return response.data as Review;
  }

  // Update an existing review
  static async updateReview(id: string, reviewData: UpdateReviewData): Promise<Review> {
    const response = await apiClient.put(`/reviews/${id}`, reviewData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update review');
    }
    return response.data as Review;
  }

  // Delete a review
  static async deleteReview(id: string): Promise<void> {
    const response = await apiClient.delete(`/reviews/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete review');
    }
  }

  // Get reviews for a specific product
  static async getProductReviews(productId: string, filters?: Omit<ReviewFilters, 'productId'>): Promise<{
    reviews: Review[];
    total: number;
    page: number;
    totalPages: number;
    averageRating: number;
  }> {
    const response = await apiClient.get('/reviews', { ...filters, productId });
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch product reviews');
    }
    return response.data as {
      reviews: Review[];
      total: number;
      page: number;
      totalPages: number;
      averageRating: number;
    };
  }

  // Get reviews for a specific service
  static async getServiceReviews(serviceId: string, filters?: Omit<ReviewFilters, 'serviceId'>): Promise<{
    reviews: Review[];
    total: number;
    page: number;
    totalPages: number;
    averageRating: number;
  }> {
    const response = await apiClient.get('/reviews', { ...filters, serviceId });
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch service reviews');
    }
    return response.data as {
      reviews: Review[];
      total: number;
      page: number;
      totalPages: number;
      averageRating: number;
    };
  }

  // Get reviews for a specific business
  static async getBusinessReviews(businessId: string, filters?: Omit<ReviewFilters, 'businessId'>): Promise<{
    reviews: Review[];
    total: number;
    page: number;
    totalPages: number;
    averageRating: number;
  }> {
    const response = await apiClient.get('/reviews', { ...filters, businessId });
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch business reviews');
    }
    return response.data as {
      reviews: Review[];
      total: number;
      page: number;
      totalPages: number;
      averageRating: number;
    };
  }

  // Get reviews by a specific user
  static async getUserReviews(userId: string, filters?: Omit<ReviewFilters, 'userId'>): Promise<{
    reviews: Review[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get('/reviews', { ...filters, userId });
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch user reviews');
    }
    return response.data as {
      reviews: Review[];
      total: number;
      page: number;
      totalPages: number;
    };
  }

  // Mark a review as helpful (not available in backend)
  static async markReviewHelpful(reviewId: string): Promise<void> {
    // Backend doesn't have helpful endpoint, this would need to be implemented
    throw new Error('Marking reviews as helpful is not currently supported');
  }

  // Get review statistics (not available in backend)
  static async getReviewStats(targetId: string, targetType: 'product' | 'service' | 'business'): Promise<{
    totalReviews: number;
    averageRating: number;
    ratingDistribution: Record<number, number>;
    verifiedReviews: number;
  }> {
    // Backend doesn't have review stats endpoint, this would need to be implemented
    throw new Error('Review statistics are not currently supported');
  }
}