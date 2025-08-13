'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Grid,
  List,
  Star,
  MessageCircle,
  Heart,
  SlidersHorizontal,
  ChevronDown,
  Truck,
  Shield,
  AlertCircle,
  ShoppingCart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast-provider';
import { formatPrice } from '@/lib/utils';
import { productsApi, type Product, type ProductFilters } from '@/lib/api/products';
import { categoriesApi } from '@/lib/api/categories';
import { useCartStore } from '@/lib/stores/cart';
import { WishlistButton } from '@/components/ui/wishlist-button';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState<ProductFilters['sortBy']>('createdAt');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    inStock: false,
    freeShipping: false,
    verified: false,
    minRating: ''
  });

  const toast = useToast();
  const { addItem } = useCartStore();

  const sortOptions = [
    { value: 'createdAt', label: 'Newest First' },
    { value: 'price', label: 'Price' },
    { value: 'title', label: 'Name A-Z' },
    { value: 'stockQuantity', label: 'Stock Quantity' },
  ] as const;

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCategory, priceRange, sortBy, currentPage, filters]);

  const loadCategories = async () => {
    try {
      const response = await categoriesApi.getCategories();
      if (response.success) {
        setCategories(['All Categories', ...response.data.map(cat => cat.name)]);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const productFilters: ProductFilters = {
        page: currentPage,
        limit: 12,
        sortBy,
        ...(searchQuery && { search: searchQuery }),
        ...(selectedCategory && selectedCategory !== 'All Categories' && { category: selectedCategory }),
        ...(priceRange.min && { minPrice: parseInt(priceRange.min) }),
        ...(priceRange.max && { maxPrice: parseInt(priceRange.max) }),
        ...(filters.inStock && { inStock: true }),
        ...(filters.freeShipping && { freeShipping: true }),
        ...(filters.verified && { verified: true }),
        ...(filters.minRating && { rating: parseInt(filters.minRating) })
      };

      const response = await productsApi.getProducts(productFilters);
      
      if (response.success) {
        setProducts(response.data.products);
        setTotalPages(Math.ceil(response.data.total / 12));
      } else {
        setError('Failed to load products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      type: 'product',
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0] || '/placeholder-product.jpg',
      provider: {
        id: product.supplier.id,
        name: product.supplier.name,
        location: product.supplier.location
      },
      category: product.category.name,
      inStock: product.inStock
    });
    
    toast.success('Added to Cart', `${product.name} has been added to your cart`);
  };

  const handleContactSupplier = (product: Product) => {
    toast.info('Contact Supplier', `Redirecting to contact ${product.supplier.name}`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
    setFilters({
      inStock: false,
      freeShipping: false,
      verified: false,
      minRating: ''
    });
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Error Loading Products</h2>
            <p className="text-muted-foreground mb-8">{error}</p>
            <Button onClick={fetchProducts}>
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
          <h1 className="text-3xl font-bold mb-4">All Products</h1>
          <p className="text-muted-foreground">
            Discover quality products from verified suppliers across India
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search products, suppliers, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
              />
              <Button type="submit" className="absolute right-2 top-2 bottom-2 btn-primary">
                Search
              </Button>
            </div>
          </form>

          {/* Filter Bar */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Category Filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-background border rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {categories.map((category) => (
                    <option key={category} value={category === 'All Categories' ? '' : category}>
                      {category}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>

              {/* Price Range */}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  className="w-24 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                />
                <span className="text-muted-foreground">to</span>
                <input
                  type="number"
                  placeholder="Max Price"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  className="w-24 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                />
              </div>

              {/* Quick Filters */}
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                    className="rounded"
                  />
                  In Stock
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.freeShipping}
                    onChange={(e) => setFilters(prev => ({ ...prev, freeShipping: e.target.checked }))}
                    className="rounded"
                  />
                  Free Shipping
                </label>
              </div>

              {/* Advanced Filters Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                More Filters
              </Button>
            </div>

            <div className="flex items-center gap-4">
              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as ProductFilters['sortBy'])}
                  className="appearance-none bg-background border rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>

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
            <div className="mt-6 p-6 border rounded-lg bg-muted/30">
              <h3 className="font-semibold mb-4">Advanced Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Supplier Location</label>
                  <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background">
                    <option value="">All Locations</option>
                    <option value="mumbai">Mumbai</option>
                    <option value="delhi">Delhi</option>
                    <option value="bangalore">Bangalore</option>
                    <option value="chennai">Chennai</option>
                    <option value="kolkata">Kolkata</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Minimum Rating</label>
                  <select 
                    value={filters.minRating}
                    onChange={(e) => setFilters(prev => ({ ...prev, minRating: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  >
                    <option value="">Any Rating</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Supplier Type</label>
                  <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background">
                    <option value="">All Suppliers</option>
                    <option value="manufacturer">Manufacturer</option>
                    <option value="wholesaler">Wholesaler</option>
                    <option value="distributor">Distributor</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.verified}
                      onChange={(e) => setFilters(prev => ({ ...prev, verified: e.target.checked }))}
                      className="rounded"
                    />
                    Verified Suppliers Only
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">
            {loading ? 'Loading...' : `Showing ${products.length} products`}
          </p>
          
          {(searchQuery || selectedCategory || priceRange.min || priceRange.max || Object.values(filters).some(Boolean)) && (
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>

        {/* Products Grid/List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg h-48 mb-4"></div>
                <div className="bg-muted rounded h-4 mb-2"></div>
                <div className="bg-muted rounded h-4 w-2/3"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters
            </p>
            <Button onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6' 
              : 'space-y-4'
            }>
              {products.map((product) => (
                <div
                  key={product.id}
                  className={`bg-card rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 ${
                    viewMode === 'list' ? 'flex items-center p-6 gap-6' : 'card-hover'
                  }`}
                >
                  <div className={`relative ${viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : ''}`}>
                    <Image
                      src={product.images[0] || '/placeholder-product.jpg'}
                      alt={product.name}
                      width={viewMode === 'list' ? 128 : 300}
                      height={viewMode === 'list' ? 128 : 200}
                      className={`object-cover rounded-lg ${
                        viewMode === 'list' ? 'w-32 h-32' : 'w-full h-48'
                      }`}
                    />
                    
                    {product.originalPrice && (
                      <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </Badge>
                    )}

                    {product.shippingInfo.freeShipping && (
                      <Badge className="absolute top-2 right-2 bg-green-500 text-white">
                        <Truck className="h-3 w-3 mr-1" />
                        Free Ship
                      </Badge>
                    )}
                    
                    <WishlistButton 
                      itemId={product.id} 
                      type="product" 
                      size="sm" 
                      className="absolute bottom-2 right-2 bg-white/80 hover:bg-white w-8 h-8 p-0"
                    />
                  </div>

                  <div className={viewMode === 'list' ? 'flex-1' : 'p-4'}>
                    <div className="mb-2 flex items-center justify-between">
                      <Badge className="text-xs bg-secondary text-secondary-foreground">
                        {product.category.name}
                      </Badge>
                      {!product.inStock && (
                        <Badge variant="destructive" className="text-xs">
                          Out of Stock
                        </Badge>
                      )}
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
                      <div className="text-xs text-muted-foreground">
                        Min Order: {product.minOrderQuantity} {product.unit}
                      </div>
                    </div>

                    <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <Truck className="h-3 w-3" />
                      <span>{product.shippingInfo.estimatedDelivery}</span>
                    </div>

                    <div className="mb-3">
                      <Link
                        href={`/suppliers/${product.supplier.id}`}
                        className="text-xs text-primary hover:underline font-medium"
                      >
                        {product.supplier.name}
                        {product.supplier.verified && (
                          <Shield className="inline h-3 w-3 ml-1 text-green-600" />
                        )}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-muted-foreground">
                          {product.supplier.location}
                        </p>
                        <span className="text-xs text-muted-foreground">•</span>
                        <p className="text-xs text-muted-foreground">
                          {product.supplier.experience}
                        </p>
                      </div>
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
                      <Button
                        variant="outline"
                        className="text-sm px-3 py-2"
                        onClick={() => handleContactSupplier(product)}
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1 || loading}
                >
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        disabled={loading}
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages || loading}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}