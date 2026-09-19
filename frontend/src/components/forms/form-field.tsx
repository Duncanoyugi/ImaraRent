import * as React from 'react';
import { FormLabel } from './form-label';
import { FormError } from './form-error';
import { cn } from '@/lib/utils';

export interface FormFieldProps {
  label: React.ReactNode;
  /** Passed to the label's `htmlFor` and the control's `id`. */
  htmlFor?: string;
  required?: boolean;
  hint?: React.ReactNode;
  /** Guidance shown under the control when there is no error. */
  description?: React.ReactNode;
  error?: string | { message?: string } | null;
  className?: string;
  children: React.ReactNode;
}

/**
 * Label + control + help/error, wired up for accessibility.
 *
 * The control is cloned so `id`, `aria-invalid` and `aria-describedby` are
 * applied without every form having to thread them through by hand.
 */
export const FormField = ({
  label,
  htmlFor,
  required,
  hint,
  description,
  error,
  className,
  children,
}: FormFieldProps) => {
  const generated = React.useId();
  const id = htmlFor ?? generated;
  const errorId = `${id}-error`;
  const descriptionId = `${id}-description`;

  const message = typeof error === 'string' ? error : error?.message;
  const describedBy = message ? errorId : description ? descriptionId : undefined;

  const control = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
        id,
        'aria-invalid': message ? true : undefined,
        'aria-describedby': describedBy,
      })
    : children;

  return (
    <div className={cn('space-y-1.5', className)}>
      <FormLabel htmlFor={id} required={required} hint={hint}>
        {label}
      </FormLabel>

      {control}

      {message ? (
        <FormError id={errorId} message={message} />
      ) : description ? (
        <p id={descriptionId} className="text-xs text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
      ) : null}
    </div>
  );
};

FormField.displayName = 'FormField';
