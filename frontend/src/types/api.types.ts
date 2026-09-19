/**
 * Transport-level types.
 *
 * The NestJS backend returns controller results directly — there is no
 * `{ data, success }` envelope — so `api.get<T>()` already resolves to `T`.
 * `ApiEnvelope` exists only for the handful of endpoints that do wrap.
 */

export interface ApiEnvelope<T> {
  data: T;
  message?: string;
  success?: boolean;
}

/** Shape of a NestJS exception body. */
export interface ApiErrorBody {
  message: string | string[];
  error?: string;
  statusCode: number;
  /** Populated by the validation pipe for field-level errors. */
  errors?: Record<string, string[]>;
}

export interface NormalizedApiError {
  message: string;
  statusCode: number;
  fieldErrors: Record<string, string>;
  isNetworkError: boolean;
  isAuthError: boolean;
  isForbidden: boolean;
  isNotFound: boolean;
  isValidationError: boolean;
  isServerError: boolean;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestOptions {
  params?: Record<string, unknown>;
  signal?: AbortSignal;
  headers?: Record<string, string>;
}
