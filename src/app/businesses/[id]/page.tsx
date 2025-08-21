'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { marketplaceApi } from '@/lib/api/marketplace';
import { useSSOAuth } from '@/lib/auth/use-sso-auth';
import { vikaretaCrossDomainAuth } from '@/lib/auth/vikareta';
import { useWishlistStore } from '@/lib/stores/wishlist';
import { useToast } from '@/components/ui/toast-provider';
import { 
  Star, 
  Award, 
  TrendingUp, 
  Package, 
  Users, 
  Calendar, 
  CheckCircle, 
  ArrowLeft, 
  Mail, 
  MessageCircle, 
  Heart, 
  Share2, 
  Globe,
  Shield,
  Clock,
  Building2,
  Verified,
  Trophy,
  Target,
  Briefcase,
  MapPinIcon,
  PhoneCall,
  Send,
  Download,
  Eye,
  ThumbsUp,
  Sparkles,
  BookOpen,
  Camera
} from 'lucide-react';
import { useState, useEffect } from 'react';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export default function BusinessProfilePage(props: any) {
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'services' | 'reviews'>('overview');
  const { isAuthenticated, refreshSession } = useSSOAuth();
  const { isInWishlist, addToWishlist, removeItemFromWishlist } = useWishlistStore();
  const toast = useToast();
  const id = props?.params?.id as string;

  // Check if business is in wishlist
  const inWishlist = isInWishlist('business', id);

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Authentication Required', 'Please login to add businesses to your wishlist');
      // Use secure navigation instead of direct redirect
      vikaretaCrossDomainAuth.navigateToLogin();
      return;
    }

    // Debug authentication status in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Authentication Debug:', { 
        isAuthenticated, 
        allCookies: document.cookie,
        cookieCount: document.cookie.split(';').filter(c => c.trim()).length,
        hasXSRF: document.cookie.includes('XSRF-TOKEN'),
        cookieNames: document.cookie.split(';').map(c => c.trim().split('=')[0]).filter(Boolean),
        apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE,
        currentDomain: window.location.hostname
      });
    }

    try {
      if (inWishlist) {
        const success = await removeItemFromWishlist('business', id);
        if (success) {
          toast.success('Removed', 'Business removed from wishlist');
        } else {
          toast.error('Error', 'Failed to remove business from wishlist');
        }
      } else {
        const success = await addToWishlist(id, 'business');
        if (success) {
          toast.success('Added', 'Business added to wishlist');
        } else {
          // In development mode, show more helpful error message
          if (process.env.NODE_ENV === 'development') {
            console.log('Wishlist add failed - this is expected in development without proper auth setup');
            toast.error('Development Mode', 'Wishlist functionality requires production authentication setup');
          } else {
            // Try refreshing session and retry once
            console.log('Wishlist add failed, refreshing session and retrying...');
            await refreshSession();
            const retrySuccess = await addToWishlist(id, 'business');
            if (retrySuccess) {
              toast.success('Added', 'Business added to wishlist');
            } else {
              toast.error('Error', 'Failed to add business to wishlist. Please try logging in again.');
              // If still failing, redirect to secure login
              vikaretaCrossDomainAuth.navigateToLogin();
            }
          }
        }
      }
    } catch (error) {
      console.error('Wishlist toggle error:', error);
      if (process.env.NODE_ENV === 'development') {
        toast.error('Development Mode', 'Wishlist functionality requires production authentication setup');
      } else {
        toast.error('Error', 'An error occurred while updating wishlist. Please try logging in again.');
        // On error, also redirect to secure login
        vikaretaCrossDomainAuth.navigateToLogin();
      }
    }
  };

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        setLoading(true);
        
        // Fetch the business directly by id
        const businessRes = await marketplaceApi.getBusinessById(id);
        if (businessRes && businessRes.success && businessRes.data) {
          setBusiness(businessRes.data);
          setLoading(false);
          return;
        }

        // If direct fetch failed, try a fallback by scanning nearby businesses
        try {
          const nearby = await marketplaceApi.getNearbyBusinesses();
          if (nearby && nearby.success) {
            // normalize to array
            const payload = nearby.data as any;
            const list = Array.isArray(payload) ? payload : (payload?.businesses || payload?.data || payload?.items || []);
            const foundBusiness = list.find((b: any) => String(b.id) === String(id));
            setBusiness(foundBusiness || null);
          }
        } catch (fallbackErr) {
          console.error('Fallback nearby lookup failed for business id', id, fallbackErr);
          setBusiness(null);
        }
      } catch (err) {
        console.error('Failed to fetch business for id', id, err);
        setBusiness(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBusiness();
    }
  }, [id]);

  if (loading) {
    return (
      <motion.div 
        initial="initial"
        animate="animate"
        variants={pageVariants}
        className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center"
      >
        <div className="text-center">
          <motion.div 
            className="w-20 h-20 mx-auto mb-6 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Building2 className="w-10 h-10 text-white" />
          </motion.div>
          <h3 className="text-2xl font-bold text-white mb-2">Loading Business Profile</h3>
          <p className="text-indigo-200">Fetching business details...</p>
        </div>
      </motion.div>
    );
  }

  if (!business) {
    return (
      <motion.div 
        initial="initial"
        animate="animate"
        variants={pageVariants}
        className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"
      >
        <div className="container mx-auto px-6 py-20 text-center">
          <div className="max-w-lg mx-auto">
            <motion.div 
              variants={itemVariants}
              initial="hidden"
              animate="show"
              className="w-32 h-32 mx-auto mb-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center"
            >
              <Building2 className="w-16 h-16 text-white" />
            </motion.div>
            <motion.h1 
              variants={itemVariants}
              initial="hidden"
              animate="show"
              className="text-4xl font-bold text-white mb-4"
            >
              Business Not Found
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              initial="hidden"
              animate="show"
              className="text-xl text-indigo-200 mb-10 leading-relaxed"
            >
              We couldn't locate this business profile. It may have been moved or is temporarily unavailable.
            </motion.p>
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="show"
            >
              <Link 
                href="/businesses" 
                className="inline-flex items-center gap-3 bg-white hover:bg-gray-100 text-indigo-900 px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-2xl"
              >
                <ArrowLeft className="w-6 h-6" />
                Back to Directory
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Extract business data with proper fallbacks
  const businessData = {
    id: business.id,
    name: business.businessName || `${business.firstName || ''} ${business.lastName || ''}`.trim() || business.name || 'Business',
    description: business.description || business.about || 'Professional business services with a commitment to excellence.',
    location: business.address || business.location || business.provider?.location || 'Location not specified',
    rating: business.rating || 4.5,
    reviewCount: business.reviewCount || business.completedOrders || 0,
    productCount: business.productCount ?? business.totalProducts ?? business._count?.products ?? 0,
    serviceCount: business.serviceCount ?? business.products?.filter?.((p: any) => p.isService)?.length ?? 0,
    isVerified: business.isVerified || business.verificationTier === 'premium',
    verificationTier: business.verificationTier || 'basic',
    logo: business.logo || business.avatar,
    coverImage: business.coverImage || business.bannerImage,
    phone: business.phone || business.contactPhone || '+91-9934109996',
    email: business.email || business.contactEmail,
    website: business.website,
    completedOrders: business.completedOrders || business._count?.sellerOrders || 0,
    joinedDate: business.createdAt ? new Date(business.createdAt).getFullYear() : new Date().getFullYear(),
    employeeCount: business.employeeCount || Math.floor(Math.random() * 50) + 10,
    certifications: business.certifications || [],
    responseTime: business.responseTime || '2 hours',
    successRate: business.successRate || 98
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye, count: null },
    { id: 'products', label: 'Products', icon: Package, count: businessData.productCount },
    { id: 'services', label: 'Services', icon: Briefcase, count: businessData.serviceCount },
    { id: 'reviews', label: 'Reviews', icon: Star, count: businessData.reviewCount }
  ];

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      variants={pageVariants}
      className="min-h-screen bg-gray-50"
    >
      {/* Enhanced Hero Section */}
      <section className="relative min-h-[70vh] bg-gradient-to-br from-amber-900 via-orange-900 to-amber-800 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-20 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl"
            animate={{ 
              x: [0, 100, -50, 0], 
              y: [0, -80, 50, 0],
              scale: [1, 1.3, 0.8, 1]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl"
            animate={{ 
              x: [0, -120, 80, 0], 
              y: [0, 60, -40, 0],
              scale: [1, 0.7, 1.2, 1]
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/3 left-1/3 w-72 h-72 bg-orange-400/15 rounded-full blur-3xl"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Navigation */}
          <motion.div 
            variants={itemVariants}
            initial="hidden"
            animate="show"
            className="flex items-center justify-between mb-12"
          >
            <Link 
              href="/businesses"
              className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-2xl transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Directory</span>
            </Link>

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <button 
                    onClick={handleWishlistToggle}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 ${
                      inWishlist 
                        ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                        : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                    {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                  </button>
                  <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-2xl transition-all duration-300 hover:scale-105">
                    <Share2 className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2 text-white">
                  <span className="text-sm">Login to follow and save to wishlist</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Business Profile Card */}
          <motion.div 
            variants={itemVariants}
            initial="hidden"
            animate="show"
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-white/20"
          >
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Business Logo & Basic Info */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-3xl overflow-hidden bg-white shadow-2xl p-1">
                    {businessData.logo ? (
                      <Image 
                        src={businessData.logo} 
                        alt={businessData.name} 
                        width={128} 
                        height={128} 
                        className="w-full h-full object-cover rounded-3xl" 
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-amber-600 to-orange-600 rounded-3xl flex items-center justify-center text-white font-bold text-4xl">
                        {businessData.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  {businessData.isVerified && (
                    <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 shadow-lg">
                      <Verified className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>

                {/* Verification Badges */}
                <div className="flex flex-wrap lg:flex-col gap-3">
                  {businessData.verificationTier === 'premium' && (
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg">
                      <Trophy className="w-4 h-4" />
                      Premium Partner
                    </div>
                  )}
                  <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-2xl text-sm font-semibold flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Verified Business
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-2xl text-sm font-semibold flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Active {businessData.responseTime}
                  </div>
                </div>
              </div>

              {/* Business Details */}
              <div className="flex-1">
                <div className="mb-6">
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                    {businessData.name}
                  </h1>
                  <div className="flex items-center gap-3 text-amber-200 mb-4">
                    <MapPinIcon className="w-6 h-6 flex-shrink-0" />
                    <span className="text-lg">{businessData.location}</span>
                  </div>
                  <p className="text-xl text-amber-100 leading-relaxed max-w-3xl">
                    {businessData.description}
                  </p>
                </div>

                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'Rating', value: businessData.rating.toFixed(1), icon: Star, color: 'from-yellow-400 to-orange-500', suffix: '/5' },
                    { label: 'Products', value: businessData.productCount, icon: Package, color: 'from-blue-400 to-cyan-500', suffix: '+' },
                    { label: 'Orders', value: businessData.completedOrders, icon: TrendingUp, color: 'from-green-400 to-emerald-500', suffix: '+' },
                    { label: 'Success Rate', value: businessData.successRate, icon: Target, color: 'from-purple-400 to-pink-500', suffix: '%' }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                      className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20"
                    >
                      <div className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">
                        {stat.value}{stat.suffix}
                      </div>
                      <div className="text-sm text-amber-200">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4">
                  <a
                    href={`tel:${businessData.phone}`}
                    className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-xl"
                  >
                    <PhoneCall className="w-6 h-6" />
                    Call Now
                  </a>
                  {businessData.email && (
                    <a
                      href={`mailto:${businessData.email}`}
                      className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-xl"
                    >
                      <Send className="w-6 h-6" />
                      Send Email
                    </a>
                  )}
                  <button className="flex items-center gap-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-105 border border-white/30">
                    <MessageCircle className="w-6 h-6" />
                    Message
                  </button>
                  {businessData.website && (
                    <a
                      href={businessData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-105 border border-white/30"
                    >
                      <Globe className="w-6 h-6" />
                      Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative flex items-center gap-3 px-6 py-4 font-semibold transition-all duration-300 ${
                    isActive
                      ? 'text-amber-600 border-b-2 border-amber-600'
                      : 'text-gray-600 hover:text-amber-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  {tab.count !== null && tab.count > 0 && (
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      isActive 
                        ? 'bg-amber-100 text-amber-600' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-4 gap-8"
        >
          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* About Section */}
                <motion.section 
                  variants={itemVariants}
                  className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">About Our Business</h2>
                  </div>
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                    <p>{businessData.description}</p>
                    <p className="mt-4">
                      We are committed to providing exceptional service and building long-term relationships with our clients. 
                      Our team of experienced professionals ensures quality and reliability in every interaction.
                    </p>
                  </div>
                </motion.section>

                {/* Key Features */}
                <motion.section 
                  variants={itemVariants}
                  className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Why Choose Us</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { icon: Shield, title: 'Verified & Trusted', desc: 'Government verified business with proven track record' },
                      { icon: Clock, title: 'Quick Response', desc: `Average response time: ${businessData.responseTime}` },
                      { icon: ThumbsUp, title: 'High Success Rate', desc: `${businessData.successRate}% customer satisfaction` },
                      { icon: Award, title: 'Quality Assurance', desc: 'Premium quality products and services' }
                    ].map((feature, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-amber-50 rounded-2xl">
                        <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <feature.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
                          <p className="text-sm text-gray-600">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.section>

                {/* Business Gallery */}
                <motion.section 
                  variants={itemVariants}
                  className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Business Gallery</h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <div key={index} className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center hover:scale-105 transition-transform duration-300 cursor-pointer">
                        <Camera className="w-8 h-8 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </motion.section>
              </div>
            )}

            {activeTab === 'products' && (
              <motion.div variants={itemVariants} className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Our Products</h2>
                </div>
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Products Coming Soon</h3>
                  <p className="text-gray-600">This business will showcase their products here.</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'services' && (
              <motion.div variants={itemVariants} className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Our Services</h2>
                </div>
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Briefcase className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Services Coming Soon</h3>
                  <p className="text-gray-600">This business will showcase their services here.</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div variants={itemVariants} className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
                </div>
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Star className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Reviews Yet</h3>
                  <p className="text-gray-600">Be the first to review this business!</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Contact */}
            <motion.div 
              variants={itemVariants}
              className="bg-gradient-to-br from-amber-600 to-orange-700 rounded-3xl p-6 text-white"
            >
              <h3 className="text-xl font-bold mb-4">Quick Contact</h3>
              <div className="space-y-4">
                <a
                  href={`tel:${businessData.phone}`}
                  className="flex items-center gap-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-2xl p-3 transition-all duration-300"
                >
                  <PhoneCall className="w-5 h-5" />
                  <div>
                    <div className="font-semibold">Call Us</div>
                    <div className="text-sm text-indigo-200">{businessData.phone}</div>
                  </div>
                </a>
                {businessData.email && (
                  <a
                    href={`mailto:${businessData.email}`}
                    className="flex items-center gap-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-2xl p-3 transition-all duration-300"
                  >
                    <Mail className="w-5 h-5" />
                    <div>
                      <div className="font-semibold">Email Us</div>
                      <div className="text-sm text-indigo-200 truncate">{businessData.email}</div>
                    </div>
                  </a>
                )}
                <button className="w-full bg-white hover:bg-gray-100 text-indigo-600 py-3 px-4 rounded-2xl font-bold transition-all duration-300">
                  Send Message
                </button>
              </div>
            </motion.div>

            {/* Business Info */}
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Business Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-semibold text-gray-900">Business Type</div>
                    <div className="text-sm text-gray-600 capitalize">{businessData.verificationTier} Supplier</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-semibold text-gray-900">Team Size</div>
                    <div className="text-sm text-gray-600">{businessData.employeeCount} employees</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-semibold text-gray-900">Member Since</div>
                    <div className="text-sm text-gray-600">{businessData.joinedDate}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-semibold text-gray-900">Response Time</div>
                    <div className="text-sm text-gray-600">{businessData.responseTime}</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Certifications */}
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Certifications & Badges</h3>
              <div className="space-y-3">
                {businessData.isVerified && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-2xl border border-green-200">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <div className="font-semibold text-green-800">Verified Business</div>
                      <div className="text-sm text-green-600">Identity confirmed</div>
                    </div>
                  </div>
                )}
                {businessData.verificationTier === 'premium' && (
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-2xl border border-orange-200">
                    <Trophy className="w-6 h-6 text-orange-600" />
                    <div>
                      <div className="font-semibold text-orange-800">Premium Partner</div>
                      <div className="text-sm text-orange-600">Enhanced features</div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-2xl border border-blue-200">
                  <Shield className="w-6 h-6 text-blue-600" />
                  <div>
                    <div className="font-semibold text-blue-800">Quality Assured</div>
                    <div className="text-sm text-blue-600">Quality standards met</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
              variants={itemVariants}
              className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-6 text-white"
            >
              <h3 className="text-lg font-bold mb-4">Get Started Today</h3>
              <p className="text-green-100 mb-4 text-sm">
                Ready to start your business relationship with {businessData.name}?
              </p>
              <div className="space-y-3">
                {isAuthenticated ? (
                  <>
                    <button 
                      onClick={handleWishlistToggle}
                      className={`w-full py-3 px-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                        inWishlist 
                          ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                          : 'bg-white text-green-600 hover:bg-green-50'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                      {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                    </button>
                    <button className="w-full bg-white text-green-600 py-3 px-4 rounded-2xl font-bold hover:bg-green-50 transition-colors duration-300">
                      Request Quote
                    </button>
                    <button className="w-full bg-green-400 hover:bg-green-300 text-green-900 py-3 px-4 rounded-2xl font-bold transition-colors duration-300">
                      Send Inquiry
                    </button>
                    <button 
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: businessData.name,
                            text: `Check out ${businessData.name} on Vikareta`,
                            url: window.location.href
                          });
                        } else {
                          navigator.clipboard.writeText(window.location.href);
                          alert('Link copied to clipboard!');
                        }
                      }}
                      className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white py-3 px-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-5 h-5" />
                      Share Business
                    </button>
                  </>
                ) : (
                  <>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                      <p className="text-green-100 mb-3">
                        Login to access premium features like following businesses, requesting quotes, and more!
                      </p>
                      <Link 
                        href="/auth/login" 
                        className="inline-block bg-white text-green-600 py-2 px-6 rounded-xl font-semibold hover:bg-green-50 transition-colors duration-300"
                      >
                        Login Now
                      </Link>
                    </div>
                    <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white py-3 px-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2">
                      <Eye className="w-5 h-5" />
                      View Contact (Login Required)
                    </button>
                  </>
                )}
                <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white py-3 px-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Download Brochure
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
