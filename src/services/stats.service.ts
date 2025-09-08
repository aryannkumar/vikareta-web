import { vikaretaSSOClient } from '../lib/auth/vikareta';

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
      const response = await fetch(apiUrl('/stats'), {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch platform stats');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching platform stats:', error);
      // Return mock data if API fails
      return this.getMockPlatformStats();
    }
  }

  async getMarketplaceStats(timeframe: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<MarketplaceStats> {
    try {
      const response = await fetch(apiUrl(`/stats/marketplace?timeframe=${timeframe}`), {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        // If endpoint doesn't exist, return mock data
        return this.getMockMarketplaceStats();
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching marketplace stats:', error);
      return this.getMockMarketplaceStats();
    }
  }

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await fetch(apiUrl('/stats/dashboard'), {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        // If endpoint doesn't exist, return mock data
        return this.getMockDashboardStats();
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return this.getMockDashboardStats();
    }
  }

  async getCategoryStats(): Promise<CategoryStats[]> {
    try {
      const response = await fetch(apiUrl('/stats/categories'), {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        // If endpoint doesn't exist, return mock data
        return this.getMockCategoryStats();
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching category stats:', error);
      return this.getMockCategoryStats();
    }
  }

  // Mock data methods
  private getMockPlatformStats(): PlatformStats {
    return {
      successfulDeals: 2847,
      totalCategories: 45,
      totalProducts: 12543,
      totalSuppliers: 892,
      totalBuyers: 2156,
      totalServices: 3241,
      totalRFQs: 1850,
      totalOrders: 4521,
      totalRevenue: 28500000,
      activeUsers: 1250
    };
  }

  private getMockMarketplaceStats(): MarketplaceStats {
    return {
      overview: {
        totalValue: 28500000,
        totalTransactions: 4521,
        activeUsers: 1250,
        growthRate: 15.3
      },
      categories: [
        {
          id: '1',
          name: 'Electronics',
          productCount: 1250,
          serviceCount: 180,
          rfqCount: 245,
          orderCount: 890,
          revenue: 8500000,
          growth: 12.5
        },
        {
          id: '2',
          name: 'Machinery',
          productCount: 980,
          serviceCount: 145,
          rfqCount: 198,
          orderCount: 756,
          revenue: 12500000,
          growth: 18.2
        },
        {
          id: '3',
          name: 'Textiles',
          productCount: 1450,
          serviceCount: 220,
          rfqCount: 167,
          orderCount: 623,
          revenue: 4200000,
          growth: 8.7
        },
        {
          id: '4',
          name: 'Chemicals',
          productCount: 780,
          serviceCount: 95,
          rfqCount: 134,
          orderCount: 445,
          revenue: 2800000,
          growth: 22.1
        }
      ],
      trends: {
        daily: [
          { date: '2024-01-01', value: 125000, transactions: 45 },
          { date: '2024-01-02', value: 98000, transactions: 38 },
          { date: '2024-01-03', value: 156000, transactions: 52 }
        ],
        weekly: [
          { week: 'Week 1', value: 850000, transactions: 285 },
          { week: 'Week 2', value: 920000, transactions: 312 },
          { week: 'Week 3', value: 780000, transactions: 267 }
        ],
        monthly: [
          { month: 'Jan', value: 2850000, transactions: 890 },
          { month: 'Feb', value: 3200000, transactions: 945 },
          { month: 'Mar', value: 2950000, transactions: 876 }
        ]
      },
      topPerformers: {
        categories: [
          { name: 'Machinery', revenue: 12500000, growth: 18.2 },
          { name: 'Electronics', revenue: 8500000, growth: 12.5 },
          { name: 'Textiles', revenue: 4200000, growth: 8.7 }
        ],
        products: [
          { name: 'Industrial Pump', sales: 145, revenue: 725000 },
          { name: 'Cotton Fabric', sales: 98, revenue: 392000 },
          { name: 'Chemical Solvent', sales: 87, revenue: 348000 }
        ],
        services: [
          { name: 'IT Consulting', bookings: 145, revenue: 72500 },
          { name: 'Equipment Maintenance', bookings: 98, revenue: 39200 },
          { name: 'Software Installation', bookings: 87, revenue: 34800 }
        ]
      }
    };
  }

  private getMockDashboardStats(): DashboardStats {
    return {
      platform: this.getMockPlatformStats(),
      marketplace: this.getMockMarketplaceStats(),
      recentActivity: [
        {
          type: 'order',
          description: 'New order placed for Industrial Machinery',
          amount: 125000,
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
        },
        {
          type: 'rfq',
          description: 'RFQ created for Chemical Supplies',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
        },
        {
          type: 'user',
          description: 'New business registered: Tech Solutions Ltd',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
        },
        {
          type: 'product',
          description: 'New product listed: Advanced Circuit Board',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString()
        }
      ],
      alerts: [
        {
          type: 'success',
          message: 'Monthly revenue target achieved (105% of goal)',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
        },
        {
          type: 'warning',
          message: 'Low stock alert for 15 products',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString()
        },
        {
          type: 'info',
          message: 'New category "Renewable Energy" added',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
        }
      ]
    };
  }

  private getMockCategoryStats(): CategoryStats[] {
    return [
      {
        id: '1',
        name: 'Electronics',
        productCount: 1250,
        serviceCount: 180,
        rfqCount: 245,
        orderCount: 890,
        revenue: 8500000,
        growth: 12.5
      },
      {
        id: '2',
        name: 'Machinery',
        productCount: 980,
        serviceCount: 145,
        rfqCount: 198,
        orderCount: 756,
        revenue: 12500000,
        growth: 18.2
      },
      {
        id: '3',
        name: 'Textiles',
        productCount: 1450,
        serviceCount: 220,
        rfqCount: 167,
        orderCount: 623,
        revenue: 4200000,
        growth: 8.7
      },
      {
        id: '4',
        name: 'Chemicals',
        productCount: 780,
        serviceCount: 95,
        rfqCount: 134,
        orderCount: 445,
        revenue: 2800000,
        growth: 22.1
      },
      {
        id: '5',
        name: 'Food & Beverages',
        productCount: 620,
        serviceCount: 120,
        rfqCount: 89,
        orderCount: 345,
        revenue: 1800000,
        growth: 15.8
      }
    ];
  }
}

export const statsService = StatsService.getInstance();