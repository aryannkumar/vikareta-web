interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || 'https://api.vikareta.com') {
    // Ensure baseURL doesn't end with /api since we'll add it in endpoints
    if (baseURL.endsWith('/api')) {
      this.baseURL = baseURL.replace(/\/api$/, '');
    } else {
      this.baseURL = baseURL;
    }
  }

  /**
   * Get CSRF token from cookie
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

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Ensure endpoint starts with /api and has proper slash separation
    let normalizedEndpoint: string;
    if (endpoint.startsWith('/api')) {
      normalizedEndpoint = endpoint;
    } else {
      // Add leading slash if missing, then prepend /api
      const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      normalizedEndpoint = `/api${cleanEndpoint}`;
    }
    const url = `${this.baseURL}${normalizedEndpoint}`;
    
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
      const csrfToken = this.getCSRFToken();
      if (csrfToken) {
        config.headers = {
          ...config.headers,
          'X-XSRF-TOKEN': csrfToken,
        };
      }
    }

    try {
      console.log(`Making API request to: ${url}`);
      const response = await fetch(url, config);
      
      if (!response.ok) {
        console.error(`API request failed: ${response.status} ${response.statusText} for ${url}`);
        
        // Handle authentication errors
        if (response.status === 401) {
          console.log('Authentication required - redirecting to login');
          // Let the SSO system handle this
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
      const url = new URL(`${this.baseURL}${endpoint}`);
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, String(params[key]));
        }
      });
      finalEndpoint = url.pathname.replace(new URL(this.baseURL).pathname, '') + url.search;
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
}

export const apiClient = new ApiClient();