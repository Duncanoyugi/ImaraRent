import { describe, expect, it } from 'vitest';
import { fullName, initials, maskEmail } from '@/utils/string-helpers';
import { isNationalId, isValidRange } from '@/utils/validators';
import { buildTenant } from '@/test/fixtures/user.fixture';

describe('tenant identity display', () => {
  it('joins names and falls back when both are missing', () => {
    expect(fullName('Grace', 'Njeri')).toBe('Grace Njeri');
    expect(fullName('Grace', null)).toBe('Grace');
    expect(fullName(null, null)).toBe('Unknown');
    expect(fullName(null, null, 'No tenant')).toBe('No tenant');
  });

  it('builds avatar initials, never returning an empty string', () => {
    expect(initials('Grace', 'Njeri')).toBe('GN');
    expect(initials('Grace')).toBe('G');
    expect(initials()).toBe('U');
  });

  it('masks an email without losing the domain', () => {
    const masked = maskEmail('grace@example.co.ke');
    expect(masked.startsWith('gr')).toBe(true);
    expect(masked.endsWith('@example.co.ke')).toBe(true);
    expect(masked).not.toContain('grace@');
  });
});

describe('tenant record validation', () => {
  it('accepts Kenyan national ID lengths', () => {
    expect(isNationalId('12345678')).toBe(true);
    expect(isNationalId('1234567')).toBe(true);
    expect(isNationalId('123456')).toBe(false);
    expect(isNationalId('12345678901')).toBe(false);
  });

  it('rejects a lease range that ends before it starts', () => {
    expect(isValidRange('2026-01-01', '2026-12-31')).toBe(true);
    expect(isValidRange('2026-12-31', '2026-01-01')).toBe(false);
  });

  it('treats an open-ended range as valid', () => {
    expect(isValidRange('2026-01-01', null)).toBe(true);
    expect(isValidRange(null, null)).toBe(true);
  });

  it('builds a tenant fixture in the TENANT role', () => {
    expect(buildTenant().role).toBe('TENANT');
  });
});
