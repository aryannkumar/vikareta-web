'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Star, 
  MessageCircle, 
  Heart, 
  Loader2, 
  AlertCircle, 
  Crown, 
  Sparkles,
  Clock,
  CheckCircle,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast-provider';
import { formatPrice } from '@/lib/utils';
import { featuredServicesApi, type FeaturedService } from '@/lib/api/featuredServices';
import { motion } from 'framer-motion';
import { fadeInUp, cardHover } from '@/lib/motion';

export function FeaturedServices() {
  const [services, setServices] = useState<FeaturedService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    fetchFeaturedServices();
  }, []);

  const fetchFeaturedServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await featuredServicesApi.getFeaturedServices({ limit: 8 });
      
      if (response.success) {
        setServices(response.data.services);
      } else {
        throw new Error('Failed to fetch featured services');
      }
    } catch (err) {
      console.error('Error fetching featured services:', err);
      setError('Failed to load featured services. Please try again later.');
      toast.error('Error', 'Failed to load featured services');
    } finally {
      setLoading(false);
    }
  };

  const handleContactProvider = (service: FeaturedService) => {
    // In production, this would open a contact modal or redirect to messaging
    toast.info('Contact Business', `Redirecting to contact ${service.provider.name}`);
  };

  const getPromotionIcon = (promotionType: string) => {
    switch (promotionType) {
      case 'premium':
        return <Crown className="h-3 w-3" />;
      case 'creative':
        return <Sparkles className="h-3 w-3" />;
      default:
        return <Award className="h-3 w-3" />;
    }
  };

  const getPromotionBadgeColor = (promotionType: string) => {
    switch (promotionType) {
      case 'premium':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      case 'creative':
        return 'bg-gradient-to-r from-purple-400 to-pink-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  const getServiceTypeColor = (serviceType: string) => {
    switch (serviceType) {
      case 'one-time':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300';
      case 'monthly':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300';
      case 'project-based':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Featured Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover top-quality services promoted by verified businesses
            </p>
          </div>
          
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading featured services...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Featured Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover top-quality services promoted by verified businesses
            </p>
          </div>
          
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchFeaturedServices}>
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (services.length === 0) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Featured Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover top-quality services promoted by verified businesses
            </p>
          </div>
          
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No featured services available at the moment.</p>
            <Link href="/services">
              <Button>Browse All Services</Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">
            <span className="text-gradient">Featured Services</span>
          </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover top-quality services promoted by verified businesses across India
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <motion.article
              key={service.id}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.12 }}
              variants={fadeInUp}
              {...cardHover}
              className="bg-card rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 card-hover"
            >
              <div className="relative">
                <Image
                  src={service.image}
                  alt={service.name}
                  width={300}
                  height={300}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                
                {/* Promotion Badge */}
                <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getPromotionBadgeColor(service.promotionType)}`}>
                  {getPromotionIcon(service.promotionType)}
                  {service.promotionType.toUpperCase()}
                </div>

                {/* Discount Badge */}
                {service.originalPrice && (
                  <Badge className="absolute top-2 right-12 bg-red-500 text-white">
                    {Math.round(((service.originalPrice - service.basePrice) / service.originalPrice) * 100)}% OFF
                  </Badge>
                )}

                {/* Wishlist Button */}
                <Button className="absolute top-2 right-2 bg-white/80 hover:bg-white w-8 h-8 p-0">
                  <Heart className="h-4 w-4" />
                </Button>

                {/* Verified Provider Badge */}
                {service.provider.verified && (
                  <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    ✓ Verified
                  </div>
                )}
              </div>

              <div className="p-4">
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
                        className={`h-3 w-3 ${
                          i < Math.floor(service.rating)
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
                      {service.provider.name}
                    </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-muted-foreground">
                      {service.provider.location}
                    </p>
                    <span className="text-xs text-muted-foreground">•</span>
                    <p className="text-xs text-muted-foreground">
                      {service.provider.experience}
                    </p>
                  </div>
                </div>

                {/* Service Tags */}
                <div className="mb-3 flex flex-wrap gap-1">
                  {service.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1 btn-primary text-sm px-3 py-2"
                    onClick={() => handleContactProvider(service)}
                    disabled={!service.available}
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {service.available ? 'Contact Now' : 'Unavailable'}
                  </Button>
                  <Link href={`/services/${service.id}`}>
                    <Button className="text-sm px-3 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground">
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/services">
            <Button className="border border-input bg-background hover:bg-accent hover:text-accent-foreground px-8 py-3">
              View All Services
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}