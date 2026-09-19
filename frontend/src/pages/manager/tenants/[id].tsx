import { useParams } from 'react-router-dom';
import { TenantDetails } from '@/features/tenants/components/tenant-details';
import {
  useTenant,
  useResendInvitation,
  useCancelInvitation,
} from '@/features/tenants/hooks/use-tenants';
import { PageLoader } from '@/components/shared/page-loader';
import { ApiError } from '@/components/errors/api-error';

/**
 * Manager view of a tenant.
 *
 * Invitations can be resent or cancelled, but no delete handler is passed —
 * removing a tenant record is reserved for owners.
 */
export default function ManagerTenantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: tenant, isLoading, error, refetch } = useTenant(id!);
  const resendInvitation = useResendInvitation();
  const cancelInvitation = useCancelInvitation();

  if (isLoading) return <PageLoader />;
  if (error) return <ApiError error={error} onRetry={() => refetch()} />;
  if (!tenant) return <ApiError error={new Error('Tenant not found')} />;

  return (
    <TenantDetails
      tenant={tenant}
      onResend={() => resendInvitation.mutate(tenant.id)}
      onCancel={() => cancelInvitation.mutate({ tenantId: tenant.id })}
    />
  );
}
