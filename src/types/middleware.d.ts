// Types for middleware results

// Result of a middleware check
type MiddlewareCheckResult = 
  | MiddlewareContinue    // Continue with normal execution
  | MiddlewareRedirect    // Redirect to another route
  | MiddlewareDeny;       // Deny access (show error, etc.)

// Continue with normal execution
interface MiddlewareContinue {
  type: 'continue';
  data?: unknown;
}

// Redirect to another route
interface MiddlewareRedirect {
  type: 'redirect';
  to: string | { name: string; params?: Record<string, string> };
}

// Deny access
interface MiddlewareDeny {
  type: 'deny';
  reason?: string;
}

// Base middleware interface
interface BaseMiddleware {
  check(): Promise<MiddlewareCheckResult>;
}

export type { 
  MiddlewareCheckResult, 
  MiddlewareContinue, 
  MiddlewareRedirect, 
  MiddlewareDeny,
  BaseMiddleware
};