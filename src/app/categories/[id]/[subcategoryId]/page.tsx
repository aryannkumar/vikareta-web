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
  SlidersHorizontal,
  ChevronDown,
  Heart,
  ShoppingCart,
  Eye
} from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { getCategoryById, getSubcategoryBySlug, getSubcategoryProducts, getSubcategoryServices, type Category, type Subcategory } from '../../../../lib/api/categories';

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
  const [products, setProducts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalServices, setTotalServices] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const categoryId = params.id as string;
  const subcategoryId = params.subcategoryId as string;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // First fetch category by slug (the [id] param is actually a slug)
        const categoryData = await getCategoryById(categoryId);
        setCategory(categoryData);
        
        if (!categoryData) {
          setError('Category not found');
          return;
        }
        
        // Then fetch subcategory by slug (the [subcategoryId] param is actually a slug)
        const subcategoryData = await getSubcategoryBySlug(subcategoryId);
        setSubcategory(subcategoryData);
        
        if (!subcategoryData) {
          setError('Subcategory not found');
          return;
        }
        
        // Validate that subcategory belongs to the category
        if (subcategoryData.categoryId !== categoryData.id) {
          setError('Subcategory does not belong to this category');
          return;
        }
        
        // Fetch products and services for the subcategory
        const [productsData, servicesData] = await Promise.all([
          getSubcategoryProducts(subcategoryId, {
            page: 1,
            limit: 50,
            sortBy: sortBy,
            search: searchQuery || undefined
          }),
          getSubcategoryServices(subcategoryId, {
            page: 1,
            limit: 50,
            sortBy: sortBy,
            search: searchQuery || undefined
          })
        ]);
        
        if (productsData) {
          setProducts(productsData.products || []);
          setTotalProducts(productsData.total || 0);
        }
        
        if (servicesData) {
          setServices(servicesData.services || []);
          setTotalServices(servicesData.total || 0);
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load page data');
      } finally {
        setLoading(false);
      }
    }

    if (categoryId && subcategoryId) {
      fetchData();
    }
  }, [categoryId, subcategoryId, sortBy, searchQuery]);

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

  // Combine products and services for display
  const allItems = [
    ...products.map(p => ({ ...p, type: 'product' })),
    ...services.map(s => ({ ...s, type: 'service' }))
  ];

  const filteredItems = allItems.filter(item => {
    // Search filter
    if (searchQuery && !item.title?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Price range filter
    if (priceRange.min && item.price < parseInt(priceRange.min)) {
      return false;
    }
    if (priceRange.max && item.price > parseInt(priceRange.max)) {
      return false;
    }

    // Location filter
    const supplierLocation = item.seller?.city || item.provider?.city || '';
    if (selectedLocation && !supplierLocation.toLowerCase().includes(selectedLocation)) {
      return false;
    }

    // Verified suppliers only
    const isVerified = item.seller?.isVerified || item.provider?.isVerified;
    if (verifiedOnly && !isVerified) {
      return false;
    }

    return true;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.price || 0) - (b.price || 0);
      case 'price-high':
        return (b.price || 0) - (a.price || 0);
      case 'rating':
        return (b.reviews?.average || 0) - (a.reviews?.average || 0);
      case 'popular':
        return (b.reviews?.total || 0) - (a.reviews?.total || 0);
      case 'newest':
        return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
      default:
        // Relevance - by rating
        return (b.reviews?.average || 0) - (a.reviews?.average || 0);
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

  if (!loading && (error || !category || !subcategory)) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Subcategory Not Found</h2>
            <p className="text-muted-foreground mb-8">
              {error || 'The requested subcategory could not be found or does not belong to this category.'}
            </p>
            <Link href="/categories">
              <Button>Back to Categories</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Breadcrumb */}
        <nav className="flex items-center space-x-2 mb-6 text-sm">
          <Link 
            href="/categories" 
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:underline"
          >
            <Package className="w-4 h-4 mr-2" />
            Categories
          </Link>
          <span className="text-gray-400">/</span>
          <Link 
            href={`/categories/${categoryId}`} 
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:underline"
          >
            {category?.name || 'Category'}
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-semibold">{subcategory?.name || 'Subcategory'}</span>
        </nav>

        {/* Enhanced Back Button */}
        <div className="mb-6">
          <Link href={`/categories/${categoryId}`}>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {category?.name || 'Category'}
            </Button>
          </Link>
        </div>

        {/* Enhanced Subcategory Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50 rounded-3xl border border-violet-200/60 shadow-2xl shadow-violet-500/10 mb-12">
          {/* Enhanced Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-violet-200/40 via-transparent to-fuchsia-200/30"></div>
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-36 h-36 bg-gradient-to-br from-violet-400/30 to-fuchsia-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-44 h-44 bg-gradient-to-tr from-pink-400/20 to-violet-400/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-r from-fuchsia-400/15 to-pink-400/15 rounded-full blur-2xl opacity-70"></div>
          <div className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-gradient-to-l from-violet-400/15 to-indigo-400/15 rounded-full blur-2xl opacity-70"></div>
          
          <div className="relative p-8">
            <div className="flex items-start gap-6">
              {/* Enhanced Icon */}
              <div className="relative group">
                <div className="w-28 h-28 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-violet-500/30 transform -rotate-6 hover:rotate-0 hover:scale-110 transition-all duration-700 group-hover:shadow-3xl group-hover:shadow-fuchsia-500/40">
                  <Package className="h-14 w-14 text-white drop-shadow-xl" />
                </div>
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-4 border-white flex items-center justify-center shadow-xl animate-bounce">
                  <span className="text-white text-sm font-black">✓</span>
                </div>
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-400/30 to-fuchsia-400/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <Badge 
                    className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white border-0 font-bold px-4 py-2 rounded-2xl shadow-lg shadow-violet-500/30"
                  >
                    📂 {category?.name || 'Category'}
                  </Badge>
                </div>
                
                <h1 className="text-5xl font-black bg-gradient-to-r from-violet-900 via-fuchsia-800 to-pink-900 bg-clip-text text-transparent mb-6 leading-tight">
                  {subcategory?.name || 'Subcategory'}
                </h1>
                
                <div className="mb-8">
                  <p className="text-slate-600 text-xl leading-relaxed mb-4 max-w-3xl font-medium">
                    {subcategory?.description || `Find the best ${subcategory?.name?.toLowerCase()} from verified suppliers with competitive pricing and reliable service.`}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
                      Live catalog
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-fuchsia-500 rounded-full animate-pulse"></div>
                      Instant quotes
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                      Fast delivery
                    </span>
                  </div>
                </div>

                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="group bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-2xl shadow-violet-500/10 hover:shadow-3xl hover:shadow-violet-500/20 hover:-translate-y-3 hover:rotate-1 transition-all duration-500">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-violet-500/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                        <Package className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <div className="text-3xl font-black text-slate-900 mb-1 group-hover:text-violet-600 transition-colors duration-300">{(totalProducts + totalServices).toLocaleString()}</div>
                        <div className="text-sm text-slate-500 font-bold">📦 Total Items</div>
                      </div>
                    </div>
                  </div>

                  <div className="group bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-2xl shadow-emerald-500/10 hover:shadow-3xl hover:shadow-emerald-500/20 hover:-translate-y-3 hover:rotate-1 transition-all duration-500">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <div className="text-3xl font-black text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors duration-300">150+</div>
                        <div className="text-sm text-slate-500 font-bold">👥 Active Suppliers</div>
                      </div>
                    </div>
                  </div>

                  <div className="group bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-2xl shadow-amber-500/10 hover:shadow-3xl hover:shadow-amber-500/20 hover:-translate-y-3 hover:rotate-1 transition-all duration-500">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-500/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                        <TrendingUp className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <div className="text-3xl font-black text-slate-900 mb-1 group-hover:text-amber-600 transition-colors duration-300">4.5★</div>
                        <div className="text-sm text-slate-500 font-bold">⭐ Avg Rating</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="mb-12">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/60 shadow-2xl shadow-slate-500/10 p-8">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-4">
              <div className="flex flex-wrap gap-4 items-center">
                {/* Enhanced Search */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-400/20 to-fuchsia-400/20 rounded-2xl blur opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 h-6 w-6 z-10" />
                  <input
                    type="text"
                    placeholder="Search products and services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="relative w-96 pl-14 pr-6 py-4 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 bg-slate-50 hover:bg-white transition-all duration-300 text-lg font-medium placeholder:text-slate-400 shadow-lg"
                  />
                </div>

                {/* Enhanced Filters Toggle */}
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-3 border-2 border-slate-200 hover:bg-gradient-to-r hover:from-violet-50 hover:to-fuchsia-50 hover:border-violet-300 transition-all duration-300 px-6 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl"
                >
                  <SlidersHorizontal className="h-5 w-5" />
                  🔍 Filters
                  <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
                </Button>
              </div>

              <div className="flex items-center gap-4">
                {/* Enhanced Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* Enhanced View Mode */}
                <div className="flex border-2 border-slate-200 rounded-2xl overflow-hidden shadow-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={`rounded-none px-6 py-4 font-semibold transition-all duration-300 ${
                      viewMode === 'grid' 
                        ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-700 hover:to-fuchsia-700 shadow-lg' 
                        : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Grid className="h-5 w-5" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={`rounded-none px-6 py-4 font-semibold transition-all duration-300 ${
                      viewMode === 'list' 
                        ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-700 hover:to-fuchsia-700 shadow-lg' 
                        : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <List className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Enhanced Advanced Filters */}
            {showFilters && (
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Enhanced Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Price Range (₹)</label>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      />
                    </div>
                  </div>

                  {/* Enhanced Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Location</label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    >
                      {locationOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Enhanced Verified Suppliers */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Supplier Type</label>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        id="verified"
                        checked={verifiedOnly}
                        onChange={(e) => setVerifiedOnly(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="verified" className="text-sm flex items-center gap-2 font-medium text-gray-700">
                        <Shield className="h-4 w-4 text-green-600" />
                        Verified Only
                      </label>
                    </div>
                  </div>

                  {/* Enhanced Clear Filters */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">&nbsp;</label>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPriceRange({ min: '', max: '' });
                        setSelectedLocation('');
                        setVerifiedOnly(false);
                        setSearchQuery('');
                      }}
                      className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors duration-200 py-2"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Results Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {sortedItems.length} {sortedItems.length === 1 ? 'item' : 'items'} found
              </p>
              <p className="text-sm text-gray-500">
                in {subcategory?.name || 'this subcategory'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-500">
                {totalProducts} products • {totalServices} services
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Products/Services Grid */}
        {sortedItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Package className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No items found</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We couldn't find any products or services matching your criteria. Try adjusting your search terms or filters.
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => {
                    setPriceRange({ min: '', max: '' });
                    setSelectedLocation('');
                    setVerifiedOnly(false);
                    setSearchQuery('');
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 rounded-xl"
                >
                  Clear All Filters
                </Button>
                <div>
                  <Link href={`/categories/${categoryId}`}>
                    <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50">
                      Back to {category?.name}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
            : 'space-y-6'
          }>
            {sortedItems.map((item) => (
              <div
                key={item.id}
                className={`group relative bg-white/95 backdrop-blur-md rounded-3xl border-2 border-slate-200/60 shadow-2xl shadow-slate-500/10 hover:shadow-3xl hover:shadow-violet-500/20 transition-all duration-500 overflow-hidden ${
                  viewMode === 'list' ? 'flex items-center p-8 gap-8 hover:-translate-y-2 hover:rotate-1' : 'hover:-translate-y-4 hover:rotate-2'
                }`}
              >
                {/* Enhanced gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 via-fuchsia-500/0 to-pink-500/0 group-hover:from-violet-500/5 group-hover:via-fuchsia-500/5 group-hover:to-pink-500/5 transition-all duration-500 rounded-3xl"></div>
                
                <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-40 h-40 flex-shrink-0' : ''}`}>
                  <Image
                    src={item.images?.[0] || '/api/placeholder/300/200'}
                    alt={item.title}
                    width={viewMode === 'list' ? 160 : 300}
                    height={viewMode === 'list' ? 160 : 200}
                    className={`object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-2 ${
                      viewMode === 'list' ? 'w-40 h-40 rounded-2xl' : 'w-full h-56 rounded-t-3xl'
                    }`}
                  />

                  {/* Enhanced Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-3">
                    {item.originalPrice && (
                      <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-black px-3 py-2 rounded-2xl shadow-xl shadow-red-500/30">
                        💸 {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                      </Badge>
                    )}
                    {item.featured && (
                      <Badge className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 text-white text-sm font-black px-3 py-2 rounded-2xl shadow-xl shadow-amber-500/30 animate-pulse">
                        ⭐ Featured
                      </Badge>
                    )}
                  </div>
                  
                  {/* Enhanced Type Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className={`text-sm font-black px-4 py-2 rounded-2xl shadow-xl ${
                      item.type === 'product' 
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-blue-500/30' 
                        : 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-purple-500/30'
                    }`}>
                      {item.type === 'product' ? '📦 Product' : '🔧 Service'}
                    </Badge>
                  </div>

                  {/* Quick Actions for Grid View */}
                  {viewMode === 'grid' && (
                    <div className="absolute top-3 right-14 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0 rounded-lg shadow-md bg-white/90 backdrop-blur-sm">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0 rounded-lg shadow-md bg-white/90 backdrop-blur-sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className={`relative ${viewMode === 'list' ? 'flex-1' : 'p-6'}`}>
                  <Link href={`/${item.type === 'product' ? 'products' : 'services'}/${item.id}`}>
                    <h3 className="font-bold text-lg text-gray-900 mb-3 hover:text-blue-600 transition-colors line-clamp-2 group-hover:text-blue-600">
                      {item.title}
                    </h3>
                  </Link>

                  {/* Enhanced Rating and Reviews */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(item.reviews?.average || 0)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {(item.reviews?.average || 0).toFixed(1)} ({item.reviews?.total || 0} reviews)
                    </span>
                  </div>

                  {/* Enhanced Price */}
                  <div className="mb-4">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-2xl text-blue-600">
                        ₹{(item.price || 0).toLocaleString()}
                      </span>
                      {item.originalPrice && (
                        <span className="text-lg text-gray-400 line-through">
                          ₹{(item.originalPrice || 0).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Min Order: {item.minOrderQty || 1} {(item.minOrderQty || 1) === 1 ? 'piece' : 'pieces'}
                    </p>
                  </div>

                  {/* Enhanced Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.tags.slice(0, 2).map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Enhanced Supplier Info */}
                  <div className="mb-6">
                    {(item.seller || item.provider) && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <Link
                          href={`/suppliers/${(item.seller || item.provider).id}`}
                          className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-2 transition-colors"
                        >
                          {(item.seller || item.provider).businessName || (item.seller || item.provider).name}
                          {(item.seller || item.provider).isVerified && (
                            <Shield className="h-4 w-4 text-green-600" />
                          )}
                        </Link>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <MapPin className="h-4 w-4" />
                          <span>{(item.seller || item.provider).city}, {(item.seller || item.provider).state}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1 text-gray-500">
                            <Clock className="h-4 w-4" />
                            <span>Quick Response</span>
                          </div>
                          <Badge variant="outline" className="text-xs border-blue-200 text-blue-700 bg-blue-50">
                            {item.type === 'product' ? 'Seller' : 'Provider'}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Enhanced Action Buttons */}
                  <div className="flex gap-4">
                    <Link href={`/${item.type === 'product' ? 'products' : 'services'}/${item.id}`} className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white hover:from-violet-700 hover:via-fuchsia-700 hover:to-pink-700 shadow-2xl shadow-violet-500/30 hover:shadow-3xl hover:shadow-fuchsia-500/40 transition-all duration-500 py-4 rounded-2xl font-black text-lg hover:scale-105">
                        <Eye className="h-5 w-5 mr-3" />
                        🔍 View Details
                      </Button>
                    </Link>
                    {viewMode === 'list' && (
                      <Button variant="outline" className="px-6 border-2 border-slate-300 hover:bg-gradient-to-r hover:from-violet-50 hover:to-fuchsia-50 hover:border-violet-400 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl">
                        <ShoppingCart className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Enhanced Hover Border */}
                <div className="absolute inset-0 rounded-3xl border-4 border-transparent group-hover:border-gradient-to-r group-hover:from-violet-400 group-hover:via-fuchsia-400 group-hover:to-pink-400 transition-all duration-500 pointer-events-none"></div>
                <div className="absolute inset-0 rounded-3xl ring-4 ring-transparent group-hover:ring-violet-200/50 transition-all duration-500 pointer-events-none"></div>
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-400/0 to-fuchsia-400/0 group-hover:from-violet-400/10 group-hover:to-fuchsia-400/10 transition-all duration-500 pointer-events-none"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}