'use client';

import React, { useEffect, useState } from 'react';
import { rfqService } from '../../services/rfq.service';

export default function PublicRfqsPage() {
  const [rfqs, setRfqs] = useState<Array<{ id: string; title: string; quantity: number | null; budgetMin: number | null; budgetMax: number | null; createdAt: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await rfqService.getPublicRecentRfqs(5);
        setRfqs(data);
      } catch (e: any) {
        setError(e?.message || 'Failed to load RFQs');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Recent RFQs</h1>
          <p className="text-sm text-muted-foreground mb-6">Public preview shows only title, quantity, and budget. Sign in to view details.</p>

          {loading && <div className="text-sm text-muted-foreground">Loading recent RFQs...</div>}
          {error && <div className="text-sm text-red-600">{error}</div>}

          {!loading && !error && (
            <ul className="divide-y rounded-lg border bg-card">
              {rfqs.map((r) => (
                <li key={r.id} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{r.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {r.quantity !== null ? `Qty: ${r.quantity}` : 'Service RFQ'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">
                      {r.budgetMin || r.budgetMax ? `Budget: ${r.budgetMin ? `₹${r.budgetMin}` : ''}${r.budgetMin && r.budgetMax ? ' - ' : ''}${r.budgetMax ? `₹${r.budgetMax}` : ''}` : 'Budget: N/A'}
                    </div>
                    <div className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</div>
                  </div>
                </li>
              ))}
              {rfqs.length === 0 && (
                <li className="p-4 text-sm text-muted-foreground">No RFQs available yet.</li>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
