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
        return <Package className="h-12 w-12 text-orange-400" />;
      case 'service':
        return <Users className="h-12 w-12 text-orange-400" />;
      case 'business':
      case 'provider':
        return <Store className="h-12 w-12 text-orange-400" />;
      default:
        return <Package className="h-12 w-12 text-orange-400" />;
    }
  };

  return (
    <div 
      className={`bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {getIcon()}
    </div>
  );
}