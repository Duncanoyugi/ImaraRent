import { Building2, DoorOpen, TrendingUp, Wallet } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useProperties } from '../hooks/use-properties';
import { money } from '@/utils/currency-formatter';
import { decimal, percentage } from '@/utils/number-helpers';
import { cn } from '@/lib/utils';

interface PropertyLike {
  stats?: {
    totalUnits?: number;
    occupiedUnits?: number;
    vacantUnits?: number;
    totalRent?: number;
  };
  units?: Array<{ status: string; rentAmount: unknown }>;
}

/**
 * Portfolio summary shown above the property list.
 *
 * Derived from the list response rather than `/properties/stats` so the
 * numbers always agree with the rows underneath them.
 */
export const PropertyStats = ({ className }: { className?: string }) => {
  const { data, isLoading } = useProperties();

  const properties = (data ?? []) as PropertyLike[];

  const totals = properties.reduce(
    (acc, property) => {
      const units = property.units ?? [];
      acc.units += property.stats?.totalUnits ?? units.length;
      acc.occupied +=
        property.stats?.occupiedUnits ?? units.filter((u) => u.status === 'OCCUPIED').length;
      acc.rent +=
        property.stats?.totalRent ??
        units.reduce((sum, unit) => sum + decimal(unit.rentAmount), 0);
      return acc;
    },
    { units: 0, occupied: 0, rent: 0 }
  );

  const tiles = [
    {
      label: 'Properties',
      value: String(properties.length),
      icon: Building2,
      tone: 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400',
    },
    {
      label: 'Units',
      value: String(totals.units),
      hint: `${totals.units - totals.occupied} vacant`,
      icon: DoorOpen,
      tone: 'bg-info-50 text-info-600 dark:bg-info-900/30 dark:text-info-400',
    },
    {
      label: 'Occupancy',
      value: `${percentage(totals.occupied, totals.units, 0)}%`,
      hint: `${totals.occupied} let`,
      icon: TrendingUp,
      tone: 'bg-success-50 text-success-600 dark:bg-success-900/30 dark:text-success-400',
    },
    {
      label: 'Monthly rent roll',
      value: money(totals.rent),
      hint: 'if fully let',
      icon: Wallet,
      tone: 'bg-warning-50 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400',
    },
  ];

  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 xl:grid-cols-4', className)}>
      {tiles.map(({ label, value, hint, icon: Icon, tone }) => (
        <Card key={label}>
          <CardContent className="flex items-start gap-4 p-5">
            <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', tone)}>
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <p className="truncate text-2xl font-semibold tabular text-neutral-900 dark:text-neutral-50">
                  {value}
                </p>
              )}
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</p>
              {hint && !isLoading && (
                <p className="mt-0.5 truncate text-xs text-neutral-500 dark:text-neutral-400">
                  {hint}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

PropertyStats.displayName = 'PropertyStats';
