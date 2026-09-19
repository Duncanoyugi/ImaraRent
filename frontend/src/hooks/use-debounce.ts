import { useEffect, useRef, useState } from 'react';

/** Delays a rapidly-changing value — search boxes, filter inputs. */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

/** Debounces a callback while keeping the latest closure. */
export function useDebouncedCallback<A extends unknown[]>(
  callback: (...args: A) => void,
  delay = 300
): (...args: A) => void {
  const latest = useRef(callback);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    latest.current = callback;
  }, [callback]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (...args: A) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => latest.current(...args), delay);
  };
}
