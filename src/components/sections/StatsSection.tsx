'use client';

import React, { useEffect, useState } from 'react';
import { Users, Package, Store, TrendingUp } from 'lucide-react';

interface Stat {
  icon: React.ReactNode;
  value: string;
  label: string;
  description: string;
}

export function StatsSection() {
  const [stats, setStats] = useState<Stat[]>([
    {
      icon: <Users className="h-8 w-8" />,
      value: '0',
      label: 'Active Buyers',
      description: 'Registered buyers on platform'
    },
    {
      icon: <Store className="h-8 w-8" />,
      value: '0',
      label: 'Verified Suppliers',
      description: 'Trusted business partners'
    },
    {
      icon: <Package className="h-8 w-8" />,
      value: '0',
      label: 'Products Listed',
      description: 'Quality products available'
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      value: '0',
      label: 'Successful Deals',
      description: 'Completed transactions'
    }
  ]);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('stats-section');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Animate counters
    const targetValues = [50000, 5000, 100000, 25000];
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setStats(prevStats => 
        prevStats.map((stat, index) => ({
          ...stat,
          value: Math.floor(targetValues[index] * progress).toLocaleString()
        }))
      );

      if (currentStep >= steps) {
        clearInterval(interval);
        // Set final values
        setStats(prevStats => 
          prevStats.map((stat, index) => ({
            ...stat,
            value: targetValues[index].toLocaleString() + (index === 0 || index === 1 ? '+' : '')
          }))
        );
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <section 
      id="stats-section"
      className="py-20 bg-gradient-to-r from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Join India's fastest-growing B2B marketplace and connect with verified suppliers and buyers
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center group hover:scale-105 transition-transform duration-300"
            >
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl shadow-xl mb-6 group-hover:shadow-2xl transition-all duration-300 ${
                index === 0 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-500' :
                index === 1 ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-500' :
                index === 2 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-500' :
                'bg-orange-100 dark:bg-orange-900/30 text-orange-500'
              }`}>
                {stat.icon}
              </div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                {stat.value}
              </div>
              <div className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                {stat.label}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}