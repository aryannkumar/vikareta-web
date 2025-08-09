'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Star, 
  MessageCircle, 
  Heart, 
  Share2, 
  Clock, 
  Award, 
  CheckCircle,
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Shield,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast-provider';
import { formatPrice } from '@/lib/utils';

interface ServiceDetail {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  originalPrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  provider: {
    id: string;
    name: string;
    location: string;
    verified: boolean;
    experience: string;
    avatar: string;
    responseTime: string;
    completedProjects: number;
  };
  category: string;
  available: boolean;
  deliveryTime: string;
  serviceType: 'one-time' | 'monthly' | 'project-based';
  tags: string[];
  features: string[];
  packages: {
    id: string;
    name: string;
    price: number;
    features: string[];
    deliveryTime: string;
  }[];
  reviews: {
    id: string;
    user: string;
    rating: number;
    comment: string;
    date: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export default function ServiceDetailPage() {
  const params = useParams();
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const toast = useToast();

  // Mock service data
  const mockService: ServiceDetail = {
    id: '1',
    name: 'Professional Website Development',
    description: 'Get a fully responsive, modern website built with the latest technologies. Perfect for businesses looking to establish a strong online presence.',
    basePrice: 25000,
    originalPrice: 35000,
    images: [
      '/api/placeholder/600/400',
      '/api/placeholder/600/400',
      '/api/placeholder/600/400'
    ],
    rating: 4.8,
    reviewCount: 127,
    provider: {
      id: 'p1',
      name: 'TechCraft Solutions',
      location: 'Mumbai, Maharashtra',
      verified: true,
      experience: '5+ years',
      avatar: '/api/placeholder/100/100',
      responseTime: '< 1 hour',
      completedProjects: 150
    },
    category: 'IT Services',
    available: true,
    deliveryTime: '7-14 days',
    serviceType: 'project-based',
    tags: ['React', 'Node.js', 'MongoDB', 'Responsive Design'],
    features: [
      'Fully responsive design',
      'SEO optimized',
      'Fast loading speed',
      'Mobile-first approach',
      'Cross-browser compatibility',
      '30 days free support'
    ],
    packages: [
      {
        id: 'basic',
        name: 'Basic',
        price: 15000,
        features: [
          'Up to 5 pages',
          'Responsive design',
          'Basic SEO',
          '7 days delivery'
        ],
        deliveryTime: '7 days'
      },
      {
        id: 'standard',
        name: 'Standard',
        price: 25000,
        features: [
          'Up to 10 pages',
          'Responsive design',
          'Advanced SEO',
          'Contact forms',
          'Social media integration',
          '14 days delivery'
        ],
        deliveryTime: '14 days'
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 40000,
        features: [
          'Unlimited pages',
          'Custom design',
          'E-commerce integration',
          'Advanced SEO',
          'Analytics setup',
          'Priority support',
          '21 days delivery'
        ],
        deliveryTime: '21 days'
      }
    ],
    reviews: [
      {
        id: '1',
        user: 'Rajesh Kumar',
        rating: 5,
        comment: 'Excellent work! The website exceeded my expectations. Very professional and delivered on time.',
        date: '2024-01-15'
      },
      {
        id: '2',
        user: 'Priya Sharma',
        rating: 4,
        comment: 'Great service and good communication throughout the project. Highly recommended!',
        date: '2024-01-10'
      }
    ],
    faqs: [
      {
        question: 'What technologies do you use?',
        answer: 'We use modern technologies like React, Node.js, and MongoDB to ensure your website is fast, secure, and scalable.'
      },
      {
        question: 'Do you provide ongoing support?',
        answer: 'Yes, we provide 30 days of free support after delivery. Extended support packages are also available.'
      },
      {
        question: 'Can you help with hosting?',
        answer: 'Absolutely! We can help you choose the right hosting solution and set everything up for you.'
      }
    ]
  };

  useEffect(() => {
    fetchService();
  }, [params.id]);

  const fetchService = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setService(mockService);
    } catch (error) {
      console.error('Error fetching service:', error);
      toast.error('Error', 'Failed to load service details');
    } finally {
      setLoading(false);
    }
  };

  const handleContactProvider = () => {
    if (service) {
      toast.info('Contact Provider', `Redirecting to contact ${service.provider.name}`);
    }
  };

  const handleOrderNow = () => {
    if (service) {
      const selectedPkg = service.packages[selectedPackage];
      toast.success('Order Placed', `Order for ${selectedPkg.name} package initiated`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-muted rounded-lg h-96 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-muted rounded h-8 mb-4"></div>
                <div className="bg-muted rounded h-4 mb-2"></div>
                <div className="bg-muted rounded h-4 w-2/3"></div>
              </div>
              <div>
                <div className="bg-muted rounded-lg h-64"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Service not found</h2>
          <Link href="/services">
            <Button>Back to Services</Button>
          </Link>
        </div>
      </div>
    );
  }  return (

    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/services" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Service Images */}
            <div className="mb-8">
              <div className="relative">
                <Image
                  src={service.images[0]}
                  alt={service.name}
                  width={600}
                  height={400}
                  className="w-full h-96 object-cover rounded-lg"
                />
                {service.originalPrice && (
                  <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                    {Math.round(((service.originalPrice - service.basePrice) / service.originalPrice) * 100)}% OFF
                  </Badge>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button size="sm" variant="secondary" className="bg-white/80 hover:bg-white">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary" className="bg-white/80 hover:bg-white">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {service.images.length > 1 && (
                <div className="flex gap-2 mt-4">
                  {service.images.slice(1).map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      alt={`${service.name} ${index + 2}`}
                      width={120}
                      height={80}
                      className="w-20 h-16 object-cover rounded cursor-pointer hover:opacity-80"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Service Info */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-secondary text-secondary-foreground">
                  {service.category}
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                  {service.serviceType.replace('-', ' ')}
                </Badge>
              </div>
              
              <h1 className="text-3xl font-bold mb-4">{service.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(service.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {service.rating} ({service.reviewCount} reviews)
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Delivery: {service.deliveryTime}</span>
                </div>
              </div>

              <p className="text-muted-foreground mb-6">{service.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {service.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-8">
              <div className="border-b">
                <nav className="flex space-x-8">
                  {['overview', 'reviews', 'faq'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                        activeTab === tab
                          ? 'border-primary text-primary'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="mt-6">
                {activeTab === 'overview' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">What's Included</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
                    <div className="space-y-6">
                      {service.reviews.map((review) => (
                        <div key={review.id} className="border-b pb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < review.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="font-medium text-sm">{review.user}</span>
                            <span className="text-xs text-muted-foreground">{review.date}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'faq' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
                    <div className="space-y-4">
                      {service.faqs.map((faq, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">{faq.question}</h4>
                          <p className="text-sm text-muted-foreground">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Provider Info */}
              <div className="bg-card rounded-lg border p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={service.provider.avatar}
                    alt={service.provider.name}
                    width={60}
                    height={60}
                    className="w-15 h-15 rounded-full object-cover"
                  />
                  <div>
                    <Link href={`/providers/${service.provider.id}`}>
                      <h3 className="font-semibold hover:text-primary">
                        {service.provider.name}
                        {service.provider.verified && (
                          <Shield className="inline h-4 w-4 ml-1 text-green-500" />
                        )}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {service.provider.location}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Experience</div>
                    <div className="font-medium">{service.provider.experience}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Response Time</div>
                    <div className="font-medium">{service.provider.responseTime}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Projects</div>
                    <div className="font-medium">{service.provider.completedProjects}+</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Rating</div>
                    <div className="font-medium">{service.rating}/5</div>
                  </div>
                </div>
              </div>

              {/* Package Selection */}
              <div className="bg-card rounded-lg border p-6">
                <h3 className="font-semibold mb-4">Choose Package</h3>
                
                <div className="space-y-3 mb-6">
                  {service.packages.map((pkg, index) => (
                    <div
                      key={pkg.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedPackage === index
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedPackage(index)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{pkg.name}</h4>
                        <span className="font-bold text-primary">
                          {formatPrice(pkg.price)}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        Delivery: {pkg.deliveryTime}
                      </div>
                      <ul className="text-xs space-y-1">
                        {pkg.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <Button 
                    className="w-full btn-primary"
                    onClick={handleOrderNow}
                    disabled={!service.available}
                  >
                    {service.available ? 'Order Now' : 'Unavailable'}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleContactProvider}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Provider
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}