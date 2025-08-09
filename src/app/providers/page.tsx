'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Star, 
  MessageCircle, 
  MapPin,
  Shield,
  Award,
  Clock,
  Users,
  ChevronDown,
  SlidersHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast-provider';
import { providersApi, type ProvidersFilters } from '@/lib/api/providers';

interface Provider {
  id: string;
  name: string;
  avatar: string;
  location: string;
  verified: boolean;
  experience: string;
  rating: number;
  reviewCount: number;
  completedProjects: number;
  responseTime: string;
  skills: string[];
  categories: string[];
  hourlyRate: number;
  available: boolean;
  description: string;
  languages: string[];
}

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [sortBy, setSortBy] = useState<ProvidersFilters['sortBy']>('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  const toast = useToast();



  const locations = [
    'All Locations',
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Chennai',
    'Kolkata',
    'Pune',
    'Hyderabad'
  ];

  const experienceLevels = [
    { value: '', label: 'Any Experience' },
    { value: '1+', label: '1+ Years' },
    { value: '3+', label: '3+ Years' },
    { value: '5+', label: '5+ Years' },
    { value: '10+', label: '10+ Years' }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'experience', label: 'Most Experienced' },
    { value: 'projects', label: 'Most Projects' },
    { value: 'rate-low', label: 'Rate: Low to High' },
    { value: 'rate-high', label: 'Rate: High to Low' }
  ];



  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    fetchProviders();
  }, [searchQuery, selectedCategory, selectedLocation, experienceLevel, sortBy]);

  const loadCategories = async () => {
    try {
      const response = await providersApi.getCategories();
      if (response.success) {
        setCategories(['All Categories', ...response.data]);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const fetchProviders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const filters: ProvidersFilters = {
        page: 1,
        limit: 20,
        sortBy,
        ...(searchQuery && { search: searchQuery }),
        ...(selectedCategory && selectedCategory !== 'All Categories' && { category: selectedCategory }),
        ...(selectedLocation && selectedLocation !== 'All Locations' && { location: selectedLocation }),
        ...(experienceLevel && { experience: experienceLevel })
      };

      const response = await providersApi.getProviders(filters);
      
      if (response.success) {
        setProviders(response.data.providers);
      } else {
        setError('Failed to load providers');
      }
    } catch (error) {
      console.error('Error fetching providers:', error);
      setError('Failed to load providers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContactProvider = (provider: Provider) => {
    toast.info('Contact Provider', `Redirecting to contact ${provider.name}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProviders();
  }; 
 return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Find Providers</h1>
          <p className="text-muted-foreground">
            Connect with verified professionals across India
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
                placeholder="Search providers, skills, categories..."
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
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>

              {/* Location Filter */}
              <div className="relative">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="appearance-none bg-background border rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>

              {/* Experience Filter */}
              <div className="relative">
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="appearance-none bg-background border rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {experienceLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
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
                  <label className="block text-sm font-medium mb-2">Hourly Rate Range</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                    />
                    <span className="text-muted-foreground">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                    />
                  </div>
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
                  <label className="block text-sm font-medium mb-2">Response Time</label>
                  <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background">
                    <option value="">Any Response Time</option>
                    <option value="1">Within 1 hour</option>
                    <option value="2">Within 2 hours</option>
                    <option value="24">Within 24 hours</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {loading ? 'Loading...' : `Showing ${providers.length} providers`}
          </p>
        </div>

        {/* Providers Grid/List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-muted-foreground/20 rounded-full w-16 h-16"></div>
                    <div className="flex-1">
                      <div className="bg-muted-foreground/20 rounded h-4 mb-2"></div>
                      <div className="bg-muted-foreground/20 rounded h-3 w-2/3"></div>
                    </div>
                  </div>
                  <div className="bg-muted-foreground/20 rounded h-3 mb-2"></div>
                  <div className="bg-muted-foreground/20 rounded h-3 w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : providers.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No providers found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters
            </p>
            <Button onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All Categories');
              setSelectedLocation('All Locations');
              setExperienceLevel('');
            }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }>    
        {providers.map((provider) => (
              <div
                key={provider.id}
                className={`bg-card rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 ${
                  viewMode === 'list' ? 'flex items-center p-6 gap-6' : 'p-6'
                }`}
              >
                <div className={`${viewMode === 'list' ? 'flex-shrink-0' : 'mb-4'}`}>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Image
                        src={provider.avatar}
                        alt={provider.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      {provider.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                          <Shield className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className={viewMode === 'list' ? 'flex-1' : ''}>
                      <Link href={`/providers/${provider.id}`}>
                        <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                          {provider.name}
                        </h3>
                      </Link>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <MapPin className="h-3 w-3" />
                        {provider.location}
                      </div>
                      
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(provider.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {provider.rating} ({provider.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={viewMode === 'list' ? 'flex-1' : ''}>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {provider.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-xs mb-4">
                    <div>
                      <div className="text-muted-foreground">Experience</div>
                      <div className="font-medium">{provider.experience}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Projects</div>
                      <div className="font-medium">{provider.completedProjects}+</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Response</div>
                      <div className="font-medium">{provider.responseTime}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Rate</div>
                      <div className="font-medium">₹{provider.hourlyRate}/hr</div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {provider.skills.slice(0, 4).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {provider.skills.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{provider.skills.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {provider.categories.map((category) => (
                        <Badge key={category} className="text-xs bg-secondary text-secondary-foreground">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="mb-4">
                    <div className="text-xs text-muted-foreground">
                      Languages: {provider.languages.join(', ')}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 btn-primary text-sm"
                      onClick={() => handleContactProvider(provider)}
                      disabled={!provider.available}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {provider.available ? 'Contact' : 'Unavailable'}
                    </Button>
                    <Link href={`/providers/${provider.id}`}>
                      <Button variant="outline" className="text-sm">
                        View Profile
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