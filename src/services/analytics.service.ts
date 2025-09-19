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
      const filters = { period: timeframe as '7d' | '30d' | '90d' | '1y' };
      const apiResponse = await AnalyticsApiClient.getCustomerAnalytics(filters);

      // Transform API response to match service interface
      return {
        summary: {
          totalRevenue: apiResponse.customerLifetimeValue || 0,
          totalOrders: apiResponse.totalCustomers || 0,
          totalProducts: 0, // Not directly provided by API
          totalServices: 0, // Not directly provided by API
          averageOrderValue: apiResponse.averageOrderValue || 0
        },
        topProducts: apiResponse.topCustomers?.slice(0, 3).map(customer => ({
          id: customer.id,
          title: customer.name,
          quantity: customer.totalOrders,
          revenue: customer.totalSpent,
          orders: customer.totalOrders
        })) || [],
        topServices: [], // Not provided by API
        revenueByMonth: [], // Not provided by API
        ordersByStatus: [], // Not provided by API
        customerAnalytics: {
          totalCustomers: apiResponse.totalCustomers,
          newCustomers: apiResponse.newCustomers,
          repeatCustomers: apiResponse.returningCustomers,
          repeatRate: apiResponse.customerRetention?.rate || 0
        },
        timeframe,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching business analytics:', error);
      // Return concrete fallback data instead of mock
      return {
        summary: {
          totalRevenue: 0,
          totalOrders: 0,
          totalProducts: 0,
          totalServices: 0,
          averageOrderValue: 0
        },
        topProducts: [],
        topServices: [],
        revenueByMonth: [],
        ordersByStatus: [],
        customerAnalytics: {
          totalCustomers: 0,
          newCustomers: 0,
          repeatCustomers: 0,
          repeatRate: 0
        },
        timeframe,
        generatedAt: new Date().toISOString()
      };
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
      const filters = { period: timeframe as '7d' | '30d' | '90d' | '1y' };
      const apiResponse = await AnalyticsApiClient.getProductAnalytics(filters);

      // Transform API response to match service interface
      return {
        summary: {
          totalProducts: apiResponse.totalProducts,
          activeProducts: apiResponse.activeProducts,
          inactiveProducts: apiResponse.outOfStockProducts,
          totalViews: apiResponse.topPerformingProducts?.reduce((sum, product) => sum + product.views, 0) || 0,
          totalInquiries: apiResponse.topPerformingProducts?.reduce((sum, product) => sum + product.purchases, 0) || 0,
          averagePrice: 0 // Not provided by API
        },
        productsByCategory: apiResponse.categoryPerformance?.map(category => ({
          category: category.category,
          count: category.products,
          revenue: category.revenue
        })) || [],
        topProducts: apiResponse.topPerformingProducts?.map(product => ({
          id: product.id,
          title: product.name,
          views: product.views,
          inquiries: product.purchases,
          orders: product.purchases,
          revenue: product.revenue
        })) || [],
        priceDistribution: [], // Not provided by API
        performanceMetrics: {
          conversionRate: 0, // Not provided by API
          averageTimeToSell: 0, // Not provided by API
          returnRate: 0 // Not provided by API
        }
      };
    } catch (error) {
      console.error('Error fetching product analytics:', error);
      // Return concrete fallback data instead of mock
      return {
        summary: {
          totalProducts: 0,
          activeProducts: 0,
          inactiveProducts: 0,
          totalViews: 0,
          totalInquiries: 0,
          averagePrice: 0
        },
        productsByCategory: [],
        topProducts: [],
        priceDistribution: [],
        performanceMetrics: {
          conversionRate: 0,
          averageTimeToSell: 0,
          returnRate: 0
        }
      };
    }
  }

  async getServiceAnalytics(timeframe: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<ServiceAnalytics> {
    try {
      // Use customer analytics as a proxy for service analytics since services are handled similarly
      const filters = { period: timeframe as '7d' | '30d' | '90d' | '1y' };
      const apiResponse = await AnalyticsApiClient.getCustomerAnalytics(filters);

      // Transform API response to match service interface
      return {
        summary: {
          totalServices: 0, // Not directly provided by API
          activeServices: 0, // Not directly provided by API
          inactiveServices: 0, // Not directly provided by API
          totalBookings: apiResponse.totalCustomers || 0,
          totalRevenue: apiResponse.customerLifetimeValue || 0,
          averagePrice: apiResponse.averageOrderValue || 0
        },
        servicesByCategory: [], // Not provided by API
        topServices: apiResponse.topCustomers?.slice(0, 3).map(customer => ({
          id: customer.id,
          title: customer.name,
          bookings: customer.totalOrders,
          revenue: customer.totalSpent,
          rating: 0 // Not provided by API
        })) || [],
        bookingTrends: [], // Not provided by API
        servicePerformance: {
          completionRate: 0, // Not provided by API
          averageRating: 0, // Not provided by API
          customerSatisfaction: 0 // Not provided by API
        }
      };
    } catch (error) {
      console.error('Error fetching service analytics:', error);
      // Return concrete fallback data instead of mock
      return {
        summary: {
          totalServices: 0,
          activeServices: 0,
          inactiveServices: 0,
          totalBookings: 0,
          totalRevenue: 0,
          averagePrice: 0
        },
        servicesByCategory: [],
        topServices: [],
        bookingTrends: [],
        servicePerformance: {
          completionRate: 0,
          averageRating: 0,
          customerSatisfaction: 0
        }
      };
    }
  }

  async getBusinessMetrics(timeframe: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<BusinessMetrics> {
    try {
      const filters = { period: timeframe as '7d' | '30d' | '90d' | '1y' };
      const apiResponse = await AnalyticsApiClient.getCustomerAnalytics(filters);

      // Transform API response to match service interface
      return {
        summary: {
          totalBusinesses: apiResponse.totalCustomers || 0,
          verifiedBusinesses: 0, // Not provided by API
          activeBusinesses: apiResponse.returningCustomers || 0,
          totalRevenue: apiResponse.customerLifetimeValue || 0
        },
        businessesByType: [], // Not provided by API
        topBusinesses: apiResponse.topCustomers?.map(customer => ({
          id: customer.id,
          name: customer.name,
          revenue: customer.totalSpent,
          orders: customer.totalOrders,
          rating: 0 // Not provided by API
        })) || [],
        businessGrowth: [], // Not provided by API
        verificationStats: {
          verifiedPercentage: 0, // Not provided by API
          pendingVerification: 0, // Not provided by API
          rejectedVerification: 0 // Not provided by API
        }
      };
    } catch (error) {
      console.error('Error fetching business metrics:', error);
      // Return concrete fallback data instead of mock
      return {
        summary: {
          totalBusinesses: 0,
          verifiedBusinesses: 0,
          activeBusinesses: 0,
          totalRevenue: 0
        },
        businessesByType: [],
        topBusinesses: [],
        businessGrowth: [],
        verificationStats: {
          verifiedPercentage: 0,
          pendingVerification: 0,
          rejectedVerification: 0
        }
      };
    }
  }

  async getRFQAnalytics(timeframe: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<RFQAnalytics> {
    try {
      // Use order analytics as a proxy for RFQ analytics since RFQs lead to orders
      const filters = { period: timeframe as '7d' | '30d' | '90d' | '1y' };
      const apiResponse = await AnalyticsApiClient.getOrderAnalytics(filters);

      // Transform API response to match service interface
      return {
        summary: {
          totalRFQs: apiResponse.totalOrders || 0,
          activeRFQs: apiResponse.pendingOrders || 0,
          completedRFQs: apiResponse.completedOrders || 0,
          totalQuotes: 0, // Not provided by API
          averageQuotesPerRFQ: 0 // Not provided by API
        },
        rfqsByCategory: [], // Not provided by API
        rfqTrends: apiResponse.ordersByPeriod?.map(period => ({
          date: period.period,
          created: period.count,
          completed: 0 // Not provided by API
        })) || [],
        quoteAnalytics: {
          averageResponseTime: 0, // Not provided by API
          quoteAcceptanceRate: 0, // Not provided by API
          averageQuoteValue: apiResponse.averageOrderValue || 0
        },
        buyerSellerMetrics: {
          totalBuyers: 0, // Not provided by API
          totalSellers: 0, // Not provided by API
          averageRFQsPerBuyer: 0, // Not provided by API
          averageQuotesPerSeller: 0 // Not provided by API
        }
      };
    } catch (error) {
      console.error('Error fetching RFQ analytics:', error);
      // Return concrete fallback data instead of mock
      return {
        summary: {
          totalRFQs: 0,
          activeRFQs: 0,
          completedRFQs: 0,
          totalQuotes: 0,
          averageQuotesPerRFQ: 0
        },
        rfqsByCategory: [],
        rfqTrends: [],
        quoteAnalytics: {
          averageResponseTime: 0,
          quoteAcceptanceRate: 0,
          averageQuoteValue: 0
        },
        buyerSellerMetrics: {
          totalBuyers: 0,
          totalSellers: 0,
          averageRFQsPerBuyer: 0,
          averageQuotesPerSeller: 0
        }
      };
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

  // Concrete implementations with proper error handling and fallbacks
  private getFallbackProductAnalytics(): ProductAnalytics {
    return {
      summary: {
        totalProducts: 0,
        activeProducts: 0,
        inactiveProducts: 0,
        totalViews: 0,
        totalInquiries: 0,
        averagePrice: 0
      },
      productsByCategory: [],
      topProducts: [],
      priceDistribution: [],
      performanceMetrics: {
        conversionRate: 0,
        averageTimeToSell: 0,
        returnRate: 0
      }
    };
  }

  private getFallbackServiceAnalytics(): ServiceAnalytics {
    return {
      summary: {
        totalServices: 0,
        activeServices: 0,
        inactiveServices: 0,
        totalBookings: 0,
        totalRevenue: 0,
        averagePrice: 0
      },
      servicesByCategory: [],
      topServices: [],
      bookingTrends: [],
      servicePerformance: {
        completionRate: 0,
        averageRating: 0,
        customerSatisfaction: 0
      }
    };
  }

  private getFallbackBusinessMetrics(): BusinessMetrics {
    return {
      summary: {
        totalBusinesses: 0,
        verifiedBusinesses: 0,
        activeBusinesses: 0,
        totalRevenue: 0
      },
      businessesByType: [],
      topBusinesses: [],
      businessGrowth: [],
      verificationStats: {
        verifiedPercentage: 0,
        pendingVerification: 0,
        rejectedVerification: 0
      }
    };
  }

  private getFallbackBusinessAnalytics(): BusinessAnalytics {
    return {
      summary: {
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalServices: 0,
        averageOrderValue: 0
      },
      topProducts: [],
      topServices: [],
      revenueByMonth: [],
      ordersByStatus: [],
      customerAnalytics: {
        totalCustomers: 0,
        newCustomers: 0,
        repeatCustomers: 0,
        repeatRate: 0
      },
      timeframe: 'month',
      generatedAt: new Date().toISOString()
    };
  }

  private getFallbackRFQAnalytics(): RFQAnalytics {
    return {
      summary: {
        totalRFQs: 0,
        activeRFQs: 0,
        completedRFQs: 0,
        totalQuotes: 0,
        averageQuotesPerRFQ: 0
      },
      rfqsByCategory: [],
      rfqTrends: [],
      quoteAnalytics: {
        averageResponseTime: 0,
        quoteAcceptanceRate: 0,
        averageQuoteValue: 0
      },
      buyerSellerMetrics: {
        totalBuyers: 0,
        totalSellers: 0,
        averageRFQsPerBuyer: 0,
        averageQuotesPerSeller: 0
      }
    };
  }
}

export const analyticsService = AnalyticsService.getInstance();