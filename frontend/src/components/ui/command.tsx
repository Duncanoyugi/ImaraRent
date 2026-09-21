import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Keyboard-driven command palette.
 *
 * Built from scratch rather than pulling in `cmdk`: the app needs one
 * flat, filtered, arrow-navigable list, and the dependency would be larger
 * than the implementation.
 */

export interface CommandItem {
  id: string;
  label: string;
  /** Extra text matched against the query but not displayed. */
  keywords?: string;
  group?: string;
  icon?: React.ElementType;
  shortcut?: string;
  onSelect: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CommandItem[];
  placeholder?: string;
  emptyMessage?: string;
}

const score = (item: CommandItem, query: string): boolean => {
  if (!query) return true;
  const haystack = `${item.label} ${item.keywords ?? ''} ${item.group ?? ''}`.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => haystack.includes(token));
};

export const CommandPalette = ({
  open,
  onOpenChange,
  items,
  placeholder = 'Search or jump to…',
  emptyMessage = 'No matches. Try a different word.',
}: CommandPaletteProps) => {
  const [query, setQuery] = React.useState('');
  const [active, setActive] = React.useState(0);
  const listRef = React.useRef<HTMLDivElement>(null);

  const results = React.useMemo(() => items.filter((item) => score(item, query)), [items, query]);

  // Reset when reopened so the palette never resumes a stale search.
  React.useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
    }
  }, [open]);

  React.useEffect(() => setActive(0), [query]);

  // Keep the highlighted row inside the scroll viewport.
  React.useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const run = (item: CommandItem | undefined) => {
    if (!item) return;
    onOpenChange(false);
    item.onSelect();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((i) => (results.length === 0 ? 0 : (i + 1) % results.length));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((i) => (results.length === 0 ? 0 : (i - 1 + results.length) % results.length));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      run(results[active]);
    }
  };

  let lastGroup: string | undefined;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          onKeyDown={onKeyDown}
          className={cn(
            'fixed left-1/2 top-[15vh] z-50 w-[calc(100vw-2rem)] max-w-xl -translate-x-1/2',
            'overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
            'dark:border-neutral-800 dark:bg-neutral-900'
          )}
        >
          <DialogPrimitive.Title className="sr-only">Search ImaraRent</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Type to filter, then press Enter to open.
          </DialogPrimitive.Description>

          <div className="flex items-center gap-3 border-b border-neutral-200 px-4 dark:border-neutral-800">
            <Search className="h-4 w-4 shrink-0 text-neutral-400" />
            {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              aria-label="Search"
              className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
            />
          </div>

          <div ref={listRef} role="listbox" className="max-h-80 overflow-y-auto p-2">
            {results.length === 0 ? (
              <p className="px-3 py-8 text-center text-sm text-neutral-500">{emptyMessage}</p>
            ) : (
              results.map((item, index) => {
                const showGroup = item.group && item.group !== lastGroup;
                lastGroup = item.group;
                const Icon = item.icon;

                return (
                  <React.Fragment key={item.id}>
                    {showGroup && (
                      <p className="px-3 pb-1 pt-3 text-xs font-medium text-neutral-400">
                        {item.group}
                      </p>
                    )}
                    <button
                      type="button"
                      role="option"
                      data-index={index}
                      aria-selected={index === active}
                      onMouseEnter={() => setActive(index)}
                      onClick={() => run(item)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                        index === active
                          ? 'bg-brand-50 text-brand-900 dark:bg-brand-900/30 dark:text-brand-100'
                          : 'text-neutral-700 dark:text-neutral-300'
                      )}
                    >
                      {Icon && <Icon className="h-4 w-4 shrink-0 text-neutral-400" />}
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      {item.shortcut && (
                        <kbd className="shrink-0 rounded border border-neutral-200 px-1.5 py-0.5 text-[10px] text-neutral-500 dark:border-neutral-700">
                          {item.shortcut}
                        </kbd>
                      )}
                    </button>
                  </React.Fragment>
                );
              })
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

CommandPalette.displayName = 'CommandPalette';

/** Opens the palette on ⌘K / Ctrl-K, ignoring keystrokes inside inputs. */
export const useCommandShortcut = (onOpen: () => void) => {
  React.useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.key ?? '').toLowerCase() !== 'k' || !(event.metaKey || event.ctrlKey)) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      event.preventDefault();
      onOpen();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onOpen]);
};
