'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  Package, 
  Users, 
  Heart, 
  Star,
  TrendingUp,
  Target,
  ChevronRight
} from 'lucide-react';
import { IconBackground } from '@/components/ui/dynamic-icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast-provider';
import { categoriesApi, type Category } from '@/lib/api/categories';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useVikaretaAuth } from '@/lib/auth/vikareta/hooks/use-vikareta-auth';

interface CategoryWithStats extends Omit<Category, 'productCount'> {
  productCount?: number;
  supplierCount?: number;
  relevanceScore?: number;
  isPreferred?: boolean;
  isTrending?: boolean;
  categoryColor?: {
    bg: string;
    icon: string;
    accent: string;
    border: string;
    hover: string;
  };
}

// Category-specific color mapping based on category names/slugs
const getCategoryColor = (category: any) => {
  const name = category.name?.toLowerCase() || category.slug?.toLowerCase() || '';
  
  if (name.includes('electronics') || name.includes('mobile') || name.includes('gadget')) {
    return {
      bg: 'from-blue-50 to-blue-100',
      icon: 'text-blue-600',
      accent: 'blue-500',
      border: 'border-blue-200',
      hover: 'hover:border-blue-300'
    };
  }
  if (name.includes('fashion') || name.includes('clothing') || name.includes('textile')) {
    return {
      bg: 'from-pink-50 to-pink-100',
      icon: 'text-pink-600',
      accent: 'pink-500',
      border: 'border-pink-200',
      hover: 'hover:border-pink-300'
    };
  }
  if (name.includes('food') || name.includes('grocery') || name.includes('kitchen')) {
    return {
      bg: 'from-green-50 to-green-100',
      icon: 'text-green-600',
      accent: 'green-500',
      border: 'border-green-200',
      hover: 'hover:border-green-300'
    };
  }
  if (name.includes('automotive') || name.includes('vehicle') || name.includes('car')) {
    return {
      bg: 'from-red-50 to-red-100',
      icon: 'text-red-600',
      accent: 'red-500',
      border: 'border-red-200',
      hover: 'hover:border-red-300'
    };
  }
  if (name.includes('home') || name.includes('furniture') || name.includes('appliance')) {
    return {
      bg: 'from-indigo-50 to-indigo-100',
      icon: 'text-indigo-600',
      accent: 'indigo-500',
      border: 'border-indigo-200',
      hover: 'hover:border-indigo-300'
    };
  }
  if (name.includes('health') || name.includes('medical') || name.includes('pharmacy')) {
    return {
      bg: 'from-teal-50 to-teal-100',
      icon: 'text-teal-600',
      accent: 'teal-500',
      border: 'border-teal-200',
      hover: 'hover:border-teal-300'
    };
  }
  if (name.includes('business') || name.includes('office') || name.includes('service')) {
    return {
      bg: 'from-purple-50 to-purple-100',
      icon: 'text-purple-600',
      accent: 'purple-500',
      border: 'border-purple-200',
      hover: 'hover:border-purple-300'
    };
  }
  
  // Default gray theme for unknown categories
  return {
    bg: 'from-gray-50 to-gray-100',
    icon: 'text-gray-600',
    accent: 'gray-500',
    border: 'border-gray-200',
    hover: 'hover:border-gray-300'
  };
};

export function CategoryGrid() {
  const { isAuthenticated, user } = useVikaretaAuth();
  const {
    personalizedCategories,
    trendingCategories,
    userPreferences,
    loading,
    error,
    trackCategoryInteraction,
    loadPersonalizedCategories,
    loadTrendingCategories,
  } = useUserPreferences();

  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [displayCategories, setDisplayCategories] = useState<CategoryWithStats[]>([]);
  const [fallbackLoading, setFallbackLoading] = useState(true);
  const toast = useToast();

  // Fetch all categories
  useEffect(() => {
    fetchAllCategories();
  }, []);

  // Process display categories - keep it simple
  useEffect(() => {
    if (allCategories.length > 0) {
      let categories: CategoryWithStats[] = allCategories.slice(0, 8).map(cat => ({ 
        ...cat,
        categoryColor: getCategoryColor(cat)
      })); // Show max 8 categories
      
      // Add user preference info if authenticated
      if (isAuthenticated && userPreferences) {
        categories = categories.map(cat => ({
          ...cat,
          isPreferred: userPreferences.preferredCategories?.includes(cat.id) || false,
          isTrending: trendingCategories.some(tc => tc.categoryId === cat.id),
        }));
        
        // Sort to show preferred categories first
        categories.sort((a, b) => {
          if (a.isPreferred && !b.isPreferred) return -1;
          if (!a.isPreferred && b.isPreferred) return 1;
          return 0;
        });
      }
      
      setDisplayCategories(categories);
    }
  }, [allCategories, isAuthenticated, userPreferences, trendingCategories]);

  const fetchAllCategories = async () => {
    try {
      setFallbackLoading(true);
      const response = await categoriesApi.getCategories();
      if (response.success) {
        setAllCategories(response.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      toast.error('Error', 'Failed to load categories');
    } finally {
      setFallbackLoading(false);
    }
  };

  const handleCategoryClick = async (categoryId: string, categorySlug: string) => {
    try {
      await trackCategoryInteraction(categoryId, 'click');
    } catch (error) {
      console.error('Failed to track category click:', error);
    }
  };

  const isLoading = loading.categories || fallbackLoading;

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explore Categories
            </h2>
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading categories...</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-xl h-32 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error && displayCategories.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load categories</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button 
              onClick={() => {
                loadPersonalizedCategories();
                loadTrendingCategories();
                fetchAllCategories();
              }} 
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        {/* Simple Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {isAuthenticated ? 'Categories for You' : 'Browse Categories'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {isAuthenticated
              ? 'Discover products and services based on your interests'
              : 'Find exactly what your business needs across various categories'
            }
          </p>
        </div>

        {/* Homepage-Style Category Showcase */}
        <div className="max-w-5xl mx-auto">
          {displayCategories.length > 0 && (
            <>
              {/* Featured Categories - Horizontal Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {displayCategories.slice(0, 2).map((category, index) => {
                  const colors = getCategoryColor(category);
                  
                  return (
                    <div
                      key={category.id}
                      className="group"
                    >
                      <Link
                        href={`/categories/${category.slug}`}
                        className="block"
                        onClick={() => handleCategoryClick(category.id, category.slug)}
                      >
                        <div className={`
                          relative bg-white rounded-2xl p-8 h-48 shadow-sm
                          border ${colors.border} ${colors.hover} transition-all duration-200 
                          group-hover:shadow-md
                        `}>
                          <div className="flex items-center h-full">
                            <div className={`
                              w-20 h-20 rounded-2xl bg-gradient-to-br ${colors.bg} 
                              flex items-center justify-center mr-6 transition-transform duration-200
                            `}>
                              <IconBackground
                                category={category}
                                size={40}
                                className="bg-transparent"
                                iconClassName={`${colors.icon}`}
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-2xl font-bold text-gray-900 mb-2 transition-colors">
                                {category.name}
                              </h3>
                              <p className="text-gray-600 mb-3 line-clamp-2">
                                {category.description || 'Explore quality products and services'}
                              </p>
                              {category.productCount && (
                                <p className="text-sm text-gray-500">
                                  {category.productCount.toLocaleString()} products available
                                </p>
                              )}
                            </div>
                            <ChevronRight className="w-6 h-6 text-gray-400 transition-colors duration-200" />
                          </div>

                          {/* Simple preference indicator */}
                          {category.isPreferred && (
                            <div className="absolute top-4 right-4">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* Remaining Categories - Clean Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {displayCategories.slice(2).map((category, index) => {
                  const colors = getCategoryColor(category);
                  
                  return (
                    <div
                      key={category.id}
                      className="group"
                    >
                      <Link
                        href={`/categories/${category.slug}`}
                        className="block"
                        onClick={() => handleCategoryClick(category.id, category.slug)}
                      >
                        <div className={`
                          relative bg-white rounded-xl p-4 h-28 shadow-sm
                          border ${colors.border} ${colors.hover} transition-all duration-200 
                          group-hover:shadow-md
                        `}>
                          <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className={`
                              w-12 h-12 rounded-lg bg-gradient-to-br ${colors.bg} 
                              flex items-center justify-center mb-2 transition-transform duration-200
                            `}>
                              <IconBackground
                                category={category}
                                size={24}
                                className="bg-transparent"
                                iconClassName={`${colors.icon}`}
                              />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-900 transition-colors line-clamp-2">
                              {category.name}
                            </h3>
                          </div>

                          {/* Simple indicators */}
                          <div className="absolute top-2 right-2 flex gap-1">
                            {category.isPreferred && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                            {category.isTrending && (
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Simple CTA */}
        <div className="text-center mt-16">
          <Link href="/categories">
            <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
              Explore All Categories
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}