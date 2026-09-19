import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PageHeaderProps {
  title: string;
  description?: React.ReactNode;
  /** Right-aligned buttons. */
  actions?: React.ReactNode;
  /** Renders a back link above the title. */
  backTo?: string;
  backLabel?: string;
  /** Status chips or meta shown under the title. */
  meta?: React.ReactNode;
  className?: string;
}

/**
 * The standard top-of-page block. Every list and detail screen uses this so
 * titles, spacing and the back affordance stay identical across the app.
 */
export const PageHeader = ({
  title,
  description,
  actions,
  backTo,
  backLabel = 'Back',
  meta,
  className,
}: PageHeaderProps) => (
  <div className={cn('mb-6', className)}>
    {backTo && (
      <Link
        to={backTo}
        className="mb-2 inline-flex items-center gap-1 text-sm text-neutral-500 transition-colors hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-neutral-400 dark:hover:text-neutral-100"
      >
        <ChevronLeft className="h-4 w-4" />
        {backLabel}
      </Link>
    )}

    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          {title}
        </h1>
        {description && (
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
            {description}
          </p>
        )}
        {meta && <div className="mt-3 flex flex-wrap items-center gap-2">{meta}</div>}
      </div>

      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  </div>
);

PageHeader.displayName = 'PageHeader';
