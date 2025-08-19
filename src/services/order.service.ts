const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface OrderItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specifications?: string[];
}

export interface OrderDetails {
  id: string;
  orderNumber: string;
  orderType?: 'product' | 'service';
  rfqId: string;
  quoteId: string;
  buyerId: string;
  sellerId: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'disputed';
  totalAmount: number;
  currency: string;
  paymentStatus: 'pending' | 'paid' | 'partial' | 'failed' | 'refunded';
  paymentMethod?: string;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  estimatedDelivery: Date | null;
  actualDelivery?: Date | null;
  items: OrderItem[];
  notes?: string;
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
  
  // Related entities
  rfq: {
    id: string;
    title: string;
    description: string;
  };
  buyer: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    businessName?: string;
  };
  seller: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    businessName?: string;
    rating: number;
    verificationTier: string;
  };
  
  // Tracking information
  tracking?: {
    trackingNumber?: string;
    carrier?: string;
    trackingUrl?: string;
    updates: Array<{
      status: string;
      message: string;
      timestamp: Date;
      location?: string;
    }>;
  };
  
  // Timeline
  timeline: Array<{
    event: string;
    description: string;
    timestamp: Date;
    actor: 'buyer' | 'seller' | 'system';
  }>;
}

export interface CreateOrderFromQuoteData {
  quoteId: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: 'cashfree' | 'wallet';
  returnUrl?: string;
  customerNotes?: string;
}

export interface ConvertFromQuoteResponse {
  orderId: string;
  orderNumber: string;
  cashfreeOrder?: any;
  paymentRequired: boolean;
  totalAmount?: number;
}

export interface OrderFilters {
  buyerId?: string;
  sellerId?: string;
  status?: string;
  paymentStatus?: string;
  minAmount?: number;
  maxAmount?: number;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'totalAmount' | 'estimatedDelivery' | 'orderNumber';
  sortOrder?: 'asc' | 'desc';
}

export interface OrderSummary {
  totalOrders: number;
  totalValue: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  averageOrderValue: number;
  onTimeDeliveryRate: number;
}

export interface PaymentData {
  orderId: string;
  amount: number;
  currency: string;
  paymentMethod: 'stripe' | 'razorpay' | 'bank_transfer' | 'cod';
  paymentDetails?: {
    cardLast4?: string;
    bankAccount?: string;
    upiId?: string;
    transactionId?: string;
  };
}

export class OrderService {
  private static instance: OrderService;
  private authToken: string | null = null;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    }
  }

  public static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    
    return headers;
  }

  setAuthToken(token: string) {
    this.authToken = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  // Convert accepted quote to order
  async convertQuoteToOrder(data: CreateOrderFromQuoteData): Promise<ConvertFromQuoteResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/from-quote`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to convert quote to order');
      }

  const result = await response.json();
  return result.data as ConvertFromQuoteResponse;
    } catch (error) {
      console.error('Error converting quote to order:', error);
      throw error;
    }
  }

  // Get order by ID
  async getOrderById(orderId: string): Promise<OrderDetails> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch order');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  // Get orders with filters
  async getOrders(filters?: OrderFilters): Promise<{ orders: OrderDetails[]; pagination: any }> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (value instanceof Date) {
              queryParams.append(key, value.toISOString());
            } else {
              queryParams.append(key, String(value));
            }
          }
        });
      }

      const response = await fetch(`${API_BASE_URL}/orders?${queryParams.toString()}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch orders');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  // Get orders as buyer
  async getMyOrders(filters?: OrderFilters): Promise<{ orders: OrderDetails[]; pagination: any }> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (value instanceof Date) {
              queryParams.append(key, value.toISOString());
            } else {
              queryParams.append(key, String(value));
            }
          }
        });
      }

      const response = await fetch(`${API_BASE_URL}/orders/my-orders?${queryParams.toString()}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch my orders');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching my orders:', error);
      throw error;
    }
  }

  // Get orders as seller
  async getSellerOrders(filters?: OrderFilters): Promise<{ orders: OrderDetails[]; pagination: any }> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (value instanceof Date) {
              queryParams.append(key, value.toISOString());
            } else {
              queryParams.append(key, String(value));
            }
          }
        });
      }

      const response = await fetch(`${API_BASE_URL}/orders/seller-orders?${queryParams.toString()}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch seller orders');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching seller orders:', error);
      throw error;
    }
  }

  // Update order status
  async updateOrderStatus(orderId: string, status: string, notes?: string): Promise<OrderDetails> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({ status, notes }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to update order status');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // Process payment
  async processPayment(paymentData: PaymentData): Promise<{ success: boolean; transactionId?: string; paymentUrl?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${paymentData.orderId}/payment`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to process payment');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

  // Update delivery tracking
  async updateTracking(orderId: string, trackingData: {
    trackingNumber?: string;
    carrier?: string;
    trackingUrl?: string;
    status?: string;
    message?: string;
    location?: string;
  }): Promise<OrderDetails> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/tracking`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(trackingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to update tracking');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error updating tracking:', error);
      throw error;
    }
  }

  // Cancel order
  async cancelOrder(orderId: string, reason: string): Promise<OrderDetails> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to cancel order');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  }

  // Get order summary/analytics
  async getOrderSummary(filters?: { dateFrom?: Date; dateTo?: Date }): Promise<OrderSummary> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (value instanceof Date) {
              queryParams.append(key, value.toISOString());
            } else {
              queryParams.append(key, String(value));
            }
          }
        });
      }

      const response = await fetch(`${API_BASE_URL}/orders/summary?${queryParams.toString()}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch order summary');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching order summary:', error);
      throw error;
    }
  }

  // Upload order documents
  async uploadOrderDocument(orderId: string, file: File, documentType: string): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);

      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/documents`, {
        method: 'POST',
        headers: {
          ...(this.authToken && { 'Authorization': `Bearer ${this.authToken}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to upload document');
      }

      const result = await response.json();
      return result.data.url;
    } catch (error) {
      console.error('Error uploading order document:', error);
      throw error;
    }
  }

  // Rate and review order
  async submitOrderReview(orderId: string, reviewData: {
    rating: number;
    comment: string;
    reviewType: 'seller' | 'buyer';
  }): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/review`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting order review:', error);
      throw error;
    }
  }

  // Dispute order
  async createDispute(orderId: string, disputeData: {
    reason: string;
    description: string;
    attachments?: string[];
  }): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/dispute`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(disputeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to create dispute');
      }
    } catch (error) {
      console.error('Error creating dispute:', error);
      throw error;
    }
  }
}

export const orderService = OrderService.getInstance();