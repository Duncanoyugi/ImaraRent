import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SortDirection = 'asc' | 'desc' | null;

export interface DataTableColumnHeaderProps {
  title: string;
  /** Omit to render a plain, non-sortable header. */
  sortKey?: string;
  activeSortKey?: string | null;
  direction?: SortDirection;
  onSort?: (key: string) => void;
  align?: 'left' | 'right' | 'center';
  className?: string;
}

/**
 * Sortable column header.
 *
 * `aria-sort` is set on the parent `<th>` by the table; this renders the
 * button and the direction indicator.
 */
export const DataTableColumnHeader = ({
  title,
  sortKey,
  activeSortKey,
  direction,
  onSort,
  align = 'left',
  className,
}: DataTableColumnHeaderProps) => {
  const alignment =
    align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start';

  if (!sortKey || !onSort) {
    return <span className={cn('flex items-center', alignment, className)}>{title}</span>;
  }

  const isActive = activeSortKey === sortKey;
  const Icon = !isActive ? ChevronsUpDown : direction === 'asc' ? ArrowUp : ArrowDown;

  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className={cn(
        'group flex w-full items-center gap-1.5 rounded transition-colors',
        'hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:hover:text-neutral-100',
        alignment,
        className
      )}
    >
      {title}
      <Icon
        className={cn(
          'h-3.5 w-3.5 shrink-0 transition-opacity',
          isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
        )}
      />
    </button>
  );
};

DataTableColumnHeader.displayName = 'DataTableColumnHeader';

/**
 * Cycles a column through asc -> desc -> unsorted. Returned state is meant to
 * be held by the list page and fed back in as props.
 */
export const nextSortState = (
  current: { key: string | null; direction: SortDirection },
  key: string
): { key: string | null; direction: SortDirection } => {
  if (current.key !== key) return { key, direction: 'asc' };
  if (current.direction === 'asc') return { key, direction: 'desc' };
  return { key: null, direction: null };
};
