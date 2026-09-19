import axios from 'axios';
import type { ApiErrorBody, NormalizedApiError } from '@/types/api.types';

const firstMessage = (message: string | string[] | undefined, fallback: string): string => {
  if (!message) return fallback;
  return Array.isArray(message) ? message[0] ?? fallback : message;
};

/**
 * Single place that turns anything thrown by axios/JS into something the UI
 * can render. Every mutation's `onError` and every error boundary goes here.
 */
export const normalizeError = (
  error: unknown,
  fallback = 'Something went wrong. Please try again.'
): NormalizedApiError => {
  const base: NormalizedApiError = {
    message: fallback,
    statusCode: 0,
    fieldErrors: {},
    isNetworkError: false,
    isAuthError: false,
    isForbidden: false,
    isNotFound: false,
    isValidationError: false,
    isServerError: false,
  };

  if (axios.isAxiosError<ApiErrorBody>(error)) {
    if (!error.response) {
      return {
        ...base,
        message: 'Cannot reach the server. Check your connection and try again.',
        isNetworkError: true,
      };
    }

    const status = error.response.status;
    const body = error.response.data;
    const fieldErrors: Record<string, string> = {};

    if (body?.errors) {
      Object.entries(body.errors).forEach(([field, messages]) => {
        fieldErrors[field] = Array.isArray(messages) ? messages[0] : String(messages);
      });
    }

    return {
      ...base,
      message: firstMessage(body?.message, statusFallback(status, fallback)),
      statusCode: status,
      fieldErrors,
      isAuthError: status === 401,
      isForbidden: status === 403,
      isNotFound: status === 404,
      isValidationError: status === 400 || status === 422,
      isServerError: status >= 500,
    };
  }

  if (error instanceof Error) {
    return { ...base, message: error.message || fallback };
  }

  return base;
};

const statusFallback = (status: number, fallback: string): string => {
  switch (status) {
    case 400:
      return 'Some of the details are invalid. Check the form and try again.';
    case 401:
      return 'Your session expired. Sign in again to continue.';
    case 403:
      return 'You do not have permission to do that.';
    case 404:
      return 'We could not find what you were looking for.';
    case 409:
      return 'That conflicts with something that already exists.';
    case 429:
      return 'Too many requests. Wait a moment and try again.';
    default:
      return status >= 500 ? 'The server ran into a problem. Try again shortly.' : fallback;
  }
};

/** Convenience for `onError` handlers that only need the text. */
export const errorMessage = (error: unknown, fallback?: string): string =>
  normalizeError(error, fallback).message;

/**
 * Pushes server-side field errors back onto a react-hook-form instance so they
 * render next to the offending input instead of only in a toast.
 */
export const applyFieldErrors = (
  error: unknown,
  setError: (field: string, err: { type: string; message: string }) => void
): boolean => {
  const { fieldErrors } = normalizeError(error);
  const entries = Object.entries(fieldErrors);
  entries.forEach(([field, message]) => setError(field, { type: 'server', message }));
  return entries.length > 0;
};
