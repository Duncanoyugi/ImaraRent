/**
 * sessionStorage twin of `lib/storage/local-storage`.
 *
 * Used for state that must not outlive the tab: in-flight M-Pesa checkout
 * ids, the post-login redirect target, and unsaved multi-step form drafts.
 */
export const sessionStorage_ = {
  get: <T>(key: string): T | null => {
    try {
      const item = window.sessionStorage.getItem(key);
      if (!item) return null;
      try {
        return JSON.parse(item) as T;
      } catch {
        return item as T;
      }
    } catch {
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      window.sessionStorage.setItem(
        key,
        typeof value === 'string' ? value : JSON.stringify(value)
      );
    } catch {
      /* private mode or quota exceeded — non-critical by design */
    }
  },

  remove: (key: string): void => {
    try {
      window.sessionStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },

  clear: (): void => {
    try {
      window.sessionStorage.clear();
    } catch {
      /* ignore */
    }
  },
};

export { sessionStorage_ as sessionStore };

export const SESSION_KEYS = {
  REDIRECT_AFTER_LOGIN: 'redirectAfterLogin',
  MPESA_CHECKOUT: 'mpesaCheckout',
  FORM_DRAFT: 'formDraft',
} as const;
