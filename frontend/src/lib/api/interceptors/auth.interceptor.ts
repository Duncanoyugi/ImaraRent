import { type InternalAxiosRequestConfig } from 'axios';

export const authInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = localStorage.getItem('accessToken');

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

// Helper to set auth token
export const setAuthToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem('accessToken', token);
  } else {
    localStorage.removeItem('accessToken');
  }
};

// Helper to get auth token
export const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

// Helper to clear auth data
export const clearAuthData = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  localStorage.removeItem('organization');
};