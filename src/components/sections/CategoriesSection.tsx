'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Loader2, AlertCircle, TrendingUp, Package, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast-provider';
import { categoriesApi, type Category } from '@/lib/api/categories';

export function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await categoriesApi.getCategories();
      
      if (response.success) {
        // Get featured categories (first 6)
        setCategories(response.data.slice(0, 6));
      } else {
        throw new Error('Failed to fetch categories');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again.');
      toast.error('Error', 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-orange-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gradient-orange-blue">Browse by Category</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explore our wide range of product categories from verified suppliers across India
            </p>
          </div>
          
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600 dark:text-gray-300">Loading categories...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-br from-orange-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gradient-orange-blue">Browse by Category</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explore our wide range of product categories from verified suppliers across India
            </p>
          </div>
          
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
            <Button onClick={fetchCategories} className="btn-primary">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-gradient-orange-blue">Browse by Category</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-lg">
            Explore our wide range of product categories from verified suppliers across India
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="group"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-105">
                <div className="relative h-56">
                  <Image
                    src={'/api/placeholder/400/300'}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Trending Badge */}
                  {index < 3 && (
                    <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      TRENDING
                    </div>
                  )}
                  
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-bold text-xl mb-2">{category.name}</h3>
                    <p className="text-sm opacity-90 line-clamp-2">{category.description}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Package className="h-4 w-4 text-blue-500" />
                      <span className="font-semibold">{category.productCount?.toLocaleString() || '0'} Products</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Users className="h-4 w-4 text-orange-500" />
                      <span className="font-semibold">{Math.floor((category.productCount || 0) / 10)} Suppliers</span>
                    </div>
                  </div>
                  
                  {/* Subcategories Preview */}
                  {category.subcategories && category.subcategories.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {category.subcategories.slice(0, 3).map((sub) => (
                          <Badge key={sub.id} variant="outline" className="text-xs">
                            {sub.name}
                          </Badge>
                        ))}
                        {category.subcategories.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{category.subcategories.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 dark:text-blue-400 font-bold group-hover:text-orange-500 transition-colors">
                      Explore Category
                    </span>
                    <ArrowRight className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover:text-orange-500 group-hover:translate-x-2 transition-all duration-300" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link href="/categories">
            <Button className="btn-outline-orange px-8 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              View All Categories
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}