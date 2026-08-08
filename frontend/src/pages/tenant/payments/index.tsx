import { useAuth } from '@/features/auth/hooks/use-auth';
import { useTenantPayments } from '@/features/payments/hooks/use-payments';
import { PaymentHistory } from '@/features/payments/components/payment-history';
import { PageLoader } from '@/components/shared/page-loader';

export default function TenantPaymentsPage() {
  const { user } = useAuth();
  const tenantId = user?.tenantProfile?.id;

  const { data: payments, isLoading } = useTenantPayments(tenantId || '');

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <PaymentHistory
      payments={payments || []}
      isLoading={isLoading}
      showManualPayment={false}
    />
  );
}