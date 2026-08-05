import { PropertyList } from '@/features/properties/components/property-list';
import { useProperties, useDeleteProperty } from '@/features/properties/hooks/use-properties';
import { PageLoader } from '@/components/shared/page-loader';

export default function PropertiesPage() {
  const { data: properties, isLoading } = useProperties();
  const deleteProperty = useDeleteProperty();

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <PropertyList
      properties={properties || []}
      isLoading={isLoading}
      onDelete={(id) => {
        if (window.confirm('Are you sure you want to delete this property?')) {
          deleteProperty.mutate(id);
        }
      }}
    />
  );
}