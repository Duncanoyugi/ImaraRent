/**
 * CSRF support.
 *
 * The API authenticates with a bearer token read from storage rather than a
 * cookie, so browsers do not attach credentials to cross-site requests and
 * classic CSRF does not apply to the JSON endpoints.
 *
 * These helpers exist for the one case that *is* cookie-adjacent — the hosted
 * M-Pesa callback confirmation page — and for deployments that put the API
 * behind a cookie-session gateway. When the server issues an `XSRF-TOKEN`
 * cookie, the axios client mirrors it back on unsafe methods.
 */

export const CSRF_COOKIE = 'XSRF-TOKEN';
export const CSRF_HEADER = 'X-XSRF-TOKEN';

export const readCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${encodeURIComponent(name)}=`));
  return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : null;
};

export const getCsrfToken = (): string | null => readCookie(CSRF_COOKIE);

const UNSAFE_METHODS = new Set(['post', 'put', 'patch', 'delete']);

export const needsCsrfHeader = (method?: string): boolean =>
  UNSAFE_METHODS.has((method ?? 'get').toLowerCase());

/** Returns the header to merge into a request, or `{}` when there is no token. */
export const csrfHeaders = (method?: string): Record<string, string> => {
  if (!needsCsrfHeader(method)) return {};
  const token = getCsrfToken();
  return token ? { [CSRF_HEADER]: token } : {};
};

/**
 * Single-use nonce for flows that leave the SPA and come back (M-Pesa STK
 * confirmation). Stored in sessionStorage and compared on return.
 */
export const createNonce = (): string => {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
};
