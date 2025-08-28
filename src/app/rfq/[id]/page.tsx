'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft,
  Clock,
  Package,
  Calendar,
  MapPin,
  Star,
  CheckCircle,
  MessageSquare,
  User,
  Building,
  Phone,
  Mail,
  FileText,
  Download,
  Paperclip,
  ThumbsUp,
  ThumbsDown,
  Send,
  Loader2,
  ShoppingCart,
  
} from 'lucide-react';
import { rfqService, RfqWithResponses } from '../../../services/rfq.service';
import { orderService, CreateOrderFromQuoteData } from '../../../services/order.service';
import { useVikaretaAuthContext } from '../../../lib/auth/vikareta';

export default function RFQDetailsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useVikaretaAuthContext();
  const params = useParams();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const rfqId = useMemo(() => (params?.id ? String(params.id) : ''), [params]);
  const [rfq, setRfq] = useState<RfqWithResponses | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'responses' | 'negotiations'>('overview');
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  const [negotiationMessage, setNegotiationMessage] = useState('');
  const [showNegotiationForm, setShowNegotiationForm] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });
  const [paymentMethod, setPaymentMethod] = useState<'cashfree' | 'wallet'>('wallet');

  const formatCurrency = (amount?: number | null) => {
    if (!amount && amount !== 0) return 'N/A';
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

  const getDaysRemaining = (expiresAt?: string | Date | null) => {
    if (!expiresAt) return 0;
    const exp = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;
    const today = new Date();
    const diffTime = exp.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const loadRfq = async () => {
    if (!rfqId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await rfqService.getRfqWithResponses(rfqId);
      setRfq(data);
    } catch (e: any) {
      setError(e?.message || 'Failed to load RFQ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRfq();
  }, [rfqId]);

  const handleNegotiate = (responseId: string) => {
    setSelectedResponse(responseId);
    setShowNegotiationForm(true);
  };

  const handleSendNegotiation = async () => {
    if (!selectedResponse || !negotiationMessage.trim()) return;
    try {
      await rfqService.negotiateQuote(selectedResponse, { message: negotiationMessage });
      setNegotiationMessage('');
      setShowNegotiationForm(false);
      setSelectedResponse(null);
      await loadRfq();
    } catch (e) {
      console.error('Negotiation failed', e);
      alert('Failed to send negotiation');
    }
  };

  const handleAcceptQuote = (responseId: string) => {
    setSelectedResponse(responseId);
    setShowOrderForm(true);
  };

  const handleRejectQuote = async (responseId: string) => {
    try {
      await rfqService.rejectQuote(responseId, 'Not suitable');
      await loadRfq();
    } catch (e) {
      console.error('Reject quote failed', e);
      alert('Failed to reject quote');
    }
  };

  const submitOrder = async () => {
    if (!selectedResponse) return;
    if (!address.street || !address.city || !address.state || !address.postalCode) {
      alert('Please fill in all required address fields');
      return;
    }
    setOrderLoading(true);
    try {
      await rfqService.acceptQuote(selectedResponse);
      const payload: CreateOrderFromQuoteData = {
        quoteId: selectedResponse,
        shippingAddress: address,
        paymentMethod,
        customerNotes: `Order from RFQ ${rfqId}`,
      };
      const created = await orderService.convertQuoteToOrder(payload);
      setShowOrderForm(false);
      if (created.orderId) router.push(`/orders/${created.orderId}`);
      else alert(`Order created: ${created.orderNumber}`);
    } catch (e: any) {
      console.error('Order conversion failed', e);
      alert(e?.message || 'Failed to accept quote/create order');
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {loading && (
          <div className="flex items-center justify-center py-12 text-amber-700">
              <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading RFQ...
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-4">{error}</div>
          )}
          {!rfq && !loading && (
            <div className="text-center text-gray-600">RFQ not found</div>
          )}
    {rfq && (
    <>
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
                  {rfq.category?.name}
                  {rfq.subcategory?.name ? (
                    <>
                      <span className="mx-1 text-gray-400">›</span>
                      <span>{rfq.subcategory?.name}</span>
                    </>
                  ) : null}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Created {new Date(String(rfq.createdAt)).toLocaleDateString()}
                </span>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(rfq.status)}`}>
                  {rfq.status.charAt(0).toUpperCase() + rfq.status.slice(1)}
                </span>
                <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {rfq.rfqType === 'service' ? 'Service Order' : 'Product Order'}
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900 mb-1">
                {rfq.responseAnalytics?.totalResponses || 0} Responses
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
                Responses ({rfq.responseAnalytics?.totalResponses || 0})
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
                    {rfq.quantity !== undefined && rfq.quantity !== null && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                        <p className="text-gray-600">{rfq.quantity} units</p>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                      <p className="text-gray-600">
                        {formatCurrency(rfq.budgetMin)} - {formatCurrency(rfq.budgetMax)}
                      </p>
                    </div>
                    {rfq.deliveryLocation && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Location</label>
                        <p className="text-gray-600 flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {rfq.deliveryLocation}
                        </p>
                      </div>
                    )}
                    {rfq.deliveryTimeline && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{rfq.rfqType === 'service' ? 'Preferred Timeline' : 'Timeline'}</label>
                        <p className="text-gray-600 flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {rfq.deliveryTimeline}
                        </p>
                      </div>
                    )}
                    {rfq.rfqType === 'service' && rfq.serviceType && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                        <p className="text-gray-600">{rfq.serviceType}</p>
                      </div>
                    )}
                    {rfq.rfqType === 'service' && rfq.preferredLocation && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Location</label>
                        <p className="text-gray-600">{rfq.preferredLocation}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">{rfq.rfqType === 'service' ? 'Requirements' : 'Technical Specifications'}</h2>
                <ul className="space-y-2">
                  {((rfq.specifications && rfq.specifications.length > 0) ? rfq.specifications : (rfq.requirements || [])).map((spec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Attachments */}
              {(rfq.attachments && rfq.attachments.length > 0) && (
                <div className="bg-white rounded-lg border p-6">
                  <h2 className="text-xl font-semibold mb-4">Attachments</h2>
                  <div className="space-y-3">
                    {rfq.attachments.map((url, index) => (
                      <a key={index} href={url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">Attachment {index + 1}</p>
                            <p className="text-sm text-gray-500 truncate max-w-xs">{url}</p>
                          </div>
                        </div>
                        <span className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                          <Download className="h-4 w-4" />
                          Open
                        </span>
                      </a>
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
                    <span className="font-medium">{rfq.responseAnalytics?.totalResponses || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Platform Quotes</span>
                    <span className="font-medium text-blue-600">{rfq.responseAnalytics?.platformResponses || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">WhatsApp Responses</span>
                    <span className="font-medium text-green-600">{rfq.responseAnalytics?.whatsappResponses || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Verified Sellers</span>
                    <span className="font-medium text-purple-600">{rfq.responseAnalytics?.verifiedSellerResponses || 0}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Price Range</span>
                    <div className="text-right">
                      <div className="text-sm text-green-600">
                        Low: {formatCurrency(rfq.responseAnalytics?.lowestPrice)}
                      </div>
                      <div className="text-sm text-red-600">
                        High: {formatCurrency(rfq.responseAnalytics?.highestPrice)}
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
                      <p className="font-medium">{rfq.buyer?.firstName} {rfq.buyer?.lastName}</p>
                      <p className="text-sm text-gray-600">{rfq.buyer?.businessName}</p>
                    </div>
                    {rfq.buyer?.isVerified && (
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  {/* Contact details not available in buyer type; hidden */}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'responses' && rfq && (
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
                            <h3 className="font-semibold text-lg">{response.seller.businessName || response.seller.name}</h3>
                            {response.seller.isVerified && (
                              <CheckCircle className="h-5 w-5 text-blue-600" />
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              {response.seller.averageRating} ({response.seller.totalReviews} reviews)
                            </span>
                            {/* Optional info not always available */}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatCurrency(response.totalPrice)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {response.validUntil ? `Valid until ${new Date(String(response.validUntil)).toLocaleDateString()}` : ''}
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
                          {response.attachments.map((url, index) => (
                            <a
                              key={index}
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50"
                            >
                              <Paperclip className="h-4 w-4" />
                              <span className="text-sm">Attachment {index + 1}</span>
                            </a>
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
                              {/* location not present in seller type */}
                              {response.extractedPrice && (
                                <span className="text-green-600 font-medium">
                                  {formatCurrency(response.extractedPrice)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(String(response.receivedAt)).toLocaleDateString()}
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

        {activeTab === 'negotiations' && rfq && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Ongoing Negotiations</h2>
            
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Negotiation Threads</h3>
              <p className="text-gray-600">Use the Negotiate button under responses to send a message.</p>
              <div className="mt-4 max-w-md mx-auto flex gap-3">
                <input
                  type="text"
                  placeholder="Type a quick negotiation message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={negotiationMessage}
                  onChange={(e) => setNegotiationMessage(e.target.value)}
                />
                <button
                  onClick={handleSendNegotiation}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  disabled={!selectedResponse}
                >
                  <Send className="h-4 w-4" />
                  Send
                </button>
              </div>
              {!selectedResponse && (
                <p className="text-xs text-gray-500 mt-2">Select a quote in the Responses tab to send a negotiation.</p>
              )}
            </div>
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

        {/* Accept & Order Modal */}
        {showOrderForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">{rfq?.rfqType === 'service' ? 'Service Address & Payment' : 'Delivery Address & Payment'}</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Street Address</label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => setAddress(prev => ({ ...prev, street: e.target.value }))}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter street address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">State</label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => setAddress(prev => ({ ...prev, state: e.target.value }))}
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
                      value={address.postalCode}
                      onChange={(e) => setAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Postal Code"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Country</label>
                    <input
                      type="text"
                      value={address.country}
                      onChange={(e) => setAddress(prev => ({ ...prev, country: e.target.value }))}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Country"
                    />
                  </div>
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
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm text-blue-800">
                    By accepting, the quote will be converted to an order.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={submitOrder}
                    disabled={orderLoading}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {orderLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
                    {orderLoading ? 'Processing...' : 'Accept & Create Order'}
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
          </div>
        )}
    </>
    )}
      </div>
    </div>
  );
}