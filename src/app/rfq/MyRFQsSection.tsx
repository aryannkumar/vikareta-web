'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Eye,
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  Filter,
  Search,
  ChevronDown,
  ExternalLink,
  Star,
  Package,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

// Mock data for demonstration
const mockRfqs = [
  {
    id: 'rfq-001',
    title: 'Industrial Pumps Required',
    description: 'Need high-quality industrial pumps for water treatment facility',
    category: { name: 'Machinery & Equipment' },
    status: 'active',
    createdAt: new Date('2024-01-15'),
    expiresAt: new Date('2024-02-15'),
    budgetMax: 150000,
    quantity: 5,
    rfqType: 'product' as const,
    responses: {
      platform: [
        {
          id: 'quote-001',
          seller: {
            name: 'Rajesh Kumar',
            businessName: 'Kumar Industries',
            isVerified: true,
            averageRating: 4.8,
            totalReviews: 124
          },
          totalPrice: 125000,
          currency: 'INR',
          status: 'pending' as const,
          submittedAt: new Date('2024-01-16'),
          items: [
            { name: 'Industrial Pump Model A', quantity: 5, unitPrice: 25000 }
          ],
          message: 'High-quality pumps with 2-year warranty included.'
        },
        {
          id: 'quote-002',
          seller: {
            name: 'Amit Singh',
            businessName: 'Singh Engineering',
            isVerified: true,
            averageRating: 4.6,
            totalReviews: 89
          },
          totalPrice: 140000,
          currency: 'INR',
          status: 'pending' as const,
          submittedAt: new Date('2024-01-17'),
          items: [
            { name: 'Premium Industrial Pump', quantity: 5, unitPrice: 28000 }
          ],
          message: 'Premium quality with extended warranty and free installation.'
        }
      ],
      whatsapp: [
        {
          id: 'wa-001',
          seller: {
            name: 'Pradeep Industries',
            businessName: 'Pradeep Pump Solutions',
            isVerified: false,
            averageRating: 4.2,
            totalReviews: 45
          },
          messageContent: 'We can provide industrial pumps at competitive rates. Our price is ₹22,000 per unit.',
          extractedPrice: 110000,
          extractedCurrency: 'INR',
          confidence: 0.85,
          receivedAt: new Date('2024-01-18'),
          messageType: 'text' as const
        }
      ]
    },
    responseAnalytics: {
      totalResponses: 3,
      platformResponses: 2,
      whatsappResponses: 1,
      averagePrice: 125000,
      lowestPrice: 110000,
      highestPrice: 140000,
      verifiedSellerResponses: 2,
      lastResponseAt: new Date('2024-01-18')
    }
  },
  {
    id: 'rfq-002',
    title: 'Office Furniture Bulk Order',
    description: 'Looking for modern office furniture for new office setup',
    category: { name: 'Furniture & Fixtures' },
    status: 'active',
    createdAt: new Date('2024-01-20'),
    expiresAt: new Date('2024-02-20'),
    budgetMax: 500000,
    quantity: 50,
    rfqType: 'product' as const,
    responses: {
      platform: [
        {
          id: 'quote-003',
          seller: {
            name: 'Modern Furniture Co',
            businessName: 'Modern Furniture Solutions',
            isVerified: true,
            averageRating: 4.9,
            totalReviews: 200
          },
          totalPrice: 450000,
          currency: 'INR',
          status: 'pending' as const,
          submittedAt: new Date('2024-01-21'),
          items: [
            { name: 'Ergonomic Office Chair', quantity: 50, unitPrice: 8000 },
            { name: 'Office Desk', quantity: 25, unitPrice: 12000 }
          ],
          message: 'Complete office furniture solution with modern design.'
        }
      ],
      whatsapp: []
    },
    responseAnalytics: {
      totalResponses: 1,
      platformResponses: 1,
      whatsappResponses: 0,
      averagePrice: 450000,
      lowestPrice: 450000,
      highestPrice: 450000,
      verifiedSellerResponses: 1,
      lastResponseAt: new Date('2024-01-21')
    }
  }
];

interface RfqCardProps {
  rfq: typeof mockRfqs[0];
  onViewDetails: (rfqId: string) => void;
}

function RfqCard({ rfq, onViewDetails }: RfqCardProps) {
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
              {rfq.createdAt.toLocaleDateString()}
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

      {/* Quick Response Preview */}
      {rfq.responses.platform.length > 0 && (
        <div className="mb-4">
          <h5 className="text-sm font-medium text-gray-900 mb-2">Latest Platform Response</h5>
          <div className="bg-blue-50 rounded p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{rfq.responses.platform[0].seller.businessName}</span>
                {rfq.responses.platform[0].seller.isVerified && (
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                )}
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="text-xs text-gray-600">
                    {rfq.responses.platform[0].seller.averageRating}
                  </span>
                </div>
              </div>
              <span className="text-sm font-medium text-blue-600">
                {formatCurrency(rfq.responses.platform[0].totalPrice)}
              </span>
            </div>
            {rfq.responses.platform[0].message && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {rfq.responses.platform[0].message}
              </p>
            )}
          </div>
        </div>
      )}

      {/* WhatsApp Response Preview */}
      {rfq.responses.whatsapp.length > 0 && (
        <div className="mb-4">
          <h5 className="text-sm font-medium text-gray-900 mb-2">Latest WhatsApp Response</h5>
          <div className="bg-green-50 rounded p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{rfq.responses.whatsapp[0].seller.businessName}</span>
              {rfq.responses.whatsapp[0].extractedPrice && (
                <span className="text-sm font-medium text-green-600">
                  {formatCurrency(rfq.responses.whatsapp[0].extractedPrice)}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">
              {rfq.responses.whatsapp[0].messageContent}
            </p>
            {rfq.responses.whatsapp[0].confidence && (
              <div className="mt-2 text-xs text-gray-500">
                Confidence: {(rfq.responses.whatsapp[0].confidence * 100).toFixed(0)}%
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
  const [rfqs, setRfqs] = useState(mockRfqs);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');

  const handleViewDetails = (rfqId: string) => {
    // Navigate to detailed view
    router.push(`/rfq/${rfqId}`);
  };

  const filteredRfqs = rfqs.filter(rfq => {
    const matchesSearch = rfq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rfq.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || rfq.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedRfqs = [...filteredRfqs].sort((a, b) => {
    switch (sortBy) {
      case 'createdAt':
        return b.createdAt.getTime() - a.createdAt.getTime();
      case 'responses':
        return b.responseAnalytics.totalResponses - a.responseAnalytics.totalResponses;
      case 'budget':
        return (b.budgetMax || 0) - (a.budgetMax || 0);
      default:
        return 0;
    }
  });

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
            <span>{rfqs.length} total RFQs</span>
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
              <option value="responses">Most Responses</option>
              <option value="budget">Highest Budget</option>
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
          {sortedRfqs.length > 0 ? (
            sortedRfqs.map((rfq) => (
              <RfqCard 
                key={rfq.id} 
                rfq={rfq} 
                onViewDetails={handleViewDetails}
              />
            ))
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
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
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