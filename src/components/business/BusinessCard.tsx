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
  if (business.category) tags.push(business.category);
  if (business.tags && Array.isArray(business.tags)) {
    for (const t of business.tags) {
      if (tags.length >= 5) break;
      if (!tags.includes(t)) tags.push(t);
    }
  }

  if (business.subcategories && Array.isArray(business.subcategories)) {
    for (const t of business.subcategories) {
      if (tags.length >= 5) break;
      if (!tags.includes(t)) tags.push(t);
    }
  }

  // Fallback address parsing
  const location = business.address || business.location || business.provider?.location || '';

  return (
    <motion.article
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.12 }}
      variants={fadeInUp}
      {...cardHover}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <div className="relative h-44 w-full bg-gray-100 dark:bg-gray-700">
        {business.coverImage ? (
          <Image src={business.coverImage} alt={business.name} fill className="object-cover" />
        ) : (
          <div className="h-44 w-full flex items-center justify-center text-gray-500">No image</div>
        )}

        <div className="absolute top-3 left-3 bg-orange-50 dark:bg-orange-900/60 rounded-full px-3 py-1 flex items-center gap-2">
          <div className="text-xs font-medium text-orange-600 dark:text-orange-300">{business.category || 'General'}</div>
        </div>

        <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/60 rounded-full px-3 py-1 flex items-center gap-2 text-sm">
          <Star className="h-3 w-3 text-yellow-400" />
          <span className="font-medium">{(business.rating || 0).toFixed(1)}</span>
          <span className="text-gray-500">· {business.reviewCount || 0}</span>
        </div>

        <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-black/60 rounded-full px-3 py-1 flex items-center gap-2">
          {business.logo ? (
            <Image src={business.logo} alt={business.name} width={40} height={40} className="rounded-full object-cover" />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-600">{(business.name || 'B').charAt(0)}</div>
          )}
          <div className="flex flex-col">
            <Link href={`/businesses/${business.id}`} className="font-semibold text-sm text-gray-900 dark:text-white hover:underline">
              {business.name || 'Untitled Business'}
            </Link>
            <div className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate max-w-[180px]">{location || 'Unknown location'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">{business.description || 'No description available.'}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {tags.slice(0, 5).map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <Link href={`/businesses/${business.id}`} className="flex-1 inline-flex items-center justify-center bg-orange-600 text-white py-2 px-3 rounded-lg hover:bg-orange-700 transition">View</Link>
          <button className="bg-transparent border border-gray-200 dark:border-gray-700 py-2 px-3 rounded-lg text-sm" onClick={() => { if (business.phone) window.location.href = `tel:${business.phone}`; else window.alert('Contact flow'); }}>
            Contact
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default BusinessCard;
