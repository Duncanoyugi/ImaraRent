import { AlertTriangle, Home, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { env } from '@/config/env';

export interface ErrorFallbackProps {
  error?: Error | null;
  /** Provided by the error boundary to re-mount the failed subtree. */
  resetError?: () => void;
  title?: string;
  description?: string;
}

/**
 * What a user sees when a render throws.
 *
 * The stack is shown in development only — in production it would leak
 * internals and tells the user nothing they can act on.
 */
export const ErrorFallback = ({
  error,
  resetError,
  title = 'Something went wrong',
  description = 'The page ran into an unexpected problem. Trying again usually clears it.',
}: ErrorFallbackProps) => (
  <div className="flex min-h-[60vh] items-center justify-center p-6">
    <div className="w-full max-w-md text-center">
      <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-error-50 text-error-600 dark:bg-error-900/30 dark:text-error-400">
        <AlertTriangle className="h-7 w-7" />
      </span>

      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">{title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
        {description}
      </p>

      {env.IS_DEV && error && (
        <pre className="mt-4 max-h-48 overflow-auto rounded-lg bg-neutral-100 p-3 text-left text-xs text-error-700 dark:bg-neutral-800 dark:text-error-300">
          {error.message}
          {error.stack ? `\n\n${error.stack}` : ''}
        </pre>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {resetError && (
          <Button onClick={resetError} className="gap-2">
            <RotateCw className="h-4 w-4" />
            Try again
          </Button>
        )}
        <Button variant="outline" asChild className="gap-2">
          <a href="/dashboard">
            <Home className="h-4 w-4" />
            Back to dashboard
          </a>
        </Button>
      </div>
    </div>
  </div>
);

ErrorFallback.displayName = 'ErrorFallback';
