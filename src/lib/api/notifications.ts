import { apiClient } from './client';

export interface Notification {
    id: string;
    type: 'order' | 'rfq' | 'message' | 'system' | 'promotion';
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
    data?: Record<string, any>;
    actionUrl?: string;
    priority: 'low' | 'medium' | 'high';
}

export interface NotificationPreferences {
    email: boolean;
    push: boolean;
    sms: boolean;
    orderUpdates: boolean;
    rfqResponses: boolean;
    messages: boolean;
    promotions: boolean;
    systemUpdates: boolean;
}

export const notificationsApi = {
    async getNotifications(params?: {
        page?: number;
        limit?: number;
        type?: string;
        unreadOnly?: boolean;
    }) {
        return apiClient.get<{
            notifications: Notification[];
            total: number;
            unreadCount: number;
            page: number;
            totalPages: number;
        }>('/notifications', params);
    },

    async markAsRead(notificationId: string) {
        return apiClient.patch(`/notifications/${notificationId}/read`);
    },

    async markAllAsRead() {
        return apiClient.patch('/notifications/mark-all-read');
    },

    async deleteNotification(notificationId: string) {
        return apiClient.delete(`/notifications/${notificationId}`);
    },

    async getUnreadCount() {
        return apiClient.get<{ count: number }>('/notifications/unread-count');
    },

    async getPreferences() {
        return apiClient.get<NotificationPreferences>('/notifications/preferences');
    },

    async updatePreferences(preferences: Partial<NotificationPreferences>) {
        return apiClient.put<NotificationPreferences>('/notifications/preferences', preferences);
    },

    async testNotification(type: string) {
        return apiClient.post('/notifications/test', { type });
    }
};