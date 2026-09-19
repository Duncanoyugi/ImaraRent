import { vi } from 'vitest';

/**
 * Minimal axios-shaped error, for exercising the error normaliser and the
 * failure states of components without a live server.
 */
export const apiError = (status: number, message: string | string[] = 'Request failed') => {
  const error = new Error(Array.isArray(message) ? message[0] : message) as Error & {
    isAxiosError: boolean;
    response: { status: number; data: { message: string | string[]; statusCode: number } };
  };
  error.isAxiosError = true;
  error.response = { status, data: { message, statusCode: status } };
  return error;
};

/** Axios error with no response — what a dropped connection looks like. */
export const networkError = () => {
  const error = new Error('Network Error') as Error & { isAxiosError: boolean };
  error.isAxiosError = true;
  return error;
};

/** Replaces the whole `api` client; pass only the verbs a test needs. */
export const mockApi = (overrides: Partial<Record<'get' | 'post' | 'put' | 'patch' | 'delete', unknown>> = {}) => ({
  get: vi.fn().mockResolvedValue(overrides.get ?? []),
  post: vi.fn().mockResolvedValue(overrides.post ?? {}),
  put: vi.fn().mockResolvedValue(overrides.put ?? {}),
  patch: vi.fn().mockResolvedValue(overrides.patch ?? {}),
  delete: vi.fn().mockResolvedValue(overrides.delete ?? {}),
  upload: vi.fn().mockResolvedValue({}),
});
