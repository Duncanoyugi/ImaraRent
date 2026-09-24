import { useTickets, useUpdateTicket, useAssignTicket } from '@/features/maintenance/hooks/use-maintenance';
import { TicketList } from '@/features/maintenance/components/ticket-list';
import { PageLoader } from '@/components/shared/page-loader';
import { useState } from 'react';

export default function ManagerMaintenancePage() {
  const { data: tickets, isLoading } = useTickets();
  const updateTicket = useUpdateTicket();
  const assignTicket = useAssignTicket();
  const [assignTicketId, setAssignTicketId] = useState<string | null>(null);

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

  const handleAssign = (ticketId: string) => {
    setAssignTicketId(ticketId);
  };

  const handleAssignConfirm = (assignedToId: string) => {
    if (assignTicketId) {
      assignTicket.mutate({ id: assignTicketId, assignedToId });
      setAssignTicketId(null);
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <TicketList
      tickets={tickets || []}
      isLoading={isLoading}
      showCreate={false}
      onAssign={handleAssign}
      onComplete={handleComplete}
      onStatusChange={handleStatusChange}
      assignTicketId={assignTicketId}
      onAssignConfirm={handleAssignConfirm}
      onAssignCancel={() => setAssignTicketId(null)}
    />
  );
}
