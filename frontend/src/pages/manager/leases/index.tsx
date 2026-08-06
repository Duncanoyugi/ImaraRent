import { useLeases } from '@/features/leases/hooks/use-leases';
import { LeaseList } from '@/features/leases/components/lease-list';
import { PageLoader } from '@/components/shared/page-loader';

export default function ManagerLeasesPage() {
  const { data: leases, isLoading } = useLeases();

  if (isLoading) {
    return <PageLoader />;
  }

  return <LeaseList leases={leases || []} isLoading={isLoading} />;
}