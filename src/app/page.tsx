'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight, ShieldCheck, FileCheck2, Boxes, Package, Store, CheckCircle, Search, MessageCircle, Settings, Play, Star } from 'lucide-react';
import { ProcurementJourney } from '@/components/sections/ProcurementJourney';
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

  return (
    <div className="relative">
      {/* Hero: matte, no glassmorphism */}
      <section className="relative overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[70vh]">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700"
              >
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                <span className="text-orange-700 font-semibold text-sm">Enterprise Procurement</span>
                <span className="text-orange-600/80 text-sm">Simplified & Streamlined</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.6 }}
                className="space-y-6"
              >
                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-none">
                  <span className="block text-gray-900 dark:text-white">Procure</span>
                  <motion.span
                    className="block text-orange-700 dark:text-amber-400"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    Smarter & Faster
                  </motion.span>
                  <span className="block text-gray-900 dark:text-white text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mt-2">
                    with Trusted Businesses
                  </span>
                </h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                  className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed"
                >
                  B2B procurement platform that unifies sourcing, RFQs, supplier management, and compliance—built for{' '}
                  <span className="text-orange-600 font-semibold">speed</span>,{' '}
                  <span className="text-amber-600 font-semibold">transparency</span>, and{' '}
                  <span className="text-orange-700 font-semibold">enterprise-scale savings</span>.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4 pt-2"
                >
                  <motion.button
                    onClick={() => router.push('/rfqs')}
                    className="group relative bg-orange-600 hover:bg-orange-700 text-white px-10 py-4 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-200 text-lg"
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="relative flex items-center justify-center gap-3">
                      <Play className="h-6 w-6" />
                      <span>Start Procurement Journey</span>
                      <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={() => router.push('/contact')}
                    className="group relative border border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-10 py-4 rounded-xl font-semibold transition-all duration-200 text-lg dark:text-orange-400 dark:border-orange-400 dark:hover:bg-orange-400 dark:hover:text-gray-900"
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="relative flex items-center justify-center gap-3">
                      <MessageCircle className="h-6 w-6" />
                      <span>Talk to Procurement Expert</span>
                    </div>
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>

            <div className="relative">
              <div className="relative z-10 p-8 lg:p-12 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
                  <ProcurementJourney isMobile={isMobile} />
                </motion.div>
              </div>
              {/* No glossy floating accents */}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white dark:bg-gray-900 border-l border-r border-gray-100/20 dark:border-gray-800/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">How Procurement Works</motion.h2>
            <motion.p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Simple, streamlined process from requirement to delivery—designed for enterprise efficiency
            </motion.p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Post Requirements', description: 'Create detailed RFQs with specifications, quantities, and delivery requirements', icon: Search },
              { step: '02', title: 'Receive Quotes', description: 'Get competitive quotes from verified suppliers within 24-48 hours', icon: MessageCircle },
              { step: '03', title: 'Compare & Select', description: 'Evaluate suppliers based on price, quality, compliance, and delivery terms', icon: CheckCircle },
              { step: '04', title: 'Manage Orders', description: 'Track orders, manage payments, and ensure compliance with enterprise standards', icon: Settings },
            ].map((item, index) => (
              <motion.div key={item.step} className="relative group" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 h-full">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mb-4">
                      <item.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center shadow-lg border-2 border-orange-200 dark:border-orange-800">
                      <span className="text-sm font-bold text-orange-600">{item.step}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <motion.button onClick={() => router.push('/rfqs')} className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-semibold">
              Get Started with RFQ
            </motion.button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <CategoryGrid />

      {/* Featured Products - render only if real data exists */}
      {data.featuredProducts.length > 0 && (
      <section className="py-24 bg-white border-l border-r border-orange-100/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">Featured Products</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">From verified suppliers for business-grade needs</p>
          </div>

          {(
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {data.featuredProducts
                .filter((p: any) => p && (p.images?.length || p.image) && p.name && typeof p.price === 'number')
                .slice(0, 4)
                .map((product: any, index: number) => (
                  <motion.div key={product.id || index} className="group bg-white rounded-3xl p-6 border border-gray-200 hover:border-orange-200 transition-colors duration-200 overflow-hidden" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }} whileHover={{ y: -4 }}>
                    <div className="relative overflow-hidden rounded-2xl mb-6">
                      {product.images?.[0] && (
                        <motion.img src={product.images[0]} alt={product.name} className="w-full h-48 object-cover" />
                      )}

                      <div className="absolute top-3 left-3 flex gap-2">
                        {typeof product.discount === 'number' && (
                          <div className="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-bold">-{product.discount}%</div>
                        )}
                        {product.supplier?.verified && (
                          <div className="bg-green-600 text-white px-3 py-1 rounded-md text-xs font-bold">Verified</div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors leading-tight">{product.name}</h3>
                        {(product.description || product.shortDescription) && (
                          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed mt-2">{product.description || product.shortDescription}</p>
                        )}
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          {typeof product.price === 'number' && (
                            <span className="text-3xl font-bold text-orange-700">₹{product.price.toLocaleString()}</span>
                          )}
                          {typeof product.originalPrice === 'number' && (
                            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                          )}
                        </div>
                        {(typeof product.rating === 'number' || typeof product.reviews?.average === 'number') && (
                          <div className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-xl border border-yellow-200">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-bold text-yellow-700">{typeof product.rating === 'number' ? product.rating : product.reviews?.average}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <Store className="h-3 w-3 text-white" />
                          </div>
                          {(product.supplier?.name || product.brand) && (
                            <span className="text-sm text-gray-600 font-medium truncate">{product.supplier?.name || product.brand}</span>
                          )}
                        </div>
                        {typeof product.inStock === 'boolean' && (
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                              {product.inStock ? 'In Stock' : 'Limited'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          )}

          <div className="text-center mt-20">
            <div className="bg-white rounded-3xl p-12 border border-orange-100/50">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Find Your Perfect Products?</h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">Browse our complete catalog of products from verified suppliers.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-4 rounded-2xl font-bold" onClick={() => router.push('/products')}>
                  <div className="flex items-center gap-3">
                    <Package className="h-6 w-6" />
                    <span>Browse All Products</span>
                    <ArrowRight className="h-6 w-6" />
                  </div>
                </motion.button>
                <motion.button className="border border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-10 py-4 rounded-2xl font-bold" onClick={() => router.push('/rfqs')}>
                  <div className="flex items-center gap-3">
                    <Search className="h-6 w-6" />
                    <span>Request Custom Quote</span>
                  </div>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
  </section>
  )}

      {/* Featured Services - render only if real data exists */}
      {data.featuredServices.length > 0 && (
      <section className="py-24 bg-white border-l border-r border-orange-100/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">Featured Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Certified providers offering specialized solutions</p>
          </div>

          {(
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.featuredServices
                .filter((s: any) => s && (s.images?.length || s.image) && s.name)
                .slice(0, 3)
                .map((service: any, index: number) => (
                  <motion.div key={service.id || index} className="group bg-white rounded-3xl p-8 border border-gray-200 hover:border-orange-200 transition-colors duration-200 overflow-hidden" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }} whileHover={{ y: -4 }}>
                    <div className="relative overflow-hidden rounded-2xl mb-6">
                      {service.images?.[0] && (
                        <motion.img src={service.images[0]} alt={service.name} className="w-full h-48 object-cover" />
                      )}

                    <motion.div className="absolute top-3 left-3 bg-orange-600 text-white px-3 py-1.5 rounded-md text-xs font-bold" initial={{ scale: 0, x: -20 }} animate={{ scale: 1, x: 0 }}>
                      {service.serviceType || service.category}
                    </motion.div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-bold text-2xl text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors leading-tight">{service.name}</h3>
                        {service.description && (
                          <p className="text-gray-600 line-clamp-3 leading-relaxed mt-3">{service.description}</p>
                        )}
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          {typeof (service.basePrice ?? service.price) === 'number' && (
                            <span className="text-3xl font-bold text-orange-700">₹{((service.basePrice ?? service.price) as number).toLocaleString()}</span>
                          )}
                          <span className="text-sm text-gray-500 font-medium">Starting from</span>
                        </div>
                        {typeof service.rating === 'number' && (
                          <div className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-xl border border-yellow-200">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-bold text-yellow-700">{service.rating}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <Store className="h-4 w-4 text-white" />
                          </div>
                          {service.provider?.name && (
                            <span className="text-sm text-gray-600 font-medium block leading-tight">{service.provider.name}</span>
                          )}
                        </div>
                        {service.deliveryTime && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-3 py-1 rounded-full font-semibold bg-green-100 text-green-700">{service.deliveryTime}</span>
                          </div>
                        )}
                      </div>

                      {service.features?.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {service.features.slice(0, 3).map((feature: string, idx: number) => (
                            <span key={idx} className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded-lg font-medium">
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
            </div>
          )}

          <div className="text-center mt-20">
            <div className="bg-white rounded-3xl p-12 border border-orange-100/50">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Specialized Business Services?</h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">Connect with certified professionals offering tailored solutions for your business operations and growth objectives.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-4 rounded-2xl font-bold" onClick={() => router.push('/services')}>
                  <div className="flex items-center gap-3">
                    <Store className="h-6 w-6" />
                    <span>Explore All Services</span>
                    <ArrowRight className="h-6 w-6" />
                  </div>
                </motion.button>
                <motion.button className="border border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-10 py-4 rounded-2xl font-bold" onClick={() => router.push('/rfqs')}>
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-6 w-6" />
                    <span>Post Service Requirements</span>
                  </div>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
  </section>
  )}

      {/* Testimonials */}
      <TestimonialsSection />

      {/* CTA */}
      <CTASection />
    </div>
  );
}