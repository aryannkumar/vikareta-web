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

// Enhanced animated hero section for Services
const ServicesHero = () => {
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
            Business Services
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Connect with professional service providers offering expertise across industries. 
            From consulting to technical services, find the right partner for your business needs.
          </motion.p>

          {/* Service stats */}
          <motion.div 
            className="flex flex-wrap justify-center gap-8 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {[
              { icon: Settings, label: 'Service Categories', value: '150+', color: 'from-blue-500 to-cyan-500' },
              { icon: Users, label: 'Service Providers', value: '5K+', color: 'from-orange-500 to-amber-500' },
              { icon: CheckCircle, label: 'Completed Projects', value: '50K+', color: 'from-green-500 to-emerald-500' },
              { icon: Award, label: 'Success Rate', value: '96%', color: 'from-purple-500 to-pink-500' }
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

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [filteredServices, setFilteredServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [categories, setCategories] = useState<string[]>(['all']);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <ServicesHero />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Enhanced Search and Filter Controls */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white text-gray-900 placeholder-gray-500 font-medium"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex items-center gap-4">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-gray-900 font-medium"
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
                className="px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-gray-900 font-medium"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value} className="text-gray-900">
                    {option.label}
                  </option>
                ))}
              </select>

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
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-700">
            <span className="font-medium">
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
                className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 font-medium"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </motion.div>

        {/* Services Grid/List */}
        {viewMode === 'grid' ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
                  <Card className="group h-full bg-white shadow-md border border-amber-100 hover:shadow-xl hover:border-amber-300 transition-all duration-300 overflow-hidden">
                    <CardContent className="p-6">
                      {/* Service Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-2 mb-2">
                            {service.title}
                          </h3>
                          {service.featured && (
                            <Badge className="bg-gradient-to-r from-amber-600 to-orange-600 text-white border-0 mb-2">
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
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium text-gray-900 ml-1">
                              {service.rating}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            ({service.reviewCount} reviews)
                          </span>
                        </div>

                        {/* Supplier */}
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full flex items-center justify-center">
                            <Users className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm text-gray-600">{service.supplier.name}</span>
                          {service.supplier.verified && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>

                        {/* Price and Delivery */}
                        <div className="flex items-center justify-between pt-2 border-t border-amber-100">
                          <div className="text-lg font-bold text-amber-600">
                            ₹{service.price?.toLocaleString()}/hour
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
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
            className="space-y-4"
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
                  <Card className="group bg-white shadow-md border border-amber-100 hover:shadow-xl hover:border-amber-300 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Settings className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-bold text-xl text-gray-900 group-hover:text-amber-600 transition-colors">
                                {service.title}
                              </h3>
                              <p className="text-gray-600 mt-1 leading-relaxed line-clamp-2">
                                {service.description}
                              </p>
                            </div>
                            {service.featured && (
                              <Badge className="bg-gradient-to-r from-amber-600 to-orange-600 text-white border-0">
                                Featured
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium text-gray-900 ml-1">
                                  {service.rating}
                                </span>
                                <span className="text-sm text-gray-500 ml-1">
                                  ({service.reviewCount})
                                </span>
                              </div>
                              <Badge variant="outline" className="text-amber-600 border-amber-600">
                                {service.category}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-amber-600">
                                ₹{service.price?.toLocaleString()}/hour
                              </div>
                              <div className="text-sm text-gray-500">{service.deliveryTime}</div>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
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
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">No services found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSortBy('createdAt');
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