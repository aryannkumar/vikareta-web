'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
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
  FileText,
  Camera,
  Upload,
  X
} from 'lucide-react';

// Import services and types
import { onboardingService } from '../../../services/onboarding.service';
import { OnboardingFlow, BasicProfileForm, BusinessBasicForm } from '../../../types';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Textarea } from '../../../components/ui/textarea';
import { Select } from '../../../components/ui/select';
import { Checkbox } from '../../../components/ui/checkbox';

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
type UserType = 'buyer' | 'business' | '';

interface FormData {
  // User type
  userType: UserType;

  // Personal information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;

  // Business information
  businessName: string;
  businessType: string;
  gstin: string;
  industry: string;
  description: string;
  website: string;

  // Location
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
  const router = useRouter();
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
    industry: '',
    description: '',
    website: '',
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
  const [onboardingFlow, setOnboardingFlow] = useState<OnboardingFlow | null>(null);

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
        if (formData.userType === 'business') {
          if (!formData.businessName.trim()) {
            newErrors.businessName = 'Business name is required';
          }
          if (!formData.businessType) {
            newErrors.businessType = 'Business type is required';
          }
          if (!formData.industry) {
            newErrors.industry = 'Industry is required';
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
        if (!formData.emailVerified && !formData.phoneVerified) {
          newErrors.emailVerified = 'Verify at least email or phone';
          newErrors.phoneVerified = 'Verify at least email or phone';
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

  // OTP functions with backend integration
  const sendOTP = async (type: 'email' | 'phone') => {
    setOtpLoading(true);
    setCurrentOtpType(type);
    try {
      const identifier = type === 'email' ? formData.email.trim().toLowerCase() : formData.phone;

      // Use the auth service for OTP sending
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          identifier,
          type,
          purpose: 'registration'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send OTP');
      }

      setOtpTimer(30);
      alert(`Verification code sent to your ${type}`);
    } catch (error) {
      console.error('Send OTP error:', error);
      alert(`Failed to send OTP to ${type}`);
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOTP = async (code: string, type: 'email' | 'phone') => {
    setLoading(true);
    try {
      const identifier = type === 'email' ? formData.email.trim().toLowerCase() : formData.phone;

      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          identifier,
          otp: code,
          type,
          purpose: 'registration'
        })
      });

      if (!response.ok) {
        throw new Error('Invalid OTP');
      }

      if (type === 'email') {
        setFormData(prev => ({ ...prev, emailVerified: true }));
      } else {
        setFormData(prev => ({ ...prev, phoneVerified: true }));
      }
      setCurrentOtpType(null);
      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} verified successfully`);
    } catch (error) {
      console.error('Verify OTP error:', error);
      alert('Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  // Final registration with backend integration
  const handleFinalSubmit = async () => {
    if (!validateStep('verification')) return;

    setLoading(true);
    try {
      // Prepare registration data based on user type
      const registrationData: BasicProfileForm = {
        userType: formData.userType as 'buyer' | 'business',
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };

      // Add business data if applicable
      if (formData.userType === 'business') {
        const businessData: BusinessBasicForm = {
          companyName: formData.businessName,
          businessType: formData.businessType as any,
          industry: formData.industry,
          description: formData.description,
          website: formData.website || undefined,
          email: formData.email,
          phone: formData.phone,
          address: {
            street: formData.address,
            city: formData.city,
            state: formData.state,
            postalCode: formData.pincode,
            country: formData.country
          }
        };

        // Register with business data
        await onboardingService.updateBusinessBasic(businessData);
      }

      // Complete basic profile
      await onboardingService.completeProfile(registrationData);

      // Get onboarding flow for next steps
      const flow = await onboardingService.getStatus();
      setOnboardingFlow(flow);

      setCurrentStep('complete');
      alert('Registration Successful! Welcome to Vikareta!');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Social registration handlers
  const handleSocialRegister = async (provider: string) => {
    try {
      setLoading(true);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.vikareta.com/api';
      const state = encodeURIComponent(window.location.pathname + window.location.search);
      const redirectUrl = `${apiUrl}/auth/${provider}?state=${state}`;

      window.location.href = redirectUrl;
    } catch (error) {
      console.error(`${provider} OAuth error:`, error);
      alert(`Failed to initialize ${provider} registration`);
      setLoading(false);
    }
  };

  // Verification handlers
  const handleEmailVerification = async () => {
    if (!formData.email) {
      alert('Please enter your email address first');
      return;
    }
    await sendOTP('email');
  };

  const handlePhoneVerification = async () => {
    if (!formData.phone) {
      alert('Please enter your phone number first');
      return;
    }
    await sendOTP('phone');
  };

  const handleBusinessVerification = async () => {
    // TODO: Implement business document verification
    alert('Business document verification coming soon');
  };

  // Progress calculation
  const getProgress = () => {
    const steps = ['userType', 'personal', 'business', 'verification', 'complete'];
    const currentIndex = steps.indexOf(currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  // Step Components
  const UserTypeStep = () => (
    <motion.div
      key="userType"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Choose Your Account Type</h2>
        <p className="text-gray-600">Select the type of account that best describes you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { type: 'buyer', title: 'Normal User', description: 'Browse and purchase products and services', icon: '👤' },
          { type: 'business', title: 'Business User', description: 'Access dashboard at dashboard.vikareta.com', icon: '🏢' }
        ].map((option) => (
          <motion.button
            key={option.type}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setFormData({ ...formData, userType: option.type as UserType })}
            className={`p-8 rounded-xl border-2 transition-all duration-200 text-left ${
              formData.userType === option.type
                ? 'border-amber-500 bg-amber-50 shadow-lg'
                : 'border-gray-200 hover:border-amber-300 hover:bg-gray-50'
            }`}
          >
            <div className="text-4xl mb-4">{option.icon}</div>
            <h3 className="font-semibold text-gray-800 mb-2">{option.title}</h3>
            <p className="text-sm text-gray-600">{option.description}</p>
          </motion.button>
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={() => setCurrentStep('personal')}
          disabled={!formData.userType}
          className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </Button>
      </div>
    </motion.div>
  );

  const PersonalInfoStep = () => (
    <motion.div
      key="personal"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Personal Information</h2>
        <p className="text-gray-600">Tell us about yourself</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <Input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            placeholder="Enter your first name"
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <Input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            placeholder="Enter your last name"
            className="w-full"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Enter your email address"
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
        <Input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="Enter your phone number"
          className="w-full"
        />
      </div>

      <div className="flex justify-between">
        <Button
          onClick={() => setCurrentStep('userType')}
          variant="outline"
          className="px-6 py-3"
        >
          Back
        </Button>
        <Button
          onClick={() => setCurrentStep(formData.userType === 'business' ? 'business' : 'verification')}
          className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Continue
        </Button>
      </div>
    </motion.div>
  );

  const BusinessInfoStep = () => (
    <motion.div
      key="business"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Business Setup</h2>
        <p className="text-gray-600">Set up your business profile for dashboard access</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
        <Input
          type="text"
          value={formData.businessName}
          onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
          placeholder="Enter your business name"
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
        <select
          value={formData.businessType}
          onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        >
          <option value="">Select business type</option>
          <option value="retail">Retail</option>
          <option value="wholesale">Wholesale</option>
          <option value="manufacturing">Manufacturing</option>
          <option value="services">Services</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Business Address</label>
        <Input
          type="text"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Enter your business address"
          className="w-full"
        />
      </div>

      <div className="flex justify-between">
        <Button
          onClick={() => setCurrentStep('personal')}
          variant="outline"
          className="px-6 py-3"
        >
          Back
        </Button>
        <Button
          onClick={() => setCurrentStep('verification')}
          className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Continue
        </Button>
      </div>
    </motion.div>
  );

  const VerificationStep = () => (
    <motion.div
      key="verification"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification</h2>
        <p className="text-gray-600">Verify your account to complete registration</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <span className="text-amber-600">📧</span>
            </div>
            <div>
              <p className="font-medium text-gray-800">Email Verification</p>
              <p className="text-sm text-gray-600">Verify your email address</p>
            </div>
          </div>
          <Button
            onClick={() => handleEmailVerification()}
            disabled={loading}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg"
          >
            {loading ? 'Sending...' : 'Send Code'}
          </Button>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600">📱</span>
            </div>
            <div>
              <p className="font-medium text-gray-800">Phone Verification</p>
              <p className="text-sm text-gray-600">Verify your phone number</p>
            </div>
          </div>
          <Button
            onClick={() => handlePhoneVerification()}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            {loading ? 'Sending...' : 'Send Code'}
          </Button>
        </div>

        {formData.userType === 'business' && (
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">🏢</span>
              </div>
              <div>
                <p className="font-medium text-gray-800">Business Verification</p>
                <p className="text-sm text-gray-600">Verify your business documents</p>
              </div>
            </div>
            <Button
              onClick={() => handleBusinessVerification()}
              disabled={loading}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
            >
              {loading ? 'Uploading...' : 'Upload Docs'}
            </Button>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button
          onClick={() => setCurrentStep(formData.userType === 'business' ? 'business' : 'personal')}
          variant="outline"
          className="px-6 py-3"
        >
          Back
        </Button>
        <Button
          onClick={() => setCurrentStep('complete')}
          className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Complete Registration
        </Button>
      </div>
    </motion.div>
  );

  const CompleteStep = () => (
    <motion.div
      key="complete"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-6"
    >
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-4xl">✅</span>
      </div>

      <h2 className="text-3xl font-bold text-gray-800 mb-2">Registration Complete!</h2>
      <p className="text-gray-600 mb-6">
        Welcome to Vikareta! Your account has been successfully created.
        {formData.userType === 'business'
          ? ' You can now access your dashboard at dashboard.vikareta.com'
          : ' You can now start exploring our marketplace and connecting with businesses.'
        }
      </p>

      <div className="space-y-3">
        {formData.userType === 'business' ? (
          <>
            <Button
              onClick={() => window.location.href = 'https://dashboard.vikareta.com'}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Go to Dashboard
            </Button>
            <Button
              onClick={() => router.push('/marketplace')}
              variant="outline"
              className="w-full py-3"
            >
              Explore Marketplace
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => router.push('/marketplace')}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Explore Marketplace
            </Button>
            <Button
              onClick={() => router.push('/dashboard')}
              variant="outline"
              className="w-full py-3"
            >
              View Dashboard
            </Button>
          </>
        )}
      </div>
    </motion.div>
  );

  // Render current step component
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'userType':
        return <UserTypeStep />;
      case 'personal':
        return <PersonalInfoStep />;
      case 'business':
        return <BusinessInfoStep />;
      case 'verification':
        return <VerificationStep />;
      case 'complete':
        return <CompleteStep />;
      default:
        return <UserTypeStep />;
    }
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
              initial={{ opacity: 0, y: 30 }}
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
              <span className={currentStep === 'business' ? 'text-amber-600 font-semibold' : ''}>Business Setup</span>
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
};