import { apiClient } from './client';

export interface NotificationSettings {
  id: string;
  userId: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  whatsappEnabled: boolean;
  inAppEnabled: boolean;
  marketingEmails: boolean;
  transactionalEmails: boolean;
  systemNotifications: boolean;
  securityAlerts: boolean;
  orderUpdates: boolean;
  paymentReminders: boolean;
  promotionalOffers: boolean;
  newsletterSubscription: boolean;
  frequency: 'immediate' | 'daily' | 'weekly' | 'monthly';
  quietHoursStart?: string; // HH:mm format
  quietHoursEnd?: string; // HH:mm format
  timezone: string;
  language: string;
  emailDigest: boolean;
  smsDigest: boolean;
  pushDigest: boolean;
  whatsappDigest: boolean;
  unsubscribeAll: boolean;
  customFilters: {
    minOrderAmount?: number;
    categories?: string[];
    locations?: string[];
    userTypes?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateNotificationSettingsData {
  emailEnabled?: boolean;
  smsEnabled?: boolean;
  pushEnabled?: boolean;
  whatsappEnabled?: boolean;
  inAppEnabled?: boolean;
  marketingEmails?: boolean;
  transactionalEmails?: boolean;
  systemNotifications?: boolean;
  securityAlerts?: boolean;
  orderUpdates?: boolean;
  paymentReminders?: boolean;
  promotionalOffers?: boolean;
  newsletterSubscription?: boolean;
  frequency?: NotificationSettings['frequency'];
  quietHoursStart?: string;
  quietHoursEnd?: string;
  timezone?: string;
  language?: string;
  emailDigest?: boolean;
  smsDigest?: boolean;
  pushDigest?: boolean;
  whatsappDigest?: boolean;
  unsubscribeAll?: boolean;
  customFilters?: NotificationSettings['customFilters'];
}

export class NotificationSettingsService {
  // Get current user's notification settings
  static async getSettings(): Promise<NotificationSettings> {
    const response = await apiClient.get<NotificationSettings>('/notification-settings');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch notification settings');
    }
    return response.data;
  }

  // Update notification settings
  static async updateSettings(data: UpdateNotificationSettingsData): Promise<NotificationSettings> {
    const response = await apiClient.put<NotificationSettings>('/notification-settings', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update notification settings');
    }
    return response.data;
  }

  // Reset settings to defaults
  static async resetToDefaults(): Promise<NotificationSettings> {
    const response = await apiClient.post<NotificationSettings>('/notification-settings/reset');
    if (!response.success) {
      throw new Error(response.error || 'Failed to reset notification settings');
    }
    return response.data;
  }

  // Get available languages
  static async getAvailableLanguages(): Promise<Array<{
    code: string;
    name: string;
    nativeName: string;
    isActive: boolean;
  }>> {
    const response = await apiClient.get<Array<{
      code: string;
      name: string;
      nativeName: string;
      isActive: boolean;
    }>>('/notification-settings/languages');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch available languages');
    }
    return response.data;
  }

  // Get available timezones
  static async getAvailableTimezones(): Promise<Array<{
    value: string;
    label: string;
    offset: string;
    isActive: boolean;
  }>> {
    const response = await apiClient.get<Array<{
      value: string;
      label: string;
      offset: string;
      isActive: boolean;
    }>>('/notification-settings/timezones');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch available timezones');
    }
    return response.data;
  }

  // Test notification settings
  static async testSettings(channels?: ('email' | 'sms' | 'push' | 'whatsapp')[]): Promise<{
    results: Array<{
      channel: string;
      success: boolean;
      message: string;
      testId?: string;
    }>;
    overallSuccess: boolean;
  }> {
    const response = await apiClient.post<{
      results: Array<{
        channel: string;
        success: boolean;
        message: string;
        testId?: string;
      }>;
      overallSuccess: boolean;
    }>('/notification-settings/test', { channels });
    if (!response.success) {
      throw new Error(response.error || 'Failed to test notification settings');
    }
    return response.data;
  }

  // Get notification settings statistics
  static async getSettingsStats(): Promise<{
    totalUsers: number;
    usersWithEmailEnabled: number;
    usersWithSmsEnabled: number;
    usersWithPushEnabled: number;
    usersWithWhatsappEnabled: number;
    usersWithMarketingEmails: number;
    usersWithTransactionalEmails: number;
    usersWithSystemNotifications: number;
    usersWithSecurityAlerts: number;
    usersWithUnsubscribeAll: number;
    frequencyDistribution: Record<string, number>;
    languageDistribution: Record<string, number>;
    timezoneDistribution: Record<string, number>;
    mostPopularSettings: Array<{
      setting: string;
      enabledCount: number;
      percentage: number;
    }>;
  }> {
    const response = await apiClient.get<{
      totalUsers: number;
      usersWithEmailEnabled: number;
      usersWithSmsEnabled: number;
      usersWithPushEnabled: number;
      usersWithWhatsappEnabled: number;
      usersWithMarketingEmails: number;
      usersWithTransactionalEmails: number;
      usersWithSystemNotifications: number;
      usersWithSecurityAlerts: number;
      usersWithUnsubscribeAll: number;
      frequencyDistribution: Record<string, number>;
      languageDistribution: Record<string, number>;
      timezoneDistribution: Record<string, number>;
      mostPopularSettings: Array<{
        setting: string;
        enabledCount: number;
        percentage: number;
      }>;
    }>('/notification-settings/stats');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch notification settings stats');
    }
    return response.data;
  }

  // Bulk update settings for multiple users (admin only)
  static async bulkUpdateSettings(userIds: string[], data: UpdateNotificationSettingsData): Promise<{
    updated: number;
    failed: number;
    results: Array<{
      userId: string;
      success: boolean;
      error?: string;
    }>;
  }> {
    const response = await apiClient.post<{
      updated: number;
      failed: number;
      results: Array<{
        userId: string;
        success: boolean;
        error?: string;
      }>;
    }>('/notification-settings/bulk-update', { userIds, data });
    if (!response.success) {
      throw new Error(response.error || 'Failed to bulk update notification settings');
    }
    return response.data;
  }

  // Export notification settings
  static async exportSettings(format: 'json' | 'csv' = 'json', filters?: {
    userIds?: string[];
    enabledChannels?: string[];
    frequency?: string;
  }): Promise<{
    downloadUrl: string;
    filename: string;
    expiresAt: string;
  }> {
    const response = await apiClient.get<{
      downloadUrl: string;
      filename: string;
      expiresAt: string;
    }>('/notification-settings/export', { format, ...filters });
    if (!response.success) {
      throw new Error(response.error || 'Failed to export notification settings');
    }
    return response.data;
  }

  // Get notification settings templates
  static async getSettingsTemplates(): Promise<Array<{
    id: string;
    name: string;
    description: string;
    settings: Partial<NotificationSettings>;
    isDefault: boolean;
    isActive: boolean;
    usageCount: number;
  }>> {
    const response = await apiClient.get<Array<{
      id: string;
      name: string;
      description: string;
      settings: Partial<NotificationSettings>;
      isDefault: boolean;
      isActive: boolean;
      usageCount: number;
    }>>('/notification-settings/templates');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch notification settings templates');
    }
    return response.data;
  }

  // Apply settings template
  static async applySettingsTemplate(templateId: string): Promise<NotificationSettings> {
    const response = await apiClient.post<NotificationSettings>(`/notification-settings/templates/${templateId}/apply`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to apply notification settings template');
    }
    return response.data;
  }

  // Validate settings configuration
  static async validateSettings(data: UpdateNotificationSettingsData): Promise<{
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
    }>('/notification-settings/validate', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to validate notification settings');
    }
    return response.data;
  }

  // Get user's notification history
  static async getNotificationHistory(filters?: {
    dateFrom?: string;
    dateTo?: string;
    channel?: string;
    type?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    notifications: Array<{
      id: string;
      type: string;
      channel: string;
      title: string;
      message: string;
      sentAt: string;
      deliveredAt?: string;
      readAt?: string;
      status: 'sent' | 'delivered' | 'read' | 'failed';
      metadata?: Record<string, any>;
    }>;
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      notifications: Array<{
        id: string;
        type: string;
        channel: string;
        title: string;
        message: string;
        sentAt: string;
        deliveredAt?: string;
        readAt?: string;
        status: 'sent' | 'delivered' | 'read' | 'failed';
        metadata?: Record<string, any>;
      }>;
      total: number;
      page: number;
      totalPages: number;
    }>('/notification-settings/history', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch notification history');
    }
    return response.data;
  }

  // Mark notification as read
  static async markNotificationAsRead(notificationId: string): Promise<void> {
    const response = await apiClient.post(`/notification-settings/notifications/${notificationId}/read`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to mark notification as read');
    }
  }

  // Mark all notifications as read
  static async markAllNotificationsAsRead(): Promise<{
    marked: number;
    total: number;
  }> {
    const response = await apiClient.post<{
      marked: number;
      total: number;
    }>('/notification-settings/notifications/mark-all-read');
    if (!response.success) {
      throw new Error(response.error || 'Failed to mark all notifications as read');
    }
    return response.data;
  }

  // Delete notification
  static async deleteNotification(notificationId: string): Promise<void> {
    const response = await apiClient.delete(`/notification-settings/notifications/${notificationId}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete notification');
    }
  }

  // Get notification preferences summary
  static async getPreferencesSummary(): Promise<{
    enabledChannels: string[];
    disabledChannels: string[];
    activeNotificationTypes: string[];
    inactiveNotificationTypes: string[];
    currentFrequency: string;
    hasQuietHours: boolean;
    hasCustomFilters: boolean;
    language: string;
    timezone: string;
    totalNotificationsReceived: number;
    totalNotificationsRead: number;
    readRate: number;
  }> {
    const response = await apiClient.get<{
      enabledChannels: string[];
      disabledChannels: string[];
      activeNotificationTypes: string[];
      inactiveNotificationTypes: string[];
      currentFrequency: string;
      hasQuietHours: boolean;
      hasCustomFilters: boolean;
      language: string;
      timezone: string;
      totalNotificationsReceived: number;
      totalNotificationsRead: number;
      readRate: number;
    }>('/notification-settings/preferences-summary');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch notification preferences summary');
    }
    return response.data;
  }
}