'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, AlertCircle, TrendingUp, Package, Users } from 'lucide-react';
import { IconBackground } from '@/components/ui/dynamic-icon';
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
  <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
  <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
    <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Business Categories
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Explore our comprehensive range of business categories with verified suppliers across India
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <Link
                href={`/categories/${category.slug}`}
                className="group block"
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform group-hover:scale-105">
                  <div className="relative h-56">
                    <IconBackground
                      category={category}
                      size={80}
                      className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 group-hover:from-orange-100 group-hover:to-amber-100 dark:group-hover:from-gray-700 dark:group-hover:to-gray-600 transition-all duration-500"
                      iconClassName="text-orange-600 dark:text-orange-400 group-hover:text-orange-700 group-hover:scale-110 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    
                    {/* Dynamic tags with hover animation */}
                    {index < 3 && (
                      <motion.div 
                        className="absolute top-4 left-4 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <TrendingUp className="h-3 w-3" />
                        TRENDING
                      </motion.div>
                    )}
                    
                    <div className="absolute bottom-4 left-4 text-gray-800 dark:text-white">
                      <h3 className="font-bold text-xl mb-2 drop-shadow-sm group-hover:text-orange-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm opacity-90 line-clamp-2 drop-shadow-sm">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Package className="h-4 w-4 text-orange-500" />
                        <span className="font-semibold">{(category.productCount || 0).toLocaleString()} Products</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Users className="h-4 w-4 text-orange-600" />
                        <span className="font-semibold">{Math.floor((category.productCount || 0) / 10)} Suppliers</span>
                      </div>
                    </div>
                    
                    {/* Animated subcategories with dynamic tags */}
                    {category.subcategories && category.subcategories.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {category.subcategories.slice(0, 3).map((sub, subIndex) => (
                            <motion.div
                              key={sub.id}
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              transition={{ delay: subIndex * 0.1, duration: 0.3 }}
                              whileHover={{ scale: 1.05 }}
                            >
                              <Badge variant="outline" className="text-xs hover:bg-orange-50 hover:border-orange-300 transition-colors">
                                {sub.name}
                              </Badge>
                            </motion.div>
                          ))}
                          {category.subcategories.length > 3 && (
                            <Badge variant="outline" className="text-xs bg-orange-50 text-orange-600 border-orange-200">
                              +{category.subcategories.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <motion.div 
                      className="flex items-center justify-between"
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-orange-600 dark:text-orange-400 font-bold group-hover:text-orange-700 transition-colors">
                        Explore Category
                      </span>
                      <ArrowRight className="h-5 w-5 text-orange-600 dark:text-orange-400 group-hover:text-orange-700 group-hover:translate-x-2 transition-all duration-300" />
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link href="/categories">
            <motion.button
              className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-10 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 text-lg group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              View Categories
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}