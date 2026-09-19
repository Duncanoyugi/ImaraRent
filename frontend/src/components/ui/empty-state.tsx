import * as React from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ElementType;
  title: string;
  /** Say what to do next — an empty screen is an invitation to act. */
  description?: React.ReactNode;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  compact?: boolean;
}

export const EmptyState = ({
  icon: Icon = Inbox,
  title,
  description,
  action,
  secondaryAction,
  compact = false,
  className,
  ...props
}: EmptyStateProps) => (
  <div
    className={cn(
      'flex flex-col items-center justify-center text-center',
      compact ? 'gap-2 px-4 py-8' : 'gap-3 px-6 py-14',
      className
    )}
    {...props}
  >
    <span
      className={cn(
        'flex items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500',
        compact ? 'h-10 w-10' : 'h-14 w-14'
      )}
    >
      <Icon className={compact ? 'h-5 w-5' : 'h-7 w-7'} />
    </span>

    <div className="max-w-sm">
      <h3
        className={cn(
          'font-semibold text-neutral-900 dark:text-neutral-100',
          compact ? 'text-sm' : 'text-base'
        )}
      >
        {title}
      </h3>
      {description && (
        <p className="mt-1 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
      )}
    </div>

    {(action || secondaryAction) && (
      <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
        {action}
        {secondaryAction}
      </div>
    )}
  </div>
);

EmptyState.displayName = 'EmptyState';
