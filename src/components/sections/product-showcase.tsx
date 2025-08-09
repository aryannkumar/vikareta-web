'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Star, Heart, ShoppingCart, Eye, TrendingUp, 
  MapPin, Clock, Shield, Zap, ArrowRight 
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviews: number;
  image: string;
  supplier: string;
  location: string;
  verified: boolean;
  trending: boolean;
  discount?: number;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Steel Pipes',
    category: 'Construction',
    price: '₹450',
    originalPrice: '₹500',
    rating: 4.8,
    reviews: 234,
    image: '/api/placeholder/300/200',
    supplier: 'Steel Industries Ltd',
    location: 'Mumbai',
    verified: true,
    trending: true,
    discount: 10
  },
  {
    id: '2',
    name: 'Cotton Fabric Rolls',
    category: 'Textiles',
    price: '₹280',
    rating: 4.6,
    reviews: 156,
    image: '/api/placeholder/300/200',
    supplier: 'Textile Hub',
    location: 'Surat',
    verified: true,
    trending: false
  },
  {
    id: '3',
    name: 'Industrial Machinery',
    category: 'Manufacturing',
    price: '₹2,50,000',
    rating: 4.9,
    reviews: 89,
    image: '/api/placeholder/300/200',
    supplier: 'Machinery Corp',
    location: 'Chennai',
    verified: true,
    trending: true
  },
  {
    id: '4',
    name: 'Electronic Components',
    category: 'Electronics',
    price: '₹1,200',
    originalPrice: '₹1,400',
    rating: 4.7,
    reviews: 312,
    image: '/api/placeholder/300/200',
    supplier: 'Tech Solutions',
    location: 'Bangalore',
    verified: true,
    trending: false,
    discount: 15
  }
];

export function ProductShowcase() {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mockProducts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-premium-aurora opacity-30"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-shimmer">Featured Products</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover trending products from verified suppliers across India
          </p>
        </div>

        {/* Featured Product Carousel */}
        <div className="mb-16">
          <div className="relative max-w-4xl mx-auto">
            <div className="card-premium p-8 glass-effect premium-border">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="relative group">
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <ShoppingCart className="w-8 h-8 text-white" />
                        </div>
                        <p>Product Image</p>
                      </div>
                    </div>
                  </div>
                  
                  {mockProducts[currentSlide].trending && (
                    <Badge className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                  
                  {mockProducts[currentSlide].discount && (
                    <Badge className="absolute top-4 right-4 bg-green-500 text-white">
                      {mockProducts[currentSlide].discount}% OFF
                    </Badge>
                  )}
                </div>

                <div>
                  <Badge className="mb-4 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {mockProducts[currentSlide].category}
                  </Badge>
                  
                  <h3 className="text-3xl font-bold mb-4 text-gradient-primary">
                    {mockProducts[currentSlide].name}
                  </h3>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${
                            i < Math.floor(mockProducts[currentSlide].rating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        {mockProducts[currentSlide].rating} ({mockProducts[currentSlide].reviews} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-3xl font-bold text-gradient-primary">
                      {mockProducts[currentSlide].price}
                    </span>
                    {mockProducts[currentSlide].originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        {mockProducts[currentSlide].originalPrice}
                      </span>
                    )}
                    <span className="text-sm text-gray-600 dark:text-gray-400">per unit</span>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Shield className="w-4 h-4 mr-1 text-green-500" />
                      {mockProducts[currentSlide].supplier}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                      {mockProducts[currentSlide].location}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button className="btn-primary flex-1">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button variant="outline" size="lg">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="lg">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {mockProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-orange-500 w-8' 
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-orange-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {mockProducts.map((product, index) => (
            <div
              key={product.id}
              className="card-premium card-hover relative overflow-hidden group"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Product Image */}
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-t-xl relative overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <ShoppingCart className="w-12 h-12" />
                </div>
                
                {/* Overlay Actions */}
                <div className={`absolute inset-0 bg-black/50 flex items-center justify-center gap-2 transition-opacity duration-300 ${
                  hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'
                }`}>
                  <Button size="sm" variant="secondary">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button size="sm" className="btn-primary">
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                </div>

                {/* Badges */}
                {product.trending && (
                  <Badge className="absolute top-2 left-2 bg-orange-500 text-white text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Hot
                  </Badge>
                )}
                {product.discount && (
                  <Badge className="absolute top-2 right-2 bg-green-500 text-white text-xs">
                    -{product.discount}%
                  </Badge>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <Badge className="mb-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {product.category}
                </Badge>
                
                <h3 className="font-bold mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {product.name}
                </h3>
                
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3 h-3 ${
                        i < Math.floor(product.rating) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                  <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
                    ({product.reviews})
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold text-gradient-primary">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      {product.originalPrice}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <Shield className="w-3 h-3 mr-1 text-green-500" />
                    Verified
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {product.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link href="/products">
            <Button size="lg" className="btn-premium px-8">
              View All Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}