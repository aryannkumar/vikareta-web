import { apiClient } from './client';

export interface Advertisement {
  id: string;
  title: string;
  description: string;
  image: string;
  targetUrl: string;
  advertiserId: string;
  advertiserName: string;
  campaignId: string;
  campaignName: string;
  type: 'banner' | 'sidebar' | 'popup' | 'video';
  position: 'header' | 'sidebar' | 'footer' | 'content' | 'popup';
  status: 'active' | 'inactive' | 'pending' | 'rejected' | 'expired';
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  cpm: number;
  targetAudience: {
    ageRange?: [number, number];
    gender?: 'male' | 'female' | 'all';
    location?: string[];
    interests?: string[];
    userType?: 'buyer' | 'seller' | 'all';
  };
  createdAt: string;
  updatedAt: string;
}

export interface AdCampaign {
  id: string;
  name: string;
  description: string;
  advertiserId: string;
  advertiserName: string;
  status: 'active' | 'inactive' | 'pending' | 'completed';
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  targetImpressions?: number;
  actualImpressions: number;
  targetClicks?: number;
  actualClicks: number;
  ads: Advertisement[];
  createdAt: string;
  updatedAt: string;
}

export interface AdAnalytics {
  campaignId: string;
  period: string;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  cpm: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  roi: number;
  dailyStats: Array<{
    date: string;
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
  }>;
}

export interface CreateAdData {
  title: string;
  description: string;
  image: string;
  targetUrl: string;
  campaignId: string;
  type: Advertisement['type'];
  position: Advertisement['position'];
  startDate: string;
  endDate: string;
  budget: number;
  targetAudience?: Advertisement['targetAudience'];
}

export interface CreateCampaignData {
  name: string;
  description: string;
  budget: number;
  startDate: string;
  endDate: string;
  targetImpressions?: number;
  targetClicks?: number;
}

export interface AdPlacement {
  id: string;
  name: string;
  description: string;
  type: 'banner' | 'sidebar' | 'popup' | 'video' | 'native';
  position: 'header' | 'sidebar' | 'footer' | 'content' | 'popup' | 'mobile';
  dimensions: {
    width: number;
    height: number;
  };
  isActive: boolean;
  maxAds: number;
  rotationType: 'random' | 'weighted' | 'sequential';
  targetCriteria?: {
    userType?: string[];
    location?: string[];
    deviceType?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface AdAssignment {
  id: string;
  advertisementId: string;
  placementId: string;
  priority: number;
  weight: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  impressions: number;
  clicks: number;
  ctr: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdApproval {
  id: string;
  advertisementId: string;
  reviewerId: string;
  reviewerName: string;
  status: 'pending' | 'approved' | 'rejected' | 'requires_changes';
  reviewNotes?: string;
  changesRequested?: string[];
  reviewedAt: string;
  createdAt: string;
}

export interface AdImpression {
  id: string;
  advertisementId: string;
  placementId?: string;
  userId?: string;
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  referrer?: string;
  location?: {
    country: string;
    region: string;
    city: string;
  };
  deviceType: string;
  browser: string;
  os: string;
  timestamp: string;
}

export interface AdClick {
  id: string;
  advertisementId: string;
  placementId?: string;
  impressionId?: string;
  userId?: string;
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  referrer?: string;
  location?: {
    country: string;
    region: string;
    city: string;
  };
  deviceType: string;
  browser: string;
  os: string;
  timestamp: string;
}

export const adsApi = {
  // Advertisement Management
  async getAds(filters?: {
    status?: string;
    type?: string;
    position?: string;
    campaignId?: string;
    advertiserId?: string;
    page?: number;
    limit?: number;
  }) {
    return apiClient.get<{
      ads: Advertisement[];
      total: number;
      page: number;
      totalPages: number;
    }>('/ads', filters);
  },

  async getAd(adId: string) {
    return apiClient.get<Advertisement>(`/ads/${adId}`);
  },

  async createAd(data: CreateAdData) {
    return apiClient.post<Advertisement>('/ads', data);
  },

  async updateAd(adId: string, data: Partial<CreateAdData>) {
    return apiClient.put<Advertisement>(`/ads/${adId}`, data);
  },

  async deleteAd(adId: string) {
    return apiClient.delete(`/ads/${adId}`);
  },

  async pauseAd(adId: string) {
    return apiClient.post(`/ads/${adId}/pause`);
  },

  async resumeAd(adId: string) {
    return apiClient.post(`/ads/${adId}/resume`);
  },

  async uploadAdImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    return apiClient.upload<{ imageUrl: string }>('/ads/upload-image', formData);
  },

  // Campaign Management
  async getCampaigns(filters?: {
    status?: string;
    advertiserId?: string;
    page?: number;
    limit?: number;
  }) {
    return apiClient.get<{
      campaigns: AdCampaign[];
      total: number;
      page: number;
      totalPages: number;
    }>('/ads/campaigns', filters);
  },

  async getCampaign(campaignId: string) {
    return apiClient.get<AdCampaign>(`/ads/campaigns/${campaignId}`);
  },

  async createCampaign(data: CreateCampaignData) {
    return apiClient.post<AdCampaign>('/ads/campaigns', data);
  },

  async updateCampaign(campaignId: string, data: Partial<CreateCampaignData>) {
    return apiClient.put<AdCampaign>(`/ads/campaigns/${campaignId}`, data);
  },

  async deleteCampaign(campaignId: string) {
    return apiClient.delete(`/ads/campaigns/${campaignId}`);
  },

  async pauseCampaign(campaignId: string) {
    return apiClient.post(`/ads/campaigns/${campaignId}/pause`);
  },

  async resumeCampaign(campaignId: string) {
    return apiClient.post(`/ads/campaigns/${campaignId}/resume`);
  },

  // Analytics
  async getAdAnalytics(adId: string, period?: string) {
    return apiClient.get<AdAnalytics>(`/ads/${adId}/analytics`, { period });
  },

  async getCampaignAnalytics(campaignId: string, period?: string) {
    return apiClient.get<AdAnalytics>(`/ads/campaigns/${campaignId}/analytics`, { period });
  },

  async getAdsAnalytics(period?: string, limit?: number) {
    return apiClient.get<{
      totalAds: number;
      activeAds: number;
      totalImpressions: number;
      totalClicks: number;
      totalRevenue: number;
      topPerformingAds: Advertisement[];
      campaignPerformance: Array<{
        campaignId: string;
        campaignName: string;
        impressions: number;
        clicks: number;
        revenue: number;
      }>;
    }>('/ads/analytics', { period, limit });
  },

  // Targeting
  async getTargetingOptions() {
    return apiClient.get<{
      ageRanges: Array<[number, number]>;
      genders: string[];
      locations: Array<{ id: string; name: string }>;
      interests: string[];
      userTypes: string[];
    }>('/ads/targeting-options');
  },

  // Billing & Payments
  async getAdBillingHistory(adId: string) {
    return apiClient.get(`/ads/${adId}/billing`);
  },

  async getCampaignBillingHistory(campaignId: string) {
    return apiClient.get(`/ads/campaigns/${campaignId}/billing`);
  },

  async processAdPayment(adId: string, amount: number, paymentMethod: string) {
    return apiClient.post(`/ads/${adId}/payment`, { amount, paymentMethod });
  },

  // Advertiser Management
  async getAdvertisers(filters?: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    return apiClient.get<{
      advertisers: Array<{
        id: string;
        name: string;
        email: string;
        company: string;
        status: string;
        totalSpent: number;
        activeCampaigns: number;
        createdAt: string;
      }>;
      total: number;
      page: number;
      totalPages: number;
    }>('/ads/advertisers', filters);
  },

  async getAdvertiser(advertiserId: string) {
    return apiClient.get(`/ads/advertisers/${advertiserId}`);
  },

  async updateAdvertiserStatus(advertiserId: string, status: string) {
    return apiClient.put(`/ads/advertisers/${advertiserId}/status`, { status });
  },

  // Ad Serving
  async getAdForPosition(position: string, userContext?: any) {
    return apiClient.get<{
      ad: Advertisement | null;
      impressionId: string;
    }>(`/ads/serve/${position}`, userContext);
  },

  async trackAdImpression(impressionId: string, adId: string) {
    return apiClient.post(`/ads/track/impression`, { impressionId, adId });
  },

  async trackAdClick(impressionId: string, adId: string) {
    return apiClient.post(`/ads/track/click`, { impressionId, adId });
  },

  async trackAdConversion(impressionId: string, adId: string, conversionType: string, value?: number) {
    return apiClient.post(`/ads/track/conversion`, {
      impressionId,
      adId,
      conversionType,
      value
    });
  },

  // Placements Management
  async getPlacements(filters?: {
    active?: boolean;
    type?: string;
    position?: string;
    page?: number;
    limit?: number;
  }) {
    return apiClient.get<{
      placements: AdPlacement[];
      total: number;
      page: number;
      totalPages: number;
    }>('/ads/placements', filters);
  },

  async getPlacement(placementId: string) {
    return apiClient.get<AdPlacement>(`/ads/placements/${placementId}`);
  },

  async createPlacement(data: Omit<AdPlacement, 'id' | 'createdAt' | 'updatedAt'>) {
    return apiClient.post<AdPlacement>('/ads/placements', data);
  },

  async updatePlacement(placementId: string, data: Partial<AdPlacement>) {
    return apiClient.put<AdPlacement>(`/ads/placements/${placementId}`, data);
  },

  async deletePlacement(placementId: string) {
    return apiClient.delete(`/ads/placements/${placementId}`);
  },

  // Ad Assignments
  async assignAdToPlacement(advertisementId: string, placementId: string, data: {
    priority?: number;
    weight?: number;
    startDate?: string;
    endDate?: string;
  }) {
    return apiClient.post<AdAssignment>(`/ads/placements/${placementId}/assign`, {
      advertisementId,
      ...data
    });
  },

  async getPlacementAssignments(placementId: string) {
    return apiClient.get<AdAssignment[]>(`/ads/placements/${placementId}/assignments`);
  },

  async updateAdAssignment(assignmentId: string, data: Partial<AdAssignment>) {
    return apiClient.put<AdAssignment>(`/ads/assignments/${assignmentId}`, data);
  },

  async removeAdAssignment(assignmentId: string) {
    return apiClient.delete(`/ads/assignments/${assignmentId}`);
  },

  // Ad Approvals
  async submitAdForApproval(adId: string, notes?: string) {
    return apiClient.post<AdApproval>(`/ads/${adId}/submit-approval`, { notes });
  },

  async getAdApprovals(adId: string) {
    return apiClient.get<AdApproval[]>(`/ads/${adId}/approvals`);
  },

  async reviewAd(adId: string, data: {
    status: 'approved' | 'rejected' | 'requires_changes';
    reviewNotes?: string;
    changesRequested?: string[];
  }) {
    return apiClient.post<AdApproval>(`/ads/${adId}/review`, data);
  },

  async getPendingApprovals(filters?: {
    reviewerId?: string;
    page?: number;
    limit?: number;
  }) {
    return apiClient.get<{
      approvals: AdApproval[];
      total: number;
      page: number;
      totalPages: number;
    }>('/ads/approvals/pending', filters);
  },

  // Enhanced Analytics
  async getCampaignDailyAnalytics(campaignId: string, days?: number) {
    return apiClient.get<Array<{
      date: string;
      impressions: number;
      clicks: number;
      conversions: number;
      spend: number;
      ctr: number;
      cpc: number;
      cpm: number;
    }>>(`/ads/campaigns/${campaignId}/analytics/daily`, { days });
  },

  async getTopPerformingAds(metric?: 'ctr' | 'clicks' | 'impressions' | 'cpc', limit?: number) {
    return apiClient.get<Advertisement[]>(`/ads/analytics/top-ads`, { metric, limit });
  },

  async getAdImpressions(adId: string, filters?: {
    dateFrom?: string;
    dateTo?: string;
    deviceType?: string;
    country?: string;
    page?: number;
    limit?: number;
  }) {
    return apiClient.get<{
      impressions: AdImpression[];
      total: number;
      page: number;
      totalPages: number;
    }>(`/ads/${adId}/impressions`, filters);
  },

  async getAdClicks(adId: string, filters?: {
    dateFrom?: string;
    dateTo?: string;
    deviceType?: string;
    country?: string;
    page?: number;
    limit?: number;
  }) {
    return apiClient.get<{
      clicks: AdClick[];
      total: number;
      page: number;
      totalPages: number;
    }>(`/ads/${adId}/clicks`, filters);
  },

  // Real-time Ad Serving
  async recordImpression(adId: string, context?: {
    placementId?: string;
    userId?: string;
    sessionId?: string;
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
    location?: {
      country: string;
      region: string;
      city: string;
    };
  }) {
    return apiClient.post<{
      impressionId: string;
      recorded: boolean;
    }>(`/ads/${adId}/impression`, context);
  },

  async recordClick(adId: string, context?: {
    placementId?: string;
    impressionId?: string;
    userId?: string;
    sessionId?: string;
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
    location?: {
      country: string;
      region: string;
      city: string;
    };
  }) {
    return apiClient.post<{
      clickId: string;
      recorded: boolean;
    }>(`/ads/${adId}/click`, context);
  },

  // Ad Performance Reports
  async generateAdReport(adId: string, reportType: 'performance' | 'demographics' | 'geographic', period?: string) {
    return apiClient.get<{
      reportType: string;
      period: string;
      data: any;
      generatedAt: string;
    }>(`/ads/${adId}/report/${reportType}`, { period });
  },

  async generateCampaignReport(campaignId: string, reportType: 'performance' | 'ads' | 'audience', period?: string) {
    return apiClient.get<{
      reportType: string;
      period: string;
      data: any;
      generatedAt: string;
    }>(`/ads/campaigns/${campaignId}/report/${reportType}`, { period });
  },

  // Bulk Operations
  async bulkUpdateAdStatus(adIds: string[], status: Advertisement['status']) {
    return apiClient.post<{
      updated: number;
      failed: number;
      results: Array<{
        adId: string;
        success: boolean;
        error?: string;
      }>;
    }>('/ads/bulk/status', { adIds, status });
  },

  async bulkDeleteAds(adIds: string[]) {
    return apiClient.post<{
      deleted: number;
      failed: number;
      results: Array<{
        adId: string;
        success: boolean;
        error?: string;
      }>;
    }>('/ads/bulk/delete', { adIds });
  },

  // Ad Templates
  async getAdTemplates() {
    return apiClient.get<Array<{
      id: string;
      name: string;
      type: string;
      dimensions: {
        width: number;
        height: number;
      };
      preview: string;
      isActive: boolean;
    }>>('/ads/templates');
  },

  async createAdFromTemplate(templateId: string, data: Partial<CreateAdData>) {
    return apiClient.post<Advertisement>(`/ads/templates/${templateId}/create`, data);
  }
};