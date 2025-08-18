'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { marketplaceApi } from '@/lib/api/marketplace';
import { MapPin, Phone, Star, Award, TrendingUp, Package, Users, Calendar, CheckCircle, ArrowLeft, Mail, MessageCircle, Heart, Share2, ExternalLink } from 'lucide-react';
import BusinessProducts from '@/components/business/BusinessProducts';
import BusinessServices from '@/components/business/BusinessServices';
import { useState, useEffect } from 'react';

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

const sectionVariants = {
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

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export default function BusinessProfilePage(props: any) {
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const id = props?.params?.id as string;

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
        className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center"
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center animate-pulse">
            <Package className="w-8 h-8 text-orange-600" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading business details...</p>
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
        className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 dark:from-gray-900 dark:to-gray-800"
      >
        <div className="container mx-auto px-6 py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
              <Package className="w-12 h-12 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Business Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              We couldn't find this business. It may have been removed or its details are unavailable.
            </p>
            <Link 
              href="/businesses" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Directory
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  // Extract business data with proper fallbacks
  const businessData = {
    id: business.id,
    name: business.businessName || `${business.firstName || ''} ${business.lastName || ''}`.trim() || business.name || 'Business',
    description: business.description || business.about || 'No description available.',
    location: business.address || business.location || business.provider?.location || 'Location not specified',
    rating: business.rating || 4.5,
    reviewCount: business.reviewCount || business.completedOrders || 0,
    productCount: business.productCount ?? business.totalProducts ?? business._count?.products ?? 0,
    serviceCount: business.serviceCount ?? business.products?.filter?.((p: any) => p.isService)?.length ?? 0,
    isVerified: business.isVerified || business.verificationTier === 'premium',
    verificationTier: business.verificationTier || 'basic',
    logo: business.logo || business.avatar,
    coverImage: business.coverImage || business.bannerImage,
    phone: business.phone || business.contactPhone,
    email: business.email || business.contactEmail,
    website: business.website,
    completedOrders: business.completedOrders || business._count?.sellerOrders || 0,
    joinedDate: business.createdAt ? new Date(business.createdAt).getFullYear() : new Date().getFullYear(),
    employeeCount: business.employeeCount || 0,
    certifications: business.certifications || []
  };

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      variants={pageVariants}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Cover Image */}
        <div className="relative h-80 w-full">
          {businessData.coverImage ? (
            <Image 
              src={businessData.coverImage} 
              alt={businessData.name} 
              fill 
              className="object-cover" 
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 relative overflow-hidden">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white/20 text-8xl font-bold">
                  {businessData.name.charAt(0)}
                </div>
              </div>
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
          
          {/* Back Button */}
          <Link 
            href="/businesses"
            className="absolute top-6 left-6 bg-white/90 hover:bg-white backdrop-blur-sm text-gray-900 p-3 rounded-lg transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          {/* Action Buttons */}
          <div className="absolute top-6 right-6 flex gap-3">
            <button className="bg-white/90 hover:bg-white backdrop-blur-sm text-gray-900 p-3 rounded-lg transition-all duration-300 hover:scale-105">
              <Heart className="w-5 h-5" />
            </button>
            <button className="bg-white/90 hover:bg-white backdrop-blur-sm text-gray-900 p-3 rounded-lg transition-all duration-300 hover:scale-105">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Business Info Card */}
        <div className="relative -mt-20 mx-6">
          <motion.div 
            variants={sectionVariants}
            initial="hidden"
            animate="show"
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-4xl mx-auto border border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Business Logo */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center shadow-lg">
                  {businessData.logo ? (
                    <Image 
                      src={businessData.logo} 
                      alt={businessData.name} 
                      width={96} 
                      height={96} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="text-3xl font-bold text-orange-600">
                      {businessData.name.charAt(0)}
                    </div>
                  )}
                </div>
              </div>

              {/* Business Details */}
              <div className="flex-1">
                <div className="flex flex-wrap items-start gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {businessData.name}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-3">
                      <MapPin className="w-5 h-5 flex-shrink-0" />
                      <span>{businessData.location}</span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    {businessData.isVerified && (
                      <div className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Verified
                      </div>
                    )}
                    {businessData.verificationTier === 'premium' && (
                      <div className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold border border-amber-200">
                        Premium Supplier
                      </div>
                    )}
                    <div className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Since {businessData.joinedDate}
                    </div>
                  </div>
                </div>

                {/* Rating and Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center justify-center mb-1">
                      <Star className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {businessData.rating.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Rating</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center justify-center mb-1">
                      <Package className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {businessData.productCount}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Products</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center justify-center mb-1">
                      <TrendingUp className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {businessData.serviceCount}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Services</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {businessData.completedOrders}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Orders</div>
                  </div>
                </div>

                {/* Contact Buttons */}
                <div className="flex flex-wrap gap-3">
                  {businessData.phone && (
                    <a
                      href={`tel:${businessData.phone}`}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                    >
                      <Phone className="w-5 h-5" />
                      Call Now
                    </a>
                  )}
                  {businessData.email && (
                    <a
                      href={`mailto:${businessData.email}`}
                      className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                    >
                      <Mail className="w-5 h-5" />
                      Email
                    </a>
                  )}
                  <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105">
                    <MessageCircle className="w-5 h-5" />
                    Message
                  </button>
                  {businessData.website && (
                    <a
                      href={businessData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                    >
                      <ExternalLink className="w-5 h-5" />
                      Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-6 py-16">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <motion.section variants={sectionVariants} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {businessData.description}
              </p>
            </motion.section>

            {/* Products Section */}
            <motion.section variants={sectionVariants} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Products</h2>
              <BusinessProducts supplierId={String(businessData.id)} />
            </motion.section>

            {/* Services Section */}
            <motion.section variants={sectionVariants} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Services</h2>
              <BusinessServices businessId={String(businessData.id)} />
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Business Info */}
            <motion.div variants={sectionVariants} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Business Information</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Business Type</div>
                  <div className="font-semibold text-gray-900 dark:text-white capitalize">
                    {businessData.verificationTier} Supplier
                  </div>
                </div>
                {businessData.employeeCount > 0 && (
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Team Size</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {businessData.employeeCount} employees
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Member Since</div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {businessData.joinedDate}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Certifications */}
            <motion.div variants={sectionVariants} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Certifications & Badges</h3>
              <div className="space-y-3">
                {businessData.isVerified && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <div className="font-semibold text-green-800 dark:text-green-300">Verified Business</div>
                      <div className="text-sm text-green-600 dark:text-green-400">Identity confirmed</div>
                    </div>
                  </div>
                )}
                {businessData.verificationTier === 'premium' && (
                  <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <Award className="w-6 h-6 text-orange-600" />
                    <div>
                      <div className="font-semibold text-orange-800 dark:text-orange-300">Premium Supplier</div>
                      <div className="text-sm text-orange-600 dark:text-orange-400">Enhanced features</div>
                    </div>
                  </div>
                )}
                {businessData.certifications.length === 0 && !businessData.isVerified && businessData.verificationTier === 'basic' && (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    No certifications listed
                  </div>
                )}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={sectionVariants} className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Ready to Connect?</h3>
              <p className="text-orange-100 mb-4 text-sm">
                Get in touch with {businessData.name} for your business needs
              </p>
              <div className="space-y-3">
                <button className="w-full bg-white text-orange-600 py-3 px-4 rounded-lg font-semibold hover:bg-orange-50 transition-colors duration-300">
                  Send Inquiry
                </button>
                <button className="w-full bg-orange-400 hover:bg-orange-300 text-orange-900 py-3 px-4 rounded-lg font-semibold transition-colors duration-300">
                  Request Quote
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
