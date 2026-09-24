import { useParams } from 'react-router-dom';
import { LeaseDetails } from '@/features/leases/components/lease-details';
import { useLease } from '@/features/leases/hooks/use-leases';
import { PageLoader } from '@/components/shared/page-loader';

export default function ManagerLeaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: lease, isLoading, error } = useLease(id!);

  if (isLoading) return <PageLoader />;
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

  return <LeaseDetails lease={lease} />;
}