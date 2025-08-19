'use client';

import React from 'react';
import { Package, Users, Store } from 'lucide-react';

interface PlaceholderImageProps {
  type: 'product' | 'service' | 'business' | 'provider';
  className?: string;
  size?: number;
}

export function PlaceholderImage({ type, className = '', size = 200 }: PlaceholderImageProps) {
  const getIcon = () => {
    switch (type) {
      case 'product':
        return <Package className="h-12 w-12 text-blue-500" />;
      case 'service':
  return <Users className="h-12 w-12 text-blue-500" />;
      case 'business':
      case 'provider':
  return <Store className="h-12 w-12 text-blue-500" />;
      default:
  return <Package className="h-12 w-12 text-blue-500" />;
    }
  };

  return (
    <div 
      className={`bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-indigo-800/20 flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {getIcon()}
    </div>
  );
}