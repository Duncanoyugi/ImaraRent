import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Reads and writes URL search params so list filters survive refresh,
 * back/forward, and being shared as a link.
 */
export function useQueryParams<T extends Record<string, string | undefined>>(
  defaults: T
) {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useMemo(() => {
    const result = { ...defaults };
    (Object.keys(defaults) as Array<keyof T>).forEach((key) => {
      const value = searchParams.get(String(key));
      if (value !== null) result[key] = value as T[keyof T];
    });
    return result;
  }, [searchParams, defaults]);

  const setParams = useCallback(
    (next: Partial<Record<keyof T, string | number | undefined | null>>, replace = true) => {
      const updated = new URLSearchParams(searchParams);
      Object.entries(next).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') updated.delete(key);
        else updated.set(key, String(value));
      });
      setSearchParams(updated, { replace });
    },
    [searchParams, setSearchParams]
  );

  const reset = useCallback(() => setSearchParams({}, { replace: true }), [setSearchParams]);

  return { params, setParams, reset };
}
