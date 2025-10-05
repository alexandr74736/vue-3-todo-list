// Type declarations for Vue Router
import 'vue-router';

// Import middleware types
import type { BaseMiddleware } from '@/types/middleware';

// Define a base middleware type
type Middleware = new() => BaseMiddleware;

// Extend the default route meta type
declare module 'vue-router' {
  interface RouteMeta {
    middlewares?: Array<Middleware>; // Define middleware array type
    layout?: string;
    [key: string]: unknown; // Allow additional properties
  }
}

// Wildcard module declaration for @api requests
declare module '@api/requests/*' {
  const content: unknown;
  export default content;
  // Removed export from deleted requests directory
}