import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { RevenueChart, type RevenuePoint } from '@/components/charts/revenue-chart';
import { money } from '@/utils/currency-formatter';
import { percentage } from '@/utils/number-helpers';

export interface OwnerRevenueChartProps {
  data: RevenuePoint[] | undefined;
  isLoading?: boolean;
}

/**
 * Revenue chart with the headline figures above it — the collected total and
 * how much of what was billed that represents.
 */
export const OwnerRevenueChart = ({ data, isLoading }: OwnerRevenueChartProps) => {
  const expected = (data ?? []).reduce((total, point) => total + point.expected, 0);
  const collected = (data ?? []).reduce((total, point) => total + point.collected, 0);
  const rate = percentage(collected, expected, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <CardTitle>Rent collection</CardTitle>
            <CardDescription>Billed against received, by month.</CardDescription>
          </div>

          {!isLoading && expected > 0 && (
            <div className="text-right">
              <p className="text-2xl font-semibold tabular text-neutral-900 dark:text-neutral-50">
                {money(collected)}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {rate}% of {money(expected)} billed
              </p>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? <Skeleton className="h-72 w-full" /> : <RevenueChart data={data} />}
      </CardContent>
    </Card>
  );
};

OwnerRevenueChart.displayName = 'OwnerRevenueChart';
