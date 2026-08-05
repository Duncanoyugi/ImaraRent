import { type ReactNode } from 'react';
import { Toaster, toast } from 'sonner';

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        expand={false}
        richColors
        closeButton
        toastOptions={{
          duration: 4000,
          className: 'font-sans',
          style: {
            borderRadius: '0.5rem',
            padding: '1rem',
          },
        }}
      />
    </>
  );
};

const promiseToast = <T,>(promise: Promise<T>, messages: {
    loading: string;
    success: string;
    error: string;
  }) => {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: (err: Error) => err?.message || messages.error,
    });
  };

// Toast helper functions
export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
    });
  },

  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
    });
  },

  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description,
    });
  },

  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
    });
  },

  loading: (message: string) => {
    return toast.loading(message);
  },

  promise: promiseToast,

  dismiss: (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  },
};