import type { User } from '@/types/user.types';

/**
 * Builders, not constants: every fixture takes overrides so a test can state
 * only the field it actually cares about.
 */
export const buildUser = (overrides: Partial<User> = {}): User =>
  ({
    id: 'user-1',
    email: 'amina@example.co.ke',
    firstName: 'Amina',
    lastName: 'Wanjiru',
    phone: '0712345678',
    role: 'OWNER',
    isActive: true,
    organizationId: 'org-1',
    createdAt: '2026-01-15T08:00:00.000Z',
    updatedAt: '2026-01-15T08:00:00.000Z',
    lastLoginAt: '2026-09-01T06:30:00.000Z',
    ...overrides,
  }) as User;

export const buildOwner = (overrides: Partial<User> = {}) =>
  buildUser({ role: 'OWNER', ...overrides });

export const buildManager = (overrides: Partial<User> = {}) =>
  buildUser({
    id: 'user-2',
    email: 'otieno@example.co.ke',
    firstName: 'Brian',
    lastName: 'Otieno',
    role: 'MANAGER',
    ...overrides,
  });

export const buildTenant = (overrides: Partial<User> = {}) =>
  buildUser({
    id: 'user-3',
    email: 'grace@example.co.ke',
    firstName: 'Grace',
    lastName: 'Njeri',
    role: 'TENANT',
    ...overrides,
  });
