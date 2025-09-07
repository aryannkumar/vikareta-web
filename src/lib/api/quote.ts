import { apiClient } from './client';

export interface Quote {
  id: string;
  rfqId: string;
  sellerId: string;
  buyerId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired' | 'withdrawn';
  price: number;
  currency: string;
  deliveryTime: number;
  deliveryTimeUnit: 'days' | 'weeks' | 'months';
  description: string;
  terms?: string;
  attachments?: string[];
  validUntil: string;
  createdAt: string;
  updatedAt: string;
  seller: {
    id: string;
    name: string;
    company?: string;
    email: string;
    rating?: number;
  };
  buyer: {
    id: string;
    name: string;
    company?: string;
    email: string;
  };
  rfq: {
    id: string;
    title: string;
    description: string;
    category: string;
    quantity: number;
    budget?: string;
  };
}

export interface CreateQuoteData {
  rfqId: string;
  price: number;
  currency?: string;
  deliveryTime: number;
  deliveryTimeUnit: 'days' | 'weeks' | 'months';
  description: string;
  terms?: string;
  attachments?: string[];
  validUntil?: string;
}

export interface UpdateQuoteData {
  price?: number;
  deliveryTime?: number;
  deliveryTimeUnit?: 'days' | 'weeks' | 'months';
  description?: string;
  terms?: string;
  attachments?: string[];
  validUntil?: string;
}

export interface QuoteFilters {
  status?: 'pending' | 'accepted' | 'rejected' | 'expired' | 'withdrawn';
  rfqId?: string;
  sellerId?: string;
  buyerId?: string;
  minPrice?: number;
  maxPrice?: number;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'createdAt' | 'price' | 'deliveryTime' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export class QuoteService {
  // Get all quotes with optional filters
  static async getQuotes(filters?: QuoteFilters): Promise<{
    quotes: Quote[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get('/quotes', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch quotes');
    }
    return response.data as {
      quotes: Quote[];
      total: number;
      page: number;
      totalPages: number;
    };
  }

  // Get a specific quote by ID
  static async getQuoteById(id: string): Promise<Quote> {
    const response = await apiClient.get(`/quotes/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch quote');
    }
    return response.data as Quote;
  }

  // Create a new quote
  static async createQuote(quoteData: CreateQuoteData): Promise<Quote> {
    const response = await apiClient.post('/quotes', quoteData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to create quote');
    }
    return response.data as Quote;
  }

  // Update an existing quote
  static async updateQuote(id: string, quoteData: UpdateQuoteData): Promise<Quote> {
    const response = await apiClient.put(`/quotes/${id}`, quoteData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update quote');
    }
    return response.data as Quote;
  }

  // Delete a quote
  static async deleteQuote(id: string): Promise<void> {
    const response = await apiClient.delete(`/quotes/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete quote');
    }
  }

  // Accept a quote
  static async acceptQuote(id: string): Promise<{
    success: boolean;
    message: string;
    orderId?: string;
  }> {
    const response = await apiClient.post(`/quotes/${id}/accept`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to accept quote');
    }
    return response.data as {
      success: boolean;
      message: string;
      orderId?: string;
    };
  }

  // Reject a quote
  static async rejectQuote(id: string, reason?: string): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await apiClient.post(`/quotes/${id}/reject`, { reason });
    if (!response.success) {
      throw new Error(response.error || 'Failed to reject quote');
    }
    return response.data as {
      success: boolean;
      message: string;
    };
  }

  // Withdraw a quote
  static async withdrawQuote(id: string, reason?: string): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await apiClient.post(`/quotes/${id}/withdraw`, { reason });
    if (!response.success) {
      throw new Error(response.error || 'Failed to withdraw quote');
    }
    return response.data as {
      success: boolean;
      message: string;
    };
  }

  // Get quotes for a specific RFQ
  static async getQuotesForRFQ(rfqId: string, filters?: Omit<QuoteFilters, 'rfqId'>): Promise<{
    quotes: Quote[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get('/quotes', { ...filters, rfqId });
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch RFQ quotes');
    }
    return response.data as {
      quotes: Quote[];
      total: number;
      page: number;
      totalPages: number;
    };
  }

  // Get quotes by seller
  static async getQuotesBySeller(sellerId: string, filters?: Omit<QuoteFilters, 'sellerId'>): Promise<{
    quotes: Quote[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get('/quotes', { ...filters, sellerId });
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch seller quotes');
    }
    return response.data as {
      quotes: Quote[];
      total: number;
      page: number;
      totalPages: number;
    };
  }

  // Get quotes by buyer
  static async getQuotesByBuyer(buyerId: string, filters?: Omit<QuoteFilters, 'buyerId'>): Promise<{
    quotes: Quote[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get('/quotes', { ...filters, buyerId });
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch buyer quotes');
    }
    return response.data as {
      quotes: Quote[];
      total: number;
      page: number;
      totalPages: number;
    };
  }

  // Get my quotes (as current user)
  static async getMyQuotes(filters?: Omit<QuoteFilters, 'sellerId' | 'buyerId'>): Promise<{
    quotes: Quote[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get('/quotes/my', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch my quotes');
    }
    return response.data as {
      quotes: Quote[];
      total: number;
      page: number;
      totalPages: number;
    };
  }

  // Get quote statistics
  static async getQuoteStats(): Promise<{
    totalQuotes: number;
    pendingQuotes: number;
    acceptedQuotes: number;
    rejectedQuotes: number;
    conversionRate: number;
    averageQuoteValue: number;
    quotesByStatus: Record<string, number>;
    quotesByMonth: Array<{
      month: string;
      count: number;
      value: number;
    }>;
  }> {
    const response = await apiClient.get('/quotes/stats');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch quote stats');
    }
    return response.data as {
      totalQuotes: number;
      pendingQuotes: number;
      acceptedQuotes: number;
      rejectedQuotes: number;
      conversionRate: number;
      averageQuoteValue: number;
      quotesByStatus: Record<string, number>;
      quotesByMonth: Array<{
        month: string;
        count: number;
        value: number;
      }>;
    };
  }

  // Negotiate quote terms
  static async negotiateQuote(id: string, negotiationData: {
    proposedPrice?: number;
    proposedDeliveryTime?: number;
    proposedDeliveryTimeUnit?: 'days' | 'weeks' | 'months';
    message: string;
  }): Promise<{
    success: boolean;
    message: string;
    updatedQuote?: Quote;
  }> {
    const response = await apiClient.post(`/quotes/${id}/negotiate`, negotiationData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to negotiate quote');
    }
    return response.data as {
      success: boolean;
      message: string;
      updatedQuote?: Quote;
    };
  }

  // Get quote negotiation history
  static async getQuoteNegotiations(id: string): Promise<Array<{
    id: string;
    quoteId: string;
    senderId: string;
    senderType: 'buyer' | 'seller';
    message: string;
    proposedPrice?: number;
    proposedDeliveryTime?: number;
    proposedDeliveryTimeUnit?: 'days' | 'weeks' | 'months';
    createdAt: string;
    sender: {
      id: string;
      name: string;
      avatar?: string;
    };
  }>> {
    const response = await apiClient.get(`/quotes/${id}/negotiations`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch quote negotiations');
    }
    return response.data as Array<{
      id: string;
      quoteId: string;
      senderId: string;
      senderType: 'buyer' | 'seller';
      message: string;
      proposedPrice?: number;
      proposedDeliveryTime?: number;
      proposedDeliveryTimeUnit?: 'days' | 'weeks' | 'months';
      createdAt: string;
      sender: {
        id: string;
        name: string;
        avatar?: string;
      };
    }>;
  }

  // Compare quotes for an RFQ
  static async compareQuotes(rfqId: string): Promise<{
    rfq: {
      id: string;
      title: string;
      description: string;
      quantity: number;
      budget?: string;
    };
    quotes: Array<{
      id: string;
      seller: {
        id: string;
        name: string;
        company?: string;
        rating?: number;
      };
      price: number;
      currency: string;
      deliveryTime: number;
      deliveryTimeUnit: 'days' | 'weeks' | 'months';
      description: string;
      score: number; // Calculated comparison score
    }>;
    bestQuote?: {
      id: string;
      reason: string;
    };
  }> {
    const response = await apiClient.get('/quotes/compare', { rfqId });
    if (!response.success) {
      throw new Error(response.error || 'Failed to compare quotes');
    }
    return response.data as {
      rfq: {
        id: string;
        title: string;
        description: string;
        quantity: number;
        budget?: string;
      };
      quotes: Array<{
        id: string;
        seller: {
          id: string;
          name: string;
          company?: string;
          rating?: number;
        };
        price: number;
        currency: string;
        deliveryTime: number;
        deliveryTimeUnit: 'days' | 'weeks' | 'months';
        description: string;
        score: number;
      }>;
      bestQuote?: {
        id: string;
        reason: string;
      };
    };
  }
}