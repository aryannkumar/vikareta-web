import { apiClient } from './client';

export interface Integration {
  id: string;
  userId: string;
  provider: string;
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  isEnabled: boolean;
  config: any; // JSON object with provider-specific configuration
  credentials: any; // JSON object with encrypted credentials
  connectedAt?: string;
  lastSync?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConnectIntegrationData {
  provider: string;
  config?: any;
  credentials?: any;
}

export interface UpdateIntegrationData {
  config?: any;
  credentials?: any;
  isEnabled?: boolean;
  status?: 'connected' | 'disconnected' | 'error' | 'pending';
}

export interface IntegrationProvider {
  id: string;
  name: string;
  description: string;
  category: 'payment' | 'shipping' | 'communication' | 'analytics' | 'storage' | 'other';
  logo?: string;
  website?: string;
  features: string[];
  requiredScopes: string[];
  authType: 'oauth' | 'api_key' | 'basic_auth' | 'webhook';
  isPopular: boolean;
  setupGuide?: string;
}

export class IntegrationService {
  // Get all integrations for current user
  static async getIntegrations(): Promise<Integration[]> {
    const response = await apiClient.get<Integration[]>('/integrations');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch integrations');
    }
    return response.data;
  }

  // Get integration by provider
  static async getIntegrationByProvider(provider: string): Promise<Integration> {
    const response = await apiClient.get<Integration>(`/integrations/${provider}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch integration');
    }
    return response.data;
  }

  // Connect new integration
  static async connectIntegration(data: ConnectIntegrationData): Promise<Integration> {
    const response = await apiClient.post<Integration>('/integrations/connect', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to connect integration');
    }
    return response.data;
  }

  // Update integration
  static async updateIntegration(provider: string, data: UpdateIntegrationData): Promise<Integration> {
    const response = await apiClient.put<Integration>(`/integrations/${provider}`, data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update integration');
    }
    return response.data;
  }

  // Disconnect integration
  static async disconnectIntegration(provider: string): Promise<Integration> {
    const response = await apiClient.post<Integration>(`/integrations/${provider}/disconnect`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to disconnect integration');
    }
    return response.data;
  }

  // Test integration connection
  static async testIntegrationConnection(provider: string): Promise<{
    success: boolean;
    message: string;
    lastTested: string;
    error?: string;
  }> {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      lastTested: string;
      error?: string;
    }>(`/integrations/${provider}/test`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to test integration connection');
    }
    return response.data;
  }

  // Sync integration data
  static async syncIntegrationData(provider: string): Promise<{
    success: boolean;
    message: string;
    syncedRecords: number;
    lastSync: string;
    errors?: string[];
  }> {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      syncedRecords: number;
      lastSync: string;
      errors?: string[];
    }>(`/integrations/${provider}/sync`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to sync integration data');
    }
    return response.data;
  }

  // Get available integration providers
  static async getAvailableProviders(): Promise<IntegrationProvider[]> {
    const response = await apiClient.get<IntegrationProvider[]>('/integrations/providers');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch available providers');
    }
    return response.data;
  }

  // Get integration provider details
  static async getProviderDetails(providerId: string): Promise<IntegrationProvider> {
    const response = await apiClient.get<IntegrationProvider>(`/integrations/providers/${providerId}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch provider details');
    }
    return response.data;
  }

  // Get OAuth authorization URL
  static async getOAuthAuthorizationUrl(provider: string, redirectUri?: string): Promise<{
    authorizationUrl: string;
    state: string;
    expiresAt: string;
  }> {
    const response = await apiClient.get<{
      authorizationUrl: string;
      state: string;
      expiresAt: string;
    }>(`/integrations/${provider}/oauth/authorize`, { redirectUri });
    if (!response.success) {
      throw new Error(response.error || 'Failed to get OAuth authorization URL');
    }
    return response.data;
  }

  // Handle OAuth callback
  static async handleOAuthCallback(provider: string, code: string, state: string): Promise<Integration> {
    const response = await apiClient.post<Integration>(`/integrations/${provider}/oauth/callback`, { code, state });
    if (!response.success) {
      throw new Error(response.error || 'Failed to handle OAuth callback');
    }
    return response.data;
  }

  // Get integration logs
  static async getIntegrationLogs(provider: string, filters?: {
    limit?: number;
    offset?: number;
    type?: 'sync' | 'error' | 'auth' | 'webhook';
    dateFrom?: string;
    dateTo?: string;
  }): Promise<{
    logs: Array<{
      id: string;
      type: string;
      message: string;
      data?: any;
      createdAt: string;
    }>;
    total: number;
  }> {
    const response = await apiClient.get<{
      logs: Array<{
        id: string;
        type: string;
        message: string;
        data?: any;
        createdAt: string;
      }>;
      total: number;
    }>(`/integrations/${provider}/logs`, filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch integration logs');
    }
    return response.data;
  }

  // Get integration statistics
  static async getIntegrationStats(): Promise<{
    totalIntegrations: number;
    activeIntegrations: number;
    integrationsByProvider: Record<string, number>;
    integrationsByStatus: Record<string, number>;
    totalSyncs: number;
    failedSyncs: number;
    successRate: number;
  }> {
    const response = await apiClient.get<{
      totalIntegrations: number;
      activeIntegrations: number;
      integrationsByProvider: Record<string, number>;
      integrationsByStatus: Record<string, number>;
      totalSyncs: number;
      failedSyncs: number;
      successRate: number;
    }>('/integrations/stats');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch integration stats');
    }
    return response.data;
  }

  // Bulk sync all integrations
  static async bulkSyncIntegrations(): Promise<{
    total: number;
    successful: number;
    failed: number;
    results: Array<{
      provider: string;
      success: boolean;
      message: string;
      syncedRecords?: number;
      error?: string;
    }>;
  }> {
    const response = await apiClient.post<{
      total: number;
      successful: number;
      failed: number;
      results: Array<{
        provider: string;
        success: boolean;
        message: string;
        syncedRecords?: number;
        error?: string;
      }>;
    }>('/integrations/bulk-sync');
    if (!response.success) {
      throw new Error(response.error || 'Failed to bulk sync integrations');
    }
    return response.data;
  }
}