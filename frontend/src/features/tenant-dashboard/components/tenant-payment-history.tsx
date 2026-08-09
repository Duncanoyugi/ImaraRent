import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, formatCurrency } from '@/lib/formatters';
import { CreditCard } from 'lucide-react';

interface Payment {
  id: string;
  amount: number;
  paymentDate: string;
  method: string;
  status: string;
  reference: string;
}

interface TenantPaymentHistoryProps {
  payments: Payment[];
  isLoading?: boolean;
  limit?: number;
}

export const TenantPaymentHistory = ({ payments, isLoading = false, limit = 5 }: TenantPaymentHistoryProps) => {
  const displayPayments = payments.slice(0, limit);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payment History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (displayPayments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <CreditCard className="h-12 w-12 text-neutral-400" />
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              No payments yet
            </p>
            <p className="text-xs text-neutral-400">
              Your payment history will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Payment History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayPayments.map((payment) => (
          <div
            key={payment.id}
            className="flex items-center justify-between rounded-lg border border-neutral-100 p-3 dark:border-neutral-800"
          >
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                {formatCurrency(payment.amount)}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {payment.method}
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {formatDate(payment.paymentDate)}
                </span>
              </div>
            </div>
          </div>
        ))}
        {payments.length > limit && (
          <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
            + {payments.length - limit} more payments
          </p>
        )}
      </CardContent>
    </Card>
  );
};
