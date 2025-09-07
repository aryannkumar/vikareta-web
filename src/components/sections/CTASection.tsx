'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Store, Zap, CheckCircle, TrendingUp, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVikaretaAuthContext } from '@/lib/auth/vikareta';

export function CTASection() {
    const { isAuthenticated, user } = useVikaretaAuthContext();

    return (
        <section className="py-24 relative overflow-hidden bg-gradient-to-br from-orange-600 via-amber-600 to-orange-700">
            {/* Enhanced Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>

            {/* Animated Floating Elements */}
            <motion.div 
                className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-2xl"
                animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
                className="absolute bottom-20 right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl"
                animate={{ x: [0, -25, 0], y: [0, 15, 0], scale: [1, 0.9, 1] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div 
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
                        Ready to Transform Your 
                        <span className="block bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">
                            Procurement Process?
                        </span>
                    </h2>
                    <p className="text-2xl text-white/90 max-w-4xl mx-auto mb-8 leading-relaxed">
                        Join 5,000+ enterprises already using our platform to streamline procurement, reduce costs, and accelerate growth.
                    </p>
                    
                    {/* Success metrics */}
                    <motion.div 
                        className="flex flex-wrap justify-center gap-8 mt-8 text-white/80"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-amber-200" />
                            <span className="font-semibold">30% Cost Reduction</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-amber-200" />
                            <span className="font-semibold">50% Faster Procurement</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-amber-200" />
                            <span className="font-semibold">99.9% Uptime</span>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Enhanced CTA Cards */}
                <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto mb-16">
                    {/* For Buyers - Enhanced */}
                    <motion.div 
                        className="group bg-white/10 backdrop-blur-md rounded-3xl p-10 border border-white/20 hover:bg-white/15 transition-all duration-500 shadow-2xl hover:shadow-3xl"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                    >
                        <div className="flex items-center mb-8">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                                <Users className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-3xl font-bold text-white">For Enterprise Buyers</h3>
                        </div>
                        <p className="text-white/90 mb-6 leading-relaxed text-lg">
                            Streamline your procurement operations with verified suppliers, automated workflows, and enterprise-grade compliance tools.
                        </p>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center text-white/90">
                                <CheckCircle className="h-5 w-5 mr-3 text-amber-200" />
                                Access to 5,000+ verified enterprise suppliers
                            </li>
                            <li className="flex items-center text-white/90">
                                <CheckCircle className="h-5 w-5 mr-3 text-amber-200" />
                                Automated RFQ management & quote comparison
                            </li>
                            <li className="flex items-center text-white/90">
                                <CheckCircle className="h-5 w-5 mr-3 text-amber-200" />
                                Enterprise compliance & audit trails
                            </li>
                            <li className="flex items-center text-white/90">
                                <CheckCircle className="h-5 w-5 mr-3 text-amber-200" />
                                Advanced analytics & cost optimization
                            </li>
                        </ul>
                        {!isAuthenticated ? (
                            <Link href="/auth/register?type=buyer">
                                <motion.button
                                    className="w-full bg-white text-orange-600 hover:bg-orange-50 font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Start Enterprise Procurement
                                    <ArrowRight className="ml-2 h-5 w-5 inline group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </Link>
                        ) : user?.userType === 'buyer' ? (
                            <Link href="/products">
                                <motion.button
                                    className="w-full bg-white text-orange-600 hover:bg-orange-50 font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Browse Enterprise Catalog
                                    <ArrowRight className="ml-2 h-5 w-5 inline group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </Link>
                        ) : (
                            <Link href="/products">
                                <motion.button
                                    className="w-full bg-white text-orange-600 hover:bg-orange-50 font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Explore Marketplace
                                    <ArrowRight className="ml-2 h-5 w-5 inline group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </Link>
                        )}
                    </motion.div>

                    {/* For Sellers - Enhanced */}
                    <motion.div 
                        className="group bg-white/10 backdrop-blur-md rounded-3xl p-10 border border-white/20 hover:bg-white/15 transition-all duration-500 shadow-2xl hover:shadow-3xl"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                    >
                        <div className="flex items-center mb-8">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                                <Store className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-3xl font-bold text-white">For Enterprise Suppliers</h3>
                        </div>
                        <p className="text-white/90 mb-6 leading-relaxed text-lg">
                            Connect with enterprise buyers across India. Showcase your capabilities and grow your business with powerful supplier tools.
                        </p>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center text-white/90">
                                <CheckCircle className="h-5 w-5 mr-3 text-amber-200" />
                                Reach 50,000+ active enterprise buyers
                            </li>
                            <li className="flex items-center text-white/90">
                                <CheckCircle className="h-5 w-5 mr-3 text-amber-200" />
                                Advanced supplier dashboard & analytics
                            </li>
                            <li className="flex items-center text-white/90">
                                <CheckCircle className="h-5 w-5 mr-3 text-amber-200" />
                                RFQ management & quote automation
                            </li>
                            <li className="flex items-center text-white/90">
                                <CheckCircle className="h-5 w-5 mr-3 text-amber-200" />
                                Premium marketing & promotion tools
                            </li>
                        </ul>
                        {!isAuthenticated ? (
                            <Link href="/auth/register?type=business">
                                <motion.button
                                    className="w-full bg-white text-orange-600 hover:bg-orange-50 font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Become Enterprise Supplier
                                    <ArrowRight className="ml-2 h-5 w-5 inline group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </Link>
                        ) : user?.userType === 'business' ? (
                            <Link href="https://dashboard.vikareta.com">
                                <motion.button
                                    className="w-full bg-white text-orange-600 hover:bg-orange-50 font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Go to Business Dashboard
                                    <ArrowRight className="ml-2 h-5 w-5 inline group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </Link>
                        ) : (
                            <Link href="/auth/register?type=business">
                                <motion.button
                                    className="w-full bg-white text-orange-600 hover:bg-orange-50 font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Become Enterprise Supplier
                                    <ArrowRight className="ml-2 h-5 w-5 inline group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </Link>
                        )}
                    </motion.div>
                </div>

                {/* Bottom CTA with enhanced design */}
                <motion.div 
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <p className="text-white/90 mb-6 text-lg">
                        Already have an account?
                    </p>
                    {!isAuthenticated ? (
                        <Link href="/auth/login">
                            <motion.button
                                className="border-2 border-white text-white hover:bg-white hover:text-orange-600 font-semibold py-3 px-8 rounded-xl transition-all duration-300"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Sign In to Your Account
                            </motion.button>
                        </Link>
                    ) : (
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/products">
                                <motion.button
                                    className="border-2 border-white text-white hover:bg-white hover:text-orange-600 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Browse Products
                                </motion.button>
                            </Link>
                            <Link href="/rfq">
                                <motion.button
                                    className="border-2 border-white text-white hover:bg-white hover:text-orange-600 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Post RFQ
                                </motion.button>
                            </Link>
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
}