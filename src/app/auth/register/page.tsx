'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, Phone, Building, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast-provider';
import { useSSOAuth } from '@/lib/auth/use-sso-auth';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    company: '',
    location: '',
    userType: 'buyer' as 'buyer' | 'seller',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const router = useRouter();
  const toast = useToast();
  const { register } = useSSOAuth();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        userType: formData.userType as 'buyer' | 'seller',
        businessName: formData.company,
        location: formData.location
      };
      
      const success = await register(registrationData);
      
      if (success) {
        // Show success message
        toast.success('Registration Successful!', 'Your account has been created successfully.');
        setRedirecting(true);
        
        // Redirect to dashboard subdomain
        setTimeout(() => {
          const dashboardUrl = process.env.NODE_ENV === 'development' 
            ? 'http://localhost:3001/dashboard' 
            : 'https://dashboard.vikareta.com/dashboard';
          
          // Add auth token as URL parameter for cross-domain auth
          const token = localStorage.getItem('auth_token');
          if (token) {
            const urlWithAuth = `${dashboardUrl}?token=${encodeURIComponent(token)}`;
            window.location.href = urlWithAuth;
          } else {
            // Fallback to dashboard without token
            window.location.href = dashboardUrl;
          }
        }, 1500);
      }
    } catch (error) {
      console.error('Registration error:', error);
      // The error is already handled by the useSSOAuth hook and toast will be shown
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle social OAuth registration (redirect-based)
  const handleGoogleRegister = async () => {
    try {
      setLoading(true);
      
      // Use the backend OAuth flow
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.vikareta.com/api';
      const redirectUrl = `${apiUrl}/auth/google`;
      
      // Store current location for redirect after auth
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_return_url', window.location.pathname + window.location.search);
      }
      
      // Redirect to backend OAuth endpoint
      window.location.href = redirectUrl;
    } catch (error) {
      console.error('Google OAuth error:', error);
      toast.error('Error', 'Failed to initialize Google registration');
      setLoading(false);
    }
  };

  const handleLinkedInRegister = async () => {
    try {
      setLoading(true);
      
      // Use the backend OAuth flow
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.vikareta.com/api';
      const redirectUrl = `${apiUrl}/auth/linkedin`;
      
      // Store current location for redirect after auth
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_return_url', window.location.pathname + window.location.search);
      }
      
      // Redirect to backend OAuth endpoint
      window.location.href = redirectUrl;
    } catch (error) {
      console.error('LinkedIn OAuth error:', error);
      toast.error('Error', 'Failed to initialize LinkedIn registration');
      setLoading(false);
    }
  };

  const handleDigiLockerRegister = async () => {
    try {
      setLoading(true);
      
      // Use the backend OAuth flow
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.vikareta.com/api';
      const redirectUrl = `${apiUrl}/auth/digilocker`;
      
      // Store current location for redirect after auth
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_return_url', window.location.pathname + window.location.search);
      }
      
      // Redirect to backend OAuth endpoint
      window.location.href = redirectUrl;
    } catch (error) {
      console.error('DigiLocker OAuth error:', error);
      toast.error('Error', 'Failed to initialize DigiLocker registration');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block mb-6">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-xl">V</span>
            </div>
          </Link>
          <h2 className="text-3xl font-bold">Create your account</h2>
          <p className="mt-2 text-muted-foreground">
            Join Vikareta and start your business journey
          </p>
        </div>

        {/* User Type Selection */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleInputChange('userType', 'buyer')}
            className={`p-4 border rounded-lg text-center transition-colors ${
              formData.userType === 'buyer'
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-muted hover:border-primary/50'
            }`}
            disabled={loading}
          >
            <div className="font-medium">I'm a Buyer</div>
            <div className="text-xs text-muted-foreground mt-1">
              Looking for products & services
            </div>
          </button>
          <button
            type="button"
            onClick={() => handleInputChange('userType', 'seller')}
            className={`p-4 border rounded-lg text-center transition-colors ${
              formData.userType === 'seller'
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-muted hover:border-primary/50'
            }`}
            disabled={loading}
          >
            <div className="font-medium">I'm a Seller</div>
            <div className="text-xs text-muted-foreground mt-1">
              Offering products & services
            </div>
          </button>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background ${
                    errors.firstName ? 'border-red-500' : ''
                  }`}
                  placeholder="First name"
                  disabled={loading}
                />
              </div>
              {errors.firstName && (
                <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                  <AlertCircle className="h-3 w-3" />
                  {errors.firstName}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background ${
                  errors.lastName ? 'border-red-500' : ''
                }`}
                placeholder="Last name"
                disabled={loading}
              />
              {errors.lastName && (
                <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                  <AlertCircle className="h-3 w-3" />
                  {errors.lastName}
                </div>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background ${
                  errors.email ? 'border-red-500' : ''
                }`}
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>
            {errors.email && (
              <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                <AlertCircle className="h-3 w-3" />
                {errors.email}
              </div>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background ${
                  errors.phone ? 'border-red-500' : ''
                }`}
                placeholder="Enter your phone number"
                disabled={loading}
              />
            </div>
            {errors.phone && (
              <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                <AlertCircle className="h-3 w-3" />
                {errors.phone}
              </div>
            )}
          </div>

          {/* Company Field (Optional) */}
          <div>
            <label htmlFor="company" className="block text-sm font-medium mb-2">
              Company Name (Optional)
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                placeholder="Enter your company name"
                disabled={loading}
              />
            </div>
          </div>

          {/* Location Field (Optional) */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-2">
              Location (Optional)
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                placeholder="Enter your city, state"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background ${
                    errors.password ? 'border-red-500' : ''
                  }`}
                  placeholder="Create a password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background ${
                    errors.confirmPassword ? 'border-red-500' : ''
                  }`}
                  placeholder="Confirm your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                  <AlertCircle className="h-3 w-3" />
                  {errors.confirmPassword}
                </div>
              )}
            </div>
          </div>

          {/* Terms Agreement */}
          <div>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                disabled={loading}
              />
              <span className="text-sm text-muted-foreground">
                I agree to the{' '}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.agreeToTerms && (
              <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                <AlertCircle className="h-3 w-3" />
                {errors.agreeToTerms}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full btn-primary"
            disabled={loading || redirecting}
          >
            {redirecting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Redirecting to dashboard...
              </>
            ) : loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-muted"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted-foreground">Or register with</span>
          </div>
        </div>

        {/* Social Registration */}
        <div className="grid grid-cols-1 gap-3">
          <Button variant="outline" disabled={loading} onClick={handleGoogleRegister}>
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Register with Google
          </Button>
          <Button variant="outline" disabled={loading} onClick={handleLinkedInRegister}>
            <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            Register with LinkedIn
          </Button>
          <Button variant="outline" disabled={loading} onClick={handleDigiLockerRegister}>
            <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
              <path fill="white" d="M12 4.5L4.5 8v8.5c0 4.1 2.9 7.2 7.5 8.5 4.6-1.3 7.5-4.4 7.5-8.5V8L12 4.5z"/>
              <circle cx="12" cy="11" r="2" fill="currentColor"/>
              <path d="M12 13v3h-2v-3h2zM14 13v3h-2v-3h2z" fill="currentColor"/>
            </svg>
            Register with DigiLocker
          </Button>
        </div>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}