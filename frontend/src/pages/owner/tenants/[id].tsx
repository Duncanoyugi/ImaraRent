import { useParams, useNavigate } from 'react-router-dom';
import { TenantDetails } from '@/features/tenants/components/tenant-details';
import { useTenant, useDeleteTenant, useResendInvitation, useCancelInvitation } from '@/features/tenants/hooks/use-tenants';
import { PageLoader } from '@/components/shared/page-loader';

export default function TenantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: tenant, isLoading, error } = useTenant(id!);
  const deleteTenant = useDeleteTenant();
  const resendInvitation = useResendInvitation();
  const cancelInvitation = useCancelInvitation();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this tenant?')) {
      deleteTenant.mutate(id!, {
        onSuccess: () => navigate('/tenants'),
      });
    }
  };

  const handleResend = () => {
    if (window.confirm('Resend invitation to this tenant?')) {
      resendInvitation.mutate(id!);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Cancel this invitation?')) {
      cancelInvitation.mutate({ tenantId: id! });
    }
  };

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

  return (
    <TenantDetails
      tenant={tenant}
      onResend={tenant.status === 'PENDING' ? handleResend : undefined}
      onCancel={tenant.status === 'PENDING' ? handleCancel : undefined}
      onDelete={handleDelete}
    />
  );
}