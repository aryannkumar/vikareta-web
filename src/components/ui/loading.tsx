import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  variant?: 'default' | 'premium';
  className?: string;
}

export function Loading({ 
  fullScreen = false, 
  size = 'md', 
  message, 
  variant = 'default',
  className 
}: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const spinnerVariants = {
    default: 'loading-spinner',
    premium: 'loading-premium',
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50'
    : 'flex items-center justify-center p-4';

  return (
    <div className={cn(containerClasses, className)}>
      <div className="text-center">
        <div
          className={cn(
            spinnerVariants[variant],
            sizeClasses[size],
            'mx-auto'
          )}
        />
        {message && (
          <p className="mt-3 text-sm text-muted-foreground animate-fade-in">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div
      className={cn(
        'loading-spinner',
        sizeClasses[size],
        className
      )}
    />
  );
}