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
  Zap,
  Globe,
  Mail,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast-provider';
import { formatPrice } from '@/lib/utils';

interface ProviderDetail {
  id: string;
  name: string;
  avatar: string;
  coverImage: string;
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
  joinedDate: string;
  certifications: string[];
  portfolio: {
    id: string;
    title: string;
    image: string;
    category: string;
  }[];
  services: {
    id: string;
    name: string;
    price: number;
    image: string;
    rating: number;
  }[];
  reviews: {
    id: string;
    user: string;
    rating: number;
    comment: string;
    date: string;
    service: string;
  }[];
}

export default function ProviderProfilePage() {
  const params = useParams();
  const [provider, setProvider] = useState<ProviderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const toast = useToast();

  // Mock provider data
  const mockProvider: ProviderDetail = {
    id: '1',
    name: 'TechCraft Solutions',
    avatar: '/api/placeholder/150/150',
    coverImage: '/api/placeholder/800/300',
    location: 'Mumbai, Maharashtra',
    verified: true,
    experience: '5+ years',
    rating: 4.8,
    reviewCount: 127,
    completedProjects: 150,
    responseTime: '< 1 hour',
    skills: ['React', 'Node.js', 'MongoDB', 'AWS', 'TypeScript', 'GraphQL'],
    categories: ['IT Services', 'Web Development', 'Mobile Apps'],
    hourlyRate: 1500,
    available: true,
    description: 'Full-stack developer with 5+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud technologies. I help businesses transform their ideas into powerful digital solutions.',
    languages: ['English', 'Hindi', 'Marathi'],
    joinedDate: '2019-03-15',
    certifications: ['AWS Certified Developer', 'Google Cloud Professional', 'MongoDB Certified'],
    portfolio: [
      {
        id: '1',
        title: 'E-commerce Platform',
        image: '/api/placeholder/300/200',
        category: 'Web Development'
      },
      {
        id: '2',
        title: 'Mobile Banking App',
        image: '/api/placeholder/300/200',
        category: 'Mobile Development'
      },
      {
        id: '3',
        title: 'Analytics Dashboard',
        image: '/api/placeholder/300/200',
        category: 'Data Visualization'
      }
    ],
    services: [
      {
        id: '1',
        name: 'Professional Website Development',
        price: 25000,
        image: '/api/placeholder/200/150',
        rating: 4.8
      },
      {
        id: '2',
        name: 'Mobile App Development',
        price: 45000,
        image: '/api/placeholder/200/150',
        rating: 4.9
      },
      {
        id: '3',
        name: 'API Development & Integration',
        price: 15000,
        image: '/api/placeholder/200/150',
        rating: 4.7
      }
    ],
    reviews: [
      {
        id: '1',
        user: 'Rajesh Kumar',
        rating: 5,
        comment: 'Excellent work! The website exceeded my expectations. Very professional and delivered on time.',
        date: '2024-01-15',
        service: 'Website Development'
      },
      {
        id: '2',
        user: 'Priya Sharma',
        rating: 4,
        comment: 'Great service and good communication throughout the project. Highly recommended!',
        date: '2024-01-10',
        service: 'Mobile App Development'
      },
      {
        id: '3',
        user: 'Amit Patel',
        rating: 5,
        comment: 'Outstanding developer with deep technical knowledge. Will definitely work again.',
        date: '2024-01-05',
        service: 'API Development'
      }
    ]
  };

  useEffect(() => {
    fetchProvider();
  }, [params.id]);

  const fetchProvider = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProvider(mockProvider);
    } catch (error) {
      console.error('Error fetching provider:', error);
      toast.error('Error', 'Failed to load provider details');
    } finally {
      setLoading(false);
    }
  };

  const handleContactProvider = () => {
    if (provider) {
      toast.info('Contact Provider', `Redirecting to contact ${provider.name}`);
    }
  };

  const handleHireProvider = () => {
    if (provider) {
      toast.success('Hire Provider', `Initiating hiring process for ${provider.name}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-muted rounded-lg h-64 mb-8"></div>
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

  if (!provider) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Provider not found</h2>
          <Link href="/providers">
            <Button>Back to Providers</Button>
          </Link>
        </div>
      </div>
    );
  } 
 return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/providers" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Providers
        </Link>

        {/* Cover Image & Profile Header */}
        <div className="relative mb-8">
          <div className="relative h-64 rounded-lg overflow-hidden">
            <Image
              src={provider.coverImage}
              alt={`${provider.name} cover`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20"></div>
            
            <div className="absolute top-4 right-4 flex gap-2">
              <Button size="sm" variant="secondary" className="bg-white/80 hover:bg-white">
                <Heart className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="secondary" className="bg-white/80 hover:bg-white">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Profile Info Overlay */}
          <div className="absolute -bottom-16 left-6 flex items-end gap-6">
            <div className="relative">
              <Image
                src={provider.avatar}
                alt={provider.name}
                width={120}
                height={120}
                className="w-30 h-30 rounded-full border-4 border-background object-cover"
              />
              {provider.verified && (
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                  <Shield className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            
            <div className="pb-4">
              <h1 className="text-3xl font-bold text-white mb-2">{provider.name}</h1>
              <div className="flex items-center gap-4 text-white/90">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {provider.location}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Response: {provider.responseTime}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2">
            {/* Stats Bar */}
            <div className="bg-card rounded-lg border p-6 mb-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(provider.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="font-bold text-lg">{provider.rating}</div>
                  <div className="text-sm text-muted-foreground">{provider.reviewCount} reviews</div>
                </div>
                
                <div className="text-center">
                  <div className="font-bold text-lg">{provider.completedProjects}+</div>
                  <div className="text-sm text-muted-foreground">Projects</div>
                </div>
                
                <div className="text-center">
                  <div className="font-bold text-lg">{provider.experience}</div>
                  <div className="text-sm text-muted-foreground">Experience</div>
                </div>
                
                <div className="text-center">
                  <div className="font-bold text-lg">₹{provider.hourlyRate}</div>
                  <div className="text-sm text-muted-foreground">Per hour</div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-8">
              <div className="border-b">
                <nav className="flex space-x-8">
                  {['overview', 'portfolio', 'services', 'reviews'].map((tab) => (
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
                  <div className="space-y-6">
                    {/* About */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">About</h3>
                      <p className="text-muted-foreground leading-relaxed">{provider.description}</p>
                    </div>

                    {/* Skills */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {provider.skills.map((skill) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Categories */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Categories</h3>
                      <div className="flex flex-wrap gap-2">
                        {provider.categories.map((category) => (
                          <Badge key={category} className="bg-secondary text-secondary-foreground">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Languages */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Languages</h3>
                      <div className="flex flex-wrap gap-2">
                        {provider.languages.map((language) => (
                          <Badge key={language} variant="outline">
                            <Globe className="h-3 w-3 mr-1" />
                            {language}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Certifications */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Certifications</h3>
                      <div className="space-y-2">
                        {provider.certifications.map((cert) => (
                          <div key={cert} className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-primary" />
                            <span>{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'portfolio' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Portfolio</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {provider.portfolio.map((item) => (
                        <div key={item.id} className="bg-card rounded-lg border overflow-hidden hover:shadow-md transition-shadow">
                          <Image
                            src={item.image}
                            alt={item.title}
                            width={300}
                            height={200}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-4">
                            <h4 className="font-semibold mb-1">{item.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'services' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Services Offered</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {provider.services.map((service) => (
                        <div key={service.id} className="bg-card rounded-lg border p-4 hover:shadow-md transition-shadow">
                          <div className="flex gap-4">
                            <Image
                              src={service.image}
                              alt={service.name}
                              width={80}
                              height={60}
                              className="w-20 h-15 object-cover rounded"
                            />
                            <div className="flex-1">
                              <Link href={`/services/${service.id}`}>
                                <h4 className="font-semibold hover:text-primary transition-colors">
                                  {service.name}
                                </h4>
                              </Link>
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                <span className="text-sm text-muted-foreground">{service.rating}</span>
                              </div>
                              <div className="font-bold text-primary mt-2">
                                Starting at {formatPrice(service.price)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
                    <div className="space-y-6">
                      {provider.reviews.map((review) => (
                        <div key={review.id} className="border-b pb-6">
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
                            <span className="font-medium">{review.user}</span>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{review.date}</span>
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            Service: {review.service}
                          </div>
                          <p className="text-muted-foreground">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Contact & Hire */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Contact Card */}
              <div className="bg-card rounded-lg border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-3 h-3 rounded-full ${provider.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm font-medium">
                    {provider.available ? 'Available for work' : 'Currently unavailable'}
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Member since {new Date(provider.joinedDate).getFullYear()}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Responds within {provider.responseTime}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    className="w-full btn-primary"
                    onClick={handleHireProvider}
                    disabled={!provider.available}
                  >
                    {provider.available ? 'Hire Now' : 'Unavailable'}
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

              {/* Quick Stats */}
              <div className="bg-card rounded-lg border p-6">
                <h3 className="font-semibold mb-4">Quick Stats</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hourly Rate</span>
                    <span className="font-medium">₹{provider.hourlyRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Projects Completed</span>
                    <span className="font-medium">{provider.completedProjects}+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Success Rate</span>
                    <span className="font-medium">98%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Repeat Clients</span>
                    <span className="font-medium">85%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}