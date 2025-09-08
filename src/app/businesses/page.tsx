"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { marketplaceApi, type NearbyBusiness } from '@/lib/api/marketplace';
import { AnalyticsService, HomepageStats } from '../../lib/api/analytics';
import BusinessCard from '@/components/business/BusinessCard';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { 
  Search, 
  TrendingUp, 
  Award, 
  MapPin, 
  Building2, 
  Sparkles, 
  ArrowRight, 
  Users, 
  Globe,
  ShieldCheck,
  ExternalLink,
  Grid,
  List,
  SlidersHorizontal
} from 'lucide-react';

// Modern hero section with better design
const BusinessesHero = ({ stats }: { stats?: Partial<HomepageStats> }) => {
  const defaultStats = {
    activeBusinesses: 320,
    verifiedPartners: 180,
    citiesCovered: 45,
    businessSuccessRate: 94
  };

  const displayStats = stats ? {
    activeBusinesses: stats.activeBusinesses || defaultStats.activeBusinesses,
    verifiedPartners: stats.verifiedPartners || defaultStats.verifiedPartners,
    citiesCovered: stats.citiesCovered || defaultStats.citiesCovered,
    businessSuccessRate: stats.businessSuccessRate || defaultStats.businessSuccessRate
  } : defaultStats;
  return (
    <section className="relative min-h-[60vh] bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-4 sm:top-20 left-4 sm:left-20 w-32 h-32 sm:w-72 sm:h-72 bg-white/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-4 sm:bottom-20 right-4 sm:right-20 w-40 h-40 sm:w-96 sm:h-96 bg-cyan-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 40, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-80 sm:h-80 bg-purple-400/20 rounded-full blur-3xl"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6 lg:mb-8"
          >
            <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-300" />
            <span className="text-xs sm:text-sm font-medium text-white">Verified Business Directory</span>
          </motion.div>

          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="text-white">Connect with</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
              Trusted Partners
            </span>
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg lg:text-xl text-indigo-100 max-w-2xl mx-auto mb-8 sm:mb-10 lg:mb-12 leading-relaxed px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Discover verified manufacturers, suppliers, and service providers across India.
            Build meaningful business relationships with confidence and transparency.
          </motion.p>

          {/* Enhanced stats with animations */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {[
              { icon: Building2, label: 'Active Businesses', value: `${displayStats.activeBusinesses.toLocaleString()}+`, color: 'from-blue-400 to-cyan-400' },
              { icon: ShieldCheck, label: 'Verified Partners', value: `${displayStats.verifiedPartners.toLocaleString()}+`, color: 'from-green-400 to-emerald-400' },
              { icon: Globe, label: 'Cities Covered', value: `${displayStats.citiesCovered}+`, color: 'from-purple-400 to-pink-400' },
              { icon: Users, label: 'Success Stories', value: `${displayStats.businessSuccessRate}%`, color: 'from-orange-400 to-red-400' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto mb-2 sm:mb-3 lg:mb-4 bg-gradient-to-r ${stat.color} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-indigo-200 leading-tight">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const pageVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<NearbyBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'nearby' | 'popular' | 'featured'>('nearby');
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState<NearbyBusiness[]>([]);
  const [debounceTimeout, setDebounceTimeout] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [homepageStats, setHomepageStats] = useState<HomepageStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const loadBusinesses = async (tab: typeof activeTab = activeTab) => {
    try {
      setLoading(true);
      setError(null);
      let res;
      if (tab === 'nearby') {
        res = await marketplaceApi.getNearbyBusinesses();
      } else if (tab === 'popular') {
        res = await marketplaceApi.getPopularBusinesses();
      } else {
        res = await marketplaceApi.getFeaturedBusinesses();
      }

      if ((res as any).success) {
        const payload = (res as any).data;
        let source: any[] = [];
        if (Array.isArray(payload)) source = payload;
        else if (Array.isArray(payload?.businesses)) source = payload.businesses;
        else if (Array.isArray(payload?.data)) source = payload.data;
        else if (Array.isArray(payload?.items)) source = payload.items;

        const loaded = source || [];
        setBusinesses(loaded as NearbyBusiness[]);
        setFiltered(loaded as NearbyBusiness[]);
      } else {
        setError((res as any).error || 'Failed to load businesses');
        setBusinesses([]);
        setFiltered([]);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to load businesses');
      setBusinesses([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBusinesses(activeTab);
  }, [activeTab]);

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

  const handleSearch = async (searchQuery: string) => {
    if (debounceTimeout) window.clearTimeout(debounceTimeout);
    
    const timeout = window.setTimeout(async () => {
      const q = searchQuery.trim();
      if (q.length >= 2) {
        try {
          const searchRes = await marketplaceApi.searchMarketplace(q, { type: 'businesses' });
          if ((searchRes as any).success) {
            const payload = (searchRes as any).data;
            let src: any[] = [];
            if (Array.isArray(payload)) src = payload;
            else if (Array.isArray(payload?.businesses)) src = payload.businesses;
            else if (Array.isArray(payload?.data)) src = payload.data;
            else if (Array.isArray(payload?.items)) src = payload.items;

            setFiltered(src || []);
          } else {
            setFiltered([]);
          }
        } catch (e) {
          console.error(e);
          setFiltered([]);
        }
      } else if (q === '') {
        setFiltered(businesses);
      } else {
        const qq = q.toLowerCase();
        setFiltered(businesses.filter(b => 
          (b.name || '').toLowerCase().includes(qq) || 
          (b.category || '').toLowerCase().includes(qq) || 
          (b.address || '').toLowerCase().includes(qq)
        ));
      }
    }, 300);
    
    setDebounceTimeout(timeout as unknown as number);
  };

  const tabs = [
    { 
      id: 'nearby', 
      label: 'Nearby', 
      icon: MapPin, 
      description: 'Businesses in your area',
      color: 'from-amber-600 to-orange-600'
    },
    { 
      id: 'popular', 
      label: 'Popular', 
      icon: TrendingUp, 
      description: 'Most trusted suppliers',
      color: 'from-orange-600 to-red-600'
    },
    { 
      id: 'featured', 
      label: 'Featured', 
      icon: Award, 
      description: 'Premium verified suppliers',
      color: 'from-red-600 to-pink-600'
    }
  ];

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      variants={pageVariants}
      className="min-h-screen bg-gray-50"
    >
      <BusinessesHero stats={homepageStats || undefined} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
          {/* Search and Filters Card */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="show"
          className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12 border border-amber-200"
        >
          {/* Search Bar */}
          <div className="relative mb-6 sm:mb-8">
            <div className="absolute inset-y-0 left-4 sm:left-6 flex items-center pointer-events-none">
              <Search className="w-4 h-4 sm:w-5 sm:w-6 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search businesses, categories, or locations..."
              value={query}
              onChange={(e) => {
                const value = e.target.value;
                setQuery(value);
                handleSearch(value);
              }}
              className="w-full pl-10 sm:pl-14 lg:pl-16 pr-4 sm:pr-6 py-3 sm:py-4 lg:py-5 text-sm sm:text-base lg:text-lg border-2 border-amber-200 rounded-xl sm:rounded-2xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 font-medium min-h-[48px]"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative flex items-center gap-3 sm:gap-4 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 min-h-[48px] ${
                    isActive
                      ? 'text-white shadow-xl transform scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-amber-50 hover:scale-102'
                  }`}
                  whileHover={{ scale: isActive ? 1.05 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabBg"
                      className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-xl sm:rounded-2xl`}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className="relative flex items-center gap-3 sm:gap-4">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                    <div className="text-left">
                      <div className="font-bold text-sm sm:text-base lg:text-lg">{tab.label}</div>
                      <div className={`text-xs sm:text-sm ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                        {tab.description}
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl transition-colors duration-300 font-medium min-h-[48px] w-full sm:w-auto"
              >
                <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Filters</span>
              </button>

              <div className="text-xs sm:text-sm text-gray-700 font-medium text-center sm:text-left">
                {filtered.length} {filtered.length === 1 ? 'business' : 'businesses'} found
              </div>
            </div>

            <div className="flex items-center gap-2 bg-amber-100 rounded-xl p-1 min-h-[48px]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 sm:p-3 rounded-lg transition-colors duration-300 ${
                  viewMode === 'grid'
                    ? 'bg-white shadow-sm text-amber-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 sm:p-3 rounded-lg transition-colors duration-300 ${
                  viewMode === 'list'
                    ? 'bg-white shadow-sm text-amber-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        {loading || statsLoading ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={`grid gap-4 sm:gap-6 lg:gap-8 ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1 max-w-4xl mx-auto'
            }`}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div key={i} variants={itemVariants}>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
                  <div className="p-4 sm:p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 bg-gray-100 rounded w-2/3 animate-pulse" />
                    <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse" />
                    <div className="flex gap-2">
                      <div className="h-8 bg-gray-200 rounded animate-pulse flex-1" />
                      <div className="h-8 bg-gray-200 rounded animate-pulse flex-1" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : error ? (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="show"
            className="bg-white/80 backdrop-blur-sm border border-red-200 rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-12 text-center shadow-lg"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto mb-4 sm:mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <ExternalLink className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-red-600" />
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">Unable to load businesses</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto">{error}</p>
            <button
              onClick={() => loadBusinesses(activeTab)}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl min-h-[48px] text-sm sm:text-base"
            >
              Try Again
            </button>
          </motion.div>
        ) : filtered.length === 0 ? (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="show"
            className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-12 lg:p-16 text-center shadow-lg"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6 lg:mb-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-indigo-600" />
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">No businesses found</h3>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8 lg:mb-10 max-w-lg mx-auto">
              We couldn't find any businesses matching your criteria. Try adjusting your search or explore different categories.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={() => { setQuery(''); setFiltered(businesses); }}
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 sm:gap-3 min-h-[48px] text-sm sm:text-base"
              >
                Show All Businesses
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => { setActiveTab('featured'); loadBusinesses('featured'); }}
                className="bg-white hover:bg-amber-50 border-2 border-amber-500 text-amber-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl min-h-[48px] text-sm sm:text-base"
              >
                Browse Featured
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={`grid gap-4 sm:gap-6 lg:gap-8 pb-12 sm:pb-16 lg:pb-20 ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1 max-w-4xl mx-auto'
            }`}
          >
            {filtered.map((business, index) => (
              <motion.div key={business.id || index} variants={itemVariants}>
                <BusinessCard business={business} viewMode={viewMode} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
