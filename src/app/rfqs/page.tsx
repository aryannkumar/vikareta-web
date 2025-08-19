'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Calendar, DollarSign, ArrowRight } from 'lucide-react';
import { rfqService } from '../../services/rfq.service';

export default function PublicRFQsPage() {
  const [rfqs, setRfqs] = useState<Array<{ id: string; title: string; quantity: number | null; budgetMin: number | null; budgetMax: number | null; createdAt: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await rfqService.getPublicRecentRfqs(10); // Get more for the dedicated page
        setRfqs(data);
      } catch (e: any) {
        setError(e?.message || 'Failed to load RFQs');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const formatCurrency = (amount: number | null) => {
    if (!amount) return '';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Request for Quotations (RFQs)</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Browse recent RFQs from buyers looking for products and services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/auth/login" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                Sign In to Create RFQ
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link 
                href="/auth/register" 
                className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Register as Supplier
              </Link>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-900 mb-1">Public RFQ Preview</h3>
                <p className="text-sm text-blue-700">
                  This page shows recent RFQs with limited information (title, quantity, budget). 
                  <span className="font-medium"> Sign in to view full details, contact buyers, and submit quotes.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading recent RFQs...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* RFQ List */}
          {!loading && !error && (
            <div className="space-y-6">
              {rfqs.length > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Recent RFQs ({rfqs.length})</h2>
                    <div className="text-sm text-muted-foreground">
                      Updated in real-time
                    </div>
                  </div>

                  <div className="grid gap-6">
                    {rfqs.map((rfq) => (
                      <div key={rfq.id} className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {rfq.title}
                            </h3>
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                              <span className="flex items-center gap-1">
                                <Package className="h-4 w-4" />
                                {rfq.quantity !== null ? `Qty: ${rfq.quantity}` : 'Service RFQ'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(rfq.createdAt).toLocaleDateString()}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {rfq.quantity !== null ? 'Product Order' : 'Service Order'}
                              </span>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Active
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="flex items-center gap-1 text-lg font-semibold text-gray-900 mb-2">
                              <DollarSign className="h-5 w-5" />
                              {rfq.budgetMin || rfq.budgetMax ? (
                                <span>
                                  {rfq.budgetMin && rfq.budgetMax ? (
                                    `${formatCurrency(rfq.budgetMin)} - ${formatCurrency(rfq.budgetMax)}`
                                  ) : rfq.budgetMax ? (
                                    `Up to ${formatCurrency(rfq.budgetMax)}`
                                  ) : rfq.budgetMin ? (
                                    `From ${formatCurrency(rfq.budgetMin)}`
                                  ) : (
                                    'Budget TBD'
                                  )}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">Budget TBD</span>
                              )}
                            </div>
                            <Link 
                              href="/auth/login"
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              Sign in to view details →
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Call to Action */}
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <h3 className="text-lg font-semibold mb-2">Want to respond to these RFQs?</h3>
                    <p className="text-muted-foreground mb-4">
                      Join as a supplier to view full RFQ details and submit competitive quotes.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link 
                        href="/auth/register"
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Register as Supplier
                      </Link>
                      <Link 
                        href="/auth/login"
                        className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Already have an account?
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No RFQs Available</h3>
                  <p className="text-muted-foreground mb-6">
                    Be the first to create an RFQ and connect with suppliers.
                  </p>
                  <Link 
                    href="/auth/login"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}