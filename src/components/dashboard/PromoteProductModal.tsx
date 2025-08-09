'use client';

import React, { useState } from 'react';
import { Crown, Sparkles, Star, X, Calendar, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { featuredApi } from '@/lib/api/featuredProducts';
import { useToast } from '@/components/ui/toast-provider';
import { formatPrice } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
}

interface PromoteProductModalProps {
  product: Product;
  supplierId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const promotionPlans = [
  {
    type: 'standard' as const,
    name: 'Standard Featured',
    icon: Star,
    price: 999,
    duration: 7,
    features: [
      'Featured in product listings',
      'Basic promotion badge',
      '7 days visibility',
      'Standard support'
    ],
    color: 'bg-blue-500',
    popular: false
  },
  {
    type: 'premium' as const,
    name: 'Premium Featured',
    icon: Crown,
    price: 2499,
    duration: 30,
    features: [
      'Top placement in listings',
      'Premium gold badge',
      '30 days visibility',
      'Priority support',
      'Analytics dashboard',
      'Social media promotion'
    ],
    color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    popular: true
  },
  {
    type: 'organic' as const,
    name: 'Organic Spotlight',
    icon: Sparkles,
    price: 1499,
    duration: 14,
    features: [
      'Organic/eco-friendly badge',
      'Green category placement',
      '14 days visibility',
      'Sustainability certification',
      'Eco-conscious audience targeting'
    ],
    color: 'bg-gradient-to-r from-green-400 to-emerald-500',
    popular: false
  }
];

export function PromoteProductModal({ 
  product, 
  supplierId, 
  isOpen, 
  onClose, 
  onSuccess 
}: PromoteProductModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<typeof promotionPlans[0] | null>(null);
  const [isPromoting, setIsPromoting] = useState(false);
  const toast = useToast();

  if (!isOpen) return null;

  const handlePromote = async () => {
    if (!selectedPlan) {
      toast.error('Error', 'Please select a promotion plan');
      return;
    }

    setIsPromoting(true);
    try {
      await featuredApi.promoteProduct({
        productId: product.id,
        promotionType: selectedPlan.type,
        duration: selectedPlan.duration,
        supplierId
      });

      toast.success('Success!', `${product.name} has been promoted successfully`);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error promoting product:', error);
      toast.error('Error', 'Failed to promote product. Please try again.');
    } finally {
      setIsPromoting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">Promote Product</h2>
            <p className="text-muted-foreground">Boost your product visibility and sales</p>
          </div>
          <Button onClick={onClose} className="w-8 h-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Product Info */}
        <div className="p-6 border-b bg-muted/30">
          <div className="flex items-center gap-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="text-xs">{product.category}</Badge>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm font-medium text-primary">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className={`text-xs ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Promotion Plans */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Choose Your Promotion Plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {promotionPlans.map((plan) => {
              const IconComponent = plan.icon;
              const isSelected = selectedPlan?.type === plan.type;
              
              return (
                <div
                  key={plan.type}
                  className={`
                    relative border rounded-lg p-6 cursor-pointer transition-all duration-200
                    ${isSelected 
                      ? 'border-primary bg-primary/5 shadow-md' 
                      : 'border-border hover:border-primary/50 hover:shadow-sm'
                    }
                  `}
                  onClick={() => setSelectedPlan(plan)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-3 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <div className="text-center mb-4">
                    <div className={`w-12 h-12 rounded-full ${plan.color} flex items-center justify-center mx-auto mb-3`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-lg">{plan.name}</h4>
                    <div className="mt-2">
                      <span className="text-2xl font-bold">{formatPrice(plan.price)}</span>
                      <span className="text-muted-foreground text-sm">/{plan.duration} days</span>
                    </div>
                  </div>

                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Starts immediately after payment</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Summary */}
        {selectedPlan && (
          <div className="p-6 border-t bg-muted/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-semibold">Payment Summary</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedPlan.name} for {selectedPlan.duration} days
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{formatPrice(selectedPlan.price)}</div>
                <div className="text-xs text-muted-foreground">
                  {formatPrice(selectedPlan.price / selectedPlan.duration)}/day
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <CreditCard className="h-3 w-3" />
              <span>Secure payment processing • 30-day money-back guarantee</span>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={onClose}
                className="flex-1 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePromote}
                disabled={isPromoting || !product.inStock}
                className="flex-1 btn-primary"
              >
                {isPromoting ? (
                  <>
                    <div className="loading-spinner h-4 w-4 mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Promote Now
                  </>
                )}
              </Button>
            </div>

            {!product.inStock && (
              <p className="text-xs text-red-600 mt-2 text-center">
                Product must be in stock to promote
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}