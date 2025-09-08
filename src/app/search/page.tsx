'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceholderImage } from '@/components/ui/placeholder-image';
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  MessageCircle,
  Heart,
  SlidersHorizontal,
  ChevronDown,
  Clock,
  MapPin,
  Package,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast-provider';
import { formatPrice } from '@/lib/utils';
import { searchApi, type SearchResult, type SearchFilters } from '@/lib/api/search';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { WishlistButton } from '@/components/ui/wishlist-button';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(query);
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState<SearchFilters['sortBy']>('createdAt');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const toast = useToast();

  const resultTypes = [
    { value: '', label: 'All Results' },
    { value: 'product', label: 'Products' },
    { value: 'service', label: 'Services' },
    { value: 'provider', label: 'Businesses' }
  ];

  const categories = [
    'All Categories',
    'IT Services',
    'Digital Marketing',
    'Design & Creative',
    'Business Consulting',
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Industrial Equipment'
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Newest First' },
    { value: 'price', label: 'Price' },
    { value: 'title', label: 'Name A-Z' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      performSearch();
    }
  }, [query]);

  useEffect(() => {
    if (searchQuery) {
      performSearch();
    }
  }, [selectedType, selectedCategory, priceRange, sortBy]);

  const performSearch = async () => {
    if (!searchQuery.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const filters: SearchFilters = {
        query: searchQuery,
        page: currentPage,
        limit: 12,
        sortBy,
        ...(selectedType && { type: selectedType as any }),
        ...(selectedCategory && selectedCategory !== 'All Categories' && { category: selectedCategory }),
        ...(priceRange.min && { minPrice: parseInt(priceRange.min) }),
        ...(priceRange.max && { maxPrice: parseInt(priceRange.max) })
      };

      const response = await searchApi.search(filters);

      if (response.success) {
        setResults(response.data.results || []);
        setTotalResults(response.data.total || 0);
        setTotalPages(Math.ceil((response.data.total || 0) / 12));

        // Save search for analytics
        try {
          await searchApi.saveSearch(searchQuery, response.data.total || 0);
        } catch (analyticsError) {
          // Don't fail the search if analytics fails
          console.warn('Failed to save search analytics:', analyticsError);
        }
      } else {
        // If search API fails, try fallback search across products and services
        await performFallbackSearch();
      }
    } catch (error) {
      console.error('Error performing search:', error);
      // Try fallback search
      await performFallbackSearch();
    } finally {
      setLoading(false);
    }
  };

  const performFallbackSearch = async () => {
    try {
      const [productsApi, servicesApi] = await Promise.all([
        import('@/lib/api/products'),
        import('@/lib/api/services')
      ]);

      const [productsResponse, servicesResponse] = await Promise.all([
        productsApi.productsApi.searchProducts(searchQuery, { limit: 6 }),
        servicesApi.servicesApi.searchServices(searchQuery, { limit: 6 })
      ]);

      const fallbackResults: SearchResult[] = [];

      // Add products to results
      if (productsResponse.success && productsResponse.data.products) {
        const productResults = productsResponse.data.products.map(product => ({
          id: product.id,
          type: 'product' as const,
          name: product.name,
          description: product.shortDescription || product.description,
          price: product.price,
          image: product.images[0] || '/img/placeholder-product.jpg',
          rating: product.reviews.average,
          reviewCount: product.reviews.total,
          provider: {
            id: product.supplier.id,
            name: product.supplier.name,
            location: product.supplier.location,
            verified: product.supplier.verified
          },
          category: product.category.name,
          tags: product.tags,
          relevanceScore: 1
        }));
        fallbackResults.push(...productResults);
      }

      // Add services to results
      if (servicesResponse.success && servicesResponse.data.services) {
        const serviceResults = servicesResponse.data.services.map(service => ({
          id: service.id,
          type: 'service' as const,
          name: service.name,
          description: service.description,
          price: service.basePrice,
          image: service.images[0] || '/img/placeholder-service.jpg',
          rating: service.rating,
          reviewCount: service.reviewCount,
          provider: {
            id: service.provider.id,
            name: service.provider.name,
            location: service.provider.location,
            verified: service.provider.verified
          },
          category: service.category,
          tags: service.tags,
          relevanceScore: 1
        }));
        fallbackResults.push(...serviceResults);
      }

      setResults(fallbackResults);
      setTotalResults(fallbackResults.length);
      setTotalPages(Math.ceil(fallbackResults.length / 12));

      if (fallbackResults.length === 0) {
        setError('No results found for your search.');
      }
    } catch (fallbackError) {
      console.error('Fallback search failed:', fallbackError);
      setError('Search failed. Please try again.');
      setResults([]);
      setTotalResults(0);
      setTotalPages(1);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'product':
        return <Package className="h-4 w-4" />;
      case 'service':
        return <Clock className="h-4 w-4" />;
      case 'provider':
        return <Users className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getResultLink = (result: SearchResult) => {
    switch (result.type) {
      case 'product':
        return `/products/${result.id}`;
      case 'service':
        return `/services/${result.id}`;
      case 'provider':
        return `/businesses/${result.id}`;
      default:
        return '#';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative min-h-screen px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 lg:mb-4 text-gray-900 leading-tight">
              Search Results
              {query && <span className="text-gray-600 font-normal text-lg sm:text-xl md:text-2xl lg:text-3xl"> for "{query}"</span>}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
              Find products, services, and businesses that match your needs
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 sm:mb-8">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-4 sm:mb-6">
              <div className="relative max-w-2xl mx-auto lg:mx-0">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 sm:h-5 sm:w-5" />
                <input
                  type="text"
                  placeholder="Search products, services, businesses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-16 sm:pr-20 lg:pr-24 py-3 sm:py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-sm sm:text-base lg:text-lg shadow-sm"
                />
                <Button type="submit" className="absolute right-2 top-2 bottom-2 btn-primary px-3 sm:px-4 lg:px-6 text-sm sm:text-base lg:text-lg h-auto">
                  <span className="hidden sm:inline lg:inline">Search</span>
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 sm:hidden lg:hidden" />
                </Button>
              </div>
            </form>

            {/* Filter Bar */}
            <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:gap-4 lg:items-center lg:justify-between">
              <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:flex-wrap sm:gap-3 lg:gap-4 lg:items-center">
                {/* Type Filter */}
                <div className="relative min-w-0 flex-1 sm:flex-initial">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="appearance-none bg-background border rounded-lg px-3 sm:px-4 py-2.5 sm:py-2 pr-8 sm:pr-10 focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-auto text-sm sm:text-base min-w-[140px] sm:min-w-[160px]"
                  >
                    {resultTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground pointer-events-none" />
                </div>

                {/* Category Filter */}
                <div className="relative min-w-0 flex-1 sm:flex-initial">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="appearance-none bg-background border rounded-lg px-3 sm:px-4 py-2.5 sm:py-2 pr-8 sm:pr-10 focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-auto text-sm sm:text-base min-w-[140px] sm:min-w-[160px]"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category === 'All Categories' ? '' : category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground pointer-events-none" />
                </div>

                {/* Price Range */}
                <div className="flex items-center gap-2 w-full sm:w-auto min-w-0">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="flex-1 sm:flex-initial sm:w-20 px-3 py-2.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-sm sm:text-base min-w-[80px]"
                  />
                  <span className="text-muted-foreground text-sm sm:text-base px-1">to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="flex-1 sm:flex-initial sm:w-20 px-3 py-2.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-sm sm:text-base min-w-[80px]"
                  />
                </div>

                {/* Advanced Filters Toggle */}
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 w-full sm:w-auto justify-center min-h-[44px] sm:min-h-[40px] px-4 py-2.5 sm:py-2 text-sm sm:text-base"
                >
                  <SlidersHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Filters</span>
                </Button>
              </div>

              <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-4">
                {/* Sort */}
                <div className="relative min-w-0 flex-1 sm:flex-initial">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="appearance-none bg-background border rounded-lg px-3 sm:px-4 py-2.5 sm:py-2 pr-8 sm:pr-10 focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-auto text-sm sm:text-base min-w-[120px] sm:min-w-[140px]"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground pointer-events-none" />
                </div>

                {/* View Mode */}
                <div className="flex border rounded-lg bg-background min-h-[44px] sm:min-h-[40px]">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none px-3 sm:px-4 py-2.5 sm:py-2 min-h-[44px] sm:min-h-[40px]"
                  >
                    <Grid className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none px-3 sm:px-4 py-2.5 sm:py-2 min-h-[44px] sm:min-h-[40px]"
                  >
                    <List className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 sm:mt-6 p-4 sm:p-6 border rounded-lg bg-muted/30">
                <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base lg:text-lg">Advanced Filters</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm sm:text-base font-medium mb-2">Location</label>
                    <select className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-sm sm:text-base min-h-[44px]">
                      <option value="">All Locations</option>
                      <option value="mumbai">Mumbai</option>
                      <option value="delhi">Delhi</option>
                      <option value="bangalore">Bangalore</option>
                      <option value="chennai">Chennai</option>
                      <option value="kolkata">Kolkata</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm sm:text-base font-medium mb-2">Minimum Rating</label>
                    <select className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-sm sm:text-base min-h-[44px]">
                      <option value="">Any Rating</option>
                      <option value="4.5">4.5+ Stars</option>
                      <option value="4">4+ Stars</option>
                      <option value="3">3+ Stars</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm sm:text-base font-medium mb-2">Verified Only</label>
                    <select className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-sm sm:text-base min-h-[44px]">
                      <option value="">All Results</option>
                      <option value="verified">Verified Only</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="mb-4 sm:mb-6">
            <p className="text-sm sm:text-base text-muted-foreground">
              {loading ? 'Searching...' : `Found ${results.length} results`}
            </p>
          </div>

          {/* Results Grid/List */}
          {loading ? (
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'
              : 'space-y-4 sm:space-y-6'
            }>
              <LoadingSkeleton type={viewMode === 'grid' ? 'card' : 'list'} count={6} />
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8 sm:py-12 lg:py-16 px-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-6 w-6 sm:h-8 sm:w-8 lg:h-12 lg:w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg max-w-md mx-auto">
                Try adjusting your search terms or filters
              </p>
              <Button onClick={() => {
                setSearchQuery('');
                setSelectedType('');
                setSelectedCategory('');
                setPriceRange({ min: '', max: '' });
              }} className="text-sm sm:text-base lg:text-lg px-4 sm:px-6 py-2 sm:py-3 min-h-[44px]">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'
              : 'space-y-4 sm:space-y-6'
            }>
              {results.map((result) => (
                <div
                  key={result.id}
                  className={`bg-card rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 ${
                    viewMode === 'list' ? 'flex flex-col sm:flex-row items-start p-4 sm:p-6 gap-4 sm:gap-6' : 'card-hover p-4 sm:p-6'
                  }`}
                >
                  <div className={`relative ${viewMode === 'list' ? 'w-full sm:w-32 lg:w-40 h-48 sm:h-32 lg:h-40 flex-shrink-0' : 'w-full mb-4'}`}>
                    {result.image && !result.image.includes('placeholder') ? (
                      <Image
                        src={result.image}
                        alt={result.name}
                        width={viewMode === 'list' ? 160 : 300}
                        height={viewMode === 'list' ? 160 : 200}
                        className={`object-cover rounded-lg ${
                          viewMode === 'list' ? 'w-full h-48 sm:h-32 lg:h-40' : 'w-full h-40 sm:h-48 lg:h-56'
                        }`}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`${result.image && !result.image.includes('placeholder') ? 'hidden' : ''} ${
                      viewMode === 'list' ? 'w-full h-48 sm:h-32 lg:h-40 rounded-lg' : 'w-full h-40 sm:h-48 lg:h-56 rounded-lg'
                    }`}>
                      <PlaceholderImage
                        type={result.type}
                        className={viewMode === 'list' ? 'w-full h-48 sm:h-32 lg:h-40 rounded-lg' : 'w-full h-40 sm:h-48 lg:h-56 rounded-lg'}
                      />
                    </div>

                    <div className="absolute top-2 left-2 flex items-center gap-1">
                      <Badge className="bg-white/90 text-gray-700 text-xs px-2 py-1">
                        {getResultIcon(result.type)}
                        <span className="ml-1 capitalize">{result.type}</span>
                      </Badge>
                    </div>

                    {(result.type === 'product' || result.type === 'service') ? (
                      <WishlistButton
                        itemId={result.id}
                        type={result.type}
                        size="sm"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white w-8 h-8 sm:w-9 sm:h-9 p-0"
                      />
                    ) : (
                      <Button className="absolute top-2 right-2 bg-white/80 hover:bg-white w-8 h-8 sm:w-9 sm:h-9 p-0">
                        <Heart className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className={viewMode === 'list' ? 'flex-1 min-w-0' : ''}>
                    <div className="mb-2 sm:mb-3 flex items-center justify-between">
                      <Badge className="text-xs bg-secondary text-secondary-foreground px-2 py-1">
                        {result.category}
                      </Badge>
                    </div>

                    <Link href={getResultLink(result)}>
                      <h3 className="font-semibold text-sm sm:text-base lg:text-lg mb-2 hover:text-primary transition-colors line-clamp-2 leading-tight">
                        {result.name}
                      </h3>
                    </Link>

                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 line-clamp-2 leading-relaxed">
                      {result.description}
                    </p>

                    <div className="flex items-center gap-1 mb-2 sm:mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 sm:h-4 sm:w-4 ${
                              i < Math.floor(result.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        ({result.reviewCount})
                      </span>
                    </div>

                    {result.price && (
                      <div className="mb-2 sm:mb-3">
                        <span className="font-bold text-base sm:text-lg lg:text-xl text-primary">
                          {formatPrice(result.price)}
                        </span>
                      </div>
                    )}

                    {result.provider && (
                      <div className="mb-3 sm:mb-4">
                        <Link
                          href={`/businesses/${result.provider.id}`}
                          className="text-xs sm:text-sm text-primary hover:underline font-medium"
                        >
                          {result.provider.name}
                          {result.provider.verified && (
                            <span className="ml-1 text-green-600">✓</span>
                          )}
                        </Link>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {result.provider.location}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    <div className="mb-3 sm:mb-4">
                      <div className="flex flex-wrap gap-1">
                        {result.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs px-2 py-1">
                            {tag}
                          </Badge>
                        ))}
                        {result.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs px-2 py-1">
                            +{result.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 sm:mt-4">
                      <Link href={getResultLink(result)} className="flex-1">
                        <Button className="w-full btn-primary text-xs sm:text-sm lg:text-base px-3 sm:px-4 py-2 sm:py-3 h-9 sm:h-10 lg:h-11">
                          View Details
                        </Button>
                      </Link>
                      {result.provider && (
                        <Button variant="outline" className="w-full sm:w-auto text-xs sm:text-sm lg:text-base px-3 sm:px-4 py-2 sm:py-3 h-9 sm:h-10 lg:h-11 hover:border-blue-500 hover:text-blue-600">
                          <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">Contact</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-full blur-3xl"></div>
        </div>
        <div className="relative min-h-screen px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-6 sm:mb-8 lg:mb-12">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 lg:mb-4 text-gray-900">
                Search Results
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600">
                Loading search results...
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              <LoadingSkeleton type="card" count={8} />
            </div>
          </div>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
