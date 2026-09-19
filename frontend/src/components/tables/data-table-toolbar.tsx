import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface DataTableToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  /** Filter selects rendered beside the search box. */
  filters?: React.ReactNode;
  /** Count of active filters — drives the reset affordance. */
  activeFilterCount?: number;
  onResetFilters?: () => void;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Search, filters and actions above a list. Debouncing belongs to the caller
 * (`useDebounce`) so the input stays fully controlled and responsive.
 */
export const DataTableToolbar = ({
  search,
  onSearchChange,
  searchPlaceholder = 'Search…',
  filters,
  activeFilterCount = 0,
  onResetFilters,
  actions,
  className,
}: DataTableToolbarProps) => (
  <div
    className={cn(
      'flex flex-col gap-3 border-b border-neutral-200 p-4 lg:flex-row lg:items-center dark:border-neutral-800',
      className
    )}
  >
    <div className="relative min-w-0 flex-1 lg:max-w-xs">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
      <Input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={searchPlaceholder}
        aria-label={searchPlaceholder}
        className="pl-9 pr-9"
      />
      {search && (
        <button
          type="button"
          onClick={() => onSearchChange('')}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-400 transition hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>

    {filters && (
      <div className="flex flex-wrap items-center gap-2">
        <SlidersHorizontal className="hidden h-4 w-4 shrink-0 text-neutral-400 lg:block" />
        {filters}

        {activeFilterCount > 0 && onResetFilters && (
          <Button variant="ghost" size="sm" className="h-9 gap-1.5" onClick={onResetFilters}>
            Reset
            <Badge variant="brand" className="px-1.5 text-[10px]">
              {activeFilterCount}
            </Badge>
          </Button>
        )}
      </div>
    )}

    {actions && <div className="flex items-center gap-2 lg:ml-auto">{actions}</div>}
  </div>
);

DataTableToolbar.displayName = 'DataTableToolbar';
