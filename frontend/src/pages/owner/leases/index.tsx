import { useLeases, useActivateLease, useTerminateLease } from '@/features/leases/hooks/use-leases';
import { LeaseList } from '@/features/leases/components/lease-list';
import { PageLoader } from '@/components/shared/page-loader';

export default function LeasesPage() {
  const { data: leases, isLoading } = useLeases();
  const activateLease = useActivateLease();
  const terminateLease = useTerminateLease();

  const handleActivate = (id: string) => {
    if (window.confirm('Activate this lease? This will occupy the unit.')) {
      activateLease.mutate(id);
    }
  };

  const handleTerminate = (id: string) => {
    const reason = window.prompt('Reason for termination (optional):');
    if (reason !== null) {
      terminateLease.mutate({ id, reason: reason || undefined });
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <LeaseList
      leases={leases || []}
      isLoading={isLoading}
      onActivate={handleActivate}
      onTerminate={handleTerminate}
    />
  );
}