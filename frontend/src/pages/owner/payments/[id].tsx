import { useParams } from 'react-router-dom';
import { PaymentDetails } from '@/features/payments/components/payment-details';
import { usePayment } from '@/features/payments/hooks/use-payments';
import { PageLoader } from '@/components/shared/page-loader';

export default function PaymentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: payment, isLoading, error } = usePayment(id!);

  if (isLoading) {
    return <PageLoader />;
  }

  if (error || !payment) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-error-500">Failed to load payment</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {(error as Error)?.message || 'Payment not found'}
          </p>
        </div>
      </div>
    );
  }

  return <PaymentDetails payment={payment} />;
}
