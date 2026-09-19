import { describe, expect, it } from 'vitest';
import { percentage, sumBy, decimal } from '@/utils/number-helpers';
import { daysUntil } from '@/utils/date-formatter';
import { buildPortfolio } from '@/test/mocks/data-mocks';
import { buildOverdueInvoice, buildInvoice } from '@/test/fixtures/invoice.fixture';

const UNPAID = new Set(['PENDING', 'PARTIALLY_PAID', 'OVERDUE']);

/**
 * The dashboards derive every headline figure client-side from the collection
 * endpoints. These cover that arithmetic directly, since a wrong number here
 * is both invisible and consequential.
 */
describe('dashboard aggregation', () => {
  it('derives occupancy from unit statuses', () => {
    const { units } = buildPortfolio();
    const occupied = units.filter((u) => u.status === 'OCCUPIED').length;
    expect(percentage(occupied, units.length, 0)).toBe(75);
  });

  it('counts only unpaid invoices toward money owed', () => {
    const { invoices } = buildPortfolio();
    const unpaid = invoices.filter((invoice) => UNPAID.has(invoice.status));
    expect(unpaid).toHaveLength(2);
    expect(sumBy(unpaid, (invoice) => invoice.balance)).toBe(70000);
  });

  it('classes an invoice as overdue only once its due date has passed', () => {
    const overdue = buildOverdueInvoice(3);
    expect(daysUntil(overdue.dueDate)!).toBeLessThan(0);

    const future = new Date();
    future.setDate(future.getDate() + 7);
    const upcoming = buildInvoice({ dueDate: future.toISOString() });
    expect(daysUntil(upcoming.dueDate)!).toBeGreaterThan(0);
  });

  it('shows an empty portfolio as zeros rather than NaN', () => {
    expect(percentage(0, 0, 0)).toBe(0);
    expect(sumBy([], (x: unknown) => x)).toBe(0);
    expect(decimal(undefined)).toBe(0);
  });
});
