import { apiClient } from './client';

export interface NotificationBatch {
  id: string;
  name: string;
  description?: string;
  type: 'marketing' | 'transactional' | 'system' | 'promotional';
  channel: 'email' | 'sms' | 'push' | 'whatsapp';
  templateId?: string;
  variables: Record<string, any>;
  userIds: string[];
  segment?: {
    userType?: string[];
    location?: string[];
    tags?: string[];
    lastActiveDays?: number;
  };
  title?: string;
  message: string;
  scheduleAt?: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed';
  totalRecipients: number;
  sentCount: number;
  failedCount: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface CreateNotificationBatchData {
  name: string;
  description?: string;
  type: NotificationBatch['type'];
  channel: NotificationBatch['channel'];
  templateId?: string;
  variables?: Record<string, any>;
  userIds?: string[];
  segment?: NotificationBatch['segment'];
  title?: string;
  message: string;
  scheduleAt?: string;
}

export interface NotificationBatchFilters {
  type?: string;
  channel?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface BatchProgress {
  batchId: string;
  status: string;
  totalRecipients: number;
  sentCount: number;
  failedCount: number;
  pendingCount: number;
  progressPercentage: number;
  estimatedTimeRemaining?: number;
  currentRate?: number; // messages per minute
  lastUpdated: string;
}

export interface BatchRecipient {
  id: string;
  batchId: string;
  userId: string;
  userEmail?: string;
  userPhone?: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced';
  sentAt?: string;
  deliveredAt?: string;
  failedAt?: string;
  errorMessage?: string;
  retryCount: number;
  metadata?: Record<string, any>;
}

export class NotificationBatchService {
  // Create a new notification batch
  static async createBatch(data: CreateNotificationBatchData): Promise<NotificationBatch> {
    const response = await apiClient.post<NotificationBatch>('/notification-batches', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to create notification batch');
    }
    return response.data;
  }

  // Get all notification batches with filtering
  static async getBatches(filters?: NotificationBatchFilters): Promise<{
    batches: NotificationBatch[];
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    const response = await apiClient.get<{
      batches: NotificationBatch[];
      total: number;
      page: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    }>('/notification-batches', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch notification batches');
    }
    return response.data;
  }

  // Get notification batch by ID
  static async getBatchById(id: string): Promise<NotificationBatch> {
    const response = await apiClient.get<NotificationBatch>(`/notification-batches/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch notification batch');
    }
    return response.data;
  }

  // Get batch progress
  static async getBatchProgress(id: string): Promise<BatchProgress> {
    const response = await apiClient.get<BatchProgress>(`/notification-batches/${id}/progress`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch batch progress');
    }
    return response.data;
  }

  // Cancel a notification batch
  static async cancelBatch(id: string): Promise<NotificationBatch> {
    const response = await apiClient.post<NotificationBatch>(`/notification-batches/${id}/cancel`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to cancel notification batch');
    }
    return response.data;
  }

  // Retry failed notifications in a batch
  static async retryFailedBatch(id: string): Promise<NotificationBatch> {
    const response = await apiClient.post<NotificationBatch>(`/notification-batches/${id}/retry-failed`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to retry failed notifications');
    }
    return response.data;
  }

  // Process notification queue (admin only)
  static async processQueue(): Promise<{
    processed: number;
    success: number;
    failed: number;
    message: string;
  }> {
    const response = await apiClient.post<{
      processed: number;
      success: number;
      failed: number;
      message: string;
    }>('/notification-batches/process-queue');
    if (!response.success) {
      throw new Error(response.error || 'Failed to process notification queue');
    }
    return response.data;
  }

  // Get batch recipients
  static async getBatchRecipients(id: string, filters?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    recipients: BatchRecipient[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      recipients: BatchRecipient[];
      total: number;
      page: number;
      totalPages: number;
    }>(`/notification-batches/${id}/recipients`, filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch batch recipients');
    }
    return response.data;
  }

  // Get batch statistics
  static async getBatchStats(filters?: {
    dateFrom?: string;
    dateTo?: string;
    type?: string;
    channel?: string;
  }): Promise<{
    totalBatches: number;
    totalRecipients: number;
    totalSent: number;
    totalFailed: number;
    successRate: number;
    averageProcessingTime: number;
    batchesByType: Record<string, number>;
    batchesByChannel: Record<string, number>;
    batchesByStatus: Record<string, number>;
    recentBatches: NotificationBatch[];
  }> {
    const response = await apiClient.get<{
      totalBatches: number;
      totalRecipients: number;
      totalSent: number;
      totalFailed: number;
      successRate: number;
      averageProcessingTime: number;
      batchesByType: Record<string, number>;
      batchesByChannel: Record<string, number>;
      batchesByStatus: Record<string, number>;
      recentBatches: NotificationBatch[];
    }>('/notification-batches/stats', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch batch statistics');
    }
    return response.data;
  }

  // Duplicate a notification batch
  static async duplicateBatch(id: string, modifications?: Partial<CreateNotificationBatchData>): Promise<NotificationBatch> {
    const response = await apiClient.post<NotificationBatch>(`/notification-batches/${id}/duplicate`, modifications);
    if (!response.success) {
      throw new Error(response.error || 'Failed to duplicate notification batch');
    }
    return response.data;
  }

  // Preview batch before sending
  static async previewBatch(data: CreateNotificationBatchData): Promise<{
    estimatedRecipients: number;
    sampleRecipients: Array<{
      id: string;
      email?: string;
      phone?: string;
      name?: string;
    }>;
    previewMessage: string;
    cost?: number;
  }> {
    const response = await apiClient.post<{
      estimatedRecipients: number;
      sampleRecipients: Array<{
        id: string;
        email?: string;
        phone?: string;
        name?: string;
      }>;
      previewMessage: string;
      cost?: number;
    }>('/notification-batches/preview', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to preview notification batch');
    }
    return response.data;
  }

  // Get available notification templates
  static async getNotificationTemplates(): Promise<Array<{
    id: string;
    name: string;
    type: string;
    channel: string;
    subject?: string;
    content: string;
    variables: string[];
    isActive: boolean;
    createdAt: string;
  }>> {
    const response = await apiClient.get<Array<{
      id: string;
      name: string;
      type: string;
      channel: string;
      subject?: string;
      content: string;
      variables: string[];
      isActive: boolean;
      createdAt: string;
    }>>('/notification-batches/templates');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch notification templates');
    }
    return response.data;
  }

  // Get user segments for targeting
  static async getUserSegments(): Promise<Array<{
    id: string;
    name: string;
    description: string;
    criteria: Record<string, any>;
    estimatedCount: number;
    isActive: boolean;
  }>> {
    const response = await apiClient.get<Array<{
      id: string;
      name: string;
      description: string;
      criteria: Record<string, any>;
      estimatedCount: number;
      isActive: boolean;
    }>>('/notification-batches/segments');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch user segments');
    }
    return response.data;
  }

  // Bulk operations
  static async bulkCancelBatches(batchIds: string[]): Promise<{
    cancelled: number;
    failed: number;
    results: Array<{
      batchId: string;
      success: boolean;
      error?: string;
    }>;
  }> {
    const response = await apiClient.post<{
      cancelled: number;
      failed: number;
      results: Array<{
        batchId: string;
        success: boolean;
        error?: string;
      }>;
    }>('/notification-batches/bulk-cancel', { batchIds });
    if (!response.success) {
      throw new Error(response.error || 'Failed to bulk cancel batches');
    }
    return response.data;
  }

  static async bulkDeleteBatches(batchIds: string[]): Promise<{
    deleted: number;
    failed: number;
    results: Array<{
      batchId: string;
      success: boolean;
      error?: string;
    }>;
  }> {
    const response = await apiClient.post<{
      deleted: number;
      failed: number;
      results: Array<{
        batchId: string;
        success: boolean;
        error?: string;
      }>;
    }>('/notification-batches/bulk-delete', { batchIds });
    if (!response.success) {
      throw new Error(response.error || 'Failed to bulk delete batches');
    }
    return response.data;
  }

  // Export batch data
  static async exportBatchData(id: string, format: 'csv' | 'json' | 'xlsx' = 'csv'): Promise<{
    downloadUrl: string;
    filename: string;
    expiresAt: string;
  }> {
    const response = await apiClient.get<{
      downloadUrl: string;
      filename: string;
      expiresAt: string;
    }>(`/notification-batches/${id}/export`, { format });
    if (!response.success) {
      throw new Error(response.error || 'Failed to export batch data');
    }
    return response.data;
  }

  // Get batch delivery reports
  static async getBatchDeliveryReport(id: string, filters?: {
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<{
    batchId: string;
    totalRecipients: number;
    delivered: number;
    bounced: number;
    complained: number;
    opened: number;
    clicked: number;
    deliveryRate: number;
    openRate: number;
    clickRate: number;
    bounceRate: number;
    unsubscribeRate: number;
    deliveryTimeline: Array<{
      timestamp: string;
      delivered: number;
      bounced: number;
    }>;
  }> {
    const response = await apiClient.get<{
      batchId: string;
      totalRecipients: number;
      delivered: number;
      bounced: number;
      complained: number;
      opened: number;
      clicked: number;
      deliveryRate: number;
      openRate: number;
      clickRate: number;
      bounceRate: number;
      unsubscribeRate: number;
      deliveryTimeline: Array<{
        timestamp: string;
        delivered: number;
        bounced: number;
      }>;
    }>(`/notification-batches/${id}/delivery-report`, filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch delivery report');
    }
    return response.data;
  }
}