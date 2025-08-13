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
    { value: 'provider', label: 'Providers' }
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
        return `/providers/${result.id}`;
      default:
        return '#';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            Search Results
            {query && <span className="text-muted-foreground"> for "{query}"</span>}
          </h1>
          <p className="text-muted-foreground">
            Find products, services, and providers that match your needs
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
                placeholder="Search products, services, providers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-background"
              />
              <Button type="submit" className="absolute right-2 top-2 bottom-2 btn-primary">
                Search
              </Button>
            </div>
          </form>

          {/* Filter Bar */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Type Filter */}
              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="appearance-none bg-background border rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {resultTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>

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

              {/* Advanced Filters Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </div>

            <div className="flex items-center gap-4">
              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
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
                  <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background">
                    <option value="">Any Rating</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Verified Only</label>
                  <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background">
                    <option value="">All Results</option>
                    <option value="verified">Verified Only</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {loading ? 'Searching...' : `Found ${results.length} results`}
          </p>
        </div>

        {/* Results Grid/List */}
        {loading ? (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }>
            <LoadingSkeleton type={viewMode === 'grid' ? 'card' : 'list'} count={6} />
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters
            </p>
            <Button onClick={() => {
              setSearchQuery('');
              setSelectedType('');
              setSelectedCategory('');
              setPriceRange({ min: '', max: '' });
            }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }>
            {results.map((result) => (
              <div
                key={result.id}
                className={`bg-card rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 ${
                  viewMode === 'list' ? 'flex items-center p-6 gap-6' : 'card-hover'
                }`}
              >
                <div className={`relative ${viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : ''}`}>
                  {result.image && !result.image.includes('placeholder') ? (
                    <Image
                      src={result.image}
                      alt={result.name}
                      width={viewMode === 'list' ? 128 : 300}
                      height={viewMode === 'list' ? 128 : 200}
                      className={`object-cover rounded-lg ${
                        viewMode === 'list' ? 'w-32 h-32' : 'w-full h-48'
                      }`}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`${result.image && !result.image.includes('placeholder') ? 'hidden' : ''} ${
                    viewMode === 'list' ? 'w-32 h-32 rounded-lg' : 'w-full h-48 rounded-lg'
                  }`}>
                    <PlaceholderImage 
                      type={result.type} 
                      className={viewMode === 'list' ? 'w-32 h-32 rounded-lg' : 'w-full h-48 rounded-lg'} 
                    />
                  </div>
                  
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    <Badge className="bg-white/90 text-gray-700 text-xs">
                      {getResultIcon(result.type)}
                      <span className="ml-1 capitalize">{result.type}</span>
                    </Badge>
                  </div>
                  
                  {(result.type === 'product' || result.type === 'service') ? (
                    <WishlistButton 
                      itemId={result.id} 
                      type={result.type} 
                      size="sm" 
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white w-8 h-8 p-0"
                    />
                  ) : (
                    <Button className="absolute top-2 right-2 bg-white/80 hover:bg-white w-8 h-8 p-0">
                      <Heart className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className={viewMode === 'list' ? 'flex-1' : 'p-4'}>
                  <div className="mb-2 flex items-center justify-between">
                    <Badge className="text-xs bg-secondary text-secondary-foreground">
                      {result.category}
                    </Badge>
                  </div>

                  <Link href={getResultLink(result)}>
                    <h3 className="font-semibold text-sm mb-2 hover:text-primary transition-colors line-clamp-2">
                      {result.name}
                    </h3>
                  </Link>

                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {result.description}
                  </p>

                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(result.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({result.reviewCount})
                    </span>
                  </div>

                  {result.price && (
                    <div className="mb-2">
                      <span className="font-bold text-lg text-primary">
                        {formatPrice(result.price)}
                      </span>
                    </div>
                  )}

                  {result.provider && (
                    <div className="mb-3">
                      <Link
                        href={`/providers/${result.provider.id}`}
                        className="text-xs text-primary hover:underline font-medium"
                      >
                        {result.provider.name}
                        {result.provider.verified && (
                          <span className="ml-1 text-green-600">✓</span>
                        )}
                      </Link>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          {result.provider.location}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {result.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {result.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{result.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={getResultLink(result)} className="flex-1">
                      <Button className="w-full btn-primary text-sm px-3 py-2">
                        View Details
                      </Button>
                    </Link>
                    {result.provider && (
                      <Button variant="outline" className="text-sm px-3 py-2 hover:border-orange-500 hover:text-orange-600">
                        <MessageCircle className="h-4 w-4" />
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
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Search Results</h1>
            <p className="text-muted-foreground">Loading search results...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <LoadingSkeleton type="card" count={6} />
          </div>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}