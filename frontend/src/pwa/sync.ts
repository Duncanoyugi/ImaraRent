import { localStore } from '@/utils/storage';
import { isOnline, onConnectivityChange } from './offline';

const QUEUE_KEY = 'imararent-sync-queue';

export interface QueuedRequest {
  id: string;
  url: string;
  method: 'POST' | 'PATCH' | 'PUT';
  body: unknown;
  queuedAt: string;
  attempts: number;
  /** Shown to the user while the item waits. */
  label: string;
}

/**
 * Background sync for writes made while offline.
 *
 * Scope is deliberately narrow: maintenance tickets and profile edits only.
 * Payments are never queued — replaying a payment after the fact could
 * double-charge a tenant, and the tenant must see the M-Pesa result live.
 */
const QUEUEABLE = [/\/maintenance/, /\/users\//];

export const canQueue = (url: string): boolean => QUEUEABLE.some((p) => p.test(url));

export const getQueue = (): QueuedRequest[] => localStore.get<QueuedRequest[]>(QUEUE_KEY) ?? [];

const setQueue = (queue: QueuedRequest[]) => localStore.set(QUEUE_KEY, queue);

export const enqueue = (
  request: Omit<QueuedRequest, 'id' | 'queuedAt' | 'attempts'>
): QueuedRequest => {
  const entry: QueuedRequest = {
    ...request,
    id: crypto.randomUUID(),
    queuedAt: new Date().toISOString(),
    attempts: 0,
  };
  setQueue([...getQueue(), entry]);
  return entry;
};

export const dequeue = (id: string): void => {
  setQueue(getQueue().filter((entry) => entry.id !== id));
};

/**
 * Drains the queue. Each item gets a bounded number of attempts so a
 * permanently-rejected request cannot block everything behind it.
 */
export const flushQueue = async (
  send: (request: QueuedRequest) => Promise<void>
): Promise<{ sent: number; failed: number }> => {
  if (!isOnline()) return { sent: 0, failed: 0 };

  let sent = 0;
  let failed = 0;

  for (const entry of getQueue()) {
    try {
      await send(entry);
      dequeue(entry.id);
      sent += 1;
    } catch {
      failed += 1;
      const remaining = getQueue().map((item) =>
        item.id === entry.id ? { ...item, attempts: item.attempts + 1 } : item
      );
      // Give up after five tries rather than retrying forever.
      setQueue(remaining.filter((item) => item.attempts < 5));
    }
  }

  return { sent, failed };
};

/** Flushes automatically the moment connectivity returns. */
export const initBackgroundSync = (
  send: (request: QueuedRequest) => Promise<void>
): (() => void) =>
  onConnectivityChange((online) => {
    if (online) void flushQueue(send);
  });
