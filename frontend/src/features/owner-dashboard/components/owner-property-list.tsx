import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { ownerDashboardService } from '../services/owner-dashboard.service';
import { money } from '@/utils/currency-formatter';

/** Per-property occupancy and rent roll, worst-performing first. */
export const OwnerPropertyList = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['owner-dashboard', 'property-performance'],
    queryFn: () => ownerDashboardService.getPropertyPerformance(),
    staleTime: 1000 * 60 * 5,
  });

  // Surfacing the least-occupied first makes the list actionable rather than
  // merely informational.
  const properties = (data ?? [])
    .slice()
    .sort((a, b) => a.occupancyRate - b.occupancyRate)
    .slice(0, 6);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle>Properties</CardTitle>
            <CardDescription>Lowest occupancy first.</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/properties">View all</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="px-0 pb-0">
        {isLoading ? (
          <div className="space-y-4 px-4 pb-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No properties yet"
            description="Add your first property to start tracking occupancy and rent."
            compact
            action={
              <Button size="sm" asChild>
                <Link to="/properties/new">Add a property</Link>
              </Button>
            }
          />
        ) : (
          <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {properties.map((property) => (
              <li key={property.id}>
                <Link
                  to={`/properties/${property.id}`}
                  className="block px-4 py-3.5 transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500 dark:hover:bg-neutral-800/60"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {property.name}
                      </p>
                      <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                        {property.city} · {property.occupiedUnits} of {property.totalUnits} let
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold tabular text-neutral-900 dark:text-neutral-100">
                        {money(property.monthlyRent)}
                      </p>
                      <p className="text-xs text-neutral-400">rent roll</p>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <Progress value={property.occupancyRate} className="h-1.5 flex-1" />
                    <span className="shrink-0 text-xs tabular text-neutral-500 dark:text-neutral-400">
                      {property.occupancyRate}%
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

OwnerPropertyList.displayName = 'OwnerPropertyList';
