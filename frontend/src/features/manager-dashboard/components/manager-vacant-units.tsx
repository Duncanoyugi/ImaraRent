import { Link } from 'react-router-dom';
import { DoorOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { money } from '@/utils/currency-formatter';
import { pluralize } from '@/utils/string-helpers';
import type { ManagerVacantUnit } from '../types/manager-dashboardtypes';

interface Props {
  units: ManagerVacantUnit[] | undefined;
  isLoading?: boolean;
}

export const ManagerVacantUnits = ({ units, isLoading }: Props) => (
  <Card>
    <CardHeader>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <CardTitle>Empty units</CardTitle>
          <CardDescription>Every vacant unit is rent you are not collecting.</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/units">All units</Link>
        </Button>
      </div>
    </CardHeader>

    <CardContent className="px-0 pb-0">
      {isLoading ? (
        <div className="space-y-3 px-4 pb-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : !units || units.length === 0 ? (
        <EmptyState
          icon={DoorOpen}
          title="Everything is let"
          description="No vacant units across the properties you manage."
          compact
        />
      ) : (
        <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {units.map((unit) => (
            <li
              key={unit.id}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Unit {unit.number}
                </p>
                <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                  {unit.propertyName}
                  {unit.bedrooms ? ` · ${pluralize(unit.bedrooms, 'bedroom')}` : ''}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold tabular text-neutral-900 dark:text-neutral-100">
                  {money(unit.rentAmount)}
                </p>
                <p className="text-xs text-neutral-400">per month</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </CardContent>
  </Card>
);

ManagerVacantUnits.displayName = 'ManagerVacantUnits';
