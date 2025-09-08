'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, AlertCircle, TrendingUp, Package, Users, Heart, Star, Clock, Target } from 'lucide-react';
import { IconBackground } from '@/components/ui/dynamic-icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast-provider';
import { categoriesApi, type Category } from '@/lib/api/categories';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useVikaretaAuth } from '@/lib/auth/vikareta/hooks/use-vikareta-auth';

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

  const [fallbackCategories, setFallbackCategories] = useState<Category[]>([]);
  const [fallbackLoading, setFallbackLoading] = useState(true);
  const toast = useToast();

  // Load fallback categories if personalization fails
  useEffect(() => {
    if (error || (!loading.categories && personalizedCategories.length === 0)) {
      fetchFallbackCategories();
    }
  }, [error, loading.categories, personalizedCategories.length]);

  const fetchFallbackCategories = async () => {
    try {
      setFallbackLoading(true);
      const response = await categoriesApi.getCategories();
      if (response.success) {
        setFallbackCategories(response.data.slice(0, 6));
      }
    } catch (err) {
      console.error('Error fetching fallback categories:', err);
      toast.error('Error', 'Failed to load categories');
    } finally {
      setFallbackLoading(false);
    }
  };

  const handleCategoryClick = async (categoryId: string, categorySlug: string) => {
    try {
      await trackCategoryInteraction(categoryId, 'click');
    } catch (error) {
      // Don't block navigation if tracking fails
      console.error('Failed to track category click:', error);
    }
  };

  const handleCategoryView = async (categoryId: string) => {
    try {
      await trackCategoryInteraction(categoryId, 'view');
    } catch (error) {
      console.error('Failed to track category view:', error);
    }
  };

  // Use categories if available, otherwise use fallback
  const displayCategories = personalizedCategories.length > 0 ? personalizedCategories : fallbackCategories;
  const isLoading = loading.categories || fallbackLoading;

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {isAuthenticated ? 'Your Personalized Categories' : 'Business Categories'}
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {isAuthenticated
                ? 'Categories tailored to your business needs and preferences'
                : 'Explore our wide range of product categories from verified suppliers across India'
              }
            </motion.p>
          </div>

          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
            <span className="ml-3 text-gray-600 dark:text-gray-300">
              {isAuthenticated ? 'Loading your categories...' : 'Loading categories...'}
            </span>
          </div>
        </div>
      </section>
    );
  }

  if (error && displayCategories.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {isAuthenticated ? 'Your Personalized Categories' : 'Business Categories'}
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {isAuthenticated
                ? 'Categories tailored to your business needs and preferences'
                : 'Explore our wide range of product categories from verified suppliers across India'
              }
            </motion.p>
          </div>

          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
            <Button onClick={() => {
              loadPersonalizedCategories();
              loadTrendingCategories();
            }} className="btn-primary">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {isAuthenticated ? 'Your Personalized Categories' : 'Business Categories'}
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {isAuthenticated
              ? 'Categories tailored to your business needs and preferences'
              : 'Explore our wide range of product categories from verified suppliers across India'
            }
          </motion.p>

          {/* Personalization indicators */}
          {isAuthenticated && userPreferences && (
            <motion.div
              className="flex flex-wrap justify-center gap-4 mt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {userPreferences.preferredCategories.length > 0 && (
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1">
                  <Target className="w-3 h-3 mr-1" />
                  Based on your preferences
                </Badge>
              )}
              {trendingCategories.length > 0 && (
                <Badge className="bg-orange-100 text-orange-700 border-orange-200 px-3 py-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Trending now
                </Badge>
              )}
              <Badge className="bg-green-100 text-green-700 border-green-200 px-3 py-1">
                <Heart className="w-3 h-3 mr-1" />
                Curated for you
              </Badge>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayCategories.map((category: any, index: number) => {
            // Check if this is a trending category
            const isTrending = trendingCategories.some(tc => tc.categoryId === category.id);
            const isPreferred = userPreferences?.preferredCategories.includes(category.id);

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onViewportEnter={() => handleCategoryView(category.id)}
              >
                <Link
                  href={`/categories/${category.slug}`}
                  className="group block"
                  onClick={() => handleCategoryClick(category.id, category.slug)}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
                    <div className="relative h-56">
                      <IconBackground
                        category={category}
                        size={80}
                        className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 group-hover:from-orange-100 group-hover:to-amber-100 dark:group-hover:from-gray-700 dark:group-hover:to-gray-600 transition-all duration-500"
                        iconClassName="text-orange-600 dark:text-orange-400 group-hover:text-orange-700 group-hover:scale-110 transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                      {/* Dynamic tags with hover animation */}
                      {isTrending && (
                        <motion.div
                          className="absolute top-4 left-4 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <TrendingUp className="h-3 w-3" />
                          TRENDING
                        </motion.div>
                      )}

                      {isPreferred && (
                        <motion.div
                          className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        >
                          <Heart className="h-3 w-3" />
                          PREFERRED
                        </motion.div>
                      )}

                      <div className="absolute bottom-4 left-4 text-gray-800 dark:text-white">
                        <h3 className="font-bold text-xl mb-2 drop-shadow-sm group-hover:text-orange-600 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm opacity-90 line-clamp-2 drop-shadow-sm">
                          {category.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Package className="h-4 w-4 text-orange-500" />
                          <span className="font-semibold">{(category.productCount || 0).toLocaleString()} Products</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Users className="h-4 w-4 text-orange-600" />
                          <span className="font-semibold">{Math.floor((category.productCount || 0) / 10)} Suppliers</span>
                        </div>
                      </div>

                      {/* Category Stats */}
                      {isAuthenticated && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-gray-600 dark:text-gray-400">
                              {category.relevanceScore ? `${Math.round(category.relevanceScore * 100)}% match` : 'Recommended for you'}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Animated subcategories with dynamic tags */}
                      {category.subcategories && category.subcategories.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {category.subcategories.slice(0, 3).map((sub: any, subIndex: number) => (
                              <motion.div
                                key={sub.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: subIndex * 0.1, duration: 0.3 }}
                                whileHover={{ scale: 1.05 }}
                              >
                                <Badge variant="outline" className="text-xs hover:bg-orange-50 hover:border-orange-300 transition-colors">
                                  {sub.name}
                                </Badge>
                              </motion.div>
                            ))}
                            {category.subcategories.length > 3 && (
                              <Badge variant="outline" className="text-xs bg-orange-50 text-orange-600 border-orange-200">
                                +{category.subcategories.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      <motion.div
                        className="flex items-center justify-between"
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="text-orange-600 dark:text-orange-400 font-bold group-hover:text-orange-700 transition-colors">
                          Explore Category
                        </span>
                        <ArrowRight className="h-5 w-5 text-orange-600 dark:text-orange-400 group-hover:text-orange-700 group-hover:translate-x-2 transition-all duration-300" />
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link href="/categories">
            <motion.button
              className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-10 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 text-lg group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {isAuthenticated ? 'View All Categories' : 'View Categories'}
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}