import { featureFlags } from '@/config/feature-flags';
import { registerServiceWorker } from './register-sw';
import { initOfflineDetection } from './offline';
import { toast } from 'sonner';
import { applyUpdate } from './register-sw';

export * from './cache';
export * from './offline';
export * from './sync';
export * from './push';
export * from './register-sw';

/**
 * Single entry point, called once from `main.tsx`.
 *
 * Returns a teardown function. Offline detection runs regardless of the PWA
 * flag — knowing the network is down is useful even without a service worker.
 */
export const initPwa = (): (() => void) => {
  const teardownOffline = initOfflineDetection();

  if (featureFlags.pwa.enabled) {
    void registerServiceWorker(() => {
      // Uses sonner directly rather than the showToast helper, which does
      // not expose an action slot.
      toast.info('A new version is available', {
        description: 'Reload to get the latest changes.',
        duration: Infinity,
        action: { label: 'Reload', onClick: () => void applyUpdate() },
      });
    });
  }

  return () => {
    teardownOffline();
  };
};
