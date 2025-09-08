'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Logo } from '../../../components/ui/logo';
import {
  User,
  Building,
  ArrowRight,
  ShoppingBag,
  Store,
  Users,
  TrendingUp,
  Star,
  Shield
} from 'lucide-react';

export default function RegisterPage() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <style jsx global>{`
        @media (max-width: 640px) {
          .mobile-padding {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8 mobile-padding">
        <motion.div
          className="w-full max-w-4xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Logo */}
          <motion.div 
            className="text-center mb-8 sm:mb-12"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Logo className="h-16 w-auto sm:h-20 md:h-24 mx-auto" />
            <div className="mt-4 sm:mt-6 space-y-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Join Vikareta</h1>
              <p className="text-base sm:text-lg text-gray-600 px-4">Choose how you want to get started</p>
            </div>
          </motion.div>

          {/* Registration Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            
            {/* User Registration Card */}
            <motion.div variants={itemVariants}>
              <Link href="/auth/register/user">
                <motion.div
                  className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 h-full cursor-pointer transition-all border-2 border-transparent hover:border-orange-200"
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center space-y-4 sm:space-y-6">
                    {/* Icon */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                      <User className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600" />
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Individual User</h2>
                      <p className="text-sm sm:text-base text-gray-600">Shop for personal or family needs</p>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <ShoppingBag className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-orange-600" />
                        </div>
                        <span className="text-sm text-gray-700">Browse & purchase products</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-orange-600" />
                        </div>
                        <span className="text-sm text-gray-700">Rate & review products</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-orange-600" />
                        </div>
                        <span className="text-sm text-gray-700">Secure payments & delivery</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="pt-4">
                      <div className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 group text-sm sm:text-base">
                        Register as User
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-orange-50 rounded-lg p-3 sm:p-4">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-base sm:text-lg font-bold text-orange-700">50K+</div>
                          <div className="text-xs text-orange-600">Happy Customers</div>
                        </div>
                        <div>
                          <div className="text-base sm:text-lg font-bold text-orange-700">2 mins</div>
                          <div className="text-xs text-orange-600">Quick Setup</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>

            {/* Business Registration Card */}
            <motion.div variants={itemVariants}>
              <Link href="/auth/register/business">
                <motion.div
                  className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 h-full cursor-pointer transition-all border-2 border-transparent hover:border-blue-200"
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center space-y-4 sm:space-y-6">
                    {/* Icon */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <Building className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Business</h2>
                      <p className="text-sm sm:text-base text-gray-600">Sell products and grow your business</p>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Store className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-700">Create your online store</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-700">Reach millions of customers</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-700">Analytics & growth tools</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="pt-4">
                      <div className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 group text-sm sm:text-base">
                        Register as Business
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-base sm:text-lg font-bold text-blue-700">10K+</div>
                          <div className="text-xs text-blue-600">Active Sellers</div>
                        </div>
                        <div>
                          <div className="text-base sm:text-lg font-bold text-blue-700">5 mins</div>
                          <div className="text-xs text-blue-600">Setup Time</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div 
            className="text-center mt-8 sm:mt-12 space-y-4"
            variants={itemVariants}
          >
            <p className="text-sm sm:text-base text-gray-600 px-4">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in here
              </Link>
            </p>
            
            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 pt-4 sm:pt-6 border-t border-gray-200 px-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Shield className="w-4 h-4 flex-shrink-0" />
                Secure Registration
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users className="w-4 h-4 flex-shrink-0" />
                60K+ Members
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Star className="w-4 h-4 flex-shrink-0" />
                Trusted Platform
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
