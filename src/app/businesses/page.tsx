"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { marketplaceApi, type NearbyBusiness } from '@/lib/api/marketplace';
import BusinessCard from '@/components/business/BusinessCard';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { Search, Filter, TrendingUp, Award, MapPin, Building2, Sparkles, ArrowRight } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
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
  hidden: { opacity: 0, y: 30 },
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
  const [stats, setStats] = useState({ total: 0, verified: 0, premium: 0 });

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

        // Calculate stats
        const totalCount = loaded.length;
        const verifiedCount = loaded.filter((b: any) => b.isVerified || b.verificationTier === 'premium').length;
        const premiumCount = loaded.filter((b: any) => b.verificationTier === 'premium').length;
        setStats({ total: totalCount, verified: verifiedCount, premium: premiumCount });

        // Apply query filter immediately
        if (query.trim() === '') {
          setFiltered(loaded as NearbyBusiness[]);
        } else {
          const q = query.toLowerCase();
          setFiltered((loaded as NearbyBusiness[]).filter(b => 
            (b.name || '').toLowerCase().includes(q) || 
            (b.category || '').toLowerCase().includes(q) || 
            (b.address || '').toLowerCase().includes(q)
          ));
        }
      } else {
        setError((res as any).error || 'Failed to load businesses');
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to load businesses');
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
    { id: 'nearby', label: 'Nearby', icon: MapPin, description: 'Businesses in your area' },
    { id: 'popular', label: 'Popular', icon: TrendingUp, description: 'Most ordered suppliers' },
    { id: 'featured', label: 'Featured', icon: Award, description: 'Premium verified suppliers' }
  ];

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      variants={pageVariants}
    className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      {/* Hero Section */}
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700">
        {/* Background Pattern */}
        <div className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
          {/* Subtle moving blobs */}
          <motion.div
            className="absolute -top-10 -left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"
            animate={{ x: [0, 30, -20, 0], y: [0, -20, 15, 0] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-16 -right-12 w-80 h-80 bg-white/10 rounded-full blur-3xl"
            animate={{ x: [0, -25, 25, 0], y: [0, 20, -20, 0] }}
            transition={{ duration: 34, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          />
        </div>

        <div className="relative container mx-auto px-6 py-16">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Building2 className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Premium B2B Directory</span>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Discover India's 
              <span className="block bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent">
                Premier Suppliers
              </span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Connect with verified manufacturers, wholesalers, and service providers across India. 
              Build lasting business relationships with confidence.
            </motion.p>

            {/* Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-6 max-w-lg mx-auto mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{stats.total}+</div>
                <div className="text-blue-200 text-sm">Suppliers</div>
              </div>
              <div className="text-center border-x border-blue-400/30">
                <div className="text-3xl font-bold text-white">{stats.verified}+</div>
                <div className="text-blue-200 text-sm">Verified</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{stats.premium}+</div>
                <div className="text-blue-200 text-sm">Premium</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-8 relative z-10">
        {/* Search and Filters */}
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate="show"
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border border-gray-200 dark:border-gray-700"
        >
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by business name, category, or location..."
              value={query}
              onChange={(e) => {
                const value = e.target.value;
                setQuery(value);
                handleSearch(value);
              }}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  <div className="text-left">
                    <div className="font-semibold">{tab.label}</div>
                    <div className={`text-xs ${isActive ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                      {tab.description}
                    </div>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Results */}
        {loading ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center"
          >
            <div className="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">Failed to load businesses</div>
            <div className="text-red-500 dark:text-red-300 mb-4">{error}</div>
            <button 
              onClick={() => loadBusinesses(activeTab)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
            >
              Try Again
            </button>
          </motion.div>
        ) : filtered.length === 0 ? (
          <motion.div 
            variants={itemVariants}
            initial="hidden"
            animate="show"
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No suppliers found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              We couldn't find any suppliers matching your criteria. Try adjusting your search or browse different categories.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button 
                onClick={() => { setQuery(''); setFiltered(businesses); }}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
              >
                Show All Suppliers
                <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => { setActiveTab('featured'); loadBusinesses('featured'); }}
                className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 border-2 border-blue-500 text-blue-600 dark:text-blue-400 px-6 py-3 rounded-lg font-semibold transition-all duration-300"
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16"
          >
            {filtered.map((business, index) => (
              <motion.div key={business.id || index} variants={itemVariants}>
                <BusinessCard business={business} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
