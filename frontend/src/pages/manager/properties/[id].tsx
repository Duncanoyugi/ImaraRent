import { useParams } from 'react-router-dom';
import { PropertyDetails } from '@/features/properties/components/property-details';
import { useProperty } from '@/features/properties/hooks/use-properties';
import { PageLoader } from '@/components/shared/page-loader';
import { ApiError } from '@/components/errors/api-error';

/**
 * Manager view of a property.
 *
 * Same detail component as the owner sees — scoping is enforced by the API,
 * which only returns properties assigned to this manager — but without the
 * delete action, which is owner-only server-side.
 */
export default function ManagerPropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: property, isLoading, error, refetch } = useProperty(id!);

  if (isLoading) return <PageLoader />;
  if (error) return <ApiError error={error} onRetry={() => refetch()} />;
  if (!property) return <ApiError error={new Error('Property not found')} />;

  return <PropertyDetails property={property} />;
}
