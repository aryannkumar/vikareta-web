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
    throw new Error('Get service orders endpoint not implemented in backend');
  }

  // Get service order by ID
  static async getServiceOrderById(id: string): Promise<ServiceOrder> {
    throw new Error('Get service order by ID endpoint not implemented in backend');
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
    throw new Error('Get my service orders endpoint not implemented in backend');
  }

  // Get service orders as provider
  static async getProviderServiceOrders(filters?: ServiceOrderFilters): Promise<{
    serviceOrders: ServiceOrder[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    throw new Error('Get provider service orders endpoint not implemented in backend');
  }

  // Get service orders as customer
  static async getCustomerServiceOrders(filters?: ServiceOrderFilters): Promise<{
    serviceOrders: ServiceOrder[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    throw new Error('Get customer service orders endpoint not implemented in backend');
  }

  // Get upcoming service orders
  static async getUpcomingServiceOrders(limit: number = 10): Promise<ServiceOrder[]> {
    throw new Error('Get upcoming service orders endpoint not implemented in backend');
  }

  // Get service orders by date range
  static async getServiceOrdersByDateRange(startDate: string, endDate: string): Promise<ServiceOrder[]> {
    throw new Error('Get service orders by date range endpoint not implemented in backend');
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
    throw new Error('Get service order stats endpoint not implemented in backend');
  }

  // Mark service order as completed
  static async completeServiceOrder(id: string, notes?: string): Promise<ServiceOrder> {
    throw new Error('Complete service order endpoint not implemented in backend');
  }

  // Cancel service order
  static async cancelServiceOrder(id: string, reason?: string): Promise<ServiceOrder> {
    throw new Error('Cancel service order endpoint not implemented in backend');
  }

  // Reschedule service order
  static async rescheduleServiceOrder(id: string, scheduledDate: string): Promise<ServiceOrder> {
    throw new Error('Reschedule service order endpoint not implemented in backend');
  }

  // Send service order reminder
  static async sendServiceOrderReminder(id: string): Promise<{
    success: boolean;
    message: string;
    sentTo: string;
  }> {
    throw new Error('Send service order reminder endpoint not implemented in backend');
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
    throw new Error('Bulk update service order statuses endpoint not implemented in backend');
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
    throw new Error('Get service order timeline endpoint not implemented in backend');
  }

  // Rate service order (customer feedback)
  static async rateServiceOrder(id: string, rating: number, review?: string): Promise<{
    success: boolean;
    message: string;
  }> {
    throw new Error('Rate service order endpoint not implemented in backend');
  }
}