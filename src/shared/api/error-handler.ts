import type { ApiErrorResponse } from '@/types/api-response';

class ApiErrorHandler {
  static handle(error: unknown): ApiErrorResponse {
    // Check if error is already formatted
    if (this.isApiErrorResponse(error)) {
      return error as ApiErrorResponse;
    }

    // Handle axios errors
    if (this.isAxiosError(error)) {
      return {
        data: {
          errors: {
            server: (error.response?.data && typeof error.response.data === 'object' && 'message' in error.response.data)
              ? (error.response.data as { message?: string }).message || 'Network error occurred'
              : 'Network error occurred'
          }
        },
        statusCode: error.response?.status || 500
      };
    }

    // Handle generic errors
    return {
      data: {
        errors: {
          server: (error as Error)?.message || 'Unknown error occurred'
        }
      },
      statusCode: 500
    };
  }

  private static isApiErrorResponse(error: unknown): error is ApiErrorResponse {
    return (
      typeof error === 'object' &&
      error !== null &&
      'data' in error &&
      typeof (error as { data?: unknown }).data === 'object' &&
      (error as { data?: { errors?: unknown } }).data?.errors !== undefined &&
      typeof (error as { statusCode?: unknown }).statusCode === 'number'
    );
  }

 private static isAxiosError(error: unknown): error is { response?: { data: unknown; status: number } } {
    return (
      typeof error === 'object' &&
      error !== null &&
      'response' in error
    );
  }
}

export default ApiErrorHandler;