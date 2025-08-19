'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  X, 
  Plus,
  AlertCircle,
  Loader2,
  CheckCircle
} from 'lucide-react';
import MyRFQsSection from './MyRFQsSection';

// Types for My RFQ section
interface QuoteResponse {
  id: string;
  sellerId: string;
  seller: {
    name: string;
    rating: number;
    responseTime: string;
  };
  price: number;
  deliveryTime: string;
  description: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  negotiationCount: number;
}

interface RfqDetails {
  id: string;
  title: string;
  description: string;
  categoryName: string;
  quantity: number;
  unit: string;
  budget: number;
  timeline: string;
  location: string;
  status: 'active' | 'closed' | 'draft';
  createdAt: string;
  buyer: {
    name: string;
    email: string;
  };
  category: {
    name: string;
    slug: string;
  };
  subcategory?: {
    name: string;
    slug: string;
  };
  totalResponses: number;
  avgResponsePrice: number;
  bestOffer?: QuoteResponse;
  specifications: { key: string; value: string }[];
  attachments: File[];
}

interface RfqWithResponses extends RfqDetails {
  responses: {
    platform: QuoteResponse[];
    whatsapp: any[];
  };
  responseAnalytics: {
    totalResponses: number;
    avgPrice: number;
    priceRange: { min: number; max: number };
    avgDeliveryTime: number;
  };
}

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
  const [activeTab, setActiveTab] = useState<'new' | 'my'>('new');
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

  const categories = [
    'Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Health', 'Automotive', 'Business'
  ];

  const units = ['pieces', 'kg', 'tons', 'meters', 'liters', 'boxes', 'sets'];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors['title'] = 'Title is required';
    }
    if (!formData.category) {
      newErrors['category'] = 'Category is required';
    }
    if (!formData.description.trim()) {
      newErrors['description'] = 'Description is required';
    }
    if (!formData.quantity.trim()) {
      newErrors['quantity'] = 'Quantity is required';
    }
    if (!formData.unit) {
      newErrors['unit'] = 'Unit is required';
    }
    if (!formData.budget.trim()) {
      newErrors['budget'] = 'Budget is required';
    }
    if (!formData.timeline.trim()) {
      newErrors['timeline'] = 'Timeline is required';
    }
    if (!formData.location.trim()) {
      newErrors['location'] = 'Location is required';
    }
    if (!formData.contactInfo.name.trim()) {
      newErrors['contactInfo.name'] = 'Name is required';
    }
    if (!formData.contactInfo.email.trim()) {
      newErrors['contactInfo.email'] = 'Email is required';
    }
    if (!formData.contactInfo.phone.trim()) {
      newErrors['contactInfo.phone'] = 'Phone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    const fieldParts = field.split('.');
    if (fieldParts.length === 2 && fieldParts[0] === 'contactInfo') {
      setFormData(prev => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          [fieldParts[1]]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitted(true);
      console.log('RFQ submitted:', formData);
    } catch (error) {
      console.error('Error submitting RFQ:', error);
    } finally {
      setLoading(false);
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

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...newFiles]
      }));
    }
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-8">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-800 mb-2">RFQ Submitted Successfully!</h2>
              <p className="text-green-700 mb-6">
                Your Request for Quotation has been submitted and distributed to relevant sellers. 
                You will receive responses via email and WhatsApp.
              </p>
              <div className="space-x-4">
                <button
                  onClick={() => setActiveTab('my')}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                >
                  View My RFQs
                </button>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
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
                      contactInfo: { name: '', email: '', phone: '', company: '' }
                    });
                  }}
                  className="border border-green-600 text-green-600 px-6 py-2 rounded-lg hover:bg-green-50"
                >
                  Create New RFQ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Request for Quotation (RFQ)</h1>
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-8 bg-muted p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('new')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'new' 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              New RFQ
            </button>
            <button 
              onClick={() => setActiveTab('my')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'my' 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              My RFQs
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'new' ? (
            <NewRFQForm />
          ) : (
            <MyRFQsSection />
          )}
        </div>
      </div>
    </div>
  );

  // Component for New RFQ Form
  function NewRFQForm() {
    return (
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
          
          <div className="space-y-6">
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
                placeholder="Enter a clear title for your RFQ"
                disabled={loading}
              />
              {errors.title && (
                <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                  <AlertCircle className="h-3 w-3" />
                  {errors.title}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                    <AlertCircle className="h-3 w-3" />
                    {errors.category}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background ${
                    errors.location ? 'border-red-500' : ''
                  }`}
                  placeholder="City, State/Province"
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

            <div>
              <label className="block text-sm font-medium mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background ${
                  errors.description ? 'border-red-500' : ''
                }`}
                placeholder="Provide detailed description of what you need"
                disabled={loading}
              />
              {errors.description && (
                <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                  <AlertCircle className="h-3 w-3" />
                  {errors.description}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quantity and Budget */}
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
                  <option key={unit} value={unit}>{unit}</option>
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
                Budget Range <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background ${
                  errors.budget ? 'border-red-500' : ''
                }`}
                placeholder="e.g., $1000-$2000"
                disabled={loading}
              />
              {errors.budget && (
                <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                  <AlertCircle className="h-3 w-3" />
                  {errors.budget}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">
              Timeline <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.timeline}
              onChange={(e) => handleInputChange('timeline', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background ${
                errors.timeline ? 'border-red-500' : ''
              }`}
              placeholder="e.g., Within 2 weeks, ASAP, End of month"
              disabled={loading}
            />
            {errors.timeline && (
              <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                <AlertCircle className="h-3 w-3" />
                {errors.timeline}
              </div>
            )}
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Technical Specifications</h2>
            <button
              type="button"
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={addSpecification}
              disabled={loading}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Specification
            </button>
          </div>
          
          <div className="space-y-4">
            {formData.specifications.map((spec, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={spec}
                  onChange={(e) => updateSpecification(index, e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  placeholder="Enter specification (e.g., Color: Blue, Material: Steel)"
                  disabled={loading}
                />
                {formData.specifications.length > 1 && (
                  <button
                    type="button"
                    className="inline-flex items-center p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => removeSpecification(index)}
                    disabled={loading}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* File Attachments */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-6">Attachments</h2>
          
          <div className="space-y-4">
            <div>
              <label className="cursor-pointer">
                <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>
                  Choose Files
                </button>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  disabled={loading}
                />
              </label>
              <p className="text-xs text-muted-foreground mt-1">
                Supported formats: PDF, DOC, XLS, JPG, PNG (Max 10MB each)
              </p>
            </div>

            {formData.attachments.length > 0 && (
              <div className="space-y-2">
                {formData.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{file.name}</span>
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300">
                        {(file.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                    </div>
                    <button
                      type="button"
                      className="inline-flex items-center p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => removeAttachment(index)}
                      disabled={loading}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
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
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.contactInfo.email}
                onChange={(e) => handleInputChange('contactInfo.email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background ${
                  errors['contactInfo.email'] ? 'border-red-500' : ''
                }`}
                placeholder="Enter your email"
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

            <div>
              <label className="block text-sm font-medium mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={formData.contactInfo.company}
                onChange={(e) => handleInputChange('contactInfo.company', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                placeholder="Enter company name (optional)"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
          </button>
          
          <p className="text-xs text-muted-foreground mt-4">
            By submitting this RFQ, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </form>
    );
  }
}