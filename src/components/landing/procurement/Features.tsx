"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { ShieldCheck, FileSearch, Building2, Workflow, Sparkles } from 'lucide-react';
import { useRef } from 'react';

const features = [
  {
    title: 'Verified Suppliers',
    desc: 'Multi-step verification, compliance checks, and ratings.',
    icon: ShieldCheck,
  },
  {
    title: 'Smart RFQs',
    desc: 'Templated specs, attachments, and quote comparisons.',
    icon: FileSearch,
  },
  {
    title: 'Vendor Management',
    desc: 'Onboarding, contracts, SLAs, and performance tracking.',
    icon: Building2,
  },
  {
    title: 'Approval Workflows',
    desc: 'Custom steps, budget limits, and audit trails.',
    icon: Workflow,
  },
];

export default function Features() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <section ref={ref} className="relative py-20">
      <motion.div style={{ y }} className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-orange-50/60 dark:via-orange-900/10 to-transparent" />
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-semibold">Built for Enterprise</span>
          </div>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Everything you need to procure at scale</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Powerful capabilities with clean, modern UX and smooth motion.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="rounded-2xl p-6 bg-white dark:bg-gray-900 border border-orange-200/50 dark:border-orange-900/30 shadow-sm hover:shadow-md"
            >
              <div className="h-12 w-12 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
