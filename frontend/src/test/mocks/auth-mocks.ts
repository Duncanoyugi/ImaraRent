import { vi } from 'vitest';
import { buildOwner } from '../fixtures/user.fixture';
import type { User } from '@/types/user.types';

/** Stand-in for the value provided by `AuthProvider`. */
export const mockAuthValue = (user: User | null = buildOwner()) => ({
  user,
  isAuthenticated: !!user,
  isLoading: false,
  login: vi.fn(),
  logout: vi.fn(),
  refreshUser: vi.fn().mockResolvedValue(undefined),
});

/**
 * Replaces `useAuth` across the app. Call at module scope, before the
 * component under test is imported, so the mock is in place when it binds.
 */
export const mockUseAuth = (user: User | null = buildOwner()) => {
  const value = mockAuthValue(user);
  vi.mock('@/features/auth/hooks/use-auth', () => ({ useAuth: () => value }));
  return value;
};

export const seedAuthStorage = (user: User = buildOwner()) => {
  localStorage.setItem('imararent_access_token', 'test-access-token');
  localStorage.setItem('imararent_refresh_token', 'test-refresh-token');
  localStorage.setItem('imararent_user', JSON.stringify(user));
};
