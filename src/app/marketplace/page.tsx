'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  MapPin, 
  Star, 
  Grid,
  List,
  Users,
  Award,
  BarChart,
  Building2,
  Package,
  Clock,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { marketplaceApi } from '@/lib/api/marketplace';
import { AnalyticsService, HomepageStats } from '../../lib/api/analytics';

// Enhanced animated hero section for Marketplace
const MarketplaceHero = ({ stats }: { stats?: Partial<HomepageStats> }) => {
  const defaultStats = {
    trendingProducts: 2500,
    activeSuppliers: 850,
    verifiedBusinesses: 320,
    dailyTransactions: 150
  };

  const displayStats = stats ? {
    trendingProducts: stats.trendingProducts || defaultStats.trendingProducts,
    activeSuppliers: stats.activeSuppliers || defaultStats.activeSuppliers,
    verifiedBusinesses: stats.verifiedBusinesses || defaultStats.verifiedBusinesses,
    dailyTransactions: stats.dailyTransactions || defaultStats.dailyTransactions
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
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-orange-200 rounded-full opacity-30"
          animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-16 h-16 bg-amber-200 rounded-full opacity-20"
          animate={{ y: [0, 20, 0], rotate: [0, -180, -360] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-1/3 w-12 h-12 bg-orange-300 rounded-full opacity-25"
          animate={{ x: [0, 30, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            B2B Marketplace
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Discover trending products, trusted suppliers, and growing businesses in your area. 
            Your one-stop destination for B2B procurement.
          </motion.p>

          {/* Marketplace stats */}
          <motion.div 
            className="flex flex-wrap justify-center gap-8 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {[
              { icon: TrendingUp, label: 'Trending Products', value: `${displayStats.trendingProducts.toLocaleString()}+`, color: 'from-blue-500 to-cyan-500' },
              { icon: Users, label: 'Active Suppliers', value: `${displayStats.activeSuppliers.toLocaleString()}+`, color: 'from-orange-500 to-amber-500' },
              { icon: Award, label: 'Verified Businesses', value: `${displayStats.verifiedBusinesses.toLocaleString()}+`, color: 'from-green-500 to-emerald-500' },
              { icon: BarChart, label: 'Daily Transactions', value: `${displayStats.dailyTransactions.toLocaleString()}+`, color: 'from-purple-500 to-pink-500' }
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

export default function MarketplacePage() {
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [nearbyBusinesses, setNearbyBusinesses] = useState<any[]>([]);
  const [featuredServices, setFeaturedServices] = useState<any[]>([]);
  const [homepageStats, setHomepageStats] = useState<HomepageStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const locations = ['All Locations', 'Mumbai', 'Delhi NCR', 'Bangalore', 'Chennai', 'Pune', 'Hyderabad'];
  const categories = ['All Categories', 'Technology', 'Manufacturing', 'Healthcare', 'Office Supplies', 'Construction'];

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

  // Load all data from APIs
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Load all marketplace data using API client functions
        const [popularResponse, businessesResponse, featuredResponse] = await Promise.all([
          // Use popular endpoint for trending products
          marketplaceApi.getTrendingProducts({ sortBy: 'trending' }),
          marketplaceApi.getNearbyBusinesses(),
          // Use featured endpoint for trending services
          marketplaceApi.getTrendingServices({ sortBy: 'rating' })
        ]);

        // Transform popular products to trending format
        if (popularResponse.success && popularResponse.data) {
          setTrendingProducts(popularResponse.data.slice(0, 6));
        } else {
          setTrendingProducts([]);
        }

        setNearbyBusinesses(businessesResponse.data || []);

        // Transform featured services to trending format
        if (featuredResponse.success && featuredResponse.data) {
          setFeaturedServices(featuredResponse.data.slice(0, 6));
        } else {
          setFeaturedServices([]);
        }
      } catch (error) {
        console.error('Error loading marketplace data:', error);
        // Set empty arrays on error instead of fallback mock data
        setTrendingProducts([]);
        setNearbyBusinesses([]);
        setFeaturedServices([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <MarketplaceHero stats={homepageStats || undefined} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Enhanced Search and Filter Controls */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              {/* Location Filter */}
              <div>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-gray-900 font-medium"
                >
                  {locations.map((location) => (
                    <option key={location} value={location} className="text-gray-900">
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-gray-900 font-medium"
                >
                  {categories.map((category) => (
                    <option key={category} value={category} className="text-gray-900">
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex border border-amber-200 rounded-lg overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' 
                  ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700" 
                  : "hover:bg-amber-50 text-gray-700"
                }
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' 
                  ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700" 
                  : "hover:bg-amber-50 text-gray-700"
                }
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Unified Marketplace Grid */}
        <div className="space-y-12">
          {/* Trending Products Section */}
          {trendingProducts.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Trending Products</h2>
                  <p className="text-gray-600">Popular products in high demand</p>
                </div>
              </div>
              
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6' 
                : 'space-y-4'
              }>
                {trendingProducts.slice(0, 8).map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Link href={`/products/${product.id}`} className="block h-full">
                      <Card className="group h-full bg-white shadow-md border border-amber-100 hover:shadow-xl hover:border-amber-300 transition-all duration-300 overflow-hidden">
                        <CardContent className="p-4">
                          <div className="aspect-square bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg mb-3 flex items-center justify-center">
                            <Package className="w-8 h-8 text-amber-600" />
                          </div>
                          
                          <h3 className="font-bold text-base text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-2 mb-2">
                            {product.name}
                          </h3>
                          
                          <div className="flex items-center gap-1 mb-2">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium text-gray-900">
                              {product.rating}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({product.reviews})
                            </span>
                          </div>

                          <div className="text-lg font-bold text-amber-600 mb-2">
                            ₹{product.price?.toLocaleString()}
                          </div>

                          <div className="text-xs text-gray-600 mb-2 truncate">
                            <strong>{product.supplier}</strong>
                          </div>
                          
                          <div className="flex items-center text-xs text-gray-500 mb-3">
                            <MapPin className="w-3 h-3 mr-1" />
                            {product.location}
                          </div>

                          <Button size="sm" className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white">
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Nearby Businesses Section */}
          {nearbyBusinesses.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Nearby Businesses</h2>
                  <p className="text-gray-600">Verified suppliers in your area</p>
                </div>
              </div>
              
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
              }>
                {nearbyBusinesses.slice(0, 6).map((business, index) => (
                  <motion.div
                    key={business.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Link href={`/businesses/${business.id}`} className="block h-full">
                      <Card className="group h-full bg-white shadow-md border border-amber-100 hover:shadow-xl hover:border-amber-300 transition-all duration-300 overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl flex items-center justify-center">
                              <Building2 className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-base text-gray-900 group-hover:text-amber-600 transition-colors truncate">
                                {business.name}
                              </h3>
                              {business.verified && (
                                <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0 text-xs">
                                  Verified
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {business.category}
                          </p>

                          <div className="flex items-center gap-1 mb-3">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium text-gray-900">
                              {business.rating}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({business.reviews})
                            </span>
                          </div>

                          <div className="flex items-center text-xs text-gray-500 mb-3">
                            <MapPin className="w-3 h-3 mr-1" />
                            {business.distance || business.location}
                          </div>

                          <div className="flex items-center text-xs text-gray-500 mb-4">
                            <Clock className="w-3 h-3 mr-1" />
                            Responds in {business.responseTime || '2h'}
                          </div>

                          <Button size="sm" className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white">
                            View Profile
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Featured Services Section */}
          {featuredServices.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Featured Services</h2>
                  <p className="text-gray-600">Professional services for your business</p>
                </div>
              </div>
              
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6' 
                : 'space-y-4'
              }>
                {featuredServices.slice(0, 8).map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Link href={`/services/${service.id}`} className="block h-full">
                      <Card className="group h-full bg-white shadow-md border border-amber-100 hover:shadow-xl hover:border-amber-300 transition-all duration-300 overflow-hidden">
                        <CardContent className="p-4">
                          <div className="aspect-square bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg mb-3 flex items-center justify-center">
                            <Settings className="w-8 h-8 text-orange-600" />
                          </div>
                          
                          <h3 className="font-bold text-base text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-2 mb-2">
                            {service.name}
                          </h3>
                          
                          <div className="flex items-center gap-1 mb-2">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium text-gray-900">
                              {service.rating}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({service.reviewCount})
                            </span>
                          </div>

                          <div className="text-lg font-bold text-orange-600 mb-2">
                            ₹{service.basePrice?.toLocaleString()}/hr
                          </div>

                          <div className="text-xs text-gray-600 mb-2 truncate">
                            <strong>{service.provider?.name}</strong>
                          </div>
                          
                          <div className="flex items-center text-xs text-gray-500 mb-3">
                            <Clock className="w-3 h-3 mr-1" />
                            {service.deliveryTime || '1-2 days'}
                          </div>

                          <Button size="sm" className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white">
                            View Service
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </div>

        {/* CTA Section */}
        <motion.div 
          className="mt-16 text-center bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-12 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-3xl font-bold mb-4">
            Want to Feature Your Business?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of businesses already growing with our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-amber-600 hover:bg-gray-100 font-semibold">
              List Your Business
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-amber-600 font-semibold">
              Learn More
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}