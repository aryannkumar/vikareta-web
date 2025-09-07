import { apiClient } from './client';

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  activeUsers: number;
  pendingOrders: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

export interface AdminAnalytics {
  userGrowth: Array<{ date: string; count: number }>;
  revenueGrowth: Array<{ date: string; amount: number }>;
  orderGrowth: Array<{ date: string; count: number }>;
  topProducts: Array<{ name: string; sales: number }>;
  topCategories: Array<{ name: string; revenue: number }>;
}

// ===== ADDITIONAL INTERFACES FOR EXPANDED ADMIN FUNCTIONALITY =====
export interface AdminBusiness {
  id: string;
  name: string;
  ownerName: string;
  ownerEmail: string;
  type: 'individual' | 'company' | 'partnership' | 'llc';
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  documents: Array<{
    type: string;
    status: 'pending' | 'approved' | 'rejected';
    url?: string;
  }>;
  subscription: {
    plan: string;
    status: 'active' | 'inactive' | 'cancelled' | 'past_due';
    expiresAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'discontinued';
  businessId: string;
  businessName: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminTransaction {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  customerId: string;
  customerName: string;
  businessId?: string;
  businessName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminReport {
  id: string;
  name: string;
  type: 'sales' | 'users' | 'products' | 'financial' | 'performance';
  status: 'generating' | 'completed' | 'failed';
  parameters: Record<string, any>;
  downloadUrl?: string;
  createdAt: string;
  completedAt?: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  target: 'all' | 'users' | 'businesses' | 'admins';
  targetIds?: string[];
  scheduledFor?: string;
  sentAt?: string;
  readCount: number;
  totalRecipients: number;
  createdAt: string;
}

export interface AdminContent {
  id: string;
  title: string;
  type: 'page' | 'blog' | 'faq' | 'announcement';
  slug: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  authorId: string;
  authorName: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSupportTicket {
  id: string;
  title: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  customerId: string;
  customerName: string;
  assignedTo?: string;
  assignedToName?: string;
  createdAt: string;
  updatedAt: string;
}

export class AdminService {
  // ===== EXISTING DASHBOARD METHODS =====
  static async getDashboardStats(): Promise<AdminDashboardStats> {
    const response = await apiClient.get<AdminDashboardStats>('/admin/dashboard');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch dashboard stats');
    }
    return response.data;
  }

  // ===== EXISTING USER MANAGEMENT METHODS =====
  static async getUsers(filters?: {
    status?: string;
    role?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    users: AdminUser[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      users: AdminUser[];
      total: number;
      page: number;
      totalPages: number;
    }>('/admin/users', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch users');
    }
    return response.data;
  }

  static async getUser(userId: string): Promise<AdminUser> {
    const response = await apiClient.get<AdminUser>(`/admin/users/${userId}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch user');
    }
    return response.data;
  }

  static async updateUserStatus(userId: string, status: string, reason?: string): Promise<void> {
    const response = await apiClient.put(`/admin/users/${userId}/status`, { status, reason });
    if (!response.success) {
      throw new Error(response.error || 'Failed to update user status');
    }
  }

  static async deleteUser(userId: string, reason?: string): Promise<void> {
    const response = await apiClient.delete(`/admin/users/${userId}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete user');
    }
  }

  static async resetUserPassword(userId: string): Promise<void> {
    const response = await apiClient.post(`/admin/users/${userId}/reset-password`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to reset user password');
    }
  }

  // ===== EXISTING ORDER MANAGEMENT METHODS =====
  static async getOrders(filters?: {
    status?: string;
    customerId?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    orders: AdminOrder[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      orders: AdminOrder[];
      total: number;
      page: number;
      totalPages: number;
    }>('/admin/orders', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch orders');
    }
    return response.data;
  }

  static async getOrder(orderId: string): Promise<AdminOrder> {
    const response = await apiClient.get<AdminOrder>(`/admin/orders/${orderId}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch order');
    }
    return response.data;
  }

  static async updateOrderStatus(orderId: string, status: string, notes?: string): Promise<void> {
    const response = await apiClient.put(`/admin/orders/${orderId}/status`, { status, notes });
    if (!response.success) {
      throw new Error(response.error || 'Failed to update order status');
    }
  }

  // ===== EXISTING ANALYTICS METHODS =====
  static async getAnalytics(period?: string): Promise<AdminAnalytics> {
    const response = await apiClient.get<AdminAnalytics>('/admin/system/analytics/overview', { period });
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch analytics');
    }
    return response.data;
  }

  static async getSystemHealth(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    services: Array<{
      name: string;
      status: string;
      uptime: number;
      responseTime: number;
    }>;
    alerts: Array<{
      level: 'info' | 'warning' | 'error';
      message: string;
      timestamp: string;
    }>;
  }> {
    const response = await apiClient.get<{
      status: 'healthy' | 'warning' | 'critical';
      services: Array<{
        name: string;
        status: string;
        uptime: number;
        responseTime: number;
      }>;
      alerts: Array<{
        level: 'info' | 'warning' | 'error';
        message: string;
        timestamp: string;
      }>;
    }>('/admin/system/health');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch system health');
    }
    return response.data;
  }

  // ===== EXISTING SYSTEM MANAGEMENT METHODS =====
  static async getSystemLogs(filters?: {
    level?: string;
    service?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    logs: Array<{
      id: string;
      level: string;
      message: string;
      service: string;
      timestamp: string;
      metadata?: Record<string, any>;
    }>;
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      logs: Array<{
        id: string;
        level: string;
        message: string;
        service: string;
        timestamp: string;
        metadata?: Record<string, any>;
      }>;
      total: number;
      page: number;
      totalPages: number;
    }>('/admin/system/logs', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch system logs');
    }
    return response.data;
  }

  static async clearSystemCache(): Promise<void> {
    const response = await apiClient.post('/admin/system/cache/clear');
    if (!response.success) {
      throw new Error(response.error || 'Failed to clear system cache');
    }
  }

  static async restartService(serviceName: string): Promise<void> {
    const response = await apiClient.post(`/admin/system/services/${serviceName}/restart`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to restart service');
    }
  }

  // ===== EXISTING CONFIGURATION METHODS =====
  static async getSystemConfig(): Promise<Record<string, any>> {
    const response = await apiClient.get<Record<string, any>>('/admin/system/config');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch system config');
    }
    return response.data;
  }

  static async updateSystemConfig(config: Record<string, any>): Promise<void> {
    const response = await apiClient.put('/admin/system/config', config);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update system config');
    }
  }

  // ===== EXISTING BACKUP & RECOVERY METHODS =====
  static async createBackup(): Promise<{
    id: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    createdAt: string;
  }> {
    const response = await apiClient.post<{
      id: string;
      status: 'pending' | 'in_progress' | 'completed' | 'failed';
      createdAt: string;
    }>('/admin/system/backup');
    if (!response.success) {
      throw new Error(response.error || 'Failed to create backup');
    }
    return response.data;
  }

  static async getBackups(): Promise<Array<{
    id: string;
    name: string;
    size: number;
    status: 'completed' | 'failed';
    createdAt: string;
    downloadUrl?: string;
  }>> {
    const response = await apiClient.get<Array<{
      id: string;
      name: string;
      size: number;
      status: 'completed' | 'failed';
      createdAt: string;
      downloadUrl?: string;
    }>>('/admin/system/backups');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch backups');
    }
    return response.data;
  }

  static async restoreBackup(backupId: string): Promise<void> {
    const response = await apiClient.post(`/admin/system/backups/${backupId}/restore`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to restore backup');
    }
  }

  // ===== EXISTING SECURITY METHODS =====
  static async getSecurityLogs(filters?: {
    action?: string;
    userId?: string;
    ip?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    logs: Array<{
      id: string;
      action: string;
      userId?: string;
      userName?: string;
      ip: string;
      userAgent: string;
      timestamp: string;
      details?: Record<string, any>;
    }>;
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      logs: Array<{
        id: string;
        action: string;
        userId?: string;
        userName?: string;
        ip: string;
        userAgent: string;
        timestamp: string;
        details?: Record<string, any>;
      }>;
      total: number;
      page: number;
      totalPages: number;
    }>('/admin/security/logs', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch security logs');
    }
    return response.data;
  }

  static async blockIP(ip: string, reason?: string): Promise<void> {
    const response = await apiClient.post('/admin/security/block-ip', { ip, reason });
    if (!response.success) {
      throw new Error(response.error || 'Failed to block IP');
    }
  }

  static async unblockIP(ip: string): Promise<void> {
    const response = await apiClient.delete(`/admin/security/block-ip/${ip}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to unblock IP');
    }
  }

  static async getBlockedIPs(): Promise<Array<{
    ip: string;
    blockedAt: string;
    blockedBy: string;
    reason?: string;
    attempts: number;
  }>> {
    const response = await apiClient.get<Array<{
      ip: string;
      blockedAt: string;
      blockedBy: string;
      reason?: string;
      attempts: number;
    }>>('/admin/security/blocked-ips');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch blocked IPs');
    }
    return response.data;
  }

  // ===== NEW BUSINESS MANAGEMENT METHODS =====
  static async getBusinesses(filters?: {
    status?: string;
    type?: string;
    verificationStatus?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    businesses: AdminBusiness[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      businesses: AdminBusiness[];
      total: number;
      page: number;
      totalPages: number;
    }>('/admin/businesses', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch businesses');
    }
    return response.data;
  }

  static async getBusiness(businessId: string): Promise<AdminBusiness> {
    const response = await apiClient.get<AdminBusiness>(`/admin/businesses/${businessId}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch business');
    }
    return response.data;
  }

  static async approveBusiness(businessId: string, notes?: string): Promise<void> {
    const response = await apiClient.post(`/admin/businesses/${businessId}/approve`, { notes });
    if (!response.success) {
      throw new Error(response.error || 'Failed to approve business');
    }
  }

  static async rejectBusiness(businessId: string, reason: string): Promise<void> {
    const response = await apiClient.post(`/admin/businesses/${businessId}/reject`, { reason });
    if (!response.success) {
      throw new Error(response.error || 'Failed to reject business');
    }
  }

  static async suspendBusiness(businessId: string, reason: string): Promise<void> {
    const response = await apiClient.post(`/admin/businesses/${businessId}/suspend`, { reason });
    if (!response.success) {
      throw new Error(response.error || 'Failed to suspend business');
    }
  }

  static async verifyBusinessDocument(businessId: string, documentId: string, status: 'approved' | 'rejected', notes?: string): Promise<void> {
    const response = await apiClient.post(`/admin/businesses/${businessId}/documents/${documentId}/verify`, { status, notes });
    if (!response.success) {
      throw new Error(response.error || 'Failed to verify business document');
    }
  }

  // ===== NEW PRODUCT MANAGEMENT METHODS =====
  static async getProducts(filters?: {
    status?: string;
    category?: string;
    businessId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    products: AdminProduct[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      products: AdminProduct[];
      total: number;
      page: number;
      totalPages: number;
    }>('/admin/products', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch products');
    }
    return response.data;
  }

  static async getProduct(productId: string): Promise<AdminProduct> {
    const response = await apiClient.get<AdminProduct>(`/admin/products/${productId}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch product');
    }
    return response.data;
  }

  static async updateProductStatus(productId: string, status: string, reason?: string): Promise<void> {
    const response = await apiClient.put(`/admin/products/${productId}/status`, { status, reason });
    if (!response.success) {
      throw new Error(response.error || 'Failed to update product status');
    }
  }

  static async bulkUpdateProducts(productIds: string[], updates: Record<string, any>): Promise<{
    updated: number;
    failed: number;
    results: Array<{
      productId: string;
      success: boolean;
      error?: string;
    }>;
  }> {
    const response = await apiClient.post<{
      updated: number;
      failed: number;
      results: Array<{
        productId: string;
        success: boolean;
        error?: string;
      }>;
    }>('/admin/products/bulk-update', { productIds, updates });
    if (!response.success) {
      throw new Error(response.error || 'Failed to bulk update products');
    }
    return response.data;
  }

  // ===== NEW FINANCIAL MANAGEMENT METHODS =====
  static async getTransactions(filters?: {
    status?: string;
    paymentMethod?: string;
    customerId?: string;
    businessId?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    transactions: AdminTransaction[];
    total: number;
    page: number;
    totalPages: number;
    summary: {
      totalAmount: number;
      totalTransactions: number;
      averageTransaction: number;
    };
  }> {
    const response = await apiClient.get<{
      transactions: AdminTransaction[];
      total: number;
      page: number;
      totalPages: number;
      summary: {
        totalAmount: number;
        totalTransactions: number;
        averageTransaction: number;
      };
    }>('/admin/finance/transactions', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch transactions');
    }
    return response.data;
  }

  static async processRefund(transactionId: string, amount: number, reason: string): Promise<void> {
    const response = await apiClient.post(`/admin/finance/transactions/${transactionId}/refund`, { amount, reason });
    if (!response.success) {
      throw new Error(response.error || 'Failed to process refund');
    }
  }

  static async getFinancialReports(filters?: {
    type?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    dateFrom?: string;
    dateTo?: string;
  }): Promise<{
    revenue: Array<{ date: string; amount: number }>;
    expenses: Array<{ date: string; amount: number }>;
    profit: Array<{ date: string; amount: number }>;
    summary: {
      totalRevenue: number;
      totalExpenses: number;
      totalProfit: number;
      growthRate: number;
    };
  }> {
    const response = await apiClient.get<{
      revenue: Array<{ date: string; amount: number }>;
      expenses: Array<{ date: string; amount: number }>;
      profit: Array<{ date: string; amount: number }>;
      summary: {
        totalRevenue: number;
        totalExpenses: number;
        totalProfit: number;
        growthRate: number;
      };
    }>('/admin/finance/reports', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch financial reports');
    }
    return response.data;
  }

  // ===== NEW REPORTING METHODS =====
  static async generateReport(type: 'sales' | 'users' | 'products' | 'financial' | 'performance', parameters: Record<string, any>): Promise<AdminReport> {
    const response = await apiClient.post<AdminReport>('/admin/reports/generate', { type, parameters });
    if (!response.success) {
      throw new Error(response.error || 'Failed to generate report');
    }
    return response.data;
  }

  static async getReports(filters?: {
    type?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    reports: AdminReport[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      reports: AdminReport[];
      total: number;
      page: number;
      totalPages: number;
    }>('/admin/reports', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch reports');
    }
    return response.data;
  }

  static async downloadReport(reportId: string): Promise<string> {
    const response = await apiClient.get<{ downloadUrl: string }>(`/admin/reports/${reportId}/download`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get report download URL');
    }
    return response.data.downloadUrl;
  }

  // ===== NEW NOTIFICATION MANAGEMENT METHODS =====
  static async createNotification(data: {
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
    target: 'all' | 'users' | 'businesses' | 'admins';
    targetIds?: string[];
    scheduledFor?: string;
  }): Promise<AdminNotification> {
    const response = await apiClient.post<AdminNotification>('/admin/notifications', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to create notification');
    }
    return response.data;
  }

  static async getNotifications(filters?: {
    type?: string;
    target?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    notifications: AdminNotification[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      notifications: AdminNotification[];
      total: number;
      page: number;
      totalPages: number;
    }>('/admin/notifications', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch notifications');
    }
    return response.data;
  }

  static async sendNotification(notificationId: string): Promise<void> {
    const response = await apiClient.post(`/admin/notifications/${notificationId}/send`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to send notification');
    }
  }

  // ===== NEW CONTENT MANAGEMENT METHODS =====
  static async getContent(filters?: {
    type?: string;
    status?: string;
    authorId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    content: AdminContent[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      content: AdminContent[];
      total: number;
      page: number;
      totalPages: number;
    }>('/admin/content', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch content');
    }
    return response.data;
  }

  static async createContent(data: {
    title: string;
    type: 'page' | 'blog' | 'faq' | 'announcement';
    slug: string;
    content: string;
    status?: 'draft' | 'published';
  }): Promise<AdminContent> {
    const response = await apiClient.post<AdminContent>('/admin/content', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to create content');
    }
    return response.data;
  }

  static async updateContent(contentId: string, data: Partial<{
    title: string;
    slug: string;
    content: string;
    status: 'draft' | 'published' | 'archived';
  }>): Promise<AdminContent> {
    const response = await apiClient.put<AdminContent>(`/admin/content/${contentId}`, data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update content');
    }
    return response.data;
  }

  static async deleteContent(contentId: string): Promise<void> {
    const response = await apiClient.delete(`/admin/content/${contentId}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete content');
    }
  }

  // ===== NEW SUPPORT MANAGEMENT METHODS =====
  static async getSupportTickets(filters?: {
    status?: string;
    priority?: string;
    category?: string;
    assignedTo?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    tickets: AdminSupportTicket[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      tickets: AdminSupportTicket[];
      total: number;
      page: number;
      totalPages: number;
    }>('/admin/support/tickets', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch support tickets');
    }
    return response.data;
  }

  static async assignSupportTicket(ticketId: string, agentId: string): Promise<void> {
    const response = await apiClient.post(`/admin/support/tickets/${ticketId}/assign`, { agentId });
    if (!response.success) {
      throw new Error(response.error || 'Failed to assign support ticket');
    }
  }

  static async getSupportAnalytics(filters?: {
    dateFrom?: string;
    dateTo?: string;
    agentId?: string;
  }): Promise<{
    totalTickets: number;
    resolvedTickets: number;
    averageResolutionTime: number;
    customerSatisfaction: number;
    ticketsByStatus: Record<string, number>;
    ticketsByPriority: Record<string, number>;
    agentPerformance: Array<{
      agentId: string;
      agentName: string;
      resolvedTickets: number;
      averageResolutionTime: number;
      satisfactionRating: number;
    }>;
  }> {
    const response = await apiClient.get<{
      totalTickets: number;
      resolvedTickets: number;
      averageResolutionTime: number;
      customerSatisfaction: number;
      ticketsByStatus: Record<string, number>;
      ticketsByPriority: Record<string, number>;
      agentPerformance: Array<{
        agentId: string;
        agentName: string;
        resolvedTickets: number;
        averageResolutionTime: number;
        satisfactionRating: number;
      }>;
    }>('/admin/support/analytics', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch support analytics');
    }
    return response.data;
  }

  // ===== NEW SUBSCRIPTION MANAGEMENT METHODS =====
  static async getSubscriptions(filters?: {
    status?: string;
    plan?: string;
    businessId?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    subscriptions: Array<{
      id: string;
      businessId: string;
      businessName: string;
      plan: string;
      status: 'active' | 'inactive' | 'cancelled' | 'past_due';
      amount: number;
      currency: string;
      startedAt: string;
      expiresAt?: string;
      cancelledAt?: string;
      autoRenew: boolean;
    }>;
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      subscriptions: Array<{
        id: string;
        businessId: string;
        businessName: string;
        plan: string;
        status: 'active' | 'inactive' | 'cancelled' | 'past_due';
        amount: number;
        currency: string;
        startedAt: string;
        expiresAt?: string;
        cancelledAt?: string;
        autoRenew: boolean;
      }>;
      total: number;
      page: number;
      totalPages: number;
    }>('/admin/subscriptions', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch subscriptions');
    }
    return response.data;
  }

  static async updateSubscription(subscriptionId: string, updates: {
    status?: 'active' | 'inactive' | 'cancelled';
    plan?: string;
    autoRenew?: boolean;
  }): Promise<void> {
    const response = await apiClient.put(`/admin/subscriptions/${subscriptionId}`, updates);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update subscription');
    }
  }

  // ===== NEW EMAIL MANAGEMENT METHODS =====
  static async sendBulkEmail(data: {
    subject: string;
    content: string;
    recipientType: 'all_users' | 'all_businesses' | 'specific_users' | 'specific_businesses';
    recipientIds?: string[];
    scheduledFor?: string;
    templateId?: string;
  }): Promise<{
    id: string;
    status: 'pending' | 'sending' | 'completed' | 'failed';
    totalRecipients: number;
    sentCount: number;
    failedCount: number;
  }> {
    const response = await apiClient.post<{
      id: string;
      status: 'pending' | 'sending' | 'completed' | 'failed';
      totalRecipients: number;
      sentCount: number;
      failedCount: number;
    }>('/admin/email/bulk', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to send bulk email');
    }
    return response.data;
  }

  static async getEmailTemplates(): Promise<Array<{
    id: string;
    name: string;
    subject: string;
    content: string;
    type: 'welcome' | 'notification' | 'marketing' | 'transactional';
    createdAt: string;
    updatedAt: string;
  }>> {
    const response = await apiClient.get<Array<{
      id: string;
      name: string;
      subject: string;
      content: string;
      type: 'welcome' | 'notification' | 'marketing' | 'transactional';
      createdAt: string;
      updatedAt: string;
    }>>('/admin/email/templates');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch email templates');
    }
    return response.data;
  }

  // ===== NEW AUDIT LOG METHODS =====
  static async getAuditLogs(filters?: {
    action?: string;
    userId?: string;
    resourceType?: string;
    resourceId?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    logs: Array<{
      id: string;
      action: string;
      userId: string;
      userName: string;
      resourceType: string;
      resourceId: string;
      oldValues?: Record<string, any>;
      newValues?: Record<string, any>;
      ip: string;
      userAgent: string;
      timestamp: string;
    }>;
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      logs: Array<{
        id: string;
        action: string;
        userId: string;
        userName: string;
        resourceType: string;
        resourceId: string;
        oldValues?: Record<string, any>;
        newValues?: Record<string, any>;
        ip: string;
        userAgent: string;
        timestamp: string;
      }>;
      total: number;
      page: number;
      totalPages: number;
    }>('/admin/audit/logs', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch audit logs');
    }
    return response.data;
  }

  // ===== NEW API MANAGEMENT METHODS =====
  static async getApiKeys(filters?: {
    status?: string;
    userId?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    keys: Array<{
      id: string;
      name: string;
      key: string;
      userId: string;
      userName: string;
      permissions: string[];
      status: 'active' | 'inactive' | 'expired';
      expiresAt?: string;
      lastUsed?: string;
      createdAt: string;
    }>;
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      keys: Array<{
        id: string;
        name: string;
        key: string;
        userId: string;
        userName: string;
        permissions: string[];
        status: 'active' | 'inactive' | 'expired';
        expiresAt?: string;
        lastUsed?: string;
        createdAt: string;
      }>;
      total: number;
      page: number;
      totalPages: number;
    }>('/admin/api/keys', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch API keys');
    }
    return response.data;
  }

  static async revokeApiKey(keyId: string): Promise<void> {
    const response = await apiClient.post(`/admin/api/keys/${keyId}/revoke`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to revoke API key');
    }
  }

  static async getApiUsage(filters?: {
    keyId?: string;
    endpoint?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    usage: Array<{
      id: string;
      keyId: string;
      endpoint: string;
      method: string;
      statusCode: number;
      responseTime: number;
      timestamp: string;
      ip: string;
    }>;
    total: number;
    page: number;
    totalPages: number;
    summary: {
      totalRequests: number;
      averageResponseTime: number;
      errorRate: number;
    };
  }> {
    const response = await apiClient.get<{
      usage: Array<{
        id: string;
        keyId: string;
        endpoint: string;
        method: string;
        statusCode: number;
        responseTime: number;
        timestamp: string;
        ip: string;
      }>;
      total: number;
      page: number;
      totalPages: number;
      summary: {
        totalRequests: number;
        averageResponseTime: number;
        errorRate: number;
      };
    }>('/admin/api/usage', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch API usage');
    }
    return response.data;
  }
}

export const adminApi = {
  // Dashboard
  async getDashboardStats() {
    return apiClient.get<AdminDashboardStats>('/admin/dashboard');
  },

  // User Management
  async getUsers(filters?: {
    status?: string;
    role?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    return apiClient.get<{
      users: AdminUser[];
      total: number;
      page: number;
      totalPages: number;
    }>('/admin/users', filters);
  },

  async getUser(userId: string) {
    return apiClient.get<AdminUser>(`/admin/users/${userId}`);
  },

  async updateUserStatus(userId: string, status: string, reason?: string) {
    return apiClient.put(`/admin/users/${userId}/status`, { status, reason });
  },

  async deleteUser(userId: string, reason?: string) {
    return apiClient.delete(`/admin/users/${userId}`);
  },

  async resetUserPassword(userId: string) {
    return apiClient.post(`/admin/users/${userId}/reset-password`);
  },

  // Order Management
  async getOrders(filters?: {
    status?: string;
    customerId?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    return apiClient.get<{
      orders: AdminOrder[];
      total: number;
      page: number;
      totalPages: number;
    }>('/admin/orders', filters);
  },

  async getOrder(orderId: string) {
    return apiClient.get<AdminOrder>(`/admin/orders/${orderId}`);
  },

  async updateOrderStatus(orderId: string, status: string, notes?: string) {
    return apiClient.put(`/admin/orders/${orderId}/status`, { status, notes });
  },

  // Analytics
  async getAnalytics(period?: string) {
    return apiClient.get<AdminAnalytics>('/admin/system/analytics/overview', { period });
  },

  async getSystemHealth() {
    return apiClient.get<{
      status: 'healthy' | 'warning' | 'critical';
      services: Array<{
        name: string;
        status: string;
        uptime: number;
        responseTime: number;
      }>;
      alerts: Array<{
        level: 'info' | 'warning' | 'error';
        message: string;
        timestamp: string;
      }>;
    }>('/admin/system/health');
  },

  // System Management
  async getSystemLogs(filters?: {
    level?: string;
    service?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }) {
    return apiClient.get('/admin/system/logs', filters);
  },

  async clearSystemCache() {
    return apiClient.post('/admin/system/cache/clear');
  },

  async restartService(serviceName: string) {
    return apiClient.post(`/admin/system/services/${serviceName}/restart`);
  },

  // Configuration
  async getSystemConfig() {
    return apiClient.get('/admin/system/config');
  },

  async updateSystemConfig(config: Record<string, any>) {
    return apiClient.put('/admin/system/config', config);
  },

  // Backup & Recovery
  async createBackup() {
    return apiClient.post('/admin/system/backup');
  },

  async getBackups() {
    return apiClient.get('/admin/system/backups');
  },

  async restoreBackup(backupId: string) {
    return apiClient.post(`/admin/system/backups/${backupId}/restore`);
  },

  // Security
  async getSecurityLogs(filters?: {
    action?: string;
    userId?: string;
    ip?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }) {
    return apiClient.get('/admin/security/logs', filters);
  },

  async blockIP(ip: string, reason?: string) {
    return apiClient.post('/admin/security/block-ip', { ip, reason });
  },

  async unblockIP(ip: string) {
    return apiClient.delete(`/admin/security/block-ip/${ip}`);
  },

  async getBlockedIPs() {
    return apiClient.get('/admin/security/blocked-ips');
  }
};