import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { BaseApiResponse } from '@/types/api-response';

// Centralized HTTP client with default settings and interceptors
class HttpClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${import.meta.env.VITE_URL_API || ''}/`,
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true,
      timeout: 10000 // 10 seconds timeout
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle specific error cases
        if (error.response?.status === 401) {
          // Token expired - redirect to login or refresh token
          this.handleUnauthorized();
        }
        return Promise.reject(error);
      }
    );
  }

  private getAuthToken(): string | null {
    // In a real app, this would retrieve the token from storage
    return localStorage.getItem('authToken');
  }

  private handleUnauthorized(): void {
    // In a real app, this would handle token refresh or redirect to login
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  }

 // Generic request method
  async request<T = unknown>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.request<T>(config);
  }

  // Specific HTTP methods
  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
 }

  async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }

  // API call wrapper that returns standardized response format
  async apiCall<T = unknown>(config: AxiosRequestConfig): Promise<BaseApiResponse & { data: T }> {
    try {
      const response = await this.request<T>(config);
      return {
        data: response.data,
        statusCode: response.status
      };
    } catch (error: unknown) {
      // Handle error and return standardized error format
      if (axios.isAxiosError(error)) {
        return {
          data: error.response?.data || { error: 'Network error occurred' },
          statusCode: error.response?.status || 500
        };
      }
      
      throw error;
    }
  }
}

// Singleton instance
const httpClient = new HttpClient();
export default httpClient;