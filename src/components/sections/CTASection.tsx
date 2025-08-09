'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Users, Store, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/useAuth';

export function CTASection() {
    const { isAuthenticated, user } = useAuth();

    return (
        <section className="py-24 gradient-orange-blue relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>

            {/* Floating Elements */}
            <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
                        Ready to Grow Your Business?
                    </h2>
                    <p className="text-2xl text-white/90 max-w-4xl mx-auto mb-8 leading-relaxed">
                        Join thousands of businesses already using Vikareta to connect, trade, and grow.
                        Start your journey today and unlock new opportunities.
                    </p>
                </div>

                {/* CTA Cards */}
                <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto mb-16">
                    {/* For Buyers */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-10 border border-white/20 hover:bg-white/15 transition-all duration-300 shadow-2xl hover:shadow-3xl">
                        <div className="flex items-center mb-8">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-6">
                                <Users className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-3xl font-bold text-white">For Buyers</h3>
                        </div>
                        <p className="text-orange-100 mb-6 leading-relaxed">
                            Find verified suppliers, compare prices, and source quality products for your business.
                            Get competitive quotes and build lasting partnerships.
                        </p>
                        <ul className="space-y-2 mb-8">
                            <li className="flex items-center text-orange-100">
                                <Zap className="h-4 w-4 mr-2 text-yellow-300" />
                                Access to 5,000+ verified suppliers
                            </li>
                            <li className="flex items-center text-orange-100">
                                <Zap className="h-4 w-4 mr-2 text-yellow-300" />
                                Easy RFQ management system
                            </li>
                            <li className="flex items-center text-orange-100">
                                <Zap className="h-4 w-4 mr-2 text-yellow-300" />
                                Secure payment & order tracking
                            </li>
                        </ul>
                        {!isAuthenticated ? (
                            <Link href="/auth/register?type=buyer">
                                <Button className="w-full bg-white text-orange-600 hover:bg-orange-50 font-semibold">
                                    Start Buying
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        ) : user?.role === 'buyer' ? (
                            <Link href="/products">
                                <Button className="w-full bg-white text-orange-600 hover:bg-orange-50 font-semibold">
                                    Browse Products
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/products">
                                <Button className="w-full bg-white text-orange-600 hover:bg-orange-50 font-semibold">
                                    Explore Marketplace
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* For Sellers */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-10 border border-white/20 hover:bg-white/15 transition-all duration-300 shadow-2xl hover:shadow-3xl">
                        <div className="flex items-center mb-8">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-6">
                                <Store className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-3xl font-bold text-white">For Sellers</h3>
                        </div>
                        <p className="text-orange-100 mb-6 leading-relaxed">
                            Showcase your products to thousands of buyers across India.
                            Grow your business with our powerful seller tools and marketing features.
                        </p>
                        <ul className="space-y-2 mb-8">
                            <li className="flex items-center text-orange-100">
                                <Zap className="h-4 w-4 mr-2 text-yellow-300" />
                                Reach 50,000+ active buyers
                            </li>
                            <li className="flex items-center text-orange-100">
                                <Zap className="h-4 w-4 mr-2 text-yellow-300" />
                                Advanced seller dashboard
                            </li>
                            <li className="flex items-center text-orange-100">
                                <Zap className="h-4 w-4 mr-2 text-yellow-300" />
                                Marketing & promotion tools
                            </li>
                        </ul>
                        {!isAuthenticated ? (
                            <Link href="/auth/register?type=seller">
                                <Button className="w-full bg-white text-orange-600 hover:bg-orange-50 font-semibold">
                                    Start Selling
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        ) : user?.role === 'seller' ? (
                            <Link href="/dashboard">
                                <Button className="w-full bg-white text-orange-600 hover:bg-orange-50 font-semibold">
                                    Go to Dashboard
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/auth/register?type=seller">
                                <Button className="w-full bg-white text-orange-600 hover:bg-orange-50 font-semibold">
                                    Become a Seller
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="text-center">
                    <p className="text-orange-100 mb-6">
                        Already have an account?
                    </p>
                    {!isAuthenticated ? (
                        <Link href="/auth/login">
                            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
                                Sign In to Your Account
                            </Button>
                        </Link>
                    ) : (
                        <div className="flex justify-center space-x-4">
                            <Link href="/products">
                                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
                                    Browse Products
                                </Button>
                            </Link>
                            <Link href="/rfq">
                                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
                                    Post RFQ
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}