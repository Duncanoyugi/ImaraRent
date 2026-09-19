import { Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { initials } from '@/utils/string-helpers';
import { relativeTime } from '@/utils/date-formatter';
import type { ManagerTenantCheckin } from '../types/manager-dashboardtypes';

interface Props {
  checkins: ManagerTenantCheckin[] | undefined;
  isLoading?: boolean;
}

export const ManagerTenantCheckins = ({ checkins, isLoading }: Props) => (
  <Card>
    <CardHeader>
      <CardTitle>Recent tenant activity</CardTitle>
      <CardDescription>Move-ins and invitations across your properties.</CardDescription>
    </CardHeader>

    <CardContent className="px-0 pb-0">
      {isLoading ? (
        <div className="space-y-3 px-4 pb-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : !checkins || checkins.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No tenant activity yet"
          description="Invitations and move-ins will appear here."
          compact
        />
      ) : (
        <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {checkins.map((entry) => (
            <li key={entry.id} className="flex items-center gap-3 px-4 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                {initials(...entry.tenantName.split(' '))}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {entry.tenantName}
                </p>
                <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                  {entry.event}
                  {entry.unitNumber !== '—' && ` · Unit ${entry.unitNumber}`}
                </p>
              </div>

              <span className="shrink-0 text-xs text-neutral-400">{relativeTime(entry.at)}</span>
            </li>
          ))}
        </ul>
      )}
    </CardContent>
  </Card>
);

ManagerTenantCheckins.displayName = 'ManagerTenantCheckins';
