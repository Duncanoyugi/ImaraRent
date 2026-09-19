import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LeaseForm } from '@/features/leases/components/lease-form';
import { useCreateLease } from '@/features/leases/hooks/use-leases';
import { useTenants } from '@/features/tenants/hooks/use-tenants';
import { useUnits } from '@/features/units/hooks/use-units';

/**
 * Manager lease creation.
 *
 * A manager may draft a lease but not activate it — activation is an
 * owner-only operation on the API — so the new lease lands in DRAFT and the
 * owner takes it from there.
 */
export default function ManagerNewLeasePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const createLease = useCreateLease();
  const { data: tenants } = useTenants();
  const { data: units } = useUnits();

  const presetUnitId = searchParams.get('unitId') ?? undefined;
  const presetTenantId = searchParams.get('tenantId') ?? undefined;

  return (
    <div className="mx-auto max-w-3xl">
      <Button variant="ghost" size="sm" className="mb-4 gap-2" onClick={() => navigate('/leases')}>
        <ArrowLeft className="h-4 w-4" />
        Back to leases
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create a lease</CardTitle>
          <CardDescription>
            Saved as a draft. An owner activates it once everything is agreed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LeaseForm
            tenants={tenants ?? []}
            units={units ?? []}
            selectedUnitId={presetUnitId}
            selectedTenantId={presetTenantId}
            isLoading={createLease.isPending}
            submitLabel="Save as draft"
            onSubmit={(values) =>
              createLease.mutate(values, {
                onSuccess: () => navigate('/leases'),
              })
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
