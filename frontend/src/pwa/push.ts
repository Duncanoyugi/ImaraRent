import { api } from '@/lib/api/client';

/**
 * Web Push subscription management.
 *
 * NOTE: this is inert until the backend exposes a subscription endpoint and a
 * VAPID public key is configured. `isPushConfigured()` gates the UI so nothing
 * offers push notifications that cannot actually deliver them.
 */

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY ?? '';

export const isPushSupported = (): boolean =>
  'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;

export const isPushConfigured = (): boolean => isPushSupported() && VAPID_PUBLIC_KEY.length > 0;

export const permissionState = (): NotificationPermission =>
  isPushSupported() ? Notification.permission : 'denied';

/** Base64url -> Uint8Array, the format `applicationServerKey` requires. */
const urlBase64ToUint8Array = (base64: string): Uint8Array => {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const normalized = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(normalized);
  return Uint8Array.from([...raw].map((char) => char.charCodeAt(0)));
};

export const requestPermission = async (): Promise<NotificationPermission> => {
  if (!isPushSupported()) return 'denied';
  return Notification.requestPermission();
};

export const subscribeToPush = async (): Promise<PushSubscription | null> => {
  if (!isPushConfigured()) return null;

  const permission = await requestPermission();
  if (permission !== 'granted') return null;

  const registration = await navigator.serviceWorker.ready;

  const existing = await registration.pushManager.getSubscription();
  if (existing) return existing;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
  });

  try {
    await api.post('/notifications/push/subscribe', subscription.toJSON());
  } catch {
    // Roll back so the browser does not hold a subscription the server
    // has no record of.
    await subscription.unsubscribe();
    return null;
  }

  return subscription;
};

export const unsubscribeFromPush = async (): Promise<void> => {
  if (!isPushSupported()) return;
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return;

  try {
    await api.post('/notifications/push/unsubscribe', { endpoint: subscription.endpoint });
  } catch {
    /* unsubscribe locally regardless */
  }
  await subscription.unsubscribe();
};
