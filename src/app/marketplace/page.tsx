'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceholderImage } from '@/components/ui/placeholder-image';
import { 
  TrendingUp, 
  MapPin, 
  Star, 
  Heart, 
  ShoppingCart, 
  MessageCircle,
  Filter,
  Grid,
  List,
  Clock,
  Users,
  Package,
  Sparkles,
  Crown,
  Award,
  Eye,
  ThumbsUp,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/toast-provider';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/lib/stores/cart';
import { marketplaceApi, type TrendingItem, type NearbyBusiness } from '@/lib/api/marketplace';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { WishlistButton } from '@/components/ui/wishlist-button';

export default function MarketplacePage() {
  const [trendingProducts, setTrendingProducts] = useState<TrendingItem[]>([]);
  const [trendingServices, setTrendingServices] = useState<TrendingItem[]>([]);
  const [nearbyBusinesses, setNearbyBusinesses] = useState<NearbyBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('trending');

  const { addItem } = useCartStore();
  const toast = useToast();

  const locations = [
    'All Locations',
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Chennai',
    'Kolkata',
    'Pune',
    'Hyderabad',
    'Ahmedabad',
    'Jaipur'
  ];

  const categories = [
    'All Categories',
    'Electronics',
    'Fashion',
    'Home & Garden',
    'IT Services',
    'Digital Marketing',
    'Business Consulting',
    'Manufacturing',
    'Food & Beverage',
    'Healthcare'
  ];

  const fetchMarketplaceData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = {
        location: selectedLocation && selectedLocation !== 'All Locations' ? selectedLocation : undefined,
        category: selectedCategory && selectedCategory !== 'All Categories' ? selectedCategory : undefined,
      };

      // Try marketplace API first, then fallback to individual APIs
      try {
        const [trendingProductsRes, trendingServicesRes, nearbyBusinessesRes] = await Promise.all([
          marketplaceApi.getTrendingProducts(filters),
          marketplaceApi.getTrendingServices(filters),
          marketplaceApi.getNearbyBusinesses(filters)
        ]);

        if (trendingProductsRes.success) {
          setTrendingProducts(trendingProductsRes.data);
        }
        if (trendingServicesRes.success) {
          setTrendingServices(trendingServicesRes.data);
        }
        if (nearbyBusinessesRes.success) {
          setNearbyBusinesses(nearbyBusinessesRes.data);
        }
      } catch (marketplaceError) {
        console.warn('Marketplace API failed, trying fallback:', marketplaceError);
        
        // Fallback to individual APIs
        const [productsApi, servicesApi] = await Promise.all([
          import('@/lib/api/products'),
          import('@/lib/api/services')
        ]);

        const [productsResponse, servicesResponse] = await Promise.all([
          productsApi.productsApi.getProducts({ 
            limit: 12, 
            sortBy: 'createdAt',
            ...(filters.category && { category: filters.category })
          }),
          servicesApi.servicesApi.getServices({ 
            limit: 12, 
            sortBy: 'rating',
            sortOrder: 'desc'
            // Note: Removed category filter as it needs categoryId (UUID)
          })
        ]);

        // Transform products to trending format
        if (productsResponse.success && productsResponse.data.products) {
          const trendingProductsData = productsResponse.data.products.map((product, index) => ({
            id: product.id,
            name: product.name,
            description: product.shortDescription || product.description,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.images[0] || '/img/placeholder-product.jpg',
            rating: product.reviews.average,
            reviewCount: product.reviews.total,
            category: product.category.name,
            type: 'product' as const,
            provider: {
              id: product.supplier.id,
              name: product.supplier.name,
              location: product.supplier.location,
              verified: product.supplier.verified
            },
            promotionType: (index < 3 ? 'trending' : 'standard') as 'trending' | 'standard',
            trendingRank: index + 1,
            views: Math.floor(Math.random() * 1000) + 100,
            likes: Math.floor(Math.random() * 100) + 10,
            shares: Math.floor(Math.random() * 50) + 5,
            tags: product.tags
          }));
          setTrendingProducts(trendingProductsData);
        }

        // Transform services to trending format
        if (servicesResponse.success && servicesResponse.data.services) {
          const trendingServicesData = servicesResponse.data.services.map((service, index) => ({
            id: service.id,
            name: service.name,
            description: service.description,
            price: service.basePrice,
            originalPrice: service.originalPrice,
            image: service.images[0] || '/img/placeholder-service.jpg',
            rating: service.rating,
            reviewCount: service.reviewCount,
            category: service.category,
            type: 'service' as const,
            provider: {
              id: service.provider.id,
              name: service.provider.name,
              location: service.provider.location,
              verified: service.provider.verified
            },
            promotionType: (index < 3 ? 'trending' : 'standard') as 'trending' | 'standard',
            trendingRank: index + 1,
            views: Math.floor(Math.random() * 800) + 50,
            likes: Math.floor(Math.random() * 80) + 5,
            shares: Math.floor(Math.random() * 40) + 2,
            tags: service.tags
          }));
          setTrendingServices(trendingServicesData);
        }

        // For nearby businesses, create mock data if no API available
        setNearbyBusinesses([]);
      }
    } catch (err) {
      console.error('Error fetching marketplace data:', err);
      setError('Failed to load marketplace data. Please try again.');
      toast.error('Error', 'Failed to load marketplace data');
    } finally {
      setLoading(false);
    }
  }, [selectedLocation, selectedCategory, toast]);

  useEffect(() => {
    fetchMarketplaceData();
  }, [fetchMarketplaceData]);

  const handleAddToCart = (item: TrendingItem) => {
    if (item.type !== 'product') return;

    try {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price || 0,
        image: item.image,
        type: 'product' as const,
        provider: {
          id: item.provider.id,
          name: item.provider.name,
          location: item.provider.location
        },
        category: item.category,
        inStock: true
      });

      toast.success('Added to Cart', `${item.name} has been added to your cart`);
    } catch (err) {
      toast.error('Error', 'Failed to add item to cart');
    }
  };

  const handleContactProvider = (item: TrendingItem | NearbyBusiness) => {
    toast.info('Contact Provider', `Redirecting to contact ${item.provider?.name || item.name}`);
  };

  const getPromotionIcon = (promotionType: string) => {
    switch (promotionType) {
      case 'premium':
        return <Crown className="h-3 w-3" />;
      case 'trending':
        return <TrendingUp className="h-3 w-3" />;
      case 'featured':
        return <Sparkles className="h-3 w-3" />;
      default:
        return <Award className="h-3 w-3" />;
    }
  };

  const getPromotionBadgeColor = (promotionType: string) => {
    switch (promotionType) {
      case 'premium':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      case 'trending':
        return 'bg-gradient-to-r from-pink-400 to-red-500 text-white';
      case 'featured':
        return 'bg-gradient-to-r from-purple-400 to-indigo-500 text-white';
      default:
        return 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white';
    }
  };

  const renderTrendingItem = (item: TrendingItem) => (
    <div
      key={item.id}
      className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 ${
        viewMode === 'list' ? 'flex items-center p-6 gap-6' : 'overflow-hidden'
      }`}
    >
      <div className={`relative ${viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : ''}`}>
        {item.image && !item.image.includes('placeholder') ? (
          <Image
            src={item.image}
            alt={item.name}
            width={viewMode === 'list' ? 128 : 300}
            height={viewMode === 'list' ? 128 : 200}
            className={`object-cover ${
              viewMode === 'list' ? 'w-32 h-32 rounded-lg' : 'w-full h-48'
            }`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`${item.image && !item.image.includes('placeholder') ? 'hidden' : ''} ${
          viewMode === 'list' ? 'w-32 h-32 rounded-lg' : 'w-full h-48'
        }`}>
          <PlaceholderImage 
            type={item.type} 
            className={viewMode === 'list' ? 'w-32 h-32 rounded-lg' : 'w-full h-48'} 
          />
        </div>
        
        {/* Promotion Badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${getPromotionBadgeColor(item.promotionType)}`}>
          {getPromotionIcon(item.promotionType)}
          {item.promotionType.toUpperCase()}
        </div>

        {/* Trending Stats */}
        <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <Eye className="h-3 w-3" />
          {item.views}
        </div>

        {/* Wishlist Button */}
        <WishlistButton 
          itemId={item.id} 
          type={item.type} 
          size="sm" 
          className="absolute bottom-3 right-3 bg-white/90 hover:bg-white w-8 h-8 p-0 rounded-full shadow-md"
        />
      </div>

      <div className={viewMode === 'list' ? 'flex-1' : 'p-4'}>
        <div className="flex items-center justify-between mb-2">
          <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 text-xs font-medium">
            {item.category}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <TrendingUp className="h-3 w-3" />
            <span>#{item.trendingRank}</span>
          </div>
        </div>

        <Link href={`/${item.type}s/${item.id}`}>
          <h3 className="font-bold text-lg mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
            {item.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {item.description}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(item.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {item.rating} ({item.reviewCount} reviews)
          </span>
        </div>

        {item.price && (
          <div className="mb-3">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatPrice(item.price)}
            </span>
            {item.originalPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">
                {formatPrice(item.originalPrice)}
              </span>
            )}
          </div>
        )}

        <div className="mb-4">
          <Link
            href={`/providers/${item.provider.id}`}
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            {item.provider.name}
            {item.provider.verified && (
              <span className="ml-1 text-green-600">✓</span>
            )}
          </Link>
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="h-3 w-3 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {item.provider.location}
            </span>
          </div>
        </div>

        {/* Engagement Stats */}
        <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{item.views} views</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-3 w-3" />
            <span>{item.likes} likes</span>
          </div>
          <div className="flex items-center gap-1">
            <Share2 className="h-3 w-3" />
            <span>{item.shares} shares</span>
          </div>
        </div>

        <div className="flex gap-2">
          {item.type === 'product' ? (
            <Button
              className="flex-1 btn-primary font-semibold py-2 px-4 rounded-lg transition-colors"
              onClick={() => handleAddToCart(item)}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          ) : (
            <Button
              className="flex-1 btn-secondary font-semibold py-2 px-4 rounded-lg transition-colors"
              onClick={() => handleContactProvider(item)}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Now
            </Button>
          )}
          <Link href={`/${item.type}s/${item.id}`}>
            <Button variant="outline" className="px-4 py-2 border-2 border-gray-300 hover:border-orange-500 hover:text-orange-600 transition-colors">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );

  const renderNearbyBusiness = (business: NearbyBusiness) => (
    <div
      key={business.id}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <div className="relative">
        <Image
          src={business.coverImage}
          alt={business.name}
          width={400}
          height={200}
          className="w-full h-48 object-cover"
        />
        
        {/* Distance Badge */}
        <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {business.distance}km away
        </div>

        {/* Business Status */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-medium ${
          business.isOpen 
            ? 'bg-green-600 text-white' 
            : 'bg-red-600 text-white'
        }`}>
          {business.isOpen ? 'Open Now' : 'Closed'}
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-xs font-medium">
            {business.category}
          </Badge>
          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <Users className="h-4 w-4" />
            <span>{business.employeeCount}+ employees</span>
          </div>
        </div>

        <Link href={`/providers/${business.id}`}>
          <h3 className="font-bold text-xl mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {business.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {business.description}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(business.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {business.rating} ({business.reviewCount} reviews)
          </span>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-1 mb-1">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {business.address}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {business.workingHours}
            </span>
          </div>
        </div>

        {/* Services/Products Count */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Package className="h-4 w-4" />
            <span>{business.productsCount} products</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{business.servicesCount} services</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-1 btn-primary font-semibold py-2 px-4 rounded-lg transition-colors"
            onClick={() => handleContactProvider(business)}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact Business
          </Button>
          <Link href={`/providers/${business.id}`}>
            <Button variant="outline" className="px-4 py-2 border-2 border-gray-300 hover:border-orange-500 hover:text-orange-600 transition-colors">
              View Profile
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Marketplace
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover trending products, services, and nearby businesses
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <LoadingSkeleton type="card" count={6} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            <span className="text-gradient-orange-blue">Marketplace</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-lg">
            Discover trending products, services, and nearby businesses in your area
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">View:</span>
              <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg">
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

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Trending Now
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Hot Services
            </TabsTrigger>
            <TabsTrigger value="businesses" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Nearby Businesses
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                🔥 Trending Products
              </h2>
              <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                {trendingProducts.length} items
              </Badge>
            </div>
            
            {trendingProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No Trending Products</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Check back later for trending products in your area
                </p>
                <Link href="/products">
                  <Button className="btn-primary">
                    Browse All Products
                  </Button>
                </Link>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-6'
              }>
                {trendingProducts.map(renderTrendingItem)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                ⚡ Hot Services
              </h2>
              <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                {trendingServices.length} services
              </Badge>
            </div>
            
            {trendingServices.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No Hot Services</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Check back later for trending services in your area
                </p>
                <Link href="/services">
                  <Button className="btn-secondary">
                    Browse All Services
                  </Button>
                </Link>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-6'
              }>
                {trendingServices.map(renderTrendingItem)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="businesses" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                📍 Nearby Businesses
              </h2>
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                {nearbyBusinesses.length} businesses
              </Badge>
            </div>
            
            {nearbyBusinesses.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No Nearby Businesses</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  We're working on adding more businesses in your area
                </p>
                <Link href="/providers">
                  <Button className="btn-primary">
                    Browse All Suppliers
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nearbyBusinesses.map(renderNearbyBusiness)}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">
            Want to Feature Your Business?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of businesses already growing with Vikareta
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register?type=seller">
              <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 font-bold rounded-lg">
                Become a Seller
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3 font-bold rounded-lg">
                Promote Your Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}