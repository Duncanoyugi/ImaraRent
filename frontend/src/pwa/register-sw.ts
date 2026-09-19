import { featureFlags } from '@/config/feature-flags';
import { purgeStaleCaches } from './cache';

type UpdateHandler = () => void;

/**
 * Registers the service worker behind `VITE_ENABLE_PWA`.
 *
 * When a new worker takes over we notify rather than reload: silently
 * reloading mid-form would lose whatever the user was typing.
 */
export const registerServiceWorker = async (
  onUpdateAvailable?: UpdateHandler
): Promise<ServiceWorkerRegistration | null> => {
  if (!featureFlags.pwa.enabled) return null;
  if (!('serviceWorker' in navigator)) return null;
  // A worker served over plain HTTP would be rejected anyway.
  if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });

    registration.addEventListener('updatefound', () => {
      const installing = registration.installing;
      if (!installing) return;

      installing.addEventListener('statechange', () => {
        // `controller` is only set when an older worker is already running,
        // which distinguishes an update from a first install.
        if (installing.state === 'installed' && navigator.serviceWorker.controller) {
          onUpdateAvailable?.();
        }
      });
    });

    await purgeStaleCaches();
    return registration;
  } catch (error) {
    console.error('Service worker registration failed:', error);
    return null;
  }
};

export const unregisterServiceWorker = async (): Promise<void> => {
  if (!('serviceWorker' in navigator)) return;
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((registration) => registration.unregister()));
};

/** Tells a waiting worker to activate immediately. */
export const applyUpdate = async (): Promise<void> => {
  const registration = await navigator.serviceWorker.getRegistration();
  registration?.waiting?.postMessage({ type: 'SKIP_WAITING' });
  window.location.reload();
};
