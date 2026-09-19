type Listener = (online: boolean) => void;

const listeners = new Set<Listener>();

/**
 * Connectivity tracking.
 *
 * `navigator.onLine` only tells you whether an interface is up, not whether
 * the API is reachable — captive portals report "online" while blocking
 * everything — so a real request result can be fed back in via `reportReachability`.
 */
let reachable = true;

export const isOnline = (): boolean => navigator.onLine && reachable;

export const onConnectivityChange = (listener: Listener): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const notify = () => {
  const online = isOnline();
  listeners.forEach((listener) => {
    try {
      listener(online);
    } catch (error) {
      console.error('Connectivity listener threw:', error);
    }
  });
};

/** Call from the API error handler so a blocked network counts as offline. */
export const reportReachability = (value: boolean): void => {
  if (reachable === value) return;
  reachable = value;
  notify();
};

export const initOfflineDetection = (): (() => void) => {
  const handleOnline = () => {
    reachable = true;
    notify();
  };
  const handleOffline = () => notify();

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};
