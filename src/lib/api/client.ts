interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

class CSRFManager {
  private static token: string | null = null;
  private static tokenExpiry: number = 0;

  static async getToken(): Promise<string | null> {
    // Check if token is still valid (valid for 30 minutes)
    if (this.token && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    try {
      // Use the correct base URL for CSRF token endpoint
      const baseUrl = 'https://api.vikareta.com';
      const response = await fetch(`${baseUrl}/csrf-token`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Origin': window.location.origin,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        this.token = data.data.csrfToken;
        this.tokenExpiry = Date.now() + (30 * 60 * 1000); // 30 minutes
        return this.token;
      } else {
        console.error('CSRF token fetch failed:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
    }

    return null;
  }

  static clearToken(): void {
    this.token = null;
    this.tokenExpiry = 0;
  }
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || 'https://api.vikareta.com/api') {
    // Ensure baseURL doesn't have double /api and ends with /api
    if (baseURL.includes('/api/api')) {
      this.baseURL = baseURL.replace(/\/api\/api$/, '/api');
    } else if (!baseURL.endsWith('/api')) {
      this.baseURL = baseURL + '/api';
    } else {
      this.baseURL = baseURL;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
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

    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    // Add CSRF token for state-changing requests
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method || 'GET')) {
      const csrfToken = await CSRFManager.getToken();
      if (csrfToken) {
        config.headers = {
          ...config.headers,
          'X-CSRF-Token': csrfToken,
        };
      }
    }

    try {
      console.log(`Making API request to: ${url}`);
      const response = await fetch(url, config);
      
      if (!response.ok) {
        console.error(`API request failed: ${response.status} ${response.statusText} for ${url}`);
        
        // Handle CSRF token errors
        if (response.status === 403) {
          const errorData = await response.json().catch(() => ({}));
          const message = errorData.message || '';
          const error = errorData.error || '';
          if ((typeof message === 'string' && message.includes('CSRF')) || 
              (typeof error === 'string' && error.includes('CSRF'))) {
            console.log('CSRF token expired, clearing and retrying...');
            CSRFManager.clearToken();
            // Retry the request once with a fresh CSRF token
            return this.request<T>(endpoint, options);
          }
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
        return {
          success: false,
          data: [] as T,
          error: errorData.message || `HTTP error! status: ${response.status}`,
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