import { PropertyList } from '@/features/properties/components/property-list';
import { useProperties } from '@/features/properties/hooks/use-properties';
import { PageLoader } from '@/components/shared/page-loader';

export default function ManagerPropertiesPage() {
  const { data: properties, isLoading } = useProperties();

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <PropertyList
      properties={properties || []}
      isLoading={isLoading}
    />
  );
}