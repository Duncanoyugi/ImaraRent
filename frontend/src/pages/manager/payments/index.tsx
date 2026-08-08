import { useState } from 'react';
import { usePayments } from '@/features/payments/hooks/use-payments';
import { PaymentHistory } from '@/features/payments/components/payment-history';
import { ManualPaymentForm } from '@/features/payments/components/manual-payment-form';
import { useTenants } from '@/features/tenants/hooks/use-tenants';
import { useRecordManualPayment } from '@/features/payments/hooks/use-payments';
import type { ManualPaymentFormData } from '@/features/payments/schemas/payment.schemas';
import { PageLoader } from '@/components/shared/page-loader';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function ManagerPaymentsPage() {
  const [manualPaymentOpen, setManualPaymentOpen] = useState(false);
  const { data: payments, isLoading } = usePayments();
  const { data: tenants, isLoading: tenantsLoading } = useTenants({ status: 'ACTIVE' });
  const recordPayment = useRecordManualPayment();

  const handleManualPayment = (data: ManualPaymentFormData) => {
    recordPayment.mutate(data, {
      onSuccess: () => {
        setManualPaymentOpen(false);
      },
    });
  };

  if (isLoading || tenantsLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <PaymentHistory
        payments={payments || []}
        isLoading={isLoading}
        showManualPayment={true}
        onManualPayment={() => setManualPaymentOpen(true)}
      />

      <Dialog open={manualPaymentOpen} onOpenChange={setManualPaymentOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Record Manual Payment</DialogTitle>
            <DialogDescription>
              Record a cash, bank transfer, or card payment manually.
            </DialogDescription>
          </DialogHeader>
          <ManualPaymentForm
            tenants={tenants || []}
            onSubmit={handleManualPayment}
            isLoading={recordPayment.isPending}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
