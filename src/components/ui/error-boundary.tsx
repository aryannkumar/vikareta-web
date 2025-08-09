'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './button';

interface ErrorBoundaryProps {
  error?: string;
  onRetry?: () => void;
  title?: string;
  description?: string;
  showRetry?: boolean;
}

export function ErrorBoundary({ 
  error, 
  onRetry, 
  title = 'Something went wrong',
  description = 'We encountered an error while loading this content.',
  showRetry = true 
}: ErrorBoundaryProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="h-8 w-8 text-red-500" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
        {error || description}
      </p>
      
      {showRetry && onRetry && (
        <Button onClick={onRetry} className="btn-primary flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
}