import { useTickets, useUpdateTicket } from '@/features/maintenance/hooks/use-maintenance';
import { TicketList } from '@/features/maintenance/components/ticket-list';
import { PageLoader } from '@/components/shared/page-loader';

export default function ManagerMaintenancePage() {
  const { data: tickets, isLoading } = useTickets();
  const updateTicket = useUpdateTicket();

  const handleComplete = (ticketId: string) => {
    const resolutionNotes = window.prompt('Enter resolution notes (optional):');
    if (resolutionNotes !== null) {
      updateTicket.mutate({
        id: ticketId,
        data: { status: 'COMPLETED' },
      });
    }
  };

  const handleStatusChange = (ticketId: string, status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED') => {
    updateTicket.mutate({
      id: ticketId,
      data: { status },
    });
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <TicketList
      tickets={tickets || []}
      isLoading={isLoading}
      showCreate={false}
      onComplete={handleComplete}
      onStatusChange={handleStatusChange}
    />
  );
}
