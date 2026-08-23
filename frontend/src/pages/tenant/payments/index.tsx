import { useTenantPayments } from '@/features/tenant-dashboard/hooks/use-tenant-dashboard';
import { PaymentHistory } from '@/features/payments/components/payment-history';
import { PageLoader } from '@/components/shared/page-loader';

export default function TenantPaymentsPage() {
  const { data: payments, isLoading } = useTenantPayments();

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <PaymentHistory
      payments={payments || []}
      isLoading={isLoading}
      showManualPayment={false}
      viewPath="/payments"
    />
  );
}