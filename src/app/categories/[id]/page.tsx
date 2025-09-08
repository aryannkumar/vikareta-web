'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Package,
  Users,
  Building,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { CategoryIcon } from '../../../components/ui/dynamic-icon';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { categoriesApi, type CategoryWithProducts } from '../../../lib/api/categories';

export default function CategoryDetailPage() {
  const params = useParams();
  const [categoryData, setCategoryData] = useState<CategoryWithProducts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Removed product-related state since category page only shows subcategories

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' }
  ];

  const loadCategoryData = useCallback(async (categorySlug: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await categoriesApi.getCategoryBySlug(categorySlug);
      
      if (response) {
        setCategoryData({ ...response, products: [] }); // Category page shows no products
      } else {
        setError('Category not found');
      }
    } catch (error) {
      console.error('Error loading category:', error);
      setError('Failed to load category data');
    } finally {
      setLoading(false);
    }
  }, []);  // Remove dependencies since category page doesn't show products

  useEffect(() => {
    if (params.id) {
      loadCategoryData(params.id as string);
    }
  }, [params.id, loadCategoryData]);

  // No product filtering needed for category page

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

  if (error || !categoryData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Category Not Found</h2>
            <p className="text-muted-foreground mb-8">{error}</p>
            <Link href="/categories">
              <Button>Back to Categories</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Breadcrumb */}
        <nav className="flex items-center space-x-2 mb-8 text-sm">
          <Link 
            href="/categories" 
            className="flex items-center text-amber-600 hover:text-amber-700 font-medium transition-colors duration-200 hover:underline"
          >
            <Package className="w-4 h-4 mr-2" />
            Categories
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-semibold">{categoryData.name}</span>
        </nav>

        {/* Enhanced Category Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-3xl border border-slate-200/60 shadow-2xl shadow-blue-500/10 mb-12">
          {/* Enhanced Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-purple-100/30"></div>
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-gradient-to-br from-blue-400/30 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-gradient-to-tr from-indigo-400/20 to-cyan-400/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl opacity-60"></div>
          
          <div className="relative p-8">
            <div className="flex items-start gap-6">
              {/* Enhanced Icon */}
              <div className="relative group">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/25 transform rotate-3 hover:rotate-0 hover:scale-110 transition-all duration-500 group-hover:shadow-3xl group-hover:shadow-purple-500/30">
                  <CategoryIcon category={categoryData} size={48} className="text-white drop-shadow-lg" />
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-3 border-white flex items-center justify-center shadow-lg animate-bounce">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <h1 className="text-5xl font-black bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 bg-clip-text text-transparent leading-tight">
                    {categoryData.name}
                  </h1>
                  {categoryData.featured && (
                    <span className="px-4 py-2 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 text-white text-sm font-bold rounded-2xl shadow-lg shadow-orange-500/30 animate-pulse">
                      ⭐ Featured
                    </span>
                  )}
                </div>
                
                <div className="mb-8">
                  <p className="text-slate-600 text-xl leading-relaxed mb-4 max-w-3xl font-medium">
                    {categoryData.description || `Discover premium ${categoryData.name.toLowerCase()} from verified suppliers across India with competitive pricing and reliable service.`}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Live marketplace
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      Verified suppliers
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                      Instant quotes
                    </span>
                  </div>
                </div>
                
                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="group bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/50 shadow-lg shadow-blue-500/5 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-500">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Package className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <div className="text-3xl font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">{(categoryData.productCount || 0).toLocaleString()}</div>
                        <div className="text-sm text-slate-500 font-medium">Products & Services</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/50 shadow-lg shadow-green-500/5 hover:shadow-2xl hover:shadow-green-500/10 hover:-translate-y-2 transition-all duration-500">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Users className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <div className="text-3xl font-black text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors duration-300">500+</div>
                        <div className="text-sm text-slate-500 font-medium">Verified Suppliers</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/50 shadow-lg shadow-purple-500/5 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2 transition-all duration-500">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Building className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <div className="text-3xl font-black text-slate-900 mb-1 group-hover:text-purple-600 transition-colors duration-300">50+</div>
                        <div className="text-sm text-slate-500 font-medium">Cities Covered</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Subcategories Section */}
        {(categoryData.subcategories?.length || 0) > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Explore Subcategories</h2>
                <p className="text-gray-600">Find exactly what you're looking for in these specialized categories</p>
              </div>
              <div className="text-sm text-gray-500">
                {categoryData.subcategories?.length} subcategories
              </div>
            </div>
            
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(categoryData.subcategories || []).map((subcategory, index) => (
                <Link 
                  key={subcategory.id} 
                  href={`/categories/${categoryData.slug}/${subcategory.slug}`}
                  className="group block"
                >
                  <div className="h-full bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-500/10 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-3 hover:rotate-1 transition-all duration-500 overflow-hidden relative">
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative p-8">
                      <div className="flex items-start gap-5">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                            <Package className="h-8 w-8 text-white" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{index + 1}</span>
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-black text-xl text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                            {subcategory.name}
                          </h3>
                          
                          <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                            {subcategory.description || `Explore premium ${subcategory.name.toLowerCase()} from trusted suppliers with competitive pricing and fast delivery.`}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 font-semibold px-3 py-1 rounded-xl shadow-lg">
                              {subcategory.productCount || 0} items
                            </Badge>
                            
                            <div className="text-xs text-slate-500 flex items-center gap-2 font-medium">
                              <TrendingUp className="h-4 w-4 text-emerald-500" />
                              Trending
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced Hover Border */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-500 pointer-events-none"></div>
                    <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent group-hover:ring-blue-200/50 transition-all duration-500 pointer-events-none"></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Empty State */}
        {(categoryData.subcategories?.length || 0) === 0 && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Package className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No subcategories yet</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                This category is being set up. Check back soon for specialized subcategories, or explore other categories in the meantime.
              </p>
              <Link href="/categories">
                <Button className="bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 rounded-xl">
                  Browse Other Categories
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}