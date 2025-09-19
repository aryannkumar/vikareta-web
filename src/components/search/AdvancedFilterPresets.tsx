'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Crown,
  MapPin,
  Shield,
  Clock,
  TrendingUp,
  Building2,
  Zap,
  Star,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface FilterPreset {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  filters: {
    type?: 'product' | 'service' | 'provider';
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    rating?: number;
    verified?: boolean;
    sortBy?: string;
  };
  popular?: boolean;
}

interface AdvancedFilterPresetsProps {
  onApplyPreset: (preset: FilterPreset) => void;
  currentFilters: any;
}

export default function AdvancedFilterPresets({
  onApplyPreset,
  currentFilters
}: AdvancedFilterPresetsProps) {
  const filterPresets: FilterPreset[] = [
    {
      id: 'budget-friendly',
      name: 'Budget Friendly',
      description: 'Affordable options under ₹10,000',
      icon: DollarSign,
      color: 'bg-green-500',
      filters: {
        maxPrice: 10000,
        sortBy: 'price'
      }
    },
    {
      id: 'premium-enterprise',
      name: 'Premium Solutions',
      description: 'High-end enterprise solutions',
      icon: Crown,
      color: 'bg-purple-500',
      filters: {
        minPrice: 50000,
        verified: true,
        rating: 4.5,
        sortBy: 'rating'
      },
      popular: true
    },
    {
      id: 'local-suppliers',
      name: 'Local Suppliers',
      description: 'Businesses in your city',
      icon: MapPin,
      color: 'bg-blue-500',
      filters: {
        location: 'mumbai', // This would be dynamic based on user location
        verified: true
      }
    },
    {
      id: 'verified-only',
      name: 'Verified Only',
      description: 'Only show verified businesses',
      icon: Shield,
      color: 'bg-emerald-500',
      filters: {
        verified: true,
        sortBy: 'rating'
      },
      popular: true
    },
    {
      id: 'new-arrivals',
      name: 'New Arrivals',
      description: 'Recently added products & services',
      icon: Clock,
      color: 'bg-orange-500',
      filters: {
        sortBy: 'createdAt'
      }
    },
    {
      id: 'trending',
      name: 'Trending Now',
      description: 'Most popular items this week',
      icon: TrendingUp,
      color: 'bg-pink-500',
      filters: {
        rating: 4.0,
        sortBy: 'rating'
      }
    },
    {
      id: 'it-services',
      name: 'IT Services',
      description: 'Software development & IT solutions',
      icon: Zap,
      color: 'bg-indigo-500',
      filters: {
        type: 'service',
        category: 'IT Services'
      }
    },
    {
      id: 'manufacturing',
      name: 'Manufacturing',
      description: 'Industrial equipment & manufacturing',
      icon: Building2,
      color: 'bg-gray-600',
      filters: {
        type: 'product',
        category: 'Industrial Equipment'
      }
    },
    {
      id: 'top-rated',
      name: 'Top Rated',
      description: 'Highest rated products & services',
      icon: Star,
      color: 'bg-yellow-500',
      filters: {
        rating: 4.5,
        verified: true,
        sortBy: 'rating'
      },
      popular: true
    }
  ];

  const isPresetActive = (preset: FilterPreset) => {
    // Check if current filters match the preset
    const presetFilters = preset.filters;
    let matchCount = 0;
    let totalChecks = 0;

    Object.entries(presetFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        totalChecks++;
        if (currentFilters[key] === value) {
          matchCount++;
        }
      }
    });

    // Consider it active if 80% of filters match
    return totalChecks > 0 && (matchCount / totalChecks) >= 0.8;
  };

  const popularPresets = filterPresets.filter(preset => preset.popular);
  const allPresets = filterPresets;

  return (
    <div className="space-y-6">
      {/* Popular Presets */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Star className="h-5 w-5 text-yellow-500" />
          <h3 className="text-lg font-semibold">Popular Filters</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {popularPresets.map((preset, index) => {
            const Icon = preset.icon;
            const isActive = isPresetActive(preset);

            return (
              <motion.div
                key={preset.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Button
                  variant={isActive ? 'default' : 'outline'}
                  onClick={() => onApplyPreset(preset)}
                  className={`w-full h-auto p-4 flex flex-col items-start space-y-2 hover:shadow-md transition-all duration-200 ${
                    isActive ? 'ring-2 ring-primary ring-offset-2' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <div className={`p-2 rounded-lg ${preset.color} text-white`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-medium text-sm">{preset.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {preset.description}
                      </p>
                    </div>
                    {isActive && (
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    )}
                  </div>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* All Presets */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Building2 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">All Filter Presets</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {allPresets.map((preset, index) => {
            const Icon = preset.icon;
            const isActive = isPresetActive(preset);

            return (
              <motion.div
                key={preset.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Button
                  variant={isActive ? 'default' : 'outline'}
                  onClick={() => onApplyPreset(preset)}
                  className={`w-full h-auto p-4 flex flex-col items-start space-y-2 hover:shadow-md transition-all duration-200 ${
                    isActive ? 'ring-2 ring-primary ring-offset-2' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <div className={`p-2 rounded-lg ${preset.color} text-white`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-medium text-sm">{preset.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {preset.description}
                      </p>
                    </div>
                    {isActive && (
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    )}
                  </div>

                  {/* Filter Summary */}
                  <div className="flex flex-wrap gap-1 w-full">
                    {Object.entries(preset.filters).map(([key, value]) => {
                      if (value === undefined || value === null || value === '') return null;

                      let displayValue = '';
                      switch (key) {
                        case 'type':
                          displayValue = value as string;
                          break;
                        case 'minPrice':
                          displayValue = `₹${(value as number).toLocaleString()}+`;
                          break;
                        case 'maxPrice':
                          displayValue = `Up to ₹${(value as number).toLocaleString()}`;
                          break;
                        case 'rating':
                          displayValue = `${value}★+`;
                          break;
                        case 'verified':
                          displayValue = 'Verified';
                          break;
                        case 'category':
                          displayValue = value as string;
                          break;
                        default:
                          displayValue = String(value);
                      }

                      return (
                        <Badge
                          key={key}
                          variant="secondary"
                          className="text-xs px-2 py-0.5"
                        >
                          {displayValue}
                        </Badge>
                      );
                    })}
                  </div>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Custom Preset Info */}
      <div className="bg-muted/30 rounded-lg p-4 border">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-sm mb-1">Create Custom Presets</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Save your frequently used filter combinations as custom presets for quick access.
            </p>
            <Button variant="outline" size="sm" className="text-xs h-7">
              Save Current Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export utility functions for external use
export const filterPresetUtils = {
  getPresetById: (presets: FilterPreset[], id: string): FilterPreset | undefined => {
    return presets.find(preset => preset.id === id);
  },

  getPresetsByCategory: (presets: FilterPreset[], category: string): FilterPreset[] => {
    return presets.filter(preset => preset.filters.category === category);
  },

  getPopularPresets: (presets: FilterPreset[]): FilterPreset[] => {
    return presets.filter(preset => preset.popular);
  },

  applyPresetToFilters: (preset: FilterPreset, currentFilters: any): any => {
    return {
      ...currentFilters,
      ...preset.filters
    };
  }
};