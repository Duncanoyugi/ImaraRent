import { useAuth } from '@/features/auth/hooks/use-auth';
import { useTenantByUnit } from '@/features/tenants/hooks/use-tenants';
import { useLease } from '@/features/leases/hooks/use-leases';
import { AppLayout } from '@/components/layout/app-layout';
import { PageLoader } from '@/components/shared/page-loader';
import { LeaseDetails } from '@/features/leases/components/lease-details';
import { Home } from 'lucide-react';

export default function TenantLeasePage() {
  const { user } = useAuth();

  // Get tenant profile
  const tenantProfile = user?.tenantProfile;
  
  // Get tenant details including unit
  const { data: tenant, isLoading: tenantLoading } = useTenantByUnit(
    tenantProfile?.unitId || ''
  );

  // Get active lease
  const activeLeaseId = tenant?.activeLease?.id;
  const { data: lease, isLoading: leaseLoading } = useLease(
    activeLeaseId || ''
  );

  const isLoading = tenantLoading || leaseLoading;

  if (isLoading) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }

  if (!tenant || !lease) {
    return (
      <AppLayout>
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
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="rounded-2xl bg-gradient-to-r from-brand-600 to-brand-400 p-6 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">My Lease</h1>
              <p className="text-brand-50">
                {tenant.unit?.property?.name} - Unit {tenant.unit?.number}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-lg bg-white/20 px-3 py-1.5">
                <span className="text-sm font-medium">
                  {tenant.unit?.property?.address}
                </span>
              </div>
            </div>
          </div>
        </div>

        <LeaseDetails lease={lease} />
      </div>
    </AppLayout>
  );
}