import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Opinionated wrapper over the dialog primitive.
 *
 * `dialog.tsx` exposes the unstyled parts; `Modal` is the composed shape used
 * by feature code — title, optional description, scrollable body, footer —
 * so every modal in the app has the same anatomy and sizing.
 */

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

const SIZES: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[calc(100vw-2rem)]',
};

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  /** Set false for destructive flows that must be dismissed with a button. */
  dismissible?: boolean;
  className?: string;
}

export const Modal = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = 'md',
  dismissible = true,
  className,
}: ModalProps) => (
  <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={cn(
          'fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-sm',
          'data-[state=open]:animate-in data-[state=open]:fade-in-0',
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0'
        )}
      />
      <DialogPrimitive.Content
        onEscapeKeyDown={(e) => !dismissible && e.preventDefault()}
        onInteractOutside={(e) => !dismissible && e.preventDefault()}
        className={cn(
          'fixed left-1/2 top-1/2 z-50 flex w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col',
          'max-h-[calc(100vh-4rem)] rounded-2xl border border-neutral-200 bg-white shadow-2xl',
          'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          'dark:border-neutral-800 dark:bg-neutral-900',
          SIZES[size],
          className
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
          <div className="min-w-0">
            <DialogPrimitive.Title className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
              {title}
            </DialogPrimitive.Title>
            {description && (
              <DialogPrimitive.Description className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                {description}
              </DialogPrimitive.Description>
            )}
          </div>
          {dismissible && (
            <DialogPrimitive.Close
              aria-label="Close"
              className="-m-1.5 shrink-0 rounded-lg p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
            >
              <X className="h-4 w-4" />
            </DialogPrimitive.Close>
          )}
        </div>

        {children && <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>}

        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-neutral-200 px-6 py-4 dark:border-neutral-800">
            {footer}
          </div>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  </DialogPrimitive.Root>
);

Modal.displayName = 'Modal';
