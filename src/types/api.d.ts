// Common API type declarations for the project

interface ApiResponse<T = unknown> {
  data: T;
  statusCode: number;
}

// Export for use in modules that need to reference this type
export type { ApiResponse };