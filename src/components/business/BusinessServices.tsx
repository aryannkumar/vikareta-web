"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { servicesApi } from '@/lib/api/services';

export default function BusinessServices({ businessId }: { businessId: string }) {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await servicesApi.getServices({ providerId: businessId } as any);
        if (res && (res as any).success) {
          const data = (res as any).data;
          const list = Array.isArray(data) ? data : (data?.services || data?.items || []);
          if (mounted) setServices(list || []);
        }
      } catch (e) {
        console.error('Failed to load services for business', businessId, e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [businessId]);

  if (loading) return <div className="text-sm text-gray-500">Loading services...</div>;
  if (!services || services.length === 0) return <div className="text-sm text-gray-500">No services listed.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {services.map((s: any) => (
        <Link key={s.id} href={`/services/${s.id}`} className="flex items-center gap-3 bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
          <img src={s.media?.[0]?.url || s.images?.[0] || '/img/placeholder-service.jpg'} alt={s.title || s.name} className="w-20 h-20 object-cover rounded-md" />
          <div>
            <div className="font-semibold">{s.title || s.name}</div>
            <div className="text-sm text-gray-500">{s.basePrice ? `₹${s.basePrice}` : 'Price on request'}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
