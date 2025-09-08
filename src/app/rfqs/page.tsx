'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Package,
  Calendar,
  DollarSign,
  Filter,
  Search,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Clock3,
  Lock,
  TrendingUp,
  Users,
  Star,
  Timer,
  ShieldCheck,
  Zap,
  Target,
  Trophy,
  Award,
  ArrowRight,
  PlayCircle,
  MessageSquare,
  Eye,
  UserCheck,
  Briefcase,
  Building2
} from 'lucide-react';
import { rfqService } from '../../services/rfq.service';
import { useVikaretaAuthContext } from '../../lib/auth/vikareta';
import { AnalyticsService, HomepageStats } from '../../lib/api/analytics';
import { UsageLimitsService, UsageLimits } from '../../services/usage-limits.service';

type PublicRFQ = {
  id: string;
  title: string;
  quantity: number | null;
  budgetMin: number | null;
  budgetMax: number | null;
  createdAt: string;
};

export default function PublicRFQsPage() {
  const prefersReducedMotion = useReducedMotion();
  const { isAuthenticated } = useVikaretaAuthContext();
  const [rfqs, setRfqs] = useState<PublicRFQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'all' | 'product' | 'service'>('all');
  const [sort, setSort] = useState<'newest' | 'budget_desc' | 'budget_asc'>('newest');
  const [homepageStats, setHomepageStats] = useState<HomepageStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [usageLimits, setUsageLimits] = useState<UsageLimits | null>(null);
  const [usageLimitsLoading, setUsageLimitsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await rfqService.getPublicRecentRfqs(24);
        setRfqs(data);
      } catch (e: any) {
        setError(e?.message || 'Failed to load RFQs');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Load homepage stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        setStatsLoading(true);
        const stats = await AnalyticsService.getHomepageStats();
        setHomepageStats(stats);
      } catch (error) {
        console.error('Error loading homepage stats:', error);
        // Keep null so component uses default values
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, []);

  // Load usage limits for authenticated users
  useEffect(() => {
    const loadUsageLimits = async () => {
      if (!isAuthenticated) return;

      try {
        setUsageLimitsLoading(true);
        const limits = await UsageLimitsService.getUsageSummary();
        setUsageLimits(limits);
      } catch (error) {
        console.error('Error loading usage limits:', error);
        // Keep null so component uses default values
      } finally {
        setUsageLimitsLoading(false);
      }
    };

    loadUsageLimits();
  }, [isAuthenticated]);

  const filtered = useMemo(() => {
    let list = rfqs;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((r) => r.title.toLowerCase().includes(q));
    }
    if (type !== 'all') {
      list = list.filter((r) => (type === 'product' ? r.quantity !== null : r.quantity === null));
    }
    const budgetValue = (r: PublicRFQ) => r.budgetMax ?? r.budgetMin ?? 0;
    if (sort === 'budget_desc') list = [...list].sort((a, b) => budgetValue(b) - budgetValue(a));
    if (sort === 'budget_asc') list = [...list].sort((a, b) => budgetValue(a) - budgetValue(b));
    if (sort === 'newest') list = [...list].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    return list;
  }, [rfqs, query, type, sort]);

  const formatCurrency = (amount: number | null) => {
    if (!amount) return '';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <section className="relative border-b overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-10" />
        {!prefersReducedMotion && (
          <>
            <motion.div
              className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-br from-cyan-400/30 to-blue-500/20 rounded-full blur-3xl"
              animate={{ x: [0, 25, -20, 0], y: [0, -15, 20, 0], rotate: [0, 120, 240, 360] }}
              transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute -bottom-16 -right-12 w-80 h-80 bg-gradient-to-tr from-purple-400/30 to-pink-500/20 rounded-full blur-3xl"
              animate={{ x: [0, -30, 20, 0], y: [0, 20, -15, 0], rotate: [360, 240, 120, 0] }}
              transition={{ duration: 36, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
            />
          </>
        )}
        <div className="container mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Main content */}
            <div className="text-left">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-300/30 backdrop-blur-sm mb-6">
                  <Trophy className="h-5 w-5 text-cyan-300" />
                  <span className="text-cyan-100 font-semibold text-sm">India's #1 B2B RFQ Platform</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  <span className="text-white">Win Business with</span>
                  <br />
                  <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                    Live RFQs
                  </span>
                </h1>
                
                <p className="text-xl text-indigo-100 mb-8 leading-relaxed max-w-lg">
                  Connect with {homepageStats ? homepageStats.verifiedBuyers.toLocaleString() : '500+'} verified buyers actively seeking suppliers. 
                  Start bidding on live requirements today.
                </p>

                {/* Social Proof */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 border-2 border-white flex items-center justify-center">
                          <UserCheck className="w-4 h-4 text-white" />
                        </div>
                      ))}
                    </div>
                    <span className="text-cyan-100 text-sm font-medium">500+ Active Suppliers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white font-semibold">4.9/5</span>
                    <span className="text-indigo-200 text-sm">(2,847 reviews)</span>
                  </div>
                </div>

                {/* CTAs */}
                {isAuthenticated ? (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/rfq" className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-2">
                      <Target className="w-5 h-5" />
                      Post Your RFQ
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                        {usageLimitsLoading ? '...' : usageLimits ? `${usageLimits.rfq.remaining} Free/Month` : '3 Free/Month'}
                      </span>
                    </Link>
                    <Link href="/dashboard" className="px-8 py-4 border-2 border-cyan-300 text-cyan-100 hover:bg-cyan-300 hover:text-indigo-900 font-bold rounded-xl transition-all duration-300 inline-flex items-center justify-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      View Dashboard
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/auth/register" className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-2">
                      <Zap className="w-5 h-5" />
                      Start Winning Deals
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link href="/auth/login" className="px-8 py-4 border-2 border-cyan-300 text-cyan-100 hover:bg-cyan-300 hover:text-indigo-900 font-bold rounded-xl transition-all duration-300 inline-flex items-center justify-center gap-2">
                      <Users className="w-5 h-5" />
                      Sign In to Bid
                    </Link>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right side - Key benefits */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">Why Suppliers Choose Us</h3>
                <div className="space-y-4">
                  {[
                    { icon: TrendingUp, title: 'Higher Win Rates', desc: '3x more likely to win deals vs competitors' },
                    { icon: Timer, title: 'Fast Responses', desc: 'Get buyer contact within 24 hours' },
                    { icon: ShieldCheck, title: 'Verified Buyers', desc: 'All buyers are KYC verified with real budgets' },
                    { icon: Award, title: 'Premium Support', desc: '24/7 dedicated relationship manager' }
                  ].map((benefit, index) => (
                    <motion.div 
                      key={benefit.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600">
                        <benefit.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">{benefit.title}</h4>
                        <p className="text-indigo-200 text-sm">{benefit.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Live Stats Bar */}
          <div className="bg-white/10 backdrop-blur-sm border-t border-white/20 py-6 mt-16">
            <div className="container mx-auto px-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
              >
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-cyan-300 mb-1">
                    {homepageStats ? `${homepageStats.liveRfqs.toLocaleString()}+` : '1,247+'}
                  </div>
                  <div className="text-indigo-200 text-sm font-medium">Live RFQs</div>
                  <div className="text-xs text-green-300 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +12% today
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-purple-300 mb-1">
                    {homepageStats ? homepageStats.responseTime : '< 24h'}
                  </div>
                  <div className="text-indigo-200 text-sm font-medium">Avg Response</div>
                  <div className="text-xs text-green-300 mt-1 flex items-center gap-1">
                    <Timer className="w-3 h-3" /> 94% on time
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-pink-300 mb-1">
                    {homepageStats ? `${homepageStats.verifiedBuyers.toLocaleString()}+` : '856+'}
                  </div>
                  <div className="text-indigo-200 text-sm font-medium">Active Buyers</div>
                  <div className="text-xs text-green-300 mt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> All verified
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-yellow-300 mb-1">
                    {homepageStats ? `${homepageStats.rfqSuccessRate}%` : '87%'}
                  </div>
                  <div className="text-indigo-200 text-sm font-medium">Success Rate</div>
                  <div className="text-xs text-green-300 mt-1 flex items-center gap-1">
                    <Award className="w-3 h-3" /> Industry leading
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filters Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Your Perfect Business Match</h2>
                <p className="text-gray-600">Search through thousands of live RFQs and connect with buyers today</p>
              </div>
              
              <div className="space-y-6">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for specific products, services, or requirements..."
                    className="w-full h-14 pl-12 pr-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-lg transition-all"
                  />
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <select 
                    value={type} 
                    onChange={(e) => setType(e.target.value as any)} 
                    className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 px-4 text-gray-700 font-medium"
                  >
                    <option value="all">All Categories</option>
                    <option value="product">Product RFQs</option>
                    <option value="service">Service RFQs</option>
                  </select>
                  
                  <select 
                    value={sort} 
                    onChange={(e) => setSort(e.target.value as any)} 
                    className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 px-4 text-gray-700 font-medium"
                  >
                    <option value="newest">Newest First</option>
                    <option value="budget_desc">Highest Budget</option>
                    <option value="budget_asc">Lowest Budget</option>
                  </select>
                  
                  <button 
                    onClick={() => { setQuery(''); setType('all'); setSort('newest'); }}
                    className="h-12 rounded-xl border-2 border-gray-200 hover:border-blue-500 px-4 font-medium text-gray-700 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Filter className="h-4 w-4" /> Clear Filters
                  </button>
                  
                  {!isAuthenticated && (
                    <Link 
                      href="/auth/register"
                      className="h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-6 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Zap className="h-4 w-4" /> Join Now
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Content */}
      <section className="container mx-auto px-6 py-10">
        {/* Urgency Banner */}
        {!isAuthenticated && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-6 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Timer className="h-5 w-5" />
              <span className="font-bold">Limited Time: Free Registration</span>
            </div>
            <p className="text-orange-100">Join now and get access to premium RFQs worth ₹10+ Crores</p>
          </motion.div>
        )}
        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Loading skeletons */}
        {(loading || statsLoading) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="rounded-2xl border bg-white/70 dark:bg-gray-900/70 p-6 animate-pulse">
                <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
                <div className="flex items-center justify-between">
                  <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="h-8 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {!loading && !statsLoading && !error && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Latest RFQs</h2>
              <div className="text-sm text-muted-foreground">Showing {filtered.length} results</div>
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-2xl border bg-white/70 dark:bg-gray-900/70 p-10 text-center">
                <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-1">No RFQs match your filters</h3>
                <p className="text-muted-foreground mb-5">Try adjusting search or filter options.</p>
                <button onClick={() => { setQuery(''); setType('all'); setSort('newest'); }} className="px-4 py-2 rounded-lg border text-sm">Reset Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((rfq, index) => {
                  const isProduct = rfq.quantity !== null;
                  const budgetLabel = rfq.budgetMin && rfq.budgetMax
                    ? `${formatCurrency(rfq.budgetMin)} - ${formatCurrency(rfq.budgetMax)}`
                    : rfq.budgetMax
                      ? `Up to ${formatCurrency(rfq.budgetMax)}`
                      : rfq.budgetMin
                        ? `From ${formatCurrency(rfq.budgetMin)}`
                        : 'Budget TBD';
                  
                  const daysAgo = Math.floor((Date.now() - new Date(rfq.createdAt).getTime()) / (1000 * 60 * 60 * 24));
                  const urgencyColor = daysAgo <= 1 ? 'text-red-600 bg-red-50' : daysAgo <= 3 ? 'text-orange-600 bg-orange-50' : 'text-green-600 bg-green-50';
                  
                  return (
                    <motion.div 
                      key={rfq.id} 
                      initial={{ opacity: 0, y: 20 }} 
                      whileInView={{ opacity: 1, y: 0 }} 
                      viewport={{ once: true }} 
                      transition={{ duration: 0.3, delay: index * 0.1 }} 
                      className="group relative bg-white rounded-2xl border-2 border-gray-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                      {/* Urgent badge */}
                      {daysAgo <= 2 && (
                        <div className="absolute top-4 right-4 z-10">
                          <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                            HOT 🔥
                          </div>
                        </div>
                      )}
                      
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${isProduct ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
                                {isProduct ? <Package className="h-3 w-3" /> : <Briefcase className="h-3 w-3" />}
                                {isProduct ? 'Product' : 'Service'}
                              </span>
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${urgencyColor}`}>
                                {daysAgo === 0 ? 'Posted today' : `${daysAgo} days ago`}
                              </span>
                            </div>
                            
                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {rfq.title}
                            </h3>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                              {isProduct && (
                                <span className="flex items-center gap-1">
                                  <Package className="h-4 w-4" />
                                  Qty: {rfq.quantity?.toLocaleString()}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(rfq.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Budget Section */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-4">
                          <div className="text-sm text-gray-600 mb-1">Estimated Budget</div>
                          {isAuthenticated ? (
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-5 w-5 text-green-600" />
                              <span className="text-xl font-bold text-green-700">{budgetLabel}</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-gray-500">
                                <Lock className="h-4 w-4" />
                                <span className="font-medium">Hidden - Sign up to view</span>
                              </div>
                              <Link href="/auth/register" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                                Unlock →
                              </Link>
                            </div>
                          )}
                        </div>

                        {/* Action Section */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Active
                            </span>
                            {!isAuthenticated && (
                              <span className="text-xs text-orange-600 font-medium">
                                {Math.floor(Math.random() * 15) + 5} suppliers viewing
                              </span>
                            )}
                          </div>
                          
                          {isAuthenticated ? (
                            <Link 
                              href={`/rfq/${rfq.id}`} 
                              className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                            >
                              Submit Quote
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                          ) : (
                            <Link 
                              href="/auth/register" 
                              className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                            >
                              Join to Bid
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          )}
                        </div>
                      </div>
                      
                      {/* Hover effect overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/5 group-hover:to-purple-600/5 transition-all duration-300 pointer-events-none" />
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Multi-tier CTA sections */}
            <div className="space-y-8 mt-12">
              {/* Primary CTA for non-authenticated users */}
              {!isAuthenticated && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white text-center relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="relative z-10">
                    <div className="max-w-3xl mx-auto">
                      <h3 className="text-3xl font-bold mb-4">Ready to Win Your Next Big Deal?</h3>
                      <p className="text-xl text-white/90 mb-2">Join {homepageStats ? homepageStats.verifiedBuyers.toLocaleString() : '500+'} suppliers already winning business on our platform</p>
                      <p className="text-white/80 mb-8">✅ 3 Free RFQ posts per month • ✅ 5 Free quote responses • ✅ Direct buyer contact</p>
                      
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link 
                          href="/auth/register" 
                          className="group px-8 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-2"
                        >
                          <Zap className="w-5 h-5" />
                          Start Winning Deals - FREE
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link 
                          href="/auth/login" 
                          className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold rounded-xl transition-all duration-300 inline-flex items-center justify-center gap-2"
                        >
                          <Users className="w-5 h-5" />
                          Already a Member? Sign In
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Social Proof Section */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Trusted by Industry Leaders</h3>
                  <p className="text-gray-600">See what our suppliers say about winning deals on our platform</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      quote: "Won ₹50L worth of orders in my first month. The quality of buyers here is exceptional.",
                      author: "Rajesh Kumar",
                      company: "Kumar Steel Industries",
                      rating: 5
                    },
                    {
                      quote: "Fast, verified buyers with real budgets. My conversion rate increased by 300%.",
                      author: "Priya Sharma",
                      company: "TechPack Solutions",
                      rating: 5
                    },
                    {
                      quote: "The platform connects us directly with decision makers. No middlemen, no delays.",
                      author: "Ahmed Ali",
                      company: "Metro Logistics",
                      rating: 5
                    }
                  ].map((testimonial, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-50 rounded-xl p-6"
                    >
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.author}</div>
                        <div className="text-sm text-gray-600">{testimonial.company}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Feature Comparison for authenticated users */}
              {isAuthenticated && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Monthly Limits</h3>
                    <p className="text-gray-600">Track your usage and upgrade for unlimited access</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl p-6 border border-green-200">
                      <div className="flex items-center gap-3 mb-4">
                        <Target className="w-8 h-8 text-green-600" />
                        <h4 className="text-lg font-bold">RFQ Posts</h4>
                      </div>
                      {usageLimitsLoading ? (
                        <div className="animate-pulse">
                          <div className="h-8 bg-gray-200 rounded mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded mb-4"></div>
                        </div>
                      ) : (
                        <>
                          <div className="text-3xl font-bold text-green-600 mb-2">
                            {usageLimits ? `${usageLimits.rfq.used} / ${usageLimits.rfq.limit}` : '3 / 3'}
                          </div>
                          <p className="text-gray-600 text-sm mb-4">
                            {usageLimits ? `${usageLimits.rfq.remaining} free posts remaining this month` : 'Free posts remaining this month'}
                          </p>
                        </>
                      )}
                      <Link href="/rfq" className="block w-full text-center bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition-colors">
                        Post New RFQ
                      </Link>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 border border-blue-200">
                      <div className="flex items-center gap-3 mb-4">
                        <MessageSquare className="w-8 h-8 text-blue-600" />
                        <h4 className="text-lg font-bold">Quote Responses</h4>
                      </div>
                      {usageLimitsLoading ? (
                        <div className="animate-pulse">
                          <div className="h-8 bg-gray-200 rounded mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded mb-4"></div>
                        </div>
                      ) : (
                        <>
                          <div className="text-3xl font-bold text-blue-600 mb-2">
                            {usageLimits ? `${usageLimits.quotes.used} / ${usageLimits.quotes.limit}` : '5 / 5'}
                          </div>
                          <p className="text-gray-600 text-sm mb-4">
                            {usageLimits ? `${usageLimits.quotes.remaining} free responses remaining` : 'Free responses remaining'}
                          </p>
                        </>
                      )}
                      <button className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors">
                        Browse RFQs
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}