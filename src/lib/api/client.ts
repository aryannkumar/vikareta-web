interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

/**
 * Get CSRF token from cookie (consistent with secure auth)
 */
function getCSRFToken(): string | null {
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

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_BASE || 'https://api.vikareta.com') {
    // Ensure consistent base URL with secure auth system
    // The baseURL should include /api/v1 if not already present
    if (baseURL.endsWith('/api/v1')) {
      this.baseURL = baseURL;
    } else if (baseURL.endsWith('/api')) {
      this.baseURL = baseURL + '/v1';
    } else {
      this.baseURL = baseURL + '/api/v1';
    }
    
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Client v2.0 initialized with baseURL:', this.baseURL);
      console.log('Development mode: simplified authentication flow enabled');
    }
  }

  /**
   * Initialize authentication session with the API backend
   */
  private async initializeAuth(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('Attempting to get CSRF token from auth/me endpoint...');
      }
      
      // Try to get CSRF token by calling the auth/me endpoint
      // This should set the necessary cookies if the user is authenticated
  const response = await fetch(`/api/auth/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Auth me response:', response.status);
      }
      
      // Even if it fails, it might set session cookies, so return true
      // The important thing is that we made a request with credentials
      return true;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Auth me request failed:', error);
      }
      return false;
    }
  }

  /**
   * Sync authentication to API domain if needed
   */
  private async syncAuthToAPI(): Promise<void> {
    if (typeof window === 'undefined') return;
    
    // Skip SSO sync in development since it's causing 403 errors
    if (process.env.NODE_ENV === 'development') {
      console.log('Skipping SSO sync in development mode');
      return;
    }
    
    try {
      const { vikaretaCrossDomainAuth } = await import('../auth/vikareta');
      
      // Extract API domain from base URL
      const apiUrl = new URL(this.baseURL);
      const apiDomain = apiUrl.hostname;
      
      console.log('Attempting SSO sync to API domain:', apiDomain);
      
      // Try SSO sync - this will fail if user is not authenticated on main domain
      await vikaretaCrossDomainAuth.syncSSOAcrossDomains();
      
      console.log('SSO sync completed');
    } catch (error) {
      console.log('SSO sync failed - user may not be authenticated on main domain:', error);
      // Don't throw error - this is expected if user is not authenticated
    }
  }

  /**
   * Get CSRF token from backend if not available in cookies
   */
  private async ensureCSRFToken(): Promise<string | null> {
    // Do not attempt CSRF acquisition during SSR; there is no browser cookie jar
    if (typeof window === 'undefined') {
      return null;
    }

    let csrfToken = this.getCSRFToken();

    // Only log debug information in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Cookie Debug:', {
        currentDomain: window.location.hostname,
        apiDomain: this.baseURL,
        cookieCount: document.cookie.split(';').filter(c => c.trim()).length,
        hasXSRF: document.cookie.includes('XSRF-TOKEN'),
      });
    }

    // In development, skip CSRF mechanics entirely
    if (process.env.NODE_ENV === 'development') {
      return null;
    }

    // In production, acquire CSRF by calling our proxy that sets XSRF-TOKEN
    if (!csrfToken) {
      try {
        await fetch('/api/csrf-token', { credentials: 'include' });
        csrfToken = this.getCSRFToken();

        // Fallback: touch auth/me only in the browser to encourage cookie sync
        if (!csrfToken) {
          const meResp = await fetch('/api/auth/me', {
            method: 'GET',
            credentials: 'include',
            headers: { 'Accept': 'application/json' },
          });
          // Even if unauthorized, cookies like XSRF-TOKEN may be set by the proxy
          void meResp;
          csrfToken = this.getCSRFToken();
        }
      } catch (error) {
        console.log('CSRF acquisition failed:', error);
      }
    }

    return csrfToken;
  }

  /**
   * Get CSRF token from cookie
   */
  private getCSRFToken(): string | null {
    return getCSRFToken();
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Build the URL - endpoint should already include /api prefix
    const url = `${this.baseURL}${endpoint}`;
    
    // Only log request details in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request URL:', url);
      console.log('Base URL:', this.baseURL);
      console.log('Endpoint:', endpoint);
    }
    
    const config: RequestInit = {
      headers: {
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    // Only add Content-Type header for requests with body data
    if (['POST', 'PUT', 'PATCH'].includes(options.method || 'GET') && options.body) {
      config.headers = {
        ...config.headers,
        'Content-Type': 'application/json',
      };
    }

    // No need to add auth token - using HttpOnly cookies

    // Add CSRF token for state-changing requests (from cookie)
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method || 'GET')) {
      const csrfToken = await this.ensureCSRFToken();
      
      // Only log CSRF debug info in development (without exposing cookies)
      if (process.env.NODE_ENV === 'development') {
        console.log('CSRF Debug:', {
          method: options.method,
          hasCSRF: !!csrfToken,
          cookieCount: typeof window !== 'undefined' ? document.cookie.split(';').filter(c => c.trim()).length : 0
        });
      }
      
      if (csrfToken) {
        config.headers = {
          ...config.headers,
          'X-XSRF-TOKEN': csrfToken,
        };
      } else if (process.env.NODE_ENV === 'development') {
        // In development, if we can't get CSRF token, add a development header
        // This allows testing when the full auth flow isn't working
        console.log('Development mode: Using auth bypass (no CSRF token available)');
        config.headers = {
          ...config.headers,
          'X-Development-Auth': 'bypass-v2',
          'X-Development-Mode': 'true',
        };
      }
    }

    try {
      console.log(`Making API request to: ${url}`);
      const response = await fetch(url, config);
      
      if (!response.ok) {
        console.error(`API request failed: ${response.status} ${response.statusText} for ${url}`);
        
        // Try to get the response body for better error info
        let responseErrorData;
        try {
          responseErrorData = await response.json();
          console.error('Error response body:', responseErrorData);
        } catch {
          console.error('Failed to parse error response as JSON');
        }
        
        // Handle authentication errors
        if (response.status === 401) {
          console.log('Authentication required - redirecting to login');
          // Let the SSO system handle this
        }
        
        // Handle forbidden errors
        if (response.status === 403) {
          console.error('Access forbidden - check authentication and permissions');
          // Note: Don't automatically redirect here, let the calling code decide
          return {
            success: false,
            data: [] as T,
            error: responseErrorData?.message || responseErrorData?.error || 'Access denied. Please login again.',
          };
        }
        
        // Handle different HTTP status codes
        if (response.status === 404) {
          return {
            success: false,
            data: [] as T,
            error: 'Resource not found',
          };
        }
        
        if (response.status >= 500) {
          return {
            success: false,
            data: [] as T,
            error: 'Server error occurred',
          };
        }
        
        const errorData = await response.json().catch(() => ({}));
        
        // Extract error message from various possible structures
        let errorMessage = `HTTP error! status: ${response.status}`;
        if (errorData.error) {
          if (typeof errorData.error === 'string') {
            errorMessage = errorData.error;
          } else if (errorData.error.message) {
            errorMessage = errorData.error.message;
          } else if (errorData.error.code) {
            // Handle structured errors like { code: 'USER_EXISTS', message: '...' }
            errorMessage = errorData.error.message || errorData.error.code;
          }
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
        
        return {
          success: false,
          data: [] as T,
          error: errorData.error || errorMessage,
        };
      }

      const data = await response.json();
      console.log(`API request successful: ${url}`);
      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      console.error('API request failed with error:', error, 'for URL:', url);
      
      // Return empty array for list endpoints to prevent UI crashes
      const isListEndpoint = endpoint.includes('/products') || 
                            endpoint.includes('/services') || 
                            endpoint.includes('/categories') ||
                            endpoint.includes('/orders') ||
                            endpoint.includes('/providers');
      
      return {
        success: false,
        data: (isListEndpoint ? [] : null) as T,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    let finalEndpoint = endpoint;
    
    if (params) {
  // Build a temporary absolute URL safely, regardless of leading slash
  const url = new URL(endpoint, this.baseURL.endsWith('/') ? this.baseURL : this.baseURL + '/');
      Object.keys(params).forEach(key => {
        const value = params[key];
        // Skip undefined or null
        if (value === undefined || value === null) return;
        // Skip empty strings
        if (typeof value === 'string' && value.trim() === '') return;
        // Skip empty arrays
        if (Array.isArray(value) && value.length === 0) return;

        url.searchParams.append(key, String(value));
      });
  // Preserve leading slash and only pass path + query to request()
  finalEndpoint = url.pathname + url.search;
    }

    return this.request<T>(finalEndpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  async upload<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = {};
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return this.request<T>(endpoint, {
      method: 'POST',
      headers,
      body: formData,
    });
  }

  // ===== ADMIN ROUTES =====
  async getAdminDashboard() {
    return this.get('/admin/dashboard');
  }

  async getAdminUsers(filters?: any) {
    return this.get('/admin/users', filters);
  }

  async updateAdminUserStatus(userId: string, status: string) {
    return this.put(`/admin/users/${userId}/status`, { status });
  }

  async deleteAdminUser(userId: string) {
    return this.delete(`/admin/users/${userId}`);
  }

  async getAdminOrders(filters?: any) {
    return this.get('/admin/orders', filters);
  }

  async getAdminOrder(orderId: string) {
    return this.get(`/admin/orders/${orderId}`);
  }

  async getAdminAnalytics() {
    return this.get('/admin/system/analytics/overview');
  }

  async getAdminHealth() {
    return this.get('/admin/system/health');
  }

  // ===== ADMIN ACTIONS =====
  async getAdminActions(filters?: any) {
    return this.get('/admin-actions', filters);
  }

  async createAdminAction(data: any) {
    return this.post('/admin-actions', data);
  }

  async updateAdminAction(actionId: string, data: any) {
    return this.put(`/admin-actions/${actionId}`, data);
  }

  async deleteAdminAction(actionId: string) {
    return this.delete(`/admin-actions/${actionId}`);
  }
}

export const apiClient = new ApiClient();