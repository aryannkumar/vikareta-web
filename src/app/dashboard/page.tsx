'use client';

import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (!loading) {
      checkAuthAndRedirect();
    }
  }, [loading, user, isAuthenticated]);

  const checkAuthStatus = async () => {
    try {
      // Check authentication using secure HttpOnly cookies via same-origin proxy
      const response = await fetch(`/api/auth/me`, {
        credentials: 'include', // Include HttpOnly cookies
      });
      
      const result = await response.json();
      
      if (result.success && result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const checkAuthAndRedirect = async () => {
    try {
      console.log('Dashboard: Checking authentication...');
      console.log('Dashboard: User result:', user ? 'User found' : 'No user');
      
      if (isAuthenticated && user) {
        // User is authenticated, redirect to dashboard
        console.log('Dashboard: User authenticated, redirecting to dashboard');
        setRedirecting(true);
        
        const dashboardUrl = process.env.NODE_ENV === 'production' 
          ? 'https://dashboard.vikareta.com' 
          : 'https://dashboard.vikareta.com';
        
        // With HttpOnly cookies, no need to pass tokens via URL
        // The browser will automatically include authentication cookies
        
        // Add a small delay to show the redirect message
        setTimeout(() => {
          window.location.href = dashboardUrl;
        }, 1000);
      } else {
        // User not authenticated, redirect to login
        console.log('Dashboard: No user found, redirecting to login');
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 1000);
      }
    } catch (error) {
      // If there's an error, redirect to login
      console.error('Dashboard: Authentication error:', error);
      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 1000);
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