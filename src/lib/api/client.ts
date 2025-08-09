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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/csrf-token`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        this.token = data.data.csrfToken;
        this.tokenExpiry = Date.now() + (30 * 60 * 1000); // 30 minutes
        return this.token;
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

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api') {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

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
      const response = await fetch(url, config);
      
      if (!response.ok) {
        // Handle CSRF token errors
        if (response.status === 403) {
          const errorData = await response.json().catch(() => ({}));
          if (errorData.message?.includes('CSRF') || errorData.error?.includes('CSRF')) {
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
      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      console.error('API request failed:', error);
      
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
    const url = new URL(`${this.baseURL}${endpoint}`);
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, String(params[key]));
        }
      });
    }

    return this.request<T>(url.pathname + url.search);
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