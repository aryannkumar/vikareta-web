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
  ChevronRight,
  Search
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
    <section className="py-24 bg-gradient-to-br from-gray-50 via-orange-50/30 to-amber-50/20">
      <div className="container mx-auto px-6">
        {/* Enhanced Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-200/50 mb-6"
          >
            <motion.div
              className="w-2 h-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-orange-700 font-semibold text-sm">Explore Categories</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
          >
            {isAuthenticated ? 'Categories for You' : 'Browse Categories'}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            {isAuthenticated
              ? 'Discover products and services tailored to your business needs and preferences'
              : 'Find exactly what your business needs across our comprehensive category collection'
            }
          </motion.p>
        </div>

        {/* Homepage-Style Category Showcase */}
        <div className="max-w-7xl mx-auto">
          {displayCategories.length > 0 && (
            <>
              {/* Featured Categories - Enhanced Horizontal Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                {displayCategories.slice(0, 2).map((category, index) => {
                  const colors = getCategoryColor(category);

                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ y: -8 }}
                      className="group"
                    >
                      <Link
                        href={`/categories/${category.slug}`}
                        className="block"
                        onClick={() => handleCategoryClick(category.id, category.slug)}
                      >
                        <div className={`
                          relative bg-white rounded-3xl p-8 h-56 shadow-lg hover:shadow-2xl
                          border ${colors.border} ${colors.hover} transition-all duration-300
                          overflow-hidden
                        `}>
                          {/* Background Pattern */}
                          <div className={`absolute inset-0 opacity-5 bg-gradient-to-br ${colors.bg}`}></div>

                          <div className="relative flex items-center h-full">
                            <div className={`
                              w-24 h-24 rounded-3xl bg-gradient-to-br ${colors.bg}
                              flex items-center justify-center mr-8 transition-all duration-300
                              group-hover:scale-110 group-hover:rotate-3 shadow-lg
                            `}>
                              <IconBackground
                                category={category}
                                size={48}
                                className="bg-transparent"
                                iconClassName={`${colors.icon}`}
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-3xl font-bold text-gray-900 mb-3 transition-colors group-hover:text-orange-600">
                                {category.name}
                              </h3>
                              <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                                {category.description || 'Explore quality products and services in this category'}
                              </p>
                              {category.productCount && (
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <Package className="h-4 w-4" />
                                    <span>{category.productCount.toLocaleString()} products</span>
                                  </div>
                                  {category.supplierCount && (
                                    <>
                                      <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                      <div className="flex items-center gap-1 text-sm text-gray-500">
                                        <Users className="h-4 w-4" />
                                        <span>{category.supplierCount} suppliers</span>
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                            <motion.div
                              className="ml-6"
                              whileHover={{ x: 4 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronRight className="w-8 h-8 text-gray-400 transition-colors group-hover:text-orange-500" />
                            </motion.div>
                          </div>

                          {/* Enhanced preference indicators */}
                          <div className="absolute top-6 right-6 flex gap-2">
                            {category.isPreferred && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg"
                              >
                                <Heart className="w-4 h-4 text-white fill-current" />
                              </motion.div>
                            )}
                            {category.isTrending && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.1 }}
                                className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg"
                              >
                                <TrendingUp className="w-4 h-4 text-white" />
                              </motion.div>
                            )}
                          </div>

                          {/* Hover effect overlay */}
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Remaining Categories - Enhanced Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {displayCategories.slice(2).map((category, index) => {
                  const colors = getCategoryColor(category);

                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      whileHover={{ y: -6, scale: 1.02 }}
                      className="group"
                    >
                      <Link
                        href={`/categories/${category.slug}`}
                        className="block"
                        onClick={() => handleCategoryClick(category.id, category.slug)}
                      >
                        <div className={`
                          relative bg-white rounded-2xl p-6 h-40 shadow-lg hover:shadow-xl
                          border ${colors.border} ${colors.hover} transition-all duration-300
                          overflow-hidden
                        `}>
                          {/* Background Pattern */}
                          <div className={`absolute inset-0 opacity-5 bg-gradient-to-br ${colors.bg}`}></div>

                          <div className="relative flex flex-col items-center justify-center h-full text-center">
                            <motion.div
                              className={`
                                w-16 h-16 rounded-2xl bg-gradient-to-br ${colors.bg}
                                flex items-center justify-center mb-4 transition-all duration-300
                                group-hover:scale-110 group-hover:rotate-6 shadow-lg
                              `}
                              whileHover={{ rotate: 12 }}
                            >
                              <IconBackground
                                category={category}
                                size={32}
                                className="bg-transparent"
                                iconClassName={`${colors.icon}`}
                              />
                            </motion.div>
                            <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-orange-600 line-clamp-2 leading-tight">
                              {category.name}
                            </h3>
                            {category.productCount && (
                              <p className="text-xs text-gray-500 mt-2">
                                {category.productCount.toLocaleString()} items
                              </p>
                            )}
                          </div>

                          {/* Enhanced indicators */}
                          <div className="absolute top-3 right-3 flex gap-1">
                            {category.isPreferred && (
                              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-sm"></div>
                            )}
                            {category.isTrending && (
                              <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-full shadow-sm"></div>
                            )}
                          </div>

                          {/* Hover effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Enhanced CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-20"
        >
          <div className="bg-gradient-to-r from-white via-orange-50/50 to-amber-50/50 rounded-3xl p-12 shadow-lg border border-orange-100/50">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Can't find what you're looking for?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Explore our complete collection of categories and discover new opportunities for your business procurement needs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/categories">
                <motion.button
                  className="group relative bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-10 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 text-lg overflow-hidden"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-3">
                    <Target className="h-6 w-6" />
                    <span>Explore All Categories</span>
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </motion.button>
              </Link>

              <Link href="/search">
                <motion.button
                  className="group border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-10 py-4 rounded-2xl font-bold transition-all duration-300 text-lg"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <Search className="h-6 w-6" />
                    <span>Advanced Search</span>
                  </div>
                </motion.button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-orange-200/50">
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  500+
                </div>
                <div className="text-sm text-gray-600 mt-1">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  50K+
                </div>
                <div className="text-sm text-gray-600 mt-1">Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  10K+
                </div>
                <div className="text-sm text-gray-600 mt-1">Suppliers</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}