import { useParams } from 'react-router-dom';
import { useTenantPayment } from '@/features/tenant-dashboard/hooks/use-tenant-dashboard';
import { PaymentDetails } from '@/features/payments/components/payment-details';
import { PageLoader } from '@/components/shared/page-loader';

export default function TenantPaymentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: payment, isLoading } = useTenantPayment(id!);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!payment) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-error-500">Payment not found</p>
        </div>
      </div>
    );
  }

  return <PaymentDetails payment={payment} backPath="/payments" showTenantLink={false} />;
}
