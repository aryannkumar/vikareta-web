'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Building, 
  MapPin,
  AlertCircle, 
  Loader2,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Smartphone,
  Shield,
  Users,
  Store,
  Briefcase,
  FileText
} from 'lucide-react';

// Local toast implementation
const toast = {
  success: (title: string, message?: string) => {
    console.log(`✓ ${title}`, message);
  },
  error: (title: string, message?: string) => {
    console.log(`✗ ${title}`, message);
  }
};

// Secure SSO auth implementation using HttpOnly cookies
const useSecureSSOAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const register = async (registrationData: any) => {
    setIsLoading(true);
    try {
      // Get backend API base URL
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || 
        (process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : 'https://api.vikareta.com');
      
      const response = await fetch(`${apiBase}/api/auth/register`, {
        method: 'POST',
        credentials: 'include', // Critical: Include HttpOnly cookies
        headers: {
          'Content-Type': 'application/json',
          // Add CSRF token if available
          ...(getCSRFToken() && { 'X-XSRF-TOKEN': getCSRFToken()! })
        },
        body: JSON.stringify(registrationData),
      });

      const result = await response.json();
      
      if (result.success && result.user) {
        setUser(result.user);
        return result;
      } else {
        throw new Error(result.error?.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Registration failed' }
      };
    } finally {
      setIsLoading(false);
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

  return {
    register,
    user,
    isLoading
  };
};

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.3 }
  }
};

// Multi-step registration interface
type RegistrationStep = 'userType' | 'personal' | 'business' | 'verification' | 'complete';

interface FormData {
  // User type
  userType: 'buyer' | 'seller' | 'business' | '';
  
  // Personal information (from schema)
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  
  // Business information (from schema)
  businessName: string;
  businessType: string;
  gstin: string;
  
  // Location (from schema)
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  
  // Additional fields
  agreeToTerms: boolean;
  agreeToMarketing: boolean;
  
  // Verification
  emailVerified: boolean;
  phoneVerified: boolean;
}

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('userType');
  const [formData, setFormData] = useState<FormData>({
    userType: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    businessType: '',
    gstin: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    agreeToTerms: false,
    agreeToMarketing: false,
    emailVerified: false,
    phoneVerified: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [currentOtpType, setCurrentOtpType] = useState<'email' | 'phone' | null>(null);

  const { register: registerUser } = useSecureSSOAuth();

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

  // Validation functions
  const validateStep = (step: RegistrationStep): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 'userType':
        if (!formData.userType) {
          newErrors.userType = 'Please select a user type';
        }
        break;

      case 'personal':
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
        } else if (!/^\+91[6-9]\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
          newErrors.phone = 'Please enter a valid Indian phone number';
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
        break;

      case 'business':
        if (formData.userType === 'seller' || formData.userType === 'business') {
          if (!formData.businessName.trim()) {
            newErrors.businessName = 'Business name is required';
          }
          if (!formData.businessType) {
            newErrors.businessType = 'Business type is required';
          }
          if (!formData.city) {
            newErrors.city = 'City is required';
          }
          if (!formData.state) {
            newErrors.state = 'State is required';
          }
          if (!formData.pincode) {
            newErrors.pincode = 'PIN code is required';
          } else if (!/^\d{6}$/.test(formData.pincode)) {
            newErrors.pincode = 'Please enter a valid 6-digit PIN code';
          }
        }
        if (!formData.agreeToTerms) {
          newErrors.agreeToTerms = 'You must agree to the terms and conditions';
        }
        break;

      case 'verification':
        if (!formData.emailVerified) {
          newErrors.emailVerified = 'Please verify your email address';
        }
        if (!formData.phoneVerified) {
          newErrors.phoneVerified = 'Please verify your phone number';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Simple input change helper
  const updateField = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  // Step navigation
  const nextStep = () => {
    if (validateStep(currentStep)) {
      const steps: RegistrationStep[] = ['userType', 'personal', 'business', 'verification', 'complete'];
      const currentIndex = steps.indexOf(currentStep);
      if (currentIndex < steps.length - 1) {
        setCurrentStep(steps[currentIndex + 1]);
      }
    }
  };

  const prevStep = () => {
    const steps: RegistrationStep[] = ['userType', 'personal', 'business', 'verification', 'complete'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  // OTP functions
  const sendOTP = async (type: 'email' | 'phone') => {
    setOtpLoading(true);
    setCurrentOtpType(type);
    
    try {
      // Mock OTP sending
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setOtpTimer(30);
      toast.success(
        'OTP Sent!', 
        `Verification code sent to your ${type}`
      );
    } catch (error) {
      console.error('Send OTP error:', error);
      toast.error('Error', `Failed to send OTP to ${type}`);
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOTP = async (code: string, type: 'email' | 'phone') => {
    setLoading(true);
    
    try {
      // Mock OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (type === 'email') {
        setFormData(prev => ({ ...prev, emailVerified: true }));
      } else {
        setFormData(prev => ({ ...prev, phoneVerified: true }));
      }
      
      setCurrentOtpType(null);
      toast.success('Verified!', `${type.charAt(0).toUpperCase() + type.slice(1)} verified successfully`);
    } catch (error) {
      console.error('Verify OTP error:', error);
      toast.error('Error', 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  // Final registration
  const handleFinalSubmit = async () => {
    if (!validateStep('verification')) return;

    setLoading(true);
    try {
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        userType: formData.userType,
        businessName: formData.businessName,
        businessType: formData.businessType,
        gstin: formData.gstin,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        country: formData.country,
        agreeToMarketing: formData.agreeToMarketing
      };
      
      const success = await registerUser(registrationData);
      
      if (success) {
        setCurrentStep('complete');
        toast.success('Registration Successful!', 'Welcome to Vikareta!');
      }
    } catch (_error) {
      console.error('Registration error:', _error);
    } finally {
      setLoading(false);
    }
  };

  // Social registration handlers
  const handleSocialRegister = async (provider: string) => {
    try {
      setLoading(true);
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.vikareta.com/api';
      // OAuth providers now handle return URL via state parameter for security
      const state = encodeURIComponent(window.location.pathname + window.location.search);
      const redirectUrl = `${apiUrl}/auth/${provider}?state=${state}`;
      
      window.location.href = redirectUrl;
    } catch (error) {
      console.error(`${provider} OAuth error:`, error);
      toast.error('Error', `Failed to initialize ${provider} registration`);
      setLoading(false);
    }
  };

  // Progress calculation
  const getProgress = () => {
    const steps = ['userType', 'personal', 'business', 'verification', 'complete'];
    const currentIndex = steps.indexOf(currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Floating Elements */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-4 h-4 bg-amber-400 rounded-full"
          animate={{ 
            y: [-20, 20, -20],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-3/4 right-1/3 w-6 h-6 bg-orange-400 rounded-full"
          animate={{ 
            y: [20, -20, 20],
            opacity: [0.4, 0.9, 0.4]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <motion.div 
          className="w-full max-w-2xl"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-block mb-6"
            >
              <Link href="/">
                <div className="h-24 w-24 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center mx-auto shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <img 
                    src="/img/logo.png" 
                    alt="Vikareta Logo" 
                    className="h-16 w-16 object-contain" 
                  />
                </div>
              </Link>
            </motion.div>
            
            <motion.h1 
              className="text-4xl font-bold text-gray-800 mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Join Vikareta Today
            </motion.h1>
            
            <motion.p 
              className="text-gray-600 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Create your account and start your business journey
            </motion.p>
          </div>

          {/* Progress Bar */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span className={currentStep === 'userType' ? 'text-amber-600 font-semibold' : ''}>User Type</span>
              <span className={currentStep === 'personal' ? 'text-amber-600 font-semibold' : ''}>Personal Info</span>
              <span className={currentStep === 'business' ? 'text-amber-600 font-semibold' : ''}>Business Details</span>
              <span className={currentStep === 'verification' ? 'text-amber-600 font-semibold' : ''}>Verification</span>
              <span className={currentStep === 'complete' ? 'text-amber-600 font-semibold' : ''}>Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getProgress()}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </motion.div>

          {/* Main Registration Card */}
          <motion.div 
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <AnimatePresence mode="wait">
              {renderCurrentStep()}
            </AnimatePresence>
          </motion.div>

          {/* Login Link */}
          <motion.div 
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-amber-600 hover:text-amber-700 font-semibold hover:underline transition-colors">
                Sign in here
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .bg-grid-pattern {
          background-image: 
            linear-gradient(90deg, rgba(0,0,0,.03) 1px, transparent 1px),
            linear-gradient(180deg, rgba(0,0,0,.03) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );

  // Render current step component
  function renderCurrentStep() {
    switch (currentStep) {
      case 'userType':
        return UserTypeStep();
      case 'personal':
        return PersonalInfoStep();
      case 'business':
        return BusinessInfoStep();
      case 'verification':
        return VerificationStep();
      case 'complete':
        return CompleteStep();
      default:
        return UserTypeStep();
    }
  }

  // User Type Selection Step
  function UserTypeStep() {
    return (
      <motion.div
        key="userType"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">What brings you to Vikareta?</h2>
          <p className="text-gray-600">Choose the option that best describes you</p>
        </div>

        <div className="grid gap-4">
          {/* Buyer Option */}
          <motion.button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, userType: 'buyer' }))}
            className={`p-6 border-2 rounded-2xl text-left transition-all duration-300 hover:shadow-lg ${
              formData.userType === 'buyer'
                ? 'border-amber-500 bg-amber-50 shadow-md'
                : 'border-gray-200 hover:border-amber-300 bg-white'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-xl ${
                formData.userType === 'buyer' ? 'bg-amber-500' : 'bg-gray-100'
              }`}>
                <Users className={`w-6 h-6 ${
                  formData.userType === 'buyer' ? 'text-white' : 'text-gray-600'
                }`} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">I'm a Buyer</h3>
                <p className="text-gray-600 text-sm">
                  Looking for products and services to purchase for my business or personal needs
                </p>
                <div className="mt-2 text-xs text-amber-600 font-medium">
                  ✓ Browse marketplace ✓ Connect with sellers ✓ Secure transactions
                </div>
              </div>
            </div>
          </motion.button>

          {/* Seller Option */}
          <motion.button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, userType: 'seller' }))}
            className={`p-6 border-2 rounded-2xl text-left transition-all duration-300 hover:shadow-lg ${
              formData.userType === 'seller'
                ? 'border-amber-500 bg-amber-50 shadow-md'
                : 'border-gray-200 hover:border-amber-300 bg-white'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-xl ${
                formData.userType === 'seller' ? 'bg-amber-500' : 'bg-gray-100'
              }`}>
                <Store className={`w-6 h-6 ${
                  formData.userType === 'seller' ? 'text-white' : 'text-gray-600'
                }`} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">I'm a Seller</h3>
                <p className="text-gray-600 text-sm">
                  Want to sell products or services and grow my business online
                </p>
                <div className="mt-2 text-xs text-amber-600 font-medium">
                  ✓ List products ✓ Manage inventory ✓ Track sales ✓ Business analytics
                </div>
              </div>
            </div>
          </motion.button>

          {/* Business Option */}
          <motion.button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, userType: 'business' }))}
            className={`p-6 border-2 rounded-2xl text-left transition-all duration-300 hover:shadow-lg ${
              formData.userType === 'business'
                ? 'border-amber-500 bg-amber-50 shadow-md'
                : 'border-gray-200 hover:border-amber-300 bg-white'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-xl ${
                formData.userType === 'business' ? 'bg-amber-500' : 'bg-gray-100'
              }`}>
                <Briefcase className={`w-6 h-6 ${
                  formData.userType === 'business' ? 'text-white' : 'text-gray-600'
                }`} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">I'm a Business</h3>
                <p className="text-gray-600 text-sm">
                  Representing a company that needs B2B solutions and enterprise features
                </p>
                <div className="mt-2 text-xs text-amber-600 font-medium">
                  ✓ Bulk purchasing ✓ Enterprise tools ✓ API access ✓ Dedicated support
                </div>
              </div>
            </div>
          </motion.button>
        </div>

        {errors.userType && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mt-3 text-red-500 text-sm bg-red-50 p-3 rounded-lg"
          >
            <AlertCircle className="h-4 w-4" />
            {errors.userType}
          </motion.div>
        )}

        {/* Social Registration Options */}
        <div className="mt-8 space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <motion.button
              type="button"
              onClick={() => handleSocialRegister('google')}
              className="p-3 border border-gray-200 rounded-xl hover:border-amber-300 hover:bg-amber-50 transition-all duration-200 flex items-center justify-center bg-white shadow-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </motion.button>

            <motion.button
              type="button"
              onClick={() => handleSocialRegister('linkedin')}
              className="p-3 border border-gray-200 rounded-xl hover:border-amber-300 hover:bg-amber-50 transition-all duration-200 flex items-center justify-center bg-white shadow-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </motion.button>

            <motion.button
              type="button"
              onClick={() => handleSocialRegister('digilocker')}
              className="p-3 border border-gray-200 rounded-xl hover:border-amber-300 hover:bg-amber-50 transition-all duration-200 flex items-center justify-center bg-white shadow-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              <Shield className="w-5 h-5 text-gray-700" />
            </motion.button>
          </div>
        </div>

        {/* Continue Button */}
        <motion.button
          type="button"
          onClick={nextStep}
          disabled={!formData.userType || loading}
          className={`w-full py-4 rounded-2xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
            !formData.userType || loading
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:shadow-lg transform hover:scale-105 active:scale-95'
          }`}
          whileHover={!formData.userType || loading ? {} : { scale: 1.02 }}
          whileTap={!formData.userType || loading ? {} : { scale: 0.98 }}
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Please wait...</span>
            </>
          ) : (
            <>
              <span>Continue</span>
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </motion.button>
      </motion.div>
    );
  }

  // Personal Information Step
  function PersonalInfoStep() {
    const handleFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      nextStep();
    };

    return (
      <motion.div
        key="personal"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Personal Information</h2>
          <p className="text-gray-600">Tell us about yourself</p>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-6" id="personal-info-form">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, firstName: e.target.value }));
                    if (errors.firstName) {
                      setErrors(prev => {
                        const { firstName: _, ...rest } = prev;
                        return rest;
                      });
                    }
                  }}
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-gray-800 placeholder-gray-500 transition-all duration-300 ${
                    errors.firstName ? 'border-red-500' : 'border-gray-200 hover:border-amber-300'
                  }`}
                  placeholder="Enter your first name"
                  disabled={loading}
                />
              </div>
              {errors.firstName && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 mt-2 text-red-500 text-sm"
                >
                  <AlertCircle className="h-4 w-4" />
                  {errors.firstName}
                </motion.div>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                Last Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, lastName: e.target.value }));
                    if (errors.lastName) {
                      setErrors(prev => {
                        const { lastName: _, ...rest } = prev;
                        return rest;
                      });
                    }
                  }}
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-gray-800 placeholder-gray-500 transition-all duration-300 ${
                    errors.lastName ? 'border-red-500' : 'border-gray-200 hover:border-amber-300'
                  }`}
                  placeholder="Enter your last name"
                  disabled={loading}
                />
              </div>
              {errors.lastName && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 mt-2 text-red-500 text-sm"
                >
                  <AlertCircle className="h-4 w-4" />
                  {errors.lastName}
                </motion.div>
              )}
            </div>
          </div>

          {/* Email Field */}
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
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, email: e.target.value }));
                  if (errors.email) {
                    setErrors(prev => {
                      const { email: _, ...rest } = prev;
                      return rest;
                    });
                  }
                }}
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

          {/* Phone Field */}
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
                onChange={(e) => {
                  const value = e.target.value;
                  const cleaned = value.replace(/\D/g, '');
                  let formatted = '';
                  
                  if (cleaned.length === 0) {
                    formatted = '';
                  } else if (cleaned.startsWith('91') && cleaned.length > 2) {
                    formatted = `+91 ${cleaned.slice(2)}`;
                  } else if (cleaned.length === 10 && !cleaned.startsWith('91')) {
                    formatted = `+91 ${cleaned}`;
                  } else if (cleaned.startsWith('91')) {
                    formatted = `+${cleaned}`;
                  } else {
                    formatted = `+91 ${cleaned}`;
                  }
                  
                  setFormData(prev => ({ ...prev, phone: formatted }));
                  if (errors.phone) {
                    setErrors(prev => {
                      const { phone: _, ...rest } = prev;
                      return rest;
                    });
                  }
                }}
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-gray-800 placeholder-gray-500 transition-all duration-300 ${
                  errors.phone ? 'border-red-500' : 'border-gray-200 hover:border-amber-300'
                }`}
                placeholder="+91 Enter your phone number"
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

          {/* Password Fields */}
          <div className="grid grid-cols-1 gap-4">
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
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, password: e.target.value }));
                    if (errors.password) {
                      setErrors(prev => {
                        const { password: _, ...rest } = prev;
                        return rest;
                      });
                    }
                  }}
                  className={`w-full pl-12 pr-14 py-4 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-gray-800 placeholder-gray-500 transition-all duration-300 ${
                    errors.password ? 'border-red-500' : 'border-gray-200 hover:border-amber-300'
                  }`}
                  placeholder="Create a strong password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, confirmPassword: e.target.value }));
                    if (errors.confirmPassword) {
                      setErrors(prev => {
                        const { confirmPassword: _, ...rest } = prev;
                        return rest;
                      });
                    }
                  }}
                  className={`w-full pl-12 pr-14 py-4 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-gray-800 placeholder-gray-500 transition-all duration-300 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-200 hover:border-amber-300'
                  }`}
                  placeholder="Confirm your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 mt-2 text-red-500 text-sm"
                >
                  <AlertCircle className="h-4 w-4" />
                  {errors.confirmPassword}
                </motion.div>
              )}
            </div>
          </div>
        </form>

        {/* Navigation Buttons */}
        <div className="flex gap-4 pt-6">
          <motion.button
            type="button"
            onClick={prevStep}
            className="flex-1 py-4 border-2 border-gray-200 rounded-2xl font-semibold text-gray-600 hover:border-amber-300 hover:bg-amber-50 transition-all duration-300 flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </motion.button>

          <motion.button
            type="submit"
            form="personal-info-form"
            disabled={loading}
            className={`flex-1 py-4 rounded-2xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
              loading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:shadow-lg transform hover:scale-105 active:scale-95'
            }`}
            whileHover={loading ? {} : { scale: 1.02 }}
            whileTap={loading ? {} : { scale: 0.98 }}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Please wait...</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // Business Information Step
  function BusinessInfoStep() {
    const showBusinessFields = formData.userType === 'seller' || formData.userType === 'business';

    return (
      <motion.div
        key="business"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {showBusinessFields ? 'Business Information' : 'Additional Details'}
          </h2>
          <p className="text-gray-600">
            {showBusinessFields ? 'Tell us about your business' : 'Complete your profile setup'}
          </p>
        </div>

        <div className="space-y-6">
          {showBusinessFields && (
            <>
              {/* Business Name */}
              <div>
                <label htmlFor="businessName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Business Name
                </label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="businessName"
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => updateField('businessName', e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-gray-800 placeholder-gray-500 transition-all duration-300 ${
                      errors.businessName ? 'border-red-500' : 'border-gray-200 hover:border-amber-300'
                    }`}
                    placeholder="Enter your business name"
                    disabled={loading}
                  />
                </div>
                {errors.businessName && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 mt-2 text-red-500 text-sm"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {errors.businessName}
                  </motion.div>
                )}
              </div>

              {/* Business Type */}
              <div>
                <label htmlFor="businessType" className="block text-sm font-semibold text-gray-700 mb-2">
                  Business Type
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <select
                    id="businessType"
                    value={formData.businessType}
                    onChange={(e) => updateField('businessType', e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-gray-800 transition-all duration-300 ${
                      errors.businessType ? 'border-red-500' : 'border-gray-200 hover:border-amber-300'
                    }`}
                    disabled={loading}
                  >
                    <option value="">Select business type</option>
                    <option value="manufacturer">Manufacturer</option>
                    <option value="wholesaler">Wholesaler</option>
                    <option value="retailer">Retailer</option>
                    <option value="distributor">Distributor</option>
                    <option value="service_provider">Service Provider</option>
                    <option value="trader">Trader</option>
                    <option value="exporter">Exporter</option>
                    <option value="importer">Importer</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                {errors.businessType && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 mt-2 text-red-500 text-sm"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {errors.businessType}
                  </motion.div>
                )}
              </div>

              {/* GSTIN (Optional) */}
              <div>
                <label htmlFor="gstin" className="block text-sm font-semibold text-gray-700 mb-2">
                  GSTIN (Optional)
                </label>
                <div className="relative">
                  <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="gstin"
                    type="text"
                    value={formData.gstin}
                    onChange={(e) => updateField('gstin', e.target.value.toUpperCase())}
                    className="w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-gray-800 placeholder-gray-500 transition-all duration-300 border-gray-200 hover:border-amber-300"
                    placeholder="Enter your GSTIN (e.g., 29ABCDE1234F1Z5)"
                    disabled={loading}
                    maxLength={15}
                  />
                </div>
              </div>
            </>
          )}

          {/* Location Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                City
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-gray-800 placeholder-gray-500 transition-all duration-300 ${
                    errors.city ? 'border-red-500' : 'border-gray-200 hover:border-amber-300'
                  }`}
                  placeholder="Enter your city"
                  disabled={loading}
                />
              </div>
              {errors.city && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 mt-2 text-red-500 text-sm"
                >
                  <AlertCircle className="h-4 w-4" />
                  {errors.city}
                </motion.div>
              )}
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-2">
                State
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="state"
                  type="text"
                  value={formData.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-gray-800 placeholder-gray-500 transition-all duration-300 ${
                    errors.state ? 'border-red-500' : 'border-gray-200 hover:border-amber-300'
                  }`}
                  placeholder="Enter your state"
                  disabled={loading}
                />
              </div>
              {errors.state && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 mt-2 text-red-500 text-sm"
                >
                  <AlertCircle className="h-4 w-4" />
                  {errors.state}
                </motion.div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="pincode" className="block text-sm font-semibold text-gray-700 mb-2">
                PIN Code
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="pincode"
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => updateField('pincode', e.target.value.replace(/\D/g, ''))}
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-gray-800 placeholder-gray-500 transition-all duration-300 ${
                    errors.pincode ? 'border-red-500' : 'border-gray-200 hover:border-amber-300'
                  }`}
                  placeholder="Enter PIN code"
                  disabled={loading}
                  maxLength={6}
                />
              </div>
              {errors.pincode && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 mt-2 text-red-500 text-sm"
                >
                  <AlertCircle className="h-4 w-4" />
                  {errors.pincode}
                </motion.div>
              )}
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-2">
                Country
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="country"
                  type="text"
                  value={formData.country}
                  onChange={(e) => updateField('country', e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-gray-800 placeholder-gray-500 transition-all duration-300 border-gray-200 hover:border-amber-300"
                  placeholder="Country"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Address (Optional) */}
          <div>
            <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
              Address (Optional)
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-4 text-gray-400 h-5 w-5" />
              <textarea
                id="address"
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-gray-800 placeholder-gray-500 transition-all duration-300 border-gray-200 hover:border-amber-300 min-h-[100px] resize-none"
                placeholder="Enter your complete address"
                disabled={loading}
                rows={3}
              />
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => updateField('agreeToTerms', e.target.checked)}
                className="mt-1 rounded border-gray-300 text-amber-500 focus:ring-amber-500 w-5 h-5"
                disabled={loading}
              />
              <span className="text-sm text-gray-600">
                I agree to the{' '}
                <Link href="/terms" className="text-amber-600 hover:text-amber-700 font-semibold hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-amber-600 hover:text-amber-700 font-semibold hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.agreeToTerms && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-500 text-sm"
              >
                <AlertCircle className="h-4 w-4" />
                {errors.agreeToTerms}
              </motion.div>
            )}

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.agreeToMarketing}
                onChange={(e) => updateField('agreeToMarketing', e.target.checked)}
                className="mt-1 rounded border-gray-300 text-amber-500 focus:ring-amber-500 w-5 h-5"
                disabled={loading}
              />
              <span className="text-sm text-gray-600">
                I would like to receive marketing communications and updates about new features
              </span>
            </label>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 pt-6">
          <motion.button
            type="button"
            onClick={prevStep}
            className="flex-1 py-4 border-2 border-gray-200 rounded-2xl font-semibold text-gray-600 hover:border-amber-300 hover:bg-amber-50 transition-all duration-300 flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </motion.button>

          <motion.button
            type="button"
            onClick={nextStep}
            disabled={loading}
            className={`flex-1 py-4 rounded-2xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
              loading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:shadow-lg transform hover:scale-105 active:scale-95'
            }`}
            whileHover={loading ? {} : { scale: 1.02 }}
            whileTap={loading ? {} : { scale: 0.98 }}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Please wait...</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // Verification Step
  function VerificationStep() {
    return (
      <motion.div
        key="verification"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Details</h2>
          <p className="text-gray-600">We need to verify your email and phone number</p>
        </div>

        <div className="space-y-6">
          {/* Email Verification */}
          <div className={`p-6 border-2 rounded-2xl transition-all duration-300 ${
            formData.emailVerified 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-200 bg-white'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-xl ${
                  formData.emailVerified ? 'bg-green-500' : 'bg-gray-100'
                }`}>
                  <Mail className={`w-5 h-5 ${
                    formData.emailVerified ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Email Verification</h3>
                  <p className="text-sm text-gray-600">{formData.email}</p>
                </div>
              </div>
              {formData.emailVerified && (
                <CheckCircle className="w-6 h-6 text-green-500" />
              )}
            </div>

            {!formData.emailVerified && (
              <div className="space-y-4">
                {currentOtpType === 'email' ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Enter the 6-digit code sent to your email
                    </p>
                    <div className="flex justify-center space-x-2">
                      {[...Array(6)].map((_, i) => (
                        <input
                          key={i}
                          type="text"
                          maxLength={1}
                          className="w-12 h-12 text-center border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg font-semibold"
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value && i < 5) {
                              const nextInput = e.target.parentElement?.children[i + 1] as HTMLInputElement;
                              nextInput?.focus();
                            }
                            
                            // Collect all OTP digits
                            const otpInputs = e.target.parentElement?.children;
                            let otpCode = '';
                            for (let j = 0; j < 6; j++) {
                              const input = otpInputs?.[j] as HTMLInputElement;
                              otpCode += input?.value || '';
                            }
                            
                            if (otpCode.length === 6) {
                              verifyOTP(otpCode, 'email');
                            }
                          }}
                        />
                      ))}
                    </div>
                    
                    <div className="text-center">
                      {otpTimer > 0 ? (
                        <p className="text-sm text-gray-600">
                          Resend code in {otpTimer}s
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={() => sendOTP('email')}
                          className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                          disabled={otpLoading}
                        >
                          Resend code
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <motion.button
                    type="button"
                    onClick={() => sendOTP('email')}
                    disabled={otpLoading}
                    className="w-full py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors disabled:bg-gray-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {otpLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin inline" />
                        Sending OTP...
                      </>
                    ) : (
                      'Send Verification Code'
                    )}
                  </motion.button>
                )}
              </div>
            )}
          </div>

          {/* Phone Verification */}
          <div className={`p-6 border-2 rounded-2xl transition-all duration-300 ${
            formData.phoneVerified 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-200 bg-white'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-xl ${
                  formData.phoneVerified ? 'bg-green-500' : 'bg-gray-100'
                }`}>
                  <Smartphone className={`w-5 h-5 ${
                    formData.phoneVerified ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Phone Verification</h3>
                  <p className="text-sm text-gray-600">{formData.phone}</p>
                </div>
              </div>
              {formData.phoneVerified && (
                <CheckCircle className="w-6 h-6 text-green-500" />
              )}
            </div>

            {!formData.phoneVerified && (
              <div className="space-y-4">
                {currentOtpType === 'phone' ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Enter the 6-digit code sent via SMS
                    </p>
                    <div className="flex justify-center space-x-2">
                      {[...Array(6)].map((_, i) => (
                        <input
                          key={i}
                          type="text"
                          maxLength={1}
                          className="w-12 h-12 text-center border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg font-semibold"
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value && i < 5) {
                              const nextInput = e.target.parentElement?.children[i + 1] as HTMLInputElement;
                              nextInput?.focus();
                            }
                            
                            // Collect all OTP digits
                            const otpInputs = e.target.parentElement?.children;
                            let otpCode = '';
                            for (let j = 0; j < 6; j++) {
                              const input = otpInputs?.[j] as HTMLInputElement;
                              otpCode += input?.value || '';
                            }
                            
                            if (otpCode.length === 6) {
                              verifyOTP(otpCode, 'phone');
                            }
                          }}
                        />
                      ))}
                    </div>
                    
                    <div className="text-center">
                      {otpTimer > 0 ? (
                        <p className="text-sm text-gray-600">
                          Resend code in {otpTimer}s
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={() => sendOTP('phone')}
                          className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                          disabled={otpLoading}
                        >
                          Resend code
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <motion.button
                    type="button"
                    onClick={() => sendOTP('phone')}
                    disabled={otpLoading}
                    className="w-full py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors disabled:bg-gray-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {otpLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin inline" />
                        Sending OTP...
                      </>
                    ) : (
                      'Send Verification Code'
                    )}
                  </motion.button>
                )}
              </div>
            )}
          </div>

          {errors.emailVerified && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg"
            >
              <AlertCircle className="h-4 w-4" />
              {errors.emailVerified}
            </motion.div>
          )}

          {errors.phoneVerified && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg"
            >
              <AlertCircle className="h-4 w-4" />
              {errors.phoneVerified}
            </motion.div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 pt-6">
          <motion.button
            type="button"
            onClick={prevStep}
            className="flex-1 py-4 border-2 border-gray-200 rounded-2xl font-semibold text-gray-600 hover:border-amber-300 hover:bg-amber-50 transition-all duration-300 flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </motion.button>

          <motion.button
            type="button"
            onClick={handleFinalSubmit}
            disabled={loading || !formData.emailVerified || !formData.phoneVerified}
            className={`flex-1 py-4 rounded-2xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
              loading || !formData.emailVerified || !formData.phoneVerified
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:shadow-lg transform hover:scale-105 active:scale-95'
            }`}
            whileHover={loading || !formData.emailVerified || !formData.phoneVerified ? {} : { scale: 1.02 }}
            whileTap={loading || !formData.emailVerified || !formData.phoneVerified ? {} : { scale: 0.98 }}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // Complete Step
  function CompleteStep() {
    return (
      <motion.div
        key="complete"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto"
        >
          <CheckCircle className="w-12 h-12 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Welcome to Vikareta!</h2>
          <p className="text-gray-600 text-lg mb-6">
            Your account has been created successfully. You're now ready to explore our platform.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <motion.button
            onClick={() => {
              // Redirect based on user type
              if (formData.userType === 'seller' || formData.userType === 'business') {
                window.location.href = '/dashboard';
              } else {
                window.location.href = '/marketplace';
              }
            }}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {formData.userType === 'seller' || formData.userType === 'business' 
              ? 'Go to Dashboard' 
              : 'Explore Marketplace'
            }
          </motion.button>

          <motion.button
            onClick={() => window.location.href = '/'}
            className="w-full py-4 border-2 border-gray-200 text-gray-600 rounded-2xl font-semibold hover:border-amber-300 hover:bg-amber-50 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Back to Home
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }
}