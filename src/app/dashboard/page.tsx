'use client';

import { useEffect, useState } from 'react';
import { SSOAuthClient } from '@/lib/auth/sso-client';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    checkAuthAndRedirect();
  }, []);

  const checkAuthAndRedirect = async () => {
    try {
      const ssoClient = new SSOAuthClient();
      console.log('Dashboard: Checking authentication...');
      
      const user = await ssoClient.getCurrentUser();
      console.log('Dashboard: User result:', user ? 'User found' : 'No user');
      
      if (user) {
        // User is authenticated, redirect to dashboard with token
        console.log('Dashboard: User authenticated, redirecting to dashboard');
        setRedirecting(true);
        
        // Get the access token to pass to dashboard
        const accessToken = localStorage.getItem('vikareta_access_token');
        
        const dashboardUrl = process.env.NODE_ENV === 'production' 
          ? 'https://dashboard.vikareta.com' 
          : 'https://dashboard.vikareta.com';
        
        // Add token as URL parameter for cross-domain authentication
        const redirectUrl = accessToken 
          ? `${dashboardUrl}?token=${encodeURIComponent(accessToken)}&redirect=main`
          : dashboardUrl;
        
        // Add a small delay to show the redirect message
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 1000);
      } else {
        // User not authenticated, redirect to login
        console.log('Dashboard: No user found, redirecting to login');
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 1000);
      }
    } catch (error) {
      // If there's an error (like 401), redirect to login
      console.error('Dashboard: Authentication error:', error);
      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Loading...</h1>
          <p className="text-gray-600">Checking authentication status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">
          {redirecting ? 'Redirecting to Dashboard...' : 'Redirecting to Login...'}
        </h1>
        <p className="text-gray-600 mb-6">
          {redirecting 
            ? 'You are being redirected to the Vikareta Dashboard.'
            : 'Please log in to access the dashboard.'
          }
        </p>
        <p className="text-sm text-gray-500">
          If you are not redirected automatically, 
          <a 
            href={redirecting 
              ? (process.env.NODE_ENV === 'production' ? 'https://dashboard.vikareta.com' : 'http://localhost:3002')
              : '/auth/login'
            }
            className="text-blue-600 hover:underline ml-1"
          >
            click here
          </a>
        </p>
      </div>
    </div>
  );
}