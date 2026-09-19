import { Link } from 'react-router-dom';
import { Wrench } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { PriorityBadge } from '@/components/shared/priority-badge';
import { relativeTime } from '@/utils/date-formatter';
import type { ManagerTicketSummary } from '../types/manager-dashboardtypes';

interface Props {
  tickets: ManagerTicketSummary[] | undefined;
  isLoading?: boolean;
}

export const ManagerMaintenanceQueue = ({ tickets, isLoading }: Props) => (
  <Card>
    <CardHeader>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <CardTitle>Maintenance queue</CardTitle>
          <CardDescription>Tickets that are still open.</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/maintenance">View all</Link>
        </Button>
      </div>
    </CardHeader>

    <CardContent className="px-0 pb-0">
      {isLoading ? (
        <div className="space-y-3 px-4 pb-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : !tickets || tickets.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No open tickets"
          description="Repairs raised by tenants will show up here."
          compact
        />
      ) : (
        <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {tickets.map((ticket) => (
            <li key={ticket.id}>
              <Link
                to={`/maintenance/${ticket.id}`}
                className="block px-4 py-3 transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500 dark:hover:bg-neutral-800/60"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 flex-1 truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {ticket.title}
                  </p>
                  <PriorityBadge priority={ticket.priority} showIcon={false} />
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400">
                  <span className="truncate">
                    Unit {ticket.unitNumber} · {ticket.propertyName}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="truncate">{ticket.tenantName}</span>
                  <span aria-hidden="true">·</span>
                  <span>{relativeTime(ticket.createdAt)}</span>
                  <StatusBadge status={ticket.status} className="ml-auto" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </CardContent>
  </Card>
);

ManagerMaintenanceQueue.displayName = 'ManagerMaintenanceQueue';
