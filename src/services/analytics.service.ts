import { AnalyticsService as AnalyticsApiClient } from '../lib/api/analytics';
import { vikaretaSSOClient } from '../lib/auth/vikareta';
import { getApiUrl } from '../config/api';

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
      const filters = { period: timeframe as '7d' | '30d' | '90d' | '1y' };
      const apiResponse = await AnalyticsApiClient.getDashboardStats(filters);

      // Transform API response to match service interface
      return {
        summary: {
          totalUsers: apiResponse.totalUsers,
          newUsers: apiResponse.newUsersToday,
          totalOrders: apiResponse.totalOrders,
          totalRevenue: apiResponse.totalRevenue,
          totalProducts: 0, // Not provided by API
          totalServices: 0, // Not provided by API
          averageOrderValue: apiResponse.averageOrderValue
        },
        usersByType: [], // Not provided by API
        ordersByStatus: [
          { status: 'completed', count: apiResponse.completedOrders, revenue: 0 },
          { status: 'pending', count: apiResponse.pendingOrders, revenue: 0 }
        ],
        revenueByCategory: [], // Not provided by API
        topCategories: [], // Not provided by API
        searchAnalytics: {
          topSearches: [],
          searchTrends: [],
          totalSearches: 0
        },
        timeframe,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching platform analytics:', error);
      throw error;
    }
  }

  async getUserAnalytics(userId: string, timeframe: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<UserAnalytics> {
    try {
      const filters = { period: timeframe as '7d' | '30d' | '90d' | '1y' };
      const apiResponse = await AnalyticsApiClient.getUserAnalytics(filters);

      // Transform API response to match service interface
      return {
        summary: {
          totalOrders: 0, // Not provided by API
          totalSpent: 0, // Not provided by API
          totalProducts: 0, // Not provided by API
          totalServices: 0, // Not provided by API
          averageOrderValue: 0 // Not provided by API
        },
        recentActivity: [], // Not provided by API
        ordersByStatus: [], // Not provided by API
        spendingTrend: [], // Not provided by API
        timeframe,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching user analytics:', error);
      throw error;
    }
  }

  async getBusinessAnalytics(userId: string, timeframe: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<BusinessAnalytics> {
    try {
      // For now, return mock data since the API client doesn't have this specific method
      // TODO: Replace with actual API client call when backend endpoint is available
      return this.getMockBusinessAnalytics();
    } catch (error) {
      console.error('Error fetching business analytics:', error);
      return this.getMockBusinessAnalytics();
    }
  }

  async getOrderAnalytics(timeframe: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<any> {
    try {
      const filters = { period: timeframe as '7d' | '30d' | '90d' | '1y' };
      return await AnalyticsApiClient.getOrderAnalytics(filters);
    } catch (error) {
      console.error('Error fetching order analytics:', error);
      throw error;
    }
  }

  async getRevenueAnalytics(timeframe: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<any> {
    try {
      const filters = { period: timeframe as '7d' | '30d' | '90d' | '1y' };
      return await AnalyticsApiClient.getRevenueAnalytics(filters);
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      throw error;
    }
  }

  async getProductAnalytics(timeframe: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<ProductAnalytics> {
    try {
      const baseUrl = await getApiUrl();
      const response = await fetch(`${baseUrl}/analytics/products?timeframe=${timeframe}`, {
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
      const baseUrl = await getApiUrl();
      const response = await fetch(`${baseUrl}/analytics/services?timeframe=${timeframe}`, {
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
      const baseUrl = await getApiUrl();
      const response = await fetch(`${baseUrl}/analytics/businesses?timeframe=${timeframe}`, {
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
      const baseUrl = await getApiUrl();
      const response = await fetch(`${baseUrl}/analytics/rfqs?timeframe=${timeframe}`, {
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
      const apiResponse = await AnalyticsApiClient.getRealTimeMetrics();
      return {
        activeUsers: apiResponse.activeUsers,
        recentOrders: apiResponse.pendingOrders, // Map pending orders to recent orders
        recentEvents: [], // API doesn't provide events, so return empty array
        timestamp: new Date().toISOString()
      };
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

  private getMockBusinessAnalytics(): BusinessAnalytics {
    return {
      summary: {
        totalRevenue: 2500000,
        totalOrders: 450,
        totalProducts: 125,
        totalServices: 25,
        averageOrderValue: 5556
      },
      topProducts: [
        { id: '1', title: 'Industrial Pump', quantity: 12, revenue: 156000, orders: 12 },
        { id: '2', title: 'Cotton Fabric', quantity: 25, revenue: 87500, orders: 25 },
        { id: '3', title: 'Chemical Solvent', quantity: 18, revenue: 67500, orders: 18 }
      ],
      topServices: [
        { id: '1', title: 'Equipment Maintenance', quantity: 8, revenue: 32000, orders: 8 },
        { id: '2', title: 'Technical Consulting', quantity: 5, revenue: 25000, orders: 5 },
        { id: '3', title: 'Installation Service', quantity: 3, revenue: 15000, orders: 3 }
      ],
      revenueByMonth: [
        { month: '2024-01', revenue: 180000, orders: 32 },
        { month: '2024-02', revenue: 220000, orders: 38 },
        { month: '2024-03', revenue: 195000, orders: 35 },
        { month: '2024-04', revenue: 210000, orders: 37 },
        { month: '2024-05', revenue: 235000, orders: 42 },
        { month: '2024-06', revenue: 250000, orders: 45 }
      ],
      ordersByStatus: [
        { status: 'completed', count: 420, revenue: 2330000 },
        { status: 'pending', count: 18, revenue: 100000 },
        { status: 'cancelled', count: 12, revenue: 67000 }
      ],
      customerAnalytics: {
        totalCustomers: 180,
        newCustomers: 25,
        repeatCustomers: 155,
        repeatRate: 86.1
      },
      timeframe: 'month',
      generatedAt: new Date().toISOString()
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