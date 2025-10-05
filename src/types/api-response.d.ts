// Specific API response types for better type safety

// Base response type
interface BaseApiResponse {
  statusCode: number;
}

// User-related response types
interface UserApiResponse extends BaseApiResponse {
  data: {
    user: {
      id: string;
      username: string;
      email: string;
      role: string;
      isAdmin: boolean;
    };
  };
}

interface AdminCheckApiResponse extends BaseApiResponse {
  data: {
    success: boolean;
    isAdmin: boolean;
  };
}

// Todos-related response types
interface TodosListApiResponse extends BaseApiResponse {
  data: {
    todos: Record<string, { status: boolean; text: string }>;
  };
}

interface SaveTodosApiResponse extends BaseApiResponse {
  data: {
    success: boolean;
  };
}

// Error response type
interface ApiErrorResponse {
  data: {
    errors: Record<string, string>;
  };
  statusCode: number;
}

// Union type for API responses
type SpecificApiResponse = 
  | UserApiResponse 
  | AdminCheckApiResponse 
  | TodosListApiResponse 
  | SaveTodosApiResponse;

// Error handler type
interface ApiErrorHandler {
  handle(error: unknown): ApiErrorResponse;
}

export type { 
  BaseApiResponse, 
  UserApiResponse, 
  AdminCheckApiResponse, 
  TodosListApiResponse, 
  SaveTodosApiResponse, 
  SpecificApiResponse,
  ApiErrorResponse,
  ApiErrorHandler
};