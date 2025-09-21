"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

export function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowResults(false);
    }
  };

  // Debounced search
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const debounceTimer = setTimeout(async () => {
      setIsSearching(true);
      try {
        // Search across all types
        const [productsRes, servicesRes, businessesRes] = await Promise.allSettled([
          fetch(`/api/search/products?q=${encodeURIComponent(searchQuery)}&limit=3`),
          fetch(`/api/search/services?q=${encodeURIComponent(searchQuery)}&limit=3`),
          fetch(`/api/search/businesses?q=${encodeURIComponent(searchQuery)}&limit=3`)
        ]);

        const results: any[] = [];

        if (productsRes.status === 'fulfilled' && productsRes.value.ok) {
          const products = await productsRes.value.json();
          results.push(...(products.data || []).map((item: any) => ({ ...item, type: 'products' })));
        }

        if (servicesRes.status === 'fulfilled' && servicesRes.value.ok) {
          const services = await servicesRes.value.json();
          results.push(...(services.data || []).map((item: any) => ({ ...item, type: 'services' })));
        }

        if (businessesRes.status === 'fulfilled' && businessesRes.value.ok) {
          const businesses = await businessesRes.value.json();
          results.push(...(businesses.data || []).map((item: any) => ({ ...item, type: 'businesses' })));
        }

        setSearchResults(results.slice(0, 6)); // Limit to 6 results
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  return (
    <section className="relative min-h-screen bg-white overflow-hidden">
      {/* Full Width SVG Hero */}
      <Image
        src="/img/vikareta-hero.svg"
        alt="Vikareta"
        fill
        className="object-cover"
        priority
      />

      {/* Search Bar - Mid Right */}
      <div className="absolute top-1/3 right-6 left-1/2 z-20">
        <div className="relative">
          <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 overflow-hidden hover:bg-white/15 transition-all duration-300 w-full">
            <div className="flex">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/80" />
                <Input
                  type="text"
                  placeholder="Search products, services & businesses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchResults.length > 0 && setShowResults(true)}
                  onBlur={() => setTimeout(() => setShowResults(false), 200)}
                  className="h-10 pl-11 pr-4 border-0 bg-transparent focus:ring-0 focus:outline-none rounded-none text-white placeholder:text-white/70"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-3 w-3 border-2 border-white/50 border-t-transparent"></div>
                  </div>
                )}
              </div>
              <Button type="submit" className="h-10 px-5 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white font-medium rounded-none border-l border-white/20">
                Search
              </Button>
            </div>
          </form>

          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 overflow-hidden z-30">
              {searchResults.map((result, index) => (
                <button
                  key={`${result.type}-${result.id || index}`}
                  onClick={() => {
                    if (result.type === 'products') {
                      router.push(`/products/${result.id}`);
                    } else if (result.type === 'services') {
                      router.push(`/services/${result.id}`);
                    } else if (result.type === 'businesses') {
                      router.push(`/businesses/${result.id}`);
                    }
                    setShowResults(false);
                    setSearchQuery('');
                  }}
                  className="w-full px-5 py-3 text-left hover:bg-white/10 transition-colors duration-200 border-b border-white/20 last:border-b-0 text-white"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      result.type === 'products' ? 'bg-blue-400' :
                      result.type === 'services' ? 'bg-green-400' : 'bg-purple-400'
                    }`}></div>
                    <div className="flex-1">
                      <div className="font-medium text-white truncate">
                        {result.name || result.title || result.businessName}
                      </div>
                      <div className="text-sm text-white/70 capitalize">
                        {result.type.slice(0, -1)} • {result.category || result.industry || 'General'}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
              <button
                onClick={handleSearch}
                className="w-full px-5 py-3 text-center text-orange-300 hover:bg-white/10 transition-colors duration-200 border-t border-white/20 font-medium"
              >
                View all results
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Hero Text - Left Side */}
      <div className="absolute left-8 top-1/2 transform -translate-y-1/2 z-20 max-w-lg">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight drop-shadow-lg">
          Your B2B
          <span className="block text-orange-500 drop-shadow-lg">
            Success Story
          </span>
          <span className="block text-3xl md:text-4xl font-bold text-gray-900 drop-shadow-lg">
            Starts Here
          </span>
        </h1>
        <p className="text-xl text-orange-800 leading-relaxed drop-shadow-md max-w-md">
          Connect with India's <br/> most trusted Businesses, discover premium services and products <br/>
          and access professional services—all in one platform.
        </p>
      </div>
    </section>
  );
}