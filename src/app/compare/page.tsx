'use client';

import React, { Suspense } from 'react';
import ComparePageContent from './ComparePageContent';

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading comparison...</p>
        </div>
      </div>
    }>
      <ComparePageContent />
    </Suspense>
  );
}