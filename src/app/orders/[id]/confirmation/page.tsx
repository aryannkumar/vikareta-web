'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle,
  Package,
  Truck,
  MapPin,
  CreditCard,
  Download,
  Mail,
  Phone,
  Building2,
  Calendar,
  Clock,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { ordersApi, type Order } from '@/lib/api/orders';
import { useVikaretaAuthContext } from '@/lib/auth/vikareta';

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useVikaretaAuthContext();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = params.id as string;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await ordersApi.getOrder(orderId);

        if (response.success) {
          setOrder(response.data);
        } else {
          setError(response.error || 'Failed to load order');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-sm border p-8 max-w-md">
            <div className="text-red-600 mb-4">
              <Package className="w-12 h-12 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Order Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The order you are looking for does not exist.'}</p>
            <Link href="/orders">
              <Button>View My Orders</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
      case 'processing':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-lg text-gray-600">
            Thank you for your order. We've received your order and will process it shortly.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Order #{order.orderNumber}</h2>
                <p className="text-sm text-gray-600">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <Badge className={getStatusColor(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <Package className="w-5 h-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Order Type</p>
                  <p className="text-sm text-gray-600">Purchase Order</p>
                </div>
              </div>

              <div className="flex items-center">
                <CreditCard className="w-5 h-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Payment</p>
                  <p className="text-sm text-gray-600 capitalize">{order.paymentStatus}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Truck className="w-5 h-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Delivery</p>
                  <p className="text-sm text-gray-600">
                    {order.expectedDeliveryDate
                      ? new Date(order.expectedDeliveryDate).toLocaleDateString('en-IN')
                      : 'TBD'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {item.product?.title || item.service?.title || 'Product/Service'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity} × {formatPrice(item.unitPrice)}
                    </p>
                    {item.variant && (
                      <p className="text-sm text-gray-600">Variant: {item.variant.name}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatPrice(item.totalPrice)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatPrice(order.shippingCost)}</span>
              </div>
              {order.discount && order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="border-t pt-2">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping & Billing Addresses */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipping Address */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Shipping Address
                </h3>
                {order.shippingAddress ? (
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-900">
                      {order.shippingAddress.name}
                    </p>
                    <p>{order.shippingAddress.addressLine1}</p>
                    {order.shippingAddress.addressLine2 && (
                      <p>{order.shippingAddress.addressLine2}</p>
                    )}
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                    <p className="flex items-center mt-2">
                      <Phone className="w-4 h-4 mr-1" />
                      {order.shippingAddress.phone}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">Address not available</p>
                )}
              </div>

              {/* Billing Address */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Billing Details
                </h3>
                {order.billingAddress ? (
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-900">
                      {order.billingAddress.name}
                    </p>
                    <p className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {order.customerEmail}
                    </p>
                    <p className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      {order.customerPhone}
                    </p>
                    {order.billingAddress.company && (
                      <p className="flex items-center">
                        <Building2 className="w-4 h-4 mr-1" />
                        {order.billingAddress.company}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">Billing details not available</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/orders/${order.id}`}>
            <Button className="flex items-center">
              <Package className="w-4 h-4 mr-2" />
              Track Order
            </Button>
          </Link>

          <Link href="/orders">
            <Button variant="outline" className="flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              View All Orders
            </Button>
          </Link>

          <Link href="/marketplace">
            <Button variant="outline" className="flex items-center">
              <Building2 className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        {/* Order Notes */}
        {order.notes && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Order Notes</h3>
            <p className="text-sm text-blue-800">{order.notes}</p>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Need help with your order? Contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="sm">
              <Mail className="w-4 h-4 mr-2" />
              Email Support
            </Button>
            <Button variant="outline" size="sm">
              <Phone className="w-4 h-4 mr-2" />
              Call Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}