import type { BaseApiResponse } from '@/types/api-response';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import httpClient from './http-client';
import ApiErrorHandler from './error-handler';

// Configuration interface for API client
interface ApiClientConfig {
  retries?: number;
  timeout?: number;
  logRequests?: boolean;
}

// Main API client class
class ApiClient {
  private config: ApiClientConfig;
  private defaultConfig: ApiClientConfig = {
    retries: 3,
    timeout: 10000,
    logRequests: true
  };

  constructor(config: ApiClientConfig = {}) {
    this.config = { ...this.defaultConfig, ...config };
  }

  // Generic request method with retry logic and logging
 async request<T = unknown>(config: AxiosRequestConfig): Promise<BaseApiResponse & { data: T }> {
    if (this.config.logRequests) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config);
    }

    let lastError: unknown;
    
    // Retry logic
    for (let attempt = 0; attempt <= (this.config.retries || 0); attempt++) {
      try {
        if (attempt > 0) {
          // Wait before retry with exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          if (this.config.logRequests) {
            console.log(`API Request retry attempt ${attempt + 1}: ${config.method?.toUpperCase()} ${config.url}`);
          }
        }

        const response: AxiosResponse<T> = await httpClient.request<T>({
          ...config,
          timeout: this.config.timeout
        });

        if (this.config.logRequests) {
          console.log(`API Response: ${config.method?.toUpperCase()} ${config.url}`, response);
        }

        return {
          data: response.data,
          statusCode: response.status
        };
      } catch (error) {
        lastError = error;
        if (this.config.logRequests) {
          console.error(`API Error on attempt ${attempt + 1}:`, error);
        }
        
        // Don't retry on certain error types (like 4xx client errors)
        if (this.shouldNotRetry(error)) {
          break;
        }
      }
    }

    // If all retries failed, throw the last error
    throw ApiErrorHandler.handle(lastError);
  }

  // Check if we should not retry based on error type
  private shouldNotRetry(error: unknown): boolean {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status: number } };
      // Don't retry 4xx client errors (except 401/403 which might be handled differently)
      if (axiosError.response?.status && axiosError.response.status >= 400 && axiosError.response.status < 500) {
        return ![401, 403].includes(axiosError.response.status);
      }
    }
    return false;
  }

  // Specific HTTP methods
  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<BaseApiResponse & { data: T }> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<BaseApiResponse & { data: T }> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<BaseApiResponse & { data: T }> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<BaseApiResponse & { data: T }> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }
}

// Create a default instance
const apiClient = new ApiClient();
export default apiClient;
export { ApiClient };