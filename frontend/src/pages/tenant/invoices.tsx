import { useAuth } from '@/features/auth/hooks/use-auth';
import { useTenantInvoices } from '@/features/billing/hooks/use-billing';
import { InvoiceList } from '@/features/billing/components/invoice-list';
import { AppLayout } from '@/components/layout/app-layout';
import { PageLoader } from '@/components/shared/page-loader';

export default function TenantInvoicesPage() {
  const { user } = useAuth();
  const tenantId = user?.tenantProfile?.id;

  const { data: invoices, isLoading } = useTenantInvoices(tenantId || '');

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