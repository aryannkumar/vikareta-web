"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { marketplaceApi, type NearbyBusiness } from '@/lib/api/marketplace';
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
const BusinessesHero = () => {
  return (
    <section className="relative min-h-[60vh] bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, 100, 0], 
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl"
          animate={{ 
            x: [0, -80, 0], 
            y: [0, 40, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8"
          >
            <Building2 className="w-5 h-5 text-cyan-300" />
            <span className="text-white font-medium">Verified Business Directory</span>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
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
            className="text-xl text-indigo-100 max-w-3xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Discover verified manufacturers, suppliers, and service providers across India. 
            Build meaningful business relationships with confidence and transparency.
          </motion.p>

          {/* Enhanced stats with animations */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {[
              { icon: Building2, label: 'Active Businesses', value: '15K+', color: 'from-blue-400 to-cyan-400' },
              { icon: ShieldCheck, label: 'Verified Partners', value: '8K+', color: 'from-green-400 to-emerald-400' },
              { icon: Globe, label: 'Cities Covered', value: '200+', color: 'from-purple-400 to-pink-400' },
              { icon: Users, label: 'Success Stories', value: '98%', color: 'from-orange-400 to-red-400' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-indigo-200">{stat.label}</div>
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
      color: 'from-blue-600 to-cyan-600'
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
      color: 'from-purple-600 to-pink-600'
    }
  ];

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      variants={pageVariants}
      className="min-h-screen bg-gray-50"
    >
      <BusinessesHero />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        {/* Search and Filters Card */}
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate="show"
          className="bg-white rounded-3xl shadow-2xl p-8 mb-12 border border-gray-200"
        >
          {/* Search Bar */}
          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <Search className="w-6 h-6 text-gray-400" />
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
              className="w-full pl-16 pr-6 py-5 text-lg border-2 border-gray-200 rounded-2xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-4 mb-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative flex items-center gap-4 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 min-w-[200px] ${
                    isActive
                      ? 'text-white shadow-xl transform scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
                  }`}
                  whileHover={{ scale: isActive ? 1.05 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabBg"
                      className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-2xl`}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className="relative flex items-center gap-4">
                    <Icon className="w-6 h-6" />
                    <div className="text-left">
                      <div className="font-bold text-lg">{tab.label}</div>
                      <div className={`text-sm ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                        {tab.description}
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-300"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </button>
              
              <div className="text-sm text-gray-600">
                {filtered.length} {filtered.length === 1 ? 'business' : 'businesses'} found
              </div>
            </div>

            <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors duration-300 ${
                  viewMode === 'grid' 
                    ? 'bg-white shadow-sm text-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors duration-300 ${
                  viewMode === 'list' 
                    ? 'bg-white shadow-sm text-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        {loading ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div key={i} variants={itemVariants}>
                <LoadingSkeleton type="card" count={1} />
              </motion.div>
            ))}
          </motion.div>
        ) : error ? (
          <motion.div 
            variants={itemVariants}
            initial="hidden"
            animate="show"
            className="bg-white border border-red-200 rounded-3xl p-12 text-center shadow-lg"
          >
            <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <ExternalLink className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Unable to load businesses</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">{error}</p>
            <button 
              onClick={() => loadBusinesses(activeTab)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Try Again
            </button>
          </motion.div>
        ) : filtered.length === 0 ? (
          <motion.div 
            variants={itemVariants}
            initial="hidden"
            animate="show"
            className="bg-white rounded-3xl p-16 text-center shadow-lg"
          >
            <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-indigo-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">No businesses found</h3>
            <p className="text-gray-600 mb-10 max-w-lg mx-auto text-lg">
              We couldn't find any businesses matching your criteria. Try adjusting your search or explore different categories.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button 
                onClick={() => { setQuery(''); setFiltered(businesses); }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3"
              >
                Show All Businesses
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => { setActiveTab('featured'); loadBusinesses('featured'); }}
                className="bg-white hover:bg-gray-50 border-2 border-indigo-500 text-indigo-600 px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
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
            className={`grid gap-8 pb-20 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
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
