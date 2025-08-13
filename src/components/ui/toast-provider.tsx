'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
  startTime?: number;
}

interface ToastContextType {
  toasts: Toast[];
  success: (title: string, message?: string, duration?: number) => void;
  error: (title: string, message?: string, duration?: number) => void;
  info: (title: string, message?: string, duration?: number) => void;
  warning: (title: string, message?: string, duration?: number) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Add CSS animation for progress bar
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shrink {
        from { width: 100%; }
        to { width: 0%; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const duration = toast.duration || 5000;
    const newToast = { ...toast, id, startTime: Date.now(), duration };

    setToasts(prev => [...prev, newToast]);

    // Auto dismiss after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const success = useCallback((title: string, message?: string, duration?: number) => {
    addToast({ type: 'success', title, message, duration });
  }, [addToast]);

  const error = useCallback((title: string, message?: string, duration?: number) => {
    addToast({ type: 'error', title, message, duration });
  }, [addToast]);

  const info = useCallback((title: string, message?: string, duration?: number) => {
    addToast({ type: 'info', title, message, duration });
  }, [addToast]);

  const warning = useCallback((title: string, message?: string, duration?: number) => {
    addToast({ type: 'warning', title, message, duration });
  }, [addToast]);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getStyles = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'bg-white dark:bg-gray-800 border-l-4 border-l-green-500 shadow-md';
      case 'error':
        return 'bg-white dark:bg-gray-800 border-l-4 border-l-red-500 shadow-md';
      case 'warning':
        return 'bg-white dark:bg-gray-800 border-l-4 border-l-yellow-500 shadow-md';
      case 'info':
        return 'bg-white dark:bg-gray-800 border-l-4 border-l-blue-500 shadow-md';
    }
  };

  return (
    <ToastContext.Provider value={{ toasts, success, error, info, warning, dismiss }}>
      {children}

      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm space-y-3 pointer-events-none">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            className={`pointer-events-auto transform transition-all duration-300 ease-in-out ${index === toasts.length - 1 ? 'animate-in slide-in-from-right-full' : ''
              }`}
            style={{
              transform: `translateY(-${index * 4}px)`,
              zIndex: 50 - index,
            }}
          >
            <div className={`rounded-lg overflow-hidden ${getStyles(toast.type)}`}>
              <div className="p-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getIcon(toast.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {toast.title}
                    </p>
                    {toast.message && (
                      <p
                        className="mt-1 text-xs text-gray-600 dark:text-gray-300 leading-relaxed"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          wordBreak: 'break-word',
                        }}
                      >
                        {toast.message}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => dismiss(toast.id)}
                    className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
                    aria-label="Dismiss notification"
                  >
                    <X className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1 bg-gray-200 dark:bg-gray-700">
                <div
                  className={`h-full transition-all ease-linear ${toast.type === 'success' ? 'bg-green-500' :
                    toast.type === 'error' ? 'bg-red-500' :
                      toast.type === 'warning' ? 'bg-yellow-500' :
                        'bg-blue-500'
                    }`}
                  style={{
                    width: '100%',
                    animation: `shrink ${toast.duration || 5000}ms linear forwards`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}