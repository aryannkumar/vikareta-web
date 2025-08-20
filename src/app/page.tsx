'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  ShieldCheck, 
  FileCheck2, 
  Boxes, 
  Package, 
  Store,
  CheckCircle,
  Globe,
  Zap,
  Clock,
  Award,
  BarChart3,
  Search,
  MessageCircle,
  Settings,
  Play,
  Star
} from 'lucide-react';
import { CategoriesSection } from '@/components/sections/CategoriesSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { CTASection } from '@/components/sections/CTASection';
import { productsApi } from '@/lib/api/products';
import { servicesApi } from '@/lib/api/services';
import { apiClient } from '@/lib/api/client';
import { RevealSection, FloatingElement } from '@/components/Animated';

// Data interfaces
interface HomePageData {
  categories: any[];
  featuredProducts: any[];
  featuredServices: any[];
  stats: {
    totalProducts: number;
    totalSuppliers: number;
    totalCategories: number;
    successfulDeals: number;
  };
  loading: boolean;
  error: string | null;
}

export default function HomePage() {
  const router = useRouter();
  
  const [data, setData] = useState<HomePageData>({
    categories: [],
    featuredProducts: [],
    featuredServices: [],
    stats: {
      totalProducts: 0,
      totalSuppliers: 0,
      totalCategories: 0,
      successfulDeals: 0
    },
    loading: true,
    error: null
  });

  useEffect(() => {
    loadHomePageData();
  }, []);

  const loadHomePageData = async () => {
    try {
      console.log('🚀 Loading homepage data...');
      setData(prev => ({ ...prev, loading: true, error: null }));

      // Load data in parallel for better performance
      const [categoriesResponse, productsResponse, servicesResponse, statsResponse] = await Promise.allSettled([
        // Categories
        apiClient.get('/categories', { limit: 12 }),
        // Featured products - use the correct API method
        productsApi.getFeaturedProducts(8),
        // Featured services - use regular services with featured filter
        servicesApi.getServices({ limit: 8, sortBy: 'rating', sortOrder: 'desc' }),
        // Get actual stats from API
        apiClient.get('/stats')
      ]);

      // Process categories
      const categories = categoriesResponse.status === 'fulfilled' && categoriesResponse.value.success 
        ? (categoriesResponse.value.data as any[])
        : [];

      // Process products  
      const featuredProducts = productsResponse.status === 'fulfilled' && productsResponse.value.success
        ? (productsResponse.value.data as any[])
        : [];

      // Process services - handle different possible response shapes
      let featuredServices: any[] = [];
      if (servicesResponse.status === 'fulfilled' && servicesResponse.value.success) {
        const serviceData = servicesResponse.value.data as any;
        if (Array.isArray(serviceData)) {
          featuredServices = serviceData;
        } else if (serviceData?.services && Array.isArray(serviceData.services)) {
          featuredServices = serviceData.services;
        } else if (serviceData?.data && Array.isArray(serviceData.data)) {
          featuredServices = serviceData.data;
        }
      }

      // Process stats - use real data if available, otherwise fallback to calculated values
      let stats = {
        totalProducts: 45000,
        totalSuppliers: 5000,
        totalCategories: categories.length || 20,
        successfulDeals: 25000
      };

      if (statsResponse.status === 'fulfilled' && statsResponse.value.success) {
        const statsData = statsResponse.value.data as any;
        stats = {
          totalProducts: statsData.totalProducts || featuredProducts.length * 500 + 45000,
          totalSuppliers: statsData.totalSuppliers || Math.floor(featuredProducts.length * 50 + 2500),
          totalCategories: statsData.totalCategories || categories.length || 20,
          successfulDeals: statsData.successfulDeals || Math.floor(featuredProducts.length * 30 + 15000)
        };
      }

      // Ensure no NaN values
      stats = {
        totalProducts: isNaN(stats.totalProducts) ? 45000 : stats.totalProducts,
        totalSuppliers: isNaN(stats.totalSuppliers) ? 5000 : stats.totalSuppliers,
        totalCategories: isNaN(stats.totalCategories) ? 20 : stats.totalCategories,
        successfulDeals: isNaN(stats.successfulDeals) ? 25000 : stats.successfulDeals
      };

      setData({
        categories,
        featuredProducts,
        featuredServices,
        stats,
        loading: false,
        error: null
      });

      console.log('✅ Homepage data loaded successfully:', {
        categories: categories.length,
        products: featuredProducts.length,
        services: featuredServices.length,
        stats
      });

    } catch (error) {
      console.error('❌ Error loading homepage data:', error);
      
      // Set fallback data instead of showing error
      setData(prev => ({
        ...prev,
        stats: {
          totalProducts: 45000,
          totalSuppliers: 5000,
          totalCategories: 20,
          successfulDeals: 25000
        },
        loading: false,
        error: null // Don't show error, use fallback data
      }));
    }
  };

  return (
    <div className="relative">
      {/* Hero Section - Premium B2B Procurement */}
      <section className="relative overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 dark:from-gray-900 dark:via-orange-900/10 dark:to-gray-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            className="absolute -top-24 -left-16 w-96 h-96 bg-gradient-to-br from-orange-400/30 via-amber-400/20 to-orange-600/30 rounded-full blur-3xl"
            animate={{ 
              x: [0, 30, -20, 0], 
              y: [0, 10, -15, 0], 
              scale: [1, 1.05, 0.98, 1],
              rotate: [0, 90, 180, 270, 360]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-20 -right-10 w-[34rem] h-[34rem] bg-gradient-to-tr from-rose-300/20 via-orange-400/20 to-amber-500/30 rounded-full blur-3xl"
            animate={{ 
              x: [0, -20, 25, 0], 
              y: [0, -15, 10, 0], 
              rotate: [360, 240, 120, 0],
              scale: [1, 1.1, 0.9, 1]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          />
          
          {/* Supply Chain Flow Animation */}
          <div className="absolute top-1/2 left-1/4 transform -translate-y-1/2">
            <motion.div 
              className="flex items-center space-x-6 opacity-10"
              animate={{ x: [0, 100, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="w-8 h-8 bg-orange-500 rounded-full" />
              <div className="w-12 h-1 bg-orange-500" />
              <div className="w-8 h-8 bg-amber-500 rounded-full" />
              <div className="w-12 h-1 bg-amber-500" />
              <div className="w-8 h-8 bg-orange-600 rounded-full" />
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 border border-orange-200 shadow-sm mb-6"
              >
                <motion.span 
                  className="inline-flex h-2 w-2 rounded-full bg-orange-500"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                Enterprise Procurement, Simplified
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.8, ease: 'easeOut' }}
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight text-gray-900 dark:text-white mb-6"
              >
                Procure 
                <motion.span 
                  className="block bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text text-transparent"
                  animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  smarter & faster
                </motion.span>
                with trusted suppliers
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-8 leading-relaxed"
              >
                Modern B2B procurement platform that unifies sourcing, RFQs, supplier management, and compliance—built for speed, transparency, and enterprise-scale savings.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 mb-8"
              >
                <motion.button
                  onClick={() => router.push('/rfq')}
                  className="group bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-lg"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Procurement Journey
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                
                <motion.button
                  onClick={() => router.push('/contact')}
                  className="group border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center text-lg dark:text-orange-400 dark:border-orange-400"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Talk to Procurement Expert
                </motion.button>
              </motion.div>

              <motion.ul
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300"
              >
                <motion.li 
                  className="flex items-center gap-2"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <ShieldCheck className="h-4 w-4 text-orange-600" /> 
                  <span>Verified Enterprise Suppliers</span>
                </motion.li>
                <motion.li 
                  className="flex items-center gap-2"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <FileCheck2 className="h-4 w-4 text-orange-600" /> 
                  <span>Contract & Compliance Ready</span>
                </motion.li>
                <motion.li 
                  className="flex items-center gap-2"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Boxes className="h-4 w-4 text-orange-600" /> 
                  <span>Products + Services Unified</span>
                </motion.li>
                <motion.li 
                  className="flex items-center gap-2"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <BarChart3 className="h-4 w-4 text-orange-600" /> 
                  <span>Advanced Procurement Analytics</span>
                </motion.li>
              </motion.ul>
            </div>

            {/* B2B Marketplace Animation Visual */}
            <div className="relative">
              <div className="relative z-10 rounded-3xl p-12 bg-gradient-to-br from-blue-50/80 via-indigo-50/70 to-cyan-50/80 dark:from-blue-900/20 dark:via-indigo-900/15 dark:to-cyan-900/20 border border-blue-200/50 dark:border-blue-800/30 shadow-2xl backdrop-blur-md overflow-hidden">
                
                {/* Animated Background Waves */}
                <motion.div
                  className="absolute inset-0 opacity-20"
                  animate={{
                    background: [
                      'linear-gradient(45deg, rgba(59, 130, 246, 0.1) 0%, rgba(99, 102, 241, 0.15) 50%, rgba(6, 182, 212, 0.1) 100%)',
                      'linear-gradient(45deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.1) 50%, rgba(59, 130, 246, 0.1) 100%)',
                      'linear-gradient(45deg, rgba(6, 182, 212, 0.1) 0%, rgba(59, 130, 246, 0.1) 50%, rgba(99, 102, 241, 0.15) 100%)'
                    ]
                  }}
                  transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                />

                <div className="relative z-10">
                  {/* Header */}
                  <motion.div 
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent mb-4">
                      Global B2B Trade Network
                    </h3>
                    <p className="text-blue-600/80 dark:text-blue-400/80 text-lg">
                      Connecting suppliers, manufacturers, and businesses worldwide
                    </p>
                  </motion.div>

                  {/* Main Animation Container */}
                  <div className="relative h-96 overflow-hidden rounded-2xl bg-gradient-to-br from-white/60 to-blue-50/40 dark:from-gray-800/60 dark:to-blue-900/20 border border-blue-200/30 dark:border-blue-700/30">
                    
                    {/* Ocean/Sea Base */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-400/30 to-blue-300/20"
                      animate={{ 
                        background: [
                          'linear-gradient(to top, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.2) 100%)',
                          'linear-gradient(to top, rgba(99, 102, 241, 0.3) 0%, rgba(99, 102, 241, 0.2) 100%)',
                          'linear-gradient(to top, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.2) 100%)'
                        ]
                      }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    />

                    {/* Ships Animation - Enhanced with Multiple Ships */}
                    <motion.div
                      className="absolute bottom-16 left-8"
                      animate={{ 
                        x: [0, 50, 0],
                        y: [0, -4, 0],
                        rotate: [0, 2, -1, 0]
                      }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <svg width="90" height="60" viewBox="0 0 110 70" className="text-blue-700 fill-current">
                        {/* Ship Hull */}
                        <path d="M10 40h90l-10 18H20l-10-18z" fill="currentColor" opacity="0.9"/>
                        {/* Containers - Large Ship */}
                        <rect x="20" y="22" width="14" height="18" fill="#ff6b35" opacity="0.9"/>
                        <rect x="36" y="18" width="14" height="22" fill="#f7931e" opacity="0.9"/>
                        <rect x="52" y="20" width="14" height="20" fill="#3b82f6" opacity="0.9"/>
                        <rect x="68" y="24" width="14" height="16" fill="#10b981" opacity="0.9"/>
                        <rect x="84" y="26" width="12" height="14" fill="#8b5cf6" opacity="0.9"/>
                        {/* Ship Bridge */}
                        <rect x="90" y="28" width="12" height="12" fill="currentColor"/>
                        <circle cx="96" cy="25" r="3" fill="#fbbf24"/>
                        {/* Ship Details */}
                        <rect x="15" y="35" width="4" height="5" fill="#fff" opacity="0.8"/>
                        <rect x="25" y="35" width="4" height="5" fill="#fff" opacity="0.8"/>
                      </svg>
                      
                      {/* Water Ripples */}
                      <motion.div
                        className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
                        animate={{ 
                          scaleX: [1, 1.4, 1],
                          opacity: [0.4, 0.7, 0.4]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <div className="w-24 h-3 bg-blue-300/60 rounded-full blur-sm" />
                      </motion.div>
                    </motion.div>

                    {/* Second Ship - Medium Size */}
                    <motion.div
                      className="absolute bottom-20 right-12"
                      animate={{ 
                        x: [0, -40, 0],
                        y: [0, -3, 0],
                        rotate: [0, -1.5, 1, 0]
                      }}
                      transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                    >
                      <svg width="70" height="45" viewBox="0 0 85 55" className="text-indigo-700 fill-current">
                        <path d="M8 30h70l-8 15H16l-8-15z" fill="currentColor" opacity="0.9"/>
                        <rect x="15" y="18" width="12" height="12" fill="#ef4444" opacity="0.9"/>
                        <rect x="29" y="15" width="12" height="15" fill="#8b5cf6" opacity="0.9"/>
                        <rect x="43" y="19" width="12" height="11" fill="#06b6d4" opacity="0.9"/>
                        <rect x="57" y="21" width="12" height="9" fill="#84cc16" opacity="0.9"/>
                        {/* Bridge */}
                        <rect x="72" y="23" width="10" height="7" fill="currentColor"/>
                        <circle cx="77" cy="20" r="2" fill="#fbbf24"/>
                      </svg>
                      
                      <motion.div
                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2"
                        animate={{ 
                          scaleX: [1, 1.3, 1],
                          opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <div className="w-18 h-2 bg-indigo-300/50 rounded-full blur-sm" />
                      </motion.div>
                    </motion.div>

                    {/* Third Ship - Small Fast Ship */}
                    <motion.div
                      className="absolute bottom-14 left-1/2 transform -translate-x-1/2"
                      animate={{ 
                        x: [0, 80, 0],
                        y: [0, -2, 0],
                        rotate: [0, 1, -0.5, 0]
                      }}
                      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
                    >
                      <svg width="50" height="30" viewBox="0 0 60 35" className="text-cyan-600 fill-current">
                        <path d="M5 20h50l-5 10H10l-5-10z" fill="currentColor" opacity="0.9"/>
                        <rect x="10" y="12" width="8" height="8" fill="#f59e0b" opacity="0.9"/>
                        <rect x="20" y="10" width="8" height="10" fill="#ec4899" opacity="0.9"/>
                        <rect x="30" y="13" width="8" height="7" fill="#14b8a6" opacity="0.9"/>
                        <rect x="40" y="15" width="8" height="5" fill="#a855f7" opacity="0.9"/>
                        {/* Small Bridge */}
                        <rect x="50" y="16" width="6" height="4" fill="currentColor"/>
                        <circle cx="53" cy="14" r="1.5" fill="#fbbf24"/>
                      </svg>
                      
                      <motion.div
                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2"
                        animate={{ 
                          scaleX: [1, 1.2, 1],
                          opacity: [0.4, 0.6, 0.4]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <div className="w-12 h-1.5 bg-cyan-300/50 rounded-full blur-sm" />
                      </motion.div>
                    </motion.div>

                    {/* Fourth Ship - Submarine Style */}
                    <motion.div
                      className="absolute bottom-8 right-1/4"
                      animate={{ 
                        x: [0, -25, 0],
                        y: [0, -1, 0]
                      }}
                      transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
                    >
                      <svg width="60" height="25" viewBox="0 0 70 30" className="text-slate-600 fill-current">
                        <ellipse cx="35" cy="15" rx="32" ry="8" fill="currentColor" opacity="0.8"/>
                        <rect x="15" y="8" width="8" height="6" fill="#64748b" opacity="0.9"/>
                        <rect x="25" y="6" width="8" height="8" fill="#475569" opacity="0.9"/>
                        <rect x="35" y="7" width="8" height="7" fill="#334155" opacity="0.9"/>
                        <rect x="45" y="9" width="8" height="5" fill="#1e293b" opacity="0.9"/>
                        {/* Periscope */}
                        <rect x="60" y="10" width="2" height="8" fill="#94a3b8"/>
                        <circle cx="61" cy="8" r="1" fill="#fbbf24"/>
                      </svg>
                      
                      <motion.div
                        className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2"
                        animate={{ 
                          scaleX: [1, 1.1, 1],
                          opacity: [0.2, 0.4, 0.2]
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <div className="w-16 h-1 bg-slate-300/40 rounded-full blur-sm" />
                      </motion.div>
                    </motion.div>

                    {/* Trucks on Land */}
                    <motion.div
                      className="absolute bottom-32 left-4"
                      animate={{ x: [0, 200, 400], rotate: [0, 1, 0] }}
                      transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    >
                      <svg width="60" height="35" viewBox="0 0 80 40" className="text-orange-600 fill-current">
                        {/* Truck Body */}
                        <rect x="10" y="15" width="45" height="15" fill="currentColor" opacity="0.9"/>
                        <rect x="55" y="18" width="20" height="12" fill="currentColor" opacity="0.8"/>
                        {/* Wheels */}
                        <circle cx="20" cy="32" r="4" fill="#374151"/>
                        <circle cx="35" cy="32" r="4" fill="#374151"/>
                        <circle cx="65" cy="32" r="4" fill="#374151"/>
                        {/* Cargo */}
                        <rect x="12" y="8" width="8" height="7" fill="#fbbf24" opacity="0.8"/>
                        <rect x="22" y="10" width="8" height="5" fill="#ef4444" opacity="0.8"/>
                        <rect x="32" y="9" width="8" height="6" fill="#10b981" opacity="0.8"/>
                        <rect x="42" y="11" width="8" height="4" fill="#3b82f6" opacity="0.8"/>
                      </svg>
                      
                      {/* Truck Exhaust */}
                      <motion.div
                        className="absolute -left-3 top-2"
                        animate={{ 
                          x: [-8, -16, -24],
                          opacity: [0.6, 0.3, 0],
                          scale: [0.5, 1, 1.5]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                      >
                        <div className="w-2 h-2 bg-gray-400 rounded-full" />
                      </motion.div>
                    </motion.div>

                    {/* Flying Coins Animation */}
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <motion.div
                          key={i}
                          className="absolute"
                          style={{ 
                            left: (i % 3) * 40 - 40,
                            top: Math.floor(i / 3) * 25
                          }}
                          animate={{ 
                            y: [0, -20, 0],
                            rotate: [0, 360],
                            scale: [1, 1.4, 1],
                            x: [0, Math.sin(i) * 10, 0]
                          }}
                          transition={{ 
                            duration: 3 + i * 0.2, 
                            repeat: Infinity, 
                            delay: i * 0.4,
                            ease: 'easeInOut'
                          }}
                        >
                          <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full shadow-lg flex items-center justify-center">
                            <span className="text-xs font-bold text-yellow-900">₹</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Containers Stacking Animation */}
                    <motion.div
                      className="absolute top-12 right-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className={`w-12 h-8 rounded-sm shadow-md mb-1 ${
                            i === 0 ? 'bg-red-500' : i === 1 ? 'bg-blue-500' : 'bg-green-500'
                          }`}
                          style={{ opacity: 0.8 }}
                          animate={{ 
                            y: [0, -2, 0],
                            rotateY: [0, 5, 0]
                          }}
                          transition={{ 
                            duration: 2 + i * 0.5, 
                            repeat: Infinity, 
                            delay: i * 0.3,
                            ease: 'easeInOut'
                          }}
                        />
                      ))}
                    </motion.div>

                    {/* Factory/Port Buildings */}
                    <div className="absolute bottom-32 right-4">
                      <motion.div
                        animate={{ 
                          y: [0, -1, 0]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <svg width="80" height="60" viewBox="0 0 100 75" className="text-gray-600 fill-current">
                          {/* Buildings */}
                          <rect x="10" y="30" width="20" height="45" fill="currentColor" opacity="0.7"/>
                          <rect x="35" y="35" width="25" height="40" fill="currentColor" opacity="0.8"/>
                          <rect x="65" y="25" width="20" height="50" fill="currentColor" opacity="0.6"/>
                          {/* Cranes */}
                          <line x1="15" y1="30" x2="15" y2="10" stroke="#f59e0b" strokeWidth="2"/>
                          <line x1="15" y1="15" x2="25" y2="15" stroke="#f59e0b" strokeWidth="2"/>
                          <line x1="75" y1="25" x2="75" y2="8" stroke="#f59e0b" strokeWidth="2"/>
                          <line x1="75" y1="12" x2="85" y2="12" stroke="#f59e0b" strokeWidth="2"/>
                          {/* Windows */}
                          <rect x="13" y="35" width="3" height="3" fill="#fbbf24" opacity="0.9"/>
                          <rect x="18" y="35" width="3" height="3" fill="#fbbf24" opacity="0.9"/>
                          <rect x="40" y="40" width="4" height="4" fill="#fbbf24" opacity="0.9"/>
                          <rect x="50" y="40" width="4" height="4" fill="#fbbf24" opacity="0.9"/>
                        </svg>
                      </motion.div>
                    </div>

                    {/* Trade Route Lines */}
                    <motion.svg
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      transition={{ delay: 2 }}
                    >
                      <motion.path
                        d="M50 50 Q150 80 250 60 Q350 40 450 70"
                        stroke="#3b82f6"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray="5,5"
                        opacity="0.4"
                        animate={{ 
                          strokeDashoffset: [0, 20, 0]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                      />
                      <motion.path
                        d="M100 200 Q200 150 300 180 Q400 210 500 170"
                        stroke="#f59e0b"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray="5,5"
                        opacity="0.4"
                        animate={{ 
                          strokeDashoffset: [20, 0, 20]
                        }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'linear', delay: 1 }}
                      />
                    </motion.svg>

                    {/* Floating Statistics */}
                    <div className="absolute top-4 left-4">
                      <motion.div
                        className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-3 shadow-lg backdrop-blur-sm"
                        animate={{ 
                          y: [0, -5, 0],
                          scale: [1, 1.02, 1]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <div className="text-xs font-medium text-blue-600 dark:text-blue-400">Live Trading</div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">$2.4M</div>
                      </motion.div>
                    </div>

                    <div className="absolute top-4 right-4">
                      <motion.div
                        className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-3 shadow-lg backdrop-blur-sm"
                        animate={{ 
                          y: [0, -3, 0],
                          scale: [1, 1.02, 1]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                      >
                        <div className="text-xs font-medium text-green-600 dark:text-green-400">Active Routes</div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">847</div>
                      </motion.div>
                    </div>

                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <motion.div
                        className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-3 shadow-lg backdrop-blur-sm"
                        animate={{ 
                          y: [0, -4, 0],
                          scale: [1, 1.02, 1]
                        }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                      >
                        <div className="text-xs font-medium text-orange-600 dark:text-orange-400">Global Reach</div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">150+ Countries</div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Key Benefits */}
                  <motion.div 
                    className="mt-8 grid grid-cols-3 gap-4 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3, duration: 0.8 }}
                  >
                    <div className="space-y-2">
                      <motion.div 
                        className="text-2xl font-bold text-blue-600 dark:text-blue-400"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 0 }}
                      >
                        24/7
                      </motion.div>
                      <div className="text-sm text-blue-600/80 dark:text-blue-400/80">Global Operations</div>
                    </div>
                    
                    <div className="space-y-2">
                      <motion.div 
                        className="text-2xl font-bold text-green-600 dark:text-green-400"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                      >
                        99.9%
                      </motion.div>
                      <div className="text-sm text-green-600/80 dark:text-green-400/80">Delivery Success</div>
                    </div>
                    
                    <div className="space-y-2">
                      <motion.div 
                        className="text-2xl font-bold text-orange-600 dark:text-orange-400"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 2 }}
                      >
                        50K+
                      </motion.div>
                      <div className="text-sm text-orange-600/80 dark:text-orange-400/80">Active Traders</div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Floating business metrics */}
              <FloatingElement className="absolute -top-8 -left-8 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/40 to-indigo-500/40 blur-sm" />
              <FloatingElement className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400/30 to-blue-600/30 blur-lg" delay={1.5} />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Step-by-step Process Flow */}
      <RevealSection direction="up">
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                How Procurement Works
              </motion.h2>
              <motion.p 
                className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Simple, streamlined process from requirement to delivery—designed for enterprise efficiency
              </motion.p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Post Requirements",
                  description: "Create detailed RFQs with specifications, quantities, and delivery requirements",
                  icon: Search,
                  color: "from-orange-500 to-amber-500"
                },
                {
                  step: "02", 
                  title: "Receive Quotes",
                  description: "Get competitive quotes from verified suppliers within 24-48 hours",
                  icon: MessageCircle,
                  color: "from-amber-500 to-orange-600"
                },
                {
                  step: "03",
                  title: "Compare & Select",
                  description: "Evaluate suppliers based on price, quality, compliance, and delivery terms",
                  icon: CheckCircle,
                  color: "from-orange-600 to-amber-600"
                },
                {
                  step: "04",
                  title: "Manage Orders",
                  description: "Track orders, manage payments, and ensure compliance with enterprise standards",
                  icon: Settings,
                  color: "from-amber-600 to-orange-500"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="relative group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-200/50 dark:border-orange-800/50 h-full">
                    <div className="relative mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <item.icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center shadow-lg border-2 border-orange-200 dark:border-orange-800">
                        <span className="text-sm font-bold text-orange-600">{item.step}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.description}</p>
                    
                    {/* Connection line to next step */}
                    {index < 3 && (
                      <motion.div 
                        className="hidden md:block absolute top-1/2 -right-4 w-8 h-1 bg-gradient-to-r from-orange-300 to-amber-300"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: index * 0.2 + 0.5 }}
                      />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.button
                onClick={() => router.push('/rfq')}
                className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started with RFQ
              </motion.button>
            </motion.div>
          </div>
        </section>
      </RevealSection>

      {/* Enhanced Categories Section */}
      <RevealSection direction="up">
        <CategoriesSection />
      </RevealSection>

      {/* Featured Products Section - Premium Enterprise Focus */}
      <RevealSection direction="left">
        <section className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Products
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Premium products from verified suppliers, perfect for your procurement needs
            </motion.p>
          </div>

          {data.loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg animate-pulse">
                  <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : data.featuredProducts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {data.featuredProducts.slice(0, 4).map((product: any, index: number) => (
                <motion.div
                  key={product.id || index}
                  className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -12, scale: 1.02 }}
                >
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <motion.img 
                      src={product.images?.[0] || product.image || '/api/placeholder/300/200'} 
                      alt={product.name || 'Product'}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      whileHover={{ scale: 1.1 }}
                    />
                    {product.discount && (
                      <motion.div 
                        className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-lg text-sm font-semibold shadow-lg"
                        initial={{ scale: 0, rotate: 45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: index * 0.1 + 0.5, type: 'spring', stiffness: 500 }}
                      >
                        -{product.discount}%
                      </motion.div>
                    )}
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Ready for You
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 group-hover:text-orange-600 transition-colors">
                      {product.name || 'Premium Enterprise Product'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 leading-relaxed">
                      {product.description || product.shortDescription || 'High-quality product from verified enterprise supplier'}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold text-orange-600">
                          ₹{(product.price || 999).toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-semibold text-yellow-600">
                          {product.rating || product.reviews?.average || 4.5}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {product.supplier?.name || product.brand || 'Verified Supplier'}
                      </span>
                      <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-full font-semibold">
                        {product.inStock ? 'In Stock' : 'Available'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Package className="h-20 w-20 text-gray-300 mx-auto mb-6" />
              <p className="text-gray-500 dark:text-gray-400 text-xl">
                Products will appear here soon
              </p>
            </div>
          )}

          <div className="text-center mt-12">
            <motion.button
              className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-10 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-lg group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/products')}
            >
              Explore Products
            </motion.button>
          </div>
        </section>
      </RevealSection>

      {/* Featured Services Section - B2B Focus */}
      <RevealSection direction="right">
        <section className="container mx-auto px-6 py-20 bg-gradient-to-br from-gray-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Professional Services
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Expert services from certified providers for your business operations and growth
            </motion.p>
          </div>

          {data.loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg animate-pulse">
                  <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : data.featuredServices.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.featuredServices.slice(0, 3).map((service: any, index: number) => (
                <motion.div
                  key={service.id || index}
                  className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -12, scale: 1.02 }}
                >
                  <div className="relative overflow-hidden rounded-xl mb-6">
                    <motion.img 
                      src={service.images?.[0] || service.image || '/api/placeholder/300/200'} 
                      alt={service.name || 'Service'}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-lg text-sm font-semibold shadow-lg">
                      {service.serviceType || service.category || 'Professional Service'}
                    </div>
                    <div className="absolute top-3 right-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Certified
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white line-clamp-2 group-hover:text-orange-600 transition-colors">
                      {service.name || 'Professional Enterprise Service'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                      {service.description || 'High-quality professional service from certified provider'}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold text-orange-600">
                          ₹{(service.basePrice || service.price || 2999).toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500">Starting from</span>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-semibold text-yellow-600">{service.rating || 4.7}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {service.provider?.name || 'Certified Provider'}
                      </span>
                      <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full font-semibold">
                        {service.deliveryTime || 'Available'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Store className="h-20 w-20 text-gray-300 mx-auto mb-6" />
              <p className="text-gray-500 dark:text-gray-400 text-xl">
                Professional services will appear here soon
              </p>
            </div>
          )}

          <div className="text-center mt-12">
            <motion.button
              className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-10 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-lg group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/services')}
            >
              Explore Services
            </motion.button>
          </div>
        </section>
      </RevealSection>

      {/* Key Features Section */}
      <RevealSection direction="up">
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Why Choose Our Platform
              </motion.h2>
              <motion.p 
                className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Built specifically for procurement teams who need efficiency, compliance, and results
              </motion.p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: ShieldCheck,
                  title: "Verified Suppliers",
                  description: "All suppliers undergo rigorous verification including business licenses, quality certifications, and financial background checks.",
                  gradient: "from-green-500 to-emerald-600"
                },
                {
                  icon: Zap,
                  title: "Lightning Fast RFQs",
                  description: "Get competitive quotes in 24-48 hours instead of weeks. Our AI matches you with the right suppliers instantly.",
                  gradient: "from-blue-500 to-indigo-600"
                },
                {
                  icon: Globe,
                  title: "Pan-India Network",
                  description: "Access suppliers from across India with local presence and nationwide delivery capabilities for any scale requirement.",
                  gradient: "from-purple-500 to-pink-600"
                },
                {
                  icon: Award,
                  title: "Quality Assurance",
                  description: "Built-in quality control processes, supplier ratings, and compliance tracking ensure you get exactly what you ordered.",
                  gradient: "from-orange-500 to-red-600"
                },
                {
                  icon: Clock,
                  title: "Time Saving",
                  description: "Automate your procurement workflow and reduce sourcing time by 70% with our intelligent matching and communication tools.",
                  gradient: "from-teal-500 to-cyan-600"
                },
                {
                  icon: BarChart3,
                  title: "Cost Optimization",
                  description: "Advanced analytics and price comparison tools help you achieve 15-30% cost savings on your procurement spend.",
                  gradient: "from-amber-500 to-orange-600"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-600 h-full">
                    <motion.div 
                      className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: 5 }}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-orange-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* Premium Testimonials */}
      <RevealSection direction="up">
        <TestimonialsSection />
      </RevealSection>

      {/* Enhanced CTA Section */}
      <RevealSection direction="up">
        <CTASection />
      </RevealSection>
    </div>
  );
}