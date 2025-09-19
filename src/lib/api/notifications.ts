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
        throw new Error('Unread count endpoint not available');
    },

    async getPreferences() {
        throw new Error('Notification preferences endpoint not available');
    },

    async updatePreferences(preferences: Partial<NotificationPreferences>) {
        throw new Error('Update notification preferences endpoint not available');
    },

    async testNotification(type: string) {
        throw new Error('Test notification endpoint not available');
    }
};