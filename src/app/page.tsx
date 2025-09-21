'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight, ShieldCheck, FileCheck2, Boxes, Package, Store, CheckCircle, Search, MessageCircle, Settings, Play, Star } from 'lucide-react';
import { HeroSection } from '@/components/sections/HeroSection';
import { CategoryGrid } from '@/components/sections/CategoryGrid';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { CTASection } from '@/components/sections/CTASection';
import { productsApi } from '@/lib/api/products';
import { servicesApi } from '@/lib/api/services';
import { apiClient } from '@/lib/api/client';

interface HomePageData {
  categories: any[];
  featuredProducts: any[];
  featuredServices: any[];
  loading: boolean;
  error: string | null;
}

export default function HomePage() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [data, setData] = useState<HomePageData>({ categories: [], featuredProducts: [], featuredServices: [], loading: true, error: null });

  // Scroll-based animation refs
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Global scroll progress
  const { scrollYProgress } = useScroll();
  const globalY = useTransform(scrollYProgress, [0, 1], [0, -200]);

  // Section-specific scroll animations
  const { scrollY } = useScroll();
  const howItWorksY = useTransform(scrollY, [0, 1000], [0, -50]);
  const categoriesY = useTransform(scrollY, [500, 1500], [50, -50]);
  const productsY = useTransform(scrollY, [1000, 2000], [50, -50]);
  const servicesY = useTransform(scrollY, [1500, 2500], [50, -50]);

  // In-view animations
  const howItWorksInView = useInView(howItWorksRef, { once: true, margin: "-100px" });
  const categoriesInView = useInView(categoriesRef, { once: true, margin: "-100px" });
  const productsInView = useInView(productsRef, { once: true, margin: "-100px" });
  const servicesInView = useInView(servicesRef, { once: true, margin: "-100px" });
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setData((p) => ({ ...p, loading: true, error: null }));
        const [cats, prods, servs] = await Promise.allSettled([
          apiClient.get<any[]>('/categories', { limit: 12 }),
          productsApi.getFeaturedProducts(8),
          servicesApi.getFeaturedServices(8),
        ]);

        const categories = cats.status === 'fulfilled' && cats.value.success && Array.isArray(cats.value.data) ? cats.value.data : [];
        const featuredProducts = prods.status === 'fulfilled' && prods.value.success && Array.isArray(prods.value.data) ? prods.value.data : [];

        let featuredServices: any[] = [];
        if (servs.status === 'fulfilled' && servs.value.success) {
          const raw = servs.value.data as any;
          if (Array.isArray(raw)) featuredServices = raw;
          else if (Array.isArray(raw?.services)) featuredServices = raw.services;
          else if (Array.isArray(raw?.data)) featuredServices = raw.data;
        }

        setData({ categories, featuredProducts, featuredServices, loading: false, error: null });
      } catch (e: any) {
        setData((p) => ({ ...p, loading: false, error: e?.message || 'Failed to load' }));
      }
    })();
  }, []);

  // Connected section animations
  const sectionVariants = {
    hidden: { opacity: 0, y: 100, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <motion.div style={{ y: globalY }}>
        <HeroSection />
      </motion.div>

      {/* How it works - Connected with parallax */}
      <motion.section
        ref={howItWorksRef}
        className="relative py-16 bg-gradient-to-br from-white via-orange-50/30 to-amber-50/50 border-l border-r border-orange-100/20 overflow-hidden"
        style={{ y: howItWorksY }}
      >
        {/* Connecting gradient overlay from hero */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-orange-50/50 to-transparent pointer-events-none" />

        {/* Floating connection elements */}
        <motion.div
          className="absolute top-10 left-10 w-20 h-20 bg-orange-200/20 rounded-full blur-xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-20 right-20 w-16 h-16 bg-amber-200/20 rounded-full blur-xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 20, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        <motion.div
          className="container mx-auto px-6"
          variants={sectionVariants}
          initial="hidden"
          animate={howItWorksInView ? "visible" : "hidden"}
        >
          <motion.div
            variants={itemVariants}
            className="text-center mb-10"
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-3 text-gray-900"
              animate={howItWorksInView ? { scale: [0.9, 1.05, 1] } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              How Procurement Works
            </motion.h2>
            <motion.p
              className="text-base text-gray-600 max-w-2xl mx-auto"
              animate={howItWorksInView ? { opacity: [0, 1] } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Simple, streamlined process from requirement to delivery
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Post Requirements', description: 'Create detailed RFQs with specifications and requirements', icon: Search },
              { step: '02', title: 'Receive Quotes', description: 'Get competitive quotes from verified suppliers', icon: MessageCircle },
              { step: '03', title: 'Compare & Select', description: 'Evaluate suppliers based on price and quality', icon: CheckCircle },
              { step: '04', title: 'Manage Orders', description: 'Track orders and ensure compliance', icon: Settings },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                variants={itemVariants}
                className="relative group"
                whileHover={{
                  y: -5,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-orange-200/50 h-full shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="relative mb-4">
                    <motion.div
                      className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-3 shadow-md"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <item.icon className="h-6 w-6 text-white" />
                    </motion.div>
                    <motion.div
                      className="absolute -top-1 -right-1 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-orange-200"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                    >
                      <span className="text-xs font-bold text-orange-600">{item.step}</span>
                    </motion.div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>

                {/* Connection line between steps */}
                {index < 3 && (
                  <motion.div
                    className="hidden md:block absolute top-16 left-full w-6 h-0.5 bg-gradient-to-r from-orange-400 to-orange-500"
                    initial={{ scaleX: 0 }}
                    animate={howItWorksInView ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 + index * 0.2 }}
                    style={{ transformOrigin: 'left' }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={itemVariants}
            className="text-center mt-8"
          >
            <motion.button
              onClick={() => router.push('/rfqs')}
              className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center gap-2">
                Get Started with RFQ
                <ArrowRight className="h-4 w-4" />
              </span>
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Categories - Connected transition */}
      <motion.div
        ref={categoriesRef}
        style={{ y: categoriesY }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={categoriesInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <CategoryGrid />
        </motion.div>
      </motion.div>

      {/* Featured Products - Connected with smooth parallax */}
      {data.featuredProducts.length > 0 && (
      <motion.section
        ref={productsRef}
        className="relative py-20 bg-gradient-to-br from-white via-orange-50/20 to-amber-50/30 border-l border-r border-orange-100/30 overflow-hidden"
        style={{ y: productsY }}
      >
        {/* Connecting elements from previous section */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-orange-50/30 to-transparent pointer-events-none" />

        <motion.div
          className="container mx-auto px-6"
          variants={sectionVariants}
          initial="hidden"
          animate={productsInView ? "visible" : "hidden"}
        >
          <motion.div
            variants={itemVariants}
            className="text-center mb-12"
          >
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-4 text-gray-900"
              animate={productsInView ? { scale: [0.9, 1.02, 1] } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Featured Products
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600 max-w-2xl mx-auto"
              animate={productsInView ? { opacity: [0, 1] } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Premium products from verified suppliers for your business needs
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={sectionVariants}
          >
            {data.featuredProducts
              .filter((p: any) => p && (p.images?.length || p.image) && p.name && typeof p.price === 'number')
              .slice(0, 4)
              .map((product: any, index: number) => (
                <motion.div
                  key={product.id || index}
                  variants={itemVariants}
                  className="group bg-white rounded-2xl p-5 border border-gray-200 hover:border-orange-200 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-xl"
                  whileHover={{
                    y: -6,
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                >
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    {product.images?.[0] && (
                      <motion.img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-40 object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}

                    <div className="absolute top-2 left-2 flex gap-1">
                      {typeof product.discount === 'number' && (
                        <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">-{product.discount}%</div>
                      )}
                      {product.supplier?.verified && (
                        <div className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">✓ Verified</div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors leading-tight">{product.name}</h3>
                      {(product.description || product.shortDescription) && (
                        <p className="text-gray-600 text-sm line-clamp-1 leading-relaxed mt-1">{product.description || product.shortDescription}</p>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        {typeof product.price === 'number' && (
                          <span className="text-2xl font-bold text-orange-700">₹{product.price.toLocaleString()}</span>
                        )}
                        {typeof product.originalPrice === 'number' && (
                          <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                      {(typeof product.rating === 'number' || typeof product.reviews?.average === 'number') && (
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-200">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs font-bold text-yellow-700">{typeof product.rating === 'number' ? product.rating : product.reviews?.average}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <Store className="h-2.5 w-2.5 text-white" />
                        </div>
                        {(product.supplier?.name || product.brand) && (
                          <span className="text-xs text-gray-600 font-medium truncate">{product.supplier?.name || product.brand}</span>
                        )}
                      </div>
                      {typeof product.inStock === 'boolean' && (
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {product.inStock ? 'In Stock' : 'Limited'}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="text-center mt-12"
          >
            <div className="bg-white rounded-2xl p-8 border border-orange-100/50 shadow-lg max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Ready to Find Your Perfect Products?</h3>
              <p className="text-gray-600 mb-6 text-sm">Browse our complete catalog of products from verified suppliers.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.button
                  className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
                  onClick={() => router.push('/products')}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span>Browse All Products</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </motion.button>
                <motion.button
                  className="border border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 text-sm"
                  onClick={() => router.push('/rfqs')}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    <span>Request Quote</span>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.section>
      )}

      {/* Featured Services - Connected with smooth flow */}
      {data.featuredServices.length > 0 && (
      <motion.section
        ref={servicesRef}
        className="relative py-20 bg-gradient-to-br from-white via-amber-50/20 to-orange-50/30 border-l border-r border-orange-100/30 overflow-hidden"
        style={{ y: servicesY }}
      >
        {/* Connecting elements */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-amber-50/30 to-transparent pointer-events-none" />

        <motion.div
          className="container mx-auto px-6"
          variants={sectionVariants}
          initial="hidden"
          animate={servicesInView ? "visible" : "hidden"}
        >
          <motion.div
            variants={itemVariants}
            className="text-center mb-12"
          >
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-4 text-gray-900"
              animate={servicesInView ? { scale: [0.9, 1.02, 1] } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Featured Services
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600 max-w-2xl mx-auto"
              animate={servicesInView ? { opacity: [0, 1] } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Certified providers offering specialized business solutions
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={sectionVariants}
          >
            {data.featuredServices
              .filter((s: any) => s && (s.images?.length || s.image) && s.name)
              .slice(0, 3)
              .map((service: any, index: number) => (
                <motion.div
                  key={service.id || index}
                  variants={itemVariants}
                  className="group bg-white rounded-2xl p-5 border border-gray-200 hover:border-orange-200 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-xl"
                  whileHover={{
                    y: -6,
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                >
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    {service.images?.[0] && (
                      <motion.img
                        src={service.images[0]}
                        alt={service.name}
                        className="w-full h-40 object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}

                    <motion.div
                      className="absolute top-2 left-2 bg-orange-600 text-white px-2 py-1 rounded text-xs font-bold"
                      initial={{ scale: 0, x: -20 }}
                      animate={{ scale: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      {service.serviceType || service.category}
                    </motion.div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors leading-tight">{service.name}</h3>
                      {service.description && (
                        <p className="text-gray-600 line-clamp-2 leading-relaxed mt-1">{service.description}</p>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        {typeof (service.basePrice ?? service.price) === 'number' && (
                          <span className="text-2xl font-bold text-orange-700">₹{((service.basePrice ?? service.price) as number).toLocaleString()}</span>
                        )}
                        <span className="text-sm text-gray-500 font-medium">Starting from</span>
                      </div>
                      {typeof service.rating === 'number' && (
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-200">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs font-bold text-yellow-700">{service.rating}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <Store className="h-2.5 w-2.5 text-white" />
                        </div>
                        {service.provider?.name && (
                          <span className="text-xs text-gray-600 font-medium truncate">{service.provider.name}</span>
                        )}
                      </div>
                      {service.deliveryTime && (
                        <span className="text-xs px-2 py-1 rounded-full font-semibold bg-green-100 text-green-700">{service.deliveryTime}</span>
                      )}
                    </div>

                    {service.features?.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {service.features.slice(0, 3).map((feature: string, idx: number) => (
                          <span key={idx} className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded font-medium">
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="text-center mt-12"
          >
            <div className="bg-white rounded-2xl p-8 border border-orange-100/50 shadow-lg max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Need Specialized Business Services?</h3>
              <p className="text-gray-600 mb-6 text-sm">Connect with certified professionals offering tailored solutions for your business.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.button
                  className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
                  onClick={() => router.push('/services')}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center gap-2">
                    <Store className="h-4 w-4" />
                    <span>Explore Services</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </motion.button>
                <motion.button
                  className="border border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 text-sm"
                  onClick={() => router.push('/rfqs')}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    <span>Post Requirements</span>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.section>
      )}

      {/* Testimonials - Connected flow */}
      <motion.div
        ref={testimonialsRef}
        initial={{ opacity: 0 }}
        animate={testimonialsInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <TestimonialsSection />
      </motion.div>

      {/* CTA - Final connected section */}
      <motion.div
        ref={ctaRef}
        initial={{ opacity: 0, y: 50 }}
        animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
      >
        <CTASection />
      </motion.div>
    </div>
  );
}