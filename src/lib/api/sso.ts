import { apiClient } from './client';

export interface SSOToken {
  token: string;
  redirectUrl: string;
  expiresAt: string;
}

export interface SSOExchangeData {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    businessName?: string;
    userType: string;
    role?: string;
    isVerified: boolean;
    avatar?: string;
  };
  audience: string;
}

export interface SSOInitData {
  targetApp: 'web' | 'dashboard' | 'admin';
  returnUrl?: string;
}

export interface SSOExchangeRequest {
  token: string;
}

export class SSOService {
  // Initialize SSO for cross-app navigation
  static async initSSO(data: SSOInitData): Promise<SSOToken> {
    const response = await apiClient.post<SSOToken>('/sso/init', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to initialize SSO');
    }
    return response.data;
  }

  // Exchange SSO token for authentication
  static async exchangeSSOToken(data: SSOExchangeRequest): Promise<SSOExchangeData> {
    const response = await apiClient.post<SSOExchangeData>('/sso/exchange', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to exchange SSO token');
    }
    return response.data;
  }

  // Navigate to dashboard with SSO
  static async navigateToDashboard(returnUrl?: string): Promise<void> {
    try {
      const ssoData = await this.initSSO({ targetApp: 'dashboard', returnUrl });
      window.location.href = ssoData.redirectUrl;
    } catch (error) {
      throw new Error('Failed to navigate to dashboard');
    }
  }

  // Navigate to admin panel with SSO
  static async navigateToAdmin(returnUrl?: string): Promise<void> {
    try {
      const ssoData = await this.initSSO({ targetApp: 'admin', returnUrl });
      window.location.href = ssoData.redirectUrl;
    } catch (error) {
      throw new Error('Failed to navigate to admin panel');
    }
  }

  // Navigate to web app with SSO
  static async navigateToWeb(returnUrl?: string): Promise<void> {
    try {
      const ssoData = await this.initSSO({ targetApp: 'web', returnUrl });
      window.location.href = ssoData.redirectUrl;
    } catch (error) {
      throw new Error('Failed to navigate to web app');
    }
  }

  // Handle SSO callback (called from the target app)
  static async handleSSOCallback(token: string): Promise<SSOExchangeData> {
    try {
      const exchangeData = await this.exchangeSSOToken({ token });

      // Store tokens in localStorage for the target app
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', exchangeData.accessToken);
        localStorage.setItem('refresh_token', exchangeData.refreshToken);
        localStorage.setItem('user', JSON.stringify(exchangeData.user));
      }

      return exchangeData;
    } catch (error) {
      throw new Error('Failed to handle SSO callback');
    }
  }

  // Check if user can access dashboard (has active subscription and is business user)
  static async checkDashboardAccess(): Promise<{
    canAccess: boolean;
    reason?: string;
    subscriptionStatus?: string;
    userType?: string;
  }> {
    const response = await apiClient.get<{
      canAccess: boolean;
      reason?: string;
      subscriptionStatus?: string;
      userType?: string;
    }>('/sso/check-dashboard-access');
    if (!response.success) {
      throw new Error(response.error || 'Failed to check dashboard access');
    }
    return response.data;
  }

  // Check if user can access admin panel
  static async checkAdminAccess(): Promise<{
    canAccess: boolean;
    reason?: string;
    userRole?: string;
  }> {
    const response = await apiClient.get<{
      canAccess: boolean;
      reason?: string;
      userRole?: string;
    }>('/sso/check-admin-access');
    if (!response.success) {
      throw new Error(response.error || 'Failed to check admin access');
    }
    return response.data;
  }

  // Get SSO configuration
  static async getSSOConfig(): Promise<{
    enabled: boolean;
    allowedApps: string[];
    tokenTTL: number;
    dashboardUrl: string;
    adminUrl: string;
    webUrl: string;
  }> {
    const response = await apiClient.get<{
      enabled: boolean;
      allowedApps: string[];
      tokenTTL: number;
      dashboardUrl: string;
      adminUrl: string;
      webUrl: string;
    }>('/sso/config');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch SSO configuration');
    }
    return response.data;
  }

  // Validate SSO token (without exchanging it)
  static async validateSSOToken(token: string): Promise<{
    valid: boolean;
    userId?: string;
    targetApp?: string;
    expiresAt?: string;
  }> {
    const response = await apiClient.post<{
      valid: boolean;
      userId?: string;
      targetApp?: string;
      expiresAt?: string;
    }>('/sso/validate', { token });
    if (!response.success) {
      throw new Error(response.error || 'Failed to validate SSO token');
    }
    return response.data;
  }

  // Get SSO session info
  static async getSSOSessionInfo(): Promise<{
    currentApp: string;
    userId: string;
    lastActivity: string;
    sessionId: string;
    crossAppAccess: {
      web: boolean;
      dashboard: boolean;
      admin: boolean;
    };
  }> {
    const response = await apiClient.get<{
      currentApp: string;
      userId: string;
      lastActivity: string;
      sessionId: string;
      crossAppAccess: {
        web: boolean;
        dashboard: boolean;
        admin: boolean;
      };
    }>('/sso/session');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch SSO session info');
    }
    return response.data;
  }

  // Logout from all apps (SSO logout)
  static async logoutAllApps(): Promise<{
    success: boolean;
    message: string;
    loggedOutApps: string[];
  }> {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      loggedOutApps: string[];
    }>('/sso/logout-all');
    if (!response.success) {
      throw new Error(response.error || 'Failed to logout from all apps');
    }
    return response.data;
  }

  // Get SSO statistics
  static async getSSOStats(): Promise<{
    totalTokens: number;
    activeTokens: number;
    expiredTokens: number;
    tokensByApp: Record<string, number>;
    averageTokenLifetime: number;
    successRate: number;
    failedExchanges: number;
  }> {
    const response = await apiClient.get<{
      totalTokens: number;
      activeTokens: number;
      expiredTokens: number;
      tokensByApp: Record<string, number>;
      averageTokenLifetime: number;
      successRate: number;
      failedExchanges: number;
    }>('/sso/stats');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch SSO stats');
    }
    return response.data;
  }
}