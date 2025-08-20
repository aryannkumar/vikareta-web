import { apiClient } from './client';

export interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    orderUpdates: boolean;
    promotions: boolean;
    newsletter: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    showEmail: boolean;
    showPhone: boolean;
    allowMessages: boolean;
  };
  preferences: {
    language: string;
    currency: string;
    timezone: string;
    autoSave: boolean;
  };
}

export const settingsApi = {
  async getUserSettings() {
    return apiClient.get<UserSettings>('/user/settings');
  },

  async updateUserSettings(settings: Partial<UserSettings>) {
    return apiClient.put<UserSettings>('/user/settings', settings);
  },

  async resetUserSettings() {
    return apiClient.post<UserSettings>('/user/settings/reset');
  },

  async updateNotificationSettings(notifications: UserSettings['notifications']) {
    return apiClient.put<UserSettings['notifications']>('/user/settings/notifications', notifications);
  },

  async updatePrivacySettings(privacy: UserSettings['privacy']) {
    return apiClient.put<UserSettings['privacy']>('/user/settings/privacy', privacy);
  },

  async updatePreferences(preferences: UserSettings['preferences']) {
    return apiClient.put<UserSettings['preferences']>('/user/settings/preferences', preferences);
  }
};