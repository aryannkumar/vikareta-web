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

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await marketplaceApi.getNearbyBusinesses();
        if (res.success) {
          // Filter to only show email-level verified businesses
          const filtered = (res.data || []).filter((b) => {
            // Accept businesses with provider.verified or isVerified flag
            return (b.provider && b.provider.verified) || (b as any).isVerified || false;
          });
          setBusinesses(filtered);
        } else {
          setError('Failed to load businesses');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load businesses');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Business Directory</h1>
          <p className="text-gray-600 dark:text-gray-300">Verified businesses (Email Level Verified)</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <LoadingSkeleton type="card" count={6} />
          </div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Businesses</h2>
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">{businesses.length} listed</Badge>
            </div>

            {businesses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">No verified businesses found in your area.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businesses.map((b) => (
                  <BusinessCard key={b.id} business={b} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
