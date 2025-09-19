'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CreditCard,
  Truck,
  MapPin,
  Shield,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  Building2,
  User,
  Phone,
  Mail,
  FileText,
  Calculator,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast-provider';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/lib/stores/cart';
import { useVikaretaAuthContext } from '@/lib/auth/vikareta';
import { ordersApi } from '@/lib/api/orders';
import { shippingApi } from '@/lib/api/shipping';
import { paymentApi } from '@/lib/api/payment';

interface CheckoutStep {
  id: string;
  title: string;
  completed: boolean;
  current: boolean;
}

interface ShippingAddress {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface BillingDetails {
  name: string;
  email: string;
  phone: string;
  gstin?: string;
  companyName?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useVikaretaAuthContext();
  const { items, totalItems, totalPrice, clearCart } = useCartStore();
  const toast = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
    name: user?.firstName + ' ' + user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    gstin: user?.gstin || '',
    companyName: user?.businessName || ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [orderNotes, setOrderNotes] = useState('');

  const steps: CheckoutStep[] = [
    { id: 'cart', title: 'Review Cart', completed: true, current: currentStep === 1 },
    { id: 'shipping', title: 'Shipping', completed: currentStep > 1, current: currentStep === 2 },
    { id: 'billing', title: 'Billing', completed: currentStep > 2, current: currentStep === 3 },
    { id: 'payment', title: 'Payment', completed: currentStep > 3, current: currentStep === 4 },
    { id: 'confirm', title: 'Confirm', completed: false, current: currentStep === 5 }
  ];

  // Redirect if not authenticated or cart is empty
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (items.length === 0) {
      router.push('/cart');
      return;
    }
  }, [isAuthenticated, items.length, router]);

  // Load shipping addresses
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const response = await shippingApi.getAddresses();
        if (response.success) {
          setAddresses(response.data);
          // Auto-select default address
          const defaultAddr = response.data.find((addr: ShippingAddress) => addr.isDefault);
          if (defaultAddr) {
            setSelectedAddress(defaultAddr.id);
          }
        }
      } catch (error) {
        console.error('Error loading addresses:', error);
      }
    };

    if (isAuthenticated) {
      loadAddresses();
    }
  }, [isAuthenticated]);

  const calculateTotals = () => {
    const subtotal = totalPrice;
    const tax = subtotal * 0.18; // 18% GST
    const shipping = subtotal > 10000 ? 0 : 500; // Free shipping above ₹10,000
    const finalTotal = subtotal + tax + shipping - discount;

    return { subtotal, tax, shipping, finalTotal };
  };

  const { subtotal, tax, shipping, finalTotal } = calculateTotals();

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      toast.error('Error', 'Please enter a promo code');
      return;
    }

    try {
      // TODO: Implement promo code validation API
      toast.info('Info', 'Promo code validation coming soon');
    } catch (error) {
      toast.error('Error', 'Invalid promo code');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Error', 'Please select a shipping address');
      return;
    }

    setLoading(true);
    try {
      // Get selected shipping address
      const shippingAddr = addresses.find(addr => addr.id === selectedAddress);
      if (!shippingAddr) {
        throw new Error('Selected shipping address not found');
      }

      // Prepare order data
      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          variantId: item.selectedVariant?.id,
          quantity: item.quantity,
          unitPrice: item.price
        })),
        shippingAddress: {
          name: shippingAddr.name,
          addressLine1: shippingAddr.addressLine1,
          addressLine2: shippingAddr.addressLine2,
          city: shippingAddr.city,
          state: shippingAddr.state,
          postalCode: shippingAddr.postalCode,
          country: shippingAddr.country,
          phone: shippingAddr.phone
        },
        billingAddress: {
          name: billingDetails.name,
          company: billingDetails.companyName,
          addressLine1: shippingAddr.addressLine1, // Use shipping address for billing if not specified
          addressLine2: shippingAddr.addressLine2,
          city: shippingAddr.city,
          state: shippingAddr.state,
          postalCode: shippingAddr.postalCode,
          country: shippingAddr.country,
          phone: billingDetails.phone
        },
        paymentMethod,
        notes: orderNotes
      };

      // Create order
      const orderResponse = await ordersApi.createOrder(orderData);

      if (orderResponse.success) {
        // Clear cart
        clearCart();

        // Redirect to order confirmation
        router.push(`/orders/${orderResponse.data.id}/confirmation`);
        toast.success('Success', 'Order placed successfully!');
      } else {
        throw new Error(orderResponse.error || 'Failed to create order');
      }
    } catch (error: any) {
      console.error('Order creation error:', error);
      toast.error('Error', error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step.completed
                    ? 'bg-green-500 text-white'
                    : step.current
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {step.completed ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  step.current ? 'text-blue-600' : step.completed ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    step.completed ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Step 1: Cart Review */}
            {currentStep === 1 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-4">Review Your Order</h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        {item.selectedVariant && (
                          <p className="text-sm text-gray-600">Variant: {item.selectedVariant.name}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code */}
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-lg font-medium mb-4">Promo Code</h3>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter promo code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Button onClick={applyPromoCode} variant="outline">
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Shipping */}
            {currentStep === 2 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>

                {addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No shipping addresses found</p>
                    <Link href="/settings/addresses">
                      <Button>Add Shipping Address</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedAddress === address.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedAddress(address.id)}
                      >
                        <div className="flex items-start">
                          <input
                            type="radio"
                            checked={selectedAddress === address.id}
                            onChange={() => setSelectedAddress(address.id)}
                            className="mt-1 mr-3"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-gray-900">{address.name}</h3>
                              {address.isDefault && (
                                <Badge variant="secondary">Default</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {address.addressLine1}
                              {address.addressLine2 && `, ${address.addressLine2}`}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.city}, {address.state} {address.postalCode}
                            </p>
                            <p className="text-sm text-gray-600">{address.country}</p>
                            <p className="text-sm text-gray-600">{address.phone}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 pt-6 border-t">
                  <Link href="/settings/addresses">
                    <Button variant="outline" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Address
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Step 3: Billing */}
            {currentStep === 3 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-4">Billing Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={billingDetails.name}
                      onChange={(e) => setBillingDetails({...billingDetails, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={billingDetails.email}
                      onChange={(e) => setBillingDetails({...billingDetails, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={billingDetails.phone}
                      onChange={(e) => setBillingDetails({...billingDetails, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={billingDetails.companyName}
                      onChange={(e) => setBillingDetails({...billingDetails, companyName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GSTIN (Optional)
                    </label>
                    <input
                      type="text"
                      value={billingDetails.gstin}
                      onChange={(e) => setBillingDetails({...billingDetails, gstin: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="22AAAAA0000A1Z5"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Payment */}
            {currentStep === 4 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="card"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="card" className="flex items-center cursor-pointer">
                      <CreditCard className="w-5 h-5 mr-2 text-gray-600" />
                      <span className="font-medium">Credit/Debit Card</span>
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="upi"
                      name="payment"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="upi" className="flex items-center cursor-pointer">
                      <Building2 className="w-5 h-5 mr-2 text-gray-600" />
                      <span className="font-medium">UPI</span>
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="netbanking"
                      name="payment"
                      value="netbanking"
                      checked={paymentMethod === 'netbanking'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="netbanking" className="flex items-center cursor-pointer">
                      <Building2 className="w-5 h-5 mr-2 text-gray-600" />
                      <span className="font-medium">Net Banking</span>
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="cod"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="cod" className="flex items-center cursor-pointer">
                      <Truck className="w-5 h-5 mr-2 text-gray-600" />
                      <span className="font-medium">Cash on Delivery</span>
                    </label>
                  </div>
                </div>

                {/* Order Notes */}
                <div className="mt-6 pt-6 border-t">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any special instructions for your order..."
                  />
                </div>
              </div>
            )}

            {/* Step 5: Confirm */}
            {currentStep === 5 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-4">Confirm Your Order</h2>

                <div className="space-y-6">
                  {/* Order Summary */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Order Summary</h3>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.name} × {item.quantity}</span>
                          <span>{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Shipping Address</h3>
                    {(() => {
                      const address = addresses.find(addr => addr.id === selectedAddress);
                      return address ? (
                        <div className="text-sm text-gray-600">
                          <p className="font-medium text-gray-900">{address.name}</p>
                          <p>{address.addressLine1}</p>
                          {address.addressLine2 && <p>{address.addressLine2}</p>}
                          <p>{address.city}, {address.state} {address.postalCode}</p>
                          <p>{address.country}</p>
                          <p>{address.phone}</p>
                        </div>
                      ) : null;
                    })()}
                  </div>

                  {/* Billing Details */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Billing Details</h3>
                    <div className="text-sm text-gray-600">
                      <p className="font-medium text-gray-900">{billingDetails.name}</p>
                      <p>{billingDetails.email}</p>
                      <p>{billingDetails.phone}</p>
                      {billingDetails.companyName && <p>{billingDetails.companyName}</p>}
                      {billingDetails.gstin && <p>GSTIN: {billingDetails.gstin}</p>}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Payment Method</h3>
                    <p className="text-sm text-gray-600 capitalize">{paymentMethod}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax (GST 18%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                {currentStep > 1 && (
                  <Button
                    onClick={handlePrevStep}
                    variant="outline"
                    className="w-full"
                  >
                    Previous
                  </Button>
                )}

                {currentStep < 5 ? (
                  <Button
                    onClick={handleNextStep}
                    className="w-full"
                    disabled={
                      (currentStep === 2 && !selectedAddress) ||
                      (currentStep === 3 && (!billingDetails.name || !billingDetails.email || !billingDetails.phone))
                    }
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    onClick={handlePlaceOrder}
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Place Order
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Security Notice */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="w-4 h-4 mr-2 text-green-600" />
                  <span>Secure checkout with SSL encryption</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}