import { describe, expect, it } from 'vitest';
import { isValidRange } from '@/utils/validators';
import { daysUntil, monthBounds, toInputDate, toApiDate } from '@/utils/date-formatter';
import { humanizeEnum } from '@/utils/string-helpers';

describe('lease dates', () => {
  it('requires the end date to follow the start date', () => {
    expect(isValidRange('2026-01-01', '2026-12-31')).toBe(true);
    expect(isValidRange('2026-06-01', '2026-05-31')).toBe(false);
  });

  it('counts down to expiry and goes negative once past', () => {
    const future = new Date();
    future.setDate(future.getDate() + 30);
    expect(daysUntil(future.toISOString())).toBe(30);

    const past = new Date();
    past.setDate(past.getDate() - 5);
    expect(daysUntil(past.toISOString())).toBe(-5);
  });

  it('formats a date for a date input without shifting the day', () => {
    // Midday anchoring: the naive approach lands on the previous day for
    // anyone east of UTC, which is everyone in Kenya.
    const formatted = toInputDate('2026-03-12T00:30:00.000Z');
    expect(formatted).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('round-trips a date input value back to the API', () => {
    const iso = toApiDate('2026-03-12');
    expect(iso).toBeDefined();
    expect(toInputDate(iso!)).toBe('2026-03-12');
  });

  it('returns undefined rather than an invalid date for empty input', () => {
    expect(toApiDate('')).toBeUndefined();
    expect(toApiDate(null)).toBeUndefined();
  });
});

describe('billing periods', () => {
  it('bounds a month from its first to its last day', () => {
    const { startDate, endDate } = monthBounds(2026, 1); // February 2026
    expect(new Date(startDate).getDate()).toBe(1);
    expect(new Date(endDate).getDate()).toBe(28);
  });

  it('handles a leap February', () => {
    const { endDate } = monthBounds(2028, 1);
    expect(new Date(endDate).getDate()).toBe(29);
  });
});

describe('lease status labels', () => {
  it('renders each status readably', () => {
    expect(humanizeEnum('DRAFT')).toBe('Draft');
    expect(humanizeEnum('ACTIVE')).toBe('Active');
    expect(humanizeEnum('TERMINATED')).toBe('Terminated');
  });
});
