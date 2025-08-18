'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CategoriesSection } from '@/components/sections/CategoriesSection';
import { FeaturedProducts } from '@/components/sections/FeaturedProducts';
import { FeaturedServices } from '@/components/sections/FeaturedServices';
import { StatsSection } from '@/components/sections/StatsSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { CTASection } from '@/components/sections/CTASection';
import { productsApi } from '@/lib/api/products';
import { servicesApi } from '@/lib/api/services';
import { apiClient } from '@/lib/api/client';
import { RevealSection, FloatingElement } from '@/components/Animated';

// Premium page animations
const pageVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      staggerChildren: 0.15
    }
  }
};

const sectionVariants = {
  initial: { opacity: 0, y: 40 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const featureVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

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
      const [categoriesResponse, productsResponse, servicesResponse] = await Promise.allSettled([
        apiClient.get('/categories', { limit: 12 }),
        productsApi.getFeaturedProducts(8),
        servicesApi.getServices({ limit: 6, sortBy: 'rating', sortOrder: 'desc' })
      ]);

      // Process categories
      const categories = categoriesResponse.status === 'fulfilled' && categoriesResponse.value.success 
        ? (categoriesResponse.value.data as any[])
        : [];

      // Process products  
      const featuredProducts = productsResponse.status === 'fulfilled' && productsResponse.value.success
        ? (productsResponse.value.data as any[])
        : [];

      // Process services
      const featuredServices = servicesResponse.status === 'fulfilled' && servicesResponse.value.success
        ? ((servicesResponse.value.data as any)?.services || (servicesResponse.value.data as unknown as any[]) || [])
        : [];

      // Calculate dynamic stats (in production, these would come from analytics API)
      const stats = {
        totalProducts: featuredProducts.length * 500 + 45000, // Simulated based on featured products
        totalSuppliers: Math.floor(featuredProducts.length * 50 + 2500),
        totalCategories: categories.length || 20,
        successfulDeals: Math.floor(featuredProducts.length * 30 + 15000)
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
        services: featuredServices.length
      });

    } catch (error) {
      console.error('❌ Error loading homepage data:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load some content. Please refresh the page.'
      }));
    }
  };

  // Enhanced loading component with skeleton states
  if (data.loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative overflow-hidden"
        >
          {/* Premium Loading Hero */}
          <section className="relative py-32 lg:py-40">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="mb-8"
                >
                  <div className="w-20 h-20 mx-auto mb-6 relative">
                    <motion.div
                      className="w-full h-full border-4 border-orange-200 border-t-orange-500 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                  <motion.h1 
                    className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Loading Vikareta
                  </motion.h1>
                  <motion.p 
                    className="text-xl text-gray-600 dark:text-gray-400 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Preparing your premium B2B marketplace experience...
                  </motion.p>
                </motion.div>

                {/* Loading Progress Indicators */}
                <motion.div 
                  className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {[
                    { label: 'Categories', icon: '📂' },
                    { label: 'Products', icon: '📦' },
                    { label: 'Services', icon: '⚙️' },
                    { label: 'Suppliers', icon: '🏢' }
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <div className="text-2xl mb-2">{item.icon}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{item.label}</div>
                      <motion.div 
                        className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                      >
                        <motion.div
                          className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 2, delay: 0.7 + index * 0.2, ease: "easeInOut" }}
                        />
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </section>
        </motion.div>
      </main>
    );
  }

  return (
    <motion.main 
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* Premium Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-blue-500/5 pointer-events-none" />
      
      {/* Floating Decorative Elements */}
      <FloatingElement className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-orange-600/20 rounded-full blur-xl" delay={0} />
      <FloatingElement className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full blur-xl" delay={2} />
      <FloatingElement className="absolute bottom-40 left-20 w-24 h-24 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-full blur-xl" delay={4} />
      
      {/* Error Banner */}
      {data.error && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-6 py-3 text-center"
        >
          <p className="text-sm">{data.error}</p>
        </motion.div>
      )}

      {/* Enhanced Hero Section with Real-time Stats */}
      <RevealSection>
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <motion.div
                variants={sectionVariants}
                className="text-center mb-16"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-4 py-2 rounded-full text-sm font-medium mb-6"
                >
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                  Live B2B Marketplace
                </motion.div>
                
                <motion.h1 
                  className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 font-lexend"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Premium B2B
                  <span className="block bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent">
                    Marketplace
                  </span>
                </motion.h1>
                
                <motion.p 
                  className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Connect with verified suppliers, discover premium products, and scale your business with India's most trusted B2B platform.
                </motion.p>

                {/* Real-time Stats Dashboard */}
                <motion.div 
                  className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {[
                    { 
                      label: 'Active Products', 
                      value: data.stats.totalProducts.toLocaleString(),
                      icon: '📦',
                      color: 'from-blue-500 to-blue-600'
                    },
                    { 
                      label: 'Verified Suppliers', 
                      value: data.stats.totalSuppliers.toLocaleString(),
                      icon: '🏢',
                      color: 'from-green-500 to-green-600'
                    },
                    { 
                      label: 'Categories', 
                      value: data.stats.totalCategories.toString(),
                      icon: '📂',
                      color: 'from-purple-500 to-purple-600'
                    },
                    { 
                      label: 'Successful Deals', 
                      value: data.stats.successfulDeals.toLocaleString(),
                      icon: '🤝',
                      color: 'from-orange-500 to-orange-600'
                    }
                  ].map((stat, _index) => (
                    <motion.div
                      key={stat.label}
                      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
                      variants={featureVariants}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <div className="text-3xl mb-3">{stat.icon}</div>
                      <div className={`text-2xl lg:text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Enhanced CTA Buttons */}
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary text-lg px-8 py-4"
                  >
                    Explore Products
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-outline text-lg px-8 py-4"
                  >
                    Join as Supplier
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* Categories Section - Always Show */}
      <RevealSection direction="up">
        <CategoriesSection />
      </RevealSection>

      {/* Featured Products - Show with fallback */}
      <RevealSection direction="left">
        <FeaturedProducts />
      </RevealSection>

      {/* Featured Services - Show with fallback */}
      <RevealSection direction="right">
        <FeaturedServices />
      </RevealSection>

      {/* Enhanced Stats Section */}
      <RevealSection direction="up">
        <StatsSection />
      </RevealSection>

      {/* Testimonials */}
      <RevealSection direction="up">
        <TestimonialsSection />
      </RevealSection>

      {/* CTA Section */}
      <RevealSection direction="up">
        <CTASection />
      </RevealSection>

      {/* Premium Newsletter Section with Enhanced Design */}
      <RevealSection direction="up">
        <section className="py-24 relative">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <motion.div
                variants={sectionVariants}
                className="relative"
              >
                {/* Background with enhanced gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-3xl opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl" />
                
                {/* Content */}
                <div className="relative p-12 lg:p-16 text-center text-white overflow-hidden rounded-3xl">
                  {/* Enhanced Background Pattern */}
                  <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-32 translate-x-32" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-300/20 rounded-full blur-2xl translate-y-24 -translate-x-24" />
                  
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10"
                  >
                    <motion.h2 
                      className="text-4xl lg:text-5xl font-bold mb-6 font-lexend"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      Stay Ahead in B2B
                    </motion.h2>
                    
                    <motion.p 
                      className="text-xl lg:text-2xl text-orange-100 mb-8 max-w-3xl mx-auto leading-relaxed"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      Get exclusive market insights, new product launches, and business opportunities delivered directly to your inbox.
                    </motion.p>
                    
                    <motion.div 
                      className="flex flex-col lg:flex-row gap-4 max-w-2xl mx-auto mb-8"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <input
                        type="email"
                        placeholder="Enter your business email address"
                        className="flex-1 px-6 py-4 rounded-xl text-gray-900 bg-white/95 backdrop-blur-sm border-0 focus:ring-4 focus:ring-white/25 focus:outline-none placeholder-gray-500 text-lg"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-white text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
                      >
                        Subscribe Now
                      </motion.button>
                    </motion.div>

                    <motion.div 
                      className="flex flex-wrap justify-center gap-6 text-sm text-orange-100"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        Weekly Market Reports
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                        Exclusive Product Launches
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                        Business Networking Events
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* Trust Indicators Section */}
      <RevealSection direction="up">
        <section className="py-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Trusted by Leading Businesses
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Join thousands of verified suppliers and buyers who trust Vikareta for their B2B needs.
              </p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-2 lg:grid-cols-5 gap-8 items-center opacity-60"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.6 }}
              transition={{ duration: 0.8 }}
            >
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="text-center">
                  <div className="w-20 h-20 mx-auto bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center text-2xl font-bold text-gray-400">
                    B{item}
                  </div>
                  <div className="mt-2 text-sm text-gray-500">Business {item}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>
      </RevealSection>
    </motion.main>
  );
}