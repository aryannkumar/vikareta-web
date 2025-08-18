import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative h-44 w-full bg-gray-100 dark:bg-gray-700">
        {business.coverImage ? (
          <Image src={business.coverImage} alt={business.name} fill className="object-cover" />
        ) : (
          <div className="h-44 w-full flex items-center justify-center text-gray-500">No image</div>
        )}

        <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-black/60 rounded-full px-3 py-1 flex items-center gap-2">
          {business.logo ? (
            <Image src={business.logo} alt={business.name} width={32} height={32} className="rounded-full object-cover" />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-600">{(business.name || 'B').charAt(0)}</div>
          )}
          <div className="flex flex-col">
            <Link href={`/providers/${business.id}`} className="font-semibold text-sm text-gray-900 dark:text-white hover:underline">
              {business.name}
            </Link>
            <div className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate max-w-[180px]">{location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {business.isVerified || business.provider?.verified ? (
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs font-medium flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Verified
              </Badge>
            ) : null}
          </div>
          <div className="text-sm text-gray-500">{business.reviewCount || 0} reviews</div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">{business.description}</p>

        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 5).map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <Link href={`/providers/${business.id}`}>
            <button className="flex-1 btn-primary py-2 px-3 rounded-lg">View Profile</button>
          </Link>
          <button className="btn-secondary py-2 px-3 rounded-lg" onClick={() => { window.alert('Contact flow'); }}>
            Contact
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
