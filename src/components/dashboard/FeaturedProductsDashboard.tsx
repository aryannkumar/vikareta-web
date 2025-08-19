'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Eye, 
  MousePointer, 
  Calendar, 
  Crown, 
  Sparkles, 
  Star,
  Plus,
  MoreVertical,
  Trash2,
  Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PromoteProductModal } from './PromoteProductModal';
import { featuredProductsApi } from '@/lib/api/featuredProducts';
import { useToast } from '@/components/ui/toast-provider';
import { formatPrice } from '@/lib/utils';

interface DashboardStats {
  totalFeatured: number;
  activeFeatured: number;
  expiredFeatured: number;
  totalViews: number;
  totalClicks: number;
  conversionRate: number;
}

interface FeaturedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  promotionType: 'standard' | 'premium' | 'organic';
  featuredUntil: string;
  views: number;
  clicks: number;
  orders: number;
}

// Real data will be fetched from API - no mock data

export function FeaturedProductsDashboard({ supplierId }: { supplierId: string }) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchStats();
    fetchFeaturedProducts();
    fetchAvailableProducts();
  }, [supplierId]);

  const fetchFeaturedProducts = async () => {
    try {
      // In production: fetch supplier's featured products from API
      // For now, return empty array since no real promotions exist
      setFeaturedProducts([]);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  };

  const fetchAvailableProducts = async () => {
    try {
      // In production: fetch supplier's available products from API
      // For now, return empty array since no real products exist
      setAvailableProducts([]);
    } catch (error) {
      console.error('Error fetching available products:', error);
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await featuredProductsApi.getFeaturedStats(supplierId);
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Error', 'Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteProduct = (product: any) => {
    setSelectedProduct(product);
    setIsPromoteModalOpen(true);
  };

  const handleRemoveFeatured = async (productId: string) => {
    try {
      await featuredProductsApi.removeFeaturedStatus(productId, supplierId);
      setFeaturedProducts(prev => prev.filter(p => p.id !== productId));
      toast.success('Success', 'Product removed from featured listings');
      fetchStats(); // Refresh stats
    } catch (error) {
      console.error('Error removing featured status:', error);
      toast.error('Error', 'Failed to remove featured status');
    }
  };

  const getPromotionIcon = (type: string) => {
    switch (type) {
      case 'premium': return <Crown className="h-4 w-4" />;
      case 'organic': return <Sparkles className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const getPromotionColor = (type: string) => {
    switch (type) {
      case 'premium': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      case 'organic': return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white';
      default: return 'bg-blue-500 text-white';
    }
  };

  const isExpiringSoon = (dateString: string) => {
    const expiryDate = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
    return diffDays <= 3;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Featured Products</h1>
          <p className="text-muted-foreground">
            Manage your promoted products and track their performance
          </p>
        </div>
        <Button 
          onClick={() => availableProducts.length > 0 && handlePromoteProduct(availableProducts[0])}
          className="btn-primary"
          disabled={availableProducts.length === 0}
        >
          <Plus className="h-4 w-4 mr-2" />
          Promote Product
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Featured</p>
                  <p className="text-2xl font-bold">{stats.activeFeatured}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                  <p className="text-2xl font-bold">{(stats.totalViews || 0).toLocaleString()}</p>
                </div>
                <Eye className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Clicks</p>
                  <p className="text-2xl font-bold">{(stats.totalClicks || 0).toLocaleString()}</p>
                </div>
                <MousePointer className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  <p className="text-2xl font-bold">{stats.conversionRate}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Featured Products List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Currently Featured Products</h2>
        {featuredProducts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Featured Products</h3>
              <p className="text-muted-foreground mb-4">
                Start promoting your products to increase visibility and sales
              </p>
              <Button 
                onClick={() => availableProducts.length > 0 && handlePromoteProduct(availableProducts[0])}
                className="btn-primary"
                disabled={availableProducts.length === 0}
              >
                <Plus className="h-4 w-4 mr-2" />
                Promote Your First Product
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="card-hover">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                          <p className="text-sm text-primary font-medium">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                        <Button className="w-8 h-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <div className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getPromotionColor(product.promotionType)}`}>
                          {getPromotionIcon(product.promotionType)}
                          {product.promotionType.toUpperCase()}
                        </div>
                        <Badge className="text-xs">{product.category}</Badge>
                      </div>

                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Views</span>
                          <span className="font-medium">{(product.views || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Clicks</span>
                          <span className="font-medium">{product.clicks}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Orders</span>
                          <span className="font-medium text-green-600">{product.orders}</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>Expires {new Date(product.featuredUntil).toLocaleDateString()}</span>
                          </div>
                          {isExpiringSoon(product.featuredUntil) && (
                            <Badge className="bg-red-100 text-red-700 text-xs">
                              Expiring Soon
                            </Badge>
                          )}
                        </div>

                        <div className="flex gap-2 mt-3">
                          <Button className="flex-1 text-xs px-2 py-1 h-8">
                            <Edit className="h-3 w-3 mr-1" />
                            Extend
                          </Button>
                          <Button 
                            onClick={() => handleRemoveFeatured(product.id)}
                            className="text-xs px-2 py-1 h-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Available Products to Promote */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Products to Promote</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {availableProducts.map((product) => (
            <Card key={product.id} className="card-hover">
              <CardContent className="p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.name}</h3>
                <p className="text-sm text-primary font-medium mb-2">
                  {formatPrice(product.price)}
                </p>
                <Badge className="text-xs mb-3">{product.category}</Badge>
                <Button
                  onClick={() => handlePromoteProduct(product)}
                  className="w-full btn-primary text-sm"
                  disabled={!product.inStock}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Promote
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Promote Product Modal */}
      <PromoteProductModal
        product={selectedProduct}
        supplierId={supplierId}
        isOpen={isPromoteModalOpen}
        onClose={() => {
          setIsPromoteModalOpen(false);
          setSelectedProduct(null);
        }}
        onSuccess={() => {
          fetchStats();
          // Refresh featured products list
        }}
      />
    </div>
  );
}