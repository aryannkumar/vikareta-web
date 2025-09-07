import { apiClient } from './client';

export interface OnboardingStatus {
  id: string;
  userId: string;
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  isCompleted: boolean;
  progressPercentage: number;
  startedAt: string;
  completedAt?: string;
  lastUpdatedAt: string;
  steps: OnboardingStep[];
  metadata: Record<string, any>;
}

export interface OnboardingStep {
  id: number;
  name: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isRequired: boolean;
  completedAt?: string;
  data?: Record<string, any>;
  nextSteps?: number[];
  prerequisites?: number[];
}

export interface BusinessProfileData {
  businessName?: string;
  gstin?: string;
  businessType?: string;
  industry?: string;
  companySize?: string;
  website?: string;
  description?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  contactPerson?: {
    name: string;
    designation: string;
    email: string;
    phone: string;
  };
  documents?: {
    gstCertificate?: string;
    panCard?: string;
    businessLicense?: string;
    addressProof?: string;
  };
}

export interface ProfileCompletionData {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  timezone?: string;
  language?: string;
  interests?: string[];
  skills?: string[];
  experience?: string;
}

export class OnboardingService {
  // Get current user's onboarding status
  static async getOnboardingStatus(): Promise<OnboardingStatus> {
    const response = await apiClient.get<OnboardingStatus>('/onboarding/status');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch onboarding status');
    }
    return response.data;
  }

  // Complete profile step
  static async completeProfileStep(data: ProfileCompletionData): Promise<{
    stepCompleted: boolean;
    nextStep?: number;
    progressPercentage: number;
    message: string;
  }> {
    const response = await apiClient.post<{
      stepCompleted: boolean;
      nextStep?: number;
      progressPercentage: number;
      message: string;
    }>('/onboarding/complete-profile', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to complete profile step');
    }
    return response.data;
  }

  // Update business profile section
  static async updateBusinessProfileSection(section: string, data: Partial<BusinessProfileData>): Promise<{
    sectionUpdated: boolean;
    stepCompleted?: boolean;
    nextStep?: number;
    progressPercentage: number;
    message: string;
  }> {
    const response = await apiClient.put<{
      sectionUpdated: boolean;
      stepCompleted?: boolean;
      nextStep?: number;
      progressPercentage: number;
      message: string;
    }>(`/onboarding/business/${section}`, data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update business profile section');
    }
    return response.data;
  }

  // Complete specific onboarding step
  static async completeStep(stepId: number, data?: Record<string, any>): Promise<{
    stepCompleted: boolean;
    nextStep?: number;
    progressPercentage: number;
    message: string;
  }> {
    const response = await apiClient.post<{
      stepCompleted: boolean;
      nextStep?: number;
      progressPercentage: number;
      message: string;
    }>(`/onboarding/step/${stepId}/complete`, data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to complete onboarding step');
    }
    return response.data;
  }

  // Skip optional onboarding step
  static async skipStep(stepId: number): Promise<{
    stepSkipped: boolean;
    nextStep?: number;
    progressPercentage: number;
    message: string;
  }> {
    const response = await apiClient.post<{
      stepSkipped: boolean;
      nextStep?: number;
      progressPercentage: number;
      message: string;
    }>(`/onboarding/step/${stepId}/skip`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to skip onboarding step');
    }
    return response.data;
  }

  // Get available onboarding steps
  static async getAvailableSteps(): Promise<OnboardingStep[]> {
    const response = await apiClient.get<OnboardingStep[]>('/onboarding/steps');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch available onboarding steps');
    }
    return response.data;
  }

  // Get step details
  static async getStepDetails(stepId: number): Promise<OnboardingStep & {
    content?: {
      title: string;
      description: string;
      instructions: string[];
      tips: string[];
      estimatedTime: number; // in minutes
    };
    requirements?: {
      documents?: string[];
      information?: string[];
      verifications?: string[];
    };
    resources?: {
      videos?: Array<{ title: string; url: string }>;
      articles?: Array<{ title: string; url: string }>;
      templates?: Array<{ name: string; url: string }>;
    };
  }> {
    const response = await apiClient.get<OnboardingStep & {
      content?: {
        title: string;
        description: string;
        instructions: string[];
        tips: string[];
        estimatedTime: number;
      };
      requirements?: {
        documents?: string[];
        information?: string[];
        verifications?: string[];
      };
      resources?: {
        videos?: Array<{ title: string; url: string }>;
        articles?: Array<{ title: string; url: string }>;
        templates?: Array<{ name: string; url: string }>;
      };
    }>(`/onboarding/step/${stepId}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch step details');
    }
    return response.data;
  }

  // Restart onboarding process
  static async restartOnboarding(): Promise<{
    restarted: boolean;
    message: string;
    newStatus: OnboardingStatus;
  }> {
    const response = await apiClient.post<{
      restarted: boolean;
      message: string;
      newStatus: OnboardingStatus;
    }>('/onboarding/restart');
    if (!response.success) {
      throw new Error(response.error || 'Failed to restart onboarding');
    }
    return response.data;
  }

  // Get onboarding progress analytics
  static async getOnboardingAnalytics(): Promise<{
    totalUsers: number;
    completedUsers: number;
    inProgressUsers: number;
    completionRate: number;
    averageCompletionTime: number; // in days
    stepCompletionRates: Record<number, number>;
    dropOffPoints: Array<{
      stepId: number;
      stepName: string;
      dropOffRate: number;
      usersDropped: number;
    }>;
    timeSpentPerStep: Record<number, number>; // in minutes
    mostCommonIssues: Array<{
      stepId: number;
      issue: string;
      frequency: number;
    }>;
  }> {
    const response = await apiClient.get<{
      totalUsers: number;
      completedUsers: number;
      inProgressUsers: number;
      completionRate: number;
      averageCompletionTime: number;
      stepCompletionRates: Record<number, number>;
      dropOffPoints: Array<{
        stepId: number;
        stepName: string;
        dropOffRate: number;
        usersDropped: number;
      }>;
      timeSpentPerStep: Record<number, number>;
      mostCommonIssues: Array<{
        stepId: number;
        issue: string;
        frequency: number;
      }>;
    }>('/onboarding/analytics');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch onboarding analytics');
    }
    return response.data;
  }

  // Upload document for onboarding
  static async uploadDocument(stepId: number, documentType: string, file: File): Promise<{
    uploaded: boolean;
    documentId: string;
    url: string;
    message: string;
  }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);

    const response = await apiClient.upload<{
      uploaded: boolean;
      documentId: string;
      url: string;
      message: string;
    }>(`/onboarding/step/${stepId}/upload`, formData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to upload document');
    }
    return response.data;
  }

  // Verify document
  static async verifyDocument(documentId: string): Promise<{
    verified: boolean;
    status: 'pending' | 'approved' | 'rejected';
    message: string;
    rejectionReason?: string;
  }> {
    const response = await apiClient.post<{
      verified: boolean;
      status: 'pending' | 'approved' | 'rejected';
      message: string;
      rejectionReason?: string;
    }>(`/onboarding/documents/${documentId}/verify`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to verify document');
    }
    return response.data;
  }

  // Get document verification status
  static async getDocumentStatus(documentId: string): Promise<{
    documentId: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: string;
    reviewedAt?: string;
    reviewedBy?: string;
    rejectionReason?: string;
    downloadUrl?: string;
  }> {
    const response = await apiClient.get<{
      documentId: string;
      status: 'pending' | 'approved' | 'rejected';
      submittedAt: string;
      reviewedAt?: string;
      reviewedBy?: string;
      rejectionReason?: string;
      downloadUrl?: string;
    }>(`/onboarding/documents/${documentId}/status`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch document status');
    }
    return response.data;
  }

  // Get onboarding checklist
  static async getOnboardingChecklist(): Promise<{
    categories: Array<{
      id: string;
      name: string;
      description: string;
      steps: Array<{
        id: number;
        name: string;
        completed: boolean;
        required: boolean;
        estimatedTime: number;
        priority: 'high' | 'medium' | 'low';
      }>;
      completedSteps: number;
      totalSteps: number;
      progressPercentage: number;
    }>;
    overallProgress: number;
    estimatedTimeRemaining: number;
    nextRecommendedStep?: number;
  }> {
    const response = await apiClient.get<{
      categories: Array<{
        id: string;
        name: string;
        description: string;
        steps: Array<{
          id: number;
          name: string;
          completed: boolean;
          required: boolean;
          estimatedTime: number;
          priority: 'high' | 'medium' | 'low';
        }>;
        completedSteps: number;
        totalSteps: number;
        progressPercentage: number;
      }>;
      overallProgress: number;
      estimatedTimeRemaining: number;
      nextRecommendedStep?: number;
    }>('/onboarding/checklist');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch onboarding checklist');
    }
    return response.data;
  }

  // Get personalized onboarding recommendations
  static async getPersonalizedRecommendations(): Promise<{
    recommendations: Array<{
      id: string;
      type: 'step' | 'resource' | 'tip' | 'contact';
      title: string;
      description: string;
      priority: 'high' | 'medium' | 'low';
      actionUrl?: string;
      estimatedBenefit: string;
    }>;
    userProfile: {
      userType: string;
      businessType?: string;
      industry?: string;
      experience: 'beginner' | 'intermediate' | 'advanced';
      goals: string[];
    };
  }> {
    const response = await apiClient.get<{
      recommendations: Array<{
        id: string;
        type: 'step' | 'resource' | 'tip' | 'contact';
        title: string;
        description: string;
        priority: 'high' | 'medium' | 'low';
        actionUrl?: string;
        estimatedBenefit: string;
      }>;
      userProfile: {
        userType: string;
        businessType?: string;
        industry?: string;
        experience: 'beginner' | 'intermediate' | 'advanced';
        goals: string[];
      };
    }>('/onboarding/recommendations');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch personalized recommendations');
    }
    return response.data;
  }

  // Complete entire onboarding process
  static async completeOnboarding(): Promise<{
    completed: boolean;
    completionDate: string;
    message: string;
    nextSteps: Array<{
      title: string;
      description: string;
      actionUrl: string;
      priority: 'high' | 'medium' | 'low';
    }>;
    rewards?: {
      welcomeBonus?: number;
      freeTrialDays?: number;
      discountPercentage?: number;
    };
  }> {
    const response = await apiClient.post<{
      completed: boolean;
      completionDate: string;
      message: string;
      nextSteps: Array<{
        title: string;
        description: string;
        actionUrl: string;
        priority: 'high' | 'medium' | 'low';
      }>;
      rewards?: {
        welcomeBonus?: number;
        freeTrialDays?: number;
        discountPercentage?: number;
      };
    }>('/onboarding/complete');
    if (!response.success) {
      throw new Error(response.error || 'Failed to complete onboarding');
    }
    return response.data;
  }

  // Get onboarding support contacts
  static async getSupportContacts(): Promise<{
    contacts: Array<{
      id: string;
      name: string;
      role: string;
      email: string;
      phone?: string;
      availability: string;
      specialization: string[];
      languages: string[];
    }>;
    chatSupport: {
      available: boolean;
      estimatedWaitTime: number;
      supportedLanguages: string[];
    };
    faq: Array<{
      question: string;
      answer: string;
      category: string;
    }>;
  }> {
    const response = await apiClient.get<{
      contacts: Array<{
        id: string;
        name: string;
        role: string;
        email: string;
        phone?: string;
        availability: string;
        specialization: string[];
        languages: string[];
      }>;
      chatSupport: {
        available: boolean;
        estimatedWaitTime: number;
        supportedLanguages: string[];
      };
      faq: Array<{
        question: string;
        answer: string;
        category: string;
      }>;
    }>('/onboarding/support');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch support contacts');
    }
    return response.data;
  }

  // Submit feedback for onboarding process
  static async submitFeedback(rating: number, feedback: string, stepId?: number): Promise<{
    submitted: boolean;
    message: string;
  }> {
    const response = await apiClient.post<{
      submitted: boolean;
      message: string;
    }>('/onboarding/feedback', { rating, feedback, stepId });
    if (!response.success) {
      throw new Error(response.error || 'Failed to submit feedback');
    }
    return response.data;
  }
}