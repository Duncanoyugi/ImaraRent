import { useParams } from 'react-router-dom';
import { PropertyDetails } from '@/features/properties/components/property-details';
import { useProperty } from '@/features/properties/hooks/use-properties';
import { PageLoader } from '@/components/shared/page-loader';

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: property, isLoading, error } = useProperty(id!);

  if (isLoading) {
    return <PageLoader />;
  }

  if (error || !property) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-error-500">Failed to load property</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {(error as Error)?.message || 'Property not found'}
          </p>
        </div>
      </div>
    );
  }

  return <PropertyDetails property={property} />;
}