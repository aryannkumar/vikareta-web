'use client';

import { useState, useEffect } from 'react';
import { HeroSection } from '@/components/sections/HeroSection';
import { CategoriesSection } from '@/components/sections/CategoriesSection';
import { FeaturedProducts } from '@/components/sections/FeaturedProducts';
import { FeaturedServices } from '@/components/sections/FeaturedServices';
import { StatsSection } from '@/components/sections/StatsSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { CTASection } from '@/components/sections/CTASection';
import { productsApi } from '@/lib/api/products';
import { servicesApi } from '@/lib/api/services';
import { apiClient } from '@/lib/api/client';

export default function HomePage() {
  const [hasProducts, setHasProducts] = useState(false);
  const [hasServices, setHasServices] = useState(false);
  const [hasCategories, setHasCategories] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkDataAvailability();
  }, []);

  const checkDataAvailability = async () => {
    try {
      // Check if we have products
      const productsResponse = await productsApi.getFeaturedProducts(4);
      setHasProducts(productsResponse.success && productsResponse.data.length > 0);

      // Check if we have services
      const servicesResponse = await servicesApi.getServices({ limit: 4, sortOrder: 'desc' });
      setHasServices(servicesResponse.success && servicesResponse.data.services.length > 0);

      // Check if we have categories
      const categoriesResponse = await apiClient.get('/categories', { limit: 8 });
      setHasCategories(categoriesResponse.success && Array.isArray(categoriesResponse.data) && categoriesResponse.data.length > 0);

    } catch (error) {
      console.error('Error checking data availability:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      <HeroSection />
      <StatsSection />
      {hasCategories && <CategoriesSection />}
      {hasProducts && <FeaturedProducts />}
      {hasServices && <FeaturedServices />}
      <TestimonialsSection />
      <CTASection />
    </main>
  );
}