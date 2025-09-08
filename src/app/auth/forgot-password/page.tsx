'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

// Local UI components
const Button = ({ children, onClick, disabled, type, variant, className }: any) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
      variant === 'outline' 
        ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
        : variant === 'ghost'
        ? 'bg-transparent text-gray-700 hover:bg-gray-100'
        : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className || ''}`}
  >
    {children}
  </button>
);

const useToast = () => ({
  success: (title: string, message: string) => console.log(`SUCCESS: ${title} - ${message}`),
  error: (title: string, message: string) => console.log(`ERROR: ${title} - ${message}`),
});

function ForgotPasswordPageContent() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const toast = useToast();

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  // Helper to get CSRF token
  const getCSRFToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    
    const cookies = document.cookie.split(';');
    const csrfCookie = cookies.find(cookie => 
      cookie.trim().startsWith('XSRF-TOKEN=')
    );
    
    if (csrfCookie) {
      return decodeURIComponent(csrfCookie.split('=')[1]);
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get backend API base URL
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || 
        (process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : 'https://api.vikareta.com');
      
      const response = await fetch(`${apiBase}/api/auth/forgot-password`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(getCSRFToken() && { 'X-XSRF-TOKEN': getCSRFToken()! })
        },
        body: JSON.stringify({ email }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSent(true);
        toast.success('Email Sent', 'Password reset instructions have been sent to your email');
      } else {
        setError(result.error?.message || 'Failed to send reset email');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || 
        (process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : 'https://api.vikareta.com');
      
      const response = await fetch(`${apiBase}/api/auth/forgot-password`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(getCSRFToken() && { 'X-XSRF-TOKEN': getCSRFToken()! })
        },
        body: JSON.stringify({ email }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Email Sent', 'Password reset instructions have been sent again');
      } else {
        toast.error('Error', result.error?.message || 'Failed to resend email');
      }
    } catch (error) {
      console.error('Resend error:', error);
      toast.error('Error', 'Failed to resend email');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-red-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative flex items-center justify-center min-h-screen px-4 py-8 mobile-padding">
          <div className="max-w-md w-full">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full mb-4 sm:mb-6">
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                Check Your Email
              </h1>
              
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                We&apos;ve sent password reset instructions to:
              </p>
              
              <div className="bg-amber-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 border border-amber-200">
                <p className="font-medium text-gray-900 text-sm sm:text-base break-all">{email}</p>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 mb-6 sm:mb-8">
                Didn&apos;t receive the email? Check your spam folder or try again.
              </p>

              <div className="space-y-3 sm:space-y-4">
                <Button
                  onClick={handleResend}
                  disabled={loading}
                  variant="outline"
                  className="w-full bg-white hover:bg-amber-50 border-amber-200 text-amber-700 hover:border-amber-300 py-2.5 sm:py-3 text-sm sm:text-base"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Resend Email'
                  )}
                </Button>

                <Link href="/auth/login">
                  <Button variant="ghost" className="w-full text-amber-600 hover:bg-amber-50 hover:text-amber-700 py-2.5 sm:py-3 text-sm sm:text-base">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-red-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative flex items-center justify-center min-h-screen px-4 py-8 mobile-padding">
        <div className="max-w-md w-full">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <Link href="/" className="inline-block mb-4 sm:mb-6">
                <div className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center mx-auto shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <img 
                    src="/img/logo.png" 
                    alt="Vikareta Logo" 
                    className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 object-contain" 
                  />
                </div>
              </Link>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Forgot Password?
              </h1>
              <p className="text-sm sm:text-base text-gray-600 px-2">
                Enter your email address and we&apos;ll send you instructions to reset your password.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    className={`block w-full pl-9 sm:pl-10 pr-3 py-3 sm:py-4 border-2 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors text-sm sm:text-base ${
                      error 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-200 bg-white hover:border-amber-300'
                    } text-gray-900 placeholder-gray-500`}
                    placeholder="Enter your email address"
                    disabled={loading}
                  />
                </div>
                {error && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {error}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 sm:py-4 text-sm sm:text-base font-medium rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 animate-spin" />
                    Sending Instructions...
                  </>
                ) : (
                  'Send Reset Instructions'
                )}
              </Button>
            </form>

            {/* Back to Login */}
            <div className="text-center mt-6 sm:mt-8">
              <Link 
                href="/auth/login" 
                className="inline-flex items-center text-sm sm:text-base text-amber-600 hover:text-amber-700 font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Sign In
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 sm:mt-8">
            <p className="text-sm sm:text-base text-gray-600">
              Remember your password?{' '}
              <Link href="/auth/login" className="text-amber-600 hover:text-amber-700 font-semibold">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
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
      <ForgotPasswordPageContent />
    </>
  );
}