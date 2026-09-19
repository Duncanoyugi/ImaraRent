import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { OccupancyChart } from '@/components/charts/occupancy-chart';
import { cn } from '@/lib/utils';

export interface OwnerOccupancyGridProps {
  occupied: number;
  vacant: number;
  maintenance?: number;
  reserved?: number;
  isLoading?: boolean;
}

const LEGEND = [
  { key: 'occupied', label: 'Occupied', tone: 'bg-brand-500' },
  { key: 'vacant', label: 'Vacant', tone: 'bg-neutral-400' },
  { key: 'maintenance', label: 'Maintenance', tone: 'bg-warning-500' },
  { key: 'reserved', label: 'Reserved', tone: 'bg-info-500' },
] as const;

/** Donut plus a readable breakdown of the same numbers. */
export const OwnerOccupancyGrid = ({
  occupied,
  vacant,
  maintenance = 0,
  reserved = 0,
  isLoading,
}: OwnerOccupancyGridProps) => {
  const counts = { occupied, vacant, maintenance, reserved };
  const total = occupied + vacant + maintenance + reserved;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Occupancy</CardTitle>
        <CardDescription>
          {total > 0 ? `${total} unit${total === 1 ? '' : 's'} across your portfolio.` : 'No units yet.'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          <Skeleton className="h-72 w-full" />
        ) : (
          <>
            <OccupancyChart
              occupied={occupied}
              vacant={vacant}
              maintenance={maintenance}
              reserved={reserved}
            />

            {total > 0 && (
              <dl className="grid grid-cols-2 gap-2">
                {LEGEND.map(({ key, label, tone }) => (
                  <div
                    key={key}
                    className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 dark:border-neutral-800"
                  >
                    <span className={cn('h-2 w-2 shrink-0 rounded-full', tone)} />
                    <dt className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                      {label}
                    </dt>
                    <dd className="ml-auto text-sm font-semibold tabular text-neutral-900 dark:text-neutral-100">
                      {counts[key]}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

OwnerOccupancyGrid.displayName = 'OwnerOccupancyGrid';
