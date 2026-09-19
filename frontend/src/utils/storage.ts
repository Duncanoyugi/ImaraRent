/**
 * Thin, typed, failure-tolerant wrappers over Web Storage.
 *
 * Storage throws in private-mode Safari and when the quota is exceeded, so
 * every call is guarded — losing a cached preference must never break a page.
 */

type Store = 'local' | 'session';

const backing = (store: Store): Storage | null => {
  try {
    const target = store === 'local' ? window.localStorage : window.sessionStorage;
    const probe = '__imararent__';
    target.setItem(probe, probe);
    target.removeItem(probe);
    return target;
  } catch {
    return null;
  }
};

const memory = new Map<string, string>();

const make = (store: Store) => {
  const target = () => backing(store);

  return {
    get<T>(key: string, fallback: T | null = null): T | null {
      const raw = target()?.getItem(key) ?? memory.get(key) ?? null;
      if (raw === null) return fallback;
      try {
        return JSON.parse(raw) as T;
      } catch {
        return raw as unknown as T;
      }
    },

    set<T>(key: string, value: T): void {
      const raw = JSON.stringify(value);
      const t = target();
      if (t) {
        try {
          t.setItem(key, raw);
          return;
        } catch {
          /* quota exceeded — fall through to memory */
        }
      }
      memory.set(key, raw);
    },

    remove(key: string): void {
      target()?.removeItem(key);
      memory.delete(key);
    },

    clear(): void {
      target()?.clear();
      memory.clear();
    },

    has(key: string): boolean {
      return (target()?.getItem(key) ?? memory.get(key)) != null;
    },
  };
};

export const localStore = make('local');
export const sessionStore = make('session');
export const isStorageAvailable = (store: Store = 'local'): boolean => backing(store) !== null;
