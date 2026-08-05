import { type AxiosError } from 'axios';
import { type ApiError } from '../api-types';

export const handleApiError = (error: AxiosError<ApiError>): Promise<never> => {
  // Log error in development
  if (import.meta.env.DEV) {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      config: error.config,
    });
  }

  // Handle specific status codes
  if (error.response) {
    const { status, data } = error.response;

    switch (status) {
      case 400:
        // Bad Request - Validation errors
        throw new Error(data?.message || 'Invalid request. Please check your input.');
      case 401:
        // Unauthorized - Token expired or invalid
        // Will be handled by refresh token interceptor
        throw new Error('Session expired. Please login again.');
      case 403:
        // Forbidden - Insufficient permissions
        throw new Error('You do not have permission to perform this action.');
      case 404:
        // Not Found
        throw new Error('The requested resource was not found.');
      case 409:
        // Conflict
        throw new Error(data?.message || 'Resource already exists or conflict detected.');
      case 422:
        // Unprocessable Entity
        throw new Error(data?.message || 'Validation error. Please check your input.');
      case 429:
        // Too Many Requests
        throw new Error('Too many requests. Please try again later.');
      case 500:
        // Internal Server Error
        throw new Error('Server error. Please try again later.');
      case 503:
        // Service Unavailable
        throw new Error('Service temporarily unavailable. Please try again later.');
      default:
        throw new Error(data?.message || 'An unexpected error occurred.');
    }
  }

  // Network errors (no response)
  if (error.request) {
    throw new Error('Network error. Please check your internet connection.');
  }

  // Something else happened
  throw new Error(error.message || 'An unexpected error occurred.');
};