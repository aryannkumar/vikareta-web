/**
 * Vikareta Platform - Unified SSO Client
 * Secure, consistent SSO implementation across all Vikareta modules  
 * Security: JWT validation, token refresh, CSRF protection
 */

import { 
  VikaretaAuthData, 
  VikaretaAuthState, 
  VikaretaUser,
  VIKARETA_AUTH_CONSTANTS,
  isVikaretaAuthData,
  isVikaretaUser 
} from './vikareta-auth-types';
import { vikaretaCrossDomainAuth } from './vikareta-cross-domain';

export class VikaretaSSOClient {
  private refreshInProgress = false;
  private refreshPromise: Promise<boolean> | null = null;
  private readonly cookieNames = VIKARETA_AUTH_CONSTANTS.COOKIE_NAMES;
  private readonly storageKeys = VIKARETA_AUTH_CONSTANTS.STORAGE_KEYS;

  /**
   * Initialize SSO client with security checks
   */
  async initialize(): Promise<VikaretaAuthState> {
    try {
      // Get stored auth state
      const storedState = vikaretaCrossDomainAuth.getStoredAuthData();

      if (storedState.isAuthenticated && storedState.user) {
        // Validate stored user data
        if (!isVikaretaUser(storedState.user)) {
          console.warn('Invalid stored user data, clearing auth state');
          vikaretaCrossDomainAuth.clearAuthData();
          return { user: null, isAuthenticated: false, isLoading: false, error: null, sessionId: null };
        }

        // Try to refresh token to validate session
        const isValid = await this.validateSession();
        if (!isValid) {
          vikaretaCrossDomainAuth.clearAuthData();
          return { user: null, isAuthenticated: false, isLoading: false, error: 'Session expired', sessionId: null };
        }

        return storedState;
      }

      // No stored auth: attempt to bootstrap from backend cookies
      try {
        const resp = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        });
        if (resp.ok) {
          const data = await resp.json();
          if (data && data.success && data.user && isVikaretaUser(data.user)) {
            // Build auth data from response and persist for unified flow
            const authData: VikaretaAuthData = {
              user: data.user,
              tokens: {
                accessToken: data.accessToken || '',
                refreshToken: data.refreshToken || '',
                tokenType: 'Bearer'
              },
              sessionId: data.sessionId || null,
              domain: vikaretaCrossDomainAuth.getCurrentDomain()
            };
            try { await vikaretaCrossDomainAuth.storeAuthData(authData); } catch {}

            return { user: data.user, isAuthenticated: true, isLoading: false, error: null, sessionId: data.sessionId || null };
          }
        }
      } catch {
        // Ignore bootstrap failures
      }

      return { user: null, isAuthenticated: false, isLoading: false, error: null, sessionId: null };
    } catch (error) {
      console.error('Failed to initialize SSO client:', error);
      return { user: null, isAuthenticated: false, isLoading: false, error: 'Initialization failed', sessionId: null };
    }
  }

  /**
   * Perform secure login with validation
   */
  async login(credentials: { email: string; password: string }): Promise<VikaretaAuthState> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(this.getCSRFToken() && { 'X-XSRF-TOKEN': this.getCSRFToken()! })
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: data.message || 'Login failed',
          sessionId: null
        };
      }

      // Handle our API response format: { success: true, data: { accessToken, user } }
      const authData = data.data || data;
      const user = authData.user;
      const accessToken = authData.accessToken;
      const refreshToken = authData.refreshToken || '';

      // Validate response data
      if (!user || !isVikaretaUser(user)) {
        throw new Error('Invalid authentication response - missing or invalid user data');
      }

      // Build auth data in expected format
      const vikaretaAuthData: VikaretaAuthData = {
        user,
        tokens: {
          accessToken,
          refreshToken,
          tokenType: 'Bearer'
        },
        sessionId: authData.sessionId || null,
        domain: vikaretaCrossDomainAuth.getCurrentDomain()
      };

      // Store auth data securely
  await vikaretaCrossDomainAuth.storeAuthData(vikaretaAuthData);

      // Sync across domains
      await vikaretaCrossDomainAuth.syncSSOAcrossDomains(vikaretaAuthData);

      return {
        user: vikaretaAuthData.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        sessionId: vikaretaAuthData.sessionId || null
      };
    } catch (error) {
      console.error('Login failed:', error);
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
        sessionId: null
      };
    }
  }

  /**
   * Secure token refresh with user validation
   */
  async refreshToken(): Promise<boolean> {
    // Prevent concurrent refresh requests
    if (this.refreshInProgress) {
      return this.refreshPromise || Promise.resolve(false);
    }

    this.refreshInProgress = true;
    this.refreshPromise = this.performTokenRefresh();

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.refreshInProgress = false;
      this.refreshPromise = null;
    }
  }

  /**
   * Secure logout with cross-domain cleanup
   */
  async logout(): Promise<void> {
    try {
      await vikaretaCrossDomainAuth.logoutFromAllDomains();
    } catch (error) {
      console.error('Logout failed:', error);
      // Force local cleanup even if API fails
      vikaretaCrossDomainAuth.clearAuthData();
    }
  }

  /**
   * Get current user with validation
   */
  getCurrentUser(): VikaretaUser | null {
    const state = vikaretaCrossDomainAuth.getStoredAuthData();
    return state.user && isVikaretaUser(state.user) ? state.user : null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const state = vikaretaCrossDomainAuth.getStoredAuthData();
    return state.isAuthenticated && state.user !== null;
  }

  /**
   * Validate current session
   */
  private async validateSession(): Promise<boolean> {
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data && data.success && data.user && isVikaretaUser(data.user);
    } catch (error) {
      console.error('Session validation failed:', error);
      return false;
    }
  }

  /**
   * Perform actual token refresh
   */
  private async performTokenRefresh(): Promise<boolean> {
    try {
      // Get current user for validation
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        return false;
      }

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(this.getCSRFToken() && { 'X-XSRF-TOKEN': this.getCSRFToken()! })
        }
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();

      // Validate refresh response - handle our API format
      const authData = data.data || data;
      if (!authData || !authData.user || !isVikaretaUser(authData.user)) {
        console.error('Invalid refresh response');
        return false;
      }

      // Security: Verify user hasn't changed during refresh
      if (authData.user.id !== currentUser.id) {
        console.error('User ID mismatch during token refresh - potential security issue');
        vikaretaCrossDomainAuth.clearAuthData();
        return false;
      }

      // Update stored auth data
      const vikaretaAuthData: VikaretaAuthData = {
        user: authData.user,
        tokens: {
          accessToken: authData.accessToken || '',
          refreshToken: authData.refreshToken || '',
          tokenType: 'Bearer'
        },
        sessionId: authData.sessionId,
        domain: vikaretaCrossDomainAuth.getCurrentDomain()
      };

  await vikaretaCrossDomainAuth.storeAuthData(vikaretaAuthData);
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  /**
   * Get CSRF token for secure requests
   */
  private getCSRFToken(): string | null {
    if (typeof window === 'undefined') return null;

    const cookies = document.cookie.split(';');
    const csrfCookie = cookies.find(cookie =>
      cookie.trim().startsWith('XSRF-TOKEN=')
    );

    return csrfCookie ? decodeURIComponent(csrfCookie.split('=')[1]) : null;
  }

  /**
   * Get access token from cookie
   */
  private getTokenFromCookie(): string | null {
    if (typeof window === 'undefined') return null;

    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie =>
      cookie.trim().startsWith(`${this.cookieNames.ACCESS_TOKEN}=`)
    );

    return tokenCookie ? decodeURIComponent(tokenCookie.split('=')[1]) : null;
  }

  /**
   * Get access token for API requests
   */
  getAccessToken(): string | null {
    return this.getTokenFromCookie();
  }
}

// Export singleton instance
export const vikaretaSSOClient = new VikaretaSSOClient();