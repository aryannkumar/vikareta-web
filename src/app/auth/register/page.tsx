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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        <motion.div 
          className="text-center mb-12"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Logo className="h-24 w-auto" />
          <div className="mt-6 space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Join Vikareta</h1>
            <p className="text-lg text-gray-600">Choose how you want to get started</p>
          </div>
        </motion.div>

        {/* Registration Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* User Registration Card */}
          <motion.div variants={itemVariants}>
            <Link href="/auth/register/user">
              <motion.div
                className="bg-white rounded-2xl shadow-lg p-8 h-full cursor-pointer transition-all border-2 border-transparent hover:border-orange-200"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-center space-y-6">
                  {/* Icon */}
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                    <User className="w-10 h-10 text-orange-600" />
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900">Individual User</h2>
                    <p className="text-gray-600">Shop for personal or family needs</p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                        <ShoppingBag className="w-3 h-3 text-orange-600" />
                      </div>
                      <span className="text-sm text-gray-700">Browse & purchase products</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                        <Star className="w-3 h-3 text-orange-600" />
                      </div>
                      <span className="text-sm text-gray-700">Rate & review products</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                        <Shield className="w-3 h-3 text-orange-600" />
                      </div>
                      <span className="text-sm text-gray-700">Secure payments & delivery</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="pt-4">
                    <div className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 group">
                      Register as User
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-orange-700">50K+</div>
                        <div className="text-xs text-orange-600">Happy Customers</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-orange-700">2 mins</div>
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
                className="bg-white rounded-2xl shadow-lg p-8 h-full cursor-pointer transition-all border-2 border-transparent hover:border-blue-200"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-center space-y-6">
                  {/* Icon */}
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Building className="w-10 h-10 text-blue-600" />
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900">Business</h2>
                    <p className="text-gray-600">Sell products and grow your business</p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <Store className="w-3 h-3 text-blue-600" />
                      </div>
                      <span className="text-sm text-gray-700">Create your online store</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-3 h-3 text-blue-600" />
                      </div>
                      <span className="text-sm text-gray-700">Reach millions of customers</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-3 h-3 text-blue-600" />
                      </div>
                      <span className="text-sm text-gray-700">Analytics & growth tools</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="pt-4">
                    <div className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 group">
                      Register as Business
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-blue-700">10K+</div>
                        <div className="text-xs text-blue-600">Active Sellers</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-700">5 mins</div>
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
          className="text-center mt-12 space-y-4"
          variants={itemVariants}
        >
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in here
            </Link>
          </p>
          
          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-8 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Shield className="w-4 h-4" />
              Secure Registration
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users className="w-4 h-4" />
              60K+ Members
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Star className="w-4 h-4" />
              Trusted Platform
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
