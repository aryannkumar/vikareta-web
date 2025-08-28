/**
 * Vikareta Platform - Unified Cross-Domain Authentication
 * Secure, consistent cross-domain auth across all Vikareta modules
 * Security: HttpOnly cookies, CSRF protection, domain validation
 */

import { 
  VikaretaAuthData, 
  VikaretaAuthState, 
  VikaretaDomain, 
  VIKARETA_AUTH_CONSTANTS,
  isVikaretaAuthData 
} from './vikareta-auth-types';

export class VikaretaCrossDomainAuth {
  private readonly domains = VIKARETA_AUTH_CONSTANTS.DOMAINS;
  private readonly cookieNames = VIKARETA_AUTH_CONSTANTS.COOKIE_NAMES;
  private authState: VikaretaAuthState | null = null;

  /**
   * Get current domain type with validation
   */
  getCurrentDomain(): VikaretaDomain {
    if (typeof window === 'undefined') return 'main';
    
    const hostname = window.location.hostname;
    
    // Exact domain matching for security
    if (hostname === this.domains.DASHBOARD || hostname.endsWith(`.${this.domains.DASHBOARD}`)) {
      return 'dashboard';
    }
    if (hostname === this.domains.ADMIN || hostname.endsWith(`.${this.domains.ADMIN}`)) {
      return 'admin';
    }
    
    return 'main';
  }

  /**
   * Store authentication data securely across domains
   */
  async storeAuthData(authData: VikaretaAuthData): Promise<void> {
    if (!isVikaretaAuthData(authData)) {
      throw new Error('Invalid authentication data structure');
    }

    if (typeof window === 'undefined') return;

    // Keep auth state in-memory only
    this.authState = {
      user: authData.user,
      isAuthenticated: true,
      isLoading: false,
      error: null,
      sessionId: authData.sessionId || null
    };

    // Exchange tokens with backend so server can set HttpOnly cookies
    try {
      await fetch('/api/auth/exchange-sso', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: authData.tokens.accessToken,
          refreshToken: authData.tokens.refreshToken,
          sessionId: authData.sessionId || null,
          domain: authData.domain || this.getCurrentDomain()
        })
      });
    } catch (err) {
      console.error('Failed to exchange SSO tokens with backend:', err);
    }
  }

  /**
   * Get stored authentication data with validation
   */
  getStoredAuthData(): VikaretaAuthState {
    if (typeof window === 'undefined') {
      return { user: null, isAuthenticated: false, isLoading: false, error: null, sessionId: null };
    }

    try {
      if (this.authState && this.authState.user) return this.authState;
      return { user: null, isAuthenticated: false, isLoading: false, error: null, sessionId: null };
    } catch (error) {
      console.error('Failed to parse stored auth data:', error);
      this.clearAuthData();
      return { user: null, isAuthenticated: false, isLoading: false, error: 'Corrupted auth data', sessionId: null };
    }
  }

  /**
   * Clear authentication data securely
   */
  clearAuthData(): void {
    if (typeof window === 'undefined') return;

  // Clear in-memory state and sessionStorage
  this.authState = null;
  try { sessionStorage.removeItem(VIKARETA_AUTH_CONSTANTS.STORAGE_KEYS.USER_PREFERENCES); } catch {}
  try { sessionStorage.removeItem(VIKARETA_AUTH_CONSTANTS.STORAGE_KEYS.RETURN_URL); } catch {}

    // Clear cookies on all domains
    this.clearSecureCookie(this.cookieNames.ACCESS_TOKEN);
    this.clearSecureCookie(this.cookieNames.REFRESH_TOKEN);
    this.clearSecureCookie(this.cookieNames.SESSION_ID);
  }

  /**
   * Sync authentication across all Vikareta domains using secure SSO
   */
  async syncSSOAcrossDomains(_authData?: VikaretaAuthData): Promise<void> {
    if (typeof window === 'undefined') return;

    const currentDomain = this.getCurrentDomain();
    const targetDomains = Object.entries(this.domains)
      .filter(([key]) => key.toLowerCase() !== currentDomain)
      .map(([, domain]) => domain);

  const syncPromises = targetDomains.map(domain => this.syncSingleDomain(domain));

    try {
      await Promise.allSettled(syncPromises);
    } catch (error) {
      console.error('SSO sync failed:', error);
    }
  }

  /**
   * Navigate to appropriate login page
   */
  navigateToLogin(): void {
    if (typeof window === 'undefined') return;

    const currentUrl = encodeURIComponent(window.location.href);
    const returnUrlParam = `?returnUrl=${currentUrl}`;
    
  // Store return URL in sessionStorage (short-lived)
  try { sessionStorage.setItem(VIKARETA_AUTH_CONSTANTS.STORAGE_KEYS.RETURN_URL, currentUrl); } catch {}

  const loginUrl = `/auth/login${returnUrlParam}`;

    window.location.href = loginUrl;
  }

  /**
   * Handle post-login redirect securely
   */
  handlePostLoginRedirect(searchParams?: URLSearchParams): void {
    if (typeof window === 'undefined') return;

    // Get return URL from parameters or localStorage
  const returnUrl = searchParams?.get('returnUrl') || sessionStorage.getItem(VIKARETA_AUTH_CONSTANTS.STORAGE_KEYS.RETURN_URL);
  try { sessionStorage.removeItem(VIKARETA_AUTH_CONSTANTS.STORAGE_KEYS.RETURN_URL); } catch {}

    if (returnUrl) {
      try {
        const decodedUrl = decodeURIComponent(returnUrl);
        const url = new URL(decodedUrl);
        
        // Validate return URL is from trusted Vikareta domains
        const trustedDomains = Object.values(this.domains);
        if (trustedDomains.includes(url.hostname)) {
          window.location.href = decodedUrl;
          return;
        }
      } catch (error) {
        console.error('Invalid return URL:', error);
      }
    }

    // Default redirect based on current domain
    const currentDomain = this.getCurrentDomain();
    switch (currentDomain) {
      case 'admin':
        window.location.href = '/dashboard';
        break;
      case 'dashboard':
        window.location.href = '/dashboard';
        break;
      default:
        window.location.href = '/';
    }
  }

  /**
   * Secure logout across all domains
   */
  async logoutFromAllDomains(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      // Call logout API endpoint
      await fetch('/api/auth/logout-all', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(this.getCSRFToken() && { 'X-XSRF-TOKEN': this.getCSRFToken()! })
        }
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
    }

    // Clear local data
    this.clearAuthData();

  // Sync logout across domains
  await this.syncLogoutAcrossDomains();

  // Redirect to login
  window.location.href = '/auth/login';
  }

  // Private helper methods

  private setSecureCookie(name: string, value: string, maxAge: number): void {
    if (typeof window === 'undefined') return;

    const isProduction = process.env.NODE_ENV === 'production';
    const domain = isProduction ? `.${this.domains.MAIN.split('.').slice(-2).join('.')}` : '';
    const secure = isProduction ? '; secure' : '';
    const sameSite = isProduction ? '; samesite=none' : '; samesite=lax';

    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}${domain ? `; domain=${domain}` : ''}${secure}${sameSite}`;
  }

  private clearSecureCookie(name: string): void {
    if (typeof window === 'undefined') return;

    const isProduction = process.env.NODE_ENV === 'production';
    const domain = isProduction ? `.${this.domains.MAIN.split('.').slice(-2).join('.')}` : '';

    // Clear on current domain
    document.cookie = `${name}=; path=/; max-age=0`;
    
    // Clear on parent domain
    if (domain) {
      document.cookie = `${name}=; path=/; max-age=0; domain=${domain}`;
    }
  }

  private getCSRFToken(): string | null {
    if (typeof window === 'undefined') return null;

    const cookies = document.cookie.split(';');
    const csrfCookie = cookies.find(cookie => 
      cookie.trim().startsWith('XSRF-TOKEN=')
    );

    return csrfCookie ? decodeURIComponent(csrfCookie.split('=')[1]) : null;
  }

  private async syncSingleDomain(domain: string): Promise<void> {
    try {
      // Skip API domain for SSO sync
      if (domain === this.domains.API) return;
      // Get SSO token for target domain
      const response = await fetch('/api/auth/sso-token', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(this.getCSRFToken() && { 'X-XSRF-TOKEN': this.getCSRFToken()! })
        },
        body: JSON.stringify({ target: domain })
      });

      if (!response.ok) return;

  const data = await response.json();
  const token = data?.token;
  if (!token) return;

  // Use image beacon to sync authentication (cookies set via Set-Cookie)
  await this.createSSOBeacon(domain, token);
    } catch (error) {
      console.error(`Failed to sync domain ${domain}:`, error);
    }
  }

  private createSSOBeacon(domain: string, token: string): Promise<void> {
    return new Promise((resolve) => {
      try {
        const img = new Image();
        const url = `https://${domain}/sso/receive?token=${encodeURIComponent(token)}&t=${Date.now()}`;
        const done = () => resolve();
        img.onload = done;
        img.onerror = done;
        img.src = url;
        setTimeout(done, 5000);
      } catch {
        resolve();
      }
    });
  }

  private async syncLogoutAcrossDomains(): Promise<void> {
    const targetDomains = Object.values(this.domains)
      .filter(domain => domain !== window.location.hostname)
      .filter(domain => domain !== this.domains.API);

    const logoutPromises = targetDomains.map(domain => this.createLogoutBeacon(domain));

    await Promise.allSettled(logoutPromises);
  }

  private createLogoutBeacon(domain: string): Promise<void> {
    return new Promise((resolve) => {
      try {
        const img = new Image();
        const url = `https://${domain}/api/auth/logout-all`;
        const done = () => resolve();
        img.onload = done;
        img.onerror = done;
        // Append cache-buster to ensure request fires
        img.src = `${url}?t=${Date.now()}`;
        // No need to attach to DOM; browser will still send request
        setTimeout(done, 2000);
      } catch {
        resolve();
      }
    });
  }
}

// Export singleton instance
export const vikaretaCrossDomainAuth = new VikaretaCrossDomainAuth();