'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  MessageCircle,
  Star,
  Download,
  Truck,
  Calendar,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  Copy,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast-provider';
import { formatPrice } from '@/lib/utils';
import { ordersApi, type Order } from '@/lib/api/orders';

// Using the Order type from the API directly

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toast = useToast();

  useEffect(() => {
    if (params.id) {
      fetchOrderDetail(params.id as string);
    }
  }, [params.id]);

  const fetchOrderDetail = async (orderId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await ordersApi.getOrder(orderId);

      if (response.success) {
        setOrder(response.data);
      } else {
        setError('Order not found');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;

    try {
      await ordersApi.cancelOrder(order.id, 'User requested cancellation');
      toast.success('Success', 'Order cancelled successfully');
      fetchOrderDetail(order.id); // Refresh the order
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Error', 'Order cancellation is not currently supported');
    }
  };

  const copyOrderId = () => {
    if (order) {
      navigator.clipboard.writeText(order.id);
      toast.success('Copied', 'Order ID copied to clipboard');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in-progress':
        return <RefreshCw className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'confirmed':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300';
      case 'in-progress':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300';
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-muted rounded h-8 w-48 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-muted rounded-lg h-64"></div>
                <div className="bg-muted rounded-lg h-48"></div>
              </div>
              <div>
                <div className="bg-muted rounded-lg h-96"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
            <p className="text-muted-foreground mb-8">{error}</p>
            <Link href="/orders">
              <Button>Back to Orders</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/orders" className="inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>
          <div className="h-4 w-px bg-border"></div>
          <h1 className="text-3xl font-bold">Order Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Header */}
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-semibold">Order #{order.id}</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyOrderId}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-muted-foreground">
                    Placed on {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                </div>

                <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                  {getStatusIcon(order.status)}
                  {order.status.replace('-', ' ').toUpperCase()}
                </Badge>
              </div>

              {order.trackingNumber && (
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Tracking Number: <strong>{order.trackingNumber}</strong></span>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      width={80}
                      height={64}
                      className="w-20 h-16 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{item.productName}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Quantity: {item.quantity}
                      </p>

                      {item.specifications && (
                        <div className="space-y-1">
                          {Object.entries(item.specifications).map(([key, value]) => (
                            <div key={key} className="text-xs text-muted-foreground">
                              <span className="font-medium">{key}:</span> {value}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="font-semibold">{formatPrice(item.totalPrice)}</div>
                      {item.quantity > 1 && (
                        <div className="text-xs text-muted-foreground">
                          {formatPrice(item.unitPrice)} each
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Order Timeline</h3>
              <div className="space-y-4">
                {order.timeline.map((event, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{event.status}</div>
                      <div className="text-sm text-muted-foreground">{event.description}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(event.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
                <div className="space-y-2">
                  <div className="font-medium">{order.shippingAddress.name}</div>
                  <div className="text-muted-foreground">{order.shippingAddress.phone}</div>
                  <div className="text-muted-foreground">
                    {order.shippingAddress.addressLine1}<br />
                    {order.shippingAddress.addressLine2 && <>{order.shippingAddress.addressLine2}<br /></>}
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                    {order.shippingAddress.country}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Provider Info */}
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Business</h3>
              <div className="flex items-start gap-3 mb-4">
                <Image
                  src="/api/placeholder/48/48"
                  alt={order.supplierName}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Link href={`/businesses/${order.supplierId}`}>
                      <h4 className="font-medium hover:text-primary">{order.supplierName}</h4>
                    </Link>
                    {/* Verified badge - would need to be added to Order interface */}
                    {true && (
                      <Shield className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">Supplier Location</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{order.supplierPhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{order.supplierEmail}</span>
                </div>
              </div>

              <Button className="w-full mt-4" variant="outline">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Business
              </Button>
            </div>

            {/* Order Summary */}
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>

                {(order.discount || 0) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(order.discount || 0)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{order.shippingCost > 0 ? formatPrice(order.shippingCost) : 'Free'}</span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 bg-muted rounded flex items-center justify-center">
                  <span className="text-xs font-medium">
                    {order.paymentMethod.toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-medium">
                    {order.paymentMethod === 'card' ? 'Credit/Debit Card' : order.paymentMethod.toUpperCase()}
                  </div>
                  {false && (
                    <div className="text-sm text-muted-foreground">
                      •••• •••• •••• 1234
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {order.status === 'delivered' && (
                <>
                  <Button className="w-full" variant="outline">
                    <Star className="h-4 w-4 mr-2" />
                    Write Review
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Invoice
                  </Button>
                </>
              )}

              {(order.status === 'pending' || order.status === 'confirmed') && (
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={handleCancelOrder}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Order
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}