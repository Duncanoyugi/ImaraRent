import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const alertVariants = cva(
  'relative flex w-full gap-3 rounded-xl border p-4 text-sm',
  {
    variants: {
      variant: {
        default:
          'border-neutral-200 bg-white text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100',
        info: 'border-info-200 bg-info-50 text-info-900 dark:border-info-800 dark:bg-info-900/30 dark:text-info-100',
        success:
          'border-success-200 bg-success-50 text-success-900 dark:border-success-800 dark:bg-success-900/30 dark:text-success-100',
        warning:
          'border-warning-200 bg-warning-50 text-warning-900 dark:border-warning-800 dark:bg-warning-900/30 dark:text-warning-100',
        error:
          'border-error-200 bg-error-50 text-error-900 dark:border-error-800 dark:bg-error-900/30 dark:text-error-100',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

const ICONS = {
  default: Info,
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  error: AlertCircle,
} as const;

const ICON_TONE = {
  default: 'text-neutral-500',
  info: 'text-info-600 dark:text-info-400',
  success: 'text-success-600 dark:text-success-400',
  warning: 'text-warning-600 dark:text-warning-400',
  error: 'text-error-600 dark:text-error-400',
} as const;

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  /** Set false for a text-only alert (e.g. inside a dense form). */
  icon?: boolean;
  onDismiss?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', icon = true, onDismiss, children, ...props }, ref) => {
    const tone = variant ?? 'default';
    const Icon = ICONS[tone];

    return (
      <div
        ref={ref}
        role={tone === 'error' ? 'alert' : 'status'}
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {icon && <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', ICON_TONE[tone])} />}
        <div className="min-w-0 flex-1">{children}</div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss"
            className="-m-1 shrink-0 rounded-md p-1 opacity-60 transition hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn('mb-0.5 font-semibold leading-tight', className)} {...props} />
  )
);
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-sm leading-relaxed opacity-90', className)} {...props} />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription, alertVariants };
