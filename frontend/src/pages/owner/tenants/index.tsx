import { useTenants, useDeleteTenant, useResendInvitation, useCancelInvitation } from '@/features/tenants/hooks/use-tenants';
import { TenantList } from '@/features/tenants/components/tenant-list';
import { PageLoader } from '@/components/shared/page-loader';

export default function TenantsPage() {
  const { data: tenants, isLoading } = useTenants();
  const deleteTenant = useDeleteTenant();
  const resendInvitation = useResendInvitation();
  const cancelInvitation = useCancelInvitation();

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <TenantList
      tenants={tenants || []}
      isLoading={isLoading}
      onDelete={(id) => {
        if (window.confirm('Are you sure you want to delete this tenant?')) {
          deleteTenant.mutate(id);
        }
      }}
      onResend={(id) => {
        if (window.confirm('Resend invitation to this tenant?')) {
          resendInvitation.mutate(id);
        }
      }}
      onCancel={(id) => {
        if (window.confirm('Cancel this invitation?')) {
          cancelInvitation.mutate({ tenantId: id });
        }
      }}
    />
  );
}