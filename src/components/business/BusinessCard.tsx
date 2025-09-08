"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MapPin, Star, ArrowRight, Phone, Mail, Award, TrendingUp, Users, Package } from 'lucide-react';
import { motion } from 'framer-motion';

interface BusinessCardProps {
  business: any;
  viewMode?: 'grid' | 'list';
}

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.95 
  },
  show: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1
    }
  }
};

export const BusinessCard: React.FC<BusinessCardProps> = ({ business, viewMode = 'grid' }) => {
  const router = useRouter();
  
  // Extract business data with fallbacks
  const businessData = {
    id: business?.id,
    name: business?.businessName || `${business?.firstName || ''} ${business?.lastName || ''}`.trim() || business?.name || 'Business',
    description: business?.description || business?.about || `Professional ${business?.verificationTier || 'business'} services`,
    location: business?.address || business?.location || business?.provider?.location || 'Location not specified',
    rating: business?.rating || 4.5,
    reviewCount: business?.reviewCount || business?.completedOrders || 0,
    productCount: business?.productCount ?? business?.totalProducts ?? business?._count?.products ?? 0,
    serviceCount: business?.serviceCount ?? business?.products?.filter?.((p: any) => p.isService)?.length ?? 0,
    isVerified: business?.isVerified || business?.verificationTier === 'premium',
    verificationTier: business?.verificationTier || 'basic',
    logo: business?.logo || business?.avatar,
    coverImage: business?.coverImage || business?.bannerImage,
    category: business?.category || business?.verificationTier || 'General',
    phone: business?.phone || business?.contactPhone,
    email: business?.email || business?.contactEmail,
    completedOrders: business?.completedOrders || business?._count?.sellerOrders || 0
  };

  // Generate category tags
  const tags = [];
  if (businessData.category && businessData.category !== 'General') tags.push(businessData.category);
  if (businessData.verificationTier && businessData.verificationTier !== 'basic') {
    tags.push(businessData.verificationTier.charAt(0).toUpperCase() + businessData.verificationTier.slice(1));
  }

  const handleCardClick = () => {
    router.push(`/businesses/${businessData.id}`);
  };

  // List view layout
  if (viewMode === 'list') {
    return (
      <motion.article
        initial="hidden"
        whileInView="show"
        whileHover="hover"
        whileTap="tap"
        viewport={{ once: true, amount: 0.1 }}
        variants={cardVariants}
        onClick={handleCardClick}
        className="group flex bg-gradient-to-r from-white to-orange-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-orange-200 dark:border-gray-700 cursor-pointer"
      >
        {/* Image Section */}
        <div className="relative w-48 h-32 flex-shrink-0 overflow-hidden">
          {businessData.coverImage ? (
            <Image 
              src={businessData.coverImage} 
              alt={businessData.name} 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white/20 text-3xl font-bold">
                  {businessData.name.charAt(0)}
                </div>
              </div>
            </div>
          )}
          
          {/* Logo overlay */}
          <div className="absolute bottom-2 left-2">
            <div className="w-12 h-12 rounded-lg bg-white dark:bg-gray-800 shadow-lg border-2 border-white dark:border-gray-800 overflow-hidden">
              {businessData.logo ? (
                <Image 
                  src={businessData.logo} 
                  alt={businessData.name} 
                  width={48} 
                  height={48} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                  {businessData.name.charAt(0)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 flex justify-between">
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-orange-600 transition-colors duration-300">
                {businessData.name}
              </h3>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{businessData.location}</span>
                </div>
              </div>
              
              {/* Rating */}
              <div className="bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {businessData.rating.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">
              {businessData.description}
            </p>

            {/* Badges and stats */}
            <div className="flex items-center gap-4 mb-4">
              {/* Verification badges */}
              <div className="flex gap-2">
                {businessData.isVerified && (
                  <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    Verified
                  </span>
                )}
                {businessData.verificationTier === 'premium' && (
                  <span className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 dark:from-amber-900/30 dark:to-orange-900/30 dark:text-amber-300 px-3 py-1 rounded-full text-xs font-medium">
                    Premium
                  </span>
                )}
              </div>

              {/* Quick stats */}
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  {businessData.productCount}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {businessData.completedOrders}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2 ml-6">
            <Link
              href={`/businesses/${businessData.id}`}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-2 px-4 rounded-lg font-semibold text-center transition-all duration-300 flex items-center justify-center gap-2 group/btn"
            >
              View Profile
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
            </Link>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (businessData.phone) {
                  window.location.href = `tel:${businessData.phone}`;
                } else if (businessData.email) {
                  window.location.href = `mailto:${businessData.email}`;
                }
              }}
              className="bg-white hover:bg-amber-50 dark:bg-gray-800 dark:hover:bg-gray-700 border-2 border-amber-500 text-amber-600 dark:text-amber-400 py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              {businessData.phone ? <Phone className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
              Contact
            </button>
          </div>
        </div>
      </motion.article>
    );
  }

  // Grid view layout (default)
  return (
    <motion.article
      initial="hidden"
      whileInView="show"
      whileHover="hover"
      whileTap="tap"
      viewport={{ once: true, amount: 0.1 }}
      variants={cardVariants}
      onClick={handleCardClick}
      className="group relative bg-gradient-to-br from-white to-amber-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-amber-200 dark:border-gray-700 cursor-pointer h-[400px] flex flex-col"
    >
      {/* Cover Image / Gradient Background */}
      <div className="relative h-40 w-full overflow-hidden flex-shrink-0">
        {businessData.coverImage ? (
          <Image 
            src={businessData.coverImage} 
            alt={businessData.name} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white/20 text-4xl font-bold">
                {businessData.name.charAt(0)}
              </div>
            </div>
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        
        {/* Top badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {businessData.isVerified && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
            >
              <Award className="w-3 h-3" />
              Verified
            </motion.div>
          )}
          {businessData.verificationTier === 'premium' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-2 py-1 rounded-full text-xs font-semibold"
            >
              Premium
            </motion.div>
          )}
        </div>
        
        {/* Rating badge */}
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
          <span className="text-xs font-semibold text-gray-900 dark:text-white">
            {businessData.rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Business Logo */}
      <div className="absolute top-32 left-4 z-10">
        <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 shadow-lg border-3 border-white dark:border-gray-800 overflow-hidden">
          {businessData.logo ? (
            <Image 
              src={businessData.logo} 
              alt={businessData.name} 
              width={48} 
              height={48} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center text-white font-bold text-lg">
              {businessData.name.charAt(0)}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="pt-8 p-4 flex-1 flex flex-col">
        {/* Business name and location */}
        <div className="mb-3 flex-shrink-0">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-amber-600 transition-colors duration-300 line-clamp-2">
            {businessData.name}
          </h3>
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="text-xs truncate">{businessData.location}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 line-clamp-2 leading-relaxed flex-shrink-0">
          {businessData.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-3 p-2 bg-amber-50 dark:bg-gray-800/50 rounded-lg flex-shrink-0">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Package className="w-3 h-3 text-amber-600" />
            </div>
            <div className="text-sm font-bold text-gray-900 dark:text-white">
              {businessData.productCount}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Products</div>
          </div>
          <div className="text-center border-x border-amber-200 dark:border-gray-700">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="w-3 h-3 text-amber-600" />
            </div>
            <div className="text-sm font-bold text-gray-900 dark:text-white">
              {businessData.serviceCount}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Services</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="w-3 h-3 text-amber-600" />
            </div>
            <div className="text-sm font-bold text-gray-900 dark:text-white">
              {businessData.completedOrders}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Orders</div>
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3 flex-shrink-0">
            {tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 px-2 py-1 rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Action buttons - pushed to bottom */}
        <div className="flex gap-2 mt-auto">
          <Link
            href={`/businesses/${businessData.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-2 px-3 rounded-lg font-semibold text-center transition-all duration-300 flex items-center justify-center gap-1 group/btn text-sm"
          >
            View Profile
            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform duration-300" />
          </Link>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (businessData.phone) {
                window.location.href = `tel:${businessData.phone}`;
              } else if (businessData.email) {
                window.location.href = `mailto:${businessData.email}`;
              }
            }}
            className="bg-white hover:bg-amber-50 dark:bg-gray-800 dark:hover:bg-gray-700 border-2 border-amber-500 text-amber-600 dark:text-amber-400 p-2 rounded-lg transition-all duration-300 hover:scale-105"
          >
            {businessData.phone ? <Phone className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default BusinessCard;