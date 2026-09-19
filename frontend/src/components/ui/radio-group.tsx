import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cn } from '@/lib/utils';

const RadioGroup = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root ref={ref} className={cn('grid gap-2', className)} {...props} />
));
RadioGroup.displayName = 'RadioGroup';

const RadioGroupItem = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      'aspect-square h-4.5 w-4.5 rounded-full border border-neutral-300 text-brand-600 transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:border-brand-600 dark:border-neutral-600',
      className
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <span className="h-2 w-2 rounded-full bg-brand-600" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = 'RadioGroupItem';

export interface RadioCardProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  label: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
}

/**
 * Large tappable option used for payment-method and report-format choices,
 * where a bare radio would be too small a target on mobile.
 */
const RadioCard = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Item>,
  RadioCardProps
>(({ label, description, icon, className, id, ...props }, ref) => {
  const generated = React.useId();
  const inputId = id ?? generated;

  return (
    <label
      htmlFor={inputId}
      className={cn(
        'flex cursor-pointer items-start gap-3 rounded-xl border border-neutral-200 p-4 transition-all',
        'hover:border-brand-300 hover:bg-brand-50/50',
        'has-[button[data-state=checked]]:border-brand-500 has-[button[data-state=checked]]:bg-brand-50 has-[button[data-state=checked]]:ring-1 has-[button[data-state=checked]]:ring-brand-500',
        'dark:border-neutral-800 dark:hover:bg-neutral-800/50 dark:has-[button[data-state=checked]]:bg-brand-900/20',
        className
      )}
    >
      <RadioGroupItem ref={ref} id={inputId} className="mt-0.5" {...props} />
      {icon && <span className="mt-0.5 shrink-0 text-brand-600 dark:text-brand-400">{icon}</span>}
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-neutral-900 dark:text-neutral-100">
          {label}
        </span>
        {description && (
          <span className="mt-0.5 block text-xs text-neutral-500 dark:text-neutral-400">
            {description}
          </span>
        )}
      </span>
    </label>
  );
});
RadioCard.displayName = 'RadioCard';

export { RadioGroup, RadioGroupItem, RadioCard };
