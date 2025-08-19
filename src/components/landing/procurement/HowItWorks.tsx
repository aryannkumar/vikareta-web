"use client";

import { motion } from 'framer-motion';
import { FileText, Users2, Rocket, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    title: 'Post Your RFQ',
    desc: 'Share requirements, quantities, and timelines in minutes.',
    icon: FileText,
  },
  {
    title: 'Compare Quotes',
    desc: 'Receive verified quotes and negotiate with confidence.',
    icon: Users2,
  },
  {
    title: 'Approve & Order',
    desc: 'Streamlined approvals and PO generation in one place.',
    icon: CheckCircle2,
  },
  {
    title: 'Track to Delivery',
    desc: 'Stay in control with live status and milestones.',
    icon: Rocket,
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Procurement, Made Simple</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">A clear, guided flow from sourcing to delivery—optimized for teams.</p>
        </div>

        <div className="relative">
          {/* timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-orange-300 via-orange-200 to-transparent md:-translate-x-1/2" />

          <div className="space-y-10">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className={`grid md:grid-cols-2 gap-8 items-center`}
              >
                <div className={`order-2 md:order-1 ${i % 2 === 0 ? 'md:text-right md:col-start-1' : 'md:col-start-2'}`}>
                  <div className="inline-flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center">
                      <s.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-semibold text-orange-700">Step {i + 1}</span>
                  </div>
                  <h3 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">{s.title}</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">{s.desc}</p>
                </div>
                <div className={`order-1 md:order-2 ${i % 2 === 0 ? 'md:col-start-2' : 'md:col-start-1'}`}>
                  <motion.div
                    className="rounded-2xl border border-orange-200/50 dark:border-orange-900/30 bg-orange-50/50 dark:bg-orange-900/10 p-6 shadow-sm"
                    whileHover={{ y: -4 }}
                  >
                    <div className="h-36 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
