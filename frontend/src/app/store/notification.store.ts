import { create } from 'zustand';

interface NotificationState {
  /** Ids dismissed in this session, hidden until the next reload. */
  dismissed: string[];
  /** Last time the bell popover was opened — drives the "new since" divider. */
  lastSeenAt: string | null;

  dismiss: (id: string) => void;
  restore: (id: string) => void;
  markSeen: () => void;
  reset: () => void;
}

/**
 * Ephemeral notification UI state.
 *
 * Read/unread lives on the server; this only tracks what the user has
 * waved away in the current session, so it is intentionally not persisted.
 */
export const useNotificationStore = create<NotificationState>((set) => ({
  dismissed: [],
  lastSeenAt: null,

  dismiss: (id) =>
    set((state) =>
      state.dismissed.includes(id) ? state : { dismissed: [...state.dismissed, id] }
    ),

  restore: (id) =>
    set((state) => ({ dismissed: state.dismissed.filter((value) => value !== id) })),

  markSeen: () => set({ lastSeenAt: new Date().toISOString() }),

  reset: () => set({ dismissed: [], lastSeenAt: null }),
}));
