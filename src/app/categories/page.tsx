'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Grid, List, Filter, ArrowRight, TrendingUp, Package, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  featured: boolean;
  productCount: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.vikareta.com/api';
        const response = await fetch(`${API_BASE_URL}/categories`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const result = await response.json();
        if (result.success) {
          setCategories(result.data || []);
        } else {
          throw new Error(result.error?.message || 'Failed to fetch categories');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (category.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFeatured = !showFeaturedOnly || category.featured;
    return matchesSearch && matchesFeatured;
  });

  const featuredCategories = categories.filter(cat => cat.featured);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading categories...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-12 w-12 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Failed to load categories</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Browse <span className="text-gradient">Categories</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover products across various industries and find the perfect suppliers for your business needs
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Featured Filter */}
          <Button
            variant={showFeaturedOnly ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFeaturedOnly ? 'All Categories' : 'Featured Only'}
          </Button>
        </div>

        {/* Featured Categories Banner */}
        {!showFeaturedOnly && searchQuery === '' && featuredCategories.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold">Featured Categories</h2>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFeaturedOnly(true)}
              >
                View All Featured
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCategories.slice(0, 6).map((category) => (
                <Link key={category.id} href={`/categories/${category.slug}`}>
                  <Card className="card-hover group">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Package className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-muted-foreground text-sm mt-1">
                            {category.description || 'No description available'}
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <Badge variant="secondary">
                              {category.productCount.toLocaleString()} products
                            </Badge>
                            <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300">
                              Featured
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Categories */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">
            {showFeaturedOnly ? 'Featured Categories' : 'All Categories'}
          </h2>
          <p className="text-muted-foreground">
            {filteredCategories.length} {filteredCategories.length === 1 ? 'category' : 'categories'} found
          </p>
        </div>

        {/* Categories Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                <Card className="card-hover group h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Package className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                            {category.name}
                          </h3>
                          {category.featured && (
                            <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300">
                              Featured
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
                          {category.description || 'No description available'}
                        </p>
                        <div className="mt-4">
                          <Badge variant="secondary">
                            {category.productCount.toLocaleString()} products
                          </Badge>
                        </div>
                        <div className="mt-3">
                          <p className="text-xs text-muted-foreground">
                            Category ID: {category.id}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCategories.map((category) => (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                <Card className="card-hover group">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Package className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-xl group-hover:text-primary transition-colors">
                              {category.name}
                            </h3>
                            <p className="text-muted-foreground mt-1">
                              {category.description || 'No description available'}
                            </p>
                          </div>
                          {category.featured && (
                            <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300">
                              Featured
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 mt-3">
                          <Badge variant="secondary">
                            {category.productCount.toLocaleString()} products
                          </Badge>
                          <Badge variant="outline">
                            {category.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No categories found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setShowFeaturedOnly(false);
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}