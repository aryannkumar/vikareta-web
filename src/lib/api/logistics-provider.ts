import { apiClient } from './client';

export interface LogisticsProvider {
  id: string;
  name: string;
  displayName: string;
  code: string;
  apiEndpoint?: string;
  apiKey?: string;
  apiSecret?: string;
  supportedServices?: any; // JSON object with supported service types
  pricingModel?: any; // JSON object with pricing structure
  coverage?: any; // JSON object with coverage areas
  configuration?: any; // JSON object with provider-specific config
  isActive: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLogisticsProviderData {
  name: string;
  displayName?: string;
  code: string;
  apiEndpoint?: string;
  apiKey?: string;
  apiSecret?: string;
  supportedServices?: any;
  pricingModel?: any;
  coverage?: any;
  configuration?: any;
  isActive?: boolean;
  priority?: number;
}

export interface UpdateLogisticsProviderData extends Partial<CreateLogisticsProviderData> {}

export interface LogisticsProviderFilters {
  isActive?: boolean;
  serviceType?: string;
  coverageArea?: string;
}

export class LogisticsProviderService {
  // Get all logistics providers
  static async getLogisticsProviders(filters?: LogisticsProviderFilters): Promise<LogisticsProvider[]> {
    const response = await apiClient.get<LogisticsProvider[]>('/logistics-providers', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch logistics providers');
    }
    return response.data;
  }

  // Get active logistics providers
  static async getActiveLogisticsProviders(): Promise<LogisticsProvider[]> {
    const response = await apiClient.get<LogisticsProvider[]>('/logistics-providers/active');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch active logistics providers');
    }
    return response.data;
  }

  // Get logistics provider by ID
  static async getLogisticsProviderById(id: string): Promise<LogisticsProvider> {
    const response = await apiClient.get<LogisticsProvider>(`/logistics-providers/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch logistics provider');
    }
    return response.data;
  }

  // Create new logistics provider
  static async createLogisticsProvider(data: CreateLogisticsProviderData): Promise<LogisticsProvider> {
    const response = await apiClient.post<LogisticsProvider>('/logistics-providers', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to create logistics provider');
    }
    return response.data;
  }

  // Update logistics provider
  static async updateLogisticsProvider(id: string, data: UpdateLogisticsProviderData): Promise<LogisticsProvider> {
    const response = await apiClient.put<LogisticsProvider>(`/logistics-providers/${id}`, data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update logistics provider');
    }
    return response.data;
  }

  // Toggle logistics provider active status
  static async toggleLogisticsProviderStatus(id: string, isActive: boolean): Promise<LogisticsProvider> {
    const response = await apiClient.patch<LogisticsProvider>(`/logistics-providers/${id}/status`, { isActive });
    if (!response.success) {
      throw new Error(response.error || 'Failed to toggle logistics provider status');
    }
    return response.data;
  }

  // Delete logistics provider
  static async deleteLogisticsProvider(id: string): Promise<void> {
    const response = await apiClient.delete(`/logistics-providers/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete logistics provider');
    }
  }

  // Test logistics provider connection
  static async testLogisticsProviderConnection(id: string): Promise<{
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
    }>(`/logistics-providers/${id}/test-connection`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to test logistics provider connection');
    }
    return response.data;
  }

  // Get logistics provider services
  static async getLogisticsProviderServices(id: string): Promise<{
    providerId: string;
    providerName: string;
    services: Array<{
      code: string;
      name: string;
      description: string;
      estimatedDeliveryDays: number;
      isActive: boolean;
    }>;
  }> {
    const response = await apiClient.get<{
      providerId: string;
      providerName: string;
      services: Array<{
        code: string;
        name: string;
        description: string;
        estimatedDeliveryDays: number;
        isActive: boolean;
      }>;
    }>(`/logistics-providers/${id}/services`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch logistics provider services');
    }
    return response.data;
  }

  // Calculate shipping cost
  static async calculateShippingCost(providerId: string, data: {
    fromPincode: string;
    toPincode: string;
    weight: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
    serviceType?: string;
    codAmount?: number;
  }): Promise<{
    providerId: string;
    providerName: string;
    serviceType: string;
    cost: number;
    currency: string;
    estimatedDeliveryDays: number;
    trackingAvailable: boolean;
    codAvailable: boolean;
  }> {
    const response = await apiClient.post<{
      providerId: string;
      providerName: string;
      serviceType: string;
      cost: number;
      currency: string;
      estimatedDeliveryDays: number;
      trackingAvailable: boolean;
      codAvailable: boolean;
    }>(`/logistics-providers/${providerId}/calculate-cost`, data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to calculate shipping cost');
    }
    return response.data;
  }

  // Get logistics provider coverage
  static async getLogisticsProviderCoverage(id: string): Promise<{
    providerId: string;
    providerName: string;
    coverage: {
      domestic: boolean;
      international: boolean;
      supportedCountries: string[];
      supportedPincodes?: string[];
      excludedAreas?: string[];
    };
  }> {
    const response = await apiClient.get<{
      providerId: string;
      providerName: string;
      coverage: {
        domestic: boolean;
        international: boolean;
        supportedCountries: string[];
        supportedPincodes?: string[];
        excludedAreas?: string[];
      };
    }>(`/logistics-providers/${id}/coverage`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch logistics provider coverage');
    }
    return response.data;
  }

  // Get logistics provider statistics
  static async getLogisticsProviderStats(): Promise<{
    totalProviders: number;
    activeProviders: number;
    totalShipments: number;
    shipmentsByProvider: Record<string, number>;
    averageDeliveryTime: number;
    onTimeDeliveryRate: number;
    customerSatisfaction: number;
    costPerShipment: number;
  }> {
    const response = await apiClient.get<{
      totalProviders: number;
      activeProviders: number;
      totalShipments: number;
      shipmentsByProvider: Record<string, number>;
      averageDeliveryTime: number;
      onTimeDeliveryRate: number;
      customerSatisfaction: number;
      costPerShipment: number;
    }>('/logistics-providers/stats');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch logistics provider stats');
    }
    return response.data;
  }

  // Bulk update provider priorities
  static async bulkUpdateProviderPriorities(updates: Array<{
    providerId: string;
    priority: number;
  }>): Promise<{
    success: boolean;
    updated: number;
    failed: number;
    errors?: string[];
  }> {
    const response = await apiClient.post<{
      success: boolean;
      updated: number;
      failed: number;
      errors?: string[];
    }>('/logistics-providers/bulk-update-priorities', { updates });
    if (!response.success) {
      throw new Error(response.error || 'Failed to bulk update provider priorities');
    }
    return response.data;
  }

  // Get provider performance metrics
  static async getProviderPerformanceMetrics(providerId: string, dateRange?: {
    startDate: string;
    endDate: string;
  }): Promise<{
    providerId: string;
    providerName: string;
    metrics: {
      totalShipments: number;
      deliveredShipments: number;
      deliveryRate: number;
      averageDeliveryTime: number;
      customerComplaints: number;
      rating: number;
      costEfficiency: number;
    };
    trends: Array<{
      date: string;
      shipments: number;
      deliveryRate: number;
      averageDeliveryTime: number;
    }>;
  }> {
    const response = await apiClient.get<{
      providerId: string;
      providerName: string;
      metrics: {
        totalShipments: number;
        deliveredShipments: number;
        deliveryRate: number;
        averageDeliveryTime: number;
        customerComplaints: number;
        rating: number;
        costEfficiency: number;
      };
      trends: Array<{
        date: string;
        shipments: number;
        deliveryRate: number;
        averageDeliveryTime: number;
      }>;
    }>(`/logistics-providers/${providerId}/performance`, dateRange);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch provider performance metrics');
    }
    return response.data;
  }
}