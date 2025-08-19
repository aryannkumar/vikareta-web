import { RFQRequest, RFQResponse } from '../types/payment';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface CreateRfqData {
  title: string;
  description?: string;
  categoryId: string;
  subcategoryId?: string;
  quantity?: number;
  budgetMin?: number;
  budgetMax?: number;
  deliveryTimeline?: string;
  deliveryLocation?: string;
  expiresAt?: Date;
}

export interface ServiceRfqData {
  title: string;
  description: string;
  categoryId: string;
  subcategoryId?: string;
  serviceType: 'one_time' | 'recurring' | 'subscription';
  budgetMin?: number;
  budgetMax?: number;
  preferredLocation: 'online' | 'on_site' | 'both';
  serviceLocation?: string;
  preferredTimeline: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  requirements?: string[];
  attachments?: string[];
  expiresAt?: Date;
}

export interface ProductRfqData {
  title: string;
  description: string;
  categoryId: string;
  subcategoryId?: string;
  quantity: number;
  budgetMin?: number;
  budgetMax?: number;
  deliveryLocation: string;
  deliveryTimeline: string;
  specifications?: string[];
  attachments?: string[];
  expiresAt?: Date;
}

export interface RfqFilters {
  buyerId?: string;
  sellerId?: string;
  categoryId?: string;
  subcategoryId?: string;
  status?: string;
  rfqType?: 'product' | 'service';
  minBudget?: number;
  maxBudget?: number;
  urgency?: 'low' | 'medium' | 'high' | 'urgent';
  location?: string;
  search?: string;
  verificationTier?: string;
  isVerified?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'expiresAt' | 'budgetMax' | 'title' | 'urgency' | 'quoteCount';
  sortOrder?: 'asc' | 'desc';
}

export interface RfqDetails {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  subcategoryId?: string;
  quantity?: number;
  budgetMin?: number;
  budgetMax?: number;
  deliveryTimeline?: string;
  deliveryLocation?: string;
  status: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  buyer: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    businessName: string | null;
    verificationTier: string;
    isVerified: boolean;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  subcategory?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  quotes: any[];
  rfqType: 'product' | 'service';
  quoteCount: number;
  isExpired: boolean;
  daysRemaining: number | null;
  urgency?: string;
  serviceType?: string;
  preferredLocation?: string;
  requirements?: string[];
  specifications?: string[];
  attachments?: string[];
  canEdit: boolean;
  canQuote: boolean;
  averageQuotePrice?: number | null;
}

export class RFQService {
  private static instance: RFQService;
  private authToken: string | null = null;

  private constructor() {
    // Initialize auth token from localStorage or cookies
    if (typeof window !== 'undefined') {
      this.authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    }
  }

  public static getInstance(): RFQService {
    if (!RFQService.instance) {
      RFQService.instance = new RFQService();
    }
    return RFQService.instance;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    
    return headers;
  }

  setAuthToken(token: string) {
    this.authToken = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  async createServiceRfq(data: ServiceRfqData): Promise<RfqDetails> {
    try {
      const response = await fetch(`${API_BASE_URL}/rfqs/service`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to create service RFQ');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error creating service RFQ:', error);
      throw error;
    }
  }

  async createProductRfq(data: ProductRfqData): Promise<RfqDetails> {
    try {
      const response = await fetch(`${API_BASE_URL}/rfqs/product`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to create product RFQ');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error creating product RFQ:', error);
      throw error;
    }
  }

  async createRfq(data: CreateRfqData): Promise<RfqDetails> {
    try {
      const response = await fetch(`${API_BASE_URL}/rfqs`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to create RFQ');
      }

      const result = await response.json();
      return result.data.rfq;
    } catch (error) {
      console.error('Error creating RFQ:', error);
      throw error;
    }
  }

  async getRfqs(filters?: RfqFilters): Promise<{ rfqs: RfqDetails[]; pagination: any }> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const response = await fetch(`${API_BASE_URL}/rfqs?${queryParams.toString()}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch RFQs');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching RFQs:', error);
      throw error;
    }
  }

  async getRfqById(rfqId: string): Promise<RfqDetails> {
    try {
      const response = await fetch(`${API_BASE_URL}/rfqs/${rfqId}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch RFQ');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching RFQ:', error);
      throw error;
    }
  }

  async getRelevantRfqsForSeller(filters?: RfqFilters): Promise<{ rfqs: RfqDetails[]; pagination: any }> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const response = await fetch(`${API_BASE_URL}/rfqs/relevant?${queryParams.toString()}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch relevant RFQs');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching relevant RFQs:', error);
      throw error;
    }
  }

  async updateRfq(rfqId: string, updateData: Partial<CreateRfqData>): Promise<RfqDetails> {
    try {
      const response = await fetch(`${API_BASE_URL}/rfqs/${rfqId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to update RFQ');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error updating RFQ:', error);
      throw error;
    }
  }

  async updateRfqStatus(rfqId: string, status: string): Promise<RfqDetails> {
    try {
      const response = await fetch(`${API_BASE_URL}/rfqs/${rfqId}/status`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to update RFQ status');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error updating RFQ status:', error);
      throw error;
    }
  }

  async extendRfqExpiry(rfqId: string, newExpiryDate: Date): Promise<RfqDetails> {
    try {
      const response = await fetch(`${API_BASE_URL}/rfqs/${rfqId}/extend`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({ expiresAt: newExpiryDate.toISOString() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to extend RFQ expiry');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error extending RFQ expiry:', error);
      throw error;
    }
  }

  async deleteRfq(rfqId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/rfqs/${rfqId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to delete RFQ');
      }
    } catch (error) {
      console.error('Error deleting RFQ:', error);
      throw error;
    }
  }

  async getRfqAnalytics(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/rfqs/stats`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch RFQ analytics');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching RFQ analytics:', error);
      throw error;
    }
  }

  async uploadAttachment(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/rfqs/upload`, {
        method: 'POST',
        headers: {
          ...(this.authToken && { 'Authorization': `Bearer ${this.authToken}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to upload attachment');
      }

      const result = await response.json();
      return result.data.url;
    } catch (error) {
      console.error('Error uploading attachment:', error);
      throw error;
    }
  }

  // Legacy methods for backward compatibility
  async submitRFQ(rfqData: Omit<RFQRequest, 'id' | 'status' | 'createdAt' | 'responses'>): Promise<{ success: boolean; rfqId?: string; error?: string }> {
    try {
      // Convert legacy RFQ format to new format
      const createData: CreateRfqData = {
        title: `RFQ from ${rfqData.companyName}`,
        description: `${rfqData.requirements}\n\nContact: ${rfqData.contactPerson}\nPhone: ${rfqData.phone}\nEmail: ${rfqData.email}`,
        categoryId: rfqData.category, // Assuming category is an ID
        quantity: rfqData.quantity,
        budgetMax: rfqData.budget,
        deliveryTimeline: rfqData.timeline,
      };

      const result = await this.createRfq(createData);
      return {
        success: true,
        rfqId: result.id,
      };
    } catch (error) {
      console.error('Error submitting legacy RFQ:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit RFQ',
      };
    }
  }

  async getAllRFQs(): Promise<{ success: boolean; rfqs?: RFQRequest[]; error?: string }> {
    try {
      const result = await this.getRfqs();
      
      // Convert new format to legacy format
      const legacyRfqs: RFQRequest[] = result.rfqs.map(rfq => ({
        id: rfq.id,
        companyName: rfq.buyer.businessName || `${rfq.buyer.firstName} ${rfq.buyer.lastName}`,
        contactPerson: `${rfq.buyer.firstName} ${rfq.buyer.lastName}`,
        email: '', // Would need to be fetched separately
        phone: '', // Would need to be fetched separately
        requirements: rfq.description,
        category: rfq.category.name,
        quantity: rfq.quantity,
        budget: rfq.budgetMax,
        timeline: rfq.deliveryTimeline || '',
        status: rfq.status as any,
        createdAt: rfq.createdAt.toISOString(),
        responses: [],
      }));

      return {
        success: true,
        rfqs: legacyRfqs,
      };
    } catch (error) {
      console.error('Error fetching all RFQs:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch RFQs',
      };
    }
  }

  async getRFQById(rfqId: string): Promise<{ success: boolean; rfq?: RFQRequest; error?: string }> {
    try {
      const rfq = await this.getRfqById(rfqId);
      
      // Convert new format to legacy format
      const legacyRfq: RFQRequest = {
        id: rfq.id,
        companyName: rfq.buyer.businessName || `${rfq.buyer.firstName} ${rfq.buyer.lastName}`,
        contactPerson: `${rfq.buyer.firstName} ${rfq.buyer.lastName}`,
        email: '', // Would need to be fetched separately
        phone: '', // Would need to be fetched separately
        requirements: rfq.description,
        category: rfq.category.name,
        quantity: rfq.quantity,
        budget: rfq.budgetMax,
        timeline: rfq.deliveryTimeline || '',
        status: rfq.status as any,
        createdAt: rfq.createdAt.toISOString(),
        responses: [], // Would need to be converted from quotes
      };

      return {
        success: true,
        rfq: legacyRfq,
      };
    } catch (error) {
      console.error('Error fetching RFQ by ID:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch RFQ',
      };
    }
  }

  async updateRFQStatus(rfqId: string, status: string): Promise<{ success: boolean; error?: string }> {
    try {
      await this.updateRfqStatus(rfqId, status);
      return { success: true };
    } catch (error) {
      console.error('Error updating RFQ status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update RFQ status',
      };
    }
  }

  async submitSupplierResponse(_rfqId: string, _response: Omit<RFQResponse, 'id' | 'createdAt'>): Promise<{ success: boolean; responseId?: string; error?: string }> {
    try {
      // This would need to integrate with the quotes system
      // For now, return a placeholder implementation
      console.warn('submitSupplierResponse: Implementation pending - integrate with quotes system');
      return {
        success: false,
        error: 'Implementation pending - integrate with quotes system',
      };
    } catch (error) {
      console.error('Error submitting supplier response:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit response',
      };
    }
  }

  async getSupplierResponses(_rfqId: string): Promise<{ success: boolean; responses?: RFQResponse[]; error?: string }> {
    try {
      // This would need to integrate with the quotes system
      // For now, return a placeholder implementation
      console.warn('getSupplierResponses: Implementation pending - integrate with quotes system');
      return {
        success: false,
        error: 'Implementation pending - integrate with quotes system',
      };
    } catch (error) {
      console.error('Error fetching supplier responses:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch responses',
      };
    }
  }
}

export const rfqService = RFQService.getInstance();