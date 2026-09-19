import { Building2, DoorOpen, Users, UserCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useOrganizationStats } from '../hooks/use-organization';
import { cn } from '@/lib/utils';

const TILES = [
  { key: 'totalProperties', label: 'Properties', icon: Building2, tone: 'text-brand-600 bg-brand-50 dark:bg-brand-900/30 dark:text-brand-400' },
  { key: 'totalUnits', label: 'Units', icon: DoorOpen, tone: 'text-info-600 bg-info-50 dark:bg-info-900/30 dark:text-info-400' },
  { key: 'totalTenants', label: 'Tenants', icon: Users, tone: 'text-success-600 bg-success-50 dark:bg-success-900/30 dark:text-success-400' },
  { key: 'totalUsers', label: 'Team members', icon: UserCircle, tone: 'text-warning-600 bg-warning-50 dark:bg-warning-900/30 dark:text-warning-400' },
] as const;

/** Four counts summarising the size of the organization. */
export const OrganizationStats = ({ className }: { className?: string }) => {
  const { data, isLoading } = useOrganizationStats();

  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}>
      {TILES.map(({ key, label, icon: Icon, tone }) => (
        <Card key={key}>
          <CardContent className="flex items-center gap-4 p-5">
            <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', tone)}>
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              {isLoading ? (
                <Skeleton className="h-7 w-12" />
              ) : (
                <p className="text-2xl font-semibold tabular text-neutral-900 dark:text-neutral-50">
                  {data?.[key] ?? 0}
                </p>
              )}
              <p className="text-sm text-neutral-500 dark:text-neutral-400">{label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

OrganizationStats.displayName = 'OrganizationStats';
