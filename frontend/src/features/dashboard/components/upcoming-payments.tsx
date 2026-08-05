import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Calendar, AlertCircle } from 'lucide-react';

interface Payment {
  id: string;
  tenantName: string;
  unitNumber: string;
  propertyName: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'overdue';
}

interface UpcomingPaymentsProps {
  payments: Payment[];
  isLoading?: boolean;
}

export const UpcomingPayments = ({ payments, isLoading = false }: UpcomingPaymentsProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
                </div>
                <div className="h-6 w-16 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <p className="text-neutral-500 dark:text-neutral-400">
              No upcoming payments
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Payments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between rounded-lg border border-neutral-100 p-3 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50"
            >
              <div className="space-y-1">
                <p className="font-medium text-neutral-900 dark:text-white">
                  {payment.tenantName}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {payment.propertyName} • Unit {payment.unitNumber}
                </p>
                <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                  <Calendar className="h-3 w-3" />
                  <span>Due {formatDate(payment.dueDate)}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {formatCurrency(payment.amount)}
                </p>
                {payment.status === 'overdue' ? (
                  <Badge variant="error" className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Overdue
                  </Badge>
                ) : (
                  <Badge variant="warning">Pending</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};