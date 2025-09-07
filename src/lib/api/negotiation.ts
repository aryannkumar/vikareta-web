import { apiClient } from './client';

export interface NegotiationHistory {
  id: string;
  quoteId: string;
  buyerId: string;
  sellerId: string;
  fromUserId: string;
  toUserId: string;
  offerPrice: number;
  price: number;
  offerType: 'initial' | 'counter' | 'final';
  message?: string;
  terms?: string;
  validUntil?: string;
  expiresAt?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  createdAt: string;
  updatedAt: string;
  fromUser: {
    id: string;
    firstName?: string;
    lastName?: string;
    businessName?: string;
    avatar?: string;
  };
  toUser: {
    id: string;
    firstName?: string;
    lastName?: string;
    businessName?: string;
    avatar?: string;
  };
  quote: {
    id: string;
    title: string;
    description?: string;
    budget?: number;
  };
}

export interface CreateNegotiationData {
  quoteId: string;
  buyerId: string;
  sellerId: string;
  offerPrice: number;
  price?: number;
  offerType?: 'initial' | 'counter' | 'final';
  message?: string;
  terms?: string;
  validUntil?: string;
}

export interface CounterNegotiationData {
  price: number;
  message?: string;
}

export interface NegotiationFilters {
  quoteId?: string;
  buyerId?: string;
  sellerId?: string;
  status?: string;
  offerType?: string;
  dateFrom?: string;
  dateTo?: string;
}

export class NegotiationService {
  // Get negotiations for a specific quote
  static async getNegotiationsForQuote(quoteId: string): Promise<NegotiationHistory[]> {
    const response = await apiClient.get<NegotiationHistory[]>(`/negotiations/quote/${quoteId}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch negotiations for quote');
    }
    return response.data;
  }

  // Get all negotiations for current user
  static async getMyNegotiations(filters?: NegotiationFilters): Promise<{
    negotiations: NegotiationHistory[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      negotiations: NegotiationHistory[];
      total: number;
      page: number;
      totalPages: number;
    }>('/negotiations', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch negotiations');
    }
    return response.data;
  }

  // Get negotiation by ID
  static async getNegotiationById(id: string): Promise<NegotiationHistory> {
    const response = await apiClient.get<NegotiationHistory>(`/negotiations/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch negotiation');
    }
    return response.data;
  }

  // Create new negotiation
  static async createNegotiation(data: CreateNegotiationData): Promise<NegotiationHistory> {
    const response = await apiClient.post<NegotiationHistory>('/negotiations', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to create negotiation');
    }
    return response.data;
  }

  // Counter negotiation offer
  static async counterNegotiation(id: string, data: CounterNegotiationData): Promise<NegotiationHistory> {
    const response = await apiClient.post<NegotiationHistory>(`/negotiations/${id}/counter`, data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to counter negotiation');
    }
    return response.data;
  }

  // Accept negotiation
  static async acceptNegotiation(id: string): Promise<NegotiationHistory> {
    const response = await apiClient.post<NegotiationHistory>(`/negotiations/${id}/accept`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to accept negotiation');
    }
    return response.data;
  }

  // Reject negotiation
  static async rejectNegotiation(id: string, reason?: string): Promise<NegotiationHistory> {
    const response = await apiClient.post<NegotiationHistory>(`/negotiations/${id}/reject`, { reason });
    if (!response.success) {
      throw new Error(response.error || 'Failed to reject negotiation');
    }
    return response.data;
  }

  // Mark negotiation as final offer
  static async markNegotiationAsFinal(id: string): Promise<NegotiationHistory> {
    const response = await apiClient.post<NegotiationHistory>(`/negotiations/${id}/final`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to mark negotiation as final');
    }
    return response.data;
  }

  // Get negotiation statistics
  static async getNegotiationStats(): Promise<{
    totalNegotiations: number;
    activeNegotiations: number;
    completedNegotiations: number;
    acceptedNegotiations: number;
    rejectedNegotiations: number;
    averageNegotiationTime: number; // in hours
    successRate: number;
    averagePriceReduction: number;
    negotiationsByStatus: Record<string, number>;
    negotiationsByOfferType: Record<string, number>;
  }> {
    const response = await apiClient.get<{
      totalNegotiations: number;
      activeNegotiations: number;
      completedNegotiations: number;
      acceptedNegotiations: number;
      rejectedNegotiations: number;
      averageNegotiationTime: number;
      successRate: number;
      averagePriceReduction: number;
      negotiationsByStatus: Record<string, number>;
      negotiationsByOfferType: Record<string, number>;
    }>('/negotiations/stats');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch negotiation stats');
    }
    return response.data;
  }

  // Get negotiation timeline for a quote
  static async getNegotiationTimeline(quoteId: string): Promise<Array<{
    id: string;
    type: 'offer' | 'counter' | 'accept' | 'reject' | 'final';
    fromUser: string;
    toUser: string;
    price: number;
    message?: string;
    timestamp: string;
    status: string;
  }>> {
    const response = await apiClient.get<Array<{
      id: string;
      type: 'offer' | 'counter' | 'accept' | 'reject' | 'final';
      fromUser: string;
      toUser: string;
      price: number;
      message?: string;
      timestamp: string;
      status: string;
    }>>(`/negotiations/quote/${quoteId}/timeline`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch negotiation timeline');
    }
    return response.data;
  }

  // Get pending negotiations count
  static async getPendingNegotiationsCount(): Promise<{
    total: number;
    asBuyer: number;
    asSeller: number;
    urgent: number; // expiring within 24 hours
  }> {
    const response = await apiClient.get<{
      total: number;
      asBuyer: number;
      asSeller: number;
      urgent: number;
    }>('/negotiations/pending/count');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch pending negotiations count');
    }
    return response.data;
  }

  // Get expiring negotiations
  static async getExpiringNegotiations(hours: number = 24): Promise<NegotiationHistory[]> {
    const response = await apiClient.get<NegotiationHistory[]>(`/negotiations/expiring?hours=${hours}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch expiring negotiations');
    }
    return response.data;
  }

  // Send negotiation reminder
  static async sendNegotiationReminder(id: string): Promise<{
    success: boolean;
    message: string;
    sentTo: string;
  }> {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      sentTo: string;
    }>(`/negotiations/${id}/reminder`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to send negotiation reminder');
    }
    return response.data;
  }

  // Bulk accept negotiations
  static async bulkAcceptNegotiations(negotiationIds: string[]): Promise<{
    success: boolean;
    accepted: number;
    failed: number;
    results: Array<{
      id: string;
      success: boolean;
      error?: string;
    }>;
  }> {
    const response = await apiClient.post<{
      success: boolean;
      accepted: number;
      failed: number;
      results: Array<{
        id: string;
        success: boolean;
        error?: string;
      }>;
    }>('/negotiations/bulk-accept', { negotiationIds });
    if (!response.success) {
      throw new Error(response.error || 'Failed to bulk accept negotiations');
    }
    return response.data;
  }

  // Get negotiation templates
  static async getNegotiationTemplates(): Promise<Array<{
    id: string;
    name: string;
    type: 'initial' | 'counter' | 'final';
    message: string;
    isDefault: boolean;
  }>> {
    const response = await apiClient.get<Array<{
      id: string;
      name: string;
      type: 'initial' | 'counter' | 'final';
      message: string;
      isDefault: boolean;
    }>>('/negotiations/templates');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch negotiation templates');
    }
    return response.data;
  }

  // Create negotiation template
  static async createNegotiationTemplate(data: {
    name: string;
    type: 'initial' | 'counter' | 'final';
    message: string;
    isDefault?: boolean;
  }): Promise<{
    id: string;
    name: string;
    type: string;
    message: string;
    isDefault: boolean;
  }> {
    const response = await apiClient.post<{
      id: string;
      name: string;
      type: string;
      message: string;
      isDefault: boolean;
    }>('/negotiations/templates', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to create negotiation template');
    }
    return response.data;
  }
}