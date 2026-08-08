import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LeaseForm, type LeaseFormData } from '@/features/leases/components/lease-form';
import { useCreateLease } from '@/features/leases/hooks/use-leases';
import { useTenants } from '@/features/tenants/hooks/use-tenants';
import { useUnits } from '@/features/units/hooks/use-units';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { showToast } from '@/app/providers/toast-provider';

export default function NewLeasePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tenantId = searchParams.get('tenantId') || undefined;
  const unitId = searchParams.get('unitId') || undefined;

  const createLease = useCreateLease();
  const { data: tenants, error: tenantsError } = useTenants({ status: 'ACTIVE' });
  const { data: units, error: unitsError } = useUnits();

  const availableUnits = units?.filter(u => u.status === 'VACANT' || u.status === 'RESERVED') || [];
  const activeTenants = tenants?.filter(t => t.status === 'ACTIVE' && t.hasUserAccount) || [];

  const handleSubmit = (data: LeaseFormData) => {
    console.log('Lease form submitted:', data);
    createLease.mutate(data, {
      onSuccess: (lease) => {
        console.log('Lease created successfully:', lease);
        if (lease?.id) {
          navigate(`/leases/${lease.id}`);
        } else {
          navigate('/leases');
        }
      },
      onError: (error) => {
        console.error('Create lease error:', error);
        const message = error?.response?.data?.message || 'Failed to create lease';
        showToast.error('Creation Failed', message);
      },
    });
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/leases')}
          className="h-9 w-9 shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Create New Lease
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Create a lease agreement between a tenant and a unit
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b border-neutral-100 px-6 py-5 dark:border-neutral-800">
          <CardTitle className="text-base">Lease Information</CardTitle>
          <CardDescription>
            Fill in the details below to create a new lease.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {(tenantsError || unitsError) && (
            <div className="mb-4 rounded-md bg-error-50 p-4 text-sm text-error-500 dark:bg-error-500/10">
              Failed to load required data. Please refresh the page.
            </div>
          )}
          <LeaseForm
            onSubmit={handleSubmit}
            isLoading={createLease.isPending}
            submitLabel="Create Lease"
            tenants={activeTenants}
            units={availableUnits}
            selectedTenantId={tenantId}
            selectedUnitId={unitId}
          />
        </CardContent>
      </Card>
    </div>
  );
}