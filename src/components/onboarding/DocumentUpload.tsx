'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Camera,
  Link,
  Download,
  Eye
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

export interface DocumentUploadData {
  documentType: 'gst_certificate' | 'pan_card' | 'aadhar_card' | 'business_license' | 'address_proof' | 'bank_statement' | 'other';
  documentNumber?: string;
  documentUrl?: string;
  verificationStatus?: 'pending' | 'verified' | 'rejected';
  uploadedAt?: Date;
  verifiedAt?: Date;
}

interface DocumentUploadProps {
  document: Partial<DocumentUploadData>;
  onChange: (document: Partial<DocumentUploadData>) => void;
  onUpload: (file: File) => Promise<string>;
  onRemove?: () => void;
  uploading?: boolean;
  disabled?: boolean;
}

export default function DocumentUpload({
  document,
  onChange,
  onUpload,
  onRemove,
  uploading = false,
  disabled = false
}: DocumentUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const documentTypes = {
    gst_certificate: { label: 'GST Certificate', icon: FileText },
    pan_card: { label: 'PAN Card', icon: FileText },
    aadhar_card: { label: 'Aadhar Card', icon: FileText },
    business_license: { label: 'Business License', icon: FileText },
    address_proof: { label: 'Address Proof', icon: FileText },
    bank_statement: { label: 'Bank Statement', icon: FileText },
    other: { label: 'Other Document', icon: FileText },
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || uploading) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a valid image (JPEG, PNG) or PDF file.');
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('File size must be less than 5MB.');
        return;
      }

      const documentUrl = await onUpload(file);

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }

      onChange({
        ...document,
        documentUrl,
        uploadedAt: new Date(),
        verificationStatus: 'pending'
      });
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload document. Please try again.');
    }
  };

  const handleDigiLockerConnect = () => {
    // TODO: Implement DigiLocker integration
    alert('DigiLocker integration coming soon!');
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-50';
      case 'rejected':
        return 'text-red-600 bg-red-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4" />;
      case 'pending':
        return <Upload className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const selectedType = documentTypes[document.documentType || 'other'];
  const IconComponent = selectedType.icon;

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Document Type Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Document Type</label>
          <select
            value={document.documentType || ''}
            onChange={(e) => onChange({ ...document, documentType: e.target.value as any })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            disabled={disabled}
          >
            <option value="">Select document type</option>
            {Object.entries(documentTypes).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Document Number */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Document Number {document.documentType === 'gst_certificate' || document.documentType === 'pan_card' ? '(Required)' : '(Optional)'}
          </label>
          <input
            type="text"
            value={document.documentNumber || ''}
            onChange={(e) => onChange({ ...document, documentNumber: e.target.value })}
            placeholder="Enter document number"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            disabled={disabled}
          />
        </div>

        {/* Upload Area */}
        {!document.documentUrl ? (
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive
                ? 'border-amber-500 bg-amber-50'
                : 'border-gray-300 hover:border-amber-400'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileSelect}
              className="hidden"
              disabled={disabled || uploading}
            />

            <div className="space-y-4">
              <div className="flex justify-center">
                <Upload className={`w-12 h-12 ${dragActive ? 'text-amber-500' : 'text-gray-400'}`} />
              </div>

              <div>
                <p className="text-lg font-medium text-gray-900">
                  {uploading ? 'Uploading...' : 'Upload Document'}
                </p>
                <p className="text-sm text-gray-500">
                  Drag and drop your file here, or click to browse
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Supports: JPEG, PNG, PDF (Max 5MB)
                </p>
              </div>

              {uploading && (
                <div className="space-y-2">
                  <Progress value={undefined} className="w-full" />
                  <p className="text-sm text-gray-600">Processing your document...</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Document Preview */
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <IconComponent className="w-8 h-8 text-amber-500" />
                <div>
                  <p className="font-medium">{selectedType.label}</p>
                  <p className="text-sm text-gray-600">
                    {document.documentNumber || 'No document number'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {document.verificationStatus && (
                  <Badge className={getStatusColor(document.verificationStatus)}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(document.verificationStatus)}
                      <span className="capitalize">{document.verificationStatus}</span>
                    </div>
                  </Badge>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(document.documentUrl, '_blank')}
                >
                  <Eye className="w-4 h-4" />
                </Button>

                {!disabled && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onRemove}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Image Preview */}
            {previewUrl && (
              <div className="mt-4">
                <img
                  src={previewUrl}
                  alt="Document preview"
                  className="max-w-full h-auto max-h-48 rounded border"
                />
              </div>
            )}

            {/* Upload Info */}
            <div className="mt-4 text-sm text-gray-600">
              <p>Uploaded: {document.uploadedAt?.toLocaleDateString()}</p>
              {document.verifiedAt && (
                <p>Verified: {document.verifiedAt.toLocaleDateString()}</p>
              )}
            </div>
          </div>
        )}

        {/* DigiLocker Integration */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium">Import from DigiLocker</p>
                <p className="text-sm text-gray-600">
                  Quickly import verified documents from DigiLocker
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleDigiLockerConnect}
              disabled={disabled}
            >
              Connect DigiLocker
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}