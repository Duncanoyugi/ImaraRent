import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InvoiceLineItem } from './invoice-line-item';
import { moneyExact } from '@/utils/currency-formatter';
import { shortDate, duePhrase } from '@/utils/date-formatter';
import { useOrganization } from '@/features/organizations/hooks/use-organization';
import { humanizeEnum } from '@/utils/string-helpers';
import type { Invoice, InvoiceLine } from '@/types/invoice.types';

export interface InvoicePdfPreviewProps {
  invoice: Invoice & { lines?: InvoiceLine[] };
}

/**
 * Print-ready invoice.
 *
 * Deliberately rendered as styled HTML rather than generated as a PDF in the
 * browser: a client-side PDF engine (pdfmake/jsPDF) would add several hundred
 * kilobytes to the bundle and still produce worse typography than the
 * browser's own print pipeline. "Print / Save as PDF" reaches the same
 * outcome, and `utilities.css` carries the print rules that strip the app
 * chrome.
 */
export const InvoicePdfPreview = ({ invoice }: InvoicePdfPreviewProps) => {
  const { data: organization } = useOrganization();
  const lines = invoice.lines ?? [];

  const statusVariant =
    invoice.status === 'PAID'
      ? 'success'
      : invoice.status === 'OVERDUE'
        ? 'error'
        : invoice.status === 'PARTIALLY_PAID'
          ? 'warning'
          : 'default';

  return (
    <div className="space-y-4">
      <div className="flex justify-end no-print">
        <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-2">
          <Printer className="h-4 w-4" />
          Print or save as PDF
        </Button>
      </div>

      <article className="print-full rounded-2xl border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900">
        <header className="flex flex-wrap items-start justify-between gap-6 border-b border-neutral-200 pb-6 dark:border-neutral-800">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
              {organization?.name ?? 'ImaraRent'}
            </h1>
            {organization?.address && (
              <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                {organization.address}
              </p>
            )}
            {organization?.email && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {organization.email}
              </p>
            )}
            {organization?.phone && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {organization.phone}
              </p>
            )}
          </div>

          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-neutral-400">Invoice</p>
            <p className="text-lg font-semibold tabular text-neutral-900 dark:text-neutral-50">
              {invoice.invoiceNumber}
            </p>
            <Badge variant={statusVariant} className="mt-2">
              {humanizeEnum(invoice.status)}
            </Badge>
          </div>
        </header>

        <section className="grid gap-6 border-b border-neutral-200 py-6 sm:grid-cols-2 dark:border-neutral-800">
          <div>
            <p className="text-xs uppercase tracking-wide text-neutral-400">Billed to</p>
            <p className="mt-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {invoice.tenant
                ? `${invoice.tenant.firstName} ${invoice.tenant.lastName}`
                : 'Tenant'}
            </p>
            {invoice.tenant?.email && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {invoice.tenant.email}
              </p>
            )}
          </div>

          <dl className="space-y-1 text-sm sm:text-right">
            <div className="flex justify-between gap-4 sm:justify-end">
              <dt className="text-neutral-500 dark:text-neutral-400">Issued</dt>
              <dd className="tabular text-neutral-900 sm:w-32 dark:text-neutral-100">
                {shortDate(invoice.issueDate)}
              </dd>
            </div>
            <div className="flex justify-between gap-4 sm:justify-end">
              <dt className="text-neutral-500 dark:text-neutral-400">Due</dt>
              <dd className="tabular text-neutral-900 sm:w-32 dark:text-neutral-100">
                {shortDate(invoice.dueDate)}
              </dd>
            </div>
            {invoice.status !== 'PAID' && (
              <p className="pt-1 text-xs text-neutral-500 dark:text-neutral-400">
                {duePhrase(invoice.dueDate)}
              </p>
            )}
          </dl>
        </section>

        <section className="border-b border-neutral-200 py-2 dark:border-neutral-800">
          {lines.length === 0 ? (
            <div className="flex items-center justify-between px-4 py-3">
              <p className="text-sm text-neutral-900 dark:text-neutral-100">
                {invoice.description || 'Rent'}
              </p>
              <p className="text-sm font-medium tabular text-neutral-900 dark:text-neutral-100">
                {moneyExact(invoice.totalAmount)}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {lines.map((line) => (
                <InvoiceLineItem key={line.id} line={line} />
              ))}
            </div>
          )}
        </section>

        <section className="flex justify-end pt-6">
          <dl className="w-full max-w-xs space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500 dark:text-neutral-400">Total</dt>
              <dd className="tabular font-medium text-neutral-900 dark:text-neutral-100">
                {moneyExact(invoice.totalAmount)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500 dark:text-neutral-400">Paid</dt>
              <dd className="tabular text-success-600 dark:text-success-400">
                {moneyExact(invoice.paidAmount)}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-neutral-200 pt-2 dark:border-neutral-800">
              <dt className="font-semibold text-neutral-900 dark:text-neutral-100">Balance</dt>
              <dd className="tabular text-base font-semibold text-neutral-900 dark:text-neutral-50">
                {moneyExact(invoice.balance)}
              </dd>
            </div>
          </dl>
        </section>

        <footer className="mt-8 border-t border-neutral-200 pt-4 text-xs text-neutral-400 dark:border-neutral-800">
          Generated by ImaraRent on {shortDate(new Date())}. All amounts in Kenyan Shillings.
        </footer>
      </article>
    </div>
  );
};

InvoicePdfPreview.displayName = 'InvoicePdfPreview';
