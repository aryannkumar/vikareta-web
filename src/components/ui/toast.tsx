'use client';

import React from 'react';
import { useAppStore } from '@/lib/stores/app';
import { cn } from '@/lib/utils';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export function ToastContainer() {
  const { notifications, removeNotification } = useAppStore();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}

interface ToastProps {
  notification: {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
  };
  onClose: () => void;
}

function Toast({ notification, onClose }: ToastProps) {
  const { type, title, message } = notification;

  const typeConfig = {
    success: {
      icon: CheckCircle,
      className: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200',
      iconClassName: 'text-green-500',
    },
    error: {
      icon: AlertCircle,
      className: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200',
      iconClassName: 'text-red-500',
    },
    warning: {
      icon: AlertTriangle,
      className: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200',
      iconClassName: 'text-yellow-500',
    },
    info: {
      icon: Info,
      className: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200',
      iconClassName: 'text-blue-500',
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'w-full border rounded-xl p-4 shadow-lg backdrop-blur-sm animate-slide-in-right',
        config.className
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn('h-5 w-5 mt-0.5 flex-shrink-0', config.iconClassName)} />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm">{title}</h4>
          <p className="mt-1 text-sm opacity-90 leading-relaxed">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-2 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          aria-label="Close notification"
        >
          <X className="h-4 w-4 opacity-60 hover:opacity-100" />
        </button>
      </div>
    </div>
  );
}

// Hook for easy toast usage
export function useToast() {
  const { addNotification } = useAppStore();

  const toast = {
    success: (title: string, message: string, duration?: number) =>
      addNotification({ type: 'success', title, message, duration }),
    error: (title: string, message: string, duration?: number) =>
      addNotification({ type: 'error', title, message, duration }),
    warning: (title: string, message: string, duration?: number) =>
      addNotification({ type: 'warning', title, message, duration }),
    info: (title: string, message: string, duration?: number) =>
      addNotification({ type: 'info', title, message, duration }),
  };

  return toast;
}

// Export toast function directly for compatibility
export const toast = {
  success: (title: string, message: string, duration?: number) => {
    const { addNotification } = useAppStore.getState();
    addNotification({ type: 'success', title, message, duration });
  },
  error: (title: string, message: string, duration?: number) => {
    const { addNotification } = useAppStore.getState();
    addNotification({ type: 'error', title, message, duration });
  },
  warning: (title: string, message: string, duration?: number) => {
    const { addNotification } = useAppStore.getState();
    addNotification({ type: 'warning', title, message, duration });
  },
  info: (title: string, message: string, duration?: number) => {
    const { addNotification } = useAppStore.getState();
    addNotification({ type: 'info', title, message, duration });
  },
};