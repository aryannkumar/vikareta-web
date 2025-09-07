import { apiClient } from './client';

export interface AdminAction {
  id: string;
  adminId: string;
  adminName: string;
  adminEmail: string;
  action: string;
  targetType: 'user' | 'order' | 'product' | 'rfq' | 'category' | 'system' | 'other';
  targetId: string;
  targetName?: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  success: boolean;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

export interface AdminActionFilters {
  action?: string;
  targetType?: string;
  adminId?: string;
  targetId?: string;
  dateFrom?: string;
  dateTo?: string;
  success?: boolean;
  page?: number;
  limit?: number;
}

export interface AdminActionStats {
  totalActions: number;
  actionsByType: Record<string, number>;
  actionsByAdmin: Record<string, number>;
  actionsByTargetType: Record<string, number>;
  successRate: number;
  recentActions: AdminAction[];
  topActions: Array<{
    action: string;
    count: number;
    percentage: number;
  }>;
}

export class AdminActionService {
  // Get admin actions with filtering and pagination
  static async getAdminActions(filters?: AdminActionFilters): Promise<{
    actions: AdminAction[];
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    const response = await apiClient.get<{
      actions: AdminAction[];
      total: number;
      page: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    }>('/admin-actions', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch admin actions');
    }
    return response.data;
  }

  // Get admin action by ID
  static async getAdminActionById(id: string): Promise<AdminAction> {
    const response = await apiClient.get<AdminAction>(`/admin-actions/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch admin action');
    }
    return response.data;
  }

  // Get admin actions for a specific admin
  static async getAdminActionsByAdmin(adminId: string, filters?: Omit<AdminActionFilters, 'adminId'>): Promise<{
    actions: AdminAction[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      actions: AdminAction[];
      total: number;
      page: number;
      totalPages: number;
    }>(`/admin-actions/admin/${adminId}`, filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch admin actions for admin');
    }
    return response.data;
  }

  // Get admin actions for a specific target
  static async getAdminActionsByTarget(targetType: string, targetId: string, filters?: Omit<AdminActionFilters, 'targetType' | 'targetId'>): Promise<{
    actions: AdminAction[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      actions: AdminAction[];
      total: number;
      page: number;
      totalPages: number;
    }>(`/admin-actions/target/${targetType}/${targetId}`, filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch admin actions for target');
    }
    return response.data;
  }

  // Get admin action statistics
  static async getAdminActionStats(filters?: {
    dateFrom?: string;
    dateTo?: string;
    adminId?: string;
  }): Promise<AdminActionStats> {
    const response = await apiClient.get<AdminActionStats>('/admin-actions/stats', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch admin action stats');
    }
    return response.data;
  }

  // Get available action types
  static async getAvailableActionTypes(): Promise<Array<{
    action: string;
    description: string;
    category: 'user' | 'order' | 'product' | 'system' | 'security' | 'content';
    requiresTarget: boolean;
  }>> {
    const response = await apiClient.get<Array<{
      action: string;
      description: string;
      category: 'user' | 'order' | 'product' | 'system' | 'security' | 'content';
      requiresTarget: boolean;
    }>>('/admin-actions/action-types');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch available action types');
    }
    return response.data;
  }

  // Get available target types
  static async getAvailableTargetTypes(): Promise<Array<{
    type: string;
    description: string;
    entityName: string;
  }>> {
    const response = await apiClient.get<Array<{
      type: string;
      description: string;
      entityName: string;
    }>>('/admin-actions/target-types');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch available target types');
    }
    return response.data;
  }

  // Search admin actions
  static async searchAdminActions(query: string, filters?: AdminActionFilters): Promise<{
    actions: AdminAction[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      actions: AdminAction[];
      total: number;
      page: number;
      totalPages: number;
    }>('/admin-actions/search', { q: query, ...filters });
    if (!response.success) {
      throw new Error(response.error || 'Failed to search admin actions');
    }
    return response.data;
  }

  // Export admin actions
  static async exportAdminActions(format: 'csv' | 'json' | 'pdf' = 'csv', filters?: AdminActionFilters): Promise<{
    downloadUrl: string;
    filename: string;
    expiresAt: string;
  }> {
    const response = await apiClient.get<{
      downloadUrl: string;
      filename: string;
      expiresAt: string;
    }>('/admin-actions/export', { format, ...filters });
    if (!response.success) {
      throw new Error(response.error || 'Failed to export admin actions');
    }
    return response.data;
  }

  // Get admin action timeline for a target
  static async getAdminActionTimeline(targetType: string, targetId: string, limit?: number): Promise<AdminAction[]> {
    const response = await apiClient.get<AdminAction[]>(`/admin-actions/timeline/${targetType}/${targetId}`, { limit });
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch admin action timeline');
    }
    return response.data;
  }

  // Get admin activity summary
  static async getAdminActivitySummary(adminId: string, period?: string): Promise<{
    adminId: string;
    adminName: string;
    period: string;
    totalActions: number;
    actionsByType: Record<string, number>;
    actionsByTargetType: Record<string, number>;
    successRate: number;
    averageActionsPerDay: number;
    mostActiveDay: string;
    recentActions: AdminAction[];
  }> {
    const response = await apiClient.get<{
      adminId: string;
      adminName: string;
      period: string;
      totalActions: number;
      actionsByType: Record<string, number>;
      actionsByTargetType: Record<string, number>;
      successRate: number;
      averageActionsPerDay: number;
      mostActiveDay: string;
      recentActions: AdminAction[];
    }>(`/admin-actions/admin/${adminId}/summary`, { period });
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch admin activity summary');
    }
    return response.data;
  }

  // Bulk delete admin actions (admin only)
  static async bulkDeleteAdminActions(actionIds: string[], reason?: string): Promise<{
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
    }>('/admin-actions/bulk-delete', { actionIds, reason });
    if (!response.success) {
      throw new Error(response.error || 'Failed to bulk delete admin actions');
    }
    return response.data;
  }

  // Archive old admin actions
  static async archiveOldAdminActions(olderThanDays: number): Promise<{
    archived: number;
    totalSize: number;
    archivePath: string;
  }> {
    const response = await apiClient.post<{
      archived: number;
      totalSize: number;
      archivePath: string;
    }>('/admin-actions/archive', { olderThanDays });
    if (!response.success) {
      throw new Error(response.error || 'Failed to archive old admin actions');
    }
    return response.data;
  }
}