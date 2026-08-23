import { useTenantLease } from '@/features/tenant-dashboard/hooks/use-tenant-dashboard';
import { PageLoader } from '@/components/shared/page-loader';
import { LeaseDetails } from '@/features/leases/components/lease-details';
import { Home } from 'lucide-react';

export default function TenantLeasePage() {
  const { data: lease, isLoading } = useTenantLease();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!lease) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <Home className="mx-auto h-12 w-12 text-neutral-400" />
          <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-white">
            No Active Lease
          </h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            You don't have an active lease at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <LeaseDetails lease={lease} backPath="/lease" showOwnerLinks={false} />
    </div>
  );
}
