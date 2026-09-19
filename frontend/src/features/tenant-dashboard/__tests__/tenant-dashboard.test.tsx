import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/utils/render-with-providers';
import { InvoiceLineItem } from '@/features/billing/components/invoice-line-item';
import { money } from '@/utils/currency-formatter';
import { duePhrase } from '@/utils/date-formatter';
import type { InvoiceLine } from '@/types/invoice.types';

const line = (overrides: Partial<InvoiceLine> = {}): InvoiceLine => ({
  id: 'line-1',
  description: 'Rent for September 2026',
  amount: 35000,
  type: 'RENT',
  createdAt: '2026-09-01T00:00:00.000Z',
  invoiceId: 'invoice-1',
  ...overrides,
});

describe('what a tenant sees on an invoice', () => {
  it('shows a charge as a positive amount', () => {
    renderWithProviders(<InvoiceLineItem line={line()} />);
    expect(screen.getByText('Rent for September 2026')).toBeInTheDocument();
    expect(screen.getByText(/35,000\.00/)).toBeInTheDocument();
    expect(screen.queryByText(/^-/)).not.toBeInTheDocument();
  });

  it('shows a discount as a credit, so the column sums visually', () => {
    renderWithProviders(
      <InvoiceLineItem line={line({ id: 'line-2', type: 'DISCOUNT', description: 'Goodwill', amount: 5000 })} />
    );
    expect(screen.getByText(/^-/)).toBeInTheDocument();
  });

  it('labels the charge type separately from its description', () => {
    renderWithProviders(
      <InvoiceLineItem line={line({ type: 'LATE_FEE', description: 'Charge for paying late' })} />
    );
    expect(screen.getByText('Charge for paying late')).toBeInTheDocument();
    // The badge humanises the enum independently of the description.
    expect(screen.getByText('Late fee')).toBeInTheDocument();
  });
});

describe('balance messaging', () => {
  it('formats a balance in shillings', () => {
    expect(money(47000)).toContain('47,000');
  });

  it('tells a tenant plainly when rent is late', () => {
    const past = new Date();
    past.setDate(past.getDate() - 4);
    expect(duePhrase(past.toISOString())).toBe('Overdue by 4 days');
  });

  it('says "due today" on the due date itself', () => {
    expect(duePhrase(new Date().toISOString())).toBe('Due today');
  });
});
