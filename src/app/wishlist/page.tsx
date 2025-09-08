'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Trash2, Package, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast-provider';
import { formatPrice } from '@/lib/utils';
import { useVikaretaAuthContext } from '@/lib/auth/vikareta';
import { useCartStore } from '@/lib/stores/cart';
import { useWishlistStore } from '@/lib/stores/wishlist';

export default function WishlistPage() {
  const toast = useToast();
  const { user, isAuthenticated } = useVikaretaAuthContext();
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
    // Only products and services can be added to cart, not businesses
    if (item.type === 'business') {
      toast.info('Info', 'Business profiles cannot be added to cart');
      return;
    }

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
        <div className="container mx-auto px-4 py-8 sm:py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="mb-6">
              <Heart className="h-12 w-12 sm:h-16 sm:h-16 text-muted-foreground mx-auto" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Sign in to view your wishlist</h2>
            <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">
              Save your favorite products and services for later
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/auth/login">
                <Button className="btn-primary w-full sm:w-auto h-11 sm:h-12 px-6">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="outline" className="w-full sm:w-auto h-11 sm:h-12 px-6">
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
          <div className="animate-pulse mb-6 sm:mb-8">
            <div className="bg-muted rounded h-6 sm:h-8 w-32 sm:w-48 mb-2"></div>
            <div className="bg-muted rounded h-4 w-24 sm:w-32"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg border overflow-hidden shadow-sm">
                <div className="bg-muted h-40 sm:h-48"></div>
                <div className="p-4 space-y-3">
                  <div className="bg-muted rounded h-4 w-16"></div>
                  <div className="bg-muted rounded h-5 w-3/4"></div>
                  <div className="bg-muted rounded h-4 w-1/2"></div>
                  <div className="bg-muted rounded h-4 w-2/3"></div>
                  <div className="bg-muted rounded h-6 w-20"></div>
                  <div className="flex gap-2">
                    <div className="bg-muted rounded h-9 flex-1"></div>
                    <div className="bg-muted rounded h-9 w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 sm:py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="mb-6">
              <Package className="h-12 w-12 sm:h-16 sm:w-16 text-red-500 mx-auto" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Error Loading Wishlist</h2>
            <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">
              {error}
            </p>
            <Button onClick={() => {
              clearError();
              fetchWishlist();
            }} className="h-11 sm:h-12 px-6">
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
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">My Wishlist</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-12 sm:py-16 lg:py-20 px-4">
            <div className="mb-6">
              <Heart className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto" />
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg max-w-md mx-auto">
              Start adding products, services, and businesses you love to your wishlist
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/products">
                <Button className="btn-primary w-full sm:w-auto h-11 sm:h-12 px-6">
                  <Package className="h-4 w-4 mr-2" />
                  Browse Products
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" className="w-full sm:w-auto h-11 sm:h-12 px-6">
                  Browse Services
                </Button>
              </Link>
              <Link href="/businesses">
                <Button variant="outline" className="w-full sm:w-auto h-11 sm:h-12 px-6">
                  Browse Businesses
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow shadow-sm">
                <div className="relative">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={300}
                    height={200}
                    className="w-full h-40 sm:h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/90 hover:bg-white w-8 h-8 sm:w-9 sm:h-9 p-0"
                      onClick={() => handleRemoveFromWishlist(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  {!item.available && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="destructive" className="text-sm px-3 py-1">Out of Stock</Badge>
                    </div>
                  )}
                </div>

                <div className="p-4 sm:p-6">
                  <div className="mb-3">
                    <Badge variant="outline" className="text-xs px-2 py-1">
                      {item.type === 'product' ? 'Product' : 
                       item.type === 'service' ? 'Service' : 'Business'}
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-2 leading-tight">
                    {item.name}
                  </h3>

                  <div className="flex items-center gap-2 mb-3">
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
                    {item.type !== 'business' ? (
                      <div className="flex items-center gap-2">
                        <span className="text-lg sm:text-xl font-bold text-primary">
                          {formatPrice(item.price)}
                        </span>
                        {item.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(item.originalPrice)}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          Business Profile
                        </span>
                        {item.isVerified && (
                          <Badge variant="secondary" className="text-xs px-2 py-1">
                            Verified
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    {item.type !== 'business' ? (
                      <Button
                        className="flex-1 btn-primary h-10 sm:h-11 text-sm sm:text-base"
                        disabled={!item.available}
                        onClick={() => addToCart(item)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    ) : (
                      <Button
                        className="flex-1 btn-primary h-10 sm:h-11 text-sm sm:text-base"
                        asChild
                      >
                        <Link href={`/businesses/${item.itemId}`}>
                          View Profile
                        </Link>
                      </Button>
                    )}
                    <Link href={`/${item.type === 'business' ? 'businesses' : `${item.type}s`}/${item.itemId}`}>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto h-10 sm:h-11 px-4 text-sm sm:text-base">
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