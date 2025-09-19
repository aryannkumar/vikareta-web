'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  X,
  Plus,
  Star,
  MapPin,
  Building2,
  Truck,
  Shield,
  Award,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Share2,
  Heart,
  ShoppingCart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast-provider';
import { formatPrice } from '@/lib/utils';
import { marketplaceApi } from '@/lib/api/marketplace';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  seller: {
    id: string;
    businessName: string;
    location: string;
    rating: number;
    verified: boolean;
  };
  category: {
    name: string;
  };
  stockQuantity: number;
  minOrderQuantity: number;
  deliveryTime: string;
  warranty: string;
  specifications: Record<string, any>;
  features: string[];
  rating: number;
  reviewCount: number;
}

export default function ComparePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);

  // Get product IDs from URL params
  const productIds = searchParams.get('ids')?.split(',') || [];

  useEffect(() => {
    if (productIds.length === 0) {
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productPromises = productIds.map(id =>
          marketplaceApi.getBusinessById(id)
        );

        const responses = await Promise.all(productPromises);
        const fetchedProducts = responses
          .filter(response => response.success && response.data)
          .map(response => response.data);

        setProducts(fetchedProducts);
      } catch (err: any) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [productIds]);

  const addProductToComparison = (productId: string) => {
    if (products.length >= 4) {
      toast.error('Maximum 4 products', 'You can compare up to 4 products at once');
      return;
    }

    if (products.some(p => p.id === productId)) {
      toast.info('Already added', 'This product is already in comparison');
      return;
    }

    const newIds = [...productIds, productId];
    const newUrl = `/compare?ids=${newIds.join(',')}`;
    router.push(newUrl);
  };

  const removeProductFromComparison = (productId: string) => {
    const newIds = productIds.filter(id => id !== productId);
    if (newIds.length === 0) {
      router.push('/marketplace');
    } else {
      const newUrl = `/compare?ids=${newIds.join(',')}`;
      router.push(newUrl);
    }
  };

  const clearComparison = () => {
    router.push('/marketplace');
  };

  const shareComparison = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Link copied', 'Comparison link copied to clipboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-sm border p-8 max-w-md">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Products</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link href="/marketplace">
              <Button>Back to Marketplace</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="mb-8">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Compare Products</h1>
              <p className="text-lg text-gray-600">
                Add products to compare their features, prices, and specifications
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-8 max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold mb-4">How to Compare Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h3 className="font-medium mb-2">Browse Products</h3>
                  <p className="text-sm text-gray-600">
                    Visit the marketplace and find products you're interested in
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <h3 className="font-medium mb-2">Add to Compare</h3>
                  <p className="text-sm text-gray-600">
                    Click the compare button on product cards to add them
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <h3 className="font-medium mb-2">Compare Features</h3>
                  <p className="text-sm text-gray-600">
                    View detailed comparison of prices, features, and ratings
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <Link href="/marketplace">
                  <Button size="lg" className="w-full">
                    <Building2 className="w-4 h-4 mr-2" />
                    Browse Products
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Link href="/marketplace" className="mr-4">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Marketplace
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Compare Products</h1>
                <p className="text-gray-600">Comparing {products.length} product{products.length !== 1 ? 's' : ''}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={shareComparison}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" onClick={clearComparison}>
                Clear All
              </Button>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold text-gray-900 w-64">Product</th>
                  {products.map((product) => (
                    <th key={product.id} className="p-4 text-center min-w-64">
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-red-100 hover:bg-red-200 text-red-600"
                          onClick={() => removeProductFromComparison(product.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                        <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Building2 className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                        <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2">
                          {product.title}
                        </h3>
                        <div className="flex items-center justify-center mb-2">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium ml-1">{product.rating}</span>
                          <span className="text-sm text-gray-500 ml-1">({product.reviewCount})</span>
                        </div>
                        <div className="text-lg font-bold text-blue-600 mb-3">
                          {formatPrice(product.price)}
                        </div>
                        <Link href={`/products/${product.id}`}>
                          <Button size="sm" className="w-full">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </th>
                  ))}
                  {products.length < 4 && (
                    <th className="p-4 text-center min-w-64">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                        <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Add Product</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => setShowAddProduct(true)}
                        >
                          Browse Products
                        </Button>
                      </div>
                    </th>
                  )}
                </tr>
              </thead>

              <tbody>
                {/* Price */}
                <tr className="border-b">
                  <td className="p-4 font-medium text-gray-900">Price</td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {formatPrice(product.price)}
                      </div>
                      <div className="text-sm text-gray-500">{product.currency}</div>
                    </td>
                  ))}
                  {products.length < 4 && <td className="p-4"></td>}
                </tr>

                {/* Seller */}
                <tr className="border-b">
                  <td className="p-4 font-medium text-gray-900">Seller</td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <span className="font-medium text-gray-900">{product.seller.businessName}</span>
                        {product.seller.verified && (
                          <Badge className="ml-2 bg-green-100 text-green-800">
                            <Award className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-center text-sm text-gray-600">
                        <MapPin className="w-3 h-3 mr-1" />
                        {product.seller.location}
                      </div>
                      <div className="flex items-center justify-center mt-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm ml-1">{product.seller.rating}</span>
                      </div>
                    </td>
                  ))}
                  {products.length < 4 && <td className="p-4"></td>}
                </tr>

                {/* Stock & MOQ */}
                <tr className="border-b">
                  <td className="p-4 font-medium text-gray-900">Stock & MOQ</td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          Stock: {product.stockQuantity}
                        </div>
                        <div className="text-gray-600">
                          Min Order: {product.minOrderQuantity}
                        </div>
                      </div>
                    </td>
                  ))}
                  {products.length < 4 && <td className="p-4"></td>}
                </tr>

                {/* Delivery Time */}
                <tr className="border-b">
                  <td className="p-4 font-medium text-gray-900">Delivery Time</td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <div className="flex items-center justify-center text-sm text-gray-600">
                        <Truck className="w-4 h-4 mr-1" />
                        {product.deliveryTime}
                      </div>
                    </td>
                  ))}
                  {products.length < 4 && <td className="p-4"></td>}
                </tr>

                {/* Warranty */}
                <tr className="border-b">
                  <td className="p-4 font-medium text-gray-900">Warranty</td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <div className="text-sm text-gray-600">
                        {product.warranty || 'Not specified'}
                      </div>
                    </td>
                  ))}
                  {products.length < 4 && <td className="p-4"></td>}
                </tr>

                {/* Key Features */}
                <tr className="border-b">
                  <td className="p-4 font-medium text-gray-900">Key Features</td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4">
                      <div className="space-y-1">
                        {product.features?.slice(0, 3).map((feature, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                        {product.features?.length > 3 && (
                          <div className="text-sm text-gray-500">
                            +{product.features.length - 3} more
                          </div>
                        )}
                      </div>
                    </td>
                  ))}
                  {products.length < 4 && <td className="p-4"></td>}
                </tr>

                {/* Actions */}
                <tr>
                  <td className="p-4 font-medium text-gray-900">Actions</td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <div className="space-y-2">
                        <Link href={`/products/${product.id}`}>
                          <Button size="sm" className="w-full">
                            <Building2 className="w-3 h-3 mr-1" />
                            View Details
                          </Button>
                        </Link>
                        <Button size="sm" variant="outline" className="w-full">
                          <ShoppingCart className="w-3 h-3 mr-1" />
                          Add to Cart
                        </Button>
                        <Button size="sm" variant="outline" className="w-full">
                          <Heart className="w-3 h-3 mr-1" />
                          Save
                        </Button>
                      </div>
                    </td>
                  ))}
                  {products.length < 4 && <td className="p-4"></td>}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Specifications Comparison */}
        {products.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Specifications Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium text-gray-900">Specification</th>
                    {products.map((product) => (
                      <th key={product.id} className="p-3 text-center font-medium text-gray-900">
                        {product.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Get all unique specification keys */}
                  {Array.from(
                    new Set(
                      products.flatMap(product =>
                        Object.keys(product.specifications || {})
                      )
                    )
                  ).map((specKey) => (
                    <tr key={specKey} className="border-b">
                      <td className="p-3 font-medium text-gray-700 capitalize">
                        {specKey.replace(/([A-Z])/g, ' $1').trim()}
                      </td>
                      {products.map((product) => (
                        <td key={product.id} className="p-3 text-center text-sm">
                          {product.specifications?.[specKey] || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Add Product to Compare</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddProduct(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="text-center py-8">
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Browse products from the marketplace to add to comparison
                  </p>
                  <Link href="/marketplace">
                    <Button>
                      Browse Products
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}