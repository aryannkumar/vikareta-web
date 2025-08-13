'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Trash2, Package, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast-provider';
import { formatPrice } from '@/lib/utils';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCartStore } from '@/lib/stores/cart';
import { useWishlistStore } from '@/lib/stores/wishlist';

export default function WishlistPage() {
  const toast = useToast();
  const { user, isAuthenticated } = useAuth();
  const { addItem } = useCartStore();
  const { 
    items: wishlistItems, 
    loading, 
    error, 
    fetchWishlist, 
    removeFromWishlist,
    clearError 
  } = useWishlistStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated, fetchWishlist]);

  const handleRemoveFromWishlist = async (itemId: string) => {
    const success = await removeFromWishlist(itemId);
    if (success) {
      toast.success('Removed', 'Item removed from wishlist');
    } else {
      toast.error('Error', 'Failed to remove item from wishlist');
    }
  };

  const addToCart = (item: typeof wishlistItems[0]) => {
    addItem({
      id: item.itemId, // Use the actual product/service ID
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

  // Show login prompt for non-authenticated users
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Sign in to view your wishlist</h2>
            <p className="text-muted-foreground mb-8">
              Save your favorite products and services for later
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/auth/login">
                <Button className="btn-primary">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="outline">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <Button onClick={() => {
              clearError();
              fetchWishlist();
            }}>
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
                      onClick={() => handleRemoveFromWishlist(item.id)}
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
                    <Link href={`/${item.type}s/${item.itemId}`}>
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