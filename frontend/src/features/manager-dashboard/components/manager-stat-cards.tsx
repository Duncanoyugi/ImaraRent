import { Building2, DoorOpen, Users, Wrench } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { money } from '@/utils/currency-formatter';
import { cn } from '@/lib/utils';
import type { ManagerStats } from '../types/manager-dashboardtypes';

interface Props {
  stats: ManagerStats | undefined;
  isLoading?: boolean;
}

export const ManagerStatCards = ({ stats, isLoading }: Props) => {
  const tiles = [
    {
      label: 'Properties',
      value: stats ? String(stats.assignedProperties) : '0',
      hint: stats ? `${stats.totalUnits} units in total` : undefined,
      icon: Building2,
      tone: 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400',
    },
    {
      label: 'Occupancy',
      value: stats ? `${stats.occupancyRate}%` : '0%',
      hint: stats ? `${stats.vacantUnits} vacant` : undefined,
      icon: DoorOpen,
      tone: 'bg-info-50 text-info-600 dark:bg-info-900/30 dark:text-info-400',
    },
    {
      label: 'Open tickets',
      value: stats ? String(stats.openTickets) : '0',
      hint: stats && stats.urgentTickets > 0 ? `${stats.urgentTickets} need attention` : 'Nothing urgent',
      icon: Wrench,
      tone:
        stats && stats.urgentTickets > 0
          ? 'bg-warning-50 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400'
          : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400',
    },
    {
      label: 'Unpaid invoices',
      value: stats ? String(stats.duePayments) : '0',
      hint: stats && stats.overdueAmount > 0 ? `${money(stats.overdueAmount)} overdue` : 'Nothing overdue',
      icon: Users,
      tone:
        stats && stats.overdueAmount > 0
          ? 'bg-error-50 text-error-600 dark:bg-error-900/30 dark:text-error-400'
          : 'bg-success-50 text-success-600 dark:bg-success-900/30 dark:text-success-400',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {tiles.map(({ label, value, hint, icon: Icon, tone }) => (
        <Card key={label}>
          <CardContent className="flex items-start gap-4 p-5">
            <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', tone)}>
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-2xl font-semibold tabular text-neutral-900 dark:text-neutral-50">
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

ManagerStatCards.displayName = 'ManagerStatCards';
