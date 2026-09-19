import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

export interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  from: number;
  to: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  className?: string;
  /** Noun for the summary line: "1–10 of 42 invoices". */
  itemLabel?: string;
}

/**
 * Builds the page list with ellipses, e.g. `1 … 4 5 6 … 20`.
 * Always shows first, last, current and its neighbours.
 */
const pageRange = (page: number, totalPages: number): Array<number | 'gap'> => {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

  const pages = new Set<number>([1, totalPages, page, page - 1, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);

  const result: Array<number | 'gap'> = [];
  sorted.forEach((value, index) => {
    if (index > 0 && value - sorted[index - 1] > 1) result.push('gap');
    result.push(value);
  });
  return result;
};

export const Pagination = ({
  page,
  totalPages,
  total,
  from,
  to,
  pageSize,
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
  className,
  itemLabel = 'results',
}: PaginationProps) => {
  if (total === 0) return null;

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        'flex flex-col gap-3 border-t border-neutral-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800',
        className
      )}
    >
      <p className="text-sm text-neutral-500 tabular dark:text-neutral-400">
        Showing <span className="font-medium text-neutral-900 dark:text-neutral-100">{from}</span>–
        <span className="font-medium text-neutral-900 dark:text-neutral-100">{to}</span> of{' '}
        <span className="font-medium text-neutral-900 dark:text-neutral-100">{total}</span>{' '}
        {itemLabel}
      </p>

      <div className="flex items-center gap-3">
        {onPageSizeChange && pageSize !== undefined && (
          <label className="hidden items-center gap-2 text-sm text-neutral-500 sm:flex dark:text-neutral-400">
            Rows
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="rounded-lg border border-neutral-200 bg-white px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-neutral-700 dark:bg-neutral-900"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        )}

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {pageRange(page, totalPages).map((entry, index) =>
              entry === 'gap' ? (
                <span
                  key={`gap-${index}`}
                  className="px-1 text-sm text-neutral-400"
                  aria-hidden="true"
                >
                  …
                </span>
              ) : (
                <Button
                  key={entry}
                  variant={entry === page ? 'default' : 'ghost'}
                  size="icon"
                  className="h-8 w-8 text-sm tabular"
                  onClick={() => onPageChange(entry)}
                  aria-label={`Page ${entry}`}
                  aria-current={entry === page ? 'page' : undefined}
                >
                  {entry}
                </Button>
              )
            )}

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

Pagination.displayName = 'Pagination';
