// Global type declarations for the project

// Vue file type declarations

// ImportMeta type declarations
interface ImportMeta {
  env: {
    BASE_URL: string;
    MODE: string;
    DEV: boolean;
    PROD: boolean;
    SSR: boolean;
    VITE_URL_API: string;
  };
  url: string;
}

// NodeJS ProcessEnv declarations (if needed)
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    BASE_URL: string;
  }
}