'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, MessageSquare, TrendingUp, Search, ChevronDown, ExternalLink, Star, Package, Calendar, DollarSign, CheckCircle, Loader2, Check, X, MessageCircle, ShoppingCart } from 'lucide-react';
import { rfqService, QuoteResponse, RfqWithResponses } from '../../services/rfq.service';
import { orderService, CreateOrderFromQuoteData } from '../../services/order.service';

interface QuoteActionsProps {
  quote: QuoteResponse;
  rfqId: string;
  onQuoteUpdate: () => void;
}

function QuoteActions({ quote, rfqId, onQuoteUpdate }: QuoteActionsProps) {
  const [showActions, setShowActions] = useState(false);
  const [showNegotiation, setShowNegotiation] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [negotiationMessage, setNegotiationMessage] = useState('');
  const [counterPrice, setCounterPrice] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });
  const [paymentMethod, setPaymentMethod] = useState<'cashfree' | 'wallet'>('wallet');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleAcceptQuote = async () => {
  if (!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.zipCode) {
      alert('Please fill in all delivery address fields');
      return;
    }

    setLoading(true);
    try {
      // First accept the quote (no body required)
      await rfqService.acceptQuote(quote.id);
      
      // Then convert to order
      const orderData: CreateOrderFromQuoteData = {
        quoteId: quote.id,
        shippingAddress: {
          street: deliveryAddress.street,
          city: deliveryAddress.city,
          state: deliveryAddress.state,
          postalCode: deliveryAddress.zipCode,
          country: deliveryAddress.country,
        },
        paymentMethod,
        customerNotes: `Order converted from accepted quote for RFQ ${rfqId}`,
      };

      const order = await orderService.convertQuoteToOrder(orderData);
      alert(`Quote accepted and converted to order! Order #: ${order.orderNumber}`);
      setShowOrderForm(false);
      setShowActions(false);
      onQuoteUpdate();
      // Navigate to order details page if available
      if (order.orderId) {
        // best-effort redirect; ignore errors
        try { (window as any).location.href = `/orders/${order.orderId}`; } catch {}
      }
    } catch (error) {
      console.error('Error accepting quote:', error);
      alert('Failed to accept quote and create order');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectQuote = async () => {
    setLoading(true);
    try {
      await rfqService.rejectQuote(quote.id, 'Not suitable for our requirements');
      alert('Quote rejected successfully');
      setShowActions(false);
      onQuoteUpdate();
    } catch (error) {
      console.error('Error rejecting quote:', error);
      alert('Failed to reject quote');
    } finally {
      setLoading(false);
    }
  };

  const handleNegotiate = async () => {
    if (!negotiationMessage.trim()) {
      alert('Please enter a negotiation message');
      return;
    }

    setLoading(true);
    try {
      const negotiationData = {
        message: negotiationMessage,
        ...(counterPrice && { counterPrice: parseFloat(counterPrice) })
      };
      
      await rfqService.negotiateQuote(quote.id, negotiationData);
      alert('Negotiation message sent successfully');
      setShowNegotiation(false);
      setShowActions(false);
      setNegotiationMessage('');
      setCounterPrice('');
      onQuoteUpdate();
    } catch (error) {
      console.error('Error sending negotiation:', error);
      alert('Failed to send negotiation');
    } finally {
      setLoading(false);
    }
  };

  if (quote.status === 'accepted') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex items-center gap-2 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm font-medium">Quote Accepted & Converted to Order</span>
        </div>
      </div>
    );
  }

  if (quote.status === 'rejected') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
        <div className="flex items-center gap-2 text-red-800">
          <X className="h-4 w-4" />
          <span className="text-sm font-medium">Quote Rejected</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {!showActions && (
        <button
          onClick={() => setShowActions(true)}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Manage Quote
        </button>
      )}

      {showActions && (
        <div className="space-y-3 border rounded-lg p-4 bg-gray-50">
          <div className="flex gap-2">
            <button
              onClick={() => setShowOrderForm(true)}
              className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 flex items-center justify-center gap-2"
              disabled={loading}
            >
              <Check className="h-4 w-4" />
              Accept & Order
            </button>
            <button
              onClick={() => setShowNegotiation(true)}
              className="flex-1 bg-orange-600 text-white px-3 py-2 rounded text-sm hover:bg-orange-700 flex items-center justify-center gap-2"
              disabled={loading}
            >
              <MessageCircle className="h-4 w-4" />
              Negotiate
            </button>
            <button
              onClick={handleRejectQuote}
              className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 flex items-center justify-center gap-2"
              disabled={loading}
            >
              <X className="h-4 w-4" />
              Reject
            </button>
          </div>
          <button
            onClick={() => setShowActions(false)}
            className="w-full text-gray-600 text-sm hover:text-gray-800"
          >
            Cancel
          </button>
        </div>
      )}

      {showNegotiation && (
        <div className="border rounded-lg p-4 bg-white">
          <h4 className="font-medium mb-3">Negotiate Quote</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Counter Price (Optional)</label>
              <input
                type="number"
                value={counterPrice}
                onChange={(e) => setCounterPrice(e.target.value)}
                placeholder={`Current: ${formatCurrency(quote.totalPrice)}`}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                value={negotiationMessage}
                onChange={(e) => setNegotiationMessage(e.target.value)}
                placeholder="Explain your negotiation terms..."
                rows={3}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleNegotiate}
                disabled={loading}
                className="flex-1 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Send Negotiation'}
              </button>
              <button
                onClick={() => setShowNegotiation(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showOrderForm && (
        <div className="border rounded-lg p-4 bg-white">
          <h4 className="font-medium mb-3">Delivery Address for Order</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Street Address</label>
              <input
                type="text"
                value={deliveryAddress.street}
                onChange={(e) => setDeliveryAddress(prev => ({ ...prev, street: e.target.value }))}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter street address"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  value={deliveryAddress.city}
                  onChange={(e) => setDeliveryAddress(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <input
                  type="text"
                  value={deliveryAddress.state}
                  onChange={(e) => setDeliveryAddress(prev => ({ ...prev, state: e.target.value }))}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="State"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Postal Code</label>
                <input
                  type="text"
                  value={deliveryAddress.zipCode}
                  onChange={(e) => setDeliveryAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Postal Code"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Country</label>
                <input
                  type="text"
                  value={deliveryAddress.country}
                  onChange={(e) => setDeliveryAddress(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Country"
                />
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-sm text-blue-800">
                <strong>Total Amount: {formatCurrency(quote.totalPrice)}</strong>
              </p>
              <p className="text-xs text-blue-600 mt-1">
                By accepting this quote, it will be automatically converted to an order.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as 'cashfree' | 'wallet')}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="wallet">Wallet</option>
                <option value="cashfree">Cashfree</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAcceptQuote}
                disabled={loading}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
                {loading ? 'Processing...' : 'Accept & Create Order'}
              </button>
              <button
                onClick={() => setShowOrderForm(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface RfqCardProps {
  rfq: RfqWithResponses;
  onViewDetails: (rfqId: string) => void;
  onQuoteUpdate: () => void;
}

function RfqCard({ rfq, onViewDetails, onQuoteUpdate }: RfqCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{rfq.title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{rfq.description}</p>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <Package className="h-4 w-4" />
              {rfq.category.name}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(rfq.createdAt).toLocaleDateString()}
            </span>
            {rfq.quantity && (
              <span className="flex items-center gap-1">
                Qty: {rfq.quantity}
              </span>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(rfq.status)}`}>
            {rfq.status.charAt(0).toUpperCase() + rfq.status.slice(1)}
          </span>
          {rfq.budgetMax && (
            <p className="text-sm text-gray-600 mt-2">
              Budget: {formatCurrency(rfq.budgetMax)}
            </p>
          )}
        </div>
      </div>

      {/* Response Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-900">Response Summary</h4>
          <span className="text-sm text-gray-500">
            {rfq.responseAnalytics.totalResponses} total responses
          </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
              <MessageSquare className="h-4 w-4" />
              <span className="font-medium">{rfq.responseAnalytics.platformResponses}</span>
            </div>
            <p className="text-gray-600">Platform</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
              <MessageSquare className="h-4 w-4" />
              <span className="font-medium">{rfq.responseAnalytics.whatsappResponses}</span>
            </div>
            <p className="text-gray-600">WhatsApp</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">{rfq.responseAnalytics.verifiedSellerResponses}</span>
            </div>
            <p className="text-gray-600">Verified</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
              <DollarSign className="h-4 w-4" />
              <span className="font-medium">
                {rfq.responseAnalytics.averagePrice ? formatCurrency(rfq.responseAnalytics.averagePrice) : 'N/A'}
              </span>
            </div>
            <p className="text-gray-600">Avg Price</p>
          </div>
        </div>

        {rfq.responseAnalytics.lowestPrice && rfq.responseAnalytics.highestPrice && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-green-600">
                Lowest: {formatCurrency(rfq.responseAnalytics.lowestPrice)}
              </span>
              <span className="text-red-600">
                Highest: {formatCurrency(rfq.responseAnalytics.highestPrice)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Platform Responses */}
      {rfq.responses.platform.length > 0 && (
        <div className="mb-4">
          <h5 className="text-sm font-medium text-gray-900 mb-2">Platform Responses</h5>
          <div className="space-y-3">
            {rfq.responses.platform.slice(0, 2).map((quote) => (
              <div key={quote.id} className="bg-blue-50 rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{quote.seller.businessName || quote.seller.name}</span>
                    {quote.seller.isVerified && (
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                    )}
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-gray-600">
                        {quote.seller.averageRating}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-blue-600">
                    {formatCurrency(quote.totalPrice)}
                  </span>
                </div>
                {quote.message && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {quote.message}
                  </p>
                )}
                <QuoteActions 
                  quote={quote} 
                  rfqId={rfq.id} 
                  onQuoteUpdate={onQuoteUpdate}
                />
              </div>
            ))}
            {rfq.responses.platform.length > 2 && (
              <div className="text-center">
                <button
                  onClick={() => onViewDetails(rfq.id)}
                  className="text-blue-600 text-sm hover:text-blue-700"
                >
                  View {rfq.responses.platform.length - 2} more responses
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* WhatsApp Response Preview */}
      {rfq.responses.whatsapp.length > 0 && (
        <div className="mb-4">
          <h5 className="text-sm font-medium text-gray-900 mb-2">WhatsApp Responses</h5>
          <div className="space-y-2">
            {rfq.responses.whatsapp.slice(0, 2).map((response) => (
              <div key={response.id} className="bg-green-50 rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{response.seller.businessName || response.seller.name}</span>
                  {response.extractedPrice && (
                    <span className="text-sm font-medium text-green-600">
                      {formatCurrency(response.extractedPrice)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {response.messageContent}
                </p>
                {response.confidence && (
                  <div className="mt-2 text-xs text-gray-500">
                    Confidence: {(response.confidence * 100).toFixed(0)}%
                  </div>
                )}
              </div>
            ))}
            {rfq.responses.whatsapp.length > 2 && (
              <div className="text-center">
                <button
                  onClick={() => onViewDetails(rfq.id)}
                  className="text-green-600 text-sm hover:text-green-700"
                >
                  View {rfq.responses.whatsapp.length - 2} more WhatsApp responses
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => onViewDetails(rfq.id)}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Eye className="h-4 w-4" />
          View Details
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
          <ExternalLink className="h-4 w-4" />
          Manage
        </button>
      </div>
    </div>
  );
}

export default function MyRFQsSection() {
  const router = useRouter();
  const [rfqs, setRfqs] = useState<RfqWithResponses[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  const loadRfqs = async () => {
    setLoading(true);
    try {
      const filters = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: sortBy as any,
        sortOrder: 'desc' as const,
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm })
      };

      const result = await rfqService.getMyRfqsWithResponses(filters);
      setRfqs(result.rfqs);
      setPagination(result.pagination);
    } catch (error) {
      console.error('Error loading RFQs:', error);
      // Fallback to empty array on error
      setRfqs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRfqs();
  }, [pagination.page, sortBy, statusFilter]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (pagination.page === 1) {
        loadRfqs();
      } else {
        setPagination(prev => ({ ...prev, page: 1 }));
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleViewDetails = (rfqId: string) => {
    router.push(`/rfq/${rfqId}`);
  };

  const handleQuoteUpdate = () => {
    // Reload RFQs to get updated data
    loadRfqs();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My RFQs</h2>
          <p className="text-gray-600">
            Track your requests and manage responses from suppliers
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="h-4 w-4" />
            <span>{pagination.total} total RFQs</span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search RFQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="closed">Closed</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Sort By */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="createdAt">Newest First</option>
              <option value="title">Title</option>
              <option value="budgetMax">Highest Budget</option>
              <option value="expiresAt">Expiry Date</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading your RFQs...</span>
        </div>
      )}

      {/* RFQ List */}
      {!loading && (
        <div className="space-y-6">
          {rfqs.length > 0 ? (
            <>
              <div className="space-y-6">
                {rfqs.map((rfq) => (
                  <RfqCard 
                    key={rfq.id} 
                    rfq={rfq} 
                    onViewDetails={handleViewDetails}
                    onQuoteUpdate={handleQuoteUpdate}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={!pagination.hasPrev}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                      {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={!pagination.hasNext}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No RFQs Found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No RFQs match your current filters.' 
                  : 'You haven\'t created any RFQs yet.'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <button 
                  onClick={() => router.push('/rfq')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Your First RFQ
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}