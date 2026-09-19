import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FormErrorProps {
  /** Accepts react-hook-form's error object or a plain string. */
  message?: string | { message?: string } | null;
  id?: string;
  className?: string;
  icon?: boolean;
}

/**
 * Field-level error text. Renders nothing when there is no message, so it can
 * be left mounted unconditionally without reserving space.
 */
export const FormError = ({ message, id, className, icon = false }: FormErrorProps) => {
  const text = typeof message === 'string' ? message : message?.message;
  if (!text) return null;

  return (
    <p
      id={id}
      role="alert"
      className={cn('flex items-start gap-1 text-xs text-error-600 dark:text-error-400', className)}
    >
      {icon && <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />}
      {text}
    </p>
  );
};

FormError.displayName = 'FormError';
