import { apiClient } from './client';

export interface ServiceOrder {
  id: string;
  orderId: string;
  serviceId: string;
  status: 'pending' | 'confirmed' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate?: string;
  completedDate?: string;
  providerNotes?: string;
  customerNotes?: string;
  createdAt: string;
  updatedAt: string;
  service: {
    id: string;
    title: string;
    description?: string;
    price: number;
    duration?: string;
    providerId: string;
  };
  order: {
    id: string;
    orderNumber: string;
    buyerId: string;
    sellerId: string;
    status: string;
    totalAmount: number;
  };
}

export interface UpdateServiceOrderData {
  status?: 'pending' | 'confirmed' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate?: string;
  providerNotes?: string;
  customerNotes?: string;
}

export interface ServiceOrderFilters {
  orderId?: string;
  serviceId?: string;
  status?: string;
  providerId?: string;
  customerId?: string;
  scheduledFrom?: string;
  scheduledTo?: string;
  page?: number;
  limit?: number;
}

export class ServiceOrderService {
  // Get all service orders
  static async getServiceOrders(filters?: ServiceOrderFilters): Promise<{
    serviceOrders: ServiceOrder[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      serviceOrders: ServiceOrder[];
      total: number;
      page: number;
      totalPages: number;
    }>('/service-orders', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch service orders');
    }
    return response.data;
  }

  // Get service order by ID
  static async getServiceOrderById(id: string): Promise<ServiceOrder> {
    const response = await apiClient.get<ServiceOrder>(`/service-orders/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch service order');
    }
    return response.data;
  }

  // Update service order status
  static async updateServiceOrderStatus(id: string, data: UpdateServiceOrderData): Promise<ServiceOrder> {
    const response = await apiClient.put<ServiceOrder>(`/service-orders/${id}/status`, data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update service order status');
    }
    return response.data;
  }

  // Get service orders for current user
  static async getMyServiceOrders(filters?: ServiceOrderFilters): Promise<{
    serviceOrders: ServiceOrder[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      serviceOrders: ServiceOrder[];
      total: number;
      page: number;
      totalPages: number;
    }>('/service-orders/my', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch my service orders');
    }
    return response.data;
  }

  // Get service orders as provider
  static async getProviderServiceOrders(filters?: ServiceOrderFilters): Promise<{
    serviceOrders: ServiceOrder[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      serviceOrders: ServiceOrder[];
      total: number;
      page: number;
      totalPages: number;
    }>('/service-orders/provider', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch provider service orders');
    }
    return response.data;
  }

  // Get service orders as customer
  static async getCustomerServiceOrders(filters?: ServiceOrderFilters): Promise<{
    serviceOrders: ServiceOrder[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      serviceOrders: ServiceOrder[];
      total: number;
      page: number;
      totalPages: number;
    }>('/service-orders/customer', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch customer service orders');
    }
    return response.data;
  }

  // Get upcoming service orders
  static async getUpcomingServiceOrders(limit: number = 10): Promise<ServiceOrder[]> {
    const response = await apiClient.get<ServiceOrder[]>(`/service-orders/upcoming?limit=${limit}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch upcoming service orders');
    }
    return response.data;
  }

  // Get service orders by date range
  static async getServiceOrdersByDateRange(startDate: string, endDate: string): Promise<ServiceOrder[]> {
    const response = await apiClient.get<ServiceOrder[]>(`/service-orders/range?start=${startDate}&end=${endDate}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch service orders by date range');
    }
    return response.data;
  }

  // Get service order statistics
  static async getServiceOrderStats(): Promise<{
    totalServiceOrders: number;
    pendingServiceOrders: number;
    confirmedServiceOrders: number;
    scheduledServiceOrders: number;
    inProgressServiceOrders: number;
    completedServiceOrders: number;
    cancelledServiceOrders: number;
    completionRate: number;
    averageCompletionTime: number; // in hours
    serviceOrdersByStatus: Record<string, number>;
    serviceOrdersByService: Record<string, number>;
    revenueByService: Record<string, number>;
  }> {
    const response = await apiClient.get<{
      totalServiceOrders: number;
      pendingServiceOrders: number;
      confirmedServiceOrders: number;
      scheduledServiceOrders: number;
      inProgressServiceOrders: number;
      completedServiceOrders: number;
      cancelledServiceOrders: number;
      completionRate: number;
      averageCompletionTime: number;
      serviceOrdersByStatus: Record<string, number>;
      serviceOrdersByService: Record<string, number>;
      revenueByService: Record<string, number>;
    }>('/service-orders/stats');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch service order stats');
    }
    return response.data;
  }

  // Mark service order as completed
  static async completeServiceOrder(id: string, notes?: string): Promise<ServiceOrder> {
    const response = await apiClient.post<ServiceOrder>(`/service-orders/${id}/complete`, { notes });
    if (!response.success) {
      throw new Error(response.error || 'Failed to complete service order');
    }
    return response.data;
  }

  // Cancel service order
  static async cancelServiceOrder(id: string, reason?: string): Promise<ServiceOrder> {
    const response = await apiClient.post<ServiceOrder>(`/service-orders/${id}/cancel`, { reason });
    if (!response.success) {
      throw new Error(response.error || 'Failed to cancel service order');
    }
    return response.data;
  }

  // Reschedule service order
  static async rescheduleServiceOrder(id: string, scheduledDate: string): Promise<ServiceOrder> {
    const response = await apiClient.post<ServiceOrder>(`/service-orders/${id}/reschedule`, { scheduledDate });
    if (!response.success) {
      throw new Error(response.error || 'Failed to reschedule service order');
    }
    return response.data;
  }

  // Send service order reminder
  static async sendServiceOrderReminder(id: string): Promise<{
    success: boolean;
    message: string;
    sentTo: string;
  }> {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      sentTo: string;
    }>(`/service-orders/${id}/reminder`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to send service order reminder');
    }
    return response.data;
  }

  // Bulk update service order statuses
  static async bulkUpdateServiceOrderStatuses(updates: Array<{
    id: string;
    status: 'pending' | 'confirmed' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
    scheduledDate?: string;
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
    }>('/service-orders/bulk-update-status', { updates });
    if (!response.success) {
      throw new Error(response.error || 'Failed to bulk update service order statuses');
    }
    return response.data;
  }

  // Get service order timeline
  static async getServiceOrderTimeline(orderId: string): Promise<Array<{
    id: string;
    type: 'created' | 'status_changed' | 'scheduled' | 'completed' | 'cancelled';
    description: string;
    timestamp: string;
    userId?: string;
    userName?: string;
  }>> {
    const response = await apiClient.get<Array<{
      id: string;
      type: 'created' | 'status_changed' | 'scheduled' | 'completed' | 'cancelled';
      description: string;
      timestamp: string;
      userId?: string;
      userName?: string;
    }>>(`/service-orders/${orderId}/timeline`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch service order timeline');
    }
    return response.data;
  }

  // Rate service order (customer feedback)
  static async rateServiceOrder(id: string, rating: number, review?: string): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
    }>(`/service-orders/${id}/rate`, { rating, review });
    if (!response.success) {
      throw new Error(response.error || 'Failed to rate service order');
    }
    return response.data;
  }
}