import { apiClient } from './client';

export interface RFQ {
  id: string;
  title: string;
  description: string;
  category: {
    id: string;
    name: string;
  };
  subcategory?: {
    id: string;
    name: string;
  };
  quantity: number;
  unit: string;
  budget?: {
    min: number;
    max: number;
    currency: string;
  };
  deliveryLocation: string;
  deliveryDate: string;
  specifications: Record<string, any>;
  attachments: string[];
  status: 'draft' | 'published' | 'closed' | 'awarded';
  visibility: 'public' | 'private';
  buyerId: string;
  buyerName: string;
  buyerLocation: string;
  responses: RFQResponse[];
  responseCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

export interface RFQResponse {
  id: string;
  rfqId: string;
  supplierId: string;
  supplierName: string;
  supplierLogo?: string;
  supplierLocation: string;
  supplierRating: number;
  supplierVerified: boolean;
  quotedPrice: number;
  currency: string;
  deliveryTime: string;
  validUntil: string;
  message: string;
  attachments: string[];
  specifications: Record<string, any>;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  createdAt: string;
  updatedAt: string;
}

export interface CreateRFQData {
  title: string;
  description: string;
  categoryId: string;
  subcategoryId?: string;
  quantity: number;
  unit: string;
  budget?: {
    min: number;
    max: number;
  };
  deliveryLocation: string;
  deliveryDate: string;
  specifications: Record<string, any>;
  attachments?: string[];
  visibility: 'public' | 'private';
  expiresAt: string;
}

export interface RFQFilters {
  category?: string;
  subcategory?: string;
  location?: string;
  budgetMin?: number;
  budgetMax?: number;
  status?: string;
  sortBy?: 'newest' | 'budget' | 'responses' | 'expiry';
  page?: number;
  limit?: number;
  search?: string;
}

export const rfqApi = {
  async getRFQs(filters?: RFQFilters) {
    return apiClient.get<{
      rfqs: RFQ[];
      total: number;
      page: number;
      totalPages: number;
    }>('/rfqs', filters);
  },

  async getRFQ(id: string) {
    return apiClient.get<RFQ>(`/rfqs/${id}`);
  },

  async createRFQ(data: CreateRFQData) {
    return apiClient.post<RFQ>('/rfqs', data);
  },

  async updateRFQ(id: string, data: Partial<CreateRFQData>) {
    return apiClient.put<RFQ>(`/rfqs/${id}`, data);
  },

  async deleteRFQ(id: string) {
    return apiClient.delete(`/rfqs/${id}`);
  },

  async getMyRFQs(filters?: Omit<RFQFilters, 'search'>) {
    return apiClient.get<{
      rfqs: RFQ[];
      total: number;
      page: number;
      totalPages: number;
    }>('/rfqs/my', filters);
  },

  async getRFQResponses(rfqId: string) {
    return apiClient.get<RFQResponse[]>(`/rfqs/${rfqId}/responses`);
  },

  async submitRFQResponse(rfqId: string, data: {
    quotedPrice: number;
    deliveryTime: string;
    validUntil: string;
    message: string;
    attachments?: string[];
    specifications?: Record<string, any>;
  }) {
    return apiClient.post<RFQResponse>(`/rfqs/${rfqId}/responses`, data);
  },

  async updateRFQResponse(rfqId: string, responseId: string, data: {
    quotedPrice?: number;
    deliveryTime?: string;
    validUntil?: string;
    message?: string;
    attachments?: string[];
    specifications?: Record<string, any>;
  }) {
    return apiClient.put<RFQResponse>(`/rfqs/${rfqId}/responses/${responseId}`, data);
  },

  async acceptRFQResponse(rfqId: string, responseId: string) {
    return apiClient.post(`/rfqs/${rfqId}/responses/${responseId}/accept`);
  },

  async rejectRFQResponse(rfqId: string, responseId: string, reason?: string) {
    return apiClient.post(`/rfqs/${rfqId}/responses/${responseId}/reject`, { reason });
  },

  async closeRFQ(id: string, reason?: string) {
    return apiClient.post(`/rfqs/${id}/close`, { reason });
  },

  async uploadAttachment(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.upload<{ url: string; filename: string }>('/rfqs/upload', formData);
  }
};