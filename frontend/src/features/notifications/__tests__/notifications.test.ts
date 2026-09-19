import { describe, expect, it } from 'vitest';
import { NOTIFICATION_TYPE_LABELS } from '@/types/notification.types';
import { relativeTime } from '@/utils/date-formatter';
import type { AppNotification, NotificationType } from '../types/notification.types';

const build = (overrides: Partial<AppNotification> = {}): AppNotification => ({
  id: 'notification-1',
  type: 'RENT_DUE',
  channel: 'IN_APP',
  recipient: 'grace@example.co.ke',
  subject: 'Rent is due',
  content: 'Your rent for September is due on the 5th.',
  status: 'SENT',
  sentAt: '2026-09-01T06:00:00.000Z',
  error: null,
  retryCount: 0,
  createdAt: '2026-09-01T06:00:00.000Z',
  tenantId: 'tenant-1',
  userId: null,
  read: false,
  ...overrides,
});

describe('notification types', () => {
  it('has a human label for every type the API can send', () => {
    const types: NotificationType[] = [
      'TENANT_INVITATION',
      'RENT_DUE',
      'PAYMENT_RECEIVED',
      'LEASE_EXPIRING',
      'MAINTENANCE_UPDATE',
      'ANNOUNCEMENT',
    ];
    types.forEach((type) => {
      expect(NOTIFICATION_TYPE_LABELS[type]).toBeTruthy();
    });
  });
});

describe('unread derivation for staff', () => {
  /**
   * The staff delivery log has no read column, so "unread" means recent and
   * not explicitly marked. This mirrors the logic in use-unread-count.
   */
  const countUnread = (items: AppNotification[]) => {
    const cutoff = Date.now() - 30 * 86_400_000;
    return items.filter((n) => !n.read && new Date(n.createdAt).getTime() > cutoff).length;
  };

  it('counts recent unread items', () => {
    const now = new Date().toISOString();
    expect(countUnread([build({ createdAt: now }), build({ id: 'n2', createdAt: now })])).toBe(2);
  });

  it('ignores items already read', () => {
    const now = new Date().toISOString();
    expect(countUnread([build({ createdAt: now, read: true })])).toBe(0);
  });

  it('ignores anything older than thirty days', () => {
    const old = new Date();
    old.setDate(old.getDate() - 45);
    expect(countUnread([build({ createdAt: old.toISOString() })])).toBe(0);
  });
});

describe('timestamps', () => {
  it('describes a recent notification relatively', () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60_000).toISOString();
    expect(relativeTime(fiveMinutesAgo)).toBe('5 minutes ago');
  });

  it('collapses the last minute to "just now"', () => {
    expect(relativeTime(new Date().toISOString())).toBe('Just now');
  });

  it('falls back to a date for anything older than a month', () => {
    const old = new Date();
    old.setDate(old.getDate() - 90);
    expect(relativeTime(old.toISOString())).toMatch(/\d{4}/);
  });

  it('returns an empty string for a missing timestamp', () => {
    expect(relativeTime(null)).toBe('');
  });
});
