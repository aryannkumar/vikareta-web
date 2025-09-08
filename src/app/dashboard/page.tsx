'use client';

import { useEffect, useState } from 'react';

function DashboardPageContent() {
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative flex items-center justify-center min-h-screen px-4 py-8 mobile-padding">
          <div className="max-w-md w-full">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full mb-4 sm:mb-6">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                Loading Dashboard
              </h1>

              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Checking your authentication status...
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-60 h-60 bg-gradient-to-br from-purple-400/10 to-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative flex items-center justify-center min-h-screen px-4 py-8 mobile-padding">
        <div className="max-w-md w-full">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 text-center">
            <div className="mb-6 sm:mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4 sm:mb-6">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                {redirecting ? 'Welcome Back!' : 'Authentication Required'}
              </h1>

              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-2">
                {redirecting
                  ? 'You are being redirected to your personalized dashboard.'
                  : 'Please log in to access your dashboard and account features.'
                }
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-blue-200">
              <div className="flex items-center justify-center mb-3 sm:mb-4">
                <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-blue-600"></div>
              </div>
              <p className="text-xs sm:text-sm text-blue-700 font-medium">
                {redirecting ? 'Preparing your dashboard...' : 'Redirecting to login page...'}
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <p className="text-xs sm:text-sm text-gray-500">
                If you are not redirected automatically,{' '}
                <a
                  href={redirecting
                    ? (process.env.NODE_ENV === 'production' ? 'https://dashboard.vikareta.com' : 'https://dashboard.vikareta.com')
                    : '/auth/login'
                  }
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                >
                  click here
                </a>
              </p>

              {redirecting && (
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-400">
                    Taking you to your personalized dashboard experience...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <>
      <style jsx global>{`
        @media (max-width: 640px) {
          .mobile-padding {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
      `}</style>
      <DashboardPageContent />
    </>
  );
}