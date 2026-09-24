import { ReportFilters } from '@/features/reports/components/report-filters';
import { ArrearsAgingReportView } from '@/features/reports/components/arrears-aging-report';
import { useArrearsAging } from '@/features/reports/hooks/use-reports';
import type { ReportRequest } from '@/features/reports/types/report.types';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { PageLoader } from '@/components/shared/page-loader';

export default function ArrearsAgingPage() {
  const navigate = useNavigate();
  const arrearsAging = useArrearsAging();

  const handleGenerate = (data: ReportRequest) => {
    arrearsAging.mutate(data);
  };

  const isLoading = arrearsAging.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/reports')}
          className="h-9 w-9 shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Arrears Aging
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Outstanding balances by age
          </p>
        </div>
      </div>

      <ReportFilters
        onGenerate={handleGenerate}
        isLoading={isLoading}
        defaultPeriod="MONTH"
      />

      {isLoading ? (
        <PageLoader />
      ) : arrearsAging.data ? (
        <ArrearsAgingReportView
          data={arrearsAging.data}
          isLoading={isLoading}
        />
      ) : (
        <div className="flex h-[200px] items-center justify-center rounded-lg border-2 border-dashed border-neutral-200 dark:border-neutral-800">
          <p className="text-neutral-500 dark:text-neutral-400">
            Select filters and click "Generate Report" to view the arrears aging
          </p>
        </div>
      )}
    </div>
  );
}