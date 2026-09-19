import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrearsChart } from '@/components/charts/arrears-chart';
import { ownerDashboardService } from '../services/owner-dashboard.service';
import { money } from '@/utils/currency-formatter';
import { pluralize } from '@/utils/string-helpers';

/**
 * How old the unpaid money is. Debt that has aged past 60 days rarely
 * collects itself, so the total for those buckets is called out separately.
 */
export const OwnerArrearsSummary = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['owner-dashboard', 'arrears'],
    queryFn: () => ownerDashboardService.getArrearsBuckets(),
    staleTime: 1000 * 60 * 5,
  });

  const outstanding = (data ?? [])
    .filter((bucket) => bucket.bucket !== 'Current')
    .reduce((total, bucket) => total + bucket.amount, 0);

  const aged = (data ?? [])
    .filter((bucket) => ['61–90 days', 'Over 90 days'].includes(bucket.bucket))
    .reduce((total, bucket) => total + bucket.amount, 0);

  const invoiceCount = (data ?? [])
    .filter((bucket) => bucket.bucket !== 'Current')
    .reduce((total, bucket) => total + bucket.invoiceCount, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <CardTitle>Money owed</CardTitle>
            <CardDescription>Unpaid invoices grouped by how late they are.</CardDescription>
          </div>

          {!isLoading && outstanding > 0 && (
            <div className="text-right">
              <p className="text-2xl font-semibold tabular text-neutral-900 dark:text-neutral-50">
                {money(outstanding)}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                across {pluralize(invoiceCount, 'invoice')}
              </p>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? <Skeleton className="h-64 w-full" /> : <ArrearsChart data={data} />}

        {!isLoading && aged > 0 && (
          <p className="rounded-lg bg-error-50 px-3 py-2 text-sm text-error-800 dark:bg-error-900/20 dark:text-error-200">
            {money(aged)} has been outstanding for more than 60 days. Chase these first.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

OwnerArrearsSummary.displayName = 'OwnerArrearsSummary';
