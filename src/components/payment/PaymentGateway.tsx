'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Smartphone, 
  Banknote, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { PaymentGateway, Order, PaymentRequest } from '../../types/payment';
import { paymentService } from '../../services/payment.service';

interface PaymentGatewayComponentProps {
  order: Order;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
    Stripe: any;
    PayPal: any;
    Cashfree: (config: { mode: 'production' | 'sandbox' }) => {
      checkout: (options: {
        paymentSessionId: string;
        redirectTarget?: '_self' | '_blank';
      }) => Promise<{
        error?: {
          message: string;
          code: string;
        };
        redirect?: boolean;
        paymentDetails?: {
          paymentMessage: string;
          paymentStatus: string;
          transactionId: string;
        };
      }>;
    };
  }
}

export const PaymentGatewayComponent: React.FC<PaymentGatewayComponentProps> = ({
  order,
  onSuccess,
  onError,
  onCancel
}) => {
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPaymentGateways();
  }, []);

  const loadPaymentGateways = async () => {
    setLoading(true);
    try {
      const availableGateways = await paymentService.getAvailableGateways();
      setGateways(availableGateways.filter(g => g.status === 'active'));
    } catch (err) {
      console.error('Failed to load payment gateways:', err);
      setError('Failed to load payment options');
    } finally {
      setLoading(false);
    }
  };

  const handleGatewaySelect = (gateway: PaymentGateway) => {
    setSelectedGateway(gateway);
    setError(null);
  };

  const processPayment = async () => {
    if (!selectedGateway) return;

    setProcessing(true);
    setError(null);

    try {
      const paymentRequest: PaymentRequest = {
        orderId: order.id,
        paymentMethod: selectedGateway.slug,
        amount: order.total,
        currency: 'INR',
        customerName: order.user?.name || order.address?.firstName + ' ' + order.address?.lastName || 'Unknown Customer',
        customerEmail: order.user?.email || order.address?.email || '',
        customerPhone: order.user?.phone || order.address?.phone || '',
        returnUrl: `${window.location.origin}/payment/success`,
        cancelUrl: `${window.location.origin}/payment/cancel`,
        notifyUrl: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/payments/webhook`,
        description: `Payment for Order #${order.orderSerialNo}`,
        metadata: {
          customerName: order.user?.name,
          customerEmail: order.user?.email,
          orderItems: order.items.length
        }
      };

      switch (selectedGateway.slug) {
        case 'razorpay':
          await processRazorpayPayment(paymentRequest);
          break;
        case 'cashfree':
          await processCashfreePayment(paymentRequest);
          break;
        case 'stripe':
          await processStripePayment(paymentRequest);
          break;
        case 'paypal':
          await processPayPalPayment(paymentRequest);
          break;
        case 'cod':
          await processCODPayment(paymentRequest);
          break;
        default:
          throw new Error('Unsupported payment method');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment processing failed';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  const processRazorpayPayment = async (request: PaymentRequest) => {
    const gateway = gateways.find(g => g.slug === 'razorpay');
    const keyId = gateway?.gatewayOptions?.find(opt => opt.option === 'razorpay_key')?.value;

    if (!keyId) {
      throw new Error('Razorpay configuration missing');
    }

    const options = {
      key: keyId,
      amount: request.amount * 100, // Convert to paise
      currency: request.currency,
      name: 'Vikareta',
      description: request.description,
      order_id: request.orderId,
      handler: async (response: any) => {
        try {
          const result = await paymentService.processRazorpayPayment(
            request.orderId,
            response.razorpay_payment_id,
            response.razorpay_signature
          );
          
          if (result.success) {
            onSuccess(response.razorpay_payment_id);
          } else {
            throw new Error(result.error || 'Payment verification failed');
          }
        } catch (error) {
          onError(error instanceof Error ? error.message : 'Payment failed');
        }
      },
      prefill: {
        name: request.metadata?.customerName,
        email: request.metadata?.customerEmail,
        contact: order.user?.phone
      },
      theme: {
        color: '#f97316'
      },
      modal: {
        ondismiss: () => {
          setProcessing(false);
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const processCashfreePayment = async (request: PaymentRequest) => {
    try {
      // Create Cashfree order through backend
      const orderResponse = await paymentService.createCashfreeOrder({
        orderId: request.orderId,
        amount: request.amount,
        currency: request.currency,
        customerDetails: {
          customerId: order.userId,
          customerName: request.metadata?.customerName || order.user?.name || '',
          customerEmail: request.metadata?.customerEmail || order.user?.email,
          customerPhone: order.user?.phone
        }
      });

      if (orderResponse.success && orderResponse.paymentSessionId) {
        // Use Cashfree SDK for checkout
        const cashfree = window.Cashfree({
          mode: process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT === 'production' ? 'production' : 'sandbox'
        });

        const checkoutOptions = {
          paymentSessionId: orderResponse.paymentSessionId,
          redirectTarget: '_self' as const
        };

        const result = await cashfree.checkout(checkoutOptions);
        
        if (result.error) {
          throw new Error(result.error.message);
        }

        if (result.paymentDetails) {
          onSuccess(result.paymentDetails.transactionId);
        }
      } else {
        throw new Error(orderResponse.error || 'Failed to create Cashfree order');
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Cashfree payment failed');
    }
  };

  const processStripePayment = async (_request: PaymentRequest) => {
    // Implement Stripe payment processing
    const gateway = gateways.find(g => g.slug === 'stripe');
    const publicKey = gateway?.gatewayOptions?.find(opt => opt.option === 'stripe_public_key')?.value;

    if (!publicKey) {
      throw new Error('Stripe configuration missing');
    }

    // This would typically involve Stripe Elements or Checkout
    // For now, showing a placeholder implementation
    throw new Error('Stripe integration requires additional setup');
  };

  const processPayPalPayment = async (_request: PaymentRequest) => {
    // Implement PayPal payment processing
    throw new Error('PayPal integration requires additional setup');
  };

  const processCODPayment = async (request: PaymentRequest) => {
    const result = await paymentService.processCODPayment(request.orderId);
    
    if (result.success) {
      onSuccess('cod_' + Date.now());
    } else {
      throw new Error(result.error || 'COD processing failed');
    }
  };

  const getGatewayIcon = (slug: string) => {
    switch (slug) {
      case 'razorpay':
      case 'cashfree':
      case 'stripe':
      case 'paypal':
        return <CreditCard className="w-6 h-6" />;
      case 'phonepe':
      case 'paytm':
        return <Smartphone className="w-6 h-6" />;
      case 'cod':
        return <Banknote className="w-6 h-6" />;
      default:
        return <CreditCard className="w-6 h-6" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading payment options...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
        </div>
        
        {/* Order Summary */}
  <div className="bg-gradient-to-r from-blue-50 to-cyan-100 border border-blue-200 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Order #{order.orderSerialNo}</p>
              <p className="text-lg font-semibold text-gray-900">₹{order.total.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">{order.items.length} items</p>
              <div className="flex items-center text-green-600">
                <Shield className="w-4 h-4 mr-1" />
                <span className="text-sm">Secure Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center"
          >
            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
            <span className="text-red-700">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Gateway Selection */}
      {!selectedGateway ? (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Payment Method</h3>
          <div className="space-y-3">
            {gateways.map((gateway) => (
              <motion.button
                key={gateway.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleGatewaySelect(gateway)}
                className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 flex items-center justify-between group"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-gray-100 rounded-lg mr-4 group-hover:bg-blue-100">
                    {getGatewayIcon(gateway.slug)}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{gateway.name}</p>
                    <p className="text-sm text-gray-500">
                      {gateway.slug === 'cod' ? 'Pay when delivered' : 'Secure online payment'}
                    </p>
                  </div>
                </div>
                <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        /* Payment Confirmation */
        <div>
          <div className="flex items-center mb-6">
            <button
              onClick={() => setSelectedGateway(null)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-3"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-gray-900">
              Pay with {selectedGateway.name}
            </h3>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                {getGatewayIcon(selectedGateway.slug)}
              </div>
              <div>
                <p className="font-medium text-gray-900">{selectedGateway.name}</p>
                <p className="text-sm text-gray-500">
                  {selectedGateway.slug === 'cod' 
                    ? 'You will pay when your order is delivered'
                    : 'You will be redirected to complete payment securely'
                  }
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">₹{order.subtotal.toLocaleString()}</span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">₹{order.tax.toLocaleString()}</span>
                </div>
              )}
              {order.shippingCharge > 0 && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">₹{order.shippingCharge.toLocaleString()}</span>
                </div>
              )}
              {order.discount > 0 && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-green-600">Discount</span>
                  <span className="text-green-600">-₹{order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-blue-600">₹{order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={processPayment}
            disabled={processing}
            className="w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:via-cyan-600 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Processing Payment...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Pay ₹{order.total.toLocaleString()}
              </>
            )}
          </motion.button>

          <div className="mt-4 text-center">
            <div className="flex items-center justify-center text-sm text-gray-500">
              <Shield className="w-4 h-4 mr-1" />
              Your payment information is encrypted and secure
            </div>
          </div>
        </div>
      )}
    </div>
  );
};