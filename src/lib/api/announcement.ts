import { apiClient } from './client';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  targetAudience: 'all' | 'buyers' | 'sellers' | 'premium';
  scheduledAt?: string;
  publishedAt?: string;
  expiresAt?: string;
  viewCount: number;
  clickCount: number;
  authorId: string;
  author: {
    id: string;
    firstName?: string;
    lastName?: string;
    businessName?: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnnouncementData {
  title: string;
  content: string;
  type?: 'info' | 'warning' | 'success' | 'urgent';
  status?: 'draft' | 'published' | 'scheduled' | 'archived';
  targetAudience?: 'all' | 'buyers' | 'sellers' | 'premium';
  scheduledAt?: string;
  expiresAt?: string;
}

export interface UpdateAnnouncementData extends Partial<CreateAnnouncementData> {}

export interface AnnouncementFilters {
  status?: string;
  type?: string;
  targetAudience?: string;
  page?: number;
  limit?: number;
}

export class AnnouncementService {
  // Get all announcements
  static async getAnnouncements(filters?: AnnouncementFilters): Promise<{
    announcements: Announcement[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      announcements: Announcement[];
      total: number;
      page: number;
      totalPages: number;
    }>('/announcements', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch announcements');
    }
    return response.data;
  }

  // Get announcement by ID
  static async getAnnouncementById(id: string): Promise<Announcement> {
    const response = await apiClient.get<Announcement>(`/announcements/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch announcement');
    }
    return response.data;
  }

  // Create new announcement
  static async createAnnouncement(data: CreateAnnouncementData): Promise<Announcement> {
    const response = await apiClient.post<Announcement>('/announcements', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to create announcement');
    }
    return response.data;
  }

  // Update announcement
  static async updateAnnouncement(id: string, data: UpdateAnnouncementData): Promise<Announcement> {
    const response = await apiClient.put<Announcement>(`/announcements/${id}`, data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update announcement');
    }
    return response.data;
  }

  // Publish announcement
  static async publishAnnouncement(id: string): Promise<Announcement> {
    const response = await apiClient.post<Announcement>(`/announcements/${id}/publish`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to publish announcement');
    }
    return response.data;
  }

  // Archive announcement
  static async archiveAnnouncement(id: string): Promise<Announcement> {
    const response = await apiClient.post<Announcement>(`/announcements/${id}/archive`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to archive announcement');
    }
    return response.data;
  }

  // Delete announcement
  static async deleteAnnouncement(id: string): Promise<void> {
    const response = await apiClient.delete(`/announcements/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete announcement');
    }
  }

  // Mark announcement as viewed
  static async markAsViewed(id: string): Promise<void> {
    const response = await apiClient.post(`/announcements/${id}/view`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to mark announcement as viewed');
    }
  }

  // Mark announcement as clicked
  static async markAsClicked(id: string): Promise<void> {
    const response = await apiClient.post(`/announcements/${id}/click`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to mark announcement as clicked');
    }
  }

  // Get active announcements for current user
  static async getActiveAnnouncements(): Promise<Announcement[]> {
    const response = await apiClient.get<Announcement[]>('/announcements/active');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch active announcements');
    }
    return response.data;
  }

  // Get announcement statistics
  static async getAnnouncementStats(): Promise<{
    totalAnnouncements: number;
    publishedAnnouncements: number;
    draftAnnouncements: number;
    totalViews: number;
    totalClicks: number;
    clickThroughRate: number;
    announcementsByType: Record<string, number>;
    announcementsByAudience: Record<string, number>;
  }> {
    const response = await apiClient.get<{
      totalAnnouncements: number;
      publishedAnnouncements: number;
      draftAnnouncements: number;
      totalViews: number;
      totalClicks: number;
      clickThroughRate: number;
      announcementsByType: Record<string, number>;
      announcementsByAudience: Record<string, number>;
    }>('/announcements/stats');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch announcement stats');
    }
    return response.data;
  }
}