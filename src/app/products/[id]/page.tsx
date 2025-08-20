'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft,
  Star,
  Heart,
  Share2,
  ShoppingCart,
  MessageCircle,
  Truck,
  Shield,
  Award,
  CheckCircle,
  Package,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  Plus,
  Minus,
  Eye,
  ThumbsUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast-provider';
import { formatPrice } from '@/lib/utils';
import { productsApi, type Product } from '@/lib/api/products';
import { useCartStore } from '@/lib/stores/cart';
import { WishlistButton } from '@/components/ui/wishlist-button';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const toast = useToast();
  const { addItem } = useCartStore();

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string);
    }
  }, [params.id]);

  const fetchProduct = async (productId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productsApi.getProduct(productId);
      
      if (response.success) {
        setProduct(response.data);
        if (response.data.variants && response.data.variants.length > 0) {
          setSelectedVariant(response.data.variants[0].id);
        }
      } else {
        setError('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    const selectedVariantData = product.variants?.find(v => v.id === selectedVariant);
    const price = selectedVariantData?.price || product.price;
    const originalPrice = selectedVariantData?.originalPrice || product.originalPrice;

    addItem({
      id: product.id,
      type: 'product',
      name: product.name,
      price,
      originalPrice,
      image: product.images[0] || '/placeholder-product.jpg',
      provider: {
        id: product.supplier.id,
        name: product.supplier.name,
        location: product.supplier.location
      },
      category: product.category.name,
      inStock: selectedVariantData?.inStock ?? product.inStock
    });

    toast.success('Added to Cart', `${product.name} has been added to your cart`);
  };

  const handleContactSupplier = async () => {
    if (!product) return;
    
    try {
      await productsApi.contactSupplier(product.id, {
        subject: `Inquiry about ${product.name}`,
        message: `I'm interested in learning more about this product. Please provide additional details.`,
        quantity,
        contactInfo: {
          name: 'User Name', // In real app, get from auth
          email: 'user@example.com',
          phone: '+91-9934109996'
        }
      });
      
      toast.success('Message Sent', 'Your inquiry has been sent to the supplier');
    } catch (error) {
      console.error('Error contacting supplier:', error);
      toast.error('Error', 'Failed to send message');
    }
  };

  const handleRequestQuote = async () => {
    if (!product) return;
    
    try {
      await productsApi.requestQuote(product.id, {
        quantity,
        variantId: selectedVariant || undefined,
        deliveryLocation: 'Mumbai, Maharashtra',
        timeline: 'Within 30 days',
        contactInfo: {
          name: 'User Name',
          email: 'user@example.com',
          phone: '+91-9934109996'
        }
      });
      
      toast.success('Quote Requested', 'Your quote request has been submitted');
    } catch (error) {
      console.error('Error requesting quote:', error);
      toast.error('Error', 'Failed to request quote');
    }
  };

  const checkAvailability = async () => {
    if (!product) return;
    
    try {
      const response = await productsApi.checkAvailability(product.id, quantity, selectedVariant || undefined);
      
      if (response.success) {
        if (response.data.available) {
          toast.success('Available', `${quantity} units available for delivery by ${response.data.estimatedDelivery}`);
        } else {
          toast.error('Not Available', `Only ${response.data.maxQuantity} units available`);
        }
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      toast.error('Error', 'Failed to check availability');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-muted rounded h-8 w-48 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-muted rounded-lg h-96"></div>
              <div className="space-y-4">
                <div className="bg-muted rounded h-8 w-3/4"></div>
                <div className="bg-muted rounded h-4 w-1/2"></div>
                <div className="bg-muted rounded h-6 w-1/4"></div>
                <div className="bg-muted rounded h-32"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
            <p className="text-muted-foreground mb-8">{error}</p>
            <Link href="/products">
              <Button>Back to Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const selectedVariantData = product.variants?.find(v => v.id === selectedVariant);
  const currentPrice = selectedVariantData?.price || product.price;
  const currentOriginalPrice = selectedVariantData?.originalPrice || product.originalPrice;
  const currentStock = selectedVariantData?.inStock ?? product.inStock;
  const currentStockQuantity = selectedVariantData?.stockQuantity || product.stockQuantity;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <Link href="/products" className="text-primary hover:underline">
            Products
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link href={`/categories/${product.category.slug}`} className="text-primary hover:underline">
            {product.category.name}
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Images */}
          <div>
            <div className="relative mb-4">
              <Image
                src={product.images[selectedImageIndex] || '/placeholder-product.jpg'}
                alt={product.name}
                width={600}
                height={400}
                className="w-full h-96 object-cover rounded-lg"
              />
              
              {currentOriginalPrice && (
                <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                  {Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)}% OFF
                </Badge>
              )}

              {product.shippingInfo.freeShipping && (
                <Badge className="absolute top-4 right-4 bg-green-500 text-white">
                  <Truck className="h-3 w-3 mr-1" />
                  Free Shipping
                </Badge>
              )}

              <div className="absolute bottom-4 right-4 flex gap-2">
                <WishlistButton 
                  itemId={product.id} 
                  type="product" 
                  size="sm" 
                  variant="outline" 
                  className="bg-white/80 hover:bg-white"
                />
                <Button size="sm" variant="secondary" className="bg-white/80 hover:bg-white">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Image Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-16 rounded border-2 overflow-hidden ${
                      selectedImageIndex === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <Badge className="mb-2 bg-secondary text-secondary-foreground">
                {product.category.name}
              </Badge>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-muted-foreground">{product.shortDescription}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.reviews.average)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.reviews.average} ({product.reviews.total} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(currentPrice)}
                </span>
                {currentOriginalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(currentOriginalPrice)}
                  </span>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                Minimum Order: {product.minOrderQuantity} {product.unit}
                {product.maxOrderQuantity && ` • Maximum: ${product.maxOrderQuantity} ${product.unit}`}
              </div>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Available Options</h3>
                <div className="grid grid-cols-2 gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant.id)}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        selectedVariant === variant.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="font-medium">{variant.name}</div>
                      <div className="text-sm text-primary font-semibold">
                        {formatPrice(variant.price)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {variant.inStock ? `${variant.stockQuantity} available` : 'Out of stock'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(product.minOrderQuantity, quantity - 1))}
                    disabled={quantity <= product.minOrderQuantity}
                    className="h-10 w-10 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(currentStockQuantity, quantity + 1))}
                    disabled={quantity >= currentStockQuantity}
                    className="h-10 w-10 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  {currentStockQuantity} {product.unit} available
                </span>
              </div>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {currentStock ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">In Stock</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-6">
              <div className="flex gap-3">
                <Button
                  className="flex-1 btn-primary"
                  onClick={handleAddToCart}
                  disabled={!currentStock}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  onClick={checkAvailability}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Check Availability
                </Button>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleContactSupplier}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Supplier
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleRequestQuote}
                >
                  Request Quote
                </Button>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="h-4 w-4 text-primary" />
                <span className="font-medium">Shipping Information</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Estimated Delivery: {product.shippingInfo.estimatedDelivery}</div>
                <div>
                  Shipping Cost: {product.shippingInfo.freeShipping 
                    ? 'Free' 
                    : formatPrice(product.shippingInfo.shippingCost || 0)
                  }
                </div>
                <div>Available in: {product.shippingInfo.availableLocations.join(', ')}</div>
              </div>
            </div>

            {/* Supplier Info */}
            <div className="bg-card rounded-lg border p-4">
              <div className="flex items-start gap-3">
                <Image
                  src={product.supplier.avatar || product.supplier.logo || '/placeholder-avatar.jpg'}
                  alt={product.supplier.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Link href={`/suppliers/${product.supplier.id}`}>
                      <h4 className="font-medium hover:text-primary">{product.supplier.name}</h4>
                    </Link>
                    {product.supplier.verified && (
                      <Shield className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {product.supplier.location}
                    </div>
                    <div>{product.supplier.experience || 'Experienced supplier'} • {product.supplier.completedOrders || product.supplier.totalReviews}+ orders</div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Response time: {product.supplier.responseTime || 'Within 24 hours'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-8">
          <div className="border-b">
            <nav className="flex space-x-8">
              {['overview', 'specifications', 'reviews', 'shipping'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-6">
            {activeTab === 'overview' && (
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-4">Product Description</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {product.description}
                </p>
                
                <h4 className="font-semibold mb-3">Key Features</h4>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Technical Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b">
                      <span className="font-medium">{key}</span>
                      <span className="text-muted-foreground">{String(value)}</span>
                    </div>
                  ))}
                </div>
                
                {product.dimensions && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Dimensions</h4>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="font-semibold">{product.dimensions.length}</div>
                          <div className="text-sm text-muted-foreground">Length ({product.dimensions.unit || 'cm'})</div>
                        </div>
                        <div>
                          <div className="font-semibold">{product.dimensions.width}</div>
                          <div className="text-sm text-muted-foreground">Width ({product.dimensions.unit || 'cm'})</div>
                        </div>
                        <div>
                          <div className="font-semibold">{product.dimensions.height}</div>
                          <div className="text-sm text-muted-foreground">Height ({product.dimensions.unit || 'cm'})</div>
                        </div>
                      </div>
                      {product.weight && (
                        <div className="text-center mt-4 pt-4 border-t">
                          <div className="font-semibold">{product.weight} kg</div>
                          <div className="text-sm text-muted-foreground">Weight</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
                <div className="space-y-6">
                  {(product.reviews.list || []).map((review) => (
                    <div key={review.id} className="border-b pb-6">
                      <div className="flex items-start gap-4">
                        {review.userAvatar && (
                          <Image
                            src={review.userAvatar}
                            alt={review.userName}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < review.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="font-medium">{review.userName}</span>
                            {review.verified && (
                              <Badge className="text-xs bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                                Verified Purchase
                              </Badge>
                            )}
                            <span className="text-sm text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-muted-foreground mb-2">{review.comment}</p>
                          {review.images && review.images.length > 0 && (
                            <div className="flex gap-2 mb-2">
                              {review.images.map((image, index) => (
                                <Image
                                  key={index}
                                  src={image}
                                  alt={`Review image ${index + 1}`}
                                  width={60}
                                  height={60}
                                  className="w-15 h-15 object-cover rounded"
                                />
                              ))}
                            </div>
                          )}
                          <div className="flex items-center gap-4 text-sm">
                            <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                              <ThumbsUp className="h-3 w-3" />
                              Helpful ({review.helpful})
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Shipping & Returns</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Shipping Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-primary" />
                        <span>Estimated Delivery: {product.shippingInfo.estimatedDelivery}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-primary" />
                        <span>
                          Shipping Cost: {product.shippingInfo.freeShipping 
                            ? 'Free Shipping' 
                            : formatPrice(product.shippingInfo.shippingCost || 0)
                          }
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>Ships to: {product.shippingInfo.availableLocations.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Return Policy</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>{product.returnPolicy || 'Standard return policy applies'}</p>
                      {product.warranty && (
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-primary" />
                          <span>Warranty: {product.warranty}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {(product.certifications || []).length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Certifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {(product.certifications || []).map((cert) => (
                        <Badge key={cert} variant="outline" className="flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}