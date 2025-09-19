import { PaymentGateway, PaymentRequest, PaymentResponse } from '../types/payment';
import { vikaretaSSOClient } from '../lib/auth/vikareta';
import { paymentApi } from '../lib/api/payment';
import { getApiUrl } from '../config/api';

// Razorpay type declarations
declare global {
  interface Window {
    Razorpay: new (options: any) => any;
  }
}

export class PaymentService {
  private static instance: PaymentService;
  private authToken: string | null = null;

  private constructor() {
    // Do not cache stored token here; use SSO client on demand
    this.authToken = null;
  }

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    const token = (typeof window !== 'undefined') ? vikaretaSSOClient.getAccessToken() : null;
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    return headers;
  }

  setAuthToken(token: string) {
    this.authToken = token;
    // Do not persist tokens in localStorage. The unified SSO client manages tokens.
  }

  async getAvailableGateways(): Promise<PaymentGateway[]> {
    try {
      const apiGateways = await paymentApi.getPaymentGateways();

      // Transform API response to match service interface
      return apiGateways.map(gateway => ({
        id: gateway.id,
        name: gateway.name,
        slug: gateway.code,
        logo: `/images/payment/${gateway.code}.png`,
        status: gateway.isActive ? 'active' : 'inactive',
        config: {
          // Add gateway-specific config based on type
          ...(gateway.code === 'razorpay' && {
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY || '',
            currency: 'INR',
            theme_color: '#3399cc'
          }),
          ...(gateway.code === 'cashfree' && {
            app_id: process.env.NEXT_PUBLIC_CASHFREE_APP_ID || '',
            environment: process.env.NEXT_PUBLIC_CASHFREE_ENV || 'sandbox',
            currency: 'INR'
          }),
          ...(gateway.code === 'phonepe' && {
            merchant_id: process.env.NEXT_PUBLIC_PHONEPE_MERCHANT_ID || '',
            environment: process.env.NEXT_PUBLIC_PHONEPE_ENV || 'UAT'
          }),
          ...(gateway.code === 'cod' && {})
        }
      }));
    } catch (error) {
      console.error('Error fetching payment gateways:', error);
      // Return default gateways as fallback
      return this.getDefaultGateways();
    }
  }

  private getDefaultGateways(): PaymentGateway[] {
    return [
      {
        id: 'razorpay',
        name: 'Razorpay',
        slug: 'razorpay',
        logo: '/images/payment/razorpay.png',
        status: 'active',
        config: {
          key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY || '',
          currency: 'INR',
          theme_color: '#3399cc'
        }
      },
      {
        id: 'cashfree',
        name: 'Cashfree',
        slug: 'cashfree',
        logo: '/images/payment/cashfree.png',
        status: 'active',
        config: {
          app_id: process.env.NEXT_PUBLIC_CASHFREE_APP_ID || '',
          environment: process.env.NEXT_PUBLIC_CASHFREE_ENV || 'sandbox',
          currency: 'INR'
        }
      },
      {
        id: 'phonepe',
        name: 'PhonePe',
        slug: 'phonepe',
        logo: '/images/payment/phonepe.png',
        status: 'active',
        config: {
          merchant_id: process.env.NEXT_PUBLIC_PHONEPE_MERCHANT_ID || '',
          environment: process.env.NEXT_PUBLIC_PHONEPE_ENV || 'UAT'
        }
      },
      {
        id: 'cod',
        name: 'Cash on Delivery',
        slug: 'cod',
        logo: '/images/payment/cod.png',
        status: 'active',
        config: {}
      }
    ];
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const paymentIntent = await paymentApi.createPaymentIntent({
        amount: request.amount,
        currency: request.currency,
        paymentMethod: request.paymentMethod || 'card',
        orderId: request.orderId,
        description: request.description,
        returnUrl: request.returnUrl,
        metadata: request.metadata
      });

      // Transform API response to match service interface
      const statusMap: Record<string, 'success' | 'pending' | 'failed'> = {
        'succeeded': 'success',
        'pending': 'pending',
        'processing': 'pending',
        'failed': 'failed',
        'cancelled': 'failed'
      };

      return {
        success: paymentIntent.status === 'succeeded',
        orderId: paymentIntent.orderId || request.orderId,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: statusMap[paymentIntent.status] || 'pending',
        transactionId: paymentIntent.id,
        paymentUrl: paymentIntent.paymentUrl,
        gatewayResponse: paymentIntent
      };
    } catch (error) {
      console.error('Payment creation error:', error);
      return {
        success: false,
        orderId: request.orderId,
        amount: request.amount,
        currency: request.currency,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Payment failed'
      };
    }
  }

  async createCashfreeOrder(request: {
    orderId: string;
    amount: number;
    currency: string;
    customerDetails: {
      customerId: string;
      customerName: string;
      customerEmail?: string;
      customerPhone?: string;
    };
  }): Promise<PaymentResponse & { paymentSessionId?: string }> {
    try {
      const baseUrl = await getApiUrl();
      const response = await fetch(`${baseUrl}/payments/cashfree/create-order`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Cashfree order creation failed');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Cashfree order creation error:', error);
      return {
        success: false,
        orderId: request.orderId,
        amount: request.amount,
        currency: request.currency,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Cashfree order creation failed'
      };
    }
  }

  async verifyPayment(gateway: string, verificationData: Record<string, any>): Promise<PaymentResponse> {
    try {
      // For verification, we need to confirm the payment intent
      const intentId = verificationData.intentId || verificationData.orderId;
      const transaction = await paymentApi.confirmPayment(intentId, {
        paymentMethodId: verificationData.paymentMethodId,
        returnUrl: verificationData.returnUrl
      });

      // Transform API response to match service interface
      const statusMap: Record<string, 'success' | 'pending' | 'failed'> = {
        'succeeded': 'success',
        'pending': 'pending',
        'processing': 'pending',
        'failed': 'failed',
        'refunded': 'failed',
        'cancelled': 'failed'
      };

      return {
        success: transaction.status === 'succeeded',
        orderId: transaction.orderId || verificationData.orderId,
        amount: transaction.amount,
        currency: transaction.currency,
        status: statusMap[transaction.status] || 'pending',
        transactionId: transaction.id,
        gatewayResponse: transaction
      };
    } catch (error) {
      console.error('Payment verification error:', error);
      return {
        success: false,
        orderId: verificationData.orderId || '',
        amount: 0,
        currency: 'INR',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Verification failed'
      };
    }
  }

  async getPaymentStatus(orderId: string): Promise<{ status: string; transactionId?: string; details?: any }> {
    try {
      // Try to get transaction by order ID - this might need adjustment based on API
      const transaction = await paymentApi.getTransaction(orderId);
      return {
        status: transaction.status,
        transactionId: transaction.id,
        details: transaction
      };
    } catch (error) {
      console.error('Error fetching payment status:', error);
      return { status: 'unknown' };
    }
  }

  async capturePayment(paymentId: string, amount?: number): Promise<PaymentResponse> {
    try {
      // For capture, we confirm the payment intent
      const transaction = await paymentApi.confirmPayment(paymentId);

      const statusMap: Record<string, 'success' | 'pending' | 'failed'> = {
        'succeeded': 'success',
        'pending': 'pending',
        'processing': 'pending',
        'failed': 'failed',
        'refunded': 'failed',
        'cancelled': 'failed'
      };

      return {
        success: transaction.status === 'succeeded',
        orderId: transaction.orderId,
        amount: transaction.amount,
        currency: transaction.currency,
        status: statusMap[transaction.status] || 'pending',
        transactionId: transaction.id,
        gatewayResponse: transaction
      };
    } catch (error) {
      console.error('Payment capture error:', error);
      return {
        success: false,
        orderId: '',
        amount: amount || 0,
        currency: 'INR',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Capture failed'
      };
    }
  }

  async refundPayment(paymentId: string, amount?: number, reason?: string): Promise<PaymentResponse> {
    try {
      const refundData = await paymentApi.processRefund(paymentId, {
        amount: amount || 0,
        reason: reason || 'Customer request'
      });

      return {
        success: refundData.status === 'success' || refundData.status === 'completed',
        orderId: '', // Not available in refund response
        amount: refundData.amount,
        currency: 'INR',
        status: 'success',
        transactionId: refundData.refundId,
        gatewayResponse: refundData
      };
    } catch (error) {
      console.error('Payment refund error:', error);
      return {
        success: false,
        orderId: '',
        amount: amount || 0,
        currency: 'INR',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Refund failed'
      };
    }
  }

  // Gateway-specific methods that interact with backend
  async processRazorpayPayment(orderId: string, paymentId: string, signature: string): Promise<PaymentResponse> {
    return this.verifyPayment('razorpay', {
      orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature
    });
  }

  async processCashfreePayment(orderId: string, cfPaymentId: string): Promise<PaymentResponse> {
    return this.verifyPayment('cashfree', {
      orderId,
      cf_payment_id: cfPaymentId
    });
  }

  async processPhonePePayment(orderId: string, transactionId: string, merchantTransactionId: string): Promise<PaymentResponse> {
    return this.verifyPayment('phonepe', {
      orderId,
      transactionId,
      merchantTransactionId
    });
  }

  async processCODPayment(orderId: string): Promise<PaymentResponse> {
    return this.verifyPayment('cod', {
      orderId,
      payment_method: 'cash_on_delivery'
    });
  }

  // Frontend-specific integration methods
  async initializeRazorpay(paymentData: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.Razorpay) {
        reject(new Error('Razorpay SDK not loaded'));
        return;
      }

      const options = {
        key: paymentData.key_id,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: paymentData.name || 'Vikareta',
        description: paymentData.description,
        order_id: paymentData.order_id,
        image: paymentData.image || '/images/logo.png',
        handler: (response: any) => {
          this.processRazorpayPayment(
            paymentData.notes?.orderId || paymentData.order_id,
            response.razorpay_payment_id,
            response.razorpay_signature
          ).then(() => resolve()).catch(reject);
        },
        prefill: {
          name: paymentData.prefill?.name,
          email: paymentData.prefill?.email,
          contact: paymentData.prefill?.contact,
        },
        notes: paymentData.notes || {},
        theme: {
          color: paymentData.theme?.color || '#3399cc',
        },
        modal: {
          ondismiss: () => {
            reject(new Error('Payment cancelled by user'));
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    });
  }

  async initializeCashfree(paymentData: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Window object not available'));
        return;
      }

      // Redirect to Cashfree payment page
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = paymentData.payment_link || paymentData.redirectUrl;
      form.style.display = 'none';

      // Add all required fields
      Object.keys(paymentData).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = paymentData[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      resolve();
    });
  }

  async initializePhonePe(paymentData: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Window object not available'));
        return;
      }

      // Redirect to PhonePe payment page
      if (paymentData.redirectUrl) {
        window.location.href = paymentData.redirectUrl;
        resolve();
      } else {
        reject(new Error('PhonePe redirect URL not provided'));
      }
    });
  }

  // WhatsApp Integration Methods
  async sendPaymentConfirmation(orderId: string, buyerId: string): Promise<void> {
    try {
      const baseUrl = await getApiUrl();
      await fetch(`${baseUrl}/payments/notifications/confirmation`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ orderId, buyerId }),
      });
    } catch (error) {
      console.error('Failed to send payment confirmation:', error);
    }
  }

  async sendPaymentReceipt(orderId: string, buyerId: string): Promise<void> {
    try {
      const baseUrl = await getApiUrl();
      await fetch(`${baseUrl}/payments/notifications/receipt`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ orderId, buyerId }),
      });
    } catch (error) {
      console.error('Failed to send payment receipt:', error);
    }
  }
}

export const paymentService = PaymentService.getInstance();