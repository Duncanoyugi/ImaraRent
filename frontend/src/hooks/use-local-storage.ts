import { useCallback, useEffect, useState } from 'react';
import { localStore } from '@/utils/storage';

/**
 * `useState` that survives reloads and stays in sync across browser tabs.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => localStore.get<T>(key) ?? initialValue);

  const update = useCallback(
    (next: T | ((current: T) => T)) => {
      setValue((current) => {
        const resolved =
          typeof next === 'function' ? (next as (c: T) => T)(current) : next;
        localStore.set(key, resolved);
        return resolved;
      });
    },
    [key]
  );

  const remove = useCallback(() => {
    localStore.remove(key);
    setValue(initialValue);
  }, [key, initialValue]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== key) return;
      setValue(event.newValue ? (JSON.parse(event.newValue) as T) : initialValue);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key, initialValue]);

  return [value, update, remove] as const;
}
