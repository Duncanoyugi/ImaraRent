import { useParams, useNavigate } from 'react-router-dom';
import { LeaseForm } from '@/features/leases/components/lease-form';
import { useLease, useUpdateLease } from '@/features/leases/hooks/use-leases';
import { useTenants } from '@/features/tenants/hooks/use-tenants';
import { useUnits } from '@/features/units/hooks/use-units';
import { PageLoader } from '@/components/shared/page-loader';

export default function LeaseEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: lease, isLoading, error } = useLease(id!);
  const updateLease = useUpdateLease();
  const { data: tenants } = useTenants({ status: 'ACTIVE' });
  const { data: units } = useUnits();

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

  const activeTenants = tenants?.filter(t => t.status === 'ACTIVE' && t.hasUserAccount) || [];
  const availableUnits = units?.filter(u => u.status === 'VACANT' || u.status === 'RESERVED') || [];

  const handleSubmit = (data: any) => {
    updateLease.mutate({ id: lease.id, data }, {
      onSuccess: () => {
        navigate(`/leases/${lease.id}`);
      },
    });
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => navigate('/leases')}
          className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <span className="text-xl">&larr;</span>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Edit Lease
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Update lease agreement for {lease.tenant?.firstName} {lease.tenant?.lastName}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div className="border-b border-neutral-100 px-6 py-5 dark:border-neutral-800">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
            Lease Information
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Update the details below
          </p>
        </div>
        <div className="p-6">
          <LeaseForm
            onSubmit={handleSubmit}
            isLoading={updateLease.isPending}
            submitLabel="Update Lease"
            initialData={{
              startDate: lease.startDate,
              endDate: lease.endDate || '',
              rentAmount: lease.rentAmount,
              depositAmount: lease.depositAmount || 0,
              tenantId: lease.tenantId,
              unitId: lease.unitId,
            }}
            tenants={activeTenants}
            units={availableUnits}
            hideTenantSelect
            hideUnitSelect
          />
        </div>
      </div>
    </div>
  );
}
