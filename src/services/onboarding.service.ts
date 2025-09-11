import { ApiResponse, OnboardingFlow, BusinessProfile, UserDocument, BasicProfileForm, BusinessBasicForm, BusinessTaxForm, BusinessBankForm, BusinessDocumentForm, BusinessSettingsForm } from '../types';

class OnboardingService {
  private baseUrl: string;

  constructor() {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || (process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : 'https://api.vikareta.com');
    this.baseUrl = `${apiBase}/api/v1`;
  }

  // Get onboarding status
  async getStatus(): Promise<OnboardingFlow> {
    const response = await fetch(`${this.baseUrl}/onboarding/status`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result: ApiResponse<OnboardingFlow> = await response.json();

    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to get onboarding status');
    }

    return result.data!;
  }

  // Get onboarding flow information
  async getFlow(): Promise<OnboardingFlow> {
    const response = await fetch(`${this.baseUrl}/onboarding/flow`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result: ApiResponse<OnboardingFlow> = await response.json();

    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to get onboarding flow');
    }

    return result.data!;
  }

  // Complete basic profile
  async completeProfile(data: BasicProfileForm): Promise<OnboardingFlow> {
    const response = await fetch(`${this.baseUrl}/onboarding/profile`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result: ApiResponse<OnboardingFlow> = await response.json();

    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to update profile');
    }

    return result.data!;
  }

  // Update business section
  async updateBusinessSection(section: string, data: any): Promise<OnboardingFlow> {
    const response = await fetch(`${this.baseUrl}/onboarding/business/${section}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });

    const result: ApiResponse<OnboardingFlow> = await response.json();

    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to update business section');
    }

    return result.data!;
  }

  // Upload business document
  async uploadDocument(data: BusinessDocumentForm): Promise<UserDocument> {
    const response = await fetch(`${this.baseUrl}/onboarding/documents`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result: ApiResponse<UserDocument> = await response.json();

    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to upload document');
    }

    return result.data!;
  }

  // Get business documents
  async getDocuments(): Promise<UserDocument[]> {
    const response = await fetch(`${this.baseUrl}/onboarding/documents`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result: ApiResponse<UserDocument[]> = await response.json();

    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to get documents');
    }

    return result.data!;
  }

  // Update document verification status
  async updateDocumentVerification(documentId: string, status: string): Promise<OnboardingFlow> {
    const response = await fetch(`${this.baseUrl}/onboarding/documents/${documentId}/verification`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    const result: ApiResponse<OnboardingFlow> = await response.json();

    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to update document verification');
    }

    return result.data!;
  }

  // Helper methods for specific business sections
  async updateBusinessBasic(data: BusinessBasicForm): Promise<OnboardingFlow> {
    return this.updateBusinessSection('basic', data);
  }

  async updateBusinessTax(data: BusinessTaxForm): Promise<OnboardingFlow> {
    return this.updateBusinessSection('tax', data);
  }

  async updateBusinessBank(data: BusinessBankForm): Promise<OnboardingFlow> {
    return this.updateBusinessSection('bank', data);
  }

  async updateBusinessSettings(data: BusinessSettingsForm): Promise<OnboardingFlow> {
    return this.updateBusinessSection('settings', data);
  }

  // File upload helper
  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    const result: ApiResponse<{ url: string }> = await response.json();

    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to upload file');
    }

    return result.data!.url;
  }
}

export const onboardingService = new OnboardingService();