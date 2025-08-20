'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  AlertCircle, 
  Loader2, 
  Phone, 
  ArrowRight, 
  Shield,
  Smartphone,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';

// Secure SSO auth implementation using HttpOnly cookies
const useSecureSSOAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get backend API base URL
  const getBackendUrl = () => {
    return process.env.NEXT_PUBLIC_API_BASE || 
      (process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : 'https://api.vikareta.com');
  };

  const login = async (loginData: any) => {
    setIsLoading(true);
    try {
      const backendUrl = getBackendUrl();
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        credentials: 'include', // Critical: Include HttpOnly cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();
      
      if (result.success && result.user) {
        setUser(result.user);
        return result;
      } else {
        throw new Error(result.error?.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Login failed' }
      };
    } finally {
      setIsLoading(false);
    }
  };

  const checkSession = async () => {
    try {
      const backendUrl = getBackendUrl();
      const response = await fetch(`${backendUrl}/api/auth/me`, {
        credentials: 'include', // Include HttpOnly cookies
      });
      
      const result = await response.json();
      if (result.success && result.user) {
        setUser(result.user);
        return result.user;
      }
      return null;
    } catch {
      return null;
    }
  };

  // Check session on mount
  useEffect(() => {
    checkSession();
  }, []);

  return {
    login,
    user,
    isLoading,
    checkSession
  };
};

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// Global type declarations for OAuth libraries
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: any) => void;
          }) => void;
          prompt: () => void;
        };
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: any) => void;
          }) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
    FB?: {
      init: (config: {
        appId: string;
        cookie: boolean;
        xfbml: boolean;
        version: string;
      }) => void;
      login: (
        callback: (response: any) => void,
        options: { scope: string }
      ) => void;
    };
  }
}

function LoginPageContent() {
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    otp: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Simple toast implementation
  const toast = {
    success: (title: string, message: string) => {
      console.log(`SUCCESS: ${title} - ${message}`);
      // TODO: Replace with actual toast implementation
    },
    error: (title: string, message: string) => {
      console.error(`ERROR: ${title} - ${message}`);
      // TODO: Replace with actual toast implementation
    }
  };
  
  const searchParams = useSearchParams();
  const redirectUrl = searchParams?.get('redirect');
  const { login, user } = useSecureSSOAuth();

  // Simple cross-domain auth helpers
  const getPostLoginRedirectUrl = (user: any) => {
    if (user?.userType === 'seller') return '/dashboard';
    return '/';
  };

  // Secure SSO sync using HttpOnly cookies only
  const syncSSOToSubdomainsFn = async () => {
    try {
      if (typeof window === 'undefined') return;

      const backend = process.env.NEXT_PUBLIC_API_BASE || 
        (process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : 'https://api.vikareta.com');
      const targets = ['dashboard.vikareta.com', 'admin.vikareta.com'];

      const syncPromises: Promise<void>[] = [];

      for (const host of targets) {
        const p = (async () => {
          try {
            // Request signed SSO token - backend authenticates via HttpOnly cookie
            const resp = await fetch(`${backend}/api/auth/sso-token`, {
              method: 'POST',
              credentials: 'include', // Send HttpOnly authentication cookie
              headers: { 
                'Content-Type': 'application/json',
                // Add CSRF token if available
                ...(getCSRFToken() && { 'X-XSRF-TOKEN': getCSRFToken()! })
              },
              body: JSON.stringify({ target: host }),
            });

            if (!resp.ok) return;
            const data = await resp.json();
            const token = data?.token;
            if (!token) return;

            // Use iframe to set HttpOnly cookie on target domain
            await new Promise<void>((resolve) => {
              const iframe = document.createElement('iframe');
              iframe.style.display = 'none';
              iframe.src = `https://${host}/sso/receive?token=${encodeURIComponent(token)}`;

              const cleanup = () => {
                try { window.removeEventListener('message', onMessage); } catch {}
                try { if (iframe.parentNode) iframe.parentNode.removeChild(iframe); } catch {}
                resolve();
              };

              const onMessage = (e: MessageEvent) => {
                // Verify origin for security
                if (e.origin === `https://${host}` && e.data?.sso === 'ok') {
                  cleanup();
                }
              };

              window.addEventListener('message', onMessage);
              document.body.appendChild(iframe);

              // Safety timeout
              setTimeout(() => cleanup(), 5000);
            });
          } catch {
            // Silent fail for SSO sync
          }
        })();

        syncPromises.push(p);
      }

      await Promise.all(syncPromises);
      console.log('Successfully synced SSO to subdomains using secure HttpOnly cookies');
    } catch (error) {
      console.error('Failed to sync SSO to subdomains:', error);
    }
  };

  // Helper function to get CSRF token
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

  const hasDashboardAccess = (user: any) => {
    return user?.userType === 'seller' || user?.userType === 'admin';
  };

  // OTP Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Format phone number
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.startsWith('91')) {
      return `+${cleaned}`;
    } else if (cleaned.length === 10) {
      return `+91${cleaned}`;
    }
    return `+${cleaned}`;
  };

  // Validate form based on current step and auth method
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (step === 'credentials') {
      if (authMethod === 'email') {
        if (!formData.email) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
      } else {
        if (!formData.phone) {
          newErrors.phone = 'Phone number is required';
        } else if (!/^\+91[6-9]\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
          newErrors.phone = 'Please enter a valid Indian phone number';
        }
      }

      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    } else if (step === 'otp') {
      if (!formData.otp) {
        newErrors.otp = 'OTP is required';
      } else if (!/^\d{6}$/.test(formData.otp)) {
        newErrors.otp = 'Please enter a valid 6-digit OTP';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Send OTP
  const sendOtp = async () => {
    setOtpLoading(true);
    try {
      // TODO: Replace with actual OTP API call
      // const response = await fetch('/api/auth/send-otp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     type: authMethod,
      //     identifier: authMethod === 'email' ? formData.email : formData.phone
      //   })
      // });

      // Simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setOtpTimer(30);
      toast.success(
        'OTP Sent!', 
        `Verification code sent to your ${authMethod === 'email' ? 'email' : 'phone number'}`
      );
    } catch (error) {
      console.error('Failed to send OTP:', error);
      toast.error('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle login form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (step === 'credentials') {
      setLoading(true);
      try {
        const loginData = authMethod === 'email' 
          ? { email: formData.email, password: formData.password }
          : { phone: formData.phone, password: formData.password };

        const success = await login(loginData);

        if (success) {
          // If phone login, send OTP for verification
          if (authMethod === 'phone') {
            setStep('otp');
            await sendOtp();
          } else {
            // Email login successful
            handleLoginSuccess();
          }
        } else {
          toast.error('Login Failed', 'Please check your credentials and try again.');
        }
      } catch (error) {
        console.error('Login error:', error);
        toast.error('Login Failed', 'An error occurred during login.');
      } finally {
        setLoading(false);
      }
    } else if (step === 'otp') {
      setLoading(true);
      try {
        // TODO: Replace with actual OTP verification
        // const response = await fetch('/api/auth/verify-otp', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     type: authMethod,
        //     identifier: authMethod === 'email' ? formData.email : formData.phone,
        //     otp: formData.otp
        //   })
        // });

        // Simulate OTP verification
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (formData.otp === '123456') { // Demo OTP
          handleLoginSuccess();
        } else {
          setErrors({ otp: 'Invalid OTP. Please try again.' });
        }
      } catch (error) {
        console.error('OTP verification error:', error);
        toast.error('Verification Failed', 'Invalid OTP. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle successful login
  const handleLoginSuccess = async () => {
    toast.success('Login Successful!', 'Redirecting...');

    setTimeout(async () => {
      let targetUrl: string | null = null;

      if (redirectUrl) {
        console.log('SSO Login: Using redirect URL from params:', redirectUrl);
        targetUrl = redirectUrl;
      }

      // Return URL now handled via URL parameters for security
      // No localStorage usage for enhanced security

      if (!targetUrl && user) {
        targetUrl = getPostLoginRedirectUrl(user);
        console.log('SSO Login: Using role-based redirect:', targetUrl);
      }

      if (!targetUrl) targetUrl = '/';

      try {
        if (user && hasDashboardAccess(user)) {
          await syncSSOToSubdomainsFn();
        }
      } catch (err) {
        console.warn('SSO Login: Failed to sync SSO to subdomains', err);
      }

      console.log('SSO Login: Redirecting to:', targetUrl);
      window.location.replace(targetUrl);
    }, 1000);
  };

  // Social login handlers
  const handleGoogleLogin = async () => {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    
    if (!googleClientId || googleClientId === 'your-google-client-id') {
      toast.error('Configuration Error', 'Google OAuth is not configured. Please contact support.');
      return;
    }

    try {
      setLoading(true);
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.vikareta.com/api';
      // OAuth providers now handle return URL via state parameter for security
      const state = encodeURIComponent(window.location.pathname + window.location.search);
      const redirectUrl = `${apiUrl}/auth/google?state=${state}`;
      
      window.location.href = redirectUrl;
    } catch (error) {
      console.error('Google OAuth error:', error);
      toast.error('Error', 'Failed to initialize Google sign-in');
      setLoading(false);
    }
  };

  const handleLinkedInLogin = async () => {
    try {
      setLoading(true);
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.vikareta.com/api';
      // OAuth providers now handle return URL via state parameter for security
      const state = encodeURIComponent(window.location.pathname + window.location.search);
      const redirectUrl = `${apiUrl}/auth/linkedin?state=${state}`;
      
      window.location.href = redirectUrl;
    } catch (error) {
      console.error('LinkedIn OAuth error:', error);
      toast.error('Error', 'Failed to initialize LinkedIn sign-in');
      setLoading(false);
    }
  };

  const handleDigiLockerLogin = async () => {
    try {
      setLoading(true);
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.vikareta.com/api';
      // OAuth providers now handle return URL via state parameter for security
      const state = encodeURIComponent(window.location.pathname + window.location.search);
      const redirectUrl = `${apiUrl}/auth/digilocker?state=${state}`;
      
      window.location.href = redirectUrl;
    } catch (error) {
      console.error('DigiLocker OAuth error:', error);
      toast.error('Error', 'Failed to initialize DigiLocker sign-in');
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'phone') {
      value = formatPhoneNumber(value);
    }
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      variants={pageVariants}
      className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-3xl"
          animate={{ 
            x: [0, 50, -30, 0], 
            y: [0, -30, 40, 0],
            scale: [1, 1.2, 0.9, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-red-500/20 rounded-full blur-3xl"
          animate={{ 
            x: [0, -40, 60, 0], 
            y: [0, 50, -20, 0],
            scale: [1, 0.8, 1.3, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-60 h-60 bg-gradient-to-br from-red-400/10 to-amber-500/10 rounded-full blur-3xl"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-4 py-8">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="max-w-md w-full"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <motion.div 
                className="h-24 w-24 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center mx-auto shadow-2xl"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <img 
                  src="/img/logo.png" 
                  alt="Vikareta Logo" 
                  className="h-16 w-16 object-contain" 
                />
              </motion.div>
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-lg">
              Sign in to continue your business journey
            </p>
          </motion.div>

          {/* Main Auth Card */}
          <motion.div 
            variants={itemVariants}
            className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20"
          >
            {step === 'credentials' ? (
              <>
                {/* Auth Method Toggle */}
                <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-gray-100 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setAuthMethod('email')}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                      authMethod === 'email'
                        ? 'bg-white text-amber-600 shadow-lg'
                        : 'text-gray-600 hover:text-amber-600'
                    }`}
                    disabled={loading}
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMethod('phone')}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                      authMethod === 'phone'
                        ? 'bg-white text-amber-600 shadow-lg'
                        : 'text-gray-600 hover:text-amber-600'
                    }`}
                    disabled={loading}
                  >
                    <Phone className="w-4 h-4" />
                    Phone
                  </button>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email/Phone Field */}
                  {authMethod === 'email' ? (
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-gray-800 placeholder-gray-500 transition-all duration-300 ${
                            errors.email ? 'border-red-500' : 'border-gray-200 hover:border-amber-300'
                          }`}
                          placeholder="Enter your email address"
                          disabled={loading}
                        />
                      </div>
                      {errors.email && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 mt-2 text-red-500 text-sm"
                        >
                          <AlertCircle className="h-4 w-4" />
                          {errors.email}
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-gray-800 placeholder-gray-500 transition-all duration-300 ${
                            errors.phone ? 'border-red-500' : 'border-gray-200 hover:border-amber-300'
                          }`}
                          placeholder="+91 98765 43210"
                          disabled={loading}
                        />
                      </div>
                      {errors.phone && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 mt-2 text-red-500 text-sm"
                        >
                          <AlertCircle className="h-4 w-4" />
                          {errors.phone}
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`w-full pl-12 pr-14 py-4 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-gray-800 placeholder-gray-500 transition-all duration-300 ${
                          errors.password ? 'border-red-500' : 'border-gray-200 hover:border-amber-300'
                        }`}
                        placeholder="Enter your password"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-amber-600 transition-colors"
                        disabled={loading}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 mt-2 text-red-500 text-sm"
                      >
                        <AlertCircle className="h-4 w-4" />
                        {errors.password}
                      </motion.div>
                    )}
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                        disabled={loading}
                      />
                      <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-4 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </motion.button>
                </form>
              </>
            ) : (
              /* OTP Verification Step */
              <>
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  >
                    <Smartphone className="w-8 h-8 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Your {authMethod === 'email' ? 'Email' : 'Phone'}</h2>
                  <p className="text-gray-600">
                    We've sent a 6-digit code to
                  </p>
                  <p className="text-amber-600 font-semibold">
                    {authMethod === 'email' ? formData.email : formData.phone}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* OTP Input */}
                  <div>
                    <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 mb-2">
                      Verification Code
                    </label>
                    <div className="relative">
                      <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        id="otp"
                        type="text"
                        value={formData.otp}
                        onChange={(e) => handleInputChange('otp', e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-gray-800 placeholder-gray-500 transition-all duration-300 text-center text-xl tracking-widest ${
                          errors.otp ? 'border-red-500' : 'border-gray-200 hover:border-amber-300'
                        }`}
                        placeholder="000000"
                        maxLength={6}
                        disabled={loading}
                      />
                    </div>
                    {errors.otp && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 mt-2 text-red-500 text-sm"
                      >
                        <AlertCircle className="h-4 w-4" />
                        {errors.otp}
                      </motion.div>
                    )}
                  </div>

                  {/* Resend OTP */}
                  <div className="text-center">
                    {otpTimer > 0 ? (
                      <p className="text-gray-600 text-sm">
                        Resend code in <span className="font-semibold text-amber-600">{otpTimer}s</span>
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={sendOtp}
                        disabled={otpLoading}
                        className="text-amber-600 hover:text-amber-700 font-medium text-sm"
                      >
                        {otpLoading ? 'Sending...' : 'Resend Code'}
                      </button>
                    )}
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={loading || formData.otp.length !== 6}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-4 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        Verify & Continue
                      </>
                    )}
                  </motion.button>

                  {/* Back Button */}
                  <button
                    type="button"
                    onClick={() => setStep('credentials')}
                    className="w-full text-gray-600 hover:text-gray-800 py-3 font-medium flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                  </button>
                </form>
              </>
            )}

            {step === 'credentials' && (
              <>
                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-1 gap-3">
                  <motion.button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-2xl hover:border-amber-300 hover:bg-amber-50 transition-all duration-300 bg-white shadow-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg className="h-5 w-5 text-gray-700" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span className="font-medium text-gray-700">Continue with Google</span>
                  </motion.button>

                  <motion.button
                    onClick={handleLinkedInLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-2xl hover:border-amber-300 hover:bg-amber-50 transition-all duration-300 bg-white shadow-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg className="h-5 w-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span className="font-medium text-gray-700">Continue with LinkedIn</span>
                  </motion.button>

                  <motion.button
                    onClick={handleDigiLockerLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-2xl hover:border-amber-300 hover:bg-amber-50 transition-all duration-300 bg-white shadow-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg className="h-5 w-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                      <path fill="white" d="M12 4.5L4.5 8v8.5c0 4.1 2.9 7.2 7.5 8.5 4.6-1.3 7.5-4.4 7.5-8.5V8L12 4.5z"/>
                      <circle cx="12" cy="11" r="2" fill="currentColor"/>
                      <path d="M12 13v3h-2v-3h2zM14 13v3h-2v-3h2z" fill="currentColor"/>
                    </svg>
                    <span className="font-medium text-gray-700">Continue with DigiLocker</span>
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>

          {/* Sign Up Link */}
          <motion.div variants={itemVariants} className="text-center mt-8">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-amber-600 hover:text-amber-700 font-semibold">
                Create account
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}