import { useParams, useNavigate } from 'react-router-dom';
import { useTenantInvoice } from '@/features/tenant-dashboard/hooks/use-tenant-dashboard';
import { InvoiceDetails } from '@/features/billing/components/invoice-details';
import { PageLoader } from '@/components/shared/page-loader';

export default function TenantInvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: invoice, isLoading } = useTenantInvoice(id!);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!invoice) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-error-500">Invoice not found</p>
        </div>
      </div>
    );
  }

  return (
    <InvoiceDetails
      invoice={invoice}
      backPath="/invoices"
      showOwnerLinks={false}
      onPay={() => navigate(`/payments/pay?invoiceId=${invoice.id}`)}
    />
  );
}
