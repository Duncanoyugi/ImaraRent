import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useInvoice } from '@/features/billing/hooks/use-billing';
import { MpesaPaymentButton } from '@/features/payments/components/mpesa-payment-button';
import { PageLoader } from '@/components/shared/page-loader';
import { formatCurrency, formatDate } from '@/lib/formatters';

export default function PayRentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const invoiceId = searchParams.get('invoiceId');
  const [selectedInvoiceId] = useState(invoiceId || '');

  const { data: invoice, isLoading } = useInvoice(selectedInvoiceId || '');

  if (isLoading) {
    return <PageLoader />;
  }

  if (!invoice || !selectedInvoiceId) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/tenant/dashboard')}
            className="h-9 w-9 shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Pay Rent
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Select an invoice to pay
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-neutral-500 dark:text-neutral-400">
              No invoice selected. Please select an invoice from your dashboard.
            </p>
            <Button className="mt-4" onClick={() => navigate('/tenant/dashboard')}>
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/tenant/dashboard')}
          className="h-9 w-9 shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Pay Rent
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Complete your rent payment securely
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice {invoice.invoiceNumber}</CardTitle>
          <CardDescription>
            Due: {formatDate(invoice.dueDate)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-neutral-50 p-4 dark:bg-neutral-800/50">
            <div className="flex justify-between items-center">
              <span className="text-neutral-500 dark:text-neutral-400">Amount Due</span>
              <span className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                {formatCurrency(invoice.balance)}
              </span>
            </div>
            {invoice.description && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                {invoice.description}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Pay via M-Pesa. You will receive a prompt on your phone to complete the payment.
            </p>
            <MpesaPaymentButton
              invoiceId={invoice.id}
              amount={Number(invoice.balance)}
              onSuccess={() => {
                navigate('/tenant/dashboard');
              }}
            />
          </div>

          <div className="text-xs text-neutral-400 dark:text-neutral-500">
            <p>You will receive a confirmation SMS from M-Pesa after payment.</p>
            <p>Payment may take a few minutes to reflect.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}