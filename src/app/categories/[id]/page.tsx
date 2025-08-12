'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft,
  Search,
  Filter,
  Grid,
  List,
  Star,
  TrendingUp,
  Package,
  Users,
  Building,
  AlertCircle
} from 'lucide-react';
import { CategoryIcon } from '@/components/ui/dynamic-icon';
import { PlaceholderImage } from '@/components/ui/placeholder-image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast-provider';
import { formatPrice } from '@/lib/utils';
import { categoriesApi, type CategoryWithProducts } from '@/lib/api/categories';
import { useCartStore } from '@/lib/stores/cart';

interface CategoryProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  supplier: {
    id: string;
    name: string;
    location: string;
    verified: boolean;
  };
  subcategory: string;
  inStock: boolean;
}

export default function CategoryDetailPage() {
  const params = useParams();
  const [categoryData, setCategoryData] = useState<CategoryWithProducts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const toast = useToast();
  const { addItem } = useCartStore();

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' }
  ];

  const loadCategoryData = useCallback(async (categoryId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await categoriesApi.getCategoryWithProducts(categoryId, {
        search: searchQuery || undefined,
        sortBy: sortBy as any,
        page: 1,
        limit: 50
      });
      
      if (response) {
        setCategoryData(response);
      } else {
        setError('Category not found');
      }
    } catch (error) {
      console.error('Error loading category:', error);
      setError('Failed to load category data');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, sortBy, selectedSubcategory]);

  useEffect(() => {
    if (params.id) {
      loadCategoryData(params.id as string);
    }
  }, [params.id, loadCategoryData]);

  const filteredProducts = (categoryData?.products || []).filter(product => {
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedSubcategory && product.subcategory?.slug !== selectedSubcategory) {
      return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.reviews.average - a.reviews.average;
      case 'newest':
        return 0; // In real app, would sort by creation date
      default:
        return 0; // relevance
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-muted rounded h-8 w-48 mb-8"></div>
            <div className="bg-muted rounded-lg h-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-muted rounded-lg h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !categoryData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Category Not Found</h2>
            <p className="text-muted-foreground mb-8">{error}</p>
            <Link href="/categories">
              <Button>Back to Categories</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <Link href="/categories" className="text-primary hover:underline">
            Categories
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground">{categoryData.name}</span>
        </div>

        {/* Category Header */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <CategoryIcon category={categoryData} size={32} className="text-white" />
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-4">{categoryData.name}</h1>
              <p className="text-muted-foreground text-lg mb-6">
                {categoryData.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-semibold">{(categoryData.productCount || 0).toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Products</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-semibold">500+</div>
                    <div className="text-sm text-muted-foreground">Suppliers</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-semibold">50+</div>
                    <div className="text-sm text-muted-foreground">Cities</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subcategories */}
        {(categoryData.subcategories?.length || 0) > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Subcategories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryData.subcategories?.map((subcategory) => (
                <Link
                  key={subcategory.id}
                  href={`/categories/${categoryData.id}/${subcategory.id}`}
                  className="bg-card rounded-lg border p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold mb-2">{subcategory.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {subcategory.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {subcategory.productCount} products
                    </Badge>
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                />
              </div>

              {/* Subcategory Filter */}
              {(categoryData.subcategories?.length || 0) > 0 && (
                <select
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                >
                  <option value="">All Subcategories</option>
                  {categoryData.subcategories?.map((subcategory) => (
                    <option key={subcategory.id} value={subcategory.name}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* View Mode */}
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {sortedProducts.length} products
          </p>
        </div>

        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-8">
              Try adjusting your search or filters
            </p>
            <Button onClick={() => {
              setSearchQuery('');
              setSelectedSubcategory('');
            }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }>
            {sortedProducts.map((product) => (
              <div
                key={product.id}
                className={`bg-card rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 ${
                  viewMode === 'list' ? 'flex items-center p-6 gap-6' : 'card-hover'
                }`}
              >
                <div className={`relative ${viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : ''}`}>
                  {product.images && product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={viewMode === 'list' ? 128 : 300}
                      height={viewMode === 'list' ? 128 : 200}
                      className={`object-cover rounded-lg ${
                        viewMode === 'list' ? 'w-32 h-32' : 'w-full h-48'
                      }`}
                    />
                  ) : (
                    <PlaceholderImage
                      type="product"
                      className={`rounded-lg ${
                        viewMode === 'list' ? 'w-32 h-32' : 'w-full h-48'
                      }`}
                      size={viewMode === 'list' ? 128 : 200}
                    />
                  )}
                  
                  {product.originalPrice && (
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </Badge>
                  )}
                </div>

                <div className={viewMode === 'list' ? 'flex-1' : 'p-4'}>
                  <div className="mb-2">
                    <Badge variant="outline" className="text-xs">
                      {product.subcategory?.name || product.category.name}
                    </Badge>
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
                          className={`h-3 w-3 ${
                            i < Math.floor(product.reviews.average)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({product.reviews.total})
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
                  </div>

                  <div className="mb-3">
                    <Link
                      href={`/suppliers/${product.supplier.id}`}
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      {product.supplier.name}
                      {product.supplier.verified && (
                        <span className="ml-1 text-green-600">✓</span>
                      )}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {product.supplier.location}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/products/${product.id}`} className="flex-1">
                      <Button className="w-full btn-primary text-sm px-3 py-2">
                        View Details
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