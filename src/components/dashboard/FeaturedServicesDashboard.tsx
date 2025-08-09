'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Eye, 
  MessageCircle, 
  Calendar, 
  Crown, 
  Sparkles, 
  Award,
  Plus,
  MoreVertical,
  Trash2,
  Edit,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PromoteServiceModal } from './PromoteServiceModal';
import { featuredServicesApi } from '@/lib/api/featuredServices';
import { useToast } from '@/components/ui/toast-provider';
import { formatPrice } from '@/lib/utils';

interface DashboardStats {
  totalFeatured: number;
  activeFeatured: number;
  expiredFeatured: number;
  totalViews: number;
  totalInquiries: number;
  conversionRate: number;
  averageRating: number;
}

interface FeaturedService {
  id: string;
  name: string;
  basePrice: number;
  image: string;
  category: string;
  promotionType: 'standard' | 'premium' | 'creative';
  featuredUntil: string;
  views: number;
  inquiries: number;
  bookings: number;
  serviceType: string;
}

// Real data will be fetched from API - no mock data

export function FeaturedServicesDashboard({ providerId }: { providerId: string }) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [featuredServices, setFeaturedServices] = useState<FeaturedService[]>([]);
  const [availableServices, setAvailableServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchStats();
    fetchFeaturedServices();
    fetchAvailableServices();
  }, [providerId]);

  const fetchFeaturedServices = async () => {
    try {
      // In production: fetch provider's featured services from API
      // For now, return empty array since no real promotions exist
      setFeaturedServices([]);
    } catch (error) {
      console.error('Error fetching featured services:', error);
    }
  };

  const fetchAvailableServices = async () => {
    try {
      // In production: fetch provider's available services from API
      // For now, return empty array since no real services exist
      setAvailableServices([]);
    } catch (error) {
      console.error('Error fetching available services:', error);
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await featuredServicesApi.getFeaturedServicesStats(providerId);
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

  const handlePromoteService = (service: any) => {
    setSelectedService(service);
    setIsPromoteModalOpen(true);
  };

  const handleRemoveFeatured = async (serviceId: string) => {
    try {
      await featuredServicesApi.removeFeaturedStatus(serviceId, providerId);
      setFeaturedServices(prev => prev.filter(s => s.id !== serviceId));
      toast.success('Success', 'Service removed from featured listings');
      fetchStats(); // Refresh stats
    } catch (error) {
      console.error('Error removing featured status:', error);
      toast.error('Error', 'Failed to remove featured status');
    }
  };

  const getPromotionIcon = (type: string) => {
    switch (type) {
      case 'premium': return <Crown className="h-4 w-4" />;
      case 'creative': return <Sparkles className="h-4 w-4" />;
      default: return <Award className="h-4 w-4" />;
    }
  };

  const getPromotionColor = (type: string) => {
    switch (type) {
      case 'premium': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      case 'creative': return 'bg-gradient-to-r from-purple-400 to-pink-500 text-white';
      default: return 'bg-blue-500 text-white';
    }
  };

  const getServiceTypeColor = (serviceType: string) => {
    switch (serviceType) {
      case 'one-time': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300';
      case 'monthly': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300';
      case 'project-based': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300';
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
          <h1 className="text-3xl font-bold">Featured Services</h1>
          <p className="text-muted-foreground">
            Manage your promoted services and track their performance
          </p>
        </div>
        <Button 
          onClick={() => availableServices.length > 0 && handlePromoteService(availableServices[0])}
          className="btn-primary"
          disabled={availableServices.length === 0}
        >
          <Plus className="h-4 w-4 mr-2" />
          Promote Service
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
                  <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
                </div>
                <Eye className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Inquiries</p>
                  <p className="text-2xl font-bold">{stats.totalInquiries.toLocaleString()}</p>
                </div>
                <MessageCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Rating</p>
                  <p className="text-2xl font-bold">{stats.averageRating}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Featured Services List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Currently Featured Services</h2>
        {featuredServices.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Featured Services</h3>
              <p className="text-muted-foreground mb-4">
                Start promoting your services to increase visibility and get more clients
              </p>
              <Button 
                onClick={() => availableServices.length > 0 && handlePromoteService(availableServices[0])}
                className="btn-primary"
                disabled={availableServices.length === 0}
              >
                <Plus className="h-4 w-4 mr-2" />
                Promote Your First Service
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredServices.map((service) => (
              <Card key={service.id} className="card-hover">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate">{service.name}</h3>
                          <p className="text-sm text-primary font-medium">
                            Starting at {formatPrice(service.basePrice)}
                          </p>
                        </div>
                        <Button className="w-8 h-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <div className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getPromotionColor(service.promotionType)}`}>
                          {getPromotionIcon(service.promotionType)}
                          {service.promotionType.toUpperCase()}
                        </div>
                        <Badge className="text-xs">{service.category}</Badge>
                      </div>

                      <div className="mt-2">
                        <Badge className={`text-xs ${getServiceTypeColor(service.serviceType)}`}>
                          {service.serviceType.replace('-', ' ')}
                        </Badge>
                      </div>

                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Views</span>
                          <span className="font-medium">{service.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Inquiries</span>
                          <span className="font-medium">{service.inquiries}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Bookings</span>
                          <span className="font-medium text-green-600">{service.bookings}</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>Expires {new Date(service.featuredUntil).toLocaleDateString()}</span>
                          </div>
                          {isExpiringSoon(service.featuredUntil) && (
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
                            onClick={() => handleRemoveFeatured(service.id)}
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

      {/* Available Services to Promote */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Services to Promote</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {availableServices.map((service) => (
            <Card key={service.id} className="card-hover">
              <CardContent className="p-4">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h3 className="font-semibold text-sm mb-1 line-clamp-2">{service.name}</h3>
                <p className="text-sm text-primary font-medium mb-2">
                  Starting at {formatPrice(service.basePrice)}
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="text-xs">{service.category}</Badge>
                  <Badge className={`text-xs ${getServiceTypeColor(service.serviceType)}`}>
                    {service.serviceType.replace('-', ' ')}
                  </Badge>
                </div>
                <Button
                  onClick={() => handlePromoteService(service)}
                  className="w-full btn-primary text-sm"
                  disabled={!service.available}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Promote
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Promote Service Modal */}
      <PromoteServiceModal
        service={selectedService}
        providerId={providerId}
        isOpen={isPromoteModalOpen}
        onClose={() => {
          setIsPromoteModalOpen(false);
          setSelectedService(null);
        }}
        onSuccess={() => {
          fetchStats();
          // Refresh featured services list
        }}
      />
    </div>
  );
}