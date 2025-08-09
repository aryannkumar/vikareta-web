'use client';

import { useEffect } from 'react';
import { Metadata } from 'next';

// Note: metadata export doesn't work with 'use client', so we'll handle this differently
export default function DashboardPage() {
  useEffect(() => {
    // Redirect to the local dashboard service
    window.location.href = 'http://localhost:3002';
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Redirecting to Dashboard...</h1>
        <p className="text-gray-600 mb-6">
          You are being redirected to the Vikareta Dashboard.
        </p>
        <p className="text-sm text-gray-500">
          If you are not redirected automatically, 
          <a 
            href="http://localhost:3002" 
            className="text-blue-600 hover:underline ml-1"
          >
            click here
          </a>
        </p>
      </div>
    </div>
  );
}