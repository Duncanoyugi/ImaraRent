import type { Invoice } from '@/types/invoice.types';
import type { Payment } from '@/types/payment.types';

export const buildInvoice = (overrides: Partial<Invoice> = {}): Invoice =>
  ({
    id: 'invoice-1',
    invoiceNumber: 'INV-2026-0001',
    issueDate: '2026-09-01T00:00:00.000Z',
    dueDate: '2026-09-05T00:00:00.000Z',
    totalAmount: 35000,
    paidAmount: 0,
    balance: 35000,
    status: 'PENDING',
    description: 'Rent for September 2026',
    createdAt: '2026-09-01T00:00:00.000Z',
    tenantId: 'tenant-1',
    leaseId: 'lease-1',
    ...overrides,
  }) as Invoice;

export const buildOverdueInvoice = (daysLate = 10, overrides: Partial<Invoice> = {}) => {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() - daysLate);
  return buildInvoice({ status: 'OVERDUE', dueDate: dueDate.toISOString(), ...overrides });
};

export const buildPayment = (overrides: Partial<Payment> = {}): Payment =>
  ({
    id: 'payment-1',
    amount: 35000,
    paymentDate: '2026-09-03T10:15:00.000Z',
    method: 'MPESA',
    status: 'COMPLETED',
    reference: 'SJ34KD9F2L',
    mpesaTransactionId: 'SJ34KD9F2L',
    tenantId: 'tenant-1',
    createdAt: '2026-09-03T10:15:00.000Z',
    ...overrides,
  }) as unknown as Payment;
