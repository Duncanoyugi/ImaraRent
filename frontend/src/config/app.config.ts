import { env } from './env';

export const appConfig = {
  name: env.APP_NAME,
  description: env.APP_DESCRIPTION,
  version: env.APP_VERSION,

  // Theme configuration
  theme: {
    defaultTheme: 'light',
    supportedThemes: ['light', 'dark', 'system'],
  },

  // Language configuration
  language: {
    defaultLocale: 'en',
    supportedLocales: ['en', 'sw'],
  },

  // Date format configuration
  dateFormat: {
    default: 'MMM dd, yyyy',
    full: 'EEEE, MMMM dd, yyyy',
    time: 'h:mm a',
    dateTime: 'MMM dd, yyyy h:mm a',
  },

  // Currency configuration
  currency: {
    code: 'KES',
    symbol: 'KES',
    locale: 'en-KE',
  },

  // Notification configuration
  notifications: {
    maxRetries: 3,
    retryDelay: 5000,
    defaultDuration: 5000,
  },

  // Pagination defaults
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 25, 50, 100],
  },

  // File upload configuration
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    maxFiles: 10,
  },
};