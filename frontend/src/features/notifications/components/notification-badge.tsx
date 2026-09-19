import { cn } from '@/lib/utils';

export interface NotificationBadgeProps {
  count: number;
  /** Anything above this renders as `99+`. */
  max?: number;
  className?: string;
}

/** The small count bubble that sits on the bell. Renders nothing at zero. */
export const NotificationBadge = ({ count, max = 99, className }: NotificationBadgeProps) => {
  if (count <= 0) return null;

  return (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center',
        'rounded-full bg-error-500 px-1 text-[10px] font-semibold leading-none text-white',
        'ring-2 ring-white dark:ring-neutral-900',
        className
      )}
    >
      {count > max ? `${max}+` : count}
    </span>
  );
};

NotificationBadge.displayName = 'NotificationBadge';
