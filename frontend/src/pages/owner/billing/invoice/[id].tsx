import { useParams, useNavigate } from 'react-router-dom';
import { InvoiceDetails } from '@/features/billing/components/invoice-details';
import { useInvoice, useVoidInvoice } from '@/features/billing/hooks/use-billing';
import { PageLoader } from '@/components/shared/page-loader';

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: invoice, isLoading, error } = useInvoice(id!);
  const voidInvoice = useVoidInvoice();

  const handleVoid = () => {
    if (window.confirm('Are you sure you want to void this invoice?')) {
      voidInvoice.mutate(
        { id: id!, reason: 'Voided by admin' },
        {
          onSuccess: () => {
            navigate('/billing/invoices');
          },
        }
      );
    }
  };

  const handlePay = () => {
    navigate(`/payments?invoiceId=${id}`);
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (error || !invoice) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-error-500">Failed to load invoice</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {(error as Error)?.message || 'Invoice not found'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <InvoiceDetails
      invoice={invoice}
      onVoid={invoice.status !== 'PAID' && invoice.status !== 'CANCELLED' ? handleVoid : undefined}
      onPay={invoice.status !== 'PAID' && invoice.status !== 'CANCELLED' ? handlePay : undefined}
    />
  );
}