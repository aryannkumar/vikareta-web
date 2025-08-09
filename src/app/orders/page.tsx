'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Eye,
  MessageCircle,
  Star,
  Filter,
  Search,
  Calendar,
  Truck,
  AlertCircle,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast-provider';
import { formatPrice } from '@/lib/utils';
import { ordersApi, type Order } from '@/lib/api/orders';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const toast = useToast();

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'refunded', label: 'Refunded' }
  ];

  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'product', label: 'Products' },
    { value: 'service', label: 'Services' }
  ];

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ordersApi.getMyOrders({
        status: statusFilter as any,
        page: currentPage,
        limit: 10,
        sortBy: 'newest'
      });

      if (response.success) {
        setOrders(response.data.orders);
        setTotalPages(Math.ceil(response.data.total / 10));
      } else {
        setError('Failed to load orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, typeFilter, currentPage]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleCancelOrder = async (orderId: string) => {
    try {
      const response = await ordersApi.cancelOrder(orderId, 'User requested cancellation');
      
      if (response.success) {
        toast.success('Success', 'Order cancelled successfully');
        fetchOrders(); // Refresh the list
      } else {
        toast.error('Error', 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Error', 'Failed to cancel order');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
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
      case 'refunded':
        return <RefreshCw className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
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
      case 'refunded':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (searchQuery) {
      return (
        order.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Error Loading Orders</h2>
            <p className="text-muted-foreground mb-8">{error}</p>
            <Button onClick={fetchOrders}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">My Orders</h1>
          <p className="text-muted-foreground">
            Track and manage your orders
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            >
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse bg-card rounded-lg border p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-muted rounded-lg w-20 h-16"></div>
                  <div className="flex-1 space-y-2">
                    <div className="bg-muted rounded h-4 w-1/3"></div>
                    <div className="bg-muted rounded h-3 w-1/2"></div>
                    <div className="bg-muted rounded h-3 w-1/4"></div>
                  </div>
                  <div className="bg-muted rounded h-8 w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No orders found</h3>
            <p className="text-muted-foreground mb-8">
              {searchQuery || statusFilter || typeFilter
                ? 'Try adjusting your search or filters'
                : 'You haven\'t placed any orders yet'
              }
            </p>
            {!searchQuery && !statusFilter && !typeFilter && (
              <div className="flex gap-4 justify-center">
                <Link href="/products">
                  <Button className="btn-primary">Shop Products</Button>
                </Link>
                <Link href="/services">
                  <Button variant="outline">Browse Services</Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-card rounded-lg border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  {/* Order Image */}
                  <div className="flex-shrink-0">
                    <Image
                      src={order.items[0]?.productImage || '/api/placeholder/80/64'}
                      alt={order.items[0]?.productName || 'Order item'}
                      width={80}
                      height={64}
                      className="w-20 h-16 object-cover rounded-lg"
                    />
                  </div>

                  {/* Order Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          {order.items.length === 1 
                            ? order.items[0].productName 
                            : `${order.items.length} items`}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          by {order.supplierName}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold text-lg">{formatPrice(order.totalAmount)}</div>
                        <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                          {getStatusIcon(order.status)}
                          {order.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Order #{order.id}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Ordered: {new Date(order.orderDate).toLocaleDateString()}
                      </div>
                      {order.deliveredDate && (
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4" />
                          Delivered: {new Date(order.deliveredDate).toLocaleDateString()}
                        </div>
                      )}
                      {order.expectedDeliveryDate && !order.deliveredDate && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Est. Delivery: {new Date(order.expectedDeliveryDate).toLocaleDateString()}
                        </div>
                      )}
                      {order.trackingNumber && (
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4" />
                          Tracking: {order.trackingNumber}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/orders/${order.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </Link>

                      <Link href={`/providers/${order.supplierId}`}>
                        <Button variant="outline" size="sm">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Contact Provider
                        </Button>
                      </Link>

                      {order.status === 'delivered' && (
                        <Button variant="outline" size="sm">
                          <Star className="h-4 w-4 mr-2" />
                          Write Review
                        </Button>
                      )}

                      {order.status === 'delivered' && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download Invoice
                        </Button>
                      )}

                      {(order.status === 'pending' || order.status === 'confirmed') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelOrder(order.id)}
                          className="text-red-600 hover:text-red-700 hover:border-red-300"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Cancel Order
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || loading}
            >
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    disabled={loading}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || loading}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}