'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  X, 
  Plus,
  Calendar,
  DollarSign,
  Package,
  Building,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast-provider';

interface RFQFormData {
  title: string;
  category: string;
  description: string;
  quantity: string;
  unit: string;
  budget: string;
  timeline: string;
  location: string;
  specifications: string[];
  attachments: File[];
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    company: string;
  };
}

export default function RFQPage() {
  const [formData, setFormData] = useState<RFQFormData>({
    title: '',
    category: '',
    description: '',
    quantity: '',
    unit: '',
    budget: '',
    timeline: '',
    location: '',
    specifications: [''],
    attachments: [],
    contactInfo: {
      name: '',
      email: '',
      phone: '',
      company: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const toast = useToast();

  const categories = [
    'Electronics & Technology',
    'Textiles & Apparel',
    'Machinery & Equipment',
    'Automotive & Transportation',
    'Construction & Building Materials',
    'Chemicals & Pharmaceuticals',
    'Food & Agriculture',
    'Packaging & Printing',
    'Services',
    'Other'
  ];

  const units = [
    'Pieces',
    'Kilograms',
    'Tons',
    'Meters',
    'Liters',
    'Boxes',
    'Sets',
    'Pairs',
    'Other'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    }

    if (!formData.quantity.trim()) {
      newErrors.quantity = 'Quantity is required';
    }

    if (!formData.unit) {
      newErrors.unit = 'Unit is required';
    }

    if (!formData.timeline.trim()) {
      newErrors.timeline = 'Timeline is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.contactInfo.name.trim()) {
      newErrors['contactInfo.name'] = 'Name is required';
    }

    if (!formData.contactInfo.email.trim()) {
      newErrors['contactInfo.email'] = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactInfo.email)) {
      newErrors['contactInfo.email'] = 'Please enter a valid email';
    }

    if (!formData.contactInfo.phone.trim()) {
      newErrors['contactInfo.phone'] = 'Phone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      // In a real app, this would submit to API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitted(true);
      toast.success('Success', 'RFQ submitted successfully! Suppliers will contact you soon.');
    } catch (error) {
      console.error('Error submitting RFQ:', error);
      toast.error('Error', 'Failed to submit RFQ. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, '']
    }));
  };

  const removeSpecification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const updateSpecification = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) => i === index ? value : spec)
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Validate files
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Error', `${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      return true;
    });

    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...validFiles]
    }));
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold mb-4">RFQ Submitted Successfully!</h2>
          <p className="text-muted-foreground mb-8">
            Your request for quote has been submitted. Relevant suppliers will review your requirements and contact you with their proposals.
          </p>
          <div className="space-y-4">
            <Button onClick={() => setSubmitted(false)} className="w-full">
              Submit Another RFQ
            </Button>
            <Button variant="outline" className="w-full">
              View My RFQs
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Request for Quote (RFQ)</h1>
            <p className="text-muted-foreground">
              Submit your requirements and get quotes from verified suppliers
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    RFQ Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background ${
                      errors.title ? 'border-red-500' : ''
                    }`}
                    placeholder="e.g., Industrial Pumps Required"
                    disabled={loading}
                  />
                  {errors.title && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                      <AlertCircle className="h-3 w-3" />
                      {errors.title}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background ${
                      errors.category ? 'border-red-500' : ''
                    }`}
                    disabled={loading}
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                      <AlertCircle className="h-3 w-3" />
                      {errors.category}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium mb-2">
                  Detailed Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background ${
                    errors.description ? 'border-red-500' : ''
                  }`}
                  rows={4}
                  placeholder="Provide detailed description of your requirements..."
                  disabled={loading}
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.description ? (
                    <div className="flex items-center gap-1 text-red-500 text-xs">
                      <AlertCircle className="h-3 w-3" />
                      {errors.description}
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      {formData.description.length}/50 minimum characters
                    </div>
                  )}
                </div>
              </div>
            </div>     
       {/* Quantity & Budget */}
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-6">Quantity & Budget</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background ${
                      errors.quantity ? 'border-red-500' : ''
                    }`}
                    placeholder="Enter quantity"
                    disabled={loading}
                  />
                  {errors.quantity && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                      <AlertCircle className="h-3 w-3" />
                      {errors.quantity}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Unit <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => handleInputChange('unit', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background ${
                      errors.unit ? 'border-red-500' : ''
                    }`}
                    disabled={loading}
                  >
                    <option value="">Select Unit</option>
                    {units.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                  {errors.unit && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                      <AlertCircle className="h-3 w-3" />
                      {errors.unit}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Budget Range (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                    placeholder="e.g., ₹50,000 - ₹1,00,000"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Timeline & Location */}
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-6">Timeline & Location</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Required Timeline <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.timeline}
                    onChange={(e) => handleInputChange('timeline', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background ${
                      errors.timeline ? 'border-red-500' : ''
                    }`}
                    placeholder="e.g., Within 30 days"
                    disabled={loading}
                  />
                  {errors.timeline && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                      <AlertCircle className="h-3 w-3" />
                      {errors.timeline}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Delivery Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background ${
                      errors.location ? 'border-red-500' : ''
                    }`}
                    placeholder="e.g., Mumbai, Maharashtra"
                    disabled={loading}
                  />
                  {errors.location && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                      <AlertCircle className="h-3 w-3" />
                      {errors.location}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Technical Specifications</h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSpecification}
                  disabled={loading}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Specification
                </Button>
              </div>
              
              <div className="space-y-4">
                {formData.specifications.map((spec, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <input
                      type="text"
                      value={spec}
                      onChange={(e) => updateSpecification(index, e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                      placeholder="e.g., Material: Stainless Steel"
                      disabled={loading}
                    />
                    {formData.specifications.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSpecification(index)}
                        disabled={loading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* File Attachments */}
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-6">Attachments (Optional)</h2>
              
              <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload images, drawings, or specifications
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Maximum file size: 10MB per file
                  </p>
                </div>
                <label className="cursor-pointer">
                  <Button type="button" variant="outline" disabled={loading}>
                    Choose Files
                  </Button>
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={loading}
                  />
                </label>
              </div>

              {formData.attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{file.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {(file.size / 1024 / 1024).toFixed(1)} MB
                        </Badge>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                        disabled={loading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.contactInfo.name}
                    onChange={(e) => handleInputChange('contactInfo.name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background ${
                      errors['contactInfo.name'] ? 'border-red-500' : ''
                    }`}
                    placeholder="Enter your full name"
                    disabled={loading}
                  />
                  {errors['contactInfo.name'] && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                      <AlertCircle className="h-3 w-3" />
                      {errors['contactInfo.name']}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.contactInfo.company}
                    onChange={(e) => handleInputChange('contactInfo.company', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                    placeholder="Enter company name"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.contactInfo.email}
                    onChange={(e) => handleInputChange('contactInfo.email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background ${
                      errors['contactInfo.email'] ? 'border-red-500' : ''
                    }`}
                    placeholder="Enter email address"
                    disabled={loading}
                  />
                  {errors['contactInfo.email'] && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                      <AlertCircle className="h-3 w-3" />
                      {errors['contactInfo.email']}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.contactInfo.phone}
                    onChange={(e) => handleInputChange('contactInfo.phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background ${
                      errors['contactInfo.phone'] ? 'border-red-500' : ''
                    }`}
                    placeholder="Enter phone number"
                    disabled={loading}
                  />
                  {errors['contactInfo.phone'] && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                      <AlertCircle className="h-3 w-3" />
                      {errors['contactInfo.phone']}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <Button
                type="submit"
                className="btn-primary px-8 py-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting RFQ...
                  </>
                ) : (
                  'Submit RFQ'
                )}
              </Button>
              
              <p className="text-xs text-muted-foreground mt-4">
                By submitting this RFQ, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}