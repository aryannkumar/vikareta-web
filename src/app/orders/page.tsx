'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
  Download,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast-provider';
import { formatPrice } from '@/lib/utils';
import { ordersApi, type Order } from '@/lib/api/orders';
import { useVikaretaAuthContext } from '@/lib/auth/vikareta';

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useVikaretaAuthContext();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const toast = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

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
    // Only fetch orders if authenticated
    if (!isAuthenticated) {
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const filters: Record<string, any> = {
        page: currentPage,
        limit: 10,
        sortBy: 'createdAt'
      };

      if (statusFilter && statusFilter.trim() !== '') {
        filters.status = statusFilter;
      }

      const response = await ordersApi.getMyOrders(filters);

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
  }, [statusFilter, typeFilter, currentPage, isAuthenticated]);

  useEffect(() => {
    // Only fetch orders when authenticated and not loading auth state
    if (!authLoading && isAuthenticated) {
      fetchOrders();
    }
  }, [fetchOrders, authLoading, isAuthenticated]);

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
        <div className="container mx-auto px-4 py-8 sm:py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="mb-6">
              <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 text-red-500 mx-auto" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Error Loading Orders</h2>
            <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">
              {error}
            </p>
            <Button onClick={fetchOrders} className="h-11 sm:h-12 px-6">
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
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4">My Orders</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Track and manage your orders
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 sm:mb-8 bg-card rounded-lg border p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-semibold text-base sm:text-lg">Filters</h2>
          </div>

          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search orders by ID, business, or customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-sm sm:text-base h-11"
              />
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-sm sm:text-base h-10"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-sm sm:text-base h-10"
                >
                  {typeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-card rounded-lg border p-4 sm:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="bg-muted rounded-lg w-full sm:w-20 h-32 sm:h-16 flex-shrink-0"></div>
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div className="space-y-2 flex-1">
                        <div className="bg-muted rounded h-5 w-2/3"></div>
                        <div className="bg-muted rounded h-4 w-1/2"></div>
                      </div>
                      <div className="space-y-2 sm:text-right">
                        <div className="bg-muted rounded h-6 w-20"></div>
                        <div className="bg-muted rounded h-5 w-16"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="bg-muted rounded h-4 w-3/4"></div>
                      <div className="bg-muted rounded h-4 w-2/3"></div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <div className="bg-muted rounded h-8 w-20"></div>
                      <div className="bg-muted rounded h-8 w-24"></div>
                      <div className="bg-muted rounded h-8 w-16"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="mb-6">
              <Package className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-2">No orders found</h3>
            <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base max-w-md mx-auto">
              {searchQuery || statusFilter || typeFilter
                ? 'Try adjusting your search or filters to find what you\'re looking for'
                : 'You haven\'t placed any orders yet. Start exploring our marketplace!'
              }
            </p>
            {!searchQuery && !statusFilter && !typeFilter && (
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link href="/products">
                  <Button className="btn-primary w-full sm:w-auto h-11 sm:h-12 px-6">
                    Shop Products
                  </Button>
                </Link>
                <Link href="/services">
                  <Button variant="outline" className="w-full sm:w-auto h-11 sm:h-12 px-6">
                    Browse Services
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-card rounded-lg border p-4 sm:p-6 hover:shadow-md transition-shadow shadow-sm">
                <div className="flex flex-col gap-4">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Order Image */}
                    <div className="flex-shrink-0 mx-auto sm:mx-0">
                      <Image
                        src={order.items[0]?.productImage || '/api/placeholder/80/64'}
                        alt={order.items[0]?.productName || 'Order item'}
                        width={80}
                        height={64}
                        className="w-20 h-16 sm:w-24 sm:h-20 object-cover rounded-lg shadow-sm"
                      />
                    </div>

                    {/* Order Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg sm:text-xl mb-1 line-clamp-2">
                            {order.items.length === 1 
                              ? order.items[0].productName 
                              : `${order.items.length} items`}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            by {order.supplierName}
                          </p>
                        </div>
                        
                        <div className="text-left sm:text-right flex-shrink-0">
                          <div className="font-bold text-xl sm:text-2xl mb-1">{formatPrice(order.totalAmount)}</div>
                          <Badge className={`${getStatusColor(order.status)} flex items-center gap-1 w-fit`}>
                            {getStatusIcon(order.status)}
                            <span className="text-xs font-medium">
                              {order.status.replace('-', ' ').toUpperCase()}
                            </span>
                          </Badge>
                        </div>
                      </div>

                      {/* Order Info Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate font-medium">Order #{order.id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">
                            Ordered: {new Date(order.orderDate).toLocaleDateString()}
                          </span>
                        </div>
                        {order.deliveredDate && (
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">
                              Delivered: {new Date(order.deliveredDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        {order.expectedDeliveryDate && !order.deliveredDate && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">
                              Est. Delivery: {new Date(order.expectedDeliveryDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        {order.trackingNumber && (
                          <div className="flex items-center gap-2 sm:col-span-2">
                            <Truck className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate font-medium">
                              Tracking: {order.trackingNumber}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-3 border-t">
                    <Link href={`/orders/${order.id}`}>
                      <Button variant="outline" size="sm" className="h-9 px-3 sm:px-4 text-xs sm:text-sm">
                        <Eye className="h-4 w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">View Details</span>
                        <span className="sm:hidden">View</span>
                      </Button>
                    </Link>

                    <Link href={`/businesses/${order.supplierId}`}>
                      <Button variant="outline" size="sm" className="h-9 px-3 sm:px-4 text-xs sm:text-sm">
                        <MessageCircle className="h-4 w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Contact Business</span>
                        <span className="sm:hidden">Contact</span>
                      </Button>
                    </Link>

                    {order.status === 'delivered' && (
                      <Button variant="outline" size="sm" className="h-9 px-3 sm:px-4 text-xs sm:text-sm">
                        <Star className="h-4 w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Write Review</span>
                        <span className="sm:hidden">Review</span>
                      </Button>
                    )}

                    {order.status === 'delivered' && (
                      <Button variant="outline" size="sm" className="h-9 px-3 sm:px-4 text-xs sm:text-sm">
                        <Download className="h-4 w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Download Invoice</span>
                        <span className="sm:hidden">Invoice</span>
                      </Button>
                    )}

                    {(order.status === 'pending' || order.status === 'confirmed') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelOrder(order.id)}
                        className="text-red-600 hover:text-red-700 hover:border-red-300 h-9 px-3 sm:px-4 text-xs sm:text-sm"
                      >
                        <XCircle className="h-4 w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Cancel Order</span>
                        <span className="sm:hidden">Cancel</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-2 mt-8 pt-6 border-t">
            <div className="flex items-center gap-2 order-2 sm:order-1">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || loading}
                className="h-10 px-4 text-sm"
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = Math.max(1, currentPage - 2) + i;
                  if (page > totalPages) return null;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      disabled={loading}
                      className="h-10 w-10 p-0 text-sm"
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
                className="h-10 px-4 text-sm"
              >
                Next
              </Button>
            </div>

            <div className="text-sm text-muted-foreground order-1 sm:order-2">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}