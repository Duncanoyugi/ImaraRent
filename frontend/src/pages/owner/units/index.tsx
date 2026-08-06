import { useUnits, useDeleteUnit } from '@/features/units/hooks/use-units';
import { UnitList } from '@/features/units/components/unit-list';
import { PageLoader } from '@/components/shared/page-loader';

export default function UnitsPage() {
  const { data: units, isLoading } = useUnits();
  const deleteUnit = useDeleteUnit();

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <UnitList
      units={units || []}
      isLoading={isLoading}
      onDelete={(id) => {
        if (window.confirm('Are you sure you want to delete this unit?')) {
          deleteUnit.mutate(id);
        }
      }}
    />
  );
}