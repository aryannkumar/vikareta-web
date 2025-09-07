import { apiClient } from './client';

export interface DeliveryPartner {
  id: string;
  name: string;
  code: string;
  apiEndpoint?: string;
  apiKey?: string;
  supportedServices?: any; // JSON object with service types
  serviceAreas?: any; // JSON object with supported areas
  isActive: boolean;
  priority: number;
  rateCard?: any; // JSON object with pricing
  contactInfo?: any; // JSON object with contact details
  createdAt: string;
  updatedAt: string;
}

export interface SellerDeliveryPreference {
  id: string;
  sellerId: string;
  deliveryPartnerId: string;
  priority: number;
  isActive: boolean;
  serviceTypes?: any; // JSON object with preferred service types
  createdAt: string;
  updatedAt: string;
  deliveryPartner: DeliveryPartner;
}

export interface CreateDeliveryPartnerData {
  name: string;
  code: string;
  apiEndpoint?: string;
  apiKey?: string;
  supportedServices?: any;
  serviceAreas?: any;
  priority?: number;
  rateCard?: any;
  contactInfo?: any;
}

export interface UpdateDeliveryPartnerData extends Partial<CreateDeliveryPartnerData> {
  isActive?: boolean;
}

export interface DeliveryPartnerFilters {
  active?: boolean;
  serviceType?: string;
  area?: string;
}

export class DeliveryPartnerService {
  // Get all delivery partners
  static async getDeliveryPartners(filters?: DeliveryPartnerFilters): Promise<DeliveryPartner[]> {
    const response = await apiClient.get<DeliveryPartner[]>('/delivery-partners', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch delivery partners');
    }
    return response.data;
  }

  // Get delivery partner by ID
  static async getDeliveryPartnerById(id: string): Promise<DeliveryPartner> {
    const response = await apiClient.get<DeliveryPartner>(`/delivery-partners/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch delivery partner');
    }
    return response.data;
  }

  // Create new delivery partner
  static async createDeliveryPartner(data: CreateDeliveryPartnerData): Promise<DeliveryPartner> {
    const response = await apiClient.post<DeliveryPartner>('/delivery-partners', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to create delivery partner');
    }
    return response.data;
  }

  // Update delivery partner
  static async updateDeliveryPartner(id: string, data: UpdateDeliveryPartnerData): Promise<DeliveryPartner> {
    const response = await apiClient.put<DeliveryPartner>(`/delivery-partners/${id}`, data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update delivery partner');
    }
    return response.data;
  }

  // Toggle delivery partner active status
  static async toggleDeliveryPartner(id: string, isActive: boolean): Promise<DeliveryPartner> {
    const response = await apiClient.patch<DeliveryPartner>(`/delivery-partners/${id}/toggle`, { isActive });
    if (!response.success) {
      throw new Error(response.error || 'Failed to toggle delivery partner');
    }
    return response.data;
  }

  // Delete delivery partner
  static async deleteDeliveryPartner(id: string): Promise<void> {
    const response = await apiClient.delete(`/delivery-partners/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete delivery partner');
    }
  }

  // Get seller delivery preferences
  static async getSellerDeliveryPreferences(): Promise<SellerDeliveryPreference[]> {
    const response = await apiClient.get<SellerDeliveryPreference[]>('/delivery-partners/preferences');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch delivery preferences');
    }
    return response.data;
  }

  // Set delivery partner preference
  static async setDeliveryPartnerPreference(partnerId: string, data: {
    priority?: number;
    isActive?: boolean;
    serviceTypes?: any;
  }): Promise<SellerDeliveryPreference> {
    const response = await apiClient.post<SellerDeliveryPreference>(`/delivery-partners/${partnerId}/preference`, data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to set delivery preference');
    }
    return response.data;
  }

  // Update delivery partner preference
  static async updateDeliveryPartnerPreference(partnerId: string, data: {
    priority?: number;
    isActive?: boolean;
    serviceTypes?: any;
  }): Promise<SellerDeliveryPreference> {
    const response = await apiClient.put<SellerDeliveryPreference>(`/delivery-partners/${partnerId}/preference`, data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update delivery preference');
    }
    return response.data;
  }

  // Remove delivery partner preference
  static async removeDeliveryPartnerPreference(partnerId: string): Promise<void> {
    const response = await apiClient.delete(`/delivery-partners/${partnerId}/preference`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to remove delivery preference');
    }
  }

  // Get delivery partner statistics
  static async getDeliveryPartnerStats(): Promise<{
    totalPartners: number;
    activePartners: number;
    totalShipments: number;
    shipmentsByPartner: Record<string, number>;
    averageDeliveryTime: number;
    onTimeDeliveryRate: number;
    customerSatisfaction: number;
  }> {
    const response = await apiClient.get<{
      totalPartners: number;
      activePartners: number;
      totalShipments: number;
      shipmentsByPartner: Record<string, number>;
      averageDeliveryTime: number;
      onTimeDeliveryRate: number;
      customerSatisfaction: number;
    }>('/delivery-partners/stats');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch delivery partner stats');
    }
    return response.data;
  }

  // Test delivery partner connection
  static async testDeliveryPartnerConnection(partnerId: string): Promise<{
    success: boolean;
    message: string;
    responseTime?: number;
    error?: string;
  }> {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      responseTime?: number;
      error?: string;
    }>(`/delivery-partners/${partnerId}/test-connection`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to test delivery partner connection');
    }
    return response.data;
  }

  // Get delivery partner rate card
  static async getDeliveryPartnerRateCard(partnerId: string): Promise<{
    partnerId: string;
    partnerName: string;
    rateCard: any;
    lastUpdated: string;
  }> {
    const response = await apiClient.get<{
      partnerId: string;
      partnerName: string;
      rateCard: any;
      lastUpdated: string;
    }>(`/delivery-partners/${partnerId}/rate-card`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch delivery partner rate card');
    }
    return response.data;
  }

  // Calculate delivery cost
  static async calculateDeliveryCost(partnerId: string, data: {
    weight: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
    fromPincode: string;
    toPincode: string;
    serviceType?: string;
  }): Promise<{
    partnerId: string;
    partnerName: string;
    cost: number;
    currency: string;
    estimatedDeliveryDays: number;
    serviceType: string;
  }> {
    const response = await apiClient.post<{
      partnerId: string;
      partnerName: string;
      cost: number;
      currency: string;
      estimatedDeliveryDays: number;
      serviceType: string;
    }>(`/delivery-partners/${partnerId}/calculate-cost`, data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to calculate delivery cost');
    }
    return response.data;
  }
}