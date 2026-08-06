import { useTenants, useResendInvitation, useCancelInvitation } from '@/features/tenants/hooks/use-tenants';
import { TenantList } from '@/features/tenants/components/tenant-list';
import { PageLoader } from '@/components/shared/page-loader';

export default function ManagerTenantsPage() {
  const { data: tenants, isLoading } = useTenants();
  const resendInvitation = useResendInvitation();
  const cancelInvitation = useCancelInvitation();

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <TenantList
      tenants={tenants || []}
      isLoading={isLoading}
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