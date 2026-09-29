/**
 * Cache names and routing policy for the service worker.
 *
 * Kept in its own module so both the worker and the app can agree on names —
 * the app needs them to purge caches on sign-out, since a shared device must
 * not leak one tenant's cached invoices to the next person who signs in.
 */

/*
 * Bump on every release. The service worker uses this name to evict the
 * previous release's entries on activate, so a release that changes cached
 * content must change this string or stale entries survive.
 */
export const CACHE_VERSION = 'v2';

export const CACHES = {
  shell: `imararent-shell-${CACHE_VERSION}`,
  api: `imararent-api-${CACHE_VERSION}`,
} as const;

/** Files that make the app shell renderable with no network. */
export const PRECACHE_URLS = ['/', '/index.html', '/offline.html', '/manifest.webmanifest'];

export type Strategy = 'network-first' | 'network-only';

/**
 * Anything touching money, auth or a mutation is network-only: a stale
 * balance or a replayed payment is far worse than an error message.
 */
const NETWORK_ONLY = [/\/auth\//, /\/payments/, /\/billing/, /\/tenant-portal\/pay/];

/** Reference data that changes slowly and is safe to serve stale briefly. */
const CACHEABLE_API = [/\/properties/, /\/units/, /\/tenants/, /\/leases/, /\/organizations/];

export const strategyFor = (url: string, method = 'GET'): Strategy => {
  if (method !== 'GET') return 'network-only';
  if (NETWORK_ONLY.some((pattern) => pattern.test(url))) return 'network-only';
  if (CACHEABLE_API.some((pattern) => pattern.test(url))) return 'network-first';
  // Content-hashed build assets: served straight from the HTTP cache, never
  // written to Cache Storage, so a new release can never be served an old
  // chunk filename that no longer exists.
  if (/\.(?:js|css|woff2?|png|svg|jpg|jpeg|webp|ico)$/.test(url)) return 'network-first';
  return 'network-first';
};

/** Called on sign-out — see the note above about shared devices. */
export const purgeCaches = async (): Promise<void> => {
  if (!('caches' in window)) return;
  const keys = await caches.keys();
  await Promise.all(
    keys.filter((key) => key.startsWith('imararent-')).map((key) => caches.delete(key))
  );
};

/** Drops caches left over from a previous release. */
export const purgeStaleCaches = async (): Promise<void> => {
  if (!('caches' in window)) return;
  const current = new Set<string>(Object.values(CACHES));
  const keys = await caches.keys();
  await Promise.all(
    keys
      .filter((key) => key.startsWith('imararent-') && !current.has(key))
      .map((key) => caches.delete(key))
  );
};
