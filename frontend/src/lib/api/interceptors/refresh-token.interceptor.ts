import { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { apiClient } from '../client';
import { clearAuthData } from './auth.interceptor';

// Queue for requests while token is refreshing
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
  config: InternalAxiosRequestConfig;
}> = [];

const processQueue = (error: Error | null, token: string | null = null): void => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.config.headers.Authorization = `Bearer ${token}`;
      promise.resolve(apiClient(promise.config));
    }
  });
  failedQueue = [];
};

export const refreshTokenInterceptor = async (error: AxiosError): Promise<any> => {
  const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

  // Skip if not 401 or already retried
  if (error.response?.status !== 401 || originalRequest._retry) {
    return Promise.reject(error);
  }

  // Skip refresh for auth endpoints
  if (originalRequest.url?.includes('/auth/refresh') || originalRequest.url?.includes('/auth/login')) {
    return Promise.reject(error);
  }

  originalRequest._retry = true;

  // If already refreshing, queue this request
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({
        resolve,
        reject,
        config: originalRequest,
      });
    });
  }

  isRefreshing = true;

  try {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post('/auth/refresh', { refreshToken });

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', newRefreshToken);

    // Process queued requests
    processQueue(null, accessToken);

    // Retry original request
    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
    return apiClient(originalRequest);
  } catch (refreshError) {
    // Refresh failed - clear auth data and redirect to login
    clearAuthData();
    processQueue(refreshError as Error, null);

    // Redirect to login page
    window.location.href = '/login';
    return Promise.reject(refreshError);
  } finally {
    isRefreshing = false;
  }
};