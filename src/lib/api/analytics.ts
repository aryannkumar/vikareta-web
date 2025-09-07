import { apiClient } from './client';

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  revenueToday: number;
  averageOrderValue: number;
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
  recentActivity: Array<{
    type: 'order' | 'user' | 'product';
    description: string;
    timestamp: string;
  }>;
}

export interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  userGrowth: Array<{
    date: string;
    count: number;
  }>;
  userRetention: {
    rate: number;
    churnRate: number;
  };
  topRegions: Array<{
    region: string;
    count: number;
  }>;
  userSegments: {
    buyers: number;
    sellers: number;
    both: number;
  };
}

export interface OrderAnalytics {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: Record<string, number>;
  ordersByPeriod: Array<{
    period: string;
    count: number;
    revenue: number;
  }>;
  topSellingProducts: Array<{
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
  }>;
}

export interface RevenueAnalytics {
  totalRevenue: number;
  revenueByPeriod: Array<{
    period: string;
    revenue: number;
    orders: number;
  }>;
  revenueByCategory: Array<{
    category: string;
    revenue: number;
    percentage: number;
  }>;
  revenueByPaymentMethod: Array<{
    method: string;
    revenue: number;
    count: number;
  }>;
  monthlyGrowth: number;
  yearlyGrowth: number;
}

export interface AnalyticsFilters {
  dateFrom?: string;
  dateTo?: string;
  period?: '7d' | '30d' | '90d' | '1y';
  groupBy?: 'day' | 'week' | 'month';
}

export class AnalyticsService {
  // Get dashboard statistics
  static async getDashboardStats(filters?: AnalyticsFilters): Promise<DashboardStats> {
    const response = await apiClient.get('/analytics/dashboard', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch dashboard stats');
    }
    return response.data as DashboardStats;
  }

  // Get user analytics
  static async getUserAnalytics(filters?: AnalyticsFilters): Promise<UserAnalytics> {
    const response = await apiClient.get('/analytics/users', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch user analytics');
    }
    return response.data as UserAnalytics;
  }

  // Get order analytics
  static async getOrderAnalytics(filters?: AnalyticsFilters): Promise<OrderAnalytics> {
    const response = await apiClient.get('/analytics/orders', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch order analytics');
    }
    return response.data as OrderAnalytics;
  }

  // Get revenue analytics
  static async getRevenueAnalytics(filters?: AnalyticsFilters): Promise<RevenueAnalytics> {
    const response = await apiClient.get('/analytics/revenue', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch revenue analytics');
    }
    return response.data as RevenueAnalytics;
  }

  // Get real-time metrics (if supported by backend)
  static async getRealTimeMetrics(): Promise<{
    activeUsers: number;
    pendingOrders: number;
    todayRevenue: number;
    serverStatus: 'healthy' | 'warning' | 'error';
  }> {
    const response = await apiClient.get('/analytics/realtime');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch real-time metrics');
    }
    return response.data as {
      activeUsers: number;
      pendingOrders: number;
      todayRevenue: number;
      serverStatus: 'healthy' | 'warning' | 'error';
    };
  }

  // Get product performance analytics
  static async getProductAnalytics(filters?: AnalyticsFilters): Promise<{
    totalProducts: number;
    activeProducts: number;
    outOfStockProducts: number;
    topPerformingProducts: Array<{
      id: string;
      name: string;
      views: number;
      purchases: number;
      conversionRate: number;
      revenue: number;
    }>;
    categoryPerformance: Array<{
      category: string;
      products: number;
      revenue: number;
      growth: number;
    }>;
  }> {
    const response = await apiClient.get('/analytics/products', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch product analytics');
    }
    return response.data as {
      totalProducts: number;
      activeProducts: number;
      outOfStockProducts: number;
      topPerformingProducts: Array<{
        id: string;
        name: string;
        views: number;
        purchases: number;
        conversionRate: number;
        revenue: number;
      }>;
      categoryPerformance: Array<{
        category: string;
        products: number;
        revenue: number;
        growth: number;
      }>;
    };
  }

  // Get customer analytics
  static async getCustomerAnalytics(filters?: AnalyticsFilters): Promise<{
    totalCustomers: number;
    newCustomers: number;
    returningCustomers: number;
    averageOrderValue: number;
    customerLifetimeValue: number;
    topCustomers: Array<{
      id: string;
      name: string;
      totalOrders: number;
      totalSpent: number;
      lastOrderDate: string;
    }>;
    customerRetention: {
      rate: number;
      churnRate: number;
    };
  }> {
    const response = await apiClient.get('/analytics/customers', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch customer analytics');
    }
    return response.data as {
      totalCustomers: number;
      newCustomers: number;
      returningCustomers: number;
      averageOrderValue: number;
      customerLifetimeValue: number;
      topCustomers: Array<{
        id: string;
        name: string;
        totalOrders: number;
        totalSpent: number;
        lastOrderDate: string;
      }>;
      customerRetention: {
        rate: number;
        churnRate: number;
      };
    };
  }

  // Get sales funnel analytics
  static async getSalesFunnel(): Promise<{
    awareness: number;
    interest: number;
    consideration: number;
    purchase: number;
    conversionRates: {
      awarenessToInterest: number;
      interestToConsideration: number;
      considerationToPurchase: number;
      overall: number;
    };
  }> {
    const response = await apiClient.get('/analytics/sales-funnel');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch sales funnel analytics');
    }
    return response.data as {
      awareness: number;
      interest: number;
      consideration: number;
      purchase: number;
      conversionRates: {
        awarenessToInterest: number;
        interestToConsideration: number;
        considerationToPurchase: number;
        overall: number;
      };
    };
  }

  // Export analytics data
  static async exportAnalytics(
    type: 'users' | 'orders' | 'revenue' | 'products' | 'customers',
    format: 'csv' | 'excel' | 'pdf' = 'csv',
    filters?: AnalyticsFilters
  ): Promise<{
    downloadUrl: string;
    filename: string;
    expiresAt: string;
  }> {
    const response = await apiClient.get('/analytics/export', { type, format, ...filters });
    if (!response.success) {
      throw new Error(response.error || 'Failed to export analytics data');
    }
    return response.data as {
      downloadUrl: string;
      filename: string;
      expiresAt: string;
    };
  }

  // Get custom analytics report
  static async getCustomReport(config: {
    metrics: string[];
    dimensions: string[];
    filters?: AnalyticsFilters;
    groupBy?: string[];
  }): Promise<{
    data: Array<Record<string, any>>;
    summary: Record<string, number>;
    metadata: {
      totalRows: number;
      generatedAt: string;
      config: any;
    };
  }> {
    const response = await apiClient.post('/analytics/custom-report', config);
    if (!response.success) {
      throw new Error(response.error || 'Failed to generate custom report');
    }
    return response.data as {
      data: Array<Record<string, any>>;
      summary: Record<string, number>;
      metadata: {
        totalRows: number;
        generatedAt: string;
        config: any;
      };
    };
  }
}