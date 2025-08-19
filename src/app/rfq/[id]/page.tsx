'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Calendar,
  Package,
  DollarSign,
  MapPin,
  Clock,
  User,
  MessageSquare,
  Phone,
  Mail,
  Star,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Download,
  Send,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  Building,
  Shield,
  TrendingUp,
  FileText,
  Image,
  Paperclip
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

// Mock data - in real app, this would come from API
const mockRfqDetails = {
  id: 'rfq-001',
  title: 'Industrial Pumps Required',
  description: 'We need high-quality industrial pumps for our water treatment facility. The pumps should be capable of handling 1000 gallons per minute and must be corrosion-resistant. Installation and training should be included in the proposal.',
  category: { 
    id: 'cat-001',
    name: 'Machinery & Equipment',
    slug: 'machinery-equipment'
  },
  subcategory: {
    id: 'subcat-001', 
    name: 'Industrial Pumps',
    slug: 'industrial-pumps'
  },
  status: 'active',
  createdAt: new Date('2024-01-15'),
  expiresAt: new Date('2024-02-15'),
  budgetMin: 100000,
  budgetMax: 150000,
  quantity: 5,
  deliveryLocation: 'Mumbai, Maharashtra',
  deliveryTimeline: 'Within 45 days',
  rfqType: 'product',
  specifications: [
    'Flow rate: 1000 GPM minimum',
    'Material: Stainless steel or equivalent corrosion-resistant material',
    'Pressure rating: 150 PSI minimum',
    'Power supply: 415V, 50Hz, 3-phase',
    'Certification: ISI marked'
  ],
  attachments: [
    { name: 'Technical_Specifications.pdf', url: '/files/tech-specs.pdf', size: '2.4 MB' },
    { name: 'Site_Layout.jpg', url: '/files/site-layout.jpg', size: '1.2 MB' }
  ],
  buyer: {
    id: 'buyer-001',
    firstName: 'Rajesh',
    lastName: 'Patel',
    businessName: 'AquaTech Solutions Pvt Ltd',
    email: 'rajesh@aquatech.com',
    phone: '+91 98765 43210',
    verificationTier: 'verified',
    isVerified: true
  },
  responses: {
    platform: [
      {
        id: 'quote-001',
        sellerId: 'seller-001',
        seller: {
          id: 'seller-001',
          name: 'Kumar Industries',
          businessName: 'Kumar Industrial Equipment',
          email: 'sales@kumarindustries.com',
          phone: '+91 87654 32109',
          whatsappNumber: '+91 87654 32109',
          verificationTier: 'verified',
          isVerified: true,
          averageRating: 4.8,
          totalReviews: 124,
          responseTime: '2 hours',
          location: 'Pune, Maharashtra'
        },
        totalPrice: 125000,
        currency: 'INR',
        validUntil: new Date('2024-02-10'),
        message: 'We can provide high-quality industrial pumps as per your specifications. Our pumps come with 2-year warranty and free installation. We have been in this business for 15 years and have supplied to major industrial clients.',
        status: 'pending',
        submittedAt: new Date('2024-01-16'),
        items: [
          {
            name: 'Industrial Centrifugal Pump - Model IP1000',
            quantity: 5,
            unitPrice: 22000,
            description: 'High-efficiency centrifugal pump with stainless steel construction'
          },
          {
            name: 'Installation & Setup',
            quantity: 1,
            unitPrice: 15000,
            description: 'Complete installation, testing, and commissioning'
          }
        ],
        attachments: [
          { name: 'Product_Brochure.pdf', url: '/files/brochure.pdf', size: '3.2 MB' },
          { name: 'Warranty_Certificate.pdf', url: '/files/warranty.pdf', size: '1.8 MB' }
        ],
        isCounterOffer: false,
        originalQuoteId: null,
        estimatedDelivery: '30 days',
        paymentTerms: '30% advance, 70% on delivery',
        warrantyInfo: '2 years comprehensive warranty with free maintenance',
        negotiations: [
          {
            id: 'neg-001',
            type: 'message',
            from: 'buyer',
            message: 'Can you improve the price? Our budget is around ₹110,000 for 5 units.',
            timestamp: new Date('2024-01-17T10:30:00'),
            attachments: []
          },
          {
            id: 'neg-002', 
            type: 'counter_offer',
            from: 'seller',
            message: 'We can offer ₹115,000 for 5 units with same warranty and installation. This is our best price.',
            timestamp: new Date('2024-01-17T14:45:00'),
            counterOffer: {
              totalPrice: 115000,
              items: [
                {
                  name: 'Industrial Centrifugal Pump - Model IP1000',
                  quantity: 5,
                  unitPrice: 20000,
                  description: 'High-efficiency centrifugal pump with stainless steel construction'
                },
                {
                  name: 'Installation & Setup',
                  quantity: 1,
                  unitPrice: 15000,
                  description: 'Complete installation, testing, and commissioning'
                }
              ]
            }
          }
        ]
      },
      {
        id: 'quote-002',
        sellerId: 'seller-002',
        seller: {
          id: 'seller-002',
          name: 'Singh Engineering',
          businessName: 'Singh Pump Solutions',
          email: 'contact@singhpumps.com',
          phone: '+91 76543 21098',
          whatsappNumber: '+91 76543 21098',
          verificationTier: 'verified',
          isVerified: true,
          averageRating: 4.6,
          totalReviews: 89,
          responseTime: '4 hours',
          location: 'Ahmedabad, Gujarat'
        },
        totalPrice: 140000,
        currency: 'INR',
        validUntil: new Date('2024-02-12'),
        message: 'Premium quality pumps with extended warranty and free installation. We use German technology and provide 24/7 support.',
        status: 'pending',
        submittedAt: new Date('2024-01-17'),
        items: [
          {
            name: 'Premium Industrial Pump - Model SP2000',
            quantity: 5,
            unitPrice: 26000,
            description: 'German technology pump with superior efficiency'
          },
          {
            name: 'Premium Installation Package',
            quantity: 1,
            unitPrice: 10000,
            description: 'Installation with 1-year free maintenance'
          }
        ],
        attachments: [
          { name: 'Technical_Datasheet.pdf', url: '/files/datasheet.pdf', size: '2.8 MB' }
        ],
        isCounterOffer: false,
        originalQuoteId: null,
        estimatedDelivery: '25 days',
        paymentTerms: '40% advance, 60% on delivery',
        warrantyInfo: '3 years warranty with 24/7 support',
        negotiations: []
      }
    ],
    whatsapp: [
      {
        id: 'wa-001',
        sellerId: 'seller-003',
        seller: {
          id: 'seller-003',
          name: 'Pradeep Industries',
          businessName: 'Pradeep Pump Solutions',
          email: 'pradeep@pradeeppumps.com',
          phone: '+91 65432 10987',
          whatsappNumber: '+91 65432 10987',
          verificationTier: 'basic',
          isVerified: false,
          averageRating: 4.2,
          totalReviews: 45,
          responseTime: '1 hour',
          location: 'Jaipur, Rajasthan'
        },
        messageContent: 'We can provide industrial pumps at competitive rates. Our price is ₹22,000 per unit with 1-year warranty. Total for 5 units: ₹110,000. We can deliver within 40 days.',
        extractedPrice: 110000,
        extractedCurrency: 'INR',
        confidence: 0.85,
        receivedAt: new Date('2024-01-18'),
        messageType: 'text',
        attachments: [],
        isProcessed: true
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
    averageResponseTime: 2.3,
    verifiedSellerResponses: 2,
    lastResponseAt: new Date('2024-01-18')
  }
};

export default function RFQDetailsPage() {
  const params = useParams();
  const rfqId = params.id as string;
  const router = useRouter();
  const [rfq] = useState(mockRfqDetails);
  const [activeTab, setActiveTab] = useState<'overview' | 'responses' | 'negotiations'>('overview');
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  const [negotiationMessage, setNegotiationMessage] = useState('');
  const [showNegotiationForm, setShowNegotiationForm] = useState(false);

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

  const getDaysRemaining = (expiresAt: Date) => {
    const today = new Date();
    const diffTime = expiresAt.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleNegotiate = (responseId: string) => {
    setSelectedResponse(responseId);
    setShowNegotiationForm(true);
  };

  const handleSendNegotiation = () => {
    // Here you would send the negotiation message to the API
    console.log('Sending negotiation:', { responseId: selectedResponse, message: negotiationMessage });
    setNegotiationMessage('');
    setShowNegotiationForm(false);
    setSelectedResponse(null);
  };

  const handleAcceptQuote = (responseId: string) => {
    console.log('Accepting quote:', responseId);
    // API call to accept quote
  };

  const handleRejectQuote = (responseId: string) => {
    console.log('Rejecting quote:', responseId);
    // API call to reject quote
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to RFQs
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{rfq.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  {rfq.category.name}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Created {rfq.createdAt.toLocaleDateString()}
                </span>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(rfq.status)}`}>
                  {rfq.status.charAt(0).toUpperCase() + rfq.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900 mb-1">
                {rfq.responseAnalytics.totalResponses} Responses
              </div>
              <div className="text-sm text-gray-600">
                Expires in {getDaysRemaining(rfq.expiresAt)} days
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="h-5 w-5 inline mr-2" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('responses')}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'responses'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <MessageSquare className="h-5 w-5 inline mr-2" />
                Responses ({rfq.responseAnalytics.totalResponses})
              </button>
              <button
                onClick={() => setActiveTab('negotiations')}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'negotiations'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <MessageSquare className="h-5 w-5 inline mr-2" />
                Negotiations
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* RFQ Details */}
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">RFQ Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <p className="text-gray-600">{rfq.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                      <p className="text-gray-600">{rfq.quantity} units</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                      <p className="text-gray-600">
                        {formatCurrency(rfq.budgetMin)} - {formatCurrency(rfq.budgetMax)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Location</label>
                      <p className="text-gray-600 flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {rfq.deliveryLocation}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Timeline</label>
                      <p className="text-gray-600 flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {rfq.deliveryTimeline}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Technical Specifications</h2>
                <ul className="space-y-2">
                  {rfq.specifications.map((spec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Attachments */}
              {rfq.attachments.length > 0 && (
                <div className="bg-white rounded-lg border p-6">
                  <h2 className="text-xl font-semibold mb-4">Attachments</h2>
                  <div className="space-y-3">
                    {rfq.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">{attachment.name}</p>
                            <p className="text-sm text-gray-500">{attachment.size}</p>
                          </div>
                        </div>
                        <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                          <Download className="h-4 w-4" />
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Response Summary */}
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">Response Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Responses</span>
                    <span className="font-medium">{rfq.responseAnalytics.totalResponses}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Platform Quotes</span>
                    <span className="font-medium text-blue-600">{rfq.responseAnalytics.platformResponses}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">WhatsApp Responses</span>
                    <span className="font-medium text-green-600">{rfq.responseAnalytics.whatsappResponses}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Verified Sellers</span>
                    <span className="font-medium text-purple-600">{rfq.responseAnalytics.verifiedSellerResponses}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Price Range</span>
                    <div className="text-right">
                      <div className="text-sm text-green-600">
                        Low: {formatCurrency(rfq.responseAnalytics.lowestPrice)}
                      </div>
                      <div className="text-sm text-red-600">
                        High: {formatCurrency(rfq.responseAnalytics.highestPrice)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Buyer Information */}
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">Buyer Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{rfq.buyer.firstName} {rfq.buyer.lastName}</p>
                      <p className="text-sm text-gray-600">{rfq.buyer.businessName}</p>
                    </div>
                    {rfq.buyer.isVerified && (
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">{rfq.buyer.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">{rfq.buyer.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'responses' && (
          <div className="space-y-6">
            {/* Platform Responses */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Platform Quotes ({rfq.responses.platform.length})</h2>
              <div className="space-y-6">
                {rfq.responses.platform.map((response) => (
                  <div key={response.id} className="bg-white rounded-lg border p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Building className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{response.seller.businessName}</h3>
                            {response.seller.isVerified && (
                              <CheckCircle className="h-5 w-5 text-blue-600" />
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              {response.seller.averageRating} ({response.seller.totalReviews} reviews)
                            </span>
                            <span>{response.seller.location}</span>
                            <span>Responds in {response.seller.responseTime}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatCurrency(response.totalPrice)}
                        </div>
                        <div className="text-sm text-gray-600">
                          Valid until {response.validUntil?.toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-600">{response.message}</p>
                    </div>

                    {/* Quote Items */}
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Quote Breakdown</h4>
                      <div className="bg-gray-50 rounded p-4">
                        {response.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{formatCurrency(item.unitPrice)} × {item.quantity}</p>
                              <p className="text-sm text-gray-600">{formatCurrency(item.unitPrice * item.quantity)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Delivery:</span>
                        <p className="text-gray-600">{response.estimatedDelivery}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Payment Terms:</span>
                        <p className="text-gray-600">{response.paymentTerms}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Warranty:</span>
                        <p className="text-gray-600">{response.warrantyInfo}</p>
                      </div>
                    </div>

                    {/* Attachments */}
                    {response.attachments.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Attachments</h4>
                        <div className="flex flex-wrap gap-2">
                          {response.attachments.map((attachment, index) => (
                            <button
                              key={index}
                              className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50"
                            >
                              <Paperclip className="h-4 w-4" />
                              <span className="text-sm">{attachment.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAcceptQuote(response.id)}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        Accept Quote
                      </button>
                      <button
                        onClick={() => handleNegotiate(response.id)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Negotiate
                      </button>
                      <button
                        onClick={() => handleRejectQuote(response.id)}
                        className="flex items-center gap-2 border border-red-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50"
                      >
                        <ThumbsDown className="h-4 w-4" />
                        Reject
                      </button>
                      <div className="flex items-center gap-2">
                        <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                          <Phone className="h-4 w-4" />
                        </button>
                        <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                          <Mail className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp Responses */}
            {rfq.responses.whatsapp.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">WhatsApp Responses ({rfq.responses.whatsapp.length})</h2>
                <div className="space-y-4">
                  {rfq.responses.whatsapp.map((response) => (
                    <div key={response.id} className="bg-white rounded-lg border p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <MessageSquare className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{response.seller.businessName}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span>{response.seller.location}</span>
                              {response.extractedPrice && (
                                <span className="text-green-600 font-medium">
                                  {formatCurrency(response.extractedPrice)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {response.receivedAt.toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <p className="text-gray-700">{response.messageContent}</p>
                      </div>

                      {response.confidence && (
                        <div className="mb-4 text-sm text-gray-600">
                          <span className="font-medium">Price Detection Confidence:</span> {(response.confidence * 100).toFixed(0)}%
                        </div>
                      )}

                      <div className="flex gap-3">
                        <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                          <Phone className="h-4 w-4" />
                          Call via WhatsApp
                        </button>
                        <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
                          <MessageSquare className="h-4 w-4" />
                          Reply via WhatsApp
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'negotiations' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Ongoing Negotiations</h2>
            
            {rfq.responses.platform
              .filter(response => response.negotiations && response.negotiations.length > 0)
              .map((response) => (
                <div key={response.id} className="bg-white rounded-lg border p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Building className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{response.seller.businessName}</h3>
                      <p className="text-sm text-gray-600">Original Quote: {formatCurrency(response.totalPrice)}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {response.negotiations?.map((negotiation) => (
                      <div
                        key={negotiation.id}
                        className={`flex ${negotiation.from === 'buyer' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                            negotiation.from === 'buyer'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{negotiation.message}</p>
                          {negotiation.counterOffer && (
                            <div className="mt-2 pt-2 border-t border-opacity-20">
                              <p className="text-xs opacity-90">Counter Offer: {formatCurrency(negotiation.counterOffer.totalPrice)}</p>
                            </div>
                          )}
                          <p className="text-xs opacity-75 mt-1">
                            {negotiation.timestamp.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={negotiationMessage}
                        onChange={(e) => setNegotiationMessage(e.target.value)}
                      />
                      <button
                        onClick={handleSendNegotiation}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        <Send className="h-4 w-4" />
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              ))}

            {rfq.responses.platform.every(response => !response.negotiations || response.negotiations.length === 0) && (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Negotiations</h3>
                <p className="text-gray-600">
                  Start negotiating with suppliers by clicking "Negotiate" on their quotes.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Negotiation Modal */}
        {showNegotiationForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Start Negotiation</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Message
                </label>
                <textarea
                  value={negotiationMessage}
                  onChange={(e) => setNegotiationMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Enter your negotiation message..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSendNegotiation}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Send Message
                </button>
                <button
                  onClick={() => {
                    setShowNegotiationForm(false);
                    setNegotiationMessage('');
                    setSelectedResponse(null);
                  }}
                  className="flex-1 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}