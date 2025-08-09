'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Trash2, Package, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast-provider';
import { formatPrice } from '@/lib/utils';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCartStore } from '@/lib/stores/cart';

interface WishlistItem {
  id: string;
  type: 'product' | 'service';
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  provider: string;
  providerId: string;
  category: string;
  rating: number;
  reviewCount: number;
  available: boolean;
  addedAt: string;
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toast = useToast();
  const { user } = useAuth();
  const { addItem } = useCartStore();

  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const fetchWishlistItems = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock data for now - replace with actual API call
      const mockItems: WishlistItem[] = [
        {
          id: '1',
          type: 'product',
          name: 'Industrial Steel Pipes - Grade A',
          price: 2500,
          originalPrice: 3000,
          image: '/api/placeholder/300/200',
          provider: 'Steel Industries Ltd',
          providerId: 'provider-1',
          category: 'Industrial Materials',
          rating: 4.5,
          reviewCount: 23,
          available: true,
          addedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          type: 'service',
          name: 'Logistics & Transportation Service',
          price: 5000,
          image: '/api/placeholder/300/200',
          provider: 'FastMove Logistics',
          providerId: 'provider-2',
          category: 'Transportation',
          rating: 4.8,
          reviewCount: 45,
          available: true,
          addedAt: '2024-01-14T15:45:00Z'
        },
        {
          id: '3',
          type: 'product',
          name: 'Heavy Duty Bearings Set',
          price: 1200,
          originalPrice: 1500,
          image: '/api/placeholder/300/200',
          provider: 'Precision Parts Co',
          providerId: 'provider-3',
          category: 'Mechanical Parts',
          rating: 4.2,
          reviewCount: 18,
          available: false,
          addedAt: '2024-01-13T09:20:00Z'
        }
      ];

      setWishlistItems(mockItems);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setError('Failed to load wishlist items');
      toast.error('Error', 'Failed to load wishlist items');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (itemId: string) => {
    try {
      // API call to remove item
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
      toast.success('Removed', 'Item removed from wishlist');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Error', 'Failed to remove item from wishlist');
    }
  };

  const addToCart = (item: WishlistItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      type: item.type,
      provider: { id: item.providerId, name: item.provider, location: '' },
      category: item.category,
      inStock: item.available
    });
    toast.success('Added to Cart', `${item.name} added to cart`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-muted rounded h-8 w-48 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-muted rounded-lg h-80"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <Package className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Error Loading Wishlist</h2>
            <p className="text-muted-foreground mb-8">{error}</p>
            <Button onClick={fetchWishlistItems}>
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
          <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
          <p className="text-muted-foreground">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8">
              Start adding products and services you love to your wishlist
            </p>
            <Link href="/products">
              <Button className="btn-primary">
                <Package className="h-4 w-4 mr-2" />
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/90 hover:bg-white"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  {!item.available && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="destructive">Out of Stock</Badge>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="mb-2">
                    <Badge variant="outline" className="text-xs">
                      {item.type === 'product' ? 'Product' : 'Service'}
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {item.name}
                  </h3>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium ml-1">{item.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({item.reviewCount} reviews)
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    by {item.provider}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-primary">
                        {formatPrice(item.price)}
                      </span>
                      {item.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(item.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1 btn-primary"
                      disabled={!item.available}
                      onClick={() => addToCart(item)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Link href={`/${item.type}s/${item.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}