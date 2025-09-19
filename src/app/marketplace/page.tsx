'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
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
  Settings,
  Shuffle,
  Target,
  Filter,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Heart,
  Eye,
  ArrowRight,
  Zap,
  Shield,
  ThumbsUp,
  MessageCircle,
  Phone,
  Mail,
  Globe,
  Verified,
  Crown,
  Flame
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { marketplaceApi } from '@/lib/api/marketplace';
import { AnalyticsService, HomepageStats } from '../../lib/api/analytics';
import { useVikaretaAuth } from '@/lib/auth/vikareta/hooks/use-vikareta-auth';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface MarketplaceItem {
  id: string;
  type: 'product' | 'service' | 'business';
  name: string;
  rating: number;
  reviews: number;
  price?: number;
  basePrice?: number;
  location: string;
  supplier?: string;
  provider?: { name: string };
  category?: string;
  verified?: boolean;
  responseTime?: string;
  deliveryTime?: string;
  distance?: string;
  description?: string;
  tags?: string[];
  featured?: boolean;
  trending?: boolean;
  isPreferred?: boolean;
  relevanceScore?: number;
  viewCount?: number;
  contactCount?: number;
}

// Simplified Card Component for Better Space Utilization
const CompactCard = ({ 
  item, 
  index, 
  layout = 'grid',
  onView,
  onContact
}: { 
  item: MarketplaceItem; 
  index: number; 
  layout: 'grid' | 'list';
  onView: (id: string, type: string) => void;
  onContact: (id: string, type: string) => void;
}) => {
  const getTypeIcon = () => {
    switch (item.type) {
      case 'product': return Package;
      case 'service': return Settings;
      case 'business': return Building2;
      default: return Package;
    }
  };

  const getTypeColor = () => {
    switch (item.type) {
      case 'product': return 'blue';
      case 'service': return 'orange';
      case 'business': return 'purple';
      default: return 'gray';
    }
  };

  const TypeIcon = getTypeIcon();
  const typeColor = getTypeColor();
  const href = `/${item.type}s/${item.id}`;

  if (layout === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.02 }}
        onViewportEnter={() => onView(item.id, item.type)}
      >
        <Link href={href} className="group block">
          <Card className="group bg-white shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className={`w-16 h-16 bg-${typeColor}-50 rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <TypeIcon className={`w-8 h-8 text-${typeColor}-600`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors truncate mr-2">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-900">{item.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>{item.supplier || item.provider?.name || 'Provider'}</span>
                    {(item.price || item.basePrice) && (
                      <span className={`font-semibold text-${typeColor}-600`}>
                        ₹{(item.price || item.basePrice)?.toLocaleString()}
                        {item.type === 'service' && '/hr'}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {item.location}
                    </div>
                    {(item.responseTime || item.deliveryTime) && (
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {item.responseTime || item.deliveryTime}
                      </div>
                    )}
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-col gap-1 flex-shrink-0">
                  {item.featured && (
                    <Badge className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0">Featured</Badge>
                  )}
                  {item.trending && (
                    <Badge className="bg-red-100 text-red-700 text-xs px-2 py-0">Trending</Badge>
                  )}
                  {item.isPreferred && (
                    <Badge className="bg-blue-100 text-blue-700 text-xs px-2 py-0">Preferred</Badge>
                  )}
                </div>

                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </motion.div>
    );
  }

  // Grid layout
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ y: -4 }}
      onViewportEnter={() => onView(item.id, item.type)}
    >
      <Link href={href} className="group block h-full">
        <Card className="group h-72 bg-white shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 overflow-hidden">
          {/* Header with badges */}
          <div className="relative">
            <div className={`h-20 bg-gradient-to-br from-${typeColor}-50 to-${typeColor}-100 flex items-center justify-center`}>
              <TypeIcon className={`w-10 h-10 text-${typeColor}-600 group-hover:scale-110 transition-transform duration-300`} />
            </div>
            
            {/* Floating badges */}
            <div className="absolute top-2 left-2 flex gap-1">
              {item.featured && (
                <div className="bg-yellow-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                  Featured
                </div>
              )}
              {item.trending && (
                <div className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                  Hot
                </div>
              )}
            </div>

            {/* Rating */}
            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium text-gray-900">{item.rating}</span>
            </div>
          </div>

          <CardContent className="p-4 flex flex-col h-52">
            {/* Title */}
            <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 mb-2">
              {item.name}
            </h3>

            {/* Provider */}
            <div className="text-sm text-gray-600 mb-2">
              {item.supplier || item.provider?.name || 'Provider'}
            </div>

            {/* Price */}
            {(item.price || item.basePrice) && (
              <div className={`text-lg font-bold text-${typeColor}-600 mb-2`}>
                ₹{(item.price || item.basePrice)?.toLocaleString()}
                {item.type === 'service' && '/hr'}
              </div>
            )}

            {/* Location & Time */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <div className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {item.location}
              </div>
              {(item.responseTime || item.deliveryTime) && (
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {item.responseTime || item.deliveryTime}
                </div>
              )}
            </div>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {item.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs px-2 py-0 bg-gray-100 text-gray-600"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Action */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto">
              <span className="text-sm font-medium text-orange-600 group-hover:text-orange-700">
                View Details
              </span>
              <ChevronRight className="w-4 h-4 text-orange-600 group-hover:text-orange-700 group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};
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
    <section className="bg-gradient-to-br from-gray-50 to-orange-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            B2B Marketplace
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Discover trending products, trusted suppliers, and growing businesses. 
            Your one-stop destination for B2B procurement.
          </p>

          {/* Simple stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: TrendingUp, label: 'Products', value: `${displayStats.trendingProducts.toLocaleString()}+`, color: 'blue' },
              { icon: Users, label: 'Suppliers', value: `${displayStats.activeSuppliers.toLocaleString()}+`, color: 'orange' },
              { icon: Award, label: 'Businesses', value: `${displayStats.verifiedBusinesses.toLocaleString()}+`, color: 'green' },
              { icon: BarChart, label: 'Transactions', value: `${displayStats.dailyTransactions.toLocaleString()}+`, color: 'purple' }
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center mb-3 mx-auto`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default function MarketplacePage() {
  const { isAuthenticated, user } = useVikaretaAuth();
  const {
    personalizedCategories,
    trendingCategories,
    userPreferences,
    loading: preferencesLoading,
    trackCategoryInteraction,
  } = useUserPreferences();

  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedType, setSelectedType] = useState('All Types');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'price' | 'distance'>('relevance');
  const [showMode, setShowMode] = useState<'personalized' | 'trending' | 'all'>('all');

  const [allItems, setAllItems] = useState<MarketplaceItem[]>([]);
  const [displayItems, setDisplayItems] = useState<MarketplaceItem[]>([]);
  const [homepageStats, setHomepageStats] = useState<HomepageStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const locations = ['All Locations', 'Mumbai', 'Delhi NCR', 'Bangalore', 'Chennai', 'Pune', 'Hyderabad'];
  const categories = ['All Categories', 'Technology', 'Manufacturing', 'Healthcare', 'Office Supplies', 'Construction'];
  const types = ['All Types', 'Products', 'Services', 'Businesses'];

  // Load homepage stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        setStatsLoading(true);
        const stats = await AnalyticsService.getHomepageStats();
        setHomepageStats(stats);
      } catch (error) {
        console.error('Error loading homepage stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, []);

  // Load all marketplace data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsResponse, servicesResponse, businessesResponse] = await Promise.all([
          marketplaceApi.getTrendingProducts({ sortBy: 'trending' }),
          marketplaceApi.getTrendingServices({ sortBy: 'rating' }),
          marketplaceApi.getNearbyBusinesses()
        ]);

        const allMarketplaceItems: MarketplaceItem[] = [];

        // Add products
        if (productsResponse.success && productsResponse.data) {
          const products = productsResponse.data.map((item: any) => ({
            ...item,
            type: 'product' as const,
            trending: Math.random() > 0.7,
            featured: Math.random() > 0.8,
            relevanceScore: Math.random() * 0.5 + 0.5,
            tags: ['Electronics', 'Quality', 'Fast Delivery'].slice(0, Math.floor(Math.random() * 3) + 1)
          }));
          allMarketplaceItems.push(...products);
        }

        // Add services
        if (servicesResponse.success && servicesResponse.data) {
          const services = servicesResponse.data.map((item: any) => ({
            ...item,
            type: 'service' as const,
            trending: Math.random() > 0.7,
            featured: Math.random() > 0.8,
            relevanceScore: Math.random() * 0.5 + 0.5,
            tags: ['Professional', 'Certified', 'Quick Response'].slice(0, Math.floor(Math.random() * 3) + 1)
          }));
          allMarketplaceItems.push(...services);
        }

        // Add businesses
        if (businessesResponse.data) {
          const businesses = businessesResponse.data.map((item: any) => ({
            ...item,
            type: 'business' as const,
            trending: Math.random() > 0.7,
            featured: Math.random() > 0.8,
            relevanceScore: Math.random() * 0.5 + 0.5,
            tags: ['Verified', 'Trusted', 'Local'].slice(0, Math.floor(Math.random() * 3) + 1)
          }));
          allMarketplaceItems.push(...businesses);
        }

        setAllItems(allMarketplaceItems);
      } catch (error) {
        console.error('Error loading marketplace data:', error);
        setAllItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Process and filter display items based on preferences and filters
  const processedItems = useMemo(() => {
    if (allItems.length === 0) return [];

    let filteredItems = [...allItems];

    // Apply filters
    if (selectedLocation !== 'All Locations') {
      filteredItems = filteredItems.filter(item => 
        item.location?.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    if (selectedCategory !== 'All Categories') {
      filteredItems = filteredItems.filter(item => 
        item.category?.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    if (selectedType !== 'All Types') {
      const typeFilter = selectedType.toLowerCase().slice(0, -1); // Remove 's' from 'Products'
      filteredItems = filteredItems.filter(item => item.type === typeFilter);
    }

    // Apply user preferences if authenticated
    if (isAuthenticated && userPreferences) {
      filteredItems = filteredItems.map(item => ({
        ...item,
        isPreferred: userPreferences.preferredCategories?.includes(item.category || '') || false
      }));
    }

    // Apply show mode logic
    if (showMode === 'personalized' && isAuthenticated) {
      // Sort by user preferences and relevance
      filteredItems.sort((a, b) => {
        if (a.isPreferred && !b.isPreferred) return -1;
        if (!a.isPreferred && b.isPreferred) return 1;
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (b.relevanceScore || 0) - (a.relevanceScore || 0);
      });
    } else if (showMode === 'trending') {
      // Show trending items first
      filteredItems.sort((a, b) => {
        if (a.trending && !b.trending) return -1;
        if (!a.trending && b.trending) return 1;
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.rating - a.rating;
      });
    } else {
      // Show all items sorted by relevance and features
      filteredItems.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        if (a.trending && !b.trending) return -1;
        if (!a.trending && b.trending) return 1;
        return (b.relevanceScore || 0) - (a.relevanceScore || 0);
      });
    }

    // Apply sorting
    if (sortBy === 'rating') {
      filteredItems.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price') {
      filteredItems.sort((a, b) => (a.price || a.basePrice || 0) - (b.price || b.basePrice || 0));
    } else if (sortBy === 'distance') {
      filteredItems.sort((a, b) => {
        const distanceA = parseFloat(a.distance?.split(' ')[0] || '999');
        const distanceB = parseFloat(b.distance?.split(' ')[0] || '999');
        return distanceA - distanceB;
      });
    }

    return filteredItems.slice(0, 24); // Limit to 24 items for performance
  }, [
    allItems, 
    selectedLocation, 
    selectedCategory, 
    selectedType, 
    isAuthenticated, 
    userPreferences, 
    showMode, 
    sortBy
  ]);

  const handleItemView = async (id: string, type: string) => {
    try {
      // Track view interaction
      console.log(`Viewed ${type}: ${id}`);
    } catch (error) {
      console.error('Failed to track view:', error);
    }
  };

  const handleItemContact = async (id: string, type: string) => {
    try {
      // Track contact interaction
      console.log(`Contacted ${type}: ${id}`);
    } catch (error) {
      console.error('Failed to track contact:', error);
    }
  };



  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  if (loading || statsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm mb-6">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent"></div>
              <span className="text-gray-600 font-medium">Loading marketplace...</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm animate-pulse h-72"
              >
                <div className="h-20 bg-gray-200 rounded-t-xl"></div>
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MarketplaceHero stats={homepageStats || undefined} />
      
      <div className="container mx-auto px-6 py-12">
        {/* Simple Control Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {processedItems.length} Items Found
            </h2>
            <p className="text-gray-600">
              {isAuthenticated 
                ? 'Items curated based on your preferences'
                : 'Discover the best products, services, and businesses'
              }
            </p>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Show Mode Controls */}
            {isAuthenticated && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Show Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={showMode === 'personalized' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShowMode('personalized')}
                    className="text-xs"
                  >
                    For You
                  </Button>
                  <Button
                    variant={showMode === 'trending' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShowMode('trending')}
                    className="text-xs"
                  >
                    Trending
                  </Button>
                  <Button
                    variant={showMode === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShowMode('all')}
                    className="text-xs"
                  >
                    All
                  </Button>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className={isAuthenticated ? '' : 'lg:col-span-2'}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filters</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-sm"
                >
                  {locations.map((location) => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-sm"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-sm"
                >
                  {types.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* View & Sort Controls */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">View & Sort</label>
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value as any)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-sm"
                >
                  <option value="grid">Grid</option>
                  <option value="list">List</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-sm"
                >
                  <option value="relevance">Relevance</option>
                  <option value="rating">Rating</option>
                  <option value="price">Price</option>
                  <option value="distance">Distance</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Marketplace Grid */}
        <div
          className={
            viewMode === 'list'
              ? "space-y-4"
              : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          }
        >
          {processedItems.map((item, index) => (
            <CompactCard
              key={`${item.id}-${showMode}`}
              item={item}
              index={index}
              layout={viewMode}
              onView={handleItemView}
              onContact={handleItemContact}
            />
          ))}
        </div>

        {/* Empty State */}
        {processedItems.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search criteria</p>
            <Button 
              onClick={() => {
                setSelectedLocation('All Locations');
                setSelectedCategory('All Categories');
                setSelectedType('All Types');
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Reset Filters
            </Button>
          </div>
        )}

        {/* Stats Footer */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {[
            { icon: Package, label: 'Products', value: processedItems.filter(i => i.type === 'product').length, color: 'blue' },
            { icon: Settings, label: 'Services', value: processedItems.filter(i => i.type === 'service').length, color: 'orange' },
            { icon: Building2, label: 'Businesses', value: processedItems.filter(i => i.type === 'business').length, color: 'purple' },
            { icon: Star, label: 'Featured', value: processedItems.filter(i => i.featured).length, color: 'yellow' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border border-gray-100"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <div className={`w-12 h-12 bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-600 rounded-lg flex items-center justify-center mb-4 mx-auto`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Grow Your Business?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of businesses already thriving in our marketplace
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 font-semibold">
              List Your Business
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 font-semibold">
              Explore Features
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}