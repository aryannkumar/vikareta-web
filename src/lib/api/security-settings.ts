import { apiClient } from './client';

export interface SecuritySettings {
  id: string;
  userId: string;
  twoFactorEnabled: boolean;
  twoFactorMethod: 'app' | 'sms' | 'email' | null;
  loginNotifications: boolean;
  suspiciousActivityAlerts: boolean;
  passwordChangeNotifications: boolean;
  sessionTimeout: number; // in minutes
  maxLoginAttempts: number;
  lockoutDuration: number; // in minutes
  allowedIPs: string[];
  blockedIPs: string[];
  trustedDevices: Array<{
    id: string;
    name: string;
    deviceType: string;
    browser: string;
    os: string;
    lastUsed: string;
    isCurrentDevice: boolean;
  }>;
  securityQuestions: Array<{
    question: string;
    answer: string;
  }>;
  biometricEnabled: boolean;
  autoLogoutEnabled: boolean;
  passwordExpiryDays: number;
  requireStrongPassword: boolean;
  loginHistoryRetentionDays: number;
  ipWhitelistEnabled: boolean;
  geoBlockingEnabled: boolean;
  allowedCountries: string[];
  blockedCountries: string[];
  deviceTrackingEnabled: boolean;
  sessionConcurrencyLimit: number;
  passwordHistoryCount: number;
  accountLockoutEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSecuritySettingsData {
  twoFactorEnabled?: boolean;
  twoFactorMethod?: 'app' | 'sms' | 'email' | null;
  loginNotifications?: boolean;
  suspiciousActivityAlerts?: boolean;
  passwordChangeNotifications?: boolean;
  sessionTimeout?: number;
  maxLoginAttempts?: number;
  lockoutDuration?: number;
  allowedIPs?: string[];
  blockedIPs?: string[];
  biometricEnabled?: boolean;
  autoLogoutEnabled?: boolean;
  passwordExpiryDays?: number;
  requireStrongPassword?: boolean;
  loginHistoryRetentionDays?: number;
  ipWhitelistEnabled?: boolean;
  geoBlockingEnabled?: boolean;
  allowedCountries?: string[];
  blockedCountries?: string[];
  deviceTrackingEnabled?: boolean;
  sessionConcurrencyLimit?: number;
  passwordHistoryCount?: number;
  accountLockoutEnabled?: boolean;
}

export interface SecurityQuestion {
  id: string;
  question: string;
  category: 'personal' | 'general' | 'security';
}

export interface TrustedDevice {
  id: string;
  name: string;
  deviceType: string;
  browser: string;
  os: string;
  ipAddress: string;
  location?: string;
  lastUsed: string;
  isCurrentDevice: boolean;
  trustLevel: 'high' | 'medium' | 'low';
}

export interface LoginHistoryEntry {
  id: string;
  timestamp: string;
  ipAddress: string;
  location?: string;
  device: string;
  browser: string;
  os: string;
  success: boolean;
  failureReason?: string;
  suspiciousActivity: boolean;
}

export interface SecurityAlert {
  id: string;
  type: 'suspicious_login' | 'password_change' | 'device_change' | 'ip_change' | 'failed_attempts' | 'account_lockout';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  details: Record<string, any>;
  timestamp: string;
  resolved: boolean;
  resolvedAt?: string;
  actions: Array<{
    action: string;
    timestamp: string;
    adminId?: string;
  }>;
}

export class SecuritySettingsService {
  // Get current user's security settings
  static async getSecuritySettings(): Promise<SecuritySettings> {
    const response = await apiClient.get<SecuritySettings>('/security-settings');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch security settings');
    }
    return response.data;
  }

  // Update security settings
  static async updateSecuritySettings(data: UpdateSecuritySettingsData): Promise<SecuritySettings> {
    const response = await apiClient.put<SecuritySettings>('/security-settings', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update security settings');
    }
    return response.data;
  }

  // Enable/disable 2FA
  static async toggleTwoFactor(enabled: boolean, method?: 'app' | 'sms' | 'email'): Promise<{
    success: boolean;
    qrCode?: string;
    secret?: string;
    backupCodes?: string[];
    message: string;
  }> {
    const response = await apiClient.post<{
      success: boolean;
      qrCode?: string;
      secret?: string;
      backupCodes?: string[];
      message: string;
    }>('/security-settings/2fa/toggle', { enabled, method });
    if (!response.success) {
      throw new Error(response.error || 'Failed to toggle 2FA');
    }
    return response.data;
  }

  // Verify 2FA setup
  static async verifyTwoFactorSetup(code: string): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
    }>('/security-settings/2fa/verify', { code });
    if (!response.success) {
      throw new Error(response.error || 'Failed to verify 2FA setup');
    }
    return response.data;
  }

  // Regenerate 2FA backup codes
  static async regenerateBackupCodes(): Promise<{
    backupCodes: string[];
    message: string;
  }> {
    const response = await apiClient.post<{
      backupCodes: string[];
      message: string;
    }>('/security-settings/2fa/backup-codes');
    if (!response.success) {
      throw new Error(response.error || 'Failed to regenerate backup codes');
    }
    return response.data;
  }

  // Get available security questions
  static async getSecurityQuestions(): Promise<SecurityQuestion[]> {
    const response = await apiClient.get<SecurityQuestion[]>('/security-settings/questions');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch security questions');
    }
    return response.data;
  }

  // Set security questions
  static async setSecurityQuestions(questions: Array<{
    questionId: string;
    answer: string;
  }>): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
    }>('/security-settings/questions', { questions });
    if (!response.success) {
      throw new Error(response.error || 'Failed to set security questions');
    }
    return response.data;
  }

  // Get trusted devices
  static async getTrustedDevices(): Promise<TrustedDevice[]> {
    const response = await apiClient.get<TrustedDevice[]>('/security-settings/trusted-devices');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch trusted devices');
    }
    return response.data;
  }

  // Add trusted device
  static async addTrustedDevice(deviceId: string, name?: string): Promise<TrustedDevice> {
    const response = await apiClient.post<TrustedDevice>('/security-settings/trusted-devices', { deviceId, name });
    if (!response.success) {
      throw new Error(response.error || 'Failed to add trusted device');
    }
    return response.data;
  }

  // Remove trusted device
  static async removeTrustedDevice(deviceId: string): Promise<void> {
    const response = await apiClient.delete(`/security-settings/trusted-devices/${deviceId}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to remove trusted device');
    }
  }

  // Get login history
  static async getLoginHistory(filters?: {
    dateFrom?: string;
    dateTo?: string;
    success?: boolean;
    suspicious?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{
    history: LoginHistoryEntry[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      history: LoginHistoryEntry[];
      total: number;
      page: number;
      totalPages: number;
    }>('/security-settings/login-history', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch login history');
    }
    return response.data;
  }

  // Get security alerts
  static async getSecurityAlerts(filters?: {
    type?: string;
    severity?: string;
    resolved?: boolean;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    alerts: SecurityAlert[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      alerts: SecurityAlert[];
      total: number;
      page: number;
      totalPages: number;
    }>('/security-settings/alerts', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch security alerts');
    }
    return response.data;
  }

  // Resolve security alert
  static async resolveSecurityAlert(alertId: string, action?: string): Promise<SecurityAlert> {
    const response = await apiClient.post<SecurityAlert>(`/security-settings/alerts/${alertId}/resolve`, { action });
    if (!response.success) {
      throw new Error(response.error || 'Failed to resolve security alert');
    }
    return response.data;
  }

  // Change password with security validation
  static async changePassword(currentPassword: string, newPassword: string, confirmPassword: string): Promise<{
    success: boolean;
    message: string;
    requiresReLogin?: boolean;
  }> {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      requiresReLogin?: boolean;
    }>('/security-settings/change-password', {
      currentPassword,
      newPassword,
      confirmPassword
    });
    if (!response.success) {
      throw new Error(response.error || 'Failed to change password');
    }
    return response.data;
  }

  // Check password strength
  static async checkPasswordStrength(password: string): Promise<{
    score: number; // 0-4
    feedback: string[];
    isStrong: boolean;
    suggestions: string[];
  }> {
    const response = await apiClient.post<{
      score: number;
      feedback: string[];
      isStrong: boolean;
      suggestions: string[];
    }>('/security-settings/check-password', { password });
    if (!response.success) {
      throw new Error(response.error || 'Failed to check password strength');
    }
    return response.data;
  }

  // Get password policy
  static async getPasswordPolicy(): Promise<{
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    preventCommonPasswords: boolean;
    maxConsecutiveChars: number;
    expiryDays: number;
    historyCount: number;
  }> {
    const response = await apiClient.get<{
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
      preventCommonPasswords: boolean;
      maxConsecutiveChars: number;
      expiryDays: number;
      historyCount: number;
    }>('/security-settings/password-policy');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch password policy');
    }
    return response.data;
  }

  // Reset security settings to defaults
  static async resetSecuritySettings(): Promise<{
    success: boolean;
    message: string;
    resetSettings: SecuritySettings;
  }> {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      resetSettings: SecuritySettings;
    }>('/security-settings/reset');
    if (!response.success) {
      throw new Error(response.error || 'Failed to reset security settings');
    }
    return response.data;
  }

  // Export security data
  static async exportSecurityData(format: 'json' | 'pdf' = 'json'): Promise<{
    downloadUrl: string;
    filename: string;
    expiresAt: string;
  }> {
    const response = await apiClient.get<{
      downloadUrl: string;
      filename: string;
      expiresAt: string;
    }>('/security-settings/export', { format });
    if (!response.success) {
      throw new Error(response.error || 'Failed to export security data');
    }
    return response.data;
  }

  // Get security recommendations
  static async getSecurityRecommendations(): Promise<Array<{
    id: string;
    type: 'warning' | 'suggestion' | 'critical';
    title: string;
    description: string;
    actionRequired: boolean;
    actionUrl?: string;
    dismissible: boolean;
  }>> {
    const response = await apiClient.get<Array<{
      id: string;
      type: 'warning' | 'suggestion' | 'critical';
      title: string;
      description: string;
      actionRequired: boolean;
      actionUrl?: string;
      dismissible: boolean;
    }>>('/security-settings/recommendations');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch security recommendations');
    }
    return response.data;
  }

  // Dismiss security recommendation
  static async dismissSecurityRecommendation(recommendationId: string): Promise<void> {
    const response = await apiClient.post(`/security-settings/recommendations/${recommendationId}/dismiss`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to dismiss security recommendation');
    }
  }
}