"use client";

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useMotionEnabled } from '@/lib/useMotionEnabled';
import { fadeInUp, staggerContainer, floatSlow } from '@/lib/motion';
import HeroParticles from '@/components/hero/HeroParticles';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, TrendingUp, Users, Shield, ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVikaretaAuthContext } from '@/lib/auth/vikareta';

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { isAuthenticated, user } = useVikaretaAuthContext();

  const motionEnabled = useMotionEnabled();

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const xSmall = useSpring(useTransform(mx, [-0.5, 0.5], [-15, 15]), { stiffness: 80, damping: 20, mass: 0.2 });
  const ySmall = useSpring(useTransform(my, [-0.5, 0.5], [-15, 15]), { stiffness: 80, damping: 20, mass: 0.2 });
  const xLarge = useSpring(useTransform(mx, [-0.5, 0.5], [-30, 30]), { stiffness: 70, damping: 18, mass: 0.25 });
  const yLarge = useSpring(useTransform(my, [-0.5, 0.5], [-30, 30]), { stiffness: 70, damping: 18, mass: 0.25 });

  const handleMouseMove = (e: React.MouseEvent) => {
  if (!motionEnabled) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(px);
    my.set(py);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const popularSearches = [
    'Electronics', 'Textiles', 'Machinery', 'Chemicals', 'Food Products'
  ];

  return (
      <section
        ref={sectionRef}
        onMouseMove={handleMouseMove}
        className="relative bg-gradient-to-br from-white via-blue-50 to-blue-50 dark:from-gray-900 dark:via-blue-900/10 dark:to-blue-900/10 py-24 overflow-hidden"
      >
        {/* Particle / Gradient Background */}
        <HeroParticles className="mix-blend-screen opacity-60" />

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23007BFF' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

  {/* Animated Gradient Blobs (Parallax) */}
  {motionEnabled && (
          <>
            <motion.div
              aria-hidden
              style={{ x: xLarge, y: yLarge }}
              className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-br from-blue-300/25 to-indigo-400/20 dark:from-blue-500/15 dark:to-indigo-500/10 rounded-full blur-3xl"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              aria-hidden
              style={{ x: xSmall, y: ySmall }}
              className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tr from-blue-300/30 to-purple-400/20 dark:from-blue-500/15 dark:to-purple-600/10 rounded-full blur-3xl translate-x-12 translate-y-12"
              animate={{ rotate: [360, 0] }}
              transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
            />
          </>
        )}

        {/* Floating Elements */}
  {motionEnabled && (
          <>
            <motion.div
              variants={floatSlow}
              animate="animate"
              className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"
            />
            <motion.div
              variants={floatSlow}
              animate="animate"
              style={{ animationDelay: '0.6s' }}
              className="absolute bottom-20 right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"
            />
            <motion.div
              variants={floatSlow}
              animate="animate"
              style={{ animationDelay: '1.2s' }}
              className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-500/5 rounded-full blur-lg"
            />
          </>
        )}

        {/* Micro moving accents near heading */}
  {motionEnabled && (
          <div className="pointer-events-none absolute inset-x-0 top-28 flex justify-center gap-6">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-2 h-2 rounded-full bg-blue-400/70"
                animate={{ y: [0, -6, 0], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
              />
            ))}
          </div>
        )}

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-5xl mx-auto text-center"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            {/* Main Heading */}
            <motion.div className="mb-12" variants={fadeInUp}>
              <motion.h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight" variants={fadeInUp}>
                India's Leading{' '}
                <motion.span
                  className="text-gradient-orange-blue inline-block"
                  animate={motionEnabled ? { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] } : undefined}
                  transition={motionEnabled ? { duration: 10, repeat: Infinity, ease: "easeInOut" } : undefined}
                >
                  B2B Marketplace
                </motion.span>
              </motion.h1>

              <motion.p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed" variants={fadeInUp}>
                Connect with verified suppliers and buyers across India. Source quality products at competitive prices with complete transparency and security.
              </motion.p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div className="flex flex-col sm:flex-row gap-6 justify-center mb-16" variants={fadeInUp}>
              {!isAuthenticated ? (
                <>
                  <Link href="/auth/register?type=buyer">
                    <Button size="lg" className="btn-primary px-10 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                      Start Buying
                      <ArrowRight className="ml-3 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/auth/register?type=business">
                    <Button size="lg" className="btn-outline px-10 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                      Become a Business
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/products">
                    <Button size="lg" className="btn-primary px-10 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                      Browse Products
                      <ArrowRight className="ml-3 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/services">
                    <Button size="lg" className="btn-secondary px-10 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                      Browse Services
                      <ArrowRight className="ml-3 h-5 w-5" />
                    </Button>
                  </Link>
                  {user?.userType === 'business' ? (
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all"
                      onClick={() => {
                        const dashboardUrl = process.env.NODE_ENV === 'development'
                          ? 'http://localhost:3001'
                          : 'https://dashboard.vikareta.com';

                        const token = localStorage.getItem('auth_token');
                        if (token) {
                          const urlWithAuth = `${dashboardUrl}?token=${encodeURIComponent(token)}`;
                          window.location.href = urlWithAuth;
                        } else {
                          window.location.href = dashboardUrl;
                        }
                      }}
                    >
                      Go to Dashboard
                    </Button>
                  ) : (
            <Link href="/rfq">
              <Button variant="outline" size="lg" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all">
                        Post RFQ
                      </Button>
                    </Link>
                  )}
                </>
              )}
            </motion.div>

            {/* Search Bar */}
            <motion.div className="max-w-4xl mx-auto mb-12" variants={fadeInUp}>
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, suppliers, or categories..."
          className="w-full pl-16 pr-36 py-6 text-lg border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-gray-800 shadow-xl transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400"
                />
                <motion.div className="absolute right-3 top-3 bottom-3 rounded-xl overflow-hidden">
                  {motionEnabled && (
                    <motion.div
                      aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 opacity-80"
                      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      style={{ backgroundSize: "200% 200%" }}
                    />
                  )}
                  <Button
                    type="submit"
                    className="relative btn-primary px-8 h-full rounded-xl font-bold shadow-lg hover:shadow-xl"
                  >
                    Search
                  </Button>
                </motion.div>
              </form>

              {/* Popular Searches */}
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 mr-2">Popular:</span>
                {popularSearches.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchQuery(term);
                      router.push(`/search?q=${encodeURIComponent(term)}`);
                    }}
                    className="text-sm bg-white dark:bg-gray-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-200 font-medium"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto" variants={staggerContainer}>
              <motion.div className="text-center group" variants={fadeInUp}>
                <div className="flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mx-auto mb-6 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                  <Users className="h-10 w-10 text-blue-600" />
                </div>
                <div className="text-4xl font-bold mb-3 text-gray-900 dark:text-white">5,000+</div>
                <div className="text-gray-600 dark:text-gray-300 font-semibold text-lg">Verified Suppliers</div>
              </motion.div>

              <motion.div className="text-center group" variants={fadeInUp}>
                <div className="flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mx-auto mb-6 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                  <TrendingUp className="h-10 w-10 text-blue-700" />
                </div>
                <div className="text-4xl font-bold mb-3 text-gray-900 dark:text-white">₹500Cr+</div>
                <div className="text-gray-600 dark:text-gray-300 font-semibold text-lg">Trade Volume</div>
              </motion.div>

              <motion.div className="text-center group" variants={fadeInUp}>
                <div className="flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mx-auto mb-6 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                  <Shield className="h-10 w-10 text-blue-600" />
                </div>
                <div className="text-4xl font-bold mb-3 text-gray-900 dark:text-white">100%</div>
                <div className="text-gray-600 dark:text-gray-300 font-semibold text-lg">Secure Transactions</div>
              </motion.div>
            </motion.div>

            {/* Video/Demo Section */}
            <div className="mt-20">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="group flex items-center justify-center mx-auto bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 rounded-2xl px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-600">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <Play className="h-6 w-6 text-white ml-1" />
                </div>
                <span className="text-gray-700 dark:text-gray-300 font-semibold text-lg">Watch How It Works</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
  );
}