import { describe, expect, it } from 'vitest';
import { decimal, sumBy, percentage } from '@/utils/number-helpers';
import { money, moneyExact, parseAmount } from '@/utils/currency-formatter';
import { daysUntil, duePhrase } from '@/utils/date-formatter';
import { buildInvoice, buildOverdueInvoice } from '@/test/fixtures/invoice.fixture';

describe('money handling', () => {
  it('coerces the strings Prisma sends for Decimal columns', () => {
    // A regression guard: treating "35000.00" as a number by accident
    // produces NaN once it reaches arithmetic.
    expect(decimal('35000.00')).toBe(35000);
    expect(decimal(35000)).toBe(35000);
    expect(decimal(null)).toBe(0);
    expect(decimal(undefined)).toBe(0);
    expect(decimal('not a number')).toBe(0);
  });

  it('formats amounts as Kenyan Shillings', () => {
    expect(money(35000)).toContain('35,000');
    expect(moneyExact(1234.5)).toContain('1,234.50');
  });

  it('parses an amount back out of formatted input', () => {
    expect(parseAmount('KSh 35,000')).toBe(35000);
    expect(parseAmount('35000')).toBe(35000);
  });

  it('never divides by zero when computing a collection rate', () => {
    expect(percentage(0, 0)).toBe(0);
    expect(percentage(50, 200)).toBe(25);
  });
});

describe('invoice arithmetic', () => {
  it('totals balances across a set of invoices', () => {
    const invoices = [
      buildInvoice({ balance: 35000 }),
      buildInvoice({ id: 'invoice-2', balance: 12000 }),
      buildInvoice({ id: 'invoice-3', balance: 0 }),
    ];
    expect(sumBy(invoices, (invoice) => invoice.balance)).toBe(47000);
  });

  it('reports an overdue invoice as past due', () => {
    const invoice = buildOverdueInvoice(10);
    const days = daysUntil(invoice.dueDate);
    expect(days).not.toBeNull();
    expect(days!).toBeLessThan(0);
    expect(duePhrase(invoice.dueDate)).toBe('Overdue by 10 days');
  });

  it('phrases a due date that has not arrived yet', () => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 3);
    expect(duePhrase(dueDate.toISOString())).toBe('Due in 3 days');
  });

  it('singularises correctly at one day', () => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 1);
    expect(duePhrase(dueDate.toISOString())).toBe('Due in 1 day');
  });
});
