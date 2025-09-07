import { apiClient } from './client';

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  status: 'active' | 'frozen' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  type: 'credit' | 'debit';
  amount: number;
  currency: string;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  referenceType: 'order' | 'refund' | 'withdrawal' | 'deposit' | 'fee' | 'reward' | 'adjustment';
  referenceId?: string;
  paymentMethod?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface WalletSettings {
  autoTopup: boolean;
  autoTopupAmount: number;
  autoTopupThreshold: number;
  lowBalanceAlert: boolean;
  lowBalanceThreshold: number;
  transactionAlerts: boolean;
  monthlyLimit: number;
  dailyLimit: number;
  allowedPaymentMethods: string[];
}

export interface AddFundsData {
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentMethodId?: string;
  returnUrl?: string;
  description?: string;
}

export interface WithdrawFundsData {
  amount: number;
  currency: string;
  withdrawalMethod: string;
  accountDetails: {
    accountNumber?: string;
    ifscCode?: string;
    upiId?: string;
    bankName?: string;
    accountHolderName: string;
  };
  description?: string;
}

export interface WalletAnalytics {
  totalCredits: number;
  totalDebits: number;
  netBalance: number;
  transactionCount: number;
  averageTransactionAmount: number;
  monthlySpending: Array<{
    month: string;
    credits: number;
    debits: number;
    net: number;
  }>;
  topSpendingCategories: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  transactionTrends: Array<{
    date: string;
    transactions: number;
    volume: number;
  }>;
}

export const walletApi = {
  // Wallet Information
  async getWallet() {
    return apiClient.get<Wallet>('/wallet');
  },

  async getBalance() {
    return apiClient.get<{ balance: number; currency: string }>('/wallet/balance');
  },

  // Transactions
  async getTransactions(filters?: {
    type?: string;
    referenceType?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }) {
    return apiClient.get<{
      transactions: WalletTransaction[];
      total: number;
      page: number;
      totalPages: number;
      summary: {
        totalCredits: number;
        totalDebits: number;
        netAmount: number;
      };
    }>('/wallet/transactions', filters);
  },

  async getTransaction(transactionId: string) {
    return apiClient.get<WalletTransaction>(`/wallet/transactions/${transactionId}`);
  },

  // Add Funds
  async addFunds(data: AddFundsData) {
    return apiClient.post<{
      transactionId: string;
      paymentUrl?: string;
      paymentIntent?: any;
      status: string;
    }>('/wallet/add-funds', data);
  },

  async getPaymentMethods() {
    return apiClient.get<Array<{
      id: string;
      type: string;
      name: string;
      isDefault: boolean;
      lastUsed?: string;
      metadata?: Record<string, any>;
    }>>('/wallet/payment-methods');
  },

  async addPaymentMethod(data: {
    type: string;
    token: string;
    metadata?: Record<string, any>;
  }) {
    return apiClient.post('/wallet/payment-methods', data);
  },

  async removePaymentMethod(paymentMethodId: string) {
    return apiClient.delete(`/wallet/payment-methods/${paymentMethodId}`);
  },

  async setDefaultPaymentMethod(paymentMethodId: string) {
    return apiClient.post(`/wallet/payment-methods/${paymentMethodId}/default`);
  },

  // Withdraw Funds
  async withdrawFunds(data: WithdrawFundsData) {
    return apiClient.post<{
      transactionId: string;
      status: string;
      estimatedProcessingTime: string;
    }>('/wallet/withdraw', data);
  },

  async getWithdrawalMethods() {
    return apiClient.get<Array<{
      id: string;
      type: string;
      name: string;
      minAmount: number;
      maxAmount: number;
      fee: number;
      processingTime: string;
      isAvailable: boolean;
    }>>('/wallet/withdrawal-methods');
  },

  async cancelWithdrawal(transactionId: string) {
    return apiClient.post(`/wallet/transactions/${transactionId}/cancel`);
  },

  // Settings
  async getSettings() {
    return apiClient.get<WalletSettings>('/wallet/settings');
  },

  async updateSettings(settings: Partial<WalletSettings>) {
    return apiClient.put<WalletSettings>('/wallet/settings', settings);
  },

  // Analytics
  async getAnalytics(period?: string) {
    return apiClient.get<WalletAnalytics>('/wallet/analytics', { period });
  },

  async getSpendingAnalytics(category?: string, period?: string) {
    return apiClient.get<{
      categoryBreakdown: Array<{
        category: string;
        amount: number;
        percentage: number;
        transactionCount: number;
      }>;
      monthlyTrends: Array<{
        month: string;
        amount: number;
        transactions: number;
      }>;
      topMerchants: Array<{
        merchant: string;
        amount: number;
        transactions: number;
      }>;
    }>('/wallet/analytics/spending', { category, period });
  },

  // Transfer & Split Payments
  async transferFunds(data: {
    recipientId: string;
    amount: number;
    currency: string;
    description?: string;
    transferType: 'user' | 'merchant';
  }) {
    return apiClient.post<{
      transactionId: string;
      status: string;
    }>('/wallet/transfer', data);
  },

  async requestPayment(data: {
    amount: number;
    currency: string;
    description: string;
    recipientEmail?: string;
    recipientPhone?: string;
    expiryHours?: number;
  }) {
    return apiClient.post<{
      paymentRequestId: string;
      paymentUrl: string;
      expiryDate: string;
    }>('/wallet/request-payment', data);
  },

  async getPaymentRequests(filters?: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    return apiClient.get<{
      requests: Array<{
        id: string;
        amount: number;
        currency: string;
        description: string;
        status: string;
        requesterName: string;
        expiryDate: string;
        createdAt: string;
      }>;
      total: number;
      page: number;
      totalPages: number;
    }>('/wallet/payment-requests', filters);
  },

  async payPaymentRequest(requestId: string, paymentMethodId?: string) {
    return apiClient.post(`/wallet/payment-requests/${requestId}/pay`, { paymentMethodId });
  },

  async cancelPaymentRequest(requestId: string) {
    return apiClient.post(`/wallet/payment-requests/${requestId}/cancel`);
  },

  // Split Payments
  async createSplitPayment(data: {
    totalAmount: number;
    currency: string;
    description: string;
    splits: Array<{
      recipientId: string;
      amount: number;
      description?: string;
    }>;
    paymentMethodId?: string;
  }) {
    return apiClient.post<{
      splitPaymentId: string;
      status: string;
      splitTransactions: Array<{
        transactionId: string;
        recipientId: string;
        amount: number;
        status: string;
      }>;
    }>('/wallet/split-payment', data);
  },

  async getSplitPayments(filters?: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    return apiClient.get<{
      payments: Array<{
        id: string;
        totalAmount: number;
        currency: string;
        description: string;
        status: string;
        createdAt: string;
        splits: Array<{
          recipientId: string;
          recipientName: string;
          amount: number;
          status: string;
        }>;
      }>;
      total: number;
      page: number;
      totalPages: number;
    }>('/wallet/split-payments', filters);
  },

  // Rewards & Cashback
  async getRewards() {
    return apiClient.get<{
      availableRewards: number;
      totalEarned: number;
      totalRedeemed: number;
      rewards: Array<{
        id: string;
        type: string;
        amount: number;
        description: string;
        expiryDate?: string;
        isRedeemable: boolean;
      }>;
    }>('/wallet/rewards');
  },

  async redeemReward(rewardId: string) {
    return apiClient.post<{
      transactionId: string;
      amount: number;
      status: string;
    }>(`/wallet/rewards/${rewardId}/redeem`);
  },

  async getCashbackHistory(filters?: {
    page?: number;
    limit?: number;
  }) {
    return apiClient.get<{
      cashback: Array<{
        id: string;
        amount: number;
        description: string;
        source: string;
        earnedAt: string;
        expiryDate?: string;
      }>;
      total: number;
      page: number;
      totalPages: number;
    }>('/wallet/cashback', filters);
  },

  // Security
  async enableWalletLock(pin: string) {
    return apiClient.post('/wallet/security/lock', { pin });
  },

  async disableWalletLock() {
    return apiClient.delete('/wallet/security/lock');
  },

  async changeWalletPin(currentPin: string, newPin: string) {
    return apiClient.put('/wallet/security/pin', { currentPin, newPin });
  },

  async verifyWalletPin(pin: string) {
    return apiClient.post('/wallet/security/verify-pin', { pin });
  },

  // Notifications
  async getWalletNotifications(filters?: {
    read?: boolean;
    type?: string;
    page?: number;
    limit?: number;
  }) {
    return apiClient.get<{
      notifications: Array<{
        id: string;
        type: string;
        title: string;
        message: string;
        read: boolean;
        createdAt: string;
        actionUrl?: string;
      }>;
      total: number;
      page: number;
      totalPages: number;
      unreadCount: number;
    }>('/wallet/notifications', filters);
  },

  async markNotificationRead(notificationId: string) {
    return apiClient.put(`/wallet/notifications/${notificationId}/read`);
  },

  async markAllNotificationsRead() {
    return apiClient.put('/wallet/notifications/mark-all-read');
  },

  // Export
  async exportTransactions(format?: 'csv' | 'pdf', filters?: any) {
    return apiClient.get('/wallet/export/transactions', { format, ...filters });
  },

  async exportStatement(month?: string, year?: string, format?: 'pdf') {
    return apiClient.get('/wallet/export/statement', { month, year, format });
  }
};