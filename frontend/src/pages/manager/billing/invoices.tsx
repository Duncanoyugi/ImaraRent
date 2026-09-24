import { useInvoices } from '@/features/billing/hooks/use-billing';
import { InvoiceList } from '@/features/billing/components/invoice-list';
import { PageLoader } from '@/components/shared/page-loader';

export default function ManagerInvoicesPage() {
  const { data: invoices, isLoading } = useInvoices();

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <InvoiceList
      invoices={invoices || []}
      isLoading={isLoading}
      showGenerate={false}
    />
  );
}