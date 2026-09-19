import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TenantForm } from '@/features/tenants/components/tenant-form';
import { useCreateTenant } from '@/features/tenants/hooks/use-tenants';
import { useUnits } from '@/features/units/hooks/use-units';

/**
 * Manager tenant intake. `useUnits` returns only units in the properties this
 * manager is assigned to, so the unit picker is scoped without extra work.
 */
export default function ManagerNewTenantPage() {
  const navigate = useNavigate();
  const createTenant = useCreateTenant();
  const { data: units } = useUnits();

  return (
    <div className="mx-auto max-w-3xl">
      <Button variant="ghost" size="sm" className="mb-4 gap-2" onClick={() => navigate('/tenants')}>
        <ArrowLeft className="h-4 w-4" />
        Back to tenants
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Add a tenant</CardTitle>
          <CardDescription>
            They receive an email invitation and choose their own password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TenantForm
            units={units ?? []}
            isLoading={createTenant.isPending}
            submitLabel="Send invitation"
            onSubmit={(values) =>
              createTenant.mutate(
                {
                  ...values,
                  // The form models optional fields as nullable; the API
                  // expects them simply absent.
                  nationalId: values.nationalId ?? undefined,
                  dateOfBirth: values.dateOfBirth ?? undefined,
                },
                { onSuccess: () => navigate('/tenants') }
              )
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
