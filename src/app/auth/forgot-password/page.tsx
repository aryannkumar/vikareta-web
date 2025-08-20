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
        : 'bg-blue-600 text-white hover:bg-blue-700'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className || ''}`}
  >
    {children}
  </button>
);

const useToast = () => ({
  success: (title: string, message: string) => console.log(`SUCCESS: ${title} - ${message}`),
  error: (title: string, message: string) => console.log(`ERROR: ${title} - ${message}`),
});

export default function ForgotPasswordPage() {
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
      
      // Secure forgot password using HttpOnly cookie authentication
      const response = await fetch(`${apiBase}/api/auth/forgot-password`, {
        method: 'POST',
        credentials: 'include', // Include HttpOnly cookies
        headers: {
          'Content-Type': 'application/json',
          // Add CSRF token for security
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
      // Get backend API base URL
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || 
        (process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : 'https://api.vikareta.com');
      
      // Secure resend using HttpOnly cookie authentication
      const response = await fetch(`${apiBase}/api/auth/forgot-password`, {
        method: 'POST',
        credentials: 'include', // Include HttpOnly cookies
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            {/* Success Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-6">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Check Your Email
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We&apos;ve sent password reset instructions to:
            </p>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <p className="font-medium text-gray-900 dark:text-white">{email}</p>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
              Didn&apos;t receive the email? Check your spam folder or try again.
            </p>

            <div className="space-y-4">
              <Button
                onClick={handleResend}
                disabled={loading}
                variant="outline"
                className="w-full"
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
                <Button variant="ghost" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
              <span className="text-2xl font-bold text-white">V</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Forgot Password?
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Enter your email address and we&apos;ll send you instructions to reset your password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
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
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                    error 
                      ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                  } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                  placeholder="Enter your email address"
                  disabled={loading}
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 mt-2 text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-base font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Sending Instructions...
                </>
              ) : (
                'Send Reset Instructions'
              )}
            </Button>
          </form>

          {/* Back to Login */}
          <div className="text-center mt-8">
            <Link 
              href="/auth/login" 
              className="inline-flex items-center text-sm text-primary hover:text-primary/80 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Sign In
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Remember your password?{' '}
            <Link href="/auth/login" className="text-primary hover:text-primary/80">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}