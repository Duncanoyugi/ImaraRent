import { useParams } from 'react-router-dom';
import { UnitDetails } from '@/features/units/components/unit-details';
import { useUnit } from '@/features/units/hooks/use-units';
import { PageLoader } from '@/components/shared/page-loader';

export default function UnitDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: unit, isLoading, error } = useUnit(id!);

  if (isLoading) {
    return <PageLoader />;
  }

  if (error || !unit) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-error-500">Failed to load unit</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {(error as Error)?.message || 'Unit not found'}
          </p>
        </div>
      </div>
    );
  }

  return <UnitDetails unit={unit} />;
}
