import { apiClient } from './client';

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  twoFactorMethod: 'app' | 'sms' | 'email';
  passwordLastChanged: string;
  loginAlerts: boolean;
  suspiciousActivityAlerts: boolean;
  sessionTimeout: number; // in minutes
  allowedIPs: string[];
  blockedIPs: string[];
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    preventReuse: number; // number of previous passwords to prevent reuse
  };
  loginHistory: LoginAttempt[];
}

export interface LoginAttempt {
  id: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
  deviceType: string;
  success: boolean;
  failureReason?: string;
}

export interface SecurityLog {
  id: string;
  timestamp: string;
  action: string;
  resource: string;
  ipAddress: string;
  userAgent: string;
  userId?: string;
  details?: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface TwoFactorSetup {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export interface TwoFactorVerify {
  code: string;
  method?: 'app' | 'sms' | 'email';
}

export const securityApi = {
  // Password Management
  async changePassword(data: PasswordChangeData) {
    return apiClient.post('/security/change-password', data);
  },

  async resetPassword(email: string) {
    return apiClient.post('/security/reset-password', { email });
  },

  async verifyResetToken(token: string, newPassword: string) {
    return apiClient.post('/security/reset-password/verify', { token, newPassword });
  },

  async getPasswordPolicy() {
    return apiClient.get('/security/password-policy');
  },

  // Two-Factor Authentication
  async setup2FA(method: 'app' | 'sms' | 'email') {
    return apiClient.post<TwoFactorSetup>('/security/2fa/setup', { method });
  },

  async enable2FA(data: TwoFactorVerify) {
    return apiClient.post('/security/2fa/enable', data);
  },

  async disable2FA(password: string) {
    return apiClient.post('/security/2fa/disable', { password });
  },

  async verify2FA(data: TwoFactorVerify) {
    return apiClient.post('/security/2fa/verify', data);
  },

  async regenerateBackupCodes() {
    return apiClient.post<{ backupCodes: string[] }>('/security/2fa/backup-codes');
  },

  async get2FAStatus() {
    return apiClient.get<{
      enabled: boolean;
      method: string;
      backupCodesRemaining: number;
      lastUsed?: string;
    }>('/security/2fa/status');
  },

  // Security Settings
  async getSecuritySettings() {
    return apiClient.get<SecuritySettings>('/security/settings');
  },

  async updateSecuritySettings(settings: Partial<SecuritySettings>) {
    return apiClient.put<SecuritySettings>('/security/settings', settings);
  },

  // Login History
  async getLoginHistory(filters?: {
    page?: number;
    limit?: number;
    dateFrom?: string;
    dateTo?: string;
    success?: boolean;
  }) {
    return apiClient.get<{
      attempts: LoginAttempt[];
      total: number;
      page: number;
      totalPages: number;
    }>('/security/login-history', filters);
  },

  // Session Management
  async getActiveSessions() {
    return apiClient.get<Array<{
      id: string;
      deviceType: string;
      deviceName: string;
      ipAddress: string;
      location: string;
      lastActivity: string;
      current: boolean;
    }>>('/security/sessions');
  },

  async terminateSession(sessionId: string) {
    return apiClient.delete(`/security/sessions/${sessionId}`);
  },

  async terminateAllSessions(exceptCurrent?: boolean) {
    return apiClient.delete('/security/sessions');
  },

  // IP Management
  async addAllowedIP(ip: string, description?: string) {
    return apiClient.post('/security/allowed-ips', { ip, description });
  },

  async removeAllowedIP(ip: string) {
    return apiClient.delete(`/security/allowed-ips/${ip}`);
  },

  async blockIP(ip: string, reason?: string, duration?: number) {
    return apiClient.post('/security/blocked-ips', { ip, reason, duration });
  },

  async unblockIP(ip: string) {
    return apiClient.delete(`/security/blocked-ips/${ip}`);
  },

  async getBlockedIPs() {
    return apiClient.get<Array<{
      ip: string;
      blockedAt: string;
      blockedBy: string;
      reason?: string;
      expiresAt?: string;
    }>>('/security/blocked-ips');
  },

  // Security Logs
  async getSecurityLogs(filters?: {
    severity?: string;
    action?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }) {
    return apiClient.get<{
      logs: SecurityLog[];
      total: number;
      page: number;
      totalPages: number;
    }>('/security/logs', filters);
  },

  // Device Management
  async getTrustedDevices() {
    return apiClient.get<Array<{
      id: string;
      name: string;
      type: string;
      os: string;
      browser: string;
      ipAddress: string;
      location: string;
      lastUsed: string;
      trusted: boolean;
    }>>('/security/devices');
  },

  async trustDevice(deviceId: string) {
    return apiClient.post(`/security/devices/${deviceId}/trust`);
  },

  async untrustDevice(deviceId: string) {
    return apiClient.delete(`/security/devices/${deviceId}/trust`);
  },

  async renameDevice(deviceId: string, name: string) {
    return apiClient.put(`/security/devices/${deviceId}`, { name });
  },

  // Security Questions
  async setSecurityQuestions(questions: Array<{
    question: string;
    answer: string;
  }>) {
    return apiClient.post('/security/questions', { questions });
  },

  async verifySecurityQuestion(questionId: string, answer: string) {
    return apiClient.post('/security/questions/verify', { questionId, answer });
  },

  async getSecurityQuestions() {
    return apiClient.get<Array<{
      id: string;
      question: string;
      setAt: string;
    }>>('/security/questions');
  },

  // Biometric Authentication
  async setupBiometric() {
    return apiClient.post('/security/biometric/setup');
  },

  async enableBiometric() {
    return apiClient.post('/security/biometric/enable');
  },

  async disableBiometric() {
    return apiClient.delete('/security/biometric');
  },

  async verifyBiometric(credential: any) {
    return apiClient.post('/security/biometric/verify', { credential });
  },

  // Account Recovery
  async initiateAccountRecovery(email: string) {
    return apiClient.post('/security/recovery/initiate', { email });
  },

  async verifyRecoveryCode(code: string) {
    return apiClient.post('/security/recovery/verify', { code });
  },

  async completeAccountRecovery(token: string, newPassword: string) {
    return apiClient.post('/security/recovery/complete', { token, newPassword });
  },

  // Security Alerts
  async getSecurityAlerts(filters?: {
    read?: boolean;
    type?: string;
    page?: number;
    limit?: number;
  }) {
    return apiClient.get<{
      alerts: Array<{
        id: string;
        type: string;
        title: string;
        message: string;
        severity: string;
        read: boolean;
        createdAt: string;
        actionRequired: boolean;
        actionUrl?: string;
      }>;
      total: number;
      page: number;
      totalPages: number;
      unreadCount: number;
    }>('/security/alerts', filters);
  },

  async markAlertRead(alertId: string) {
    return apiClient.put(`/security/alerts/${alertId}/read`);
  },

  async markAllAlertsRead() {
    return apiClient.put('/security/alerts/mark-all-read');
  },

  async dismissAlert(alertId: string) {
    return apiClient.delete(`/security/alerts/${alertId}`);
  },

  // Security Reports
  async getSecurityReport(period?: string) {
    return apiClient.get<{
      summary: {
        totalLogins: number;
        failedLogins: number;
        suspiciousActivities: number;
        blockedIPs: number;
        activeSessions: number;
      };
      loginAttempts: Array<{
        date: string;
        successful: number;
        failed: number;
      }>;
      topLocations: Array<{
        location: string;
        count: number;
      }>;
      securityEvents: SecurityLog[];
    }>('/security/report', { period });
  },

  // API Key Management (for developers)
  async getApiKeys() {
    return apiClient.get<Array<{
      id: string;
      name: string;
      key: string;
      permissions: string[];
      createdAt: string;
      lastUsed?: string;
      expiresAt?: string;
    }>>('/security/api-keys');
  },

  async createApiKey(data: {
    name: string;
    permissions: string[];
    expiresAt?: string;
  }) {
    return apiClient.post('/security/api-keys', data);
  },

  async updateApiKey(keyId: string, data: {
    name?: string;
    permissions?: string[];
    expiresAt?: string;
  }) {
    return apiClient.put(`/security/api-keys/${keyId}`, data);
  },

  async deleteApiKey(keyId: string) {
    return apiClient.delete(`/security/api-keys/${keyId}`);
  },

  async regenerateApiKey(keyId: string) {
    return apiClient.post(`/security/api-keys/${keyId}/regenerate`);
  },

  // Advanced Security Features
  async enableAdvancedSecurity() {
    return apiClient.post('/security/advanced/enable');
  },

  async getAdvancedSecurityStatus() {
    return apiClient.get<{
      enabled: boolean;
      features: {
        anomalyDetection: boolean;
        behavioralAnalysis: boolean;
        deviceFingerprinting: boolean;
        riskScoring: boolean;
      };
      riskScore: number;
      lastAssessment: string;
    }>('/security/advanced/status');
  },

  async getRiskAssessment() {
    return apiClient.get<{
      overallRisk: 'low' | 'medium' | 'high' | 'critical';
      riskFactors: Array<{
        factor: string;
        risk: string;
        description: string;
        recommendation: string;
      }>;
      securityScore: number;
      recommendations: string[];
    }>('/security/risk-assessment');
  }
};