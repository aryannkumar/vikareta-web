'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Search, 
  Grid, 
  List, 
  Filter, 
  ArrowRight, 
  TrendingUp, 
  Package, 
  Loader2,
  Award,
  Users,
  BarChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CategoryIcon } from '@/components/ui/dynamic-icon';
import { categoriesApi, type Category } from '@/lib/api/categories';
import { AnalyticsService, HomepageStats } from '../../lib/api/analytics';

// Enhanced animated hero section
const CategoriesHero = ({ stats }: { stats?: Partial<HomepageStats> }) => {
  const defaultStats = {
    productCategories: 85,
    featuredCategories: 25,
    activeSuppliersCount: 420,
    categorySuccessRate: 96
  };

  const displayStats = stats ? {
    productCategories: stats.productCategories || defaultStats.productCategories,
    featuredCategories: stats.featuredCategories || defaultStats.featuredCategories,
    activeSuppliersCount: stats.activeSuppliersCount || defaultStats.activeSuppliersCount,
    categorySuccessRate: stats.categorySuccessRate || defaultStats.categorySuccessRate
  } : defaultStats;

  return (
    <motion.section 
      className="relative bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-orange-400/20 to-amber-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-orange-300/10 to-amber-300/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Business Categories
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Explore our comprehensive range of business categories designed to meet your procurement needs. 
            Find specialized products and services across industries.
          </motion.p>

          {/* Category stats */}
          <motion.div 
            className="flex flex-wrap justify-center gap-8 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {[
              { icon: Package, label: 'Product Categories', value: `${displayStats.productCategories}+`, color: 'from-blue-500 to-cyan-500' },
              { icon: Award, label: 'Featured Categories', value: `${displayStats.featuredCategories}+`, color: 'from-orange-500 to-amber-500' },
              { icon: Users, label: 'Active Suppliers', value: `${displayStats.activeSuppliersCount.toLocaleString()}+`, color: 'from-green-500 to-emerald-500' },
              { icon: BarChart, label: 'Success Rate', value: `${displayStats.categorySuccessRate}%`, color: 'from-purple-500 to-pink-500' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-3 shadow-lg`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [homepageStats, setHomepageStats] = useState<HomepageStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Load homepage stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        setStatsLoading(true);
        const stats = await AnalyticsService.getHomepageStats();
        setHomepageStats(stats);
      } catch (error) {
        console.error('Error loading homepage stats:', error);
        // Keep null so component uses default values
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, []);

  // Fetch categories from API
  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const response = await categoriesApi.getCategories();
        if (response.success) {
          setCategories(response.data);
          setFilteredCategories(response.data);
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  // Filter categories
  useEffect(() => {
    let filtered = categories;

    if (searchQuery) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (showFeaturedOnly) {
      filtered = filtered.filter(category => category.featured);
    }

    setFilteredCategories(filtered);
  }, [categories, searchQuery, showFeaturedOnly]);

  if (loading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <CategoriesHero stats={homepageStats || undefined} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Enhanced Search and Filter Controls */}
        <motion.div 
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex items-center gap-4">
              <Button
                variant={showFeaturedOnly ? "default" : "outline"}
                onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                className={showFeaturedOnly 
                  ? "bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700" 
                  : "hover:bg-orange-50 hover:border-orange-300"
                }
              >
                <Filter className="w-4 h-4 mr-2" />
                Featured Only
              </Button>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === 'grid' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' 
                    ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white" 
                    : "hover:bg-gray-50"
                  }
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' 
                    ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white" 
                    : "hover:bg-gray-50"
                  }
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {filteredCategories.length} of {categories.length} categories
            </span>
            {(searchQuery || showFeaturedOnly) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setShowFeaturedOnly(false);
                }}
                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </motion.div>

        {/* Enhanced Categories Grid/List */}
        {viewMode === 'grid' ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {filteredCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Link href={`/categories/${category.slug}`}>
                  <Card className="group h-full bg-white shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden relative">
                    <CardContent className="p-6">
                      {/* Category Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-14 h-14 bg-gradient-to-r from-orange-600 to-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <CategoryIcon category={category} size={28} className="text-white" />
                        </div>
                        {category.featured && (
                          <Badge className="bg-gradient-to-r from-orange-600 to-amber-600 text-white border-0">
                            Featured
                          </Badge>
                        )}
                      </div>

                      {/* Category Content */}
                      <div className="space-y-3">
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                          {category.name}
                        </h3>
                        
                        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                          {category.description || 'Explore our wide range of products and services in this category'}
                        </p>

                        {/* Category Stats */}
                        <div className="flex items-center justify-between pt-2">
                          <Badge variant="outline" className="text-orange-600 border-orange-600">
                            <Package className="w-3 h-3 mr-1" />
                            {(category.productCount || 0).toLocaleString()}
                          </Badge>
                          
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-600/5 to-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.05 }}
          >
            {filteredCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                <Link href={`/categories/${category.slug}`}>
                  <Card className="group bg-white shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <CategoryIcon category={category} size={32} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-bold text-xl text-gray-900 group-hover:text-orange-600 transition-colors">
                                {category.name}
                              </h3>
                              <p className="text-gray-600 mt-1 leading-relaxed">
                                {category.description || 'Explore our wide range of products and services in this category'}
                              </p>
                            </div>
                            {category.featured && (
                              <Badge className="bg-gradient-to-r from-orange-600 to-amber-600 text-white border-0">
                                Featured
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 mt-4">
                            <Badge variant="outline" className="text-orange-600 border-orange-600">
                              <Package className="w-3 h-3 mr-1" />
                              {(category.productCount || 0).toLocaleString()} products
                            </Badge>
                            {category.isActive && (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Active
                              </Badge>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* No Results */}
        {filteredCategories.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">No categories found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setShowFeaturedOnly(false);
              }}
              className="hover:bg-orange-50 hover:border-orange-300"
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}