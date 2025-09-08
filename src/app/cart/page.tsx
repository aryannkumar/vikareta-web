'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  Tag,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast-provider';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/lib/stores/cart';
import { useVikaretaAuthContext } from '@/lib/auth/vikareta';

export default function CartPage() {
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  const toast = useToast();
  const { user } = useVikaretaAuthContext();
  const { 
    items, 
    totalItems, 
    totalPrice, 
    updateQuantity, 
    removeItem, 
    clearCart 
  } = useCartStore();

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      toast.success('Removed', 'Item removed from cart');
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId: string, itemName: string) => {
    removeItem(itemId);
    toast.success('Removed', `${itemName} removed from cart`);
  };

  const applyPromoCode = () => {
    if (!promoCode.trim()) {
      toast.error('Error', 'Please enter a promo code');
      return;
    }

    // Mock promo code validation
    const validCodes = ['SAVE10', 'WELCOME20', 'BULK15'];
    const discountRates = { 'SAVE10': 0.1, 'WELCOME20': 0.2, 'BULK15': 0.15 };

    if (validCodes.includes(promoCode.toUpperCase())) {
      const discountRate = discountRates[promoCode.toUpperCase() as keyof typeof discountRates];
      const discountAmount = totalPrice * discountRate;
      setDiscount(discountAmount);
      setPromoApplied(true);
      toast.success('Success', `Promo code applied! You saved ${formatPrice(discountAmount)}`);
    } else {
      toast.error('Invalid Code', 'The promo code you entered is not valid');
    }
  };

  const removePromoCode = () => {
    setPromoCode('');
    setPromoApplied(false);
    setDiscount(0);
    toast.info('Removed', 'Promo code removed');
  };

  const subtotal = totalPrice;
  const tax = subtotal * 0.18; // 18% GST
  const shipping = subtotal > 10000 ? 0 : 500; // Free shipping above ₹10,000
  const finalTotal = subtotal + tax + shipping - discount;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/products">
                <Button className="btn-primary">
                  Browse Products
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline">
                  Browse Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link href="/products" className="inline-flex items-center gap-2 text-primary hover:underline text-sm sm:text-base">
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
            <div className="hidden sm:block h-4 w-px bg-border"></div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold">Shopping Cart</h1>
            <Badge variant="secondary" className="w-fit">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg border">
              {/* Header */}
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Cart Items</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      clearCart();
                      toast.success('Cleared', 'Cart cleared successfully');
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Cart
                  </Button>
                </div>
              </div>

              {/* Items */}
              <div className="divide-y">
                {items.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <Link href={`/${item.type}s/${item.id}`}>
                              <h3 className="font-semibold hover:text-primary transition-colors line-clamp-2">
                                {item.name}
                              </h3>
                            </Link>
                            <p className="text-sm text-muted-foreground mt-1">
                              by {item.provider.name}
                            </p>
                            <Badge variant="outline" className="text-xs mt-2">
                              {item.category}
                            </Badge>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id, item.name)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Price and Quantity */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center border rounded-lg">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            {!item.inStock && (
                              <Badge variant="destructive" className="text-xs">
                                Out of Stock
                              </Badge>
                            )}
                          </div>

                          <div className="text-left sm:text-right">
                            <div className="font-bold text-lg">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                            {item.originalPrice && (
                              <div className="text-sm text-muted-foreground line-through">
                                {formatPrice(item.originalPrice * item.quantity)}
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground">
                              {formatPrice(item.price)} each
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Promo Code */}
            <div className="bg-card rounded-lg border p-6">
              <h3 className="font-semibold mb-4">Promo Code</h3>
              {!promoApplied ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter promo code"
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                    />
                    <Button onClick={applyPromoCode} variant="outline">
                      Apply
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Try: SAVE10, WELCOME20, or BULK15
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                      {promoCode.toUpperCase()} Applied
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removePromoCode}
                    className="text-green-600 hover:text-green-700"
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-card rounded-lg border p-6">
              <h3 className="font-semibold mb-4">Order Summary</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="mt-6 space-y-3">
                {user ? (
                  <Link href="/checkout">
                    <Button className="w-full btn-primary text-sm sm:text-base">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Proceed to Checkout
                    </Button>
                  </Link>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      Please sign in to continue
                    </div>
                    <Link href="/auth/login">
                      <Button className="w-full btn-primary text-sm sm:text-base">
                        Sign In to Checkout
                      </Button>
                    </Link>
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground text-center">
                  By proceeding, you agree to our Terms & Conditions
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="bg-card rounded-lg border p-6">
              <h3 className="font-semibold mb-4">Why Shop With Us?</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="h-4 w-4 text-blue-500" />
                  <span>Fast & Reliable Delivery</span>
                </div>
                <div className="flex items-center gap-3">
                  <Tag className="h-4 w-4 text-purple-500" />
                  <span>Best Price Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}