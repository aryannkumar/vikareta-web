'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Grid,
  List,
  Star,
  MessageCircle,
  SlidersHorizontal,
  ChevronDown,
  Truck,
  Shield,
  AlertCircle,
  ShoppingCart,
  Award,
  Zap,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast-provider';
import { formatPrice } from '@/lib/utils';
import { productsApi, type Product, type ProductFilters } from '@/lib/api/products';
import { categoriesApi } from '@/lib/api/categories';
import { useCartStore } from '@/lib/stores/cart';
import { WishlistButton } from '@/components/ui/wishlist-button';

// Enhanced filter sidebar
const FilterSidebar = ({ 
  isOpen, 
  onClose, 
  filters: _filters, 
  onFiltersChange, 
  categories, 
  loading: _loading 
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: any;
  onFiltersChange: (filters: any) => void;
  categories: string[];
  loading: boolean;
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.aside
            className="fixed lg:sticky top-0 left-0 h-screen lg:h-auto w-80 bg-white shadow-xl z-50 lg:z-auto overflow-y-auto"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <div className="p-6 border-b lg:border-b-0">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-orange-600" />
                  Filters
                </h3>
                <button
                  onClick={onClose}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Category Filter */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-3"
                >
                  <h4 className="font-medium text-gray-900">Categories</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {categories.map((category, index) => (
                      <motion.label
                        key={index}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer"
                        whileHover={{ x: 4 }}
                      >
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700">{category}</span>
                      </motion.label>
                    ))}
                  </div>
                </motion.div>

                {/* Clear Filters */}
                <motion.button
                  onClick={() => onFiltersChange({})}
                  className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Clear All Filters
                </motion.button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

// Enhanced animated hero section
const ProductsHero = () => {
  return (
    <motion.section 
      className="relative bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-orange-200 rounded-full opacity-30"
          animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-16 h-16 bg-amber-200 rounded-full opacity-20"
          animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-1/3 w-24 h-24 bg-orange-100 rounded-full opacity-25"
          animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <TrendingUp className="w-4 h-4" />
              Premium B2B Products
            </motion.div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Discover
              <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent"> Quality </span>
              Products for Your Business
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Access thousands of verified suppliers and premium products. Build relationships that drive your business forward with enterprise-grade procurement solutions.
            </p>

            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex items-center gap-2 text-gray-700">
                <Shield className="w-5 h-5 text-orange-600" />
                <span className="font-medium">Verified Suppliers</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Award className="w-5 h-5 text-orange-600" />
                <span className="font-medium">Quality Assured</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Zap className="w-5 h-5 text-orange-600" />
                <span className="font-medium">Fast Delivery</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Floating product cards */}
            <div className="relative w-full h-96">
              <motion.div
                className="absolute top-0 left-0 bg-white rounded-xl shadow-lg p-4 w-48"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-full h-24 bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg mb-3"></div>
                <div className="h-2 bg-gray-200 rounded mb-2"></div>
                <div className="h-2 bg-gray-100 rounded w-3/4"></div>
              </motion.div>

              <motion.div
                className="absolute top-12 right-0 bg-white rounded-xl shadow-lg p-4 w-48"
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-full h-24 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg mb-3"></div>
                <div className="h-2 bg-gray-200 rounded mb-2"></div>
                <div className="h-2 bg-gray-100 rounded w-2/3"></div>
              </motion.div>

              <motion.div
                className="absolute bottom-0 left-1/4 bg-white rounded-xl shadow-lg p-4 w-48"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-full h-24 bg-gradient-to-r from-orange-200 to-amber-200 rounded-lg mb-3"></div>
                <div className="h-2 bg-gray-200 rounded mb-2"></div>
                <div className="h-2 bg-gray-100 rounded w-4/5"></div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

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
    <div className="min-h-screen bg-white">
      {/* Enhanced Hero Section */}
      <ProductsHero />

      <div className="container mx-auto px-6 py-12">
        {/* Enhanced Search and Filters Bar */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative max-w-4xl mx-auto">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  placeholder="Search products, suppliers, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-32 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 transition-all"
                />
                <Button 
                  type="submit" 
                  className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-6 rounded-lg transition-all"
                >
                  Search
                </Button>
              </div>
            </form>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <motion.button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  <Badge variant="secondary" className="ml-1">
                    {Object.values(filters).filter(Boolean).length}
                  </Badge>
                </motion.button>

                {/* Quick Filters */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'inStock' as keyof typeof filters, label: 'In Stock', icon: Shield },
                    { key: 'verified' as keyof typeof filters, label: 'Verified', icon: Award },
                    { key: 'freeShipping' as keyof typeof filters, label: 'Free Shipping', icon: Truck }
                  ].map(({ key, label, icon: Icon }) => (
                    <motion.button
                      key={key}
                      onClick={() => setFilters(prev => ({ ...prev, [key]: !prev[key] }))}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                        filters[key]
                          ? 'bg-orange-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>

                {/* View Toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Layout with Sidebar and Products */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <FilterSidebar
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
            filters={filters}
            onFiltersChange={setFilters}
            categories={categories}
            loading={loading}
          />

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {Array.from({ length: 9 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 bg-gray-100 rounded w-2/3 animate-pulse" />
                      <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse" />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : error ? (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <Button onClick={fetchProducts} className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700">
                  Try Again
                </Button>
              </motion.div>
            ) : products.length === 0 ? (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters</p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </motion.div>
            ) : (
              <>
                {/* Enhanced Products Grid */}
                <motion.div
                  className={`grid gap-6 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                      : 'grid-cols-1'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.1 }}
                >
                  {products.map((product, index) => (
                    <motion.div
                      key={product.id}
                      className={`group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                    >
                      {/* Product Image */}
                      <div className={`relative overflow-hidden ${
                        viewMode === 'list' ? 'w-48 h-48' : 'aspect-square'
                      }`}>
                        <Image
                          src={product.images?.[0] || '/placeholder-product.jpg'}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          {(product as any).featured && (
                            <Badge className="bg-gradient-to-r from-orange-600 to-amber-600 text-white border-0">
                              Featured
                            </Badge>
                          )}
                          {(product as any).discount && (
                            <Badge variant="destructive">
                              {(product as any).discount}% OFF
                            </Badge>
                          )}
                          {(product as any).verified && (
                            <Badge className="bg-green-600 text-white border-0">
                              <Shield className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>

                        {/* Wishlist Button */}
                        <div className="absolute top-3 right-3">
                          <WishlistButton
                            itemId={product.id}
                            type="product"
                            className="bg-white/80 hover:bg-white text-gray-700 shadow-sm"
                          />
                        </div>

                        {/* Quick Actions Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="flex gap-2">
                            <motion.button
                              onClick={() => handleAddToCart(product)}
                              className="bg-white text-gray-900 p-2 rounded-full hover:bg-orange-100 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <ShoppingCart className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                              onClick={() => handleContactSupplier(product)}
                              className="bg-white text-gray-900 p-2 rounded-full hover:bg-orange-100 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <MessageCircle className="w-5 h-5" />
                            </motion.button>
                          </div>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-6 flex-1">
                        {/* Supplier Info */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 bg-gradient-to-r from-orange-600 to-amber-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {product.supplier?.name?.charAt(0) || 'S'}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600">{product.supplier?.name}</span>
                          {product.supplier?.verified && (
                            <Badge variant="outline" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>

                        {/* Product Title */}
                        <Link 
                          href={`/products/${product.id}`}
                          className="block"
                        >
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                            {product.name}
                          </h3>
                        </Link>

                        {/* Category */}
                        <p className="text-sm text-gray-500 mb-3">{product.category?.name}</p>

                        {/* Rating */}
                        {(product as any).rating && (
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor((product as any).rating)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">
                              {(product as any).rating} ({(product as any).reviewCount || 0})
                            </span>
                          </div>
                        )}

                        {/* Price */}
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-2xl font-bold text-gray-900">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-lg text-gray-500 line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>

                        {/* Features */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {product.inStock && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              In Stock
                            </Badge>
                          )}
                          {(product as any).freeShipping && (
                            <Badge variant="outline" className="text-blue-600 border-blue-600">
                              <Truck className="w-3 h-3 mr-1" />
                              Free Shipping
                            </Badge>
                          )}
                          {(product as any).minOrderQuantity && (
                            <Badge variant="outline">
                              MOQ: {(product as any).minOrderQuantity}
                            </Badge>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className={`flex gap-2 ${viewMode === 'list' ? 'flex-col' : ''}`}>
                          <Button
                            onClick={() => handleAddToCart(product)}
                            className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white"
                            disabled={!product.inStock}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                          </Button>
                          <Button
                            onClick={() => handleContactSupplier(product)}
                            variant="outline"
                            className="border-orange-600 text-orange-600 hover:bg-orange-50"
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Contact
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Enhanced Pagination */}
                {totalPages > 1 && (
                  <motion.div
                    className="flex items-center justify-center gap-2 mt-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1 || loading}
                      className="hover:bg-orange-50 hover:border-orange-600 hover:text-orange-600"
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
                            className={currentPage === page 
                              ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white' 
                              : 'hover:bg-orange-50 hover:border-orange-600 hover:text-orange-600'
                            }
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
                      className="hover:bg-orange-50 hover:border-orange-600 hover:text-orange-600"
                    >
                      Next
                    </Button>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}