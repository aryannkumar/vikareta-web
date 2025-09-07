import { apiClient } from './client';

export interface DigiLockerDocument {
  id: string;
  userId: string;
  docId: string;
  docType: string;
  docName: string;
  issuer: string;
  issueDate?: string;
  expiryDate?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected' | 'expired';
  documentData?: any; // JSON object with document details
  createdAt: string;
  updatedAt: string;
}

export interface CreateDigiLockerDocumentData {
  docId: string;
  docType: string;
  docName: string;
  issuer: string;
  issueDate?: string;
  expiryDate?: string;
  documentData?: any;
}

export interface UpdateDigiLockerDocumentData {
  docName?: string;
  verificationStatus?: 'pending' | 'verified' | 'rejected' | 'expired';
  issueDate?: string;
  expiryDate?: string;
  documentData?: any;
}

export interface DigiLockerDocumentFilters {
  docType?: string;
  verificationStatus?: string;
  issuer?: string;
  expiryBefore?: string;
  expiryAfter?: string;
}

export class DigiLockerDocumentService {
  // Get all DigiLocker documents for current user
  static async getDigiLockerDocuments(filters?: DigiLockerDocumentFilters): Promise<DigiLockerDocument[]> {
    const response = await apiClient.get<DigiLockerDocument[]>('/digilocker/documents', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch DigiLocker documents');
    }
    return response.data;
  }

  // Get DigiLocker document by ID
  static async getDigiLockerDocumentById(id: string): Promise<DigiLockerDocument> {
    const response = await apiClient.get<DigiLockerDocument>(`/digilocker/documents/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch DigiLocker document');
    }
    return response.data;
  }

  // Create new DigiLocker document
  static async createDigiLockerDocument(data: CreateDigiLockerDocumentData): Promise<DigiLockerDocument> {
    const response = await apiClient.post<DigiLockerDocument>('/digilocker/documents', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to create DigiLocker document');
    }
    return response.data;
  }

  // Update DigiLocker document
  static async updateDigiLockerDocument(id: string, data: UpdateDigiLockerDocumentData): Promise<DigiLockerDocument> {
    const response = await apiClient.put<DigiLockerDocument>(`/digilocker/documents/${id}`, data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update DigiLocker document');
    }
    return response.data;
  }

  // Delete DigiLocker document
  static async deleteDigiLockerDocument(id: string): Promise<void> {
    const response = await apiClient.delete(`/digilocker/documents/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete DigiLocker document');
    }
  }

  // Verify DigiLocker document
  static async verifyDigiLockerDocument(id: string): Promise<DigiLockerDocument> {
    const response = await apiClient.post<DigiLockerDocument>(`/digilocker/documents/${id}/verify`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to verify DigiLocker document');
    }
    return response.data;
  }

  // Get DigiLocker document types
  static async getDigiLockerDocumentTypes(): Promise<Array<{
    type: string;
    name: string;
    description: string;
    requiredFields: string[];
    validityPeriod?: number; // in days
  }>> {
    const response = await apiClient.get<Array<{
      type: string;
      name: string;
      description: string;
      requiredFields: string[];
      validityPeriod?: number;
    }>>('/digilocker/document-types');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch DigiLocker document types');
    }
    return response.data;
  }

  // Get DigiLocker issuers
  static async getDigiLockerIssuers(): Promise<Array<{
    code: string;
    name: string;
    type: string;
    website?: string;
    contactInfo?: any;
  }>> {
    const response = await apiClient.get<Array<{
      code: string;
      name: string;
      type: string;
      website?: string;
      contactInfo?: any;
    }>>('/digilocker/issuers');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch DigiLocker issuers');
    }
    return response.data;
  }

  // Sync documents from DigiLocker
  static async syncDigiLockerDocuments(): Promise<{
    synced: number;
    failed: number;
    newDocuments: DigiLockerDocument[];
    errors: string[];
  }> {
    const response = await apiClient.post<{
      synced: number;
      failed: number;
      newDocuments: DigiLockerDocument[];
      errors: string[];
    }>('/digilocker/sync');
    if (!response.success) {
      throw new Error(response.error || 'Failed to sync DigiLocker documents');
    }
    return response.data;
  }

  // Get DigiLocker document statistics
  static async getDigiLockerDocumentStats(): Promise<{
    totalDocuments: number;
    verifiedDocuments: number;
    pendingDocuments: number;
    expiredDocuments: number;
    documentsByType: Record<string, number>;
    documentsByIssuer: Record<string, number>;
    expiringSoon: number; // documents expiring in next 30 days
  }> {
    const response = await apiClient.get<{
      totalDocuments: number;
      verifiedDocuments: number;
      pendingDocuments: number;
      expiredDocuments: number;
      documentsByType: Record<string, number>;
      documentsByIssuer: Record<string, number>;
      expiringSoon: number;
    }>('/digilocker/stats');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch DigiLocker document stats');
    }
    return response.data;
  }

  // Get expiring documents
  static async getExpiringDigiLockerDocuments(days: number = 30): Promise<DigiLockerDocument[]> {
    const response = await apiClient.get<DigiLockerDocument[]>(`/digilocker/expiring?days=${days}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch expiring DigiLocker documents');
    }
    return response.data;
  }

  // Download DigiLocker document
  static async downloadDigiLockerDocument(id: string): Promise<{
    downloadUrl: string;
    filename: string;
    expiresAt: string;
  }> {
    const response = await apiClient.get<{
      downloadUrl: string;
      filename: string;
      expiresAt: string;
    }>(`/digilocker/documents/${id}/download`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get DigiLocker document download URL');
    }
    return response.data;
  }

  // Share DigiLocker document
  static async shareDigiLockerDocument(id: string, data: {
    recipientEmail: string;
    message?: string;
    expiresIn?: number; // hours
  }): Promise<{
    shareId: string;
    shareUrl: string;
    expiresAt: string;
  }> {
    const response = await apiClient.post<{
      shareId: string;
      shareUrl: string;
      expiresAt: string;
    }>(`/digilocker/documents/${id}/share`, data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to share DigiLocker document');
    }
    return response.data;
  }
}