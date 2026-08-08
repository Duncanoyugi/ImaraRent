import { useInvoices } from '@/features/billing/hooks/use-billing';
import { InvoiceList } from '@/features/billing/components/invoice-list';
import { AppLayout } from '@/components/layout/app-layout';
import { PageLoader } from '@/components/shared/page-loader';

export default function ManagerInvoicesPage() {
  const { data: invoices, isLoading } = useInvoices();

  if (isLoading) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <InvoiceList
        invoices={invoices || []}
        isLoading={isLoading}
        showGenerate={false}
      />
    </AppLayout>
  );
}