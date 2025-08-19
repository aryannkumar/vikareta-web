"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const items = [
  {
    quote: 'We cut sourcing cycle time by 40% and improved supplier quality.',
    name: 'Anita Verma',
    role: 'Head of Procurement, Nova Electronics',
  },
  {
    quote: 'The RFQ and approval workflows fit our internal controls perfectly.',
    name: 'Rahul Mehta',
    role: 'Procurement Lead, SteelWorks',
  },
  {
    quote: 'Vendor onboarding with compliance checks saved us weeks of effort.',
    name: 'Pooja Shah',
    role: 'Operations, GreenChem Labs',
  },
];

export default function TestimonialsCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % items.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Loved by procurement teams</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300">Fast, transparent, and enterprise-ready.</p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <div className="overflow-hidden rounded-2xl border border-orange-200/50 dark:border-orange-900/30 bg-white/70 dark:bg-gray-900/50 backdrop-blur-md p-8 shadow-lg">
            <div className="relative h-40">
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center"
                >
                  <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200">“{items[index].quote}”</p>
                  <div className="mt-4 text-sm font-semibold text-orange-700">{items[index].name}</div>
                  <div className="text-xs text-gray-500">{items[index].role}</div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-6 flex justify-center gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-2.5 w-2.5 rounded-full transition-all ${i === index ? 'bg-orange-600 w-6' : 'bg-orange-200'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
