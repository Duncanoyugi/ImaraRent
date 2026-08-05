import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { type User, type AuthTokens } from '@/features/auth/types/auth.types';
import { STORAGE_KEYS } from '@/lib/constants';

interface AuthStore {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  setLoading: (isLoading: boolean) => void;
  login: (user: User, tokens: AuthTokens) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },

      setTokens: (tokens: AuthTokens | null) => {
        set({ tokens });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      login: (user: User, tokens: AuthTokens) => {
        set({
          user,
          tokens,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },
    }),
    {
      name: STORAGE_KEYS.USER,
      storage: createJSONStorage(() => localStorage),
      partialize: (state: AuthStore) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);