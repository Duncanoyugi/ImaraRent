import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TenantForm } from '@/features/tenants/components/tenant-form';
import { useCreateTenant } from '@/features/tenants/hooks/use-tenants';
import { useUnits } from '@/features/units/hooks/use-units';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NewTenantPage() {
  const navigate = useNavigate();
  const createTenant = useCreateTenant();
  const { data: units } = useUnits();

  const vacantUnits = units?.filter(u => u.status === 'VACANT') || [];

  const handleSubmit = (data: any) => {
    createTenant.mutate(data, {
      onSuccess: (tenant) => {
        navigate(`/tenants/${tenant.id}`);
      },
    });
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/tenants')}
          className="h-9 w-9 shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Add New Tenant
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Create a tenant and send them an invitation
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader className="border-b border-neutral-100 px-6 py-5 dark:border-neutral-800">
          <CardTitle className="text-base">Tenant Information</CardTitle>
          <CardDescription>
            Fill in the details below to create a tenant and send an invitation.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <TenantForm
            onSubmit={handleSubmit}
            isLoading={createTenant.isPending}
            submitLabel="Create & Send Invitation"
            units={vacantUnits}
          />
        </CardContent>
      </Card>
    </div>
  );
}