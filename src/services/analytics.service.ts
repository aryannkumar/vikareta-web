import { vikaretaSSOClient } from '../lib/auth/vikareta';

// Normalize API host: remove trailing /api if present; always prefix endpoints with /api/v1
const API_HOST = (
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://api.vikareta.com')
).replace(/\/api$/, '').replace(/\/api\/v1$/, '');
const apiUrl = (path: string) => `${API_HOST}/api/v1${path}`;

export interface PlatformAnalytics {
  summary: {
    totalUsers: number;
    newUsers: number;
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalServices: number;
    averageOrderValue: number;
  };
  usersByType: Array<{
    type: string;
    count: number;
  }>;
  ordersByStatus: Array<{
    status: string;
    count: number;
    revenue: number;
  }>;
  revenueByCategory: Array<{
    category: string;
    revenue: number;
    itemsSold: number;
  }>;
  topCategories: Array<{
    id: string;
    name: string;
    productCount: number;
  }>;
  searchAnalytics: {
    topSearches: Array<{
      query: string;
      searchCount: number;
    }>;
    searchTrends: any[];
    totalSearches: number;
  };
  timeframe: string;
  generatedAt: string;
}

export interface UserAnalytics {
  summary: {
    totalOrders: number;
    totalSpent: number;
    totalProducts: number;
    totalServices: number;
    averageOrderValue: number;
  };
  recentActivity: Array<{
    id: string;
    orderNumber: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    items: Array<{
      product?: { title: string };
      service?: { title: string };
      quantity: number;
    }>;
  }>;
  ordersByStatus: Array<{
    status: string;
    count: number;
  }>;
  spendingTrend: Array<{
    date: string;
    amount: number;
    orders: number;
  }>;
  timeframe: string;
  generatedAt: string;
}

export interface BusinessAnalytics {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalServices: number;
    averageOrderValue: number;
  };
  topProducts: Array<{
    id: string;
    title: string;
    quantity: number;
    revenue: number;
    orders: number;
  }>;
  topServices: Array<{
    id: string;
    title: string;
    quantity: number;
    revenue: number;
    orders: number;
  }>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
  ordersByStatus: Array<{
    status: string;
    count: number;
    revenue: number;
  }>;
  customerAnalytics: {
    totalCustomers: number;
    newCustomers: number;
    repeatCustomers: number;
    repeatRate: number;
  };
  timeframe: string;
  generatedAt: string;
}

export interface ProductAnalytics {
  summary: {
    totalProducts: number;
    activeProducts: number;
    inactiveProducts: number;
    totalViews: number;
    totalInquiries: number;
    averagePrice: number;
  };
  productsByCategory: Array<{
    category: string;
    count: number;
    revenue: number;
  }>;
  topProducts: Array<{
    id: string;
    title: string;
    views: number;
    inquiries: number;
    orders: number;
    revenue: number;
  }>;
  priceDistribution: Array<{
    range: string;
    count: number;
  }>;
  performanceMetrics: {
    conversionRate: number;
    averageTimeToSell: number;
    returnRate: number;
  };
}

export interface ServiceAnalytics {
  summary: {
    totalServices: number;
    activeServices: number;
    inactiveServices: number;
    totalBookings: number;
    totalRevenue: number;
    averagePrice: number;
  };
  servicesByCategory: Array<{
    category: string;
    count: number;
    bookings: number;
    revenue: number;
  }>;
  topServices: Array<{
    id: string;
    title: string;
    bookings: number;
    revenue: number;
    rating: number;
  }>;
  bookingTrends: Array<{
    date: string;
    bookings: number;
    revenue: number;
  }>;
  servicePerformance: {
    completionRate: number;
    averageRating: number;
    customerSatisfaction: number;
  };
}

export interface BusinessMetrics {
  summary: {
    totalBusinesses: number;
    verifiedBusinesses: number;
    activeBusinesses: number;
    totalRevenue: number;
  };
  businessesByType: Array<{
    type: string;
    count: number;
    revenue: number;
  }>;
  topBusinesses: Array<{
    id: string;
    name: string;
    revenue: number;
    orders: number;
    rating: number;
  }>;
  businessGrowth: Array<{
    date: string;
    newBusinesses: number;
    activeBusinesses: number;
  }>;
  verificationStats: {
    verifiedPercentage: number;
    pendingVerification: number;
    rejectedVerification: number;
  };
}

export interface RFQAnalytics {
  summary: {
    totalRFQs: number;
    activeRFQs: number;
    completedRFQs: number;
    totalQuotes: number;
    averageQuotesPerRFQ: number;
  };
  rfqsByCategory: Array<{
    category: string;
    count: number;
    quotes: number;
    conversionRate: number;
  }>;
  rfqTrends: Array<{
    date: string;
    created: number;
    completed: number;
  }>;
  quoteAnalytics: {
    averageResponseTime: number;
    quoteAcceptanceRate: number;
    averageQuoteValue: number;
  };
  buyerSellerMetrics: {
    totalBuyers: number;
    totalSellers: number;
    averageRFQsPerBuyer: number;
    averageQuotesPerSeller: number;
  };
}

export interface RealTimeMetrics {
  activeUsers: number;
  recentOrders: number;
  recentEvents: Array<{
    type: string;
    userId: string;
    data: any;
    timestamp: string;
  }>;
  timestamp: string;
}

export class AnalyticsService {
  private static instance: AnalyticsService;

  private constructor() {}

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = (typeof window !== 'undefined') ? vikaretaSSOClient.getAccessToken() : null;
    if (token) headers['Authorization'] = `Bearer ${token}`;

    return headers;
  }

  async getPlatformAnalytics(timeframe: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<PlatformAnalytics> {
    try {
      const response = await fetch(apiUrl(`/analytics/dashboard?timeframe=${timeframe}`), {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch platform analytics');
      }

      const result = await response.json();
      return result.data.platform;
    } catch (error) {
      console.error('Error fetching platform analytics:', error);
      throw error;
    }
  }

  async getUserAnalytics(userId: string, timeframe: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<UserAnalytics> {
    try {
      const response = await fetch(apiUrl(`/analytics/users?userId=${userId}&timeframe=${timeframe}`), {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch user analytics');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching user analytics:', error);
      throw error;
    }
  }

  async getBusinessAnalytics(userId: string, timeframe: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<BusinessAnalytics> {
    try {
      const response = await fetch(apiUrl(`/analytics/business?userId=${userId}&timeframe=${timeframe}`), {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch business analytics');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching business analytics:', error);
      throw error;
    }
  }

  async getOrderAnalytics(timeframe: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<any> {
    try {
      const response = await fetch(apiUrl(`/analytics/orders?timeframe=${timeframe}`), {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch order analytics');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching order analytics:', error);
      throw error;
    }
  }

  async getRevenueAnalytics(timeframe: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<any> {
    try {
      const response = await fetch(apiUrl(`/analytics/revenue?timeframe=${timeframe}`), {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch revenue analytics');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      throw error;
    }
  }

  async getProductAnalytics(timeframe: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<ProductAnalytics> {
    try {
      const response = await fetch(apiUrl(`/analytics/products?timeframe=${timeframe}`), {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        // If endpoint doesn't exist, return mock data structure
        return this.getMockProductAnalytics();
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching product analytics:', error);
      return this.getMockProductAnalytics();
    }
  }

  async getServiceAnalytics(timeframe: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<ServiceAnalytics> {
    try {
      const response = await fetch(apiUrl(`/analytics/services?timeframe=${timeframe}`), {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        // If endpoint doesn't exist, return mock data structure
        return this.getMockServiceAnalytics();
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching service analytics:', error);
      return this.getMockServiceAnalytics();
    }
  }

  async getBusinessMetrics(timeframe: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<BusinessMetrics> {
    try {
      const response = await fetch(apiUrl(`/analytics/businesses?timeframe=${timeframe}`), {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        // If endpoint doesn't exist, return mock data structure
        return this.getMockBusinessMetrics();
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching business metrics:', error);
      return this.getMockBusinessMetrics();
    }
  }

  async getRFQAnalytics(timeframe: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<RFQAnalytics> {
    try {
      const response = await fetch(apiUrl(`/analytics/rfqs?timeframe=${timeframe}`), {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        // If endpoint doesn't exist, return mock data structure
        return this.getMockRFQAnalytics();
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching RFQ analytics:', error);
      return this.getMockRFQAnalytics();
    }
  }

  async getRealTimeMetrics(): Promise<RealTimeMetrics> {
    try {
      const response = await fetch(apiUrl('/analytics/realtime'), {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch real-time metrics');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching real-time metrics:', error);
      return {
        activeUsers: 0,
        recentOrders: 0,
        recentEvents: [],
        timestamp: new Date().toISOString()
      };
    }
  }

  // Mock data methods for when backend endpoints don't exist yet
  private getMockProductAnalytics(): ProductAnalytics {
    return {
      summary: {
        totalProducts: 1250,
        activeProducts: 1180,
        inactiveProducts: 70,
        totalViews: 45680,
        totalInquiries: 2340,
        averagePrice: 2500
      },
      productsByCategory: [
        { category: 'Electronics', count: 320, revenue: 850000 },
        { category: 'Machinery', count: 280, revenue: 1250000 },
        { category: 'Textiles', count: 195, revenue: 450000 },
        { category: 'Chemicals', count: 150, revenue: 320000 },
        { category: 'Food & Beverages', count: 305, revenue: 680000 }
      ],
      topProducts: [
        { id: '1', title: 'Industrial Pump', views: 1250, inquiries: 45, orders: 12, revenue: 156000 },
        { id: '2', title: 'Cotton Fabric', views: 980, inquiries: 38, orders: 25, revenue: 87500 },
        { id: '3', title: 'Chemical Solvent', views: 875, inquiries: 29, orders: 18, revenue: 67500 }
      ],
      priceDistribution: [
        { range: '₹0-₹500', count: 450 },
        { range: '₹501-₹2000', count: 380 },
        { range: '₹2001-₹10000', count: 295 },
        { range: '₹10001+', count: 125 }
      ],
      performanceMetrics: {
        conversionRate: 8.5,
        averageTimeToSell: 15,
        returnRate: 2.3
      }
    };
  }

  private getMockServiceAnalytics(): ServiceAnalytics {
    return {
      summary: {
        totalServices: 890,
        activeServices: 845,
        inactiveServices: 45,
        totalBookings: 3240,
        totalRevenue: 1250000,
        averagePrice: 385
      },
      servicesByCategory: [
        { category: 'Consulting', count: 245, bookings: 890, revenue: 425000 },
        { category: 'Maintenance', count: 198, bookings: 756, revenue: 312000 },
        { category: 'Installation', count: 156, bookings: 623, revenue: 289000 },
        { category: 'Training', count: 134, bookings: 512, revenue: 156000 },
        { category: 'Design', count: 157, bookings: 459, revenue: 78000 }
      ],
      topServices: [
        { id: '1', title: 'IT Consulting', bookings: 145, revenue: 72500, rating: 4.8 },
        { id: '2', title: 'Equipment Maintenance', bookings: 98, revenue: 39200, rating: 4.6 },
        { id: '3', title: 'Software Installation', bookings: 87, revenue: 34800, rating: 4.7 }
      ],
      bookingTrends: [
        { date: '2024-01', bookings: 280, revenue: 98000 },
        { date: '2024-02', bookings: 320, revenue: 112000 },
        { date: '2024-03', bookings: 295, revenue: 103250 }
      ],
      servicePerformance: {
        completionRate: 94.5,
        averageRating: 4.6,
        customerSatisfaction: 92.3
      }
    };
  }

  private getMockBusinessMetrics(): BusinessMetrics {
    return {
      summary: {
        totalBusinesses: 1250,
        verifiedBusinesses: 980,
        activeBusinesses: 1150,
        totalRevenue: 25000000
      },
      businessesByType: [
        { type: 'Manufacturer', count: 450, revenue: 12500000 },
        { type: 'Distributor', count: 380, revenue: 8500000 },
        { type: 'Service Provider', count: 295, revenue: 3200000 },
        { type: 'Retailer', count: 125, revenue: 800000 }
      ],
      topBusinesses: [
        { id: '1', name: 'Tech Solutions Ltd', revenue: 2500000, orders: 450, rating: 4.8 },
        { id: '2', name: 'Industrial Supplies Co', revenue: 1850000, orders: 320, rating: 4.7 },
        { id: '3', name: 'Global Manufacturing', revenue: 1650000, orders: 280, rating: 4.6 }
      ],
      businessGrowth: [
        { date: '2024-01', newBusinesses: 45, activeBusinesses: 1100 },
        { date: '2024-02', newBusinesses: 52, activeBusinesses: 1125 },
        { date: '2024-03', newBusinesses: 38, activeBusinesses: 1145 }
      ],
      verificationStats: {
        verifiedPercentage: 78.4,
        pendingVerification: 85,
        rejectedVerification: 23
      }
    };
  }

  private getMockRFQAnalytics(): RFQAnalytics {
    return {
      summary: {
        totalRFQs: 2150,
        activeRFQs: 480,
        completedRFQs: 1420,
        totalQuotes: 8900,
        averageQuotesPerRFQ: 4.1
      },
      rfqsByCategory: [
        { category: 'Electronics', count: 380, quotes: 1520, conversionRate: 35.2 },
        { category: 'Machinery', count: 295, quotes: 1180, conversionRate: 42.1 },
        { category: 'Textiles', count: 245, quotes: 980, conversionRate: 28.7 },
        { category: 'Chemicals', count: 180, quotes: 720, conversionRate: 31.8 }
      ],
      rfqTrends: [
        { date: '2024-01', created: 180, completed: 145 },
        { date: '2024-02', created: 220, completed: 165 },
        { date: '2024-03', created: 195, completed: 152 }
      ],
      quoteAnalytics: {
        averageResponseTime: 4.2,
        quoteAcceptanceRate: 23.5,
        averageQuoteValue: 12500
      },
      buyerSellerMetrics: {
        totalBuyers: 890,
        totalSellers: 650,
        averageRFQsPerBuyer: 2.4,
        averageQuotesPerSeller: 13.7
      }
    };
  }
}

export const analyticsService = AnalyticsService.getInstance();