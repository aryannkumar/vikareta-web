import { vikaretaSSOClient } from '../lib/auth/vikareta';
import { apiClient } from '../lib/api/client';

// Normalize API host: remove trailing /api if present; always prefix endpoints with /api/v1
const API_HOST = (
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://api.vikareta.com')
).replace(/\/api$/, '').replace(/\/api\/v1$/, '');
const apiUrl = (path: string) => `${API_HOST}/api/v1${path}`;

export interface PlatformStats {
  successfulDeals: number;
  totalCategories: number;
  totalProducts: number;
  totalSuppliers: number;
  totalBuyers?: number;
  totalServices?: number;
  totalRFQs?: number;
  totalOrders?: number;
  totalRevenue?: number;
  activeUsers?: number;
}

export interface CategoryStats {
  id: string;
  name: string;
  productCount: number;
  serviceCount: number;
  rfqCount: number;
  orderCount: number;
  revenue: number;
  growth: number;
}

export interface MarketplaceStats {
  overview: {
    totalValue: number;
    totalTransactions: number;
    activeUsers: number;
    growthRate: number;
  };
  categories: CategoryStats[];
  trends: {
    daily: Array<{ date: string; value: number; transactions: number }>;
    weekly: Array<{ week: string; value: number; transactions: number }>;
    monthly: Array<{ month: string; value: number; transactions: number }>;
  };
  topPerformers: {
    categories: Array<{ name: string; revenue: number; growth: number }>;
    products: Array<{ name: string; sales: number; revenue: number }>;
    services: Array<{ name: string; bookings: number; revenue: number }>;
  };
}

export interface DashboardStats {
  platform: PlatformStats;
  marketplace: MarketplaceStats;
  recentActivity: Array<{
    type: 'order' | 'rfq' | 'user' | 'product';
    description: string;
    amount?: number;
    timestamp: string;
  }>;
  alerts: Array<{
    type: 'warning' | 'info' | 'success';
    message: string;
    timestamp: string;
  }>;
}

export class StatsService {
  private static instance: StatsService;

  private constructor() {}

  public static getInstance(): StatsService {
    if (!StatsService.instance) {
      StatsService.instance = new StatsService();
    }
    return StatsService.instance;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = (typeof window !== 'undefined') ? vikaretaSSOClient.getAccessToken() : null;
    if (token) headers['Authorization'] = `Bearer ${token}`;

    return headers;
  }

  async getPlatformStats(): Promise<PlatformStats> {
    try {
      const response = await apiClient.get<PlatformStats>('/stats');
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to fetch platform stats');
      }
    } catch (error) {
      console.error('Error fetching platform stats:', error);
      // Return concrete fallback data instead of mock
      return this.getFallbackPlatformStats();
    }
  }

  async getMarketplaceStats(timeframe: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<MarketplaceStats> {
    try {
      const response = await apiClient.get<MarketplaceStats>(`/stats/marketplace?timeframe=${timeframe}`);
      
      if (response.success) {
        return response.data;
      } else {
        // Return concrete fallback data instead of mock
        return this.getFallbackMarketplaceStats();
      }
    } catch (error) {
      console.error('Error fetching marketplace stats:', error);
      return this.getFallbackMarketplaceStats();
    }
  }

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await apiClient.get<DashboardStats>('/stats/dashboard');
      
      if (response.success) {
        return response.data;
      } else {
        // Return concrete fallback data instead of mock
        return this.getFallbackDashboardStats();
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return this.getFallbackDashboardStats();
    }
  }

  async getCategoryStats(): Promise<CategoryStats[]> {
    try {
      const response = await apiClient.get<CategoryStats[]>('/stats/categories');
      
      if (response.success) {
        return response.data;
      } else {
        // Return concrete fallback data instead of mock
        return this.getFallbackCategoryStats();
      }
    } catch (error) {
      console.error('Error fetching category stats:', error);
      return this.getFallbackCategoryStats();
    }
  }

  // Concrete fallback methods - return empty/zero values instead of mock data
  private getFallbackPlatformStats(): PlatformStats {
    return {
      successfulDeals: 0,
      totalCategories: 0,
      totalProducts: 0,
      totalSuppliers: 0,
      totalBuyers: 0,
      totalServices: 0,
      totalRFQs: 0,
      totalOrders: 0,
      totalRevenue: 0,
      activeUsers: 0
    };
  }

  private getFallbackMarketplaceStats(): MarketplaceStats {
    return {
      overview: {
        totalValue: 0,
        totalTransactions: 0,
        activeUsers: 0,
        growthRate: 0
      },
      categories: [],
      trends: {
        daily: [],
        weekly: [],
        monthly: []
      },
      topPerformers: {
        categories: [],
        products: [],
        services: []
      }
    };
  }

  private getFallbackDashboardStats(): DashboardStats {
    return {
      platform: this.getFallbackPlatformStats(),
      marketplace: this.getFallbackMarketplaceStats(),
      recentActivity: [],
      alerts: []
    };
  }

  private getFallbackCategoryStats(): CategoryStats[] {
    return [];
  }
}

export const statsService = StatsService.getInstance();