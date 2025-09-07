'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  User,
  Building,
  FileText,
  CreditCard,
  Upload,
  Shield,
  Settings,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Eye,
  EyeOff,
  Camera,
  X
} from 'lucide-react';
import { onboardingService } from '../../services/onboarding.service';
import { OnboardingFlow, BasicProfileForm, BusinessBasicForm, BusinessTaxForm, BusinessBankForm, BusinessDocumentForm, BusinessSettingsForm } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Select } from '../ui/select';
import { Checkbox } from '../ui/checkbox';

interface OnboardingProps {
  onComplete?: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const router = useRouter();
  const [currentFlow, setCurrentFlow] = useState<OnboardingFlow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<string>('');

  // Form states
  const [basicProfile, setBasicProfile] = useState<Partial<BasicProfileForm>>({});
  const [businessBasic, setBusinessBasic] = useState<Partial<BusinessBasicForm>>({});
  const [businessTax, setBusinessTax] = useState<Partial<BusinessTaxForm>>({});
  const [businessBank, setBusinessBank] = useState<Partial<BusinessBankForm>>({});
  const [businessSettings, setBusinessSettings] = useState<Partial<BusinessSettingsForm>>({
    allowPublicProfile: true,
    showContactInfo: true,
    autoAcceptOrders: false,
    notificationPreferences: {
      orderUpdates: true,
      paymentUpdates: true,
      reviewUpdates: true,
      marketingEmails: false,
    },
  });

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    loadOnboardingStatus();
  }, []);

  const loadOnboardingStatus = async () => {
    try {
      setLoading(true);
      const flow = await onboardingService.getStatus();
      setCurrentFlow(flow);

      // Set current step to the first incomplete required step
      const firstIncompleteStep = flow.steps.find(step => step.required && !step.completed);
      if (firstIncompleteStep) {
        setCurrentStep(firstIncompleteStep.key);
      } else if (flow.steps.length > 0) {
        setCurrentStep(flow.steps[0].key);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load onboarding status');
    } finally {
      setLoading(false);
    }
  };

  const handleBasicProfileSubmit = async () => {
    try {
      setLoading(true);
      await onboardingService.completeProfile(basicProfile as BasicProfileForm);
      await loadOnboardingStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleBusinessBasicSubmit = async () => {
    try {
      setLoading(true);
      await onboardingService.updateBusinessBasic(businessBasic as BusinessBasicForm);
      await loadOnboardingStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update business information');
    } finally {
      setLoading(false);
    }
  };

  const handleBusinessTaxSubmit = async () => {
    try {
      setLoading(true);
      await onboardingService.updateBusinessTax(businessTax as BusinessTaxForm);
      await loadOnboardingStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update tax information');
    } finally {
      setLoading(false);
    }
  };

  const handleBusinessBankSubmit = async () => {
    try {
      setLoading(true);
      await onboardingService.updateBusinessBank(businessBank as BusinessBankForm);
      await loadOnboardingStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update bank details');
    } finally {
      setLoading(false);
    }
  };

  const handleBusinessSettingsSubmit = async () => {
    try {
      setLoading(true);
      await onboardingService.updateBusinessSettings(businessSettings as BusinessSettingsForm);
      await loadOnboardingStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setUploadingFile(true);
      const documentUrl = await onboardingService.uploadFile(file);
      return documentUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
      return null;
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDocumentSubmit = async (documentData: BusinessDocumentForm) => {
    try {
      setLoading(true);
      await onboardingService.uploadDocument(documentData);
      await loadOnboardingStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  const getStepIcon = (stepKey: string) => {
    switch (stepKey) {
      case 'basicProfile':
      case 'businessBasic':
        return <User className="w-5 h-5" />;
      case 'businessTax':
        return <FileText className="w-5 h-5" />;
      case 'businessBank':
        return <CreditCard className="w-5 h-5" />;
      case 'businessDocuments':
        return <Upload className="w-5 h-5" />;
      case 'emailVerification':
        return <Mail className="w-5 h-5" />;
      case 'businessVerification':
        return <Shield className="w-5 h-5" />;
      case 'securitySetup':
        return <Shield className="w-5 h-5" />;
      case 'subscription':
        return <Settings className="w-5 h-5" />;
      default:
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getStepComponent = (stepKey: string) => {
    switch (stepKey) {
      case 'basicProfile':
        return <BasicProfileStep
          data={basicProfile}
          onChange={setBasicProfile}
          onSubmit={handleBasicProfileSubmit}
          loading={loading}
        />;
      case 'businessBasic':
        return <BusinessBasicStep
          data={businessBasic}
          onChange={setBusinessBasic}
          onSubmit={handleBusinessBasicSubmit}
          loading={loading}
        />;
      case 'businessTax':
        return <BusinessTaxStep
          data={businessTax}
          onChange={setBusinessTax}
          onSubmit={handleBusinessTaxSubmit}
          loading={loading}
        />;
      case 'businessBank':
        return <BusinessBankStep
          data={businessBank}
          onChange={setBusinessBank}
          onSubmit={handleBusinessBankSubmit}
          loading={loading}
        />;
      case 'businessDocuments':
        return <BusinessDocumentsStep
          onFileUpload={handleFileUpload}
          onSubmit={handleDocumentSubmit}
          loading={loading}
          uploadingFile={uploadingFile}
        />;
      case 'businessSettings':
        return <BusinessSettingsStep
          data={businessSettings}
          onChange={setBusinessSettings}
          onSubmit={handleBusinessSettingsSubmit}
          loading={loading}
        />;
      default:
        return <div>Step not implemented</div>;
    }
  };

  if (loading && !currentFlow) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6 max-w-md">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!currentFlow) {
    return null;
  }

  // Check if onboarding is complete
  if (currentFlow.completed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen flex items-center justify-center p-4"
      >
        <Card className="p-8 max-w-md text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          </motion.div>

          <h1 className="text-2xl font-bold mb-4">Welcome to Vikareta!</h1>
          <p className="text-gray-600 mb-6">
            Your onboarding is complete. You're now ready to explore the platform.
          </p>

          <div className="space-y-3">
            <Button
              onClick={() => router.push('/dashboard')}
              className="w-full"
            >
              Go to Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/marketplace')}
              className="w-full"
            >
              Explore Marketplace
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  const currentStepData = currentFlow.steps.find(step => step.key === currentStep);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-600">
            {currentFlow.userType === 'business'
              ? 'Set up your business profile to start selling on Vikareta'
              : 'Complete your profile to get started'
            }
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Onboarding Progress</h2>
            <Badge variant={currentFlow.completed ? 'default' : 'secondary'}>
              {currentFlow.progress}% Complete
            </Badge>
          </div>

          <Progress value={currentFlow.progress} className="mb-4" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {currentFlow.steps.map((step) => (
              <motion.div
                key={step.key}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  step.key === currentStep
                    ? 'border-amber-500 bg-amber-50'
                    : step.completed
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-amber-300'
                }`}
                onClick={() => setCurrentStep(step.key)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-2">
                  <div className={`p-1 rounded ${
                    step.completed ? 'bg-green-500 text-white' : 'bg-gray-200'
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      getStepIcon(step.key)
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{step.label}</p>
                    {step.required && (
                      <Badge variant="outline" className="text-xs mt-1">
                        Required
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Current Step */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStepData && getStepComponent(currentStep)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Step Components
function BasicProfileStep({
  data,
  onChange,
  onSubmit,
  loading
}: {
  data: Partial<BasicProfileForm>;
  onChange: (data: Partial<BasicProfileForm>) => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <User className="w-6 h-6 text-amber-500" />
        <h2 className="text-xl font-semibold">Basic Profile Information</h2>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">First Name</label>
            <Input
              value={data.firstName || ''}
              onChange={(e) => onChange({ ...data, firstName: e.target.value })}
              placeholder="Enter first name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Last Name</label>
            <Input
              value={data.lastName || ''}
              onChange={(e) => onChange({ ...data, lastName: e.target.value })}
              placeholder="Enter last name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <Input
            type="email"
            value={data.email || ''}
            onChange={(e) => onChange({ ...data, email: e.target.value })}
            placeholder="Enter email address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Phone</label>
          <Input
            value={data.phone || ''}
            onChange={(e) => onChange({ ...data, phone: e.target.value })}
            placeholder="+91 Enter phone number"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={data.password || ''}
                onChange={(e) => onChange({ ...data, password: e.target.value })}
                placeholder="Create password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                value={data.confirmPassword || ''}
                onChange={(e) => onChange({ ...data, confirmPassword: e.target.value })}
                placeholder="Confirm password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" disabled={loading}>
            Skip for Now
          </Button>
          <Button onClick={onSubmit} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Save & Continue
          </Button>
        </div>
      </div>
    </Card>
  );
}

function BusinessBasicStep({
  data,
  onChange,
  onSubmit,
  loading
}: {
  data: Partial<BusinessBasicForm>;
  onChange: (data: Partial<BusinessBasicForm>) => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Building className="w-6 h-6 text-amber-500" />
        <h2 className="text-xl font-semibold">Business Information</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Company Name</label>
          <Input
            value={data.companyName || ''}
            onChange={(e) => onChange({ ...data, companyName: e.target.value })}
            placeholder="Enter company name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Business Type</label>
          <Select
            value={data.businessType || ''}
            onValueChange={(value) => onChange({ ...data, businessType: value as any })}
          >
            <option value="">Select business type</option>
            <option value="sole_proprietorship">Sole Proprietorship</option>
            <option value="partnership">Partnership</option>
            <option value="private_limited">Private Limited</option>
            <option value="public_limited">Public Limited</option>
            <option value="llp">LLP</option>
            <option value="other">Other</option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Industry</label>
          <Input
            value={data.industry || ''}
            onChange={(e) => onChange({ ...data, industry: e.target.value })}
            placeholder="e.g., Manufacturing, Retail, Services"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <Textarea
            value={data.description || ''}
            onChange={(e) => onChange({ ...data, description: e.target.value })}
            placeholder="Describe your business..."
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              value={data.email || ''}
              onChange={(e) => onChange({ ...data, email: e.target.value })}
              placeholder="Business email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <Input
              value={data.phone || ''}
              onChange={(e) => onChange({ ...data, phone: e.target.value })}
              placeholder="Business phone"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Website (Optional)</label>
          <Input
            value={data.website || ''}
            onChange={(e) => onChange({ ...data, website: e.target.value })}
            placeholder="https://yourwebsite.com"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" disabled={loading}>
            Skip for Now
          </Button>
          <Button onClick={onSubmit} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Save & Continue
          </Button>
        </div>
      </div>
    </Card>
  );
}

function BusinessTaxStep({
  data,
  onChange,
  onSubmit,
  loading
}: {
  data: Partial<BusinessTaxForm>;
  onChange: (data: Partial<BusinessTaxForm>) => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <FileText className="w-6 h-6 text-amber-500" />
        <h2 className="text-xl font-semibold">Tax Information</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">GSTIN (Optional)</label>
          <Input
            value={data.gstin || ''}
            onChange={(e) => onChange({ ...data, gstin: e.target.value.toUpperCase() })}
            placeholder="Enter GSTIN"
            maxLength={15}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">PAN Number (Optional)</label>
          <Input
            value={data.panNumber || ''}
            onChange={(e) => onChange({ ...data, panNumber: e.target.value.toUpperCase() })}
            placeholder="Enter PAN number"
            maxLength={10}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tax ID (Optional)</label>
          <Input
            value={data.taxId || ''}
            onChange={(e) => onChange({ ...data, taxId: e.target.value })}
            placeholder="Enter tax ID"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            checked={data.taxExempt || false}
            onChange={(e) => onChange({ ...data, taxExempt: e.target.checked })}
          />
          <label className="text-sm">Tax Exempt</label>
        </div>

        {data.taxExempt && (
          <div>
            <label className="block text-sm font-medium mb-2">Exemption Reason</label>
            <Textarea
              value={data.taxExemptionReason || ''}
              onChange={(e) => onChange({ ...data, taxExemptionReason: e.target.value })}
              placeholder="Please provide reason for tax exemption"
              rows={3}
            />
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" disabled={loading}>
            Skip for Now
          </Button>
          <Button onClick={onSubmit} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Save & Continue
          </Button>
        </div>
      </div>
    </Card>
  );
}

function BusinessBankStep({
  data,
  onChange,
  onSubmit,
  loading
}: {
  data: Partial<BusinessBankForm>;
  onChange: (data: Partial<BusinessBankForm>) => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <CreditCard className="w-6 h-6 text-amber-500" />
        <h2 className="text-xl font-semibold">Bank Details</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Account Name</label>
          <Input
            value={data.accountName || ''}
            onChange={(e) => onChange({ ...data, accountName: e.target.value })}
            placeholder="Enter account holder name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Account Number</label>
          <Input
            value={data.accountNumber || ''}
            onChange={(e) => onChange({ ...data, accountNumber: e.target.value.replace(/\D/g, '') })}
            placeholder="Enter account number"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Bank Name</label>
            <Input
              value={data.bankName || ''}
              onChange={(e) => onChange({ ...data, bankName: e.target.value })}
              placeholder="Enter bank name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">IFSC Code</label>
            <Input
              value={data.ifscCode || ''}
              onChange={(e) => onChange({ ...data, ifscCode: e.target.value.toUpperCase() })}
              placeholder="Enter IFSC code"
              maxLength={11}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Branch Name (Optional)</label>
          <Input
            value={data.branchName || ''}
            onChange={(e) => onChange({ ...data, branchName: e.target.value })}
            placeholder="Enter branch name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">SWIFT Code (Optional)</label>
          <Input
            value={data.swiftCode || ''}
            onChange={(e) => onChange({ ...data, swiftCode: e.target.value.toUpperCase() })}
            placeholder="Enter SWIFT code"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" disabled={loading}>
            Skip for Now
          </Button>
          <Button onClick={onSubmit} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Save & Continue
          </Button>
        </div>
      </div>
    </Card>
  );
}

function BusinessDocumentsStep({
  onFileUpload,
  onSubmit,
  loading,
  uploadingFile
}: {
  onFileUpload: (file: File) => Promise<string | null>;
  onSubmit: (data: BusinessDocumentForm) => void;
  loading: boolean;
  uploadingFile: boolean;
}) {
  const [documents, setDocuments] = useState<Partial<BusinessDocumentForm>[]>([]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const documentUrl = await onFileUpload(file);
    if (documentUrl) {
      const newDocuments = [...documents];
      newDocuments[index] = {
        ...newDocuments[index],
        documentUrl,
        documentType: newDocuments[index].documentType || 'other'
      };
      setDocuments(newDocuments);
    }
  };

  const addDocument = () => {
    setDocuments([...documents, {}]);
  };

  const removeDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    documents.forEach((doc) => {
      if (doc.documentUrl && doc.documentType) {
        onSubmit(doc as BusinessDocumentForm);
      }
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Upload className="w-6 h-6 text-amber-500" />
        <h2 className="text-xl font-semibold">Business Documents</h2>
      </div>

      <div className="space-y-4">
        {documents.map((doc, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Document {index + 1}</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeDocument(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Document Type</label>
              <Select
                value={doc.documentType || ''}
                onValueChange={(value) => {
                  const newDocuments = [...documents];
                  newDocuments[index] = { ...newDocuments[index], documentType: value as any };
                  setDocuments(newDocuments);
                }}
              >
                <option value="">Select document type</option>
                <option value="gst_certificate">GST Certificate</option>
                <option value="pan_card">PAN Card</option>
                <option value="aadhar_card">Aadhar Card</option>
                <option value="business_license">Business License</option>
                <option value="address_proof">Address Proof</option>
                <option value="bank_statement">Bank Statement</option>
                <option value="other">Other</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Document Number (Optional)</label>
              <Input
                value={doc.documentNumber || ''}
                onChange={(e) => {
                  const newDocuments = [...documents];
                  newDocuments[index] = { ...newDocuments[index], documentNumber: e.target.value };
                  setDocuments(newDocuments);
                }}
                placeholder="Enter document number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Upload Document</label>
              <Input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileSelect(e, index)}
                disabled={uploadingFile}
              />
              {uploadingFile && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
              {doc.documentUrl && <p className="text-sm text-green-600 mt-1">Document uploaded successfully</p>}
            </div>
          </div>
        ))}

        <Button variant="outline" onClick={addDocument} className="w-full">
          Add Another Document
        </Button>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" disabled={loading}>
            Skip for Now
          </Button>
          <Button onClick={handleSubmit} disabled={loading || documents.length === 0}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Upload Documents
          </Button>
        </div>
      </div>
    </Card>
  );
}

function BusinessSettingsStep({
  data,
  onChange,
  onSubmit,
  loading
}: {
  data: Partial<BusinessSettingsForm>;
  onChange: (data: Partial<BusinessSettingsForm>) => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Settings className="w-6 h-6 text-amber-500" />
        <h2 className="text-xl font-semibold">Business Settings</h2>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-4">Privacy Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Public Profile</p>
                <p className="text-sm text-gray-600">Allow others to view your business profile</p>
              </div>
              <Checkbox
                checked={data.allowPublicProfile || false}
                onChange={(e) =>
                  onChange({
                    ...data,
                    allowPublicProfile: e.target.checked
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Show Contact Info</p>
                <p className="text-sm text-gray-600">Display email and phone on your profile</p>
              </div>
              <Checkbox
                checked={data.showContactInfo || false}
                onChange={(e) =>
                  onChange({
                    ...data,
                    showContactInfo: e.target.checked
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto Accept Orders</p>
                <p className="text-sm text-gray-600">Automatically accept incoming orders</p>
              </div>
              <Checkbox
                checked={data.autoAcceptOrders || false}
                onChange={(e) =>
                  onChange({
                    ...data,
                    autoAcceptOrders: e.target.checked
                  })
                }
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-4">Notification Preferences</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Order Updates</p>
                <p className="text-sm text-gray-600">Get notified about order status changes</p>
              </div>
              <Checkbox
                checked={data.notificationPreferences?.orderUpdates || false}
                onChange={(e) =>
                  onChange({
                    ...data,
                    notificationPreferences: {
                      orderUpdates: e.target.checked,
                      paymentUpdates: data.notificationPreferences?.paymentUpdates || false,
                      reviewUpdates: data.notificationPreferences?.reviewUpdates || false,
                      marketingEmails: data.notificationPreferences?.marketingEmails || false,
                    }
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Payment Updates</p>
                <p className="text-sm text-gray-600">Get notified about payment activities</p>
              </div>
              <Checkbox
                checked={data.notificationPreferences?.paymentUpdates || false}
                onChange={(e) =>
                  onChange({
                    ...data,
                    notificationPreferences: {
                      orderUpdates: data.notificationPreferences?.orderUpdates || false,
                      paymentUpdates: e.target.checked,
                      reviewUpdates: data.notificationPreferences?.reviewUpdates || false,
                      marketingEmails: data.notificationPreferences?.marketingEmails || false,
                    }
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Review Updates</p>
                <p className="text-sm text-gray-600">Get notified about new reviews</p>
              </div>
              <Checkbox
                checked={data.notificationPreferences?.reviewUpdates || false}
                onChange={(e) =>
                  onChange({
                    ...data,
                    notificationPreferences: {
                      orderUpdates: data.notificationPreferences?.orderUpdates || false,
                      paymentUpdates: data.notificationPreferences?.paymentUpdates || false,
                      reviewUpdates: e.target.checked,
                      marketingEmails: data.notificationPreferences?.marketingEmails || false,
                    }
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Marketing Emails</p>
                <p className="text-sm text-gray-600">Receive promotional emails and updates</p>
              </div>
              <Checkbox
                checked={data.notificationPreferences?.marketingEmails || false}
                onChange={(e) =>
                  onChange({
                    ...data,
                    notificationPreferences: {
                      orderUpdates: data.notificationPreferences?.orderUpdates || false,
                      paymentUpdates: data.notificationPreferences?.paymentUpdates || false,
                      reviewUpdates: data.notificationPreferences?.reviewUpdates || false,
                      marketingEmails: e.target.checked,
                    }
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" disabled={loading}>
            Skip for Now
          </Button>
          <Button onClick={onSubmit} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Save Settings
          </Button>
        </div>
      </div>
    </Card>
  );
}