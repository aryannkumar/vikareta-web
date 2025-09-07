import { apiClient } from './client';

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  status: 'active' | 'inactive' | 'cancelled' | 'expired' | 'pending';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  cancelledAt?: string;
  amount: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    products: number;
    orders: number;
    storage: number;
    users: number;
  };
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    products: number;
    orders: number;
    storage: number;
    users: number;
  };
  popular?: boolean;
  recommended?: boolean;
  trialDays?: number;
  metadata?: Record<string, any>;
}

export interface SubscriptionHistory {
  id: string;
  subscriptionId: string;
  type: 'created' | 'updated' | 'cancelled' | 'reactivated' | 'renewed';
  description: string;
  amount?: number;
  currency?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface CreateSubscriptionData {
  planId: string;
  paymentMethodId?: string;
  trialDays?: number;
  metadata?: Record<string, any>;
}

export interface UpdateSubscriptionData {
  planId?: string;
  cancelAtPeriodEnd?: boolean;
  metadata?: Record<string, any>;
}

export class SubscriptionService {
  // Get current user's subscription
  static async getCurrentSubscription(): Promise<Subscription | null> {
    const response = await apiClient.get('/subscriptions/current');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch current subscription');
    }
    return response.data as Subscription | null;
  }

  // Get subscription history
  static async getSubscriptionHistory(): Promise<SubscriptionHistory[]> {
    const response = await apiClient.get('/subscriptions/history');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch subscription history');
    }
    return response.data as SubscriptionHistory[];
  }

  // Get available subscription plans
  static async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    const response = await apiClient.get('/subscriptions/plans');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch subscription plans');
    }
    return response.data as SubscriptionPlan[];
  }

  // Create a new subscription
  static async createSubscription(subscriptionData: CreateSubscriptionData): Promise<Subscription> {
    const response = await apiClient.post('/subscriptions', subscriptionData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to create subscription');
    }
    return response.data as Subscription;
  }

  // Update subscription
  static async updateSubscription(subscriptionId: string, updateData: UpdateSubscriptionData): Promise<Subscription> {
    const response = await apiClient.put(`/subscriptions/${subscriptionId}`, updateData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update subscription');
    }
    return response.data as Subscription;
  }

  // Cancel subscription
  static async cancelSubscription(subscriptionId: string, reason?: string): Promise<{
    success: boolean;
    message: string;
    effectiveDate: string;
  }> {
    const response = await apiClient.post(`/subscriptions/${subscriptionId}/cancel`, { reason });
    if (!response.success) {
      throw new Error(response.error || 'Failed to cancel subscription');
    }
    return response.data as {
      success: boolean;
      message: string;
      effectiveDate: string;
    };
  }

  // Reactivate subscription
  static async reactivateSubscription(subscriptionId: string): Promise<Subscription> {
    const response = await apiClient.post(`/subscriptions/${subscriptionId}/reactivate`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to reactivate subscription');
    }
    return response.data as Subscription;
  }

  // Upgrade subscription plan
  static async upgradeSubscription(planId: string): Promise<Subscription> {
    const response = await apiClient.post('/subscriptions/upgrade', { planId });
    if (!response.success) {
      throw new Error(response.error || 'Failed to upgrade subscription');
    }
    return response.data as Subscription;
  }

  // Get subscription usage
  static async getSubscriptionUsage(): Promise<{
    currentUsage: {
      products: number;
      orders: number;
      storage: number;
      users: number;
    };
    limits: {
      products: number;
      orders: number;
      storage: number;
      users: number;
    };
    usagePercentage: {
      products: number;
      orders: number;
      storage: number;
      users: number;
    };
    resetDate: string;
  }> {
    const response = await apiClient.get('/subscriptions/usage');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch subscription usage');
    }
    return response.data as {
      currentUsage: {
        products: number;
        orders: number;
        storage: number;
        users: number;
      };
      limits: {
        products: number;
        orders: number;
        storage: number;
        users: number;
      };
      usagePercentage: {
        products: number;
        orders: number;
        storage: number;
        users: number;
      };
      resetDate: string;
    };
  }

  // Check if user can perform action based on subscription limits
  static async checkSubscriptionLimits(action: 'create_product' | 'create_order' | 'upload_file' | 'add_user'): Promise<{
    allowed: boolean;
    currentUsage: number;
    limit: number;
    message?: string;
  }> {
    const response = await apiClient.get('/subscriptions/check-limits', { action });
    if (!response.success) {
      throw new Error(response.error || 'Failed to check subscription limits');
    }
    return response.data as {
      allowed: boolean;
      currentUsage: number;
      limit: number;
      message?: string;
    };
  }

  // Get subscription invoices/billing history
  static async getBillingHistory(): Promise<Array<{
    id: string;
    subscriptionId: string;
    amount: number;
    currency: string;
    status: 'paid' | 'pending' | 'failed';
    billingDate: string;
    periodStart: string;
    periodEnd: string;
    downloadUrl?: string;
  }>> {
    const response = await apiClient.get('/subscriptions/billing');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch billing history');
    }
    return response.data as Array<{
      id: string;
      subscriptionId: string;
      amount: number;
      currency: string;
      status: 'paid' | 'pending' | 'failed';
      billingDate: string;
      periodStart: string;
      periodEnd: string;
      downloadUrl?: string;
    }>;
  }

  // Update payment method
  static async updatePaymentMethod(paymentMethodId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await apiClient.put('/subscriptions/payment-method', { paymentMethodId });
    if (!response.success) {
      throw new Error(response.error || 'Failed to update payment method');
    }
    return response.data as {
      success: boolean;
      message: string;
    };
  }

  // Get subscription analytics (for business users)
  static async getSubscriptionAnalytics(): Promise<{
    totalSubscriptions: number;
    activeSubscriptions: number;
    monthlyRecurringRevenue: number;
    churnRate: number;
    averageRevenuePerUser: number;
    planDistribution: Record<string, number>;
  }> {
    const response = await apiClient.get('/subscriptions/analytics');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch subscription analytics');
    }
    return response.data as {
      totalSubscriptions: number;
      activeSubscriptions: number;
      monthlyRecurringRevenue: number;
      churnRate: number;
      averageRevenuePerUser: number;
      planDistribution: Record<string, number>;
    };
  }

  // Preview subscription changes
  static async previewSubscriptionChange(planId: string): Promise<{
    currentPlan: SubscriptionPlan;
    newPlan: SubscriptionPlan;
    prorationAmount: number;
    immediateCharge: number;
    nextBillingDate: string;
  }> {
    const response = await apiClient.get('/subscriptions/preview-change', { planId });
    if (!response.success) {
      throw new Error(response.error || 'Failed to preview subscription change');
    }
    return response.data as {
      currentPlan: SubscriptionPlan;
      newPlan: SubscriptionPlan;
      prorationAmount: number;
      immediateCharge: number;
      nextBillingDate: string;
    };
  }
}