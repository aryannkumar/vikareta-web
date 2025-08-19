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
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast-provider';
import { formatPrice } from '@/lib/utils';
import { servicesApi, type Service, type ServicesFilters } from '@/lib/api/services';
import { useCartStore } from '@/lib/stores/cart';
import { WishlistButton } from '@/components/ui/wishlist-button';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState<ServicesFilters['sortBy']>('createdAt');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const toast = useToast();
  const { addItem } = useCartStore();

  const serviceTypes = [
    { value: '', label: 'All Types' },
    { value: 'one-time', label: 'One-time' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'project-based', label: 'Project-based' }
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Newest First' },
    { value: 'price', label: 'Price' },
    { value: 'title', label: 'Name A-Z' },
    { value: 'rating', label: 'Highest Rated' },
  ] as const;

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    fetchServices();
  }, [searchQuery, selectedCategory, selectedServiceType, priceRange, sortBy, currentPage]);

  const loadCategories = async () => {
    try {
      const response = await servicesApi.getCategories();
      if (response.success) {
        setCategories(['All Categories', ...response.data]);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const fetchServices = async () => {
    setLoading(true);
    setError(null);

    try {
      const filters: ServicesFilters = {
        page: currentPage,
        limit: 12,
        sortBy,
        sortOrder: 'desc',
        ...(searchQuery && { search: searchQuery }),
        // Note: We would need categoryId (UUID) instead of category name
        // For now, removing category filter until we implement category name to ID mapping
        ...(selectedServiceType && { serviceType: selectedServiceType as 'one_time' | 'recurring' | 'subscription' }),
        ...(priceRange.min && { minPrice: parseInt(priceRange.min) }),
        ...(priceRange.max && { maxPrice: parseInt(priceRange.max) })
      };

      const response = await servicesApi.getServices(filters);

      if (response.success) {
        setServices(response.data.services);
        setTotalPages(Math.ceil(response.data.total / 12));
        setHasMore(response.data.hasMore);
      } else {
        setError('Failed to load services');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to load services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchServices();
  };

  const handleAddToCart = (service: Service) => {
    addItem({
      id: service.id,
      type: 'service',
      name: service.name,
      price: service.basePrice,
      originalPrice: service.originalPrice,
      image: service.images[0] || '/placeholder-service.jpg',
      provider: service.provider,
      category: service.category,
      inStock: service.available
    });

    toast.success('Added to Cart', `${service.name} has been added to your cart`);
  };

  const handleContactProvider = (service: Service) => {
    // In a real app, this would open a contact modal or redirect to contact page
    toast.info('Contact Business', `Redirecting to contact ${service.provider.name}`);
  };

  const getServiceTypeColor = (serviceType: string) => {
    switch (serviceType) {
      case 'one-time':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300';
      case 'monthly':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300';
      case 'project-based':
  return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedServiceType('');
    setPriceRange({ min: '', max: '' });
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Error Loading Services</h2>
            <p className="text-muted-foreground mb-8">{error}</p>
            <Button onClick={fetchServices}>
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
          <h1 className="text-3xl font-bold mb-4">All Services</h1>
          <p className="text-muted-foreground">
            Find professional services from verified businesses across India
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
                placeholder="Search services, businesses, skills..."
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

              {/* Service Type Filter */}
              <div className="relative">
                <select
                  value={selectedServiceType}
                  onChange={(e) => setSelectedServiceType(e.target.value)}
                  className="appearance-none bg-background border rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {serviceTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
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
                  onChange={(e) => setSortBy(e.target.value as ServicesFilters['sortBy'])}
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
                  <label className="block text-sm font-medium mb-2">Business Location</label>
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
                  <label className="block text-sm font-medium mb-2">Experience Level</label>
                  <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background">
                    <option value="">Any Experience</option>
                    <option value="5+">5+ Years</option>
                    <option value="3+">3+ Years</option>
                    <option value="1+">1+ Years</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">
            {loading ? 'Loading...' : `Showing ${services.length} services`}
          </p>

          {(searchQuery || selectedCategory || selectedServiceType || priceRange.min || priceRange.max) && (
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>

        {/* Services Grid/List */}
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
        ) : services.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No services found</h3>
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
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`bg-card rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 ${viewMode === 'list' ? 'flex items-center p-6 gap-6' : 'card-hover'
                    }`}
                >
                  <div className={`relative ${viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : ''}`}>
                    <Image
                      src={service.images[0] || '/placeholder-service.jpg'}
                      alt={service.name}
                      width={viewMode === 'list' ? 128 : 300}
                      height={viewMode === 'list' ? 128 : 200}
                      className={`object-cover rounded-lg ${viewMode === 'list' ? 'w-32 h-32' : 'w-full h-48'
                        }`}
                    />

                    {service.originalPrice && (
                      <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                        {Math.round(((service.originalPrice - service.basePrice) / service.originalPrice) * 100)}% OFF
                      </Badge>
                    )}

                    <WishlistButton 
                      itemId={service.id} 
                      type="service" 
                      size="sm" 
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white w-8 h-8 p-0"
                    />
                  </div>

                  <div className={viewMode === 'list' ? 'flex-1' : 'p-4'}>
                    <div className="mb-2 flex items-center justify-between">
                      <Badge className="text-xs bg-secondary text-secondary-foreground">
                        {service.category}
                      </Badge>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getServiceTypeColor(service.serviceType)}`}>
                        {service.serviceType.replace('-', ' ')}
                      </div>
                    </div>

                    <Link href={`/services/${service.id}`}>
                      <h3 className="font-semibold text-sm mb-2 hover:text-primary transition-colors line-clamp-2">
                        {service.name}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < Math.floor(service.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                              }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({service.reviewCount})
                      </span>
                    </div>

                    <div className="mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Starting at</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-primary">
                          {formatPrice(service.basePrice)}
                        </span>
                        {service.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(service.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Delivery: {service.deliveryTime}</span>
                    </div>

                    <div className="mb-3">
                      <Link
                        href={`/businesses/${service.provider.id}`}
                        className="text-xs text-primary hover:underline font-medium"
                      >
                {service.provider.name.replace('Provider', 'Business')}
                        {service.provider.verified && (
                          <span className="ml-1 text-green-600">✓</span>
                        )}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-muted-foreground">
                  {service.provider.location.replace('Provider', 'Business')}
                        </p>
                        <span className="text-xs text-muted-foreground">•</span>
                        <p className="text-xs text-muted-foreground">
                  {service.provider.experience.replace('Provider', 'Business')}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1 btn-primary text-sm px-3 py-2"
                        onClick={() => handleAddToCart(service)}
                        disabled={!service.available}
                      >
                        {service.available ? 'Add to Cart' : 'Unavailable'}
                      </Button>
                      <Button
                        variant="outline"
                        className="text-sm px-3 py-2"
                        onClick={() => handleContactProvider(service)}
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <Link href={`/services/${service.id}`}>
                        <Button variant="outline" className="text-sm px-3 py-2">
                          View
                        </Button>
                      </Link>
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