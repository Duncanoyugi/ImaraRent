import { useParams, useNavigate } from 'react-router-dom';
import { LeaseDetails } from '@/features/leases/components/lease-details';
import { useLease, useActivateLease, useTerminateLease } from '@/features/leases/hooks/use-leases';
import { PageLoader } from '@/components/shared/page-loader';

export default function LeaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: lease, isLoading, error } = useLease(id!);
  const activateLease = useActivateLease();
  const terminateLease = useTerminateLease();

  const handleActivate = () => {
    if (window.confirm('Activate this lease? This will occupy the unit.')) {
      activateLease.mutate(id!, {
        onSuccess: () => navigate('/leases'),
      });
    }
  };

  const handleTerminate = () => {
    const reason = window.prompt('Reason for termination (optional):');
    if (reason !== null) {
      terminateLease.mutate({ id: id!, reason: reason || undefined });
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (error || !lease) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-error-500">Failed to load lease</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {(error as Error)?.message || 'Lease not found'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <LeaseDetails
      lease={lease}
      onActivate={lease.status === 'DRAFT' ? handleActivate : undefined}
      onTerminate={lease.isActive ? handleTerminate : undefined}
    />
  );
}
