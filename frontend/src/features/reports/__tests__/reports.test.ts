import { describe, expect, it } from 'vitest';
import { reportRequestSchema } from '../schemas/report.schemas';
import { currentMonthBounds } from '@/utils/date-formatter';
import { percentage, average, percentChange } from '@/utils/number-helpers';

describe('report request validation', () => {
  it('accepts a preset period without explicit dates', () => {
    expect(reportRequestSchema.safeParse({ period: 'CURRENT_MONTH' }).success).toBe(true);
  });

  it('requires both dates when the period is custom', () => {
    const result = reportRequestSchema.safeParse({ period: 'CUSTOM' });
    expect(result.success).toBe(false);
  });

  it('accepts a custom period with a complete range', () => {
    const result = reportRequestSchema.safeParse({
      period: 'CUSTOM',
      startDate: '2026-01-01',
      endDate: '2026-03-31',
    });
    expect(result.success).toBe(true);
  });

  it('rejects a range that ends before it starts', () => {
    const result = reportRequestSchema.safeParse({
      period: 'CUSTOM',
      startDate: '2026-03-31',
      endDate: '2026-01-01',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an unknown period', () => {
    expect(reportRequestSchema.safeParse({ period: 'LAST_DECADE' }).success).toBe(false);
  });
});

describe('report arithmetic', () => {
  it('bounds the current month', () => {
    const { startDate, endDate } = currentMonthBounds();
    expect(new Date(startDate).getTime()).toBeLessThan(new Date(endDate).getTime());
    expect(new Date(startDate).getDate()).toBe(1);
  });

  it('computes collection rate safely', () => {
    expect(percentage(85_000, 100_000, 0)).toBe(85);
    expect(percentage(0, 0, 0)).toBe(0);
  });

  it('averages a set of figures', () => {
    expect(average([10_000, 20_000, 30_000])).toBe(20000);
    expect(average([])).toBe(0);
  });

  it('computes period-over-period change, including from zero', () => {
    expect(percentChange(120, 100)).toBe(20);
    expect(percentChange(80, 100)).toBe(-20);
    expect(percentChange(50, 0)).toBe(100);
    expect(percentChange(0, 0)).toBe(0);
  });
});
