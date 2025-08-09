'use client';

import { create } from 'zustand';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

interface AppState {
  theme: 'light' | 'dark' | 'system';
  isOnline: boolean;
  notifications: Notification[];
  userLocation: {
    latitude: number;
    longitude: number;
  } | null;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setOnlineStatus: (isOnline: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  setUserLocation: (location: { latitude: number; longitude: number }) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  theme: 'system',
  isOnline: true,
  notifications: [],
  userLocation: null,

  setTheme: (theme) => {
    set({ theme });
  },

  setOnlineStatus: (isOnline) => {
    set({ isOnline });
  },

  addNotification: (notification) => {
    const id = Date.now().toString();
    const newNotification = { ...notification, id };
    
    set({
      notifications: [...get().notifications, newNotification]
    });

    // Auto remove after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, notification.duration || 5000);
    }
  },

  removeNotification: (id) => {
    set({
      notifications: get().notifications.filter(n => n.id !== id)
    });
  },

  setUserLocation: (location) => {
    set({ userLocation: location });
  },
}));