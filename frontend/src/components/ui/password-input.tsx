import * as React from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, error, label, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className="w-full">
        {label && (
          <label
            className={cn(
              'block text-sm font-medium text-neutral-700 dark:text-neutral-300',
              'mb-1.5'
            )}
            htmlFor={props.id}
          >
            {label}
          </label>
        )}
        <input
          {...props}
          type={showPassword ? 'text' : 'password'}
          className={cn(
            'flex h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 ring-offset-white transition-all duration-200',
            'placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:ring-offset-neutral-900 dark:placeholder:text-neutral-400',
            error && 'border-error-500 focus-visible:ring-error-500',
            className
          )}
          ref={ref}
        />
        <button
          type="button"
          onClick={() => setShowPassword((visible) => !visible)}
          aria-pressed={showPassword}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 transition-colors hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:text-neutral-400 dark:hover:text-neutral-200 dark:ring-offset-neutral-900"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
          {showPassword ? 'Hide password' : 'Show password'}
        </button>
        {error && <p className="mt-1 text-sm text-error-500">{error}</p>}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
