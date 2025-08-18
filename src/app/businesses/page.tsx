"use client";

import React, { useEffect, useState } from 'react';
import { marketplaceApi, type NearbyBusiness } from '@/lib/api/marketplace';
import BusinessCard from '@/components/business/BusinessCard';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { Badge } from '@/components/ui/badge';

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<NearbyBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'nearby' | 'popular' | 'featured'>('nearby');
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState<NearbyBusiness[]>([]);
  const [debounceTimeout, setDebounceTimeout] = useState<number | null>(null);

  const loadBusinesses = async (tab: typeof activeTab = activeTab) => {
    try {
      setLoading(true);
      setError(null);
      let res;
      if (tab === 'nearby') {
        res = await marketplaceApi.getNearbyBusinesses();
      } else if (tab === 'popular') {
        res = await marketplaceApi.getPopularBusinesses();
      } else {
        res = await marketplaceApi.getFeaturedBusinesses();
      }

      if ((res as any).success) {
        const payload = (res as any).data;
        let source: any[] = [];
        if (Array.isArray(payload)) source = payload;
        else if (Array.isArray(payload?.businesses)) source = payload.businesses;
        else if (Array.isArray(payload?.data)) source = payload.data;
        else if (Array.isArray(payload?.items)) source = payload.items;

        // Show all businesses by default (not verified-only)
        const loaded = source || [];
        setBusinesses(loaded as NearbyBusiness[]);

        // apply query filter immediately
        if (query.trim() === '') {
          setFiltered(loaded as NearbyBusiness[]);
        } else {
          const q = query.toLowerCase();
          setFiltered((loaded as NearbyBusiness[]).filter(b => (b.name || '').toLowerCase().includes(q) || (b.category || '').toLowerCase().includes(q) || (b.address || '').toLowerCase().includes(q)));
        }
      } else {
        setError((res as any).error || 'Failed to load businesses');
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to load businesses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBusinesses(activeTab);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">Business Directory</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Discover verified suppliers, manufacturers and service providers across India.</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="inline-flex items-center bg-white dark:bg-gray-900 px-3 py-1 rounded-full border border-gray-200">
                <strong className="mr-2">{businesses.length}</strong> listed
              </span>
              <button onClick={() => loadBusinesses(activeTab)} className="text-sm text-orange-600">Retry</button>
            </div>
          </div>

          <div className="w-full md:w-1/2 lg:w-1/3">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-900 p-2 rounded-lg border border-gray-100 dark:border-gray-700">
              <input
                placeholder="Search businesses, categories, locations..."
                value={query}
                className="flex-1 px-3 py-2 bg-transparent outline-none"
                onChange={(e) => {
                  const v = e.target.value;
                  setQuery(v);
                  if (debounceTimeout) window.clearTimeout(debounceTimeout);
                  const t = window.setTimeout(async () => {
                    const q = v.trim();
                    if (q.length >= 2) {
                      try {
                        const searchRes = await marketplaceApi.searchMarketplace(q, { type: 'businesses' });
                        if ((searchRes as any).success) {
                          const payload = (searchRes as any).data;
                          let src: any[] = [];
                          if (Array.isArray(payload)) src = payload;
                          else if (Array.isArray(payload?.businesses)) src = payload.businesses;
                          else if (Array.isArray(payload?.data)) src = payload.data;
                          else if (Array.isArray(payload?.items)) src = payload.items;

                          setFiltered(src || []);
                        } else {
                          setFiltered([]);
                        }
                      } catch (e) {
                        console.error(e);
                        setFiltered([]);
                      }
                    } else if (q === '') {
                      setFiltered(businesses);
                    } else {
                      const qq = q.toLowerCase();
                      setFiltered(businesses.filter(b => (b.name || '').toLowerCase().includes(qq) || (b.category || '').toLowerCase().includes(qq) || (b.address || '').toLowerCase().includes(qq)));
                    }
                  }, 300);
                  setDebounceTimeout(t as unknown as number);
                }}
              />
              <div className="flex items-center gap-2 px-2">
                <button onClick={() => { setActiveTab('nearby'); loadBusinesses('nearby'); }} className={`px-3 py-1 rounded ${activeTab === 'nearby' ? 'bg-orange-600 text-white' : 'bg-transparent'}`}>Nearby</button>
                <button onClick={() => { setActiveTab('popular'); loadBusinesses('popular'); }} className={`px-3 py-1 rounded ${activeTab === 'popular' ? 'bg-orange-600 text-white' : 'bg-transparent'}`}>Popular</button>
                <button onClick={() => { setActiveTab('featured'); loadBusinesses('featured'); }} className={`px-3 py-1 rounded ${activeTab === 'featured' ? 'bg-orange-600 text-white' : 'bg-transparent'}`}>Featured</button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <LoadingSkeleton type="card" count={6} />
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold">No businesses found</h3>
            <p className="text-gray-600 mt-2">Try adjusting your filters or broaden the search terms.</p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button onClick={() => { setQuery(''); setFiltered(businesses); }} className="px-4 py-2 bg-orange-600 text-white rounded-lg">Show all {businesses.length}</button>
              <button onClick={() => { setActiveTab('popular'); loadBusinesses('popular'); }} className="px-4 py-2 border rounded-lg">Try popular</button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((b) => (
              <BusinessCard key={b.id || JSON.stringify(b)} business={b} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
