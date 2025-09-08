'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  Grid,
  List,
  Star,
  Clock,
  Loader2,
  Award,
  Settings,
  Users,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { servicesApi, type ServicesFilters } from '@/lib/api/services';
import { AnalyticsService, HomepageStats } from '../../lib/api/analytics';

// Enhanced animated hero section for Services
const ServicesHero = ({ stats }: { stats?: Partial<HomepageStats> }) => {
  const defaultStats = {
    serviceCategories: 45,
    serviceProviders: 280,
    completedProjects: 1200,
    successRate: 94
  };

  const displayStats = stats ? {
    serviceCategories: stats.serviceCategories || defaultStats.serviceCategories,
    serviceProviders: stats.serviceProviders || defaultStats.serviceProviders,
    completedProjects: stats.completedProjects || defaultStats.completedProjects,
    successRate: stats.successRate || defaultStats.successRate
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
          className="absolute top-4 sm:top-20 left-4 sm:left-10 w-12 h-12 sm:w-20 sm:h-20 bg-orange-200 rounded-full opacity-30"
          animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-8 sm:top-40 right-4 sm:right-20 w-8 h-8 sm:w-16 sm:h-16 bg-amber-200 rounded-full opacity-20"
          animate={{ y: [0, 20, 0], rotate: [0, -180, -360] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-8 sm:bottom-20 left-1/4 sm:left-1/3 w-6 h-6 sm:w-12 sm:h-12 bg-orange-300 rounded-full opacity-25"
          animate={{ x: [0, 30, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center">
          <motion.div
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6 border border-orange-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Settings className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
            <span className="text-xs sm:text-sm font-medium text-orange-700">Professional Services</span>
          </motion.div>

          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Business Services
            <span className="block text-gray-900 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
              That Drive Results
            </span>
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto mb-8 sm:mb-10 lg:mb-12 leading-relaxed px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Connect with professional service providers offering expertise across industries.
            From consulting to technical services, find the right partner for your business needs.
          </motion.p>

          {/* Service stats */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-8 sm:mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {[
              { icon: Settings, label: 'Service Categories', value: `${displayStats.serviceCategories}+`, color: 'from-blue-500 to-cyan-500' },
              { icon: Users, label: 'Service Providers', value: `${displayStats.serviceProviders}+`, color: 'from-orange-500 to-amber-500' },
              { icon: CheckCircle, label: 'Completed Projects', value: `${displayStats.completedProjects.toLocaleString()}+`, color: 'from-green-500 to-emerald-500' },
              { icon: Award, label: 'Success Rate', value: `${displayStats.successRate}%`, color: 'from-purple-500 to-pink-500' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-2 sm:mb-3 shadow-lg`}>
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-600 leading-tight">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-10 lg:mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-6 sm:px-8 py-3 sm:py-4 min-h-[48px] text-sm sm:text-base lg:text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Browse Services
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-orange-600 text-orange-600 hover:bg-orange-50 px-6 sm:px-8 py-3 sm:py-4 min-h-[48px] text-sm sm:text-base lg:text-lg font-semibold"
            >
              Become a Provider
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [filteredServices, setFilteredServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [categories, setCategories] = useState<string[]>(['all']);
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

  // Fetch categories for filter dropdown
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await servicesApi.getCategories();
        if (response.success) {
          setCategories(['all', ...response.data]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }

    fetchCategories();
  }, []);

  // Fetch services from API
  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true);
        const filters: ServicesFilters = {
          page: 1,
          limit: 50,
          sortBy: sortBy as any,
          sortOrder: sortBy === 'price' ? 'asc' : 'desc',
          ...(selectedCategory !== 'all' && { categoryId: selectedCategory })
        };

        const response = await servicesApi.getServices(filters);
        if (response.success) {
          // Map API service structure to our component structure
          const mappedServices = response.data.services.map(service => ({
            id: service.id,
            title: service.name,
            description: service.description,
            price: service.basePrice,
            currency: 'INR',
            rating: service.rating,
            reviewCount: service.reviewCount,
            supplier: {
              id: service.provider.id,
              name: service.provider.name,
              verified: service.provider.verified,
              rating: 0 // Provider rating not available in API structure
            },
            category: service.category,
            deliveryTime: service.deliveryTime,
            featured: service.packages.some(pkg => pkg.name.toLowerCase().includes('featured')),
            image: service.images[0] || undefined
          }));

          setServices(mappedServices);
          setFilteredServices(mappedServices);
        } else {
          console.error('Failed to fetch services');
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, [sortBy, selectedCategory]);

  // Filter and sort services
  useEffect(() => {
    let filtered = services;

    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    // Sort services
    switch (sortBy) {
      case 'createdAt':
        filtered = filtered.sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime());
        break;
      case 'price':
        filtered = filtered.sort((a, b) => a.price - b.price);
        break;
      case 'rating':
        filtered = filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'title':
        filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    setFilteredServices(filtered);
  }, [services, searchQuery, selectedCategory, sortBy]);

  const sortOptions = [
    { value: 'createdAt', label: 'Newest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'title', label: 'Title A-Z' }
  ];

  if (loading || statsLoading) {
    return (
      <div className="min-h-screen bg-white">
        <ServicesHero stats={homepageStats || undefined} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12 sm:py-16">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-orange-600" />
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 sm:mb-4">
              Loading services...
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
              Finding the best professional services for your business needs
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <ServicesHero stats={homepageStats || undefined} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Enhanced Search and Filter Controls */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-200 p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-lg w-full">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4 sm:h-5 sm:w-5" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white text-sm sm:text-base shadow-sm min-h-[48px]"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full lg:w-auto">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 sm:px-4 py-3 sm:py-3 border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-sm sm:text-base font-medium min-h-[48px] w-full sm:w-auto min-w-[160px]"
              >
                {categories.map((category) => (
                  <option key={category} value={category} className="text-gray-900">
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 sm:px-4 py-3 sm:py-3 border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-sm sm:text-base font-medium min-h-[48px] w-full sm:w-auto min-w-[140px]"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value} className="text-gray-900">
                    {option.label}
                  </option>
                ))}
              </select>

              {/* View Mode Toggle */}
              <div className="flex border-2 border-amber-200 rounded-lg overflow-hidden min-h-[48px]">
                <Button
                  variant={viewMode === 'grid' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`px-3 sm:px-4 ${viewMode === 'grid'
                    ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700"
                    : "hover:bg-amber-50 text-gray-700"
                  }`}
                >
                  <Grid className="w-4 h-4 sm:w-5 sm:w-5" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`px-3 sm:px-4 ${viewMode === 'list'
                    ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700"
                    : "hover:bg-amber-50 text-gray-700"
                  }`}
                >
                  <List className="w-4 h-4 sm:w-5 sm:w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-700">
            <span className="font-medium text-center sm:text-left">
              Showing {filteredServices.length} of {services.length} services
            </span>
            {(searchQuery || selectedCategory !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSortBy('createdAt');
                }}
                className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 font-medium px-4 py-2 min-h-[40px]"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </motion.div>

        {/* Services Grid/List */}
        {viewMode === 'grid' ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Link href={`/services/${service.id}`}>
                  <Card className="group h-full bg-white/80 backdrop-blur-sm shadow-sm border border-amber-100 hover:shadow-xl hover:border-amber-300 transition-all duration-300 overflow-hidden">
                    <CardContent className="p-4 sm:p-6">
                      {/* Service Header */}
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-base sm:text-lg text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-2 mb-2 leading-tight">
                            {service.title}
                          </h3>
                          {service.featured && (
                            <Badge className="bg-gradient-to-r from-amber-600 to-orange-600 text-white border-0 text-xs px-2 py-1">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Service Description */}
                      <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-4">
                        {service.description}
                      </p>

                      {/* Service Details */}
                      <div className="space-y-3">
                        {/* Rating and Reviews */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium text-gray-900 ml-1">
                              {service.rating}
                            </span>
                          </div>
                          <span className="text-xs sm:text-sm text-gray-500">
                            ({service.reviewCount} reviews)
                          </span>
                        </div>

                        {/* Supplier */}
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full flex items-center justify-center">
                            <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                          </div>
                          <span className="text-xs sm:text-sm text-gray-600 truncate">{service.supplier.name}</span>
                          {service.supplier.verified && (
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                          )}
                        </div>

                        {/* Price and Delivery */}
                        <div className="flex items-center justify-between pt-2 border-t border-amber-100">
                          <div className="text-base sm:text-lg font-bold text-amber-600">
                            ₹{service.price?.toLocaleString()}/hour
                          </div>
                          <div className="flex items-center text-xs sm:text-sm text-gray-500">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            {service.deliveryTime}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="space-y-3 sm:space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.05 }}
          >
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                <Link href={`/services/${service.id}`}>
                  <Card className="group bg-white/80 backdrop-blur-sm shadow-sm border border-amber-100 hover:shadow-xl hover:border-amber-300 transition-all duration-300">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                          <Settings className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 sm:mb-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-base sm:text-lg lg:text-xl text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-2 mb-1 sm:mb-2">
                                {service.title}
                              </h3>
                              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-2 sm:mb-3">
                                {service.description}
                              </p>
                            </div>
                            {service.featured && (
                              <Badge className="bg-gradient-to-r from-amber-600 to-orange-600 text-white border-0 text-xs px-2 py-1 self-start sm:self-center flex-shrink-0">
                                Featured
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                              <div className="flex items-center">
                                <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium text-gray-900 ml-1">
                                  {service.rating}
                                </span>
                                <span className="text-xs sm:text-sm text-gray-500 ml-1">
                                  ({service.reviewCount})
                                </span>
                              </div>
                              <Badge variant="outline" className="text-amber-600 border-amber-600 text-xs px-2 py-1">
                                {service.category}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full flex items-center justify-center">
                                  <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                                </div>
                                <span className="text-xs sm:text-sm text-gray-600 truncate">{service.supplier.name}</span>
                                {service.supplier.verified && (
                                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                                )}
                              </div>
                            </div>
                            <div className="text-left sm:text-right flex-shrink-0">
                              <div className="text-base sm:text-lg lg:text-xl font-bold text-amber-600">
                                ₹{service.price?.toLocaleString()}/hour
                              </div>
                              <div className="flex items-center text-xs sm:text-sm text-gray-500 mt-1">
                                <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                {service.deliveryTime}
                              </div>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* No Results */}
        {filteredServices.length === 0 && (
          <motion.div
            className="text-center py-8 sm:py-12 lg:py-16 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-gray-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Search className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 sm:mb-4">
              No services found
            </h3>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto">
              Try adjusting your search terms or filters to find more services
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSortBy('createdAt');
                }}
                className="border-orange-600 text-orange-600 hover:bg-orange-50 px-6 py-2.5 min-h-[44px] text-sm sm:text-base"
              >
                Clear Filters
              </Button>
              <Button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-6 py-2.5 min-h-[44px] text-sm sm:text-base"
              >
                Browse All Services
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}