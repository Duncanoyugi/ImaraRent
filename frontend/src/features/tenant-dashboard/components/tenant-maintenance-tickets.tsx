import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TicketStatusBadge } from '@/features/maintenance/components/ticket-status-badge';
import { TicketPriorityBadge } from '@/features/maintenance/components/ticket-priority-badge';
import { formatDate } from '@/lib/formatters';
import { Wrench } from 'lucide-react';

interface Ticket {
  id: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
}

interface TenantMaintenanceTicketsProps {
  tickets: Ticket[];
  isLoading?: boolean;
  limit?: number;
}

export const TenantMaintenanceTickets = ({ tickets, isLoading = false, limit = 3 }: TenantMaintenanceTicketsProps) => {
  const displayTickets = tickets.slice(0, limit);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Open Maintenance Tickets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (displayTickets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Open Maintenance Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Wrench className="h-12 w-12 text-neutral-400" />
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              No open maintenance tickets
            </p>
            <p className="text-xs text-neutral-400">
              All your maintenance requests are resolved
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Open Maintenance Tickets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayTickets.map((ticket) => (
          <div
            key={ticket.id}
            className="flex items-center justify-between rounded-lg border border-neutral-100 p-3 dark:border-neutral-800"
          >
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                {ticket.title}
              </p>
              <div className="flex items-center gap-2">
                <TicketStatusBadge status={ticket.status as 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED'} />
                <TicketPriorityBadge priority={ticket.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'} />
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {formatDate(ticket.createdAt)}
                </span>
              </div>
            </div>
          </div>
        ))}
        {tickets.length > limit && (
          <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
            + {tickets.length - limit} more tickets
          </p>
        )}
      </CardContent>
    </Card>
  );
};