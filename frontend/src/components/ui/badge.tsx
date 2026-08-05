import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100',
        success:
          'border-transparent bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-300',
        warning:
          'border-transparent bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-300',
        error:
          'border-transparent bg-error-100 text-error-700 dark:bg-error-900 dark:text-error-300',
        info:
          'border-transparent bg-info-100 text-info-700 dark:bg-info-900 dark:text-info-300',
        brand:
          'border-transparent bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300',
        outline: 'border border-neutral-200 dark:border-neutral-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };