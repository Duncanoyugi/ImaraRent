import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react';
import { toast as sonner } from 'sonner';
import { cn } from '@/lib/utils';

/**
 * Toast presentation helpers.
 *
 * `ToastProvider` mounts sonner's `<Toaster>` and exposes `showToast` for the
 * common cases. This module adds the richer shapes — a toast with an action,
 * and the inline notice used where a toast would be missed (e.g. a form the
 * user is already looking at).
 */

type Tone = 'success' | 'error' | 'warning' | 'info';

const TONE_ICON = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: TriangleAlert,
  info: Info,
} as const;

const TONE_STYLE: Record<Tone, string> = {
  success: 'border-success-200 bg-success-50 text-success-900',
  error: 'border-error-200 bg-error-50 text-error-900',
  warning: 'border-warning-200 bg-warning-50 text-warning-900',
  info: 'border-info-200 bg-info-50 text-info-900',
};

const TONE_ICON_STYLE: Record<Tone, string> = {
  success: 'text-success-600',
  error: 'text-error-600',
  warning: 'text-warning-600',
  info: 'text-info-600',
};

export interface ToastActionOptions {
  label: string;
  onClick: () => void;
}

/**
 * Toast with a follow-up action — "Invoice voided · Undo",
 * "Payment recorded · View receipt".
 */
export const toastWithAction = (
  tone: Tone,
  message: string,
  action: ToastActionOptions,
  description?: string
) => {
  const fn = sonner[tone] ?? sonner.message;
  return fn(message, {
    description,
    action: { label: action.label, onClick: action.onClick },
  });
};

/** Blocks until the promise settles, swapping the copy at each stage. */
export const toastPromise = <T,>(
  promise: Promise<T>,
  messages: { loading: string; success: string; error: string }
) =>
  sonner.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: (err: Error) => err?.message || messages.error,
  });

export interface InlineToastProps {
  tone?: Tone;
  title: string;
  description?: React.ReactNode;
  className?: string;
}

/**
 * Static, in-flow equivalent of a toast. Used at the top of forms so a
 * validation failure stays on screen instead of timing out.
 */
export const InlineToast = ({
  tone = 'info',
  title,
  description,
  className,
}: InlineToastProps) => {
  const Icon = TONE_ICON[tone];
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn('flex gap-3 rounded-lg border p-3 text-sm', TONE_STYLE[tone], className)}
    >
      <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', TONE_ICON_STYLE[tone])} />
      <div className="min-w-0">
        <p className="font-medium">{title}</p>
        {description && <p className="mt-0.5 opacity-90">{description}</p>}
      </div>
    </div>
  );
};

InlineToast.displayName = 'InlineToast';

export { sonner as toast };
