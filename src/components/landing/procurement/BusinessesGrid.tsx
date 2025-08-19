"use client";

import { motion } from 'framer-motion';

const businesses = [
  { name: 'Acme Manufacturing', tags: ['Machinery', 'OEM', 'CNC'] },
  { name: 'Vertex Logistics', tags: ['3PL', 'Warehousing', 'Cold Chain'] },
  { name: 'Nova Electronics', tags: ['Components', 'PCB', 'EMS'] },
  { name: 'GreenChem Labs', tags: ['Chemicals', 'R&D', 'Pharma'] },
  { name: 'SteelWorks', tags: ['Metals', 'Fabrication', 'Casting'] },
  { name: 'BrightTextiles', tags: ['Textiles', 'Dyeing', 'Export'] },
];

export default function BusinessesGrid() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Trusted by Leading Businesses</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Discover suppliers and service providers across categories.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((b, i) => (
            <motion.div
              key={b.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/60 p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="text-lg font-semibold text-gray-900 dark:text-white">{b.name}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {b.tags.map((t) => (
                  <motion.span
                    key={t}
                    whileHover={{ scale: 1.06 }}
                    className="px-3 py-1 text-xs rounded-full bg-orange-100 text-orange-700 border border-orange-200"
                  >
                    {t}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
