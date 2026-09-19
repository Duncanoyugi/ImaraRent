import { showToast } from '@/app/providers/toast-provider';

/**
 * Hook-shaped access to the toast helpers, so components can call
 * `const toast = useToast()` without importing the provider module directly.
 */
export const useToast = () => showToast;

export type Toast = typeof showToast;
