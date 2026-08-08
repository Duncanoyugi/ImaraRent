import { useParams } from 'react-router-dom';
import { TicketDetails } from '@/features/maintenance/components/ticket-details';
import { useTicket } from '@/features/maintenance/hooks/use-maintenance';
import { PageLoader } from '@/components/shared/page-loader';

export default function TenantTicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: ticket, isLoading, error } = useTicket(id!);

  if (isLoading) {
    return <PageLoader />;
  }

  if (error || !ticket) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-error-500">Failed to load ticket</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {(error as Error)?.message || 'Ticket not found'}
          </p>
        </div>
      </div>
    );
  }

  return <TicketDetails ticket={ticket} />;
}
