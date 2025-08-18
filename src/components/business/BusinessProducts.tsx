"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { productsApi } from '@/lib/api/products';

export default function BusinessProducts({ supplierId }: { supplierId: string }) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await productsApi.getProducts({ supplierId, limit: 8 } as any);
        if (res && (res as any).success) {
          const data = (res as any).data;
          // normalize
          const list = Array.isArray(data) ? data : (data?.products || data?.items || []);
          if (mounted) setProducts(list || []);
        }
      } catch (e) {
        console.error('Failed to load products for supplier', supplierId, e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [supplierId]);

  if (loading) return <div className="text-sm text-gray-500">Loading products...</div>;
  if (!products || products.length === 0) return <div className="text-sm text-gray-500">No products listed.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {products.map((p: any) => (
        <Link key={p.id} href={`/products/${p.id}`} className="flex items-center gap-3 bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
          <img src={p.media?.[0]?.url || p.images?.[0] || '/img/placeholder-product.jpg'} alt={p.title || p.name} className="w-20 h-20 object-cover rounded-md" />
          <div>
            <div className="font-semibold">{p.title || p.name}</div>
            <div className="text-sm text-gray-500">{p.price ? `₹${p.price}` : 'Price on request'}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
