import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AppState {
  /** Desktop sidebar collapsed to icons only. */
  sidebarCollapsed: boolean;
  /** Mobile navigation drawer. */
  mobileNavOpen: boolean;
  commandPaletteOpen: boolean;
  /** Preferred rows-per-page, remembered across list screens. */
  tablePageSize: number;

  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setTablePageSize: (size: number) => void;
}

/**
 * UI shell state. Deliberately separate from `auth.store` so clearing the
 * session does not reset someone's layout preferences.
 */
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      mobileNavOpen: false,
      commandPaletteOpen: false,
      tablePageSize: 10,

      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
      setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),
      setTablePageSize: (tablePageSize) => set({ tablePageSize }),
    }),
    {
      name: 'imararent-ui',
      storage: createJSONStorage(() => localStorage),
      // Transient open/closed state must not survive a reload.
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        tablePageSize: state.tablePageSize,
      }),
    }
  )
);
