import { useParams } from 'react-router-dom';
import { TicketDetails } from '@/features/maintenance/components/ticket-details';
import { useTicket, useUpdateTicket } from '@/features/maintenance/hooks/use-maintenance';
import { PageLoader } from '@/components/shared/page-loader';

export default function OwnerTicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: ticket, isLoading, error } = useTicket(id!);
  const updateTicket = useUpdateTicket();

  const handleAssign = () => {
    window.location.href = `/maintenance/${id}/assign`;
  };

  const handleComplete = (resolutionNotes?: string) => {
    if (id) {
      updateTicket.mutate({
        id,
        data: { status: 'COMPLETED', resolutionNotes },
      });
    }
  };

  const handleStatusChange = (status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED') => {
    if (id) {
      updateTicket.mutate({
        id,
        data: { status },
      });
    }
  };

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

  return (
    <TicketDetails
      ticket={ticket}
      onAssign={handleAssign}
      onComplete={handleComplete}
      onStatusChange={handleStatusChange}
    />
  );
}
