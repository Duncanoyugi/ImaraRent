import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Smartphone } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInitiateMpesaPayment } from '../hooks/use-payments';
import { showToast } from '@/app/providers/toast-provider';
import { formatCurrency } from '@/lib/formatters';

interface MpesaPaymentButtonProps {
  invoiceId: string;
  amount: number;
  tenantPhone?: string;
  onSuccess?: () => void;
}

export const MpesaPaymentButton = ({
  invoiceId,
  amount,
  tenantPhone = '',
  onSuccess,
}: MpesaPaymentButtonProps) => {
  const [open, setOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(tenantPhone);
  const initiatePayment = useInitiateMpesaPayment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedPhone = phoneNumber.replace(/\D/g, '');
    if (cleanedPhone.length < 10 || cleanedPhone.length > 12) {
      showToast.error('Invalid Phone', 'Please enter a valid phone number');
      return;
    }

    initiatePayment.mutate(
      {
        invoiceId,
        amount,
        phoneNumber: cleanedPhone,
      },
      {
        onSuccess: () => {
          setOpen(false);
          onSuccess?.();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Smartphone className="h-4 w-4" />
          Pay with M-Pesa
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>M-Pesa Payment</DialogTitle>
          <DialogDescription>
            Pay {formatCurrency(amount)} via M-Pesa. You will receive a prompt on your phone.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">M-Pesa Phone Number *</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="e.g., 0712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Enter the phone number registered with M-Pesa
              </p>
            </div>
            <div className="rounded-lg bg-brand-50 p-3 dark:bg-brand-950/20">
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                Amount: <strong>{formatCurrency(amount)}</strong>
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={initiatePayment.isPending}
              disabled={initiatePayment.isPending}
            >
              {initiatePayment.isPending ? 'Initiating...' : 'Pay Now'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};