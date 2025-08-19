"use client";

import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, FileCheck2, Boxes, LineChart } from 'lucide-react';
import { AnimatedButton, FloatingElement } from '../../Animated';
import { useRouter } from 'next/navigation';

export default function ProcurementHero() {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28">
      {/* Warm orange gradient background with parallax blobs */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute -top-24 -left-16 w-96 h-96 bg-gradient-to-br from-orange-400/30 via-amber-400/20 to-orange-600/30 rounded-full blur-3xl"
          animate={{ x: [0, 30, -20, 0], y: [0, 10, -15, 0], scale: [1, 1.05, 0.98, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-20 -right-10 w-[34rem] h-[34rem] bg-gradient-to-tr from-rose-300/20 via-orange-400/20 to-amber-500/30 rounded-full blur-3xl"
          animate={{ x: [0, -20, 25, 0], y: [0, -15, 10, 0], rotate: [0, 120, 240, 360] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="container mx-auto px-6 relative">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-700 border border-orange-200 shadow-sm"
            >
              <span className="inline-flex h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              Enterprise Procurement, Simplified
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8, ease: 'easeOut' }}
              className="mt-6 text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-gray-900 dark:text-white"
            >
              Procure smarter with
              <span className="block bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text text-transparent">
                trusted suppliers at scale
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl"
            >
              Modern B2B procurement platform that unifies sourcing, RFQs, supplier management, and compliance—built for speed, transparency, and savings.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-8 flex flex-col sm:flex-row gap-4"
            >
              <AnimatedButton size="lg" onClick={() => router.push('/rfq')} className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700">
                Get Started – Post RFQ
                <ArrowRight className="ml-2 h-5 w-5" />
              </AnimatedButton>
              <AnimatedButton size="lg" variant="outline" onClick={() => router.push('/contact')} className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white dark:text-orange-400 dark:border-orange-400">
                Talk to Sales
              </AnimatedButton>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="mt-8 grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300"
            >
              <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-orange-600" /> Verified Suppliers</li>
              <li className="flex items-center gap-2"><FileCheck2 className="h-4 w-4 text-orange-600" /> Contract-ready</li>
              <li className="flex items-center gap-2"><Boxes className="h-4 w-4 text-orange-600" /> Product + Services</li>
              <li className="flex items-center gap-2"><LineChart className="h-4 w-4 text-orange-600" /> Analytics</li>
            </motion.ul>
          </div>

          {/* Motion visual on right */}
          <div className="relative">
            <div className="relative z-10 rounded-3xl p-6 bg-white/70 dark:bg-gray-800/60 border border-orange-200/40 dark:border-orange-900/30 shadow-2xl backdrop-blur-md">
              <motion.div className="grid grid-cols-2 gap-4">
                {["Sourcing", "RFQs", "Approvals", "Vendors", "Orders", "Invoices"].map((label, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i, duration: 0.5 }}
                    className="rounded-2xl p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/10 border border-orange-200/60 dark:border-orange-800/40 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="text-sm font-semibold text-orange-700 dark:text-orange-300">{label}</div>
                    <motion.div
                      className="mt-3 h-2 w-full bg-orange-100/70 dark:bg-orange-900/40 rounded-full overflow-hidden"
                    >
                      <motion.div
                        className="h-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                        initial={{ width: '10%' }}
                        whileInView={{ width: '90%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: 'easeInOut' }}
                      />
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* floating accents */}
            <FloatingElement className="absolute -top-6 -left-6 w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500/30 to-amber-500/30 blur-md" />
            <FloatingElement className="absolute -bottom-6 -right-8 w-20 h-20 rounded-full bg-gradient-to-br from-amber-400/30 to-orange-600/30 blur-xl" delay={1.8} />
          </div>
        </div>
      </div>
    </section>
  );
}
