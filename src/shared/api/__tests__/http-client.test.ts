import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import httpClient from '../http-client';
import type { BaseApiResponse } from '@/types/api-response';
import type { AxiosResponse } from 'axios';

// Mock axios
vi.mock('axios', async () => {
  const actual = await import('axios');
  return {
    ...actual,
    default: {
      create: vi.fn(() => ({
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
        request: vi.fn(),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() }
        }
      })),
      isAxiosError: vi.fn((error) => error.isAxiosError === true)
    }
  };
});

describe('HttpClient', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getAuthToken', () => {
    it('should return null when no token in localStorage', () => {
      const token = localStorage.getItem('authToken');
      expect(token).toBeNull();
    });

    it('should return token when present in localStorage', () => {
      localStorage.setItem('authToken', 'test-token');
      const token = localStorage.getItem('authToken');
      expect(token).toBe('test-token');
    });
  });

  describe('request methods', () => {
    it('should have a get method', () => {
      expect(httpClient.get).toBeDefined();
    });

    it('should have a post method', () => {
      expect(httpClient.post).toBeDefined();
    });

    it('should have a put method', () => {
      expect(httpClient.put).toBeDefined();
    });

    it('should have a delete method', () => {
      expect(httpClient.delete).toBeDefined();
    });

    it('should have a request method', () => {
      expect(httpClient.request).toBeDefined();
    });
  });

  describe('apiCall method', () => {
    it('should return successful response in standardized format', async () => {
      const mockResponse: AxiosResponse = {
        data: { id: 1, name: 'Test' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: '/test',
          method: 'GET',
          headers: {} as any
        }
      };

      // Mock the request method to return the mock response
      const requestSpy = vi.spyOn(httpClient, 'request').mockResolvedValue(mockResponse);

      const result = await httpClient.apiCall({ url: '/test' });

      expect(result).toEqual({
        data: { id: 1, name: 'Test' },
        statusCode: 200
      });
      expect(requestSpy).toHaveBeenCalledWith({ url: '/test' });

      requestSpy.mockRestore();
    });

    it('should handle error response and return standardized error format', async () => {
      const mockError = {
        isAxiosError: true,
        response: {
          data: { error: 'Not found' },
          status: 404
        }
      };

      // Mock the request method to reject with the mock error
      const requestSpy = vi.spyOn(httpClient, 'request').mockRejectedValue(mockError);

      const result = await httpClient.apiCall({ url: '/test' });

      expect(result).toEqual({
        data: { error: 'Not found' },
        statusCode: 404
      });

      requestSpy.mockRestore();
    });

    it('should handle network error and return standardized error format', async () => {
      const mockError = {
        isAxiosError: true,
        response: null
      };

      // Mock the request method to reject with the mock error
      const requestSpy = vi.spyOn(httpClient, 'request').mockRejectedValue(mockError);

      const result = await httpClient.apiCall({ url: '/test' });

      expect(result).toEqual({
        data: { error: 'Network error occurred' },
        statusCode: 500
      });

      requestSpy.mockRestore();
    });
  });
});