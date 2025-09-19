'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  TrendingUp, 
  Package, 
  Users, 
  Heart, 
  Star, 
  Clock, 
  Target,
  Shuffle,
  Grid3X3,
  Filter,
  Sparkles,
  ChevronRight,
  ExternalLink
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
  lastViewed?: string;
}

interface CategoryGridProps {
  maxCategories?: number;
  showRandomize?: boolean;
  layout?: 'grid' | 'masonry' | 'carousel';
}

export function CategoryGrid({ 
  maxCategories = 8, 
  showRandomize = true,
  layout = 'masonry'
}: CategoryGridProps = {}) {
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
  const [randomSeed, setRandomSeed] = useState(Math.random());
  const [viewMode, setViewMode] = useState<'personalized' | 'trending' | 'random'>('personalized');
  const toast = useToast();

  // Fetch all categories for randomization
  useEffect(() => {
    fetchAllCategories();
  }, []);

  // Process and set display categories based on preferences and randomization
  useEffect(() => {
    if (allCategories.length > 0) {
      processDisplayCategories();
    }
  }, [
    allCategories, 
    personalizedCategories, 
    trendingCategories, 
    userPreferences, 
    randomSeed, 
    viewMode,
    maxCategories
  ]);

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

  const processDisplayCategories = () => {
    if (allCategories.length === 0) return;

    let processedCategories: CategoryWithStats[] = [];

    if (isAuthenticated && viewMode === 'personalized' && personalizedCategories.length > 0) {
      // Use personalized categories with stats
      processedCategories = personalizedCategories.map(cat => ({
        ...cat,
        isPreferred: userPreferences?.preferredCategories?.includes(cat.id) || false,
        isTrending: trendingCategories.some(tc => tc.categoryId === cat.id),
        supplierCount: Math.floor((cat.productCount || 0) / 8) + Math.floor(Math.random() * 50),
      }));
    } else if (viewMode === 'trending' && trendingCategories.length > 0) {
      // Use trending categories
      const trendingCatIds = trendingCategories.map(tc => tc.categoryId);
      processedCategories = allCategories
        .filter(cat => trendingCatIds.includes(cat.id))
        .map(cat => ({
          ...cat,
          isTrending: true,
          isPreferred: userPreferences?.preferredCategories?.includes(cat.id) || false,
          supplierCount: Math.floor(Math.random() * 100) + 20,
          productCount: Math.floor(Math.random() * 1000) + 100,
        }));
    } else {
      // Use random categories with seeded randomization
      const shuffled = [...allCategories]
        .map(cat => ({ 
          ...cat, 
          randomSort: Math.sin(randomSeed * cat.id.charCodeAt(0)) 
        }))
        .sort((a, b) => b.randomSort - a.randomSort);
      
      processedCategories = shuffled.map(cat => ({
        ...cat,
        isPreferred: userPreferences?.preferredCategories?.includes(cat.id) || false,
        isTrending: trendingCategories.some(tc => tc.categoryId === cat.id),
        supplierCount: Math.floor(Math.random() * 200) + 10,
        productCount: Math.floor(Math.random() * 2000) + 50,
        relevanceScore: Math.random() * 0.5 + 0.5, // Random score between 0.5-1.0
      }));
    }

    // Sort to prioritize preferred categories first
    processedCategories.sort((a, b) => {
      if (a.isPreferred && !b.isPreferred) return -1;
      if (!a.isPreferred && b.isPreferred) return 1;
      if (a.isTrending && !b.isTrending) return -1;
      if (!a.isTrending && b.isTrending) return 1;
      return 0;
    });

    setDisplayCategories(processedCategories.slice(0, maxCategories));
  };

  const handleRandomize = () => {
    setRandomSeed(Math.random());
    setViewMode('random');
  };

  const handleCategoryClick = async (categoryId: string, categorySlug: string) => {
    try {
      await trackCategoryInteraction(categoryId, 'click');
    } catch (error) {
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

  const isLoading = loading.categories || fallbackLoading;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  const getCategoryCardHeight = (index: number) => {
    const heights = ['h-64', 'h-80', 'h-72', 'h-68'];
    return heights[index % heights.length];
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-lg mb-6">
              <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
              <span className="text-gray-600 font-medium">
                {isAuthenticated ? 'Curating your categories...' : 'Loading categories...'}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`bg-white rounded-2xl shadow-lg animate-pulse ${getCategoryCardHeight(i)}`}
              >
                <div className="h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-2xl"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error && displayCategories.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-red-50 text-red-600 rounded-full px-6 py-3 mb-6">
              <AlertCircle className="h-5 w-5" />
              <span>Failed to load categories</span>
            </div>
            <Button 
              onClick={() => {
                loadPersonalizedCategories();
                loadTrendingCategories();
                fetchAllCategories();
              }} 
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full px-6 py-2 mb-6"
          >
            <Sparkles className="h-4 w-4 text-orange-500" />
            <span className="text-orange-700 font-semibold text-sm">
              {isAuthenticated 
                ? `${viewMode === 'personalized' ? 'Personalized' : viewMode === 'trending' ? 'Trending' : 'Discover'} Categories` 
                : 'Explore Categories'
              }
            </span>
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {isAuthenticated ? 'Made for You' : 'Find What You Need'}
          </motion.h2>

          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {isAuthenticated
              ? 'Categories curated based on your interests and business needs'
              : 'Discover thousands of products and services from verified suppliers'
            }
          </motion.p>

          {/* Controls */}
          {showRandomize && (
            <motion.div
              className="flex flex-wrap justify-center gap-3 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {isAuthenticated && (
                <>
                  <Button
                    variant={viewMode === 'personalized' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('personalized')}
                    className="rounded-full"
                  >
                    <Target className="h-4 w-4 mr-2" />
                    For You
                  </Button>
                  <Button
                    variant={viewMode === 'trending' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('trending')}
                    className="rounded-full"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Trending
                  </Button>
                </>
              )}
              <Button
                variant={viewMode === 'random' ? 'default' : 'outline'}
                size="sm"
                onClick={handleRandomize}
                className="rounded-full"
              >
                <Shuffle className="h-4 w-4 mr-2" />
                Discover
              </Button>
            </motion.div>
          )}
        </div>

        {/* Categories Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${viewMode}-${randomSeed}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={
              layout === 'masonry' 
                ? "columns-1 md:columns-2 lg:columns-4 gap-6 space-y-6"
                : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            }
          >
            {displayCategories.map((category, index) => (
              <motion.div
                key={`${category.id}-${randomSeed}`}
                variants={itemVariants}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className={layout === 'masonry' ? "break-inside-avoid mb-6" : ""}
                onViewportEnter={() => handleCategoryView(category.id)}
              >
                <Link
                  href={`/categories/${category.slug}`}
                  className="group block"
                  onClick={() => handleCategoryClick(category.id, category.slug)}
                >
                  <div className={`
                    bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 
                    overflow-hidden relative border border-gray-100 hover:border-orange-200
                    ${layout === 'masonry' ? getCategoryCardHeight(index) : 'h-80'}
                  `}>
                    {/* Header Image Area */}
                    <div className="relative h-32 overflow-hidden">
                      <IconBackground
                        category={category}
                        size={60}
                        className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 via-blue-50 to-purple-50 group-hover:from-orange-100 group-hover:via-blue-100 group-hover:to-purple-100 transition-all duration-500"
                        iconClassName="text-orange-500 group-hover:text-orange-600 group-hover:scale-110 transition-all duration-500"
                      />
                      
                      {/* Floating badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {category.isPreferred && (
                          <motion.div
                            className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Heart className="h-3 w-3" />
                            Preferred
                          </motion.div>
                        )}
                        {category.isTrending && (
                          <motion.div
                            className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg"
                            initial={{ scale: 0, rotate: 180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: index * 0.1 + 0.1 }}
                          >
                            <TrendingUp className="h-3 w-3" />
                            Hot
                          </motion.div>
                        )}
                      </div>

                      {/* Floating action button */}
                      <div className="absolute top-3 right-3">
                        <motion.div
                          className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ExternalLink className="h-4 w-4 text-gray-600" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                          {category.description || 'Explore quality products and services'}
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1 text-gray-500">
                          <Package className="h-3 w-3" />
                          <span className="font-medium">{(category.productCount || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Users className="h-3 w-3" />
                          <span className="font-medium">{(category.supplierCount || 0).toLocaleString()}</span>
                        </div>
                        {category.relevanceScore && (
                          <div className="flex items-center gap-1 text-orange-500">
                            <Star className="h-3 w-3" />
                            <span className="font-medium">{Math.round(category.relevanceScore * 100)}%</span>
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {category.subcategories && category.subcategories.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {category.subcategories.slice(0, 2).map((sub: any) => (
                            <Badge
                              key={sub.id}
                              variant="secondary"
                              className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-700 transition-colors"
                            >
                              {sub.name}
                            </Badge>
                          ))}
                          {category.subcategories.length > 2 && (
                            <Badge
                              variant="secondary"
                              className="text-xs px-2 py-0.5 bg-orange-100 text-orange-600"
                            >
                              +{category.subcategories.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Action */}
                      <motion.div
                        className="flex items-center justify-between pt-2 border-t border-gray-100"
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="text-sm font-semibold text-orange-600 group-hover:text-orange-700">
                          Explore
                        </span>
                        <ChevronRight className="h-4 w-4 text-orange-600 group-hover:text-orange-700 group-hover:translate-x-1 transition-all duration-300" />
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Footer CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link href="/categories">
            <motion.button
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Browse All Categories</span>
              <ArrowRight className="inline-block ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}