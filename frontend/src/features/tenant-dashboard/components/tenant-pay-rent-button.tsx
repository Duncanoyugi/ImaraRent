import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { showToast } from '@/app/providers/toast-provider';

interface TenantPayRentButtonProps {
  invoiceId?: string;
  balance?: number;
}

export const TenantPayRentButton = ({ invoiceId, balance = 0 }: TenantPayRentButtonProps) => {
  const navigate = useNavigate();

  const handlePay = () => {
    if (!invoiceId) {
      showToast.info('No Invoice', 'You have no outstanding balance to pay.');
      return;
    }

    if (balance <= 0) {
      showToast.info('Balance Cleared', 'You have no outstanding balance.');
      return;
    }

    navigate(`/payments/pay?invoiceId=${invoiceId}`);
  };

  return (
    <Button
      onClick={handlePay}
      className="w-full gap-2"
      disabled={!invoiceId || balance <= 0}
    >
      <CreditCard className="h-4 w-4" />
      Pay Rent
    </Button>
  );
};