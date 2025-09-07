import { apiClient } from './client';

export interface Deal {
  id: string;
  title: string;
  description: string;
  type: 'product' | 'service' | 'bulk' | 'negotiation';
  status: 'active' | 'pending' | 'completed' | 'cancelled' | 'expired';
  buyerId: string;
  sellerId: string;
  productId?: string;
  serviceId?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: string;
  requirements?: string;
  terms?: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  buyer: {
    id: string;
    name: string;
    company?: string;
    email: string;
  };
  seller: {
    id: string;
    name: string;
    company?: string;
    email: string;
  };
  product?: {
    id: string;
    name: string;
    image?: string;
    category: string;
  };
  service?: {
    id: string;
    name: string;
    category: string;
  };
  messages: DealMessage[];
}

export interface DealMessage {
  id: string;
  dealId: string;
  senderId: string;
  senderType: 'buyer' | 'seller';
  message: string;
  attachments?: string[];
  createdAt: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface CreateDealData {
  title: string;
  description: string;
  type: 'product' | 'service' | 'bulk' | 'negotiation';
  sellerId: string;
  productId?: string;
  serviceId?: string;
  quantity: number;
  unitPrice: number;
  currency?: string;
  requirements?: string;
  terms?: string;
  expiresAt?: string;
}

export interface UpdateDealData {
  title?: string;
  description?: string;
  quantity?: number;
  unitPrice?: number;
  requirements?: string;
  terms?: string;
  expiresAt?: string;
  status?: 'active' | 'pending' | 'completed' | 'cancelled';
}

export interface DealFilters {
  status?: 'active' | 'pending' | 'completed' | 'cancelled' | 'expired';
  type?: 'product' | 'service' | 'bulk' | 'negotiation';
  buyerId?: string;
  sellerId?: string;
  productId?: string;
  serviceId?: string;
  minPrice?: number;
  maxPrice?: number;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'expiresAt' | 'totalPrice';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SendMessageData {
  message: string;
  attachments?: string[];
}

export class DealService {
  // Get all deals with optional filters
  static async getDeals(filters?: DealFilters): Promise<{
    deals: Deal[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get('/deals', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch deals');
    }
    return response.data as {
      deals: Deal[];
      total: number;
      page: number;
      totalPages: number;
    };
  }

  // Get a specific deal by ID
  static async getDealById(id: string): Promise<Deal> {
    const response = await apiClient.get(`/deals/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch deal');
    }
    return response.data as Deal;
  }

  // Create a new deal
  static async createDeal(dealData: CreateDealData): Promise<Deal> {
    const response = await apiClient.post('/deals', dealData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to create deal');
    }
    return response.data as Deal;
  }

  // Update an existing deal
  static async updateDeal(id: string, dealData: UpdateDealData): Promise<Deal> {
    const response = await apiClient.put(`/deals/${id}`, dealData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update deal');
    }
    return response.data as Deal;
  }

  // Send a message on a deal
  static async sendMessage(dealId: string, messageData: SendMessageData): Promise<DealMessage> {
    const response = await apiClient.post(`/deals/${dealId}/messages`, messageData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to send message');
    }
    return response.data as DealMessage;
  }

  // Get deals for current user (as buyer or seller)
  static async getMyDeals(filters?: Omit<DealFilters, 'buyerId' | 'sellerId'>): Promise<{
    deals: Deal[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get('/deals/my', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch my deals');
    }
    return response.data as {
      deals: Deal[];
      total: number;
      page: number;
      totalPages: number;
    };
  }

  // Get active deals
  static async getActiveDeals(filters?: Omit<DealFilters, 'status'>): Promise<{
    deals: Deal[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get('/deals', { ...filters, status: 'active' });
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch active deals');
    }
    return response.data as {
      deals: Deal[];
      total: number;
      page: number;
      totalPages: number;
    };
  }

  // Get deals by product
  static async getDealsByProduct(productId: string, filters?: Omit<DealFilters, 'productId'>): Promise<{
    deals: Deal[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get('/deals', { ...filters, productId });
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch product deals');
    }
    return response.data as {
      deals: Deal[];
      total: number;
      page: number;
      totalPages: number;
    };
  }

  // Get deals by service
  static async getDealsByService(serviceId: string, filters?: Omit<DealFilters, 'serviceId'>): Promise<{
    deals: Deal[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get('/deals', { ...filters, serviceId });
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch service deals');
    }
    return response.data as {
      deals: Deal[];
      total: number;
      page: number;
      totalPages: number;
    };
  }

  // Get deals by seller
  static async getDealsBySeller(sellerId: string, filters?: Omit<DealFilters, 'sellerId'>): Promise<{
    deals: Deal[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get('/deals', { ...filters, sellerId });
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch seller deals');
    }
    return response.data as {
      deals: Deal[];
      total: number;
      page: number;
      totalPages: number;
    };
  }

  // Accept a deal (convert to order)
  static async acceptDeal(dealId: string, orderData?: {
    shippingAddress?: string;
    paymentMethod?: string;
    specialInstructions?: string;
  }): Promise<{
    success: boolean;
    orderId?: string;
    message: string;
  }> {
    const response = await apiClient.post(`/deals/${dealId}/accept`, orderData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to accept deal');
    }
    return response.data as {
      success: boolean;
      orderId?: string;
      message: string;
    };
  }

  // Reject a deal
  static async rejectDeal(dealId: string, reason?: string): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await apiClient.post(`/deals/${dealId}/reject`, { reason });
    if (!response.success) {
      throw new Error(response.error || 'Failed to reject deal');
    }
    return response.data as {
      success: boolean;
      message: string;
    };
  }

  // Cancel a deal
  static async cancelDeal(dealId: string, reason?: string): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await apiClient.post(`/deals/${dealId}/cancel`, { reason });
    if (!response.success) {
      throw new Error(response.error || 'Failed to cancel deal');
    }
    return response.data as {
      success: boolean;
      message: string;
    };
  }

  // Extend deal expiry
  static async extendDeal(dealId: string, newExpiryDate: string): Promise<Deal> {
    const response = await apiClient.post(`/deals/${dealId}/extend`, { expiresAt: newExpiryDate });
    if (!response.success) {
      throw new Error(response.error || 'Failed to extend deal');
    }
    return response.data as Deal;
  }

  // Get deal statistics
  static async getDealStats(userId?: string): Promise<{
    totalDeals: number;
    activeDeals: number;
    completedDeals: number;
    cancelledDeals: number;
    totalValue: number;
    averageDealValue: number;
    successRate: number;
    dealsByMonth: Array<{
      month: string;
      count: number;
      value: number;
    }>;
  }> {
    const response = await apiClient.get('/deals/stats', userId ? { userId } : undefined);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch deal stats');
    }
    return response.data as {
      totalDeals: number;
      activeDeals: number;
      completedDeals: number;
      cancelledDeals: number;
      totalValue: number;
      averageDealValue: number;
      successRate: number;
      dealsByMonth: Array<{
        month: string;
        count: number;
        value: number;
      }>;
    };
  }

  // Get deal messages
  static async getDealMessages(dealId: string, page?: number, limit?: number): Promise<{
    messages: DealMessage[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get(`/deals/${dealId}/messages`, { page, limit });
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch deal messages');
    }
    return response.data as {
      messages: DealMessage[];
      total: number;
      page: number;
      totalPages: number;
    };
  }

  // Mark deal messages as read
  static async markMessagesAsRead(dealId: string): Promise<void> {
    const response = await apiClient.post(`/deals/${dealId}/messages/read`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to mark messages as read');
    }
  }

  // Get unread message count
  static async getUnreadMessageCount(): Promise<{
    total: number;
    byDeal: Record<string, number>;
  }> {
    const response = await apiClient.get('/deals/messages/unread');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch unread message count');
    }
    return response.data as {
      total: number;
      byDeal: Record<string, number>;
    };
  }
}