import { useParams } from 'react-router-dom';
import { UnitDetails } from '@/features/units/components/unit-details';
import { useUnit } from '@/features/units/hooks/use-unit';
import { PageLoader } from '@/components/shared/page-loader';
import { ApiError } from '@/components/errors/api-error';

export default function ManagerUnitDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: unit, isLoading, error, refetch } = useUnit(id!);

  if (isLoading) return <PageLoader />;
  if (error) return <ApiError error={error} onRetry={() => refetch()} />;
  if (!unit) return <ApiError error={new Error('Unit not found')} />;

  return <UnitDetails unit={unit} />;
}