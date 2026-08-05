// Environment variable validation
export const env = {
  // API Configuration
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  API_TIMEOUT: 30000,

  // App Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'ImaraRent',
  APP_DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || 'Property Management System',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',

  // Feature Flags
  ENABLE_MPESA: import.meta.env.VITE_ENABLE_MPESA === 'true',
  ENABLE_REALTIME: import.meta.env.VITE_ENABLE_REALTIME === 'true',
  ENABLE_PWA: import.meta.env.VITE_ENABLE_PWA === 'true',

  // Environment
  NODE_ENV: import.meta.env.MODE || 'development',
  IS_DEV: import.meta.env.MODE === 'development',
  IS_PROD: import.meta.env.MODE === 'production',
  IS_TEST: import.meta.env.MODE === 'test',

  // Sentry
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN || '',

  // Validation
  validate: (): void => {
    if (!env.API_URL) {
      console.warn('VITE_API_URL is not defined. Using default API URL.');
    }
  },
};

// Validate environment on startup
env.validate();