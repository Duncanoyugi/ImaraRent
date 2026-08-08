import { useInvoices, useVoidInvoice } from '@/features/billing/hooks/use-billing';
import { InvoiceList } from '@/features/billing/components/invoice-list';
import { PageLoader } from '@/components/shared/page-loader';

export default function InvoicesPage() {
  const { data: invoices, isLoading } = useInvoices();
  const voidInvoice = useVoidInvoice();

  const handleVoid = (id: string, reason?: string) => {
    if (window.confirm('Are you sure you want to void this invoice?')) {
      voidInvoice.mutate({ id, reason });
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <InvoiceList
      invoices={invoices || []}
      isLoading={isLoading}
      showGenerate={true}
      onGenerate={() => {}}
      onVoid={handleVoid}
    />
  );
}
