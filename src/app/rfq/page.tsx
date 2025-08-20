'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, AlertCircle, Loader2, CheckCircle, FileText } from 'lucide-react';
import { rfqService } from '../../services/rfq.service';
import MyRFQsSection from './MyRFQsSection';

// Types for My RFQ section
// Types for RFQ list/details live in the respective components

// RfqWithResponses is defined in the RFQ list/detail components; not needed here

interface RFQFormData {
  rfqType: 'product' | 'service';
  title: string;
  category: string;
  subcategory?: string;
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
  rfqType: 'product',
    title: '',
    category: '',
  subcategory: '',
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
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await rfqService.getCategories();
        setCategories(cats);
      } catch (error) {
        console.error('Error loading categories:', error);
        setCategories([]);
      }
    };

    loadCategories();
  }, []);

  const resetForm = () => {
    setFormData({
      rfqType: 'product',
      title: '',
      category: '',
      subcategory: '',
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
    setErrors({});
    setSubmitted(false);
  };

  // Load subcategories when category changes
  useEffect(() => {
    const loadSubs = async () => {
      if (!formData.category) {
        setSubcategories([]);
        return;
      }
      try {
        const subs = await rfqService.getSubcategories(formData.category);
        setSubcategories(subs);
      } catch (error) {
        console.error('Error loading subcategories:', error);
        setSubcategories([]);
      }
    };
    loadSubs();
  }, [formData.category]); // Only depend on category, not entire formData



  const units = ['pieces', 'kg', 'tons', 'meters', 'liters', 'boxes', 'sets'];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors['title'] = 'Title is required';
    }
    if (!formData.category) {
      newErrors['category'] = 'Category is required';
    }
    if (subcategories.length > 0 && !formData.subcategory) {
      newErrors['subcategory'] = 'Subcategory is required';
    }
    if (!formData.description.trim()) {
      newErrors['description'] = 'Description is required';
    }
    if (formData.rfqType === 'product') {
      if (!formData.quantity.trim()) {
        newErrors['quantity'] = 'Quantity is required';
      }
      if (!formData.unit) {
        newErrors['unit'] = 'Unit is required';
      }
    }
    if (!formData.budget.trim()) {
      newErrors['budget'] = 'Budget is required';
    }
    if (!formData.timeline.trim()) {
      newErrors['timeline'] = 'Timeline is required';
    }
    if (formData.rfqType === 'product') {
      if (!formData.location.trim()) {
        newErrors['location'] = 'Location is required';
      }
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

  // Simple input change helper
  const updateField = (field: string, value: string) => {
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
      setFormData(prev => {
        const newData = { ...prev, [field]: value };
        // Clear subcategory when category changes
        if (field === 'category') {
          newData.subcategory = '';
        }
        return newData;
      });
    }
    
    // Clear error if exists
    if (errors[field]) {
      setErrors(prev => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Upload attachments first
      const attachmentUrls: string[] = [];
      for (const file of formData.attachments) {
        const url = await rfqService.uploadAttachment(file);
        attachmentUrls.push(url);
      }

      // Prepare RFQ data by type
      const budgetMax = parseFloat(formData.budget.replace(/[^0-9.-]+/g, ''));
      const baseDesc = `${formData.description}\n\nContact Information:\nName: ${formData.contactInfo.name}\nEmail: ${formData.contactInfo.email}\nPhone: ${formData.contactInfo.phone}${formData.contactInfo.company ? `\nCompany: ${formData.contactInfo.company}` : ''}`;

      const common = {
        title: formData.title,
        description: baseDesc,
        categoryId: formData.category,
        subcategoryId: formData.subcategory || undefined,
        budgetMax,
        deliveryTimeline: formData.timeline,
        deliveryLocation: formData.rfqType === 'product' ? formData.location : undefined,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      } as const;

      const createPayload = formData.rfqType === 'product'
        ? { ...common, quantity: parseInt(formData.quantity) }
        : { ...common };

      const result = await rfqService.createRfq(createPayload as any);
      setSubmitted(true);
      console.log('RFQ created successfully:', result);
    } catch (error) {
      console.error('Error submitting RFQ:', error);
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to submit RFQ' });
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
                  onClick={resetForm}
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
          <h1 className="text-3xl font-bold mb-2">Request for Quotation (RFQ)</h1>
          <p className="text-sm text-muted-foreground mb-4">Create new RFQ or manage your existing ones. Browse public RFQs at <a href="/rfqs" className="text-blue-600 hover:underline">/rfqs</a>.</p>

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
            NewRFQForm()
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
                RFQ Type <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="rfqType"
                    value="product"
                    checked={formData.rfqType === 'product'}
                    onChange={() => updateField('rfqType', 'product')}
                  />
                  Product Order
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="rfqType"
                    value="service"
                    checked={formData.rfqType === 'service'}
                    onChange={() => updateField('rfqType', 'service')}
                  />
                  Service Order
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                RFQ Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, title: e.target.value }));
                  if (errors.title) {
                    setErrors(prev => {
                      const { title: _, ...rest } = prev;
                      return rest;
                    });
                  }
                }}
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
                  onChange={(e) => updateField('category', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background ${
                    errors.category ? 'border-red-500' : ''
                  }`}
                  disabled={loading || categories.length === 0}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id || cat} value={cat.id || cat}>
                      {cat.name || cat}
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

              {subcategories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Subcategory <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) => updateField('subcategory', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background ${
                      errors.subcategory ? 'border-red-500' : ''
                    }`}
                    disabled={loading}
                  >
                    <option value="">Select Subcategory</option>
                    {subcategories.map((sub) => (
                      <option key={sub.id || sub} value={sub.id || sub}>
                        {sub.name || sub}
                      </option>
                    ))}
                  </select>
                  {errors.subcategory && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                      <AlertCircle className="h-3 w-3" />
                      {errors.subcategory}
                    </div>
                  )}
                </div>
              )}

              {formData.rfqType === 'product' && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => updateField('location', e.target.value)}
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
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
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
      {formData.rfqType === 'product' && (
      <div>
              <label className="block text-sm font-medium mb-2">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => updateField('quantity', e.target.value)}
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
      )}

      {formData.rfqType === 'product' && (
      <div>
              <label className="block text-sm font-medium mb-2">
                Unit <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.unit}
                onChange={(e) => updateField('unit', e.target.value)}
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
      )}

            <div>
              <label className="block text-sm font-medium mb-2">
                Budget Range <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.budget}
                onChange={(e) => updateField('budget', e.target.value)}
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
              onChange={(e) => updateField('timeline', e.target.value)}
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
                onChange={(e) => updateField('contactInfo.name', e.target.value)}
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
                onChange={(e) => updateField('contactInfo.email', e.target.value)}
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
                onChange={(e) => updateField('contactInfo.phone', e.target.value)}
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
                onChange={(e) => updateField('contactInfo.company', e.target.value)}
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