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
    throw new Error('Payment methods endpoint not available');
  },

  // Add payment method
  async addPaymentMethod(data: {
    type: 'card' | 'upi' | 'netbanking' | 'wallet';
    token: string; // Token from payment gateway
    isDefault?: boolean;
  }): Promise<PaymentMethod> {
    throw new Error('Add payment method endpoint not available');
  },

  // Update payment method
  async updatePaymentMethod(id: string, data: {
    isDefault?: boolean;
    isActive?: boolean;
  }): Promise<PaymentMethod> {
    throw new Error('Update payment method endpoint not available');
  },

  // Delete payment method
  async deletePaymentMethod(id: string): Promise<void> {
    throw new Error('Delete payment method endpoint not available');
  },

  // Create payment intent
  async createPaymentIntent(data: CreatePaymentIntentData): Promise<PaymentIntent> {
    throw new Error('Payment intent endpoint not available');
  },

  // Get payment intent
  async getPaymentIntent(id: string): Promise<PaymentIntent> {
    throw new Error('Get payment intent endpoint not available');
  },

  // Confirm payment
  async confirmPayment(intentId: string, data?: {
    paymentMethodId?: string;
    returnUrl?: string;
  }): Promise<PaymentTransaction> {
    throw new Error('Confirm payment endpoint not available');
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
    throw new Error('Payment transactions endpoint not available');
  },

  // Get payment transaction by ID
  async getTransaction(id: string): Promise<PaymentTransaction> {
    throw new Error('Get transaction endpoint not available');
  },

  // Process refund
  async processRefund(transactionId: string, data: RefundData): Promise<{
    refundId: string;
    amount: number;
    status: string;
  }> {
    throw new Error('Process refund endpoint not available');
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
    throw new Error('Payment gateways endpoint not available');
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
    throw new Error('Payment stats endpoint not available');
  },

  // Validate payment method
  async validatePaymentMethod(methodId: string, amount: number): Promise<{
    valid: boolean;
    message?: string;
    fees?: number;
  }> {
    throw new Error('Validate payment method endpoint not available');
  },

  // Get payment receipt
  async getPaymentReceipt(transactionId: string): Promise<{
    receiptUrl: string;
    downloadUrl: string;
  }> {
    throw new Error('Payment receipt endpoint not available');
  }
};