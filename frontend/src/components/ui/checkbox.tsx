import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-4.5 w-4.5 shrink-0 rounded border border-neutral-300 bg-white transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:border-brand-600 data-[state=checked]:bg-brand-600 data-[state=checked]:text-white',
      'data-[state=indeterminate]:border-brand-600 data-[state=indeterminate]:bg-brand-600 data-[state=indeterminate]:text-white',
      'dark:border-neutral-600 dark:bg-neutral-900',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      {props.checked === 'indeterminate' ? (
        <Minus className="h-3 w-3" strokeWidth={3} />
      ) : (
        <Check className="h-3 w-3" strokeWidth={3} />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = 'Checkbox';

export interface CheckboxFieldProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label: React.ReactNode;
  description?: React.ReactNode;
}

/** Checkbox plus its label, wired together with a generated id. */
const CheckboxField = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  CheckboxFieldProps
>(({ label, description, className, id, ...props }, ref) => {
  const generated = React.useId();
  const inputId = id ?? generated;

  return (
    <div className={cn('flex items-start gap-3', className)}>
      <Checkbox ref={ref} id={inputId} className="mt-0.5" {...props} />
      <div className="min-w-0 leading-tight">
        <label
          htmlFor={inputId}
          className="cursor-pointer text-sm font-medium text-neutral-900 dark:text-neutral-100"
        >
          {label}
        </label>
        {description && (
          <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">{description}</p>
        )}
      </div>
    </div>
  );
});
CheckboxField.displayName = 'CheckboxField';

export { Checkbox, CheckboxField };
