import { useUnits } from '@/features/units/hooks/use-units';
import { UnitList } from '@/features/units/components/unit-list';
import { PageLoader } from '@/components/shared/page-loader';

export default function ManagerUnitsPage() {
  const { data: units, isLoading } = useUnits();

  if (isLoading) {
    return <PageLoader />;
  }

  return <UnitList units={units || []} isLoading={isLoading} />;
}