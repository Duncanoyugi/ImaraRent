import * as React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface FormLabelProps extends React.ComponentPropsWithoutRef<typeof Label> {
  required?: boolean;
  /** Shown to the right of the label, e.g. "Optional" or a unit hint. */
  hint?: React.ReactNode;
}

export const FormLabel = React.forwardRef<
  React.ComponentRef<typeof Label>,
  FormLabelProps
>(({ className, children, required, hint, ...props }, ref) => (
  <div className="flex items-baseline justify-between gap-2">
    <Label ref={ref} className={cn('text-sm font-medium', className)} {...props}>
      {children}
      {required && (
        <span className="ml-0.5 text-error-500" aria-hidden="true">
          *
        </span>
      )}
    </Label>
    {hint && <span className="text-xs text-neutral-400">{hint}</span>}
  </div>
));
FormLabel.displayName = 'FormLabel';
