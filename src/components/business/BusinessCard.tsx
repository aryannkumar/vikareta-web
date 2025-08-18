import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeInUp, cardHover } from '@/lib/motion';

interface BusinessCardProps {
  business: any;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  const tags = [] as string[];
  if (business?.category) tags.push(business.category);
  if (business?.tags && Array.isArray(business.tags)) {
    for (const t of business.tags) {
      if (tags.length >= 5) break;
      if (!tags.includes(t)) tags.push(t);
    }
  }

  // prefer subcategories for tags
  if (business?.subcategories && Array.isArray(business.subcategories)) {
    for (const t of business.subcategories) {
      if (tags.length >= 5) break;
      if (!tags.includes(t)) tags.push(t);
    }
  }

  const location = business?.address || business?.location || business?.provider?.location || '';
  const name = business?.name || (business?.id ? `Listing ${String(business.id).slice(0, 6)}` : 'Untitled Listing');

  return (
    <motion.article
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.12 }}
      variants={fadeInUp}
      {...cardHover}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
    >
      <div className="relative h-40 w-full bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-transparent">
        {business?.coverImage ? (
          <Image src={business.coverImage} alt={name} fill className="object-cover" />
        ) : (
          <div className="h-40 w-full flex items-center justify-center text-gray-500">
            <svg width="84" height="84" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-orange-400">
              <rect width="24" height="24" rx="4" fill="#FFEFD5" />
              <path d="M6 14l3-4 2 3 3-5 4 7H6z" fill="#FDBA74" />
            </svg>
          </div>
        )}

        <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/60 rounded-full px-3 py-1 flex items-center gap-2">
          <div className="text-xs font-medium text-orange-600 dark:text-orange-300">{business?.category || 'General'}</div>
        </div>

        <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/60 rounded-full px-3 py-1 flex items-center gap-2 text-sm">
          <Star className="h-3 w-3 text-yellow-400" />
          <span className="font-medium">{(business?.rating || 0).toFixed(1)}</span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden text-xl font-semibold text-gray-700">
            {business?.logo ? (
              <Image src={business.logo} alt={name} width={48} height={48} className="object-cover" />
            ) : (
              <span>{name.charAt(0)}</span>
            )}
          </div>

          <div className="flex-1">
            <Link href={`/businesses/${business?.id}`} className="font-semibold text-lg text-gray-900 dark:text-white hover:underline">
              {name}
            </Link>
            <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              <span className="truncate max-w-[220px]">{location || 'Unknown location'}</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 line-clamp-3 flex-1">{business?.description || 'No description available.'}</p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 5).map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/businesses/${business?.id}`} className="inline-flex items-center gap-2 bg-orange-600 text-white py-2 px-3 rounded-lg hover:bg-orange-700 transition">View</Link>
            <button className="bg-transparent border border-gray-200 dark:border-gray-700 py-2 px-3 rounded-lg text-sm" onClick={() => { if (business?.phone) window.location.href = `tel:${business.phone}`; else window.alert('Contact flow'); }}>
              Contact
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default BusinessCard;
