'use client';

import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
  type?: 'card' | 'list' | 'text';
}

export function LoadingSkeleton({ className = '', count = 1, type = 'card' }: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`animate-pulse bg-white dark:bg-gray-800 rounded-lg border shadow-sm ${className}`}>
            <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-t-lg"></div>
            <div className="p-4 space-y-3">
              <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4"></div>
              <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-1/2"></div>
              <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-full"></div>
              <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-2/3"></div>
              <div className="flex gap-2 pt-2">
                <div className="bg-gray-200 dark:bg-gray-700 h-8 rounded flex-1"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-8 rounded w-16"></div>
              </div>
            </div>
          </div>
        );
      
      case 'list':
        return (
          <div className={`animate-pulse bg-white dark:bg-gray-800 rounded-lg border shadow-sm p-6 flex gap-6 ${className}`}>
            <div className="bg-gray-200 dark:bg-gray-700 h-32 w-32 rounded-lg flex-shrink-0"></div>
            <div className="flex-1 space-y-3">
              <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4"></div>
              <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-1/2"></div>
              <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-full"></div>
              <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-2/3"></div>
              <div className="flex gap-2 pt-2">
                <div className="bg-gray-200 dark:bg-gray-700 h-8 rounded flex-1"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-8 rounded w-16"></div>
              </div>
            </div>
          </div>
        );
      
      case 'text':
        return (
          <div className={`animate-pulse space-y-2 ${className}`}>
            <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-full"></div>
            <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4"></div>
            <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-1/2"></div>
          </div>
        );
      
      default:
        return (
          <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}></div>
        );
    }
  };

  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>
          {renderSkeleton()}
        </div>
      ))}
    </>
  );
}