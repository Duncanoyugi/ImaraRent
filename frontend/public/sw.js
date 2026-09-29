/* ImaraRent service worker.
 *
 * Hand-written rather than generated: the caching policy here is driven by
 * domain risk, not file type. Money and auth endpoints are never cached, so a
 * tenant can never be shown a stale balance or a replayed payment result.
 *
 * Mirrors the policy in src/pwa/cache.ts — keep the two in step.
 */

const CACHE_VERSION = 'v2';
const SHELL_CACHE = `imararent-shell-${CACHE_VERSION}`;
const API_CACHE = `imararent-api-${CACHE_VERSION}`;

const PRECACHE_URLS = ['/', '/index.html', '/offline.html', '/manifest.webmanifest'];

const NETWORK_ONLY = [/\/auth\//, /\/payments/, /\/billing/, /\/tenant-portal\/pay/];
const CACHEABLE_API = [/\/properties/, /\/units/, /\/tenants/, /\/leases/, /\/organizations/];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  // Every cache is versioned by CACHE_VERSION, so bumping it on each release
  // drops the previous release's entries here. `assets` is intentionally not
  // in `keep`: it was removed, and leaving the old name in the set is what
  // let stale build chunks survive indefinitely.
  const keep = new Set([SHELL_CACHE, API_CACHE]);
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('imararent-') && !keep.has(key))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

const networkFirst = async (request, cacheName) => {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    throw error;
  }
};

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Never interfere with other origins or with mutations.
  if (url.origin !== self.location.origin) return;
  if (request.method !== 'GET') return;
  if (NETWORK_ONLY.some((pattern) => pattern.test(url.pathname))) return;

  // Navigations: serve the shell, falling back to the offline page.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const cached = await caches.match('/index.html');
        return cached || caches.match('/offline.html');
      })
    );
    return;
  }

  // Build assets are deliberately NOT cached here. Vite gives every chunk a
  // content hash, so the browser HTTP cache already holds them immutably and
  // safely. Storing them in Cache Storage added nothing and, because the cache
  // name was versioned by hand rather than per release, it pinned the previous
  // deployment's filenames — requests for chunks a newer deploy had removed
  // came back 404 and the app could not boot.
  if (CACHEABLE_API.some((pattern) => pattern.test(url.pathname))) {
    event.respondWith(networkFirst(request, API_CACHE));
  }
});

self.addEventListener('push', (event) => {
  if (!event.data) return;
  let payload = {};
  try {
    payload = event.data.json();
  } catch {
    payload = { title: 'ImaraRent', body: event.data.text() };
  }

  event.waitUntil(
    self.registration.showNotification(payload.title || 'ImaraRent', {
      body: payload.body || '',
      icon: '/favicon-192x192.png',
      badge: '/favicon-192x192.png',
      data: { url: payload.url || '/dashboard' },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || '/dashboard';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const existing = clientList.find((client) => 'focus' in client);
      if (existing) return existing.focus();
      return self.clients.openWindow(target);
    })
  );
});
