import { useAuth } from '@/features/auth/hooks/use-auth';
import { useTenantInvoices } from '@/features/billing/hooks/use-billing';
import { InvoiceList } from '@/features/billing/components/invoice-list';
import { PageLoader } from '@/components/shared/page-loader';

export default function TenantInvoicesPage() {
  const { user } = useAuth();
  const tenantId = user?.tenantProfile?.id;

  const { data: invoices, isLoading } = useTenantInvoices(tenantId || '');

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          My Invoices
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          View and manage your invoices
        </p>
      </div>

      <InvoiceList
        invoices={invoices || []}
        isLoading={isLoading}
        showGenerate={false}
      />
    </div>
  );
}
