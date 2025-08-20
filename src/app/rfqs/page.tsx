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
} from 'lucide-react';
import { rfqService } from '../../services/rfq.service';
import { useSSOAuth } from '../../lib/auth/use-sso-auth';

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
  const { isAuthenticated } = useSSOAuth();
  const [rfqs, setRfqs] = useState<PublicRFQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'all' | 'product' | 'service'>('all');
  const [sort, setSort] = useState<'newest' | 'budget_desc' | 'budget_asc'>('newest');
  // no router usage needed on public page

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

  const Stat = ({ label, value, icon: Icon }: { label: string; value: string; icon: any }) => (
    <div className="flex items-center gap-3 rounded-2xl border bg-white/60 dark:bg-gray-900/60 backdrop-blur p-4">
      <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/15 to-orange-600/10 text-amber-600 dark:text-amber-400">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-lg font-semibold">{value}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Hero */}
      <section className="relative border-b overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent" />
        {!prefersReducedMotion && (
          <>
            <motion.div
              className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-br from-amber-300/30 to-orange-500/20 rounded-full blur-3xl"
              animate={{ x: [0, 25, -20, 0], y: [0, -15, 20, 0], rotate: [0, 120, 240, 360] }}
              transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute -bottom-16 -right-12 w-80 h-80 bg-gradient-to-tr from-amber-300/30 to-red-400/20 rounded-full blur-3xl"
              animate={{ x: [0, -30, 20, 0], y: [0, 20, -15, 0], rotate: [360, 240, 120, 0] }}
              transition={{ duration: 36, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
            />
          </>
        )}
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col items-center text-center gap-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200/50">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-semibold tracking-wide">Premium RFQs Marketplace</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Discover Live Buyer Requests
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="max-w-2xl text-base md:text-lg text-muted-foreground">
              Browse public RFQs and connect with verified buyers. Sign in to view full details and submit quotes.
            </motion.p>

            {/* Search & Filters */}
            <div className="w-full max-w-3xl mt-2">
              <div className="rounded-2xl border bg-white/70 dark:bg-gray-900/70 backdrop-blur p-3 shadow-sm">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search RFQs (e.g. Steel rods, Packaging, Logistics)"
                      className="w-full h-12 pl-11 pr-4 rounded-xl border bg-background focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <select value={type} onChange={(e) => setType(e.target.value as any)} className="h-12 rounded-xl border bg-background px-3">
                      <option value="all">All Types</option>
                      <option value="product">Products</option>
                      <option value="service">Services</option>
                    </select>
                    <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="h-12 rounded-xl border bg-background px-3">
                      <option value="newest">Newest</option>
                      <option value="budget_desc">Budget: High to Low</option>
                      <option value="budget_asc">Budget: Low to High</option>
                    </select>
                    <button onClick={() => { setQuery(''); setType('all'); setSort('newest'); }} className="h-12 rounded-xl border bg-background px-3 inline-flex items-center justify-center gap-2">
                      <Filter className="h-4 w-4" /> Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mt-6">
              <Stat label="Live RFQs" value={`${filtered.length}`} icon={Package} />
              <Stat label="Avg. Response Time" value="< 24 hrs" icon={Clock3} />
              <Stat label="Verified Buyers" value="5k+" icon={CheckCircle2} />
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              {isAuthenticated ? (
                <>
                  <Link href="/rfq" className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl">
                    Create RFQ
                  </Link>
                  <Link href="/dashboard" className="px-6 py-3 rounded-xl border-2 border-amber-500 text-amber-600 hover:bg-amber-50">
                    View Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth/register" className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl">
                    Join as Supplier
                  </Link>
                  <Link href="/auth/login" className="px-6 py-3 rounded-xl border-2 border-amber-500 text-amber-600 hover:bg-amber-50">
                    Sign In to Quote
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-6 py-10">
        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
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
        {!loading && !error && (
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
                {filtered.map((rfq) => {
                  const isProduct = rfq.quantity !== null;
                  const budgetLabel = rfq.budgetMin && rfq.budgetMax
                    ? `${formatCurrency(rfq.budgetMin)} - ${formatCurrency(rfq.budgetMax)}`
                    : rfq.budgetMax
                      ? `Up to ${formatCurrency(rfq.budgetMax)}`
                      : rfq.budgetMin
                        ? `From ${formatCurrency(rfq.budgetMin)}`
                        : 'Budget TBD';
                  return (
                    <motion.div key={rfq.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3 }} className="group relative rounded-2xl border bg-white/70 dark:bg-gray-900/70 backdrop-blur p-6 hover:shadow-xl hover:border-amber-200/70">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-amber-500/10 transition-colors" />
                      <div className="relative">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="inline-flex items-center gap-2 text-xs font-medium px-2 py-1 rounded-full border bg-amber-50 text-amber-700">
                              {isProduct ? 'Product RFQ' : 'Service RFQ'}
                            </div>
                            <h3 className="mt-3 text-lg font-bold leading-snug">
                              {rfq.title}
                            </h3>
                            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                              <span className="inline-flex items-center gap-1"><Package className="h-4 w-4" />{isProduct ? `Qty: ${rfq.quantity}` : 'Service'}</span>
                              <span className="inline-flex items-center gap-1"><Calendar className="h-4 w-4" />{new Date(rfq.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">Estimated Budget</div>
                            {isAuthenticated ? (
                              <div className="mt-1 flex items-center justify-end gap-1 text-base font-semibold">
                                <DollarSign className="h-4 w-4" />
                                <span>{budgetLabel}</span>
                              </div>
                            ) : (
                              <div className="mt-1 flex items-center justify-end gap-1 text-sm text-amber-600">
                                <Lock className="h-4 w-4" />
                                <span>Login to view</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Active</span>
                          </div>
                          {isAuthenticated ? (
                            <Link href={`/rfq/${rfq.id}`} className="inline-flex items-center gap-1 text-sm font-semibold text-amber-600 hover:text-amber-700">
                              View details <ChevronRight className="h-4 w-4" />
                            </Link>
                          ) : (
                            <Link href="/auth/login" className="inline-flex items-center gap-1 text-sm font-semibold text-amber-600 hover:text-amber-700">
                              Login to view <ChevronRight className="h-4 w-4" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Marketing CTA */}
    <div className="mt-10 rounded-2xl border bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-8 shadow-xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-extrabold">Ready to win new business?</h3>
                  <p className="mt-1 text-white/90">Sign in to view buyer details and submit competitive quotes within minutes.</p>
                </div>
                <div className="flex gap-3">
      <Link href="/auth/login" className="px-5 py-3 rounded-xl bg-white text-blue-600 font-semibold hover:bg-white/90">Sign In</Link>
                  <Link href="/auth/register" className="px-5 py-3 rounded-xl border-2 border-white text-white font-semibold hover:bg-white/10">Create Free Account</Link>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}