"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MapPin, Star, ArrowRight, Phone, Mail, Award, TrendingUp, Users, Package } from 'lucide-react';
import { motion } from 'framer-motion';

interface BusinessCardProps {
  business: any;
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

export const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
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

  return (
    <motion.article
      initial="hidden"
      whileInView="show"
      whileHover="hover"
      whileTap="tap"
      viewport={{ once: true, amount: 0.1 }}
      variants={cardVariants}
      onClick={handleCardClick}
      className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700 cursor-pointer"
    >
      {/* Cover Image / Gradient Background */}
      <div className="relative h-48 w-full overflow-hidden">
        {businessData.coverImage ? (
          <Image 
            src={businessData.coverImage} 
            alt={businessData.name} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-blue-500 via-indigo-600 to-cyan-600 relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white/20 text-6xl font-bold">
                {businessData.name.charAt(0)}
              </div>
            </div>
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        
        {/* Top badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {businessData.isVerified && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
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
        className="bg-gradient-to-r from-cyan-400 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold"
            >
              Premium
            </motion.div>
          )}
        </div>
        
        {/* Rating badge */}
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {businessData.rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Business Logo */}
      <div className="absolute -mt-8 left-6 z-10">
        <div className="w-16 h-16 rounded-xl bg-white dark:bg-gray-800 shadow-lg border-4 border-white dark:border-gray-800 overflow-hidden">
          {businessData.logo ? (
            <Image 
              src={businessData.logo} 
              alt={businessData.name} 
              width={64} 
              height={64} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold text-xl">
              {businessData.name.charAt(0)}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="pt-12 p-6">
        {/* Business name and location */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors duration-300">
            {businessData.name}
          </h3>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm truncate">{businessData.location}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">
          {businessData.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Package className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {businessData.productCount}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Products</div>
          </div>
          <div className="text-center border-x border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {businessData.serviceCount}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Services</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {businessData.completedOrders}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Orders</div>
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          <Link
            href={`/businesses/${businessData.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-2.5 px-4 rounded-lg font-semibold text-center transition-all duration-300 flex items-center justify-center gap-2 group/btn"
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
            className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 border-2 border-blue-500 text-blue-600 dark:text-blue-400 p-2.5 rounded-lg transition-all duration-300 hover:scale-105"
          >
            {businessData.phone ? <Phone className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default BusinessCard;