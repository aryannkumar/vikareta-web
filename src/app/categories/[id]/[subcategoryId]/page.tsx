'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Search,
  Grid,
  List,
  Star,
  Package,
  Users,
  AlertCircle,
  TrendingUp,
  MapPin,
  Shield,
  Clock,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  Heart,
  ShoppingCart,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getCategoryById, getSubcategoryById, type Category, type Subcategory } from '@/lib/api/categories';

export default function SubcategoryPage() {
  const params = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedLocation, setSelectedLocation] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null);

  const categoryId = params.id as string;
  const subcategoryId = params.subcategoryId as string;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [categoryData, subcategoryData] = await Promise.all([
          getCategoryById(categoryId),
          getSubcategoryById(subcategoryId)
        ]);
        
        setCategory(categoryData);
        setSubcategory(subcategoryData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (categoryId && subcategoryId) {
      fetchData();
    }
  }, [categoryId, subcategoryId]);

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Most Popular' }
  ];

  const locationOptions = [
    { value: '', label: 'All Locations' },
    { value: 'mumbai', label: 'Mumbai' },
    { value: 'delhi', label: 'Delhi NCR' },
    { value: 'bangalore', label: 'Bangalore' },
    { value: 'chennai', label: 'Chennai' },
    { value: 'pune', label: 'Pune' },
    { value: 'hyderabad', label: 'Hyderabad' },
    { value: 'kolkata', label: 'Kolkata' },
    { value: 'ahmedabad', label: 'Ahmedabad' }
  ];

  // Enhanced mock products for the subcategory
  const mockProducts = [
    {
      id: '1',
      name: 'Premium Laptop Computer - Intel i7, 16GB RAM, 512GB SSD',
      price: 45000,
      originalPrice: 50000,
      image: '/api/placeholder/300/200',
      rating: 4.5,
      reviewCount: 128,
      supplier: {
        id: 'supplier1',
        name: 'TechCorp Solutions',
        location: 'Mumbai, Maharashtra',
        verified: true,
        responseTime: '2 hours',
        businessType: 'Manufacturer'
      },
      inStock: true,
      minOrderQty: 1,
      tags: ['Fast Delivery', 'Warranty'],
      featured: true
    },
    {
      id: '2',
      name: 'Business Desktop PC - AMD Ryzen 5, 8GB RAM, 256GB SSD',
      price: 35000,
      image: '/api/placeholder/300/200',
      rating: 4.2,
      reviewCount: 89,
      supplier: {
        id: 'supplier2',
        name: 'Digital Systems Ltd',
        location: 'Delhi, NCR',
        verified: true,
        responseTime: '4 hours',
        businessType: 'Distributor'
      },
      inStock: true,
      minOrderQty: 5,
      tags: ['Bulk Orders', 'GST Invoice']
    },
    {
      id: '3',
      name: 'Gaming Laptop Pro - RTX 4060, Intel i7, 32GB RAM, 1TB SSD',
      price: 75000,
      originalPrice: 80000,
      image: '/api/placeholder/300/200',
      rating: 4.8,
      reviewCount: 256,
      supplier: {
        id: 'supplier3',
        name: 'Gaming Hub India',
        location: 'Bangalore, Karnataka',
        verified: true,
        responseTime: '1 hour',
        businessType: 'Retailer'
      },
      inStock: true,
      minOrderQty: 1,
      tags: ['Premium Quality', 'Extended Warranty'],
      featured: true
    },
    {
      id: '4',
      name: 'Workstation Desktop - Xeon Processor, 64GB RAM, 2TB SSD',
      price: 120000,
      originalPrice: 135000,
      image: '/api/placeholder/300/200',
      rating: 4.6,
      reviewCount: 67,
      supplier: {
        id: 'supplier4',
        name: 'Pro Systems Enterprise',
        location: 'Chennai, Tamil Nadu',
        verified: true,
        responseTime: '3 hours',
        businessType: 'Manufacturer'
      },
      inStock: true,
      minOrderQty: 1,
      tags: ['Professional Grade', 'Custom Config']
    },
    {
      id: '5',
      name: 'Budget Laptop - Celeron, 4GB RAM, 128GB SSD',
      price: 18000,
      image: '/api/placeholder/300/200',
      rating: 3.9,
      reviewCount: 234,
      supplier: {
        id: 'supplier5',
        name: 'Value Tech Solutions',
        location: 'Pune, Maharashtra',
        verified: false,
        responseTime: '6 hours',
        businessType: 'Distributor'
      },
      inStock: true,
      minOrderQty: 10,
      tags: ['Budget Friendly', 'Bulk Discount']
    },
    {
      id: '6',
      name: 'All-in-One Desktop - Touch Screen, Intel i5, 8GB RAM',
      price: 42000,
      image: '/api/placeholder/300/200',
      rating: 4.3,
      reviewCount: 156,
      supplier: {
        id: 'supplier6',
        name: 'Modern Computing Ltd',
        location: 'Hyderabad, Telangana',
        verified: true,
        responseTime: '2 hours',
        businessType: 'Manufacturer'
      },
      inStock: true,
      minOrderQty: 2,
      tags: ['Space Saving', 'Touch Screen']
    }
  ];

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

  if (!loading && (!category || !subcategory || subcategory.categoryId !== categoryId)) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Subcategory Not Found</h2>
            <p className="text-muted-foreground mb-8">
              The requested subcategory could not be found or does not belong to this category.
            </p>
            <Link href="/categories">
              <Button>Back to Categories</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filteredProducts = mockProducts.filter(product => {
    // Search filter
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Price range filter
    if (priceRange.min && product.price < parseInt(priceRange.min)) {
      return false;
    }
    if (priceRange.max && product.price > parseInt(priceRange.max)) {
      return false;
    }

    // Location filter
    if (selectedLocation && !product.supplier.location.toLowerCase().includes(selectedLocation)) {
      return false;
    }

    // Verified suppliers only
    if (verifiedOnly && !product.supplier.verified) {
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
        return b.rating - a.rating;
      case 'popular':
        return b.reviewCount - a.reviewCount;
      case 'newest':
        return new Date().getTime() - new Date().getTime(); // Mock newest
      default:
        // Relevance - featured products first, then by rating
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.rating - a.rating;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <Link href="/categories" className="text-primary hover:underline">
            Categories
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link href={`/categories/${categoryId}`} className="text-primary hover:underline">
            {category?.name || 'Category'}
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground">{subcategory?.name || 'Subcategory'}</span>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <Link href={`/categories/${categoryId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {category?.name || 'Category'}
            </Button>
          </Link>
        </div>

        {/* Subcategory Header */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Package className="h-8 w-8 text-white" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{category?.name || 'Category'}</Badge>
              </div>
              <h1 className="text-3xl font-bold mb-4">{subcategory?.name || 'Subcategory'}</h1>
              <p className="text-muted-foreground text-lg mb-6">
                {subcategory?.description || 'No description available'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-semibold">{subcategory?.productCount?.toLocaleString() || '0'}</div>
                    <div className="text-sm text-muted-foreground">Products</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-semibold">150+</div>
                    <div className="text-sm text-muted-foreground">Suppliers</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-semibold">4.5★</div>
                    <div className="text-sm text-muted-foreground">Avg Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-4">
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

              {/* Filters Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
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

          {/* Advanced Filters */}
          {showFilters && (
            <Card className="p-4 bg-muted/30">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium mb-2">Price Range (₹)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-background"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-background"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-background"
                  >
                    {locationOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Verified Suppliers */}
                <div>
                  <label className="block text-sm font-medium mb-2">Supplier Type</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="verified"
                      checked={verifiedOnly}
                      onChange={(e) => setVerifiedOnly(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="verified" className="text-sm flex items-center gap-1">
                      <Shield className="h-3 w-3 text-green-600" />
                      Verified Only
                    </label>
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setPriceRange({ min: '', max: '' });
                      setSelectedLocation('');
                      setVerifiedOnly(false);
                      setSearchQuery('');
                    }}
                    className="w-full"
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {sortedProducts.length} products in {subcategory?.name || 'this subcategory'}
          </p>
        </div>

        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-8">
              Try adjusting your search terms or filters
            </p>
            <Button onClick={() => {
              setSearchQuery('');
              setPriceRange({ min: '', max: '' });
              setSelectedLocation('');
              setVerifiedOnly(false);
            }}>
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
          }>
            {sortedProducts.map((product) => (
              <Card key={product.id} className="card-hover group relative overflow-hidden">
                <CardContent className={viewMode === 'list' ? 'flex items-center p-6 gap-6' : 'p-0'}>
                  <div className={`relative ${viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : ''}`}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={viewMode === 'list' ? 128 : 300}
                      height={viewMode === 'list' ? 128 : 200}
                      className={`object-cover transition-transform group-hover:scale-105 ${viewMode === 'list' ? 'w-32 h-32 rounded-lg' : 'w-full h-48 rounded-t-lg'
                        }`}
                    />

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.originalPrice && (
                        <Badge className="bg-red-500 text-white text-xs">
                          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                        </Badge>
                      )}
                      {product.featured && (
                        <Badge className="bg-orange-500 text-white text-xs">
                          Featured
                        </Badge>
                      )}
                    </div>

                    {/* Quick Actions */}
                    {viewMode === 'grid' && (
                      <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className={viewMode === 'list' ? 'flex-1' : 'p-4'}>
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-semibold text-sm mb-2 hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Rating and Reviews */}
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
                        {product.rating} ({product.reviewCount})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-primary">
                          ₹{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Min Order: {product.minOrderQty} {product.minOrderQty === 1 ? 'piece' : 'pieces'}
                      </p>
                    </div>

                    {/* Tags */}
                    {product.tags && product.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {product.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Supplier Info */}
                    <div className="mb-3">
                      <Link
                        href={`/suppliers/${product.supplier.id}`}
                        className="text-xs text-primary hover:underline font-medium flex items-center gap-1"
                      >
                        {product.supplier.name}
                        {product.supplier.verified && (
                          <Shield className="h-3 w-3 text-green-600" />
                        )}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{product.supplier.location}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Responds in {product.supplier.responseTime}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {product.supplier.businessType}
                        </Badge>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link href={`/products/${product.id}`} className="flex-1">
                        <Button className="w-full btn-primary text-sm px-3 py-2">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </Link>
                      {viewMode === 'list' && (
                        <Button variant="outline" size="sm" className="px-3">
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}