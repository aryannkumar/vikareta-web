'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, Award, Building2, Users } from 'lucide-react';

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
    <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Success Stories
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Hear from enterprise leaders who have transformed their procurement with our platform
          </motion.p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Main Testimonial with enhanced animations */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentIndex}
              className="bg-white/80 dark:bg-gray-800/80 rounded-3xl p-8 md:p-12 relative overflow-hidden backdrop-blur-md border border-orange-200/50 dark:border-orange-800/50 shadow-2xl"
              initial={{ opacity: 0, x: 100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -100, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {/* Decorative elements */}
              <motion.div
                className="absolute top-6 right-6 w-20 h-20 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-full blur-xl"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 8, repeat: Infinity }}
              />
              <Quote className="absolute top-6 right-6 h-12 w-12 text-orange-200 dark:text-orange-800 z-10" />
              
              <div className="relative z-10">
                {/* Enhanced star rating */}
                <motion.div 
                  className="flex items-center mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  {renderStars(testimonials[currentIndex].rating)}
                  <span className="ml-2 text-sm font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                    {testimonials[currentIndex].rating}.0/5.0
                  </span>
                </motion.div>
                
                <motion.blockquote 
                  className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed font-medium"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  "{testimonials[currentIndex].content}"
                </motion.blockquote>
                
                <motion.div 
                  className="flex items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl mr-4 shadow-lg">
                    {testimonials[currentIndex].name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-xl text-gray-900 dark:text-white">
                      {testimonials[currentIndex].name}
                    </div>
                    <div className="text-orange-600 dark:text-orange-400 font-semibold">
                      {testimonials[currentIndex].role}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Building2 className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {testimonials[currentIndex].company} • {testimonials[currentIndex].location}
                      </span>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-2 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                    <Award className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 dark:text-green-400 text-sm font-semibold">Verified Business</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Enhanced Navigation */}
          <div className="flex items-center justify-between mt-8">
            <motion.button
              onClick={prevTestimonial}
              className="group flex items-center space-x-2 bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-800 rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-orange-50 dark:hover:bg-orange-900/20"
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="h-5 w-5 text-orange-600 group-hover:text-orange-700" />
              <span className="font-semibold text-gray-700 dark:text-gray-300 group-hover:text-orange-600">Previous</span>
            </motion.button>

            {/* Animated dots indicator */}
            <div className="flex space-x-3">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-orange-600 scale-125'
                      : 'bg-orange-200 hover:bg-orange-400 dark:bg-orange-800 dark:hover:bg-orange-600'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            <motion.button
              onClick={nextTestimonial}
              className="group flex items-center space-x-2 bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-800 rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-orange-50 dark:hover:bg-orange-900/20"
              whileHover={{ scale: 1.05, x: 2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="font-semibold text-gray-700 dark:text-gray-300 group-hover:text-orange-600">Next</span>
              <ChevronRight className="h-5 w-5 text-orange-600 group-hover:text-orange-700" />
            </motion.button>
          </div>
        </div>

          {/* Enhanced testimonials grid with stagger animation */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="group relative"
              initial={{ opacity: 0, y: 20, rotateX: 15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2, type: 'spring', stiffness: 100 }}
              whileHover={{ y: -15, rotateX: -5, scale: 1.02 }}
              style={{ perspective: '1000px' }}
            >
              <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-600 h-full relative overflow-hidden">
                {/* Animated background pattern */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500"
                  animate={{
                    background: [
                      `radial-gradient(circle at 20% 80%, rgba(249, 115, 22, 0.1) 0%, transparent 50%)`,
                      `radial-gradient(circle at 80% 20%, rgba(251, 191, 36, 0.1) 0%, transparent 50%)`,
                      `radial-gradient(circle at 20% 80%, rgba(249, 115, 22, 0.1) 0%, transparent 50%)`
                    ]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Quote icon */}
                <motion.div
                  className="absolute top-6 right-6 text-orange-400 opacity-20"
                  initial={{ scale: 0, rotate: -45 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.2 + 0.3, type: 'spring', stiffness: 300 }}
                >
                  <Quote className="h-8 w-8" />
                </motion.div>

                {/* Rating stars */}
                <motion.div
                  className="flex items-center mb-6"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 + 0.1 }}
                >
                  {renderStars(testimonial.rating)}
                </motion.div>

                <motion.p
                  className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8 text-lg italic relative z-10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 + 0.4 }}
                >
                  "{testimonial.content.substring(0, 150)}..."
                </motion.p>

                <motion.div
                  className="flex items-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 + 0.6 }}
                >
                  <motion.div
                    className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    {testimonial.name.charAt(0)}
                  </motion.div>
                  <div>
                    <motion.h4
                      className="font-bold text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 + 0.7 }}
                    >
                      {testimonial.name}
                    </motion.h4>
                    <motion.p
                      className="text-sm text-gray-600 dark:text-gray-400"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 + 0.7 }}
                    >
                      {testimonial.role}
                    </motion.p>
                    <motion.p
                      className="text-sm font-medium text-orange-600"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 + 0.8 }}
                    >
                      {testimonial.company}
                    </motion.p>
                  </div>
                </motion.div>

                {/* Animated border */}
                <motion.div
                  className="absolute inset-0 rounded-3xl border-2 border-transparent"
                  animate={{
                    borderImageSource: [
                      `linear-gradient(45deg, rgba(249, 115, 22, 0.3), rgba(251, 191, 36, 0.3))`,
                      `linear-gradient(45deg, rgba(251, 191, 36, 0.3), rgba(249, 115, 22, 0.3))`,
                      `linear-gradient(45deg, rgba(249, 115, 22, 0.3), rgba(251, 191, 36, 0.3))`
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    borderImageSlice: 1,
                    borderImageWidth: '2px'
                  }}
                />
              </div>

              {/* Floating elements */}
              <motion.div
                className="absolute -top-3 -right-3 w-4 h-4 bg-orange-400 rounded-full opacity-0 group-hover:opacity-60"
                animate={{ y: [0, -12, 0], scale: [1, 1.3, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.3 }}
              />
              <motion.div
                className="absolute -bottom-3 -left-3 w-3 h-3 bg-amber-400 rounded-full opacity-0 group-hover:opacity-40"
                animate={{ y: [0, -10, 0], scale: [1, 1.4, 1] }}
                transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Trust indicators */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold">4.9/5 Average Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              <span className="font-semibold">5000+ Happy Businesses</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-500" />
              <span className="font-semibold">ISO 27001 Certified</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}