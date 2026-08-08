import { useState } from 'react';
import { useTickets, useUpdateTicket } from '@/features/maintenance/hooks/use-maintenance';
import { TicketList } from '@/features/maintenance/components/ticket-list';
import { PageLoader } from '@/components/shared/page-loader';
import { useUsers } from '@/features/users/hooks/use-users';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TicketAssignForm } from '@/features/maintenance/components/ticket-assign-form';

export default function OwnerMaintenancePage() {
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const { data: tickets, isLoading } = useTickets();
  const { data: users, isLoading: usersLoading } = useUsers();
  const updateTicket = useUpdateTicket();

  const handleAssign = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setAssignDialogOpen(true);
  };

  const handleAssignSubmit = (data: { assignedToId: string }) => {
    if (selectedTicketId) {
      updateTicket.mutate({
        id: selectedTicketId,
        data: { assignedToId: data.assignedToId, status: 'ASSIGNED' },
      }, {
        onSuccess: () => {
          setAssignDialogOpen(false);
          setSelectedTicketId(null);
        },
      });
    }
  };

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

  if (isLoading || usersLoading) {
    return <PageLoader />;
  }

  const assignableUsers = users?.filter(u => u.role === 'MANAGER' || u.role === 'OWNER') || [];

  return (
    <>
      <TicketList
        tickets={tickets || []}
        isLoading={isLoading}
        showCreate={true}
        onAssign={handleAssign}
        onComplete={handleComplete}
        onStatusChange={handleStatusChange}
      />

      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Ticket</DialogTitle>
            <DialogDescription>
              Assign this ticket to a manager or owner for resolution.
            </DialogDescription>
          </DialogHeader>
          <TicketAssignForm
            users={assignableUsers}
            onSubmit={handleAssignSubmit}
            isLoading={updateTicket.isPending}
            onCancel={() => {
              setAssignDialogOpen(false);
              setSelectedTicketId(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}