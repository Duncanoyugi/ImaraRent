import { useCallback, useMemo, useState } from 'react';

interface UsePaginationOptions {
  pageSize?: number;
  initialPage?: number;
}

/**
 * Client-side pagination. The API returns whole collections for the
 * volumes this system handles, so slicing happens here rather than per-request.
 */
export function usePagination<T>(items: T[] | undefined, options: UsePaginationOptions = {}) {
  const { pageSize: initialSize = 10, initialPage = 1 } = options;
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialSize);

  const all = useMemo(() => items ?? [], [items]);
  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Clamp rather than store out-of-range state: filtering can shrink the list
  // under the current page while the user is on it.
  const safePage = Math.min(page, totalPages);

  const pageItems = useMemo(
    () => all.slice((safePage - 1) * pageSize, safePage * pageSize),
    [all, safePage, pageSize]
  );

  const goTo = useCallback((next: number) => setPage(Math.max(1, next)), []);
  const next = useCallback(() => setPage((p) => p + 1), []);
  const previous = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const changePageSize = useCallback((size: number) => {
    setPageSize(size);
    setPage(1);
  }, []);

  return {
    page: safePage,
    pageSize,
    total,
    totalPages,
    pageItems,
    from: total === 0 ? 0 : (safePage - 1) * pageSize + 1,
    to: Math.min(safePage * pageSize, total),
    hasPrevious: safePage > 1,
    hasNext: safePage < totalPages,
    goTo,
    next,
    previous,
    setPageSize: changePageSize,
    reset: () => setPage(1),
  };
}
