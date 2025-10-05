import { describe, expect, test, vi, beforeEach } from 'vitest';
import apiClient, { ApiClient } from '../api-client';
import { AxiosRequestConfig } from 'axios';

// Mock httpClient
vi.mock('../http-client', () => ({
  default: {
    request: vi.fn()
  }
}));

// No need to mock requestsModel as it has been removed

describe('ApiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should create instance with default config', () => {
    const client = new ApiClient();
    expect(client).toBeInstanceOf(ApiClient);
  });

  test('should create instance with custom config', () => {
    const client = new ApiClient({ retries: 5, timeout: 15000, logRequests: false });
    expect(client).toBeInstanceOf(ApiClient);
  });

  test('should make a GET request', async () => {
    const mockResponse = {
      data: { id: 1, name: 'test' },
      status: 200
    };
    
    const httpClient = await import('../http-client');
    (httpClient.default.request as any).mockResolvedValue(mockResponse);

    const result = await apiClient.get('/test');

    expect(result).toEqual({
      data: { id: 1, name: 'test' },
      statusCode: 200
    });
    expect(httpClient.default.request).toHaveBeenCalledWith({
      method: 'GET',
      url: '/test',
      timeout: 10000
    });
  });

  test('should make a POST request', async () => {
    const mockResponse = {
      data: { success: true },
      status: 201
    };
    
    const testData = { name: 'test' };
    const httpClient = await import('../http-client');
    (httpClient.default.request as any).mockResolvedValue(mockResponse);

    const result = await apiClient.post('/test', testData);

    expect(result).toEqual({
      data: { success: true },
      statusCode: 201
    });
    expect(httpClient.default.request).toHaveBeenCalledWith({
      method: 'POST',
      url: '/test',
      data: testData,
      timeout: 10000
    });
  });
});