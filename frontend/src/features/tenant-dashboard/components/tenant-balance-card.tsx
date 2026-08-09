import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface TenantBalanceCardProps {
  balance: {
    totalBalance: number;
    totalDue: number;
    totalPaid: number;
    invoiceCount: number;
    overdueInvoices: number;
  };
  isLoading?: boolean;
}

export const TenantBalanceCard = ({ balance, isLoading = false }: TenantBalanceCardProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Balance Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-8 w-32 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasBalance = balance.totalBalance > 0;
  const hasOverdue = balance.overdueInvoices > 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Balance Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total Balance */}
        <div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Total Balance</p>
          <p
            className={cn(
              'text-2xl font-bold',
              hasBalance ? 'text-error-600 dark:text-error-400' : 'text-success-600 dark:text-success-400'
            )}
          >
            {formatCurrency(balance.totalBalance)}
          </p>
          {hasBalance ? (
            <Badge variant="destructive" className="mt-1 gap-1">
              <TrendingDown className="h-3 w-3" />
              Balance Due
            </Badge>
          ) : (
            <Badge variant="success" className="mt-1 gap-1">
              <TrendingUp className="h-3 w-3" />
              All Paid
            </Badge>
          )}
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800/50">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Total Due</p>
            <p className="text-lg font-semibold text-neutral-900 dark:text-white">
              {formatCurrency(balance.totalDue)}
            </p>
          </div>
          <div className="rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800/50">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Total Paid</p>
            <p className="text-lg font-semibold text-success-600 dark:text-success-400">
              {formatCurrency(balance.totalPaid)}
            </p>
          </div>
        </div>

        {/* Invoice Counts */}
        <div className="flex items-center gap-3 text-sm">
          <span className="text-neutral-500 dark:text-neutral-400">
            {balance.invoiceCount} invoice{balance.invoiceCount !== 1 ? 's' : ''}
          </span>
          {hasOverdue && (
            <Badge variant="destructive" className="gap-1">
              <AlertCircle className="h-3 w-3" />
              {balance.overdueInvoices} overdue
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};