import { apiClient } from './client';

export interface NotificationPreference {
  id: string;
  userId: string;
  channel: 'email' | 'sms' | 'push' | 'whatsapp' | 'in_app';
  type: 'marketing' | 'transactional' | 'system' | 'security' | 'social' | 'promotional';
  enabled: boolean;
  frequency?: 'immediate' | 'daily' | 'weekly' | 'monthly' | 'never';
  quietHours?: {
    enabled: boolean;
    startTime: string; // HH:mm format
    endTime: string; // HH:mm format
    timezone: string;
  };
  filters?: {
    minAmount?: number;
    categories?: string[];
    locations?: string[];
    userTypes?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationPreferenceData {
  channel: NotificationPreference['channel'];
  type: NotificationPreference['type'];
  enabled: boolean;
  frequency?: NotificationPreference['frequency'];
  quietHours?: NotificationPreference['quietHours'];
  filters?: NotificationPreference['filters'];
}

export interface UpdateNotificationPreferenceData {
  enabled?: boolean;
  frequency?: NotificationPreference['frequency'];
  quietHours?: NotificationPreference['quietHours'];
  filters?: NotificationPreference['filters'];
}

export interface NotificationPreferenceFilters {
  channel?: string;
  type?: string;
  enabled?: boolean;
  page?: number;
  limit?: number;
}

export class NotificationPreferenceService {
  // Get all notification preferences for current user
  static async getPreferences(filters?: NotificationPreferenceFilters): Promise<{
    preferences: NotificationPreference[];
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    const response = await apiClient.get<{
      preferences: NotificationPreference[];
      total: number;
      page: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    }>('/notification-preferences', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch notification preferences');
    }
    return response.data;
  }

  // Get notification preference by ID
  static async getPreferenceById(id: string): Promise<NotificationPreference> {
    const response = await apiClient.get<NotificationPreference>(`/notification-preferences/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch notification preference');
    }
    return response.data;
  }

  // Create new notification preference
  static async createPreference(data: CreateNotificationPreferenceData): Promise<NotificationPreference> {
    const response = await apiClient.post<NotificationPreference>('/notification-preferences', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to create notification preference');
    }
    return response.data;
  }

  // Update notification preference
  static async updatePreference(id: string, data: UpdateNotificationPreferenceData): Promise<NotificationPreference> {
    const response = await apiClient.put<NotificationPreference>(`/notification-preferences/${id}`, data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update notification preference');
    }
    return response.data;
  }

  // Delete notification preference
  static async deletePreference(id: string): Promise<void> {
    const response = await apiClient.delete(`/notification-preferences/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete notification preference');
    }
  }

  // Bulk update notification preferences
  static async bulkUpdatePreferences(updates: Array<{
    id: string;
    data: UpdateNotificationPreferenceData;
  }>): Promise<{
    updated: number;
    failed: number;
    results: Array<{
      id: string;
      success: boolean;
      error?: string;
      preference?: NotificationPreference;
    }>;
  }> {
    const response = await apiClient.post<{
      updated: number;
      failed: number;
      results: Array<{
        id: string;
        success: boolean;
        error?: string;
        preference?: NotificationPreference;
      }>;
    }>('/notification-preferences/bulk-update', { updates });
    if (!response.success) {
      throw new Error(response.error || 'Failed to bulk update notification preferences');
    }
    return response.data;
  }

  // Enable/disable notification preference
  static async togglePreference(id: string, enabled: boolean): Promise<NotificationPreference> {
    const response = await apiClient.patch<NotificationPreference>(`/notification-preferences/${id}/toggle`, { enabled });
    if (!response.success) {
      throw new Error(response.error || 'Failed to toggle notification preference');
    }
    return response.data;
  }

  // Get notification preference statistics
  static async getPreferenceStats(): Promise<{
    totalPreferences: number;
    enabledPreferences: number;
    disabledPreferences: number;
    preferencesByChannel: Record<string, number>;
    preferencesByType: Record<string, number>;
    preferencesByFrequency: Record<string, number>;
    mostPopularChannels: Array<{
      channel: string;
      count: number;
      percentage: number;
    }>;
    mostPopularTypes: Array<{
      type: string;
      count: number;
      percentage: number;
    }>;
  }> {
    const response = await apiClient.get<{
      totalPreferences: number;
      enabledPreferences: number;
      disabledPreferences: number;
      preferencesByChannel: Record<string, number>;
      preferencesByType: Record<string, number>;
      preferencesByFrequency: Record<string, number>;
      mostPopularChannels: Array<{
        channel: string;
        count: number;
        percentage: number;
      }>;
      mostPopularTypes: Array<{
        type: string;
        count: number;
        percentage: number;
      }>;
    }>('/notification-preferences/stats');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch notification preference stats');
    }
    return response.data;
  }

  // Get available notification channels
  static async getAvailableChannels(): Promise<Array<{
    channel: string;
    name: string;
    description: string;
    supportedTypes: string[];
    requiresVerification: boolean;
    isActive: boolean;
  }>> {
    const response = await apiClient.get<Array<{
      channel: string;
      name: string;
      description: string;
      supportedTypes: string[];
      requiresVerification: boolean;
      isActive: boolean;
    }>>('/notification-preferences/channels');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch available channels');
    }
    return response.data;
  }

  // Get available notification types
  static async getAvailableTypes(): Promise<Array<{
    type: string;
    name: string;
    description: string;
    supportedChannels: string[];
    isActive: boolean;
  }>> {
    const response = await apiClient.get<Array<{
      type: string;
      name: string;
      description: string;
      supportedChannels: string[];
      isActive: boolean;
    }>>('/notification-preferences/types');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch available types');
    }
    return response.data;
  }

  // Reset preferences to defaults
  static async resetToDefaults(): Promise<{
    reset: number;
    preferences: NotificationPreference[];
  }> {
    const response = await apiClient.post<{
      reset: number;
      preferences: NotificationPreference[];
    }>('/notification-preferences/reset');
    if (!response.success) {
      throw new Error(response.error || 'Failed to reset notification preferences');
    }
    return response.data;
  }

  // Import preferences from another user (admin only)
  static async importPreferences(sourceUserId: string, targetUserIds: string[]): Promise<{
    imported: number;
    failed: number;
    results: Array<{
      userId: string;
      success: boolean;
      error?: string;
    }>;
  }> {
    const response = await apiClient.post<{
      imported: number;
      failed: number;
      results: Array<{
        userId: string;
        success: boolean;
        error?: string;
      }>;
    }>('/notification-preferences/import', { sourceUserId, targetUserIds });
    if (!response.success) {
      throw new Error(response.error || 'Failed to import notification preferences');
    }
    return response.data;
  }

  // Export user preferences
  static async exportPreferences(format: 'json' | 'csv' = 'json'): Promise<{
    downloadUrl: string;
    filename: string;
    expiresAt: string;
  }> {
    const response = await apiClient.get<{
      downloadUrl: string;
      filename: string;
      expiresAt: string;
    }>('/notification-preferences/export', { format });
    if (!response.success) {
      throw new Error(response.error || 'Failed to export notification preferences');
    }
    return response.data;
  }

  // Get preference templates
  static async getPreferenceTemplates(): Promise<Array<{
    id: string;
    name: string;
    description: string;
    preferences: CreateNotificationPreferenceData[];
    isDefault: boolean;
    isActive: boolean;
  }>> {
    const response = await apiClient.get<Array<{
      id: string;
      name: string;
      description: string;
      preferences: CreateNotificationPreferenceData[];
      isDefault: boolean;
      isActive: boolean;
    }>>('/notification-preferences/templates');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch preference templates');
    }
    return response.data;
  }

  // Apply preference template
  static async applyPreferenceTemplate(templateId: string): Promise<{
    applied: number;
    preferences: NotificationPreference[];
  }> {
    const response = await apiClient.post<{
      applied: number;
      preferences: NotificationPreference[];
    }>(`/notification-preferences/templates/${templateId}/apply`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to apply preference template');
    }
    return response.data;
  }

  // Get user notification activity
  static async getNotificationActivity(filters?: {
    dateFrom?: string;
    dateTo?: string;
    channel?: string;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    activities: Array<{
      id: string;
      type: string;
      channel: string;
      sentAt: string;
      deliveredAt?: string;
      openedAt?: string;
      clickedAt?: string;
      status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'complained';
      metadata?: Record<string, any>;
    }>;
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      activities: Array<{
        id: string;
        type: string;
        channel: string;
        sentAt: string;
        deliveredAt?: string;
        openedAt?: string;
        clickedAt?: string;
        status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'complained';
        metadata?: Record<string, any>;
      }>;
      total: number;
      page: number;
      totalPages: number;
    }>('/notification-preferences/activity', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch notification activity');
    }
    return response.data;
  }

  // Test notification preference
  static async testPreference(id: string): Promise<{
    success: boolean;
    message: string;
    testId?: string;
  }> {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      testId?: string;
    }>(`/notification-preferences/${id}/test`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to test notification preference');
    }
    return response.data;
  }

  // Validate preference configuration
  static async validatePreference(data: CreateNotificationPreferenceData): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
    suggestions: string[];
  }> {
    const response = await apiClient.post<{
      valid: boolean;
      errors: string[];
      warnings: string[];
      suggestions: string[];
    }>('/notification-preferences/validate', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to validate notification preference');
    }
    return response.data;
  }
}