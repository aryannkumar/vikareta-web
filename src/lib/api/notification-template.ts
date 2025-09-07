import { apiClient } from './client';

export interface NotificationTemplate {
  id: string;
  name: string;
  description?: string;
  channel: 'email' | 'sms' | 'push' | 'whatsapp' | 'in_app';
  type: 'marketing' | 'transactional' | 'system' | 'security' | 'social' | 'promotional';
  subject?: string;
  content: string;
  htmlContent?: string;
  variables: string[];
  placeholders: Record<string, {
    description: string;
    example: string;
    required: boolean;
    type: 'string' | 'number' | 'date' | 'boolean' | 'array';
  }>;
  isActive: boolean;
  isDefault: boolean;
  usageCount: number;
  lastUsedAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationTemplateData {
  name: string;
  description?: string;
  channel: NotificationTemplate['channel'];
  type: NotificationTemplate['type'];
  subject?: string;
  content: string;
  htmlContent?: string;
  variables?: string[];
  placeholders?: NotificationTemplate['placeholders'];
  isActive?: boolean;
  isDefault?: boolean;
}

export interface UpdateNotificationTemplateData {
  name?: string;
  description?: string;
  subject?: string;
  content?: string;
  htmlContent?: string;
  variables?: string[];
  placeholders?: NotificationTemplate['placeholders'];
  isActive?: boolean;
  isDefault?: boolean;
}

export interface NotificationTemplateFilters {
  channel?: string;
  type?: string;
  activeOnly?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export class NotificationTemplateService {
  // Create a new notification template
  static async createTemplate(data: CreateNotificationTemplateData): Promise<NotificationTemplate> {
    const response = await apiClient.post<NotificationTemplate>('/notification-templates', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to create notification template');
    }
    return response.data;
  }

  // Get all notification templates with filtering
  static async getTemplates(filters?: NotificationTemplateFilters): Promise<{
    templates: NotificationTemplate[];
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    const response = await apiClient.get<{
      templates: NotificationTemplate[];
      total: number;
      page: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    }>('/notification-templates', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch notification templates');
    }
    return response.data;
  }

  // Get notification template by ID
  static async getTemplateById(id: string): Promise<NotificationTemplate> {
    const response = await apiClient.get<NotificationTemplate>(`/notification-templates/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch notification template');
    }
    return response.data;
  }

  // Update notification template
  static async updateTemplate(id: string, data: UpdateNotificationTemplateData): Promise<NotificationTemplate> {
    const response = await apiClient.put<NotificationTemplate>(`/notification-templates/${id}`, data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update notification template');
    }
    return response.data;
  }

  // Delete notification template
  static async deleteTemplate(id: string): Promise<void> {
    const response = await apiClient.delete(`/notification-templates/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete notification template');
    }
  }

  // Toggle template active status
  static async toggleTemplateStatus(id: string, isActive: boolean): Promise<NotificationTemplate> {
    const response = await apiClient.patch<NotificationTemplate>(`/notification-templates/${id}/toggle`, { isActive });
    if (!response.success) {
      throw new Error(response.error || 'Failed to toggle template status');
    }
    return response.data;
  }

  // Duplicate a notification template
  static async duplicateTemplate(id: string, modifications?: Partial<CreateNotificationTemplateData>): Promise<NotificationTemplate> {
    const response = await apiClient.post<NotificationTemplate>(`/notification-templates/${id}/duplicate`, modifications);
    if (!response.success) {
      throw new Error(response.error || 'Failed to duplicate notification template');
    }
    return response.data;
  }

  // Preview template with variables
  static async previewTemplate(id: string, variables?: Record<string, any>): Promise<{
    subject?: string;
    content: string;
    htmlContent?: string;
    renderedContent: string;
    renderedHtmlContent?: string;
  }> {
    const response = await apiClient.post<{
      subject?: string;
      content: string;
      htmlContent?: string;
      renderedContent: string;
      renderedHtmlContent?: string;
    }>(`/notification-templates/${id}/preview`, { variables });
    if (!response.success) {
      throw new Error(response.error || 'Failed to preview notification template');
    }
    return response.data;
  }

  // Test template by sending a test notification
  static async testTemplate(id: string, recipient: string, variables?: Record<string, any>): Promise<{
    success: boolean;
    message: string;
    testId?: string;
  }> {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      testId?: string;
    }>(`/notification-templates/${id}/test`, { recipient, variables });
    if (!response.success) {
      throw new Error(response.error || 'Failed to test notification template');
    }
    return response.data;
  }

  // Get template usage statistics
  static async getTemplateStats(id?: string): Promise<{
    totalTemplates: number;
    activeTemplates: number;
    templatesByChannel: Record<string, number>;
    templatesByType: Record<string, number>;
    mostUsedTemplates: Array<{
      templateId: string;
      templateName: string;
      usageCount: number;
      lastUsedAt?: string;
    }>;
    templateUsage?: {
      templateId: string;
      totalSent: number;
      totalDelivered: number;
      totalOpened: number;
      totalClicked: number;
      deliveryRate: number;
      openRate: number;
      clickRate: number;
      usageByDate: Array<{
        date: string;
        sent: number;
        delivered: number;
        opened: number;
        clicked: number;
      }>;
    };
  }> {
    const endpoint = id ? `/notification-templates/${id}/stats` : '/notification-templates/stats';
    const response = await apiClient.get<{
      totalTemplates: number;
      activeTemplates: number;
      templatesByChannel: Record<string, number>;
      templatesByType: Record<string, number>;
      mostUsedTemplates: Array<{
        templateId: string;
        templateName: string;
        usageCount: number;
        lastUsedAt?: string;
      }>;
      templateUsage?: {
        templateId: string;
        totalSent: number;
        totalDelivered: number;
        totalOpened: number;
        totalClicked: number;
        deliveryRate: number;
        openRate: number;
        clickRate: number;
        usageByDate: Array<{
          date: string;
          sent: number;
          delivered: number;
          opened: number;
          clicked: number;
        }>;
      };
    }>(endpoint);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch template statistics');
    }
    return response.data;
  }

  // Get available template variables
  static async getAvailableVariables(): Promise<{
    globalVariables: Array<{
      name: string;
      description: string;
      type: string;
      example: string;
    }>;
    channelSpecificVariables: Record<string, Array<{
      name: string;
      description: string;
      type: string;
      example: string;
    }>>;
    typeSpecificVariables: Record<string, Array<{
      name: string;
      description: string;
      type: string;
      example: string;
    }>>;
  }> {
    const response = await apiClient.get<{
      globalVariables: Array<{
        name: string;
        description: string;
        type: string;
        example: string;
      }>;
      channelSpecificVariables: Record<string, Array<{
        name: string;
        description: string;
        type: string;
        example: string;
      }>>;
      typeSpecificVariables: Record<string, Array<{
        name: string;
        description: string;
        type: string;
        example: string;
      }>>;
    }>('/notification-templates/variables');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch available template variables');
    }
    return response.data;
  }

  // Validate template content
  static async validateTemplate(data: CreateNotificationTemplateData): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
    suggestions: string[];
    variableValidation: {
      foundVariables: string[];
      missingVariables: string[];
      unusedVariables: string[];
    };
  }> {
    const response = await apiClient.post<{
      valid: boolean;
      errors: string[];
      warnings: string[];
      suggestions: string[];
      variableValidation: {
        foundVariables: string[];
        missingVariables: string[];
        unusedVariables: string[];
      };
    }>('/notification-templates/validate', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to validate notification template');
    }
    return response.data;
  }

  // Import templates from JSON/CSV
  static async importTemplates(file: File, options?: {
    overwriteExisting?: boolean;
    validateBeforeImport?: boolean;
  }): Promise<{
    imported: number;
    failed: number;
    total: number;
    results: Array<{
      name: string;
      success: boolean;
      error?: string;
      template?: NotificationTemplate;
    }>;
  }> {
    const formData = new FormData();
    formData.append('file', file);
    if (options) {
      formData.append('options', JSON.stringify(options));
    }

    const response = await apiClient.upload<{
      imported: number;
      failed: number;
      total: number;
      results: Array<{
        name: string;
        success: boolean;
        error?: string;
        template?: NotificationTemplate;
      }>;
    }>('/notification-templates/import', formData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to import notification templates');
    }
    return response.data;
  }

  // Export templates
  static async exportTemplates(format: 'json' | 'csv' = 'json', filters?: NotificationTemplateFilters): Promise<{
    downloadUrl: string;
    filename: string;
    expiresAt: string;
  }> {
    const response = await apiClient.get<{
      downloadUrl: string;
      filename: string;
      expiresAt: string;
    }>('/notification-templates/export', { format, ...filters });
    if (!response.success) {
      throw new Error(response.error || 'Failed to export notification templates');
    }
    return response.data;
  }

  // Bulk operations
  static async bulkUpdateTemplates(updates: Array<{
    id: string;
    data: UpdateNotificationTemplateData;
  }>): Promise<{
    updated: number;
    failed: number;
    results: Array<{
      id: string;
      success: boolean;
      error?: string;
      template?: NotificationTemplate;
    }>;
  }> {
    const response = await apiClient.post<{
      updated: number;
      failed: number;
      results: Array<{
        id: string;
        success: boolean;
        error?: string;
        template?: NotificationTemplate;
      }>;
    }>('/notification-templates/bulk-update', { updates });
    if (!response.success) {
      throw new Error(response.error || 'Failed to bulk update notification templates');
    }
    return response.data;
  }

  static async bulkDeleteTemplates(templateIds: string[]): Promise<{
    deleted: number;
    failed: number;
    results: Array<{
      id: string;
      success: boolean;
      error?: string;
    }>;
  }> {
    const response = await apiClient.post<{
      deleted: number;
      failed: number;
      results: Array<{
        id: string;
        success: boolean;
        error?: string;
      }>;
    }>('/notification-templates/bulk-delete', { templateIds });
    if (!response.success) {
      throw new Error(response.error || 'Failed to bulk delete notification templates');
    }
    return response.data;
  }

  // Get template categories/tags
  static async getTemplateCategories(): Promise<Array<{
    id: string;
    name: string;
    description: string;
    color: string;
    templateCount: number;
    isActive: boolean;
  }>> {
    const response = await apiClient.get<Array<{
      id: string;
      name: string;
      description: string;
      color: string;
      templateCount: number;
      isActive: boolean;
    }>>('/notification-templates/categories');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch template categories');
    }
    return response.data;
  }

  // Get template versions (if versioning is enabled)
  static async getTemplateVersions(templateId: string): Promise<Array<{
    version: number;
    createdAt: string;
    createdBy: string;
    changes: string;
    isActive: boolean;
    template: Partial<NotificationTemplate>;
  }>> {
    const response = await apiClient.get<Array<{
      version: number;
      createdAt: string;
      createdBy: string;
      changes: string;
      isActive: boolean;
      template: Partial<NotificationTemplate>;
    }>>(`/notification-templates/${templateId}/versions`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch template versions');
    }
    return response.data;
  }

  // Restore template version
  static async restoreTemplateVersion(templateId: string, version: number): Promise<NotificationTemplate> {
    const response = await apiClient.post<NotificationTemplate>(`/notification-templates/${templateId}/versions/${version}/restore`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to restore template version');
    }
    return response.data;
  }
}