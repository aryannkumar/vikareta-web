'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceholderImage } from '@/components/ui/placeholder-image';
import { Star, ShoppingCart, Heart, Loader2, AlertCircle, Crown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/stores/cart';
import { useToast } from '@/components/ui/toast-provider';
import { formatPrice } from '@/lib/utils';
import { featuredApi, type FeaturedProduct } from '@/lib/api/featuredProducts';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';

export function FeaturedProducts() {
  const [products, setProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCartStore();
  const toast = useToast();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try featured products first, then fallback to regular products
      let response = await featuredApi.getFeaturedProducts({ limit: 8 });
      
      if (!response.success || !response.data.products || response.data.products.length === 0) {
        // Fallback to regular products API
        const productsApi = await import('@/lib/api/products');
        const fallbackResponse = await productsApi.productsApi.getProducts({ limit: 8, sortBy: 'popular' });
        
        if (fallbackResponse.success && fallbackResponse.data.products) {
          // Transform regular products to featured products format
          const transformedProducts = fallbackResponse.data.products.map(product => ({
            id: product.id,
            name: product.name,
            description: product.shortDescription || product.description,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.images[0] || '/img/placeholder-product.jpg',
            rating: product.reviews.average,
            reviewCount: product.reviews.total,
            category: product.category.name,
            tags: product.tags,
            supplier: {
              id: product.supplier.id,
              name: product.supplier.name,
              location: product.supplier.location,
              verified: product.supplier.verified
            },
            promotionType: 'standard' as const,
            inStock: product.inStock,
            minOrderQuantity: product.minOrderQuantity,
            featured: false,
            featuredUntil: '',
            specifications: product.specifications || {}
          }));
          setProducts(transformedProducts);
        } else {
          setProducts([]);
        }
      } else {
        setProducts(response.data.products);
      }
    } catch (err) {
      console.error('Error fetching featured products:', err);
      setError('Failed to load featured products. Please try again later.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: FeaturedProduct) => {
    try {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        type: 'product' as const,
        provider: {
          id: product.supplier.id,
          name: product.supplier.name,
          location: product.supplier.location
        },
        category: product.category,
        inStock: product.inStock
      });

      toast.success('Added to Cart', `${product.name} has been added to your cart`);
    } catch (err) {
      toast.error('Error', 'Failed to add item to cart');
    }
  };

  const getPromotionIcon = (promotionType: string) => {
    switch (promotionType) {
      case 'premium':
        return <Crown className="h-3 w-3" />;
      case 'organic':
        return <Sparkles className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getPromotionBadgeColor = (promotionType: string) => {
    switch (promotionType) {
      case 'premium':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      case 'organic':
        return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover top-quality products promoted by verified suppliers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <LoadingSkeleton type="card" count={8} />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover top-quality products promoted by verified suppliers
            </p>
          </div>

          <ErrorBoundary 
            error={error}
            onRetry={fetchFeaturedProducts}
            title="Failed to load featured products"
          />
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover top-quality products promoted by verified suppliers
            </p>
          </div>

          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No featured products available at the moment.</p>
            <Link href="/categories">
              <Button>Browse All Categories</Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">
            <span className="text-gradient">Featured Products</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover top-quality products promoted by verified suppliers across India
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-card rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 card-hover"
            >
              <div className="relative">
                {product.image && product.image !== '/img/placeholder-product.jpg' ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full h-48 object-cover rounded-t-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`${product.image && product.image !== '/img/placeholder-product.jpg' ? 'hidden' : ''} w-full h-48 rounded-t-lg`}>
                  <PlaceholderImage type="product" className="w-full h-48 rounded-t-lg" />
                </div>

                {/* Promotion Badge */}
                <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getPromotionBadgeColor(product.promotionType)}`}>
                  {getPromotionIcon(product.promotionType)}
                  {product.promotionType.toUpperCase()}
                </div>

                {/* Discount Badge */}
                {product.originalPrice && (
                  <Badge className="absolute top-2 right-12 bg-red-500 text-white">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </Badge>
                )}

                {/* Wishlist Button */}
                <Button className="absolute top-2 right-2 bg-white/80 hover:bg-white w-8 h-8 p-0">
                  <Heart className="h-4 w-4" />
                </Button>

                {/* Verified Supplier Badge */}
                {product.supplier.verified && (
                  <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    ✓ Verified
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <Badge className="text-xs bg-secondary text-secondary-foreground">
                    {product.category}
                  </Badge>
                  <div className="flex items-center gap-1">
                    {product.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <Link href={`/products/${product.id}`}>
                  <h3 className="font-semibold text-sm mb-2 hover:text-primary transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center gap-1 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({product.reviewCount})
                  </span>
                </div>

                <div className="mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-primary">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Min. Order: {product.minOrderQuantity} units
                  </p>
                </div>

                <div className="mb-3">
                  <Link
                    href={`/suppliers/${product.supplier.id}`}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    {product.supplier.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {product.supplier.location}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1 btn-primary text-sm px-3 py-2"
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                  <Link href={`/products/${product.id}`}>
                    <Button className="text-sm px-3 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground">
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/products">
            <Button className="border border-input bg-background hover:bg-accent hover:text-accent-foreground px-8 py-3">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}