import { Lock, RotateCw, SearchX, ServerCrash, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { normalizeError } from '@/utils/error-handlers';

export interface ApiErrorProps {
  error: unknown;
  /** Re-runs the failed query. */
  onRetry?: () => void;
  isRetrying?: boolean;
  compact?: boolean;
  className?: string;
}

/**
 * Inline failure state for a panel whose data could not load.
 *
 * The icon and copy follow the *kind* of failure, because "no network" and
 * "not allowed" need completely different responses from the user — and
 * retry is pointless for the latter.
 */
export const ApiError = ({
  error,
  onRetry,
  isRetrying = false,
  compact = false,
  className,
}: ApiErrorProps) => {
  const normalized = normalizeError(error);

  const { icon, title } = normalized.isNetworkError
    ? { icon: WifiOff, title: 'No connection' }
    : normalized.isForbidden
      ? { icon: Lock, title: 'You do not have access to this' }
      : normalized.isNotFound
        ? { icon: SearchX, title: 'Not found' }
        : { icon: ServerCrash, title: 'Could not load this' };

  // Retrying a 403 or 404 will fail identically — do not offer it.
  const canRetry = onRetry && !normalized.isForbidden && !normalized.isNotFound;

  return (
    <EmptyState
      icon={icon}
      title={title}
      description={normalized.message}
      compact={compact}
      className={className}
      action={
        canRetry ? (
          <Button size="sm" onClick={onRetry} loading={isRetrying} className="gap-2">
            <RotateCw className="h-4 w-4" />
            Try again
          </Button>
        ) : undefined
      }
    />
  );
};

ApiError.displayName = 'ApiError';
