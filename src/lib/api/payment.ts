import { apiClient } from './client';

export interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'netbanking' | 'wallet' | 'cod';
  name: string;
  isDefault: boolean;
  details: {
    last4?: string;
    cardType?: string;
    upiId?: string;
    bankName?: string;
    walletName?: string;
  };
  isActive: boolean;
  createdAt: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled';
  paymentMethod: string;
  description?: string;
  orderId?: string;
  rfqId?: string;
  clientSecret: string;
  paymentUrl?: string;
  expiresAt?: string;
  createdAt: string;
}

export interface PaymentTransaction {
  id: string;
  orderId?: string;
  rfqId?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded' | 'cancelled';
  paymentMethod: string;
  gatewayTransactionId?: string;
  gateway: 'razorpay' | 'cashfree' | 'stripe' | 'paypal';
  failureReason?: string;
  refundedAmount?: number;
  refundReason?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentIntentData {
  amount: number;
  currency?: string;
  paymentMethod: string;
  orderId?: string;
  rfqId?: string;
  description?: string;
  returnUrl?: string;
  metadata?: Record<string, any>;
}

export interface RefundData {
  amount: number;
  reason: string;
  notes?: string;
}

export const paymentApi = {
  // Get user's saved payment methods
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await apiClient.get<PaymentMethod[]>('/payments/methods');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch payment methods');
    }
    return response.data;
  },

  // Add payment method
  async addPaymentMethod(data: {
    type: 'card' | 'upi' | 'netbanking' | 'wallet';
    token: string; // Token from payment gateway
    isDefault?: boolean;
  }): Promise<PaymentMethod> {
    const response = await apiClient.post<PaymentMethod>('/payments/methods', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to add payment method');
    }
    return response.data;
  },

  // Update payment method
  async updatePaymentMethod(id: string, data: {
    isDefault?: boolean;
    isActive?: boolean;
  }): Promise<PaymentMethod> {
    const response = await apiClient.put<PaymentMethod>(`/payments/methods/${id}`, data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update payment method');
    }
    return response.data;
  },

  // Delete payment method
  async deletePaymentMethod(id: string): Promise<void> {
    const response = await apiClient.delete(`/payments/methods/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete payment method');
    }
  },

  // Create payment intent
  async createPaymentIntent(data: CreatePaymentIntentData): Promise<PaymentIntent> {
    const response = await apiClient.post<PaymentIntent>('/payments/intent', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to create payment intent');
    }
    return response.data;
  },

  // Get payment intent
  async getPaymentIntent(id: string): Promise<PaymentIntent> {
    const response = await apiClient.get<PaymentIntent>(`/payments/intent/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch payment intent');
    }
    return response.data;
  },

  // Confirm payment
  async confirmPayment(intentId: string, data?: {
    paymentMethodId?: string;
    returnUrl?: string;
  }): Promise<PaymentTransaction> {
    const response = await apiClient.post<PaymentTransaction>(`/payments/intent/${intentId}/confirm`, data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to confirm payment');
    }
    return response.data;
  },

  // Get payment transactions
  async getTransactions(filters?: {
    status?: string;
    paymentMethod?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    transactions: PaymentTransaction[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      transactions: PaymentTransaction[];
      total: number;
      page: number;
      totalPages: number;
    }>('/payments/transactions', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch transactions');
    }
    return response.data;
  },

  // Get payment transaction by ID
  async getTransaction(id: string): Promise<PaymentTransaction> {
    const response = await apiClient.get<PaymentTransaction>(`/payments/transactions/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch transaction');
    }
    return response.data;
  },

  // Process refund
  async processRefund(transactionId: string, data: RefundData): Promise<{
    refundId: string;
    amount: number;
    status: string;
  }> {
    const response = await apiClient.post<{
      refundId: string;
      amount: number;
      status: string;
    }>(`/payments/transactions/${transactionId}/refund`, data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to process refund');
    }
    return response.data;
  },

  // Get payment gateways
  async getPaymentGateways(): Promise<Array<{
    id: string;
    name: string;
    code: string;
    isActive: boolean;
    supportedMethods: string[];
    fees: {
      percentage?: number;
      fixed?: number;
    };
  }>> {
    const response = await apiClient.get<Array<{
      id: string;
      name: string;
      code: string;
      isActive: boolean;
      supportedMethods: string[];
      fees: {
        percentage?: number;
        fixed?: number;
      };
    }>>('/payments/gateways');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch payment gateways');
    }
    return response.data;
  },

  // Get payment statistics
  async getPaymentStats(period?: '7d' | '30d' | '90d' | '1y'): Promise<{
    totalPayments: number;
    totalAmount: number;
    successRate: number;
    averagePayment: number;
    paymentMethods: Record<string, number>;
    dailyPayments: Array<{
      date: string;
      amount: number;
      count: number;
    }>;
  }> {
    const response = await apiClient.get<{
      totalPayments: number;
      totalAmount: number;
      successRate: number;
      averagePayment: number;
      paymentMethods: Record<string, number>;
      dailyPayments: Array<{
        date: string;
        amount: number;
        count: number;
      }>;
    }>('/payments/stats', { period });
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch payment stats');
    }
    return response.data;
  },

  // Validate payment method
  async validatePaymentMethod(methodId: string, amount: number): Promise<{
    valid: boolean;
    message?: string;
    fees?: number;
  }> {
    const response = await apiClient.post<{
      valid: boolean;
      message?: string;
      fees?: number;
    }>(`/payments/methods/${methodId}/validate`, { amount });
    if (!response.success) {
      throw new Error(response.error || 'Failed to validate payment method');
    }
    return response.data;
  },

  // Get payment receipt
  async getPaymentReceipt(transactionId: string): Promise<{
    receiptUrl: string;
    downloadUrl: string;
  }> {
    const response = await apiClient.get<{
      receiptUrl: string;
      downloadUrl: string;
    }>(`/payments/transactions/${transactionId}/receipt`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch payment receipt');
    }
    return response.data;
  }
};