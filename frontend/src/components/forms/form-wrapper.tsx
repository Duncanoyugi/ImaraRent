import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

export interface FormWrapperProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  /** Form-level failure, shown above the fields where it will be seen. */
  error?: string | null;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  isSubmitting?: boolean;
  /** Disables submit until something has actually changed. */
  isDirty?: boolean;
  requireDirty?: boolean;
  footer?: React.ReactNode;
  className?: string;
}

/**
 * Standard form shell: error banner, fields, then a consistent action row.
 *
 * `noValidate` is set deliberately — Zod owns validation, and the native
 * browser bubbles would compete with our own messages.
 */
export const FormWrapper = ({
  onSubmit,
  children,
  error,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  onCancel,
  isSubmitting = false,
  isDirty = true,
  requireDirty = false,
  footer,
  className,
}: FormWrapperProps) => (
  <form onSubmit={onSubmit} noValidate className={cn('space-y-5', className)}>
    {error && (
      <Alert variant="error">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )}

    {children}

    <div className="flex flex-wrap items-center justify-end gap-2 border-t border-neutral-200 pt-4 dark:border-neutral-800">
      {footer && <div className="mr-auto">{footer}</div>}

      {onCancel && (
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          {cancelLabel}
        </Button>
      )}

      <Button type="submit" loading={isSubmitting} disabled={requireDirty && !isDirty}>
        {submitLabel}
      </Button>
    </div>
  </form>
);

FormWrapper.displayName = 'FormWrapper';
