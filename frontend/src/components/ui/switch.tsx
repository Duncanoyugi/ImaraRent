import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';

const Switch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:bg-brand-600 data-[state=unchecked]:bg-neutral-300 dark:data-[state=unchecked]:bg-neutral-700',
      className
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        'pointer-events-none block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform',
        'data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0'
      )}
    />
  </SwitchPrimitive.Root>
));
Switch.displayName = 'Switch';

export interface SwitchFieldProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  label: React.ReactNode;
  description?: React.ReactNode;
}

/** A labelled setting row — the shape used throughout Settings. */
const SwitchField = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitive.Root>,
  SwitchFieldProps
>(({ label, description, className, id, ...props }, ref) => {
  const generated = React.useId();
  const inputId = id ?? generated;

  return (
    <div className={cn('flex items-start justify-between gap-4 py-3', className)}>
      <div className="min-w-0">
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
      <Switch ref={ref} id={inputId} className="mt-0.5" {...props} />
    </div>
  );
});
SwitchField.displayName = 'SwitchField';

export { Switch, SwitchField };
