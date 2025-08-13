import { apiClient } from './client';

export interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  items: OrderItem[];
  totalAmount: number;
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount?: number;
  currency: string;
  
  // Customer Info
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  
  // Shipping Info
  shippingAddress: Address;
  billingAddress: Address;
  
  // Supplier Info
  supplierId: string;
  supplierName: string;
  supplierEmail: string;
  supplierPhone: string;
  
  // Dates
  orderDate: string;
  expectedDeliveryDate?: string;
  deliveredDate?: string;
  
  // Payment
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentDate?: string;
  
  // Tracking
  trackingNumber?: string;
  trackingUrl?: string;
  
  // Additional Info
  notes?: string;
  internalNotes?: string;
  
  // Timeline
  timeline: OrderTimeline[];
  
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specifications?: Record<string, any>;
  variantId?: string;
  variantName?: string;
}

export interface Address {
  name: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface OrderTimeline {
  id: string;
  status: string;
  title: string;
  description: string;
  timestamp: string;
  location?: string;
  updatedBy?: string;
}

export interface OrderFilters {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  supplierId?: string;
  customerId?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  sortBy?: 'createdAt' | 'totalAmount' | 'status';
  page?: number;
  limit?: number;
}

export interface CreateOrderData {
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
    variantId?: string;
    specifications?: Record<string, any>;
  }>;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  notes?: string;
}

export interface UpdateOrderStatusData {
  status: Order['status'];
  notes?: string;
  trackingNumber?: string;
  expectedDeliveryDate?: string;
}

export const ordersApi = {
  async getOrders(filters?: OrderFilters) {
    return apiClient.get<{
      orders: Order[];
      total: number;
      page: number;
      totalPages: number;
    }>('/orders', filters);
  },

  async getOrder(id: string) {
    return apiClient.get<Order>(`/orders/${id}`);
  },

  async createOrder(data: CreateOrderData) {
    return apiClient.post<Order>('/orders', data);
  },

  async updateOrderStatus(id: string, data: UpdateOrderStatusData) {
    return apiClient.put<Order>(`/orders/${id}/status`, data);
  },

  async cancelOrder(id: string, reason?: string) {
    return apiClient.post(`/orders/${id}/cancel`, { reason });
  },

  async getMyOrders(filters?: Omit<OrderFilters, 'customerId'>) {
    return apiClient.get<{
      orders: Order[];
      total: number;
      page: number;
      totalPages: number;
    }>('/orders/my', filters);
  },

  async getSupplierOrders(filters?: Omit<OrderFilters, 'supplierId'>) {
    return apiClient.get<{
      orders: Order[];
      total: number;
      page: number;
      totalPages: number;
    }>('/orders/supplier', filters);
  },

  async addOrderNote(id: string, note: string, isInternal: boolean = false) {
    return apiClient.post(`/orders/${id}/notes`, { note, isInternal });
  },

  async updateTrackingInfo(id: string, data: {
    trackingNumber: string;
    trackingUrl?: string;
    carrier?: string;
  }) {
    return apiClient.put(`/orders/${id}/tracking`, data);
  },

  async requestRefund(id: string, data: {
    reason: string;
    amount?: number;
    items?: string[];
  }) {
    return apiClient.post(`/orders/${id}/refund`, data);
  },

  async downloadInvoice(id: string) {
    return apiClient.get<{ url: string }>(`/orders/${id}/invoice`);
  },

  async getOrderStats(dateFrom?: string, dateTo?: string) {
    return apiClient.get<{
      totalOrders: number;
      totalRevenue: number;
      averageOrderValue: number;
      statusBreakdown: Record<string, number>;
      revenueByMonth: Array<{ month: string; revenue: number }>;
    }>('/orders/stats', { dateFrom, dateTo });
  }
};