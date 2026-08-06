import { useParams, useNavigate } from 'react-router-dom';
import { TenantForm } from '@/features/tenants/components/tenant-form';
import { useTenant, useUpdateTenant } from '@/features/tenants/hooks/use-tenants';
import { useUnits } from '@/features/units/hooks/use-units';
import { PageLoader } from '@/components/shared/page-loader';

export default function TenantEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: tenant, isLoading, error } = useTenant(id!);
  const updateTenant = useUpdateTenant();
  const { data: units } = useUnits();

  if (isLoading) {
    return <PageLoader />;
  }

  if (error || !tenant) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-error-500">Failed to load tenant</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {(error as Error)?.message || 'Tenant not found'}
          </p>
        </div>
      </div>
    );
  }

  const vacantUnits = units?.filter(u => u.status === 'VACANT') || [];

  const handleSubmit = (data: any) => {
    updateTenant.mutate({ id: tenant.id, data }, {
      onSuccess: () => {
        navigate(`/tenants/${tenant.id}`);
      },
    });
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => navigate('/tenants')}
          className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <span className="text-xl">&larr;</span>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Edit Tenant
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Update tenant information for {tenant.firstName} {tenant.lastName}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div className="border-b border-neutral-100 px-6 py-5 dark:border-neutral-800">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
            Tenant Information
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Update the details below
          </p>
        </div>
        <div className="p-6">
          <TenantForm
            onSubmit={handleSubmit}
            isLoading={updateTenant.isPending}
            submitLabel="Update Tenant"
            initialData={{
              firstName: tenant.firstName,
              lastName: tenant.lastName,
              email: tenant.email,
              phone: tenant.phone,
              nationalId: tenant.nationalId || '',
              dateOfBirth: tenant.dateOfBirth || '',
              unitId: tenant.unit?.id || '',
            }}
            units={vacantUnits}
            hideUnitSelect
          />
        </div>
      </div>
    </div>
  );
}
