/**
 * Secure Cross-Subdomain SSO Authentication Client
 * Handles JWT + Refresh Token authentication with HttpOnly cookies
 */

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name: string;
  role: 'buyer' | 'seller' | 'admin' | 'both';
  verified: boolean;
  avatar?: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: {
    code: string;
    message: string;
  };
}

export class SSOAuthClient {
  private baseURL: string;
  private csrfToken: string | null = null;

  constructor() {
    this.baseURL = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:5001' 
      : 'https://api.vikareta.com';
  }

  /**
   * Get CSRF token from backend
   */
  private async ensureCSRFToken(): Promise<void> {
    if (typeof window === 'undefined') return;
    
    // Check if we already have a token in cookies
    const existingToken = this.getCSRFToken();
    if (existingToken) {
      return;
    }

    try {
      const response = await fetch(`${this.baseURL}/csrf-token`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Token should now be set in cookies
        console.log('SSO: CSRF token obtained');
        
        // Wait a bit for the cookie to be set
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Verify the token is now available
        const token = this.getCSRFToken();
        if (!token) {
          console.warn('SSO: CSRF token not found in cookies after request');
        } else {
          console.log('SSO: CSRF token verified in cookies');
        }
      }
    } catch (error) {
      console.warn('SSO: Failed to get CSRF token:', error);
    }
  }

  /**
   * Get CSRF token from cookie for state-changing requests
   */
  private getCSRFToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    const cookies = document.cookie.split(';');
    const csrfCookie = cookies.find(cookie => 
      cookie.trim().startsWith('XSRF-TOKEN=')
    );
    
    if (csrfCookie) {
      return decodeURIComponent(csrfCookie.split('=')[1]);
    }
    
    return null;
  }

  /**
   * Make authenticated API request
   */
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      credentials: 'include', // CRITICAL: Include cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add CSRF token for state-changing requests
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method || 'GET')) {
      const csrfToken = this.getCSRFToken();
      console.log('SSO: CSRF token for request:', csrfToken ? 'Found' : 'Not found');
      console.log('SSO: All cookies:', document.cookie);
      if (csrfToken) {
        config.headers = {
          ...config.headers,
          'X-XSRF-TOKEN': csrfToken,
        };
      }
    }

    try {
      console.log(`SSO: Making request to ${url}`);
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log(`SSO: Request successful to ${endpoint}`);
      return data;
    } catch (error) {
      console.error(`SSO: Request failed to ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Login with username/password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Ensure we have a CSRF token before making the request
      await this.ensureCSRFToken();
      
      const response = await this.request<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (response.success) {
        console.log('SSO: Login successful');
        // Cookies are automatically set by the server
        return response;
      } else {
        console.error('SSO: Login failed:', response.error);
        return response;
      }
    } catch (error) {
      console.error('SSO: Login error:', error);
      return {
        success: false,
        error: {
          code: 'LOGIN_ERROR',
          message: error instanceof Error ? error.message : 'Login failed'
        }
      };
    }
  }

  /**
   * Check current session and get user profile
   */
  async checkSession(): Promise<AuthResponse> {
    try {
      const response = await this.request<AuthResponse>('/api/auth/me', {
        method: 'GET',
      });

      if (response.success) {
        console.log('SSO: Session valid');
        return response;
      } else {
        console.log('SSO: Session invalid');
        return response;
      }
    } catch (error) {
      console.error('SSO: Session check error:', error);
      return {
        success: false,
        error: {
          code: 'SESSION_ERROR',
          message: error instanceof Error ? error.message : 'Session check failed'
        }
      };
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(): Promise<AuthResponse> {
    try {
      // Ensure we have a CSRF token before making the request
      await this.ensureCSRFToken();
      
      const response = await this.request<AuthResponse>('/api/auth/refresh', {
        method: 'POST',
      });

      if (response.success) {
        console.log('SSO: Token refreshed successfully');
        return response;
      } else {
        console.log('SSO: Token refresh failed');
        return response;
      }
    } catch (error) {
      console.error('SSO: Token refresh error:', error);
      return {
        success: false,
        error: {
          code: 'REFRESH_ERROR',
          message: error instanceof Error ? error.message : 'Token refresh failed'
        }
      };
    }
  }

  /**
   * Logout and clear all cookies across subdomains
   */
  async logout(): Promise<AuthResponse> {
    try {
      // Ensure we have a CSRF token before making the request
      await this.ensureCSRFToken();
      
      const response = await this.request<AuthResponse>('/api/auth/logout', {
        method: 'POST',
      });

      console.log('SSO: Logout completed');
      // Cookies are automatically cleared by the server
      return response;
    } catch (error) {
      console.error('SSO: Logout error:', error);
      return {
        success: false,
        error: {
          code: 'LOGOUT_ERROR',
          message: error instanceof Error ? error.message : 'Logout failed'
        }
      };
    }
  }

  /**
   * Register new user
   */
  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    userType: 'buyer' | 'seller';
    businessName?: string;
  }): Promise<AuthResponse> {
    try {
      // Ensure we have a CSRF token before making the request
      await this.ensureCSRFToken();
      
      const response = await this.request<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      if (response.success) {
        console.log('SSO: Registration successful');
        return response;
      } else {
        console.error('SSO: Registration failed:', response.error);
        return response;
      }
    } catch (error) {
      console.error('SSO: Registration error:', error);
      return {
        success: false,
        error: {
          code: 'REGISTRATION_ERROR',
          message: error instanceof Error ? error.message : 'Registration failed'
        }
      };
    }
  }
}

// Export singleton instance
export const ssoAuth = new SSOAuthClient();