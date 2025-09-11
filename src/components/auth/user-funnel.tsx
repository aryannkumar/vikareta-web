'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Logo } from '../ui/logo';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Smartphone,
  Shield,
  Users,
  Heart,
  ShoppingBag,
  Clock,
  Star,
  AlertCircle,
  Loader2,
  XCircle,
  MapPin
} from 'lucide-react';

interface UserRegistrationData {
  // Required fields
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  userType: 'buyer';
  
  // Optional fields
  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  interests: string[];
  location?: string;
  
  // Agreement
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
}

const USER_INTERESTS = [
  { id: 'electronics', label: 'Electronics', icon: Smartphone },
  { id: 'fashion', label: 'Fashion & Apparel', icon: Heart },
  { id: 'home', label: 'Home & Living', icon: ShoppingBag },
  { id: 'health', label: 'Health & Beauty', icon: Star },
  { id: 'automotive', label: 'Automotive', icon: Clock },
  { id: 'sports', label: 'Sports & Fitness', icon: Users },
];

export default function UserFunnel() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [registrationData, setRegistrationData] = useState<UserRegistrationData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'buyer',
    interests: [],
    location: '',
    agreeToTerms: false,
    agreeToPrivacy: false
  });

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = (field: keyof UserRegistrationData, value: string | string[] | boolean) => {
    setRegistrationData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const toggleInterest = (interestId: string) => {
    setRegistrationData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 1:
        if (!registrationData.firstName.trim()) {
          newErrors.firstName = 'First name is required';
        }
        if (!registrationData.lastName.trim()) {
          newErrors.lastName = 'Last name is required';
        }
        if (!registrationData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(registrationData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        break;
        
      case 2:
        if (!registrationData.phone.trim()) {
          newErrors.phone = 'Phone number is required';
        } else if (!/^[0-9+\-() ]{7,20}$/.test(registrationData.phone)) {
          newErrors.phone = 'Please enter a valid phone number';
        }
        if (!registrationData.password) {
          newErrors.password = 'Password is required';
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(registrationData.password)) {
          newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
        }
        if (registrationData.password !== registrationData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        break;
        
      case 3:
        // Interests are optional for users
        break;
        
      case 4:
        if (!registrationData.agreeToTerms) {
          newErrors.agreeToTerms = 'You must agree to the terms and conditions';
        }
        if (!registrationData.agreeToPrivacy) {
          newErrors.agreeToPrivacy = 'You must agree to the privacy policy';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    
    setIsLoading(true);
    setSubmitError('');
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registrationData.email,
          password: registrationData.password,
          firstName: registrationData.firstName,
          lastName: registrationData.lastName,
          userType: 'buyer',
          address: registrationData.address,
          city: registrationData.city,
          state: registrationData.state,
          postalCode: registrationData.pinCode,
          location: registrationData.location
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Registration successful
        setTimeout(() => {
          router.push('/onboarding?type=user');
        }, 1500);
      } else {
        setSubmitError(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = handleSubmit;

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Welcome to Vikareta</h2>
              <p className="text-gray-600">Let's get you started with your account</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <div className="relative group">
                    <motion.div
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-focus-within:text-orange-500"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <User className="h-5 w-5" />
                    </motion.div>
                    <motion.input
                      type="text"
                      value={registrationData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-500 transition-all duration-300 text-base shadow-sm hover:shadow-md ${
                        errors.firstName ? 'border-red-500 bg-red-50/50 shake' : 'border-gray-200 hover:border-orange-300 focus:border-orange-500'
                      }`}
                      placeholder="First name"
                      whileFocus={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    />
                    {registrationData.firstName && !errors.firstName && (
                      <motion.div
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CheckCircle className="h-5 w-5" />
                      </motion.div>
                    )}
                  </div>
                  {errors.firstName && (
                    <motion.p
                      className="mt-2 text-sm text-red-600 flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      {errors.firstName}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <div className="relative group">
                    <motion.div
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-focus-within:text-orange-500"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <User className="h-5 w-5" />
                    </motion.div>
                    <motion.input
                      type="text"
                      value={registrationData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-500 transition-all duration-300 text-base shadow-sm hover:shadow-md ${
                        errors.lastName ? 'border-red-500 bg-red-50/50 shake' : 'border-gray-200 hover:border-orange-300 focus:border-orange-500'
                      }`}
                      placeholder="Last name"
                      whileFocus={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    />
                    {registrationData.lastName && !errors.lastName && (
                      <motion.div
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CheckCircle className="h-5 w-5" />
                      </motion.div>
                    )}
                  </div>
                  {errors.lastName && (
                    <motion.p
                      className="mt-2 text-sm text-red-600 flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      {errors.lastName}
                    </motion.p>
                  )}
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative group">
                  <motion.div
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-focus-within:text-orange-500"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Mail className="h-5 w-5" />
                  </motion.div>
                  <motion.input
                    type="email"
                    value={registrationData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-500 transition-all duration-300 text-base shadow-sm hover:shadow-md ${
                      errors.email ? 'border-red-500 bg-red-50/50 shake' : 'border-gray-200 hover:border-orange-300 focus:border-orange-500'
                    }`}
                    placeholder="Enter your email"
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  />
                  {registrationData.email && !errors.email && (
                    <motion.div
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CheckCircle className="h-5 w-5" />
                    </motion.div>
                  )}
                </div>
                {errors.email && (
                  <motion.p
                    className="mt-2 text-sm text-red-600 flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {errors.email}
                  </motion.p>
                )}
              </motion.div>
            </div>

            <button
              onClick={nextStep}
              className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 flex items-center justify-center gap-2 transition-colors"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Secure Your Account</h2>
              <p className="text-gray-600">Add your phone and create a strong password</p>
            </div>

            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative group">
                  <motion.div
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-focus-within:text-orange-500"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Phone className="h-5 w-5" />
                  </motion.div>
                  <motion.input
                    type="tel"
                    value={registrationData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-500 transition-all duration-300 text-base shadow-sm hover:shadow-md ${
                      errors.phone ? 'border-red-500 bg-red-50/50 shake' : 'border-gray-200 hover:border-orange-300 focus:border-orange-500'
                    }`}
                    placeholder="+91 Enter phone number"
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  />
                  {registrationData.phone && !errors.phone && (
                    <motion.div
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CheckCircle className="h-5 w-5" />
                    </motion.div>
                  )}
                </div>
                {errors.phone && (
                  <motion.p
                    className="mt-2 text-sm text-red-600 flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {errors.phone}
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative group">
                  <motion.div
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-focus-within:text-orange-500"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Lock className="h-5 w-5" />
                  </motion.div>
                  <motion.input
                    type={showPassword ? 'text' : 'password'}
                    value={registrationData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full pl-12 pr-14 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-500 transition-all duration-300 text-base shadow-sm hover:shadow-md ${
                      errors.password ? 'border-red-500 bg-red-50/50 shake' : 'border-gray-200 hover:border-orange-300 focus:border-orange-500'
                    }`}
                    placeholder="Create a secure password"
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-600 transition-colors disabled:opacity-50"
                    disabled={isLoading}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </motion.button>
                </div>

                {/* Password Strength Indicator */}
                {registrationData.password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className="mt-4 space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100"
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Password strength:</span>
                      <motion.span
                        className={`text-sm font-semibold ${
                          registrationData.password.length >= 8 &&
                          /[A-Z]/.test(registrationData.password) &&
                          /[a-z]/.test(registrationData.password) &&
                          /\d/.test(registrationData.password)
                            ? 'text-green-600'
                            : registrationData.password.length >= 6
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {registrationData.password.length >= 8 &&
                         /[A-Z]/.test(registrationData.password) &&
                         /[a-z]/.test(registrationData.password) &&
                         /\d/.test(registrationData.password)
                          ? 'Strong'
                          : registrationData.password.length >= 6
                          ? 'Medium'
                          : 'Weak'}
                      </motion.span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <motion.div
                        className={`h-3 rounded-full ${
                          registrationData.password.length >= 8 &&
                          /[A-Z]/.test(registrationData.password) &&
                          /[a-z]/.test(registrationData.password) &&
                          /\d/.test(registrationData.password)
                            ? 'bg-green-500'
                            : registrationData.password.length >= 6
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{
                          width: `${
                            registrationData.password.length >= 8 &&
                            /[A-Z]/.test(registrationData.password) &&
                            /[a-z]/.test(registrationData.password) &&
                            /\d/.test(registrationData.password)
                              ? 100
                              : registrationData.password.length >= 6
                              ? 60
                              : 30
                          }%`
                        }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { label: '8+ chars', check: registrationData.password.length >= 8 },
                        { label: 'Uppercase', check: /[A-Z]/.test(registrationData.password) },
                        { label: 'Lowercase', check: /[a-z]/.test(registrationData.password) },
                        { label: 'Number', check: /\d/.test(registrationData.password) }
                      ].map((item, index) => (
                        <motion.div
                          key={item.label}
                          className={`flex items-center ${item.check ? 'text-green-600' : 'text-gray-400'}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <motion.div
                            animate={{ rotate: item.check ? 0 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <CheckCircle className="w-3 h-3 mr-2 flex-shrink-0" />
                          </motion.div>
                          {item.label}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {errors.password && (
                  <motion.p
                    className="mt-2 text-sm text-red-600 flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {errors.password}
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <div className="relative group">
                  <motion.div
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-focus-within:text-orange-500"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Lock className="h-5 w-5" />
                  </motion.div>
                  <motion.input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={registrationData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full pl-12 pr-14 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-500 transition-all duration-300 text-base shadow-sm hover:shadow-md ${
                      errors.confirmPassword ? 'border-red-500 bg-red-50/50 shake' : 'border-gray-200 hover:border-orange-300 focus:border-orange-500'
                    }`}
                    placeholder="Confirm your password"
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-600 transition-colors disabled:opacity-50"
                    disabled={isLoading}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </motion.button>
                  {registrationData.confirmPassword &&
                   registrationData.password === registrationData.confirmPassword &&
                   !errors.confirmPassword && (
                    <motion.div
                      className="absolute right-12 top-1/2 transform -translate-y-1/2 text-green-500"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CheckCircle className="h-5 w-5" />
                    </motion.div>
                  )}
                </div>
                {errors.confirmPassword && (
                  <motion.p
                    className="mt-2 text-sm text-red-600 flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {errors.confirmPassword}
                  </motion.p>
                )}
              </motion.div>
            </div>

            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <motion.button
                onClick={prevStep}
                className="flex-1 border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 flex items-center justify-center gap-3 transition-all duration-300 text-base shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </motion.button>
              <motion.button
                onClick={nextStep}
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:from-orange-600 hover:to-amber-600 flex items-center justify-center gap-3 text-base relative overflow-hidden group"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                Continue
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Address Information</h2>
              <p className="text-gray-600">Help us serve you better with delivery preferences</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Address (Optional)
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <textarea
                    value={registrationData.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 shadow-sm resize-none"
                    placeholder="Enter your complete address"
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City (Optional)
                  </label>
                  <input
                    type="text"
                    value={registrationData.city || ''}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 shadow-sm"
                    placeholder="Your city"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State (Optional)
                  </label>
                  <input
                    type="text"
                    value={registrationData.state || ''}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 shadow-sm"
                    placeholder="Your state"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PIN Code (Optional)
                </label>
                <input
                  type="text"
                  value={registrationData.pinCode || ''}
                  onChange={(e) => handleInputChange('pinCode', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 shadow-sm"
                  placeholder="6-digit PIN code"
                  maxLength={6}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={prevStep}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={nextStep}
                className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 flex items-center justify-center gap-2 transition-colors"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Review & Complete</h2>
              <p className="text-gray-600">Please review your information and accept our terms</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{registrationData.firstName} {registrationData.lastName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{registrationData.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{registrationData.phone}</span>
              </div>
              {registrationData.address && (
                <div className="flex justify-between items-start">
                  <span className="text-gray-600">Address:</span>
                  <span className="font-medium text-right max-w-xs">{registrationData.address}</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 mt-0.5"
                />
                <label className="text-sm text-gray-600">
                  I agree to the{' '}
                  <a href="#" className="text-orange-600 hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-orange-600 hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 mt-0.5"
                />
                <label className="text-sm text-gray-600">
                  I would like to receive marketing emails about new products and offers (optional)
                </label>
              </div>
            </div>

            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <p className="text-sm text-red-800">{submitError}</p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={prevStep}
                disabled={isLoading}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <motion.button
                onClick={handleRegister}
                disabled={!acceptTerms || isLoading}
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-base relative overflow-hidden group"
                whileHover={{ scale: isLoading ? 1 : 1.02, y: isLoading ? 0 : -1 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                {isLoading ? (
                  <motion.div
                    className="flex items-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Account...
                  </motion.div>
                ) : (
                  <motion.div
                    className="flex items-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    Complete Registration
                    <CheckCircle className="w-5 h-5" />
                  </motion.div>
                )}
              </motion.button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <motion.div 
          className="text-center mb-8"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Logo className="h-20 w-auto" />
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Step {step} of 4</span>
            <span>{Math.round((step / 4) * 100)}% complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-orange-600 hover:text-orange-700 font-medium">
              Sign in
            </Link>
          </p>
          <p className="text-xs text-gray-500">
            Are you a business?{' '}
            <Link href="/auth/register/business" className="text-orange-600 hover:text-orange-700 font-medium">
              Register as Business
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}