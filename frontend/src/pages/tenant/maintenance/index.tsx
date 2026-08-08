import { useMyTickets } from '@/features/maintenance/hooks/use-maintenance';
import { TicketList } from '@/features/maintenance/components/ticket-list';
import { PageLoader } from '@/components/shared/page-loader';

export default function TenantMaintenancePage() {
  const { data: tickets, isLoading } = useMyTickets();

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <TicketList
      tickets={tickets || []}
      isLoading={isLoading}
      showCreate={true}
    />
  );
}
