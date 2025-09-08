import { apiClient } from '../lib/api/client';

export interface UsageLimits {
  rfq: {
    used: number;
    limit: number;
    remaining: number;
  };
  quotes: {
    used: number;
    limit: number;
    remaining: number;
  };
  month: string;
}

export interface UsageCheck {
  canPost?: boolean;
  canRespond?: boolean;
  remaining: number;
  limit: number;
}

export interface MonthlyUsageRecord {
  id: string;
  userId: string;
  month: string;
  rfqPostsCount: number;
  quoteResponsesCount: number;
  createdAt: string;
  updatedAt: string;
}

class UsageLimitsServiceClass {
  private readonly basePath = '/usage-limits';

    /**
   * Get current user's usage summary
   */
  async getUsageSummary(): Promise<UsageLimits> {
    const response = await apiClient.get<UsageLimits>(`${this.basePath}/summary`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get usage summary');
    }
    return response.data;
  }

  /**
   * Check if user can post an RFQ
   */
  async canPostRfq(): Promise<UsageCheck> {
    const response = await apiClient.get<UsageCheck>(`${this.basePath}/rfq/can-post`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to check RFQ posting eligibility');
    }
    return response.data;
  }

  /**
   * Check if user can respond to an RFQ
   */
  async canRespondToRfq(): Promise<UsageCheck> {
    const response = await apiClient.get<UsageCheck>(`${this.basePath}/rfq/can-respond`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to check RFQ response eligibility');
    }
    return response.data;
  }

  /**
   * Get user's usage history
   */
  async getUsageHistory(months: number = 12): Promise<MonthlyUsageRecord[]> {
    const response = await apiClient.get<MonthlyUsageRecord[]>(`${this.basePath}/history`, { months });
    if (!response.success) {
      throw new Error(response.error || 'Failed to get usage history');
    }
    return response.data;
  }
}

export const UsageLimitsService = new UsageLimitsServiceClass();