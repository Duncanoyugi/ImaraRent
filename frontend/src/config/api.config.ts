import { env } from './env';

export const apiConfig = {
  baseURL: env.API_URL,
  timeout: env.API_TIMEOUT,

  // Retry configuration
  retry: {
    maxRetries: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 10000),
  },

  // CORS configuration
  withCredentials: true,

  // Headers
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },

  // Response interceptors
  transformResponse: [
    (data: any) => {
      // Transform response data here if needed
      return data;
    },
  ],

  // Request interceptors
  transformRequest: [
    (data: any) => {
      // Transform request data here if needed
      return data;
    },
  ],
};