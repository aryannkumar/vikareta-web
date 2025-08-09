'use client';

import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Testimonial {
  id: string;
  name: string;
  company: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
  location: string;
}

export function TestimonialsSection() {
  const [testimonials] = useState<Testimonial[]>([
    {
      id: '1',
      name: 'Rajesh Kumar',
      company: 'Kumar Industries',
      role: 'Managing Director',
      content: 'Vikareta has transformed our procurement process. We found reliable suppliers for our manufacturing needs and reduced costs by 30%. The platform is user-friendly and the support team is excellent.',
      rating: 5,
      location: 'Mumbai, Maharashtra'
    },
    {
      id: '2',
      name: 'Priya Sharma',
      company: 'TechSolutions Pvt Ltd',
      role: 'Procurement Manager',
      content: 'As a buyer, I appreciate the quality verification process and the wide range of suppliers available. The RFQ system has made it easy to get competitive quotes quickly.',
      rating: 5,
      location: 'Bangalore, Karnataka'
    },
    {
      id: '3',
      name: 'Amit Patel',
      company: 'Patel Textiles',
      role: 'Owner',
      content: 'Being a supplier on Vikareta has opened new markets for us. We have connected with buyers from across India and our business has grown significantly in the past year.',
      rating: 5,
      location: 'Ahmedabad, Gujarat'
    },
    {
      id: '4',
      name: 'Sunita Reddy',
      company: 'Reddy Exports',
      role: 'Export Manager',
      content: 'The platform has excellent features for managing orders and tracking shipments. Customer support is responsive and helps resolve issues quickly.',
      rating: 5,
      location: 'Hyderabad, Telangana'
    },
    {
      id: '5',
      name: 'Vikram Singh',
      company: 'Singh Enterprises',
      role: 'CEO',
      content: 'Vikareta has been instrumental in scaling our business. The quality of leads and the ease of doing business on the platform is remarkable.',
      rating: 5,
      location: 'Delhi, NCR'
    }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            What Our Users Say
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Hear from businesses that have grown with Vikareta
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Testimonial */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 md:p-12 relative overflow-hidden">
            <Quote className="absolute top-6 right-6 h-12 w-12 text-blue-100 dark:text-gray-700" />
            
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                {renderStars(testimonials[currentIndex].rating)}
              </div>
              
              <blockquote className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                "{testimonials[currentIndex].content}"
              </blockquote>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  {testimonials[currentIndex].name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonials[currentIndex].name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonials[currentIndex].role}, {testimonials[currentIndex].company}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    {testimonials[currentIndex].location}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={prevTestimonial}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>

            {/* Dots Indicator */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex
                      ? 'bg-blue-600'
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={nextTestimonial}
              className="flex items-center space-x-2"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Additional Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                {renderStars(testimonial.rating)}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                "{testimonial.content.substring(0, 120)}..."
              </p>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white text-sm">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}