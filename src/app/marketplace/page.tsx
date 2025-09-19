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

// Compact Card Component for Maximum Information Density
const CompactCard = ({ 
  item, 
  index, 
  layout = 'grid',
  onView,
  onContact
}: { 
  item: MarketplaceItem; 
  index: number; 
  layout: 'grid' | 'masonry' | 'list';
  onView: (id: string, type: string) => void;
  onContact: (id: string, type: string) => void;
}) => {
  const getCardHeight = () => {
    if (layout === 'list') return 'h-32';
    if (layout === 'masonry') {
      const heights = ['h-48', 'h-56', 'h-52', 'h-60', 'h-44'];
      return heights[index % heights.length];
    }
    return 'h-72';
  };

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
      case 'product': return 'from-blue-500 to-cyan-500';
      case 'service': return 'from-orange-500 to-amber-500';
      case 'business': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTypeGradient = () => {
    switch (item.type) {
      case 'product': return 'from-blue-50 to-cyan-50';
      case 'service': return 'from-orange-50 to-amber-50';
      case 'business': return 'from-purple-50 to-pink-50';
      default: return 'from-gray-50 to-gray-100';
    }
  };

  const TypeIcon = getTypeIcon();
  const href = `/${item.type}s/${item.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.05,
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className={layout === 'masonry' ? "break-inside-avoid mb-4" : ""}
      onViewportEnter={() => onView(item.id, item.type)}
    >
      <Link href={href} className="group block h-full">
        <Card className={`
          group h-full bg-white shadow-md border border-gray-100 hover:shadow-2xl 
          hover:border-orange-200 transition-all duration-500 overflow-hidden relative
          ${getCardHeight()}
          ${layout === 'list' ? 'flex flex-row' : ''}
        `}>
          {/* Floating badges */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            {item.featured && (
              <motion.div
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Crown className="h-2 w-2" />
                Featured
              </motion.div>
            )}
            {item.trending && (
              <motion.div
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg"
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.05 + 0.1 }}
              >
                <Flame className="h-2 w-2" />
                Hot
              </motion.div>
            )}
            {item.isPreferred && (
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.05 + 0.2 }}
              >
                <Heart className="h-2 w-2" />
                Preferred
              </motion.div>
            )}
          </div>

          {/* Floating action button */}
          <div className="absolute top-2 right-2 z-10">
            <motion.button
              className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault();
                onContact(item.id, item.type);
              }}
            >
              <ExternalLink className="h-3 w-3 text-gray-600" />
            </motion.button>
          </div>

          <CardContent className={`p-3 h-full flex ${layout === 'list' ? 'flex-row items-center gap-4' : 'flex-col'}`}>
            {/* Image/Icon Area */}
            <div className={`
              ${layout === 'list' ? 'w-24 h-24' : 'w-full h-20 mb-3'} 
              bg-gradient-to-br ${getTypeGradient()} rounded-lg flex items-center justify-center flex-shrink-0
              group-hover:${getTypeGradient().replace('50', '100')} transition-all duration-500
            `}>
              <TypeIcon className={`
                ${layout === 'list' ? 'w-8 h-8' : 'w-10 h-10'} 
                text-${item.type === 'product' ? 'blue' : item.type === 'service' ? 'orange' : 'purple'}-600 
                group-hover:scale-110 transition-all duration-500
              `} />
            </div>

            {/* Content */}
            <div className={`${layout === 'list' ? 'flex-1 min-w-0' : 'flex-1 space-y-2'}`}>
              {/* Title & Rating */}
              <div className={layout === 'list' ? 'flex items-start justify-between mb-2' : ''}>
                <div className={layout === 'list' ? 'flex-1 min-w-0 mr-3' : ''}>
                  <h3 className={`
                    font-bold text-gray-900 group-hover:text-orange-600 transition-colors
                    ${layout === 'list' ? 'text-base line-clamp-1' : 'text-sm line-clamp-2 mb-1'}
                  `}>
                    {item.name}
                  </h3>
                  
                  {/* Verification for businesses */}
                  {item.type === 'business' && item.verified && (
                    <Badge className="bg-green-100 text-green-700 border-green-200 text-xs px-1 py-0 mb-1">
                      <Shield className="h-2 w-2 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium text-gray-900">{item.rating}</span>
                  <span className="text-xs text-gray-500">({item.reviews})</span>
                </div>
              </div>

              {/* Price */}
              {(item.price || item.basePrice) && (
                <div className={`text-lg font-bold ${
                  item.type === 'product' ? 'text-blue-600' : 
                  item.type === 'service' ? 'text-orange-600' : 'text-purple-600'
                } ${layout === 'list' ? 'mb-1' : 'mb-2'}`}>
                  ₹{(item.price || item.basePrice)?.toLocaleString()}
                  {item.type === 'service' && '/hr'}
                </div>
              )}

              {/* Provider/Supplier */}
              <div className={`text-xs text-gray-600 font-medium ${layout === 'list' ? 'mb-1' : 'mb-2'}`}>
                {item.supplier || item.provider?.name || 'Provider'}
              </div>

              {/* Location & Time Info */}
              <div className={`flex ${layout === 'list' ? 'flex-col gap-1' : 'items-center justify-between'} text-xs text-gray-500`}>
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

              {/* Relevance Score */}
              {item.relevanceScore && (
                <div className="flex items-center gap-1 text-xs">
                  <Target className="h-3 w-3 text-orange-500" />
                  <span className="text-orange-600 font-medium">{Math.round(item.relevanceScore * 100)}% match</span>
                </div>
              )}

              {/* Tags */}
              {item.tags && item.tags.length > 0 && layout !== 'list' && (
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 2).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs px-1 py-0 bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-700 transition-colors"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {item.tags.length > 2 && (
                    <Badge variant="secondary" className="text-xs px-1 py-0 bg-orange-100 text-orange-600">
                      +{item.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}

              {/* Action */}
              {layout !== 'list' && (
                <motion.div
                  className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-xs font-semibold text-orange-600 group-hover:text-orange-700">
                    View {item.type}
                  </span>
                  <ChevronRight className="h-3 w-3 text-orange-600 group-hover:text-orange-700 group-hover:translate-x-1 transition-all duration-300" />
                </motion.div>
              )}
            </div>

            {/* List view action button */}
            {layout === 'list' && (
              <div className="flex-shrink-0">
                <Button size="sm" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs px-3">
                  View
                </Button>
              </div>
            )}
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
  const [viewMode, setViewMode] = useState<'grid' | 'masonry' | 'list'>('masonry');
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'price' | 'distance'>('relevance');
  const [showMode, setShowMode] = useState<'personalized' | 'trending' | 'random'>('personalized');
  const [randomSeed, setRandomSeed] = useState(Math.random());

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
    } else if (showMode === 'random') {
      // Randomize with seed for consistency
      filteredItems = filteredItems
        .map(item => ({ ...item, randomSort: Math.sin(randomSeed * item.id.charCodeAt(0)) }))
        .sort((a, b) => (b as any).randomSort - (a as any).randomSort);
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
    randomSeed, 
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

  const handleRandomize = () => {
    setRandomSeed(Math.random());
    setShowMode('random');
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-lg mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="h-5 w-5 text-orange-500" />
              </motion.div>
              <span className="text-gray-600 font-medium">Loading marketplace...</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg animate-pulse h-72"
              >
                <div className="h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-2xl"></div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <MarketplaceHero stats={homepageStats || undefined} />
      
      <div className="container mx-auto px-6 py-12">
        {/* Enhanced Control Panel */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full px-4 py-2 mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Sparkles className="h-4 w-4 text-orange-500" />
              <span className="text-orange-700 font-semibold text-sm">
                {isAuthenticated 
                  ? `${showMode === 'personalized' ? 'Personalized' : showMode === 'trending' ? 'Trending' : 'Discover'} Marketplace` 
                  : 'Explore Marketplace'
                }
              </span>
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {processedItems.length} Items Found
            </h2>
            <p className="text-gray-600">
              {isAuthenticated 
                ? 'Items curated based on your preferences and activity'
                : 'Discover the best products, services, and businesses'
              }
            </p>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            {/* Show Mode Controls */}
            {isAuthenticated && (
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Show Mode</label>
                <div className="flex gap-2">
                  <Button
                    variant={showMode === 'personalized' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShowMode('personalized')}
                    className="flex-1 text-xs"
                  >
                    <Target className="h-3 w-3 mr-1" />
                    For You
                  </Button>
                  <Button
                    variant={showMode === 'trending' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShowMode('trending')}
                    className="flex-1 text-xs"
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Trending
                  </Button>
                  <Button
                    variant={showMode === 'random' ? 'default' : 'outline'}
                    size="sm"
                    onClick={handleRandomize}
                    className="flex-1 text-xs"
                  >
                    <Shuffle className="h-3 w-3 mr-1" />
                    Random
                  </Button>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className={isAuthenticated ? 'lg:col-span-2' : 'lg:col-span-3'}>
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
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">View & Sort</label>
              <div className="flex gap-2">
                {/* View Mode */}
                <select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value as any)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-sm"
                >
                  <option value="masonry">Masonry</option>
                  <option value="grid">Grid</option>
                  <option value="list">List</option>
                </select>

                {/* Sort By */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-sm"
                >
                  <option value="relevance">Relevance</option>
                  <option value="rating">Rating</option>
                  <option value="price">Price</option>
                  <option value="distance">Distance</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dynamic Marketplace Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${showMode}-${randomSeed}-${selectedLocation}-${selectedCategory}-${selectedType}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={
              viewMode === 'masonry' 
                ? "columns-1 md:columns-2 lg:columns-4 gap-6"
                : viewMode === 'list'
                ? "space-y-4"
                : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            }
          >
            {processedItems.map((item, index) => (
              <CompactCard
                key={`${item.id}-${showMode}-${randomSeed}`}
                item={item}
                index={index}
                layout={viewMode}
                onView={handleItemView}
                onContact={handleItemContact}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {processedItems.length === 0 && !loading && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
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
          </motion.div>
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
        <motion.div 
          className="mt-16 text-center bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-12 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
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
        </motion.div>
      </div>
    </div>
  );
}