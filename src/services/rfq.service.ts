import { RFQRequest, RFQResponse } from '../types/payment';
import { vikaretaSSOClient } from '../lib/auth/vikareta';

// Normalize API host: remove trailing /api if present; always prefix endpoints with /api/v1
const API_HOST = (
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://api.vikareta.com')
).replace(/\/api$/, '').replace(/\/api\/v1$/, '');
const apiUrl = (path: string) => `${API_HOST}/api/v1${path}`;

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

export interface SellerContact {
  id: string;
  name: string;
  businessName: string | null;
  phone: string | null;
  email: string;
  whatsappNumber: string | null;
  verificationTier: string;
  isVerified: boolean;
  averageRating: number | null;
  totalReviews: number;
  responseTime: string | null;
}

export interface QuoteResponse {
  id: string;
  sellerId: string;
  seller: SellerContact;
  totalPrice: number;
  currency: string;
  validUntil: Date | null;
  message: string | null;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  submittedAt: Date;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    description: string | null;
  }>;
  attachments: string[];
  isCounterOffer: boolean;
  originalQuoteId: string | null;
  estimatedDelivery: string | null;
  paymentTerms: string | null;
  warrantyInfo: string | null;
}

export interface WhatsAppResponse {
  id: string;
  sellerId: string;
  seller: SellerContact;
  messageContent: string;
  receivedAt: Date;
  messageType: 'text' | 'image' | 'document' | 'audio';
  attachments: string[];
  isProcessed: boolean;
  extractedPrice: number | null;
  extractedCurrency: string | null;
  confidence: number | null;
}

export interface RfqWithResponses extends RfqDetails {
  responses: {
    platform: QuoteResponse[];
    whatsapp: WhatsAppResponse[];
  };
  responseAnalytics: {
    totalResponses: number;
    platformResponses: number;
    whatsappResponses: number;
    averagePrice: number | null;
    lowestPrice: number | null;
    highestPrice: number | null;
    averageResponseTime: number | null;
    verifiedSellerResponses: number;
    lastResponseAt: Date | null;
  };
}

export interface MyRfqsWithResponsesResult {
  rfqs: RfqWithResponses[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  summary: {
    totalRfqs: number;
    totalResponses: number;
    averageResponsesPerRfq: number;
    rfqsWithResponses: number;
    rfqsWithoutResponses: number;
    platformResponsesTotal: number;
    whatsappResponsesTotal: number;
    totalValueQuoted: number;
    averageQuoteValue: number;
  };
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
    // Do not cache a stored token here; use SSO client at request time
    this.authToken = null;
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
    
    const token = (typeof window !== 'undefined') ? vikaretaSSOClient.getAccessToken() : null;
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    return headers;
  }

  setAuthToken(token: string) {
    this.authToken = token;
    // Intentionally do NOT persist tokens to localStorage.
    // Use the unified SSO client to obtain tokens when needed.
  }

  async createServiceRfq(data: ServiceRfqData): Promise<RfqDetails> {
    try {
  const response = await fetch(apiUrl('/rfqs/service'), {
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
  const response = await fetch(apiUrl('/rfqs/product'), {
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
  const response = await fetch(apiUrl('/rfqs'), {
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

  const response = await fetch(apiUrl(`/rfqs?${queryParams.toString()}`), {
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

  async getMyRfqsWithResponses(filters?: RfqFilters): Promise<MyRfqsWithResponsesResult> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }

  const response = await fetch(apiUrl(`/rfqs/my-with-responses?${queryParams.toString()}`), {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch RFQs with responses');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching RFQs with responses:', error);
      throw error;
    }
  }

  async getRfqById(rfqId: string): Promise<RfqDetails> {
    try {
  const response = await fetch(apiUrl(`/rfqs/${rfqId}`), {
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

  const response = await fetch(apiUrl(`/rfqs/relevant?${queryParams.toString()}`), {
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
  const response = await fetch(apiUrl(`/rfqs/${rfqId}`), {
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
  const response = await fetch(apiUrl(`/rfqs/${rfqId}/status`), {
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
  const response = await fetch(apiUrl(`/rfqs/${rfqId}/extend`), {
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
  const response = await fetch(apiUrl(`/rfqs/${rfqId}`), {
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
  const response = await fetch(apiUrl('/rfqs/stats'), {
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

  async getPublicRecentRfqs(limit = 5): Promise<Array<{ id: string; title: string; quantity: number | null; budgetMin: number | null; budgetMax: number | null; createdAt: string }>> {
    try {
      const params = new URLSearchParams({ limit: String(limit) });
  const response = await fetch(apiUrl(`/rfqs/public/recent?${params.toString()}`));
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch recent RFQs');
      }
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching public recent RFQs:', error);
      throw error;
    }
  }

  async uploadAttachment(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);

  const response = await fetch(apiUrl('/rfqs/upload'), {
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

  // Quote management methods
  async submitQuote(rfqId: string, quoteData: any): Promise<any> {
    try {
  const response = await fetch(apiUrl(`/rfqs/${rfqId}/quotes`), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(quoteData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to submit quote');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error submitting quote:', error);
      throw error;
    }
  }

  async updateQuoteStatus(quoteId: string, status: string, notes?: string): Promise<any> {
    try {
  const response = await fetch(apiUrl(`/quotes/${quoteId}/status`), {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({ status, notes }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to update quote status');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error updating quote status:', error);
      throw error;
    }
  }

  async acceptQuote(quoteId: string): Promise<any> {
    try {
  const response = await fetch(apiUrl(`/quotes/${quoteId}/accept`), {
        method: 'POST',
        headers: this.getHeaders(),
        // backend expects no body; only quoteId in path
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to accept quote');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error accepting quote:', error);
      throw error;
    }
  }

  async rejectQuote(quoteId: string, reason?: string): Promise<any> {
    try {
  const response = await fetch(apiUrl(`/quotes/${quoteId}/reject`), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to reject quote');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error rejecting quote:', error);
      throw error;
    }
  }

  async negotiateQuote(quoteId: string, negotiationData: {
    counterPrice?: number;
    message: string;
    requestedChanges?: string[];
  }): Promise<any> {
    try {
  const response = await fetch(apiUrl(`/quotes/${quoteId}/negotiate`), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(negotiationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to send negotiation');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error negotiating quote:', error);
      throw error;
    }
  }

  async getRfqWithResponses(rfqId: string): Promise<RfqWithResponses> {
    try {
  const response = await fetch(apiUrl(`/rfqs/${rfqId}/with-responses`), {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch RFQ with responses');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching RFQ with responses:', error);
      throw error;
    }
  }

  async getCategories(): Promise<any[]> {
    try {
  const response = await fetch(apiUrl('/categories'), {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch categories');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  async getSubcategories(categoryId: string): Promise<any[]> {
    try {
  const response = await fetch(apiUrl(`/categories/${categoryId}/subcategories`), {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch subcategories');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching subcategories:', error);
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

  async submitSupplierResponse(rfqId: string, response: Omit<RFQResponse, 'id' | 'createdAt'>): Promise<{ success: boolean; responseId?: string; error?: string }> {
    try {
      const quoteData = {
        totalPrice: response.quotedPrice,
        currency: 'INR',
        message: response.terms,
        validUntil: new Date(response.validUntil),
        items: [{
          name: 'Product',
          quantity: 1,
          unitPrice: response.quotedPrice,
          description: response.terms
        }],
        estimatedDelivery: response.deliveryTime,
        paymentTerms: response.terms
      };

      const result = await this.submitQuote(rfqId, quoteData);
      return {
        success: true,
        responseId: result.id,
      };
    } catch (error) {
      console.error('Error submitting supplier response:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit response',
      };
    }
  }

  async getSupplierResponses(rfqId: string): Promise<{ success: boolean; responses?: RFQResponse[]; error?: string }> {
    try {
      const rfqWithResponses = await this.getRfqWithResponses(rfqId);
      
      // Convert platform responses to legacy format
      const legacyResponses: RFQResponse[] = rfqWithResponses.responses.platform.map(quote => ({
        id: quote.id,
        supplierId: quote.sellerId,
        supplierName: quote.seller.name,
        quotedPrice: quote.totalPrice,
        deliveryTime: quote.estimatedDelivery || '',
        terms: quote.message || '',
        validUntil: quote.validUntil?.toISOString() || '',
        status: quote.status as any,
        createdAt: quote.submittedAt.toISOString(),
        attachments: quote.attachments || []
      }));

      return {
        success: true,
        responses: legacyResponses,
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