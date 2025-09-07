import { apiClient } from './client';

export interface Webhook {
  id: string;
  userId: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  isActive: boolean;
  successCount: number;
  failureCount: number;
  lastTriggered?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookAttempt {
  id: string;
  webhookId: string;
  event: string;
  status: 'success' | 'failure';
  statusCode?: number;
  durationMs: number;
  error?: string;
  createdAt: string;
}

export interface CreateWebhookData {
  name: string;
  url: string;
  events: string[];
}

export interface UpdateWebhookData {
  name?: string;
  url?: string;
  events?: string[];
  isActive?: boolean;
}

export interface TestWebhookData {
  event?: string;
  extra?: Record<string, any>;
}

export interface WebhookFilters {
  isActive?: boolean;
  event?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export class WebhookService {
  // Get all webhooks for current user
  static async getWebhooks(filters?: WebhookFilters): Promise<Webhook[]> {
    const response = await apiClient.get<Webhook[]>('/webhooks', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch webhooks');
    }
    return response.data;
  }

  // Get webhook by ID
  static async getWebhookById(id: string): Promise<Webhook> {
    const response = await apiClient.get<Webhook>(`/webhooks/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch webhook');
    }
    return response.data;
  }

  // Create new webhook
  static async createWebhook(data: CreateWebhookData): Promise<Webhook> {
    const response = await apiClient.post<Webhook>('/webhooks', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to create webhook');
    }
    return response.data;
  }

  // Update webhook
  static async updateWebhook(id: string, data: UpdateWebhookData): Promise<Webhook> {
    const response = await apiClient.put<Webhook>(`/webhooks/${id}`, data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update webhook');
    }
    return response.data;
  }

  // Delete webhook
  static async deleteWebhook(id: string): Promise<void> {
    const response = await apiClient.delete(`/webhooks/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete webhook');
    }
  }

  // Regenerate webhook secret
  static async regenerateWebhookSecret(id: string): Promise<Webhook> {
    const response = await apiClient.post<Webhook>(`/webhooks/${id}/regenerate-secret`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to regenerate webhook secret');
    }
    return response.data;
  }

  // Test webhook
  static async testWebhook(id: string, data?: TestWebhookData): Promise<{
    success: boolean;
    statusCode: number;
    response: any;
    duration: number;
    error?: string;
  }> {
    const response = await apiClient.post<{
      success: boolean;
      statusCode: number;
      response: any;
      duration: number;
      error?: string;
    }>(`/webhooks/${id}/test`, data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to test webhook');
    }
    return response.data;
  }

  // Retry last webhook attempt
  static async retryLastWebhookAttempt(id: string, event?: string): Promise<{
    success: boolean;
    message: string;
    attemptId?: string;
  }> {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      attemptId?: string;
    }>(`/webhooks/${id}/retry`, { event });
    if (!response.success) {
      throw new Error(response.error || 'Failed to retry webhook attempt');
    }
    return response.data;
  }

  // Get webhook attempts
  static async getWebhookAttempts(id: string, filters?: {
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
  }): Promise<{
    attempts: WebhookAttempt[];
    total: number;
  }> {
    const response = await apiClient.get<{
      attempts: WebhookAttempt[];
      total: number;
    }>(`/webhooks/${id}/attempts`, filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch webhook attempts');
    }
    return response.data;
  }

  // Get available webhook events
  static async getAvailableWebhookEvents(): Promise<Array<{
    event: string;
    description: string;
    category: 'order' | 'payment' | 'user' | 'product' | 'service' | 'rfq' | 'negotiation' | 'system';
    payload: any; // Sample payload structure
  }>> {
    const response = await apiClient.get<Array<{
      event: string;
      description: string;
      category: 'order' | 'payment' | 'user' | 'product' | 'service' | 'rfq' | 'negotiation' | 'system';
      payload: any;
    }>>('/webhooks/events');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch available webhook events');
    }
    return response.data;
  }

  // Get webhook statistics
  static async getWebhookStats(): Promise<{
    totalWebhooks: number;
    activeWebhooks: number;
    totalAttempts: number;
    successfulAttempts: number;
    failedAttempts: number;
    successRate: number;
    averageResponseTime: number;
    webhooksByEvent: Record<string, number>;
    attemptsByStatus: Record<string, number>;
  }> {
    const response = await apiClient.get<{
      totalWebhooks: number;
      activeWebhooks: number;
      totalAttempts: number;
      successfulAttempts: number;
      failedAttempts: number;
      successRate: number;
      averageResponseTime: number;
      webhooksByEvent: Record<string, number>;
      attemptsByStatus: Record<string, number>;
    }>('/webhooks/stats');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch webhook stats');
    }
    return response.data;
  }

  // Bulk update webhook statuses
  static async bulkUpdateWebhookStatuses(updates: Array<{
    id: string;
    isActive: boolean;
  }>): Promise<{
    success: boolean;
    updated: number;
    failed: number;
    results: Array<{
      id: string;
      success: boolean;
      error?: string;
    }>;
  }> {
    const response = await apiClient.post<{
      success: boolean;
      updated: number;
      failed: number;
      results: Array<{
        id: string;
        success: boolean;
        error?: string;
      }>;
    }>('/webhooks/bulk-update-status', { updates });
    if (!response.success) {
      throw new Error(response.error || 'Failed to bulk update webhook statuses');
    }
    return response.data;
  }

  // Validate webhook URL
  static async validateWebhookUrl(url: string): Promise<{
    valid: boolean;
    reachable: boolean;
    responseTime?: number;
    error?: string;
  }> {
    const response = await apiClient.post<{
      valid: boolean;
      reachable: boolean;
      responseTime?: number;
      error?: string;
    }>('/webhooks/validate-url', { url });
    if (!response.success) {
      throw new Error(response.error || 'Failed to validate webhook URL');
    }
    return response.data;
  }

  // Get webhook delivery logs
  static async getWebhookDeliveryLogs(filters?: {
    webhookId?: string;
    status?: string;
    event?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    logs: Array<{
      id: string;
      webhookId: string;
      webhookName: string;
      event: string;
      status: string;
      statusCode?: number;
      duration: number;
      error?: string;
      timestamp: string;
    }>;
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      logs: Array<{
        id: string;
        webhookId: string;
        webhookName: string;
        event: string;
        status: string;
        statusCode?: number;
        duration: number;
        error?: string;
        timestamp: string;
      }>;
      total: number;
      page: number;
      totalPages: number;
    }>('/webhooks/delivery-logs', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch webhook delivery logs');
    }
    return response.data;
  }

  // Export webhook data
  static async exportWebhookData(format: 'csv' | 'json' = 'json', filters?: WebhookFilters): Promise<{
    downloadUrl: string;
    filename: string;
    expiresAt: string;
  }> {
    const response = await apiClient.get<{
      downloadUrl: string;
      filename: string;
      expiresAt: string;
    }>('/webhooks/export', { format, ...filters });
    if (!response.success) {
      throw new Error(response.error || 'Failed to export webhook data');
    }
    return response.data;
  }
}