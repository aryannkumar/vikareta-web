import { apiClient } from './client';

export interface ApiKey {
  id: string;
  userId: string;
  name: string;
  key: string;
  permissions: string[];
  isActive: boolean;
  lastUsed?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApiKeyData {
  name: string;
  permissions?: string[];
  expiresAt?: string;
}

export interface UpdateApiKeyData {
  name?: string;
  permissions?: string[];
  expiresAt?: string;
}

export class ApiKeyService {
  // Get all API keys for current user
  static async getApiKeys(): Promise<ApiKey[]> {
    const response = await apiClient.get<ApiKey[]>('/api-keys');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch API keys');
    }
    return response.data;
  }

  // Get API key by ID
  static async getApiKeyById(id: string): Promise<ApiKey> {
    const response = await apiClient.get<ApiKey>(`/api-keys/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch API key');
    }
    return response.data;
  }

  // Create new API key
  static async createApiKey(data: CreateApiKeyData): Promise<ApiKey> {
    const response = await apiClient.post<ApiKey>('/api-keys', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to create API key');
    }
    return response.data;
  }

  // Update API key
  static async updateApiKey(id: string, data: UpdateApiKeyData): Promise<ApiKey> {
    const response = await apiClient.put<ApiKey>(`/api-keys/${id}`, data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update API key');
    }
    return response.data;
  }

  // Revoke API key
  static async revokeApiKey(id: string): Promise<ApiKey> {
    const response = await apiClient.post<ApiKey>(`/api-keys/${id}/revoke`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to revoke API key');
    }
    return response.data;
  }

  // Rotate API key (generate new key)
  static async rotateApiKey(id: string): Promise<ApiKey> {
    const response = await apiClient.post<ApiKey>(`/api-keys/${id}/rotate`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to rotate API key');
    }
    return response.data;
  }

  // Delete API key
  static async deleteApiKey(id: string): Promise<void> {
    const response = await apiClient.delete(`/api-keys/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete API key');
    }
  }

  // Get API key usage statistics
  static async getApiKeyStats(): Promise<{
    totalKeys: number;
    activeKeys: number;
    expiredKeys: number;
    totalRequests: number;
    requestsByKey: Record<string, number>;
    recentActivity: Array<{
      keyId: string;
      keyName: string;
      endpoint: string;
      timestamp: string;
      status: number;
    }>;
  }> {
    const response = await apiClient.get<{
      totalKeys: number;
      activeKeys: number;
      expiredKeys: number;
      totalRequests: number;
      requestsByKey: Record<string, number>;
      recentActivity: Array<{
        keyId: string;
        keyName: string;
        endpoint: string;
        timestamp: string;
        status: number;
      }>;
    }>('/api-keys/stats');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch API key stats');
    }
    return response.data;
  }

  // Validate API key permissions
  static async validateApiKeyPermissions(keyId: string, requiredPermissions: string[]): Promise<{
    hasPermission: boolean;
    missingPermissions: string[];
    grantedPermissions: string[];
  }> {
    const response = await apiClient.post<{
      hasPermission: boolean;
      missingPermissions: string[];
      grantedPermissions: string[];
    }>(`/api-keys/${keyId}/validate`, { permissions: requiredPermissions });
    if (!response.success) {
      throw new Error(response.error || 'Failed to validate API key permissions');
    }
    return response.data;
  }

  // Get available permissions
  static async getAvailablePermissions(): Promise<{
    categories: Array<{
      name: string;
      description: string;
      permissions: Array<{
        key: string;
        description: string;
        category: string;
      }>;
    }>;
  }> {
    const response = await apiClient.get<{
      categories: Array<{
        name: string;
        description: string;
        permissions: Array<{
          key: string;
          description: string;
          category: string;
        }>;
      }>;
    }>('/api-keys/permissions');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch available permissions');
    }
    return response.data;
  }
}