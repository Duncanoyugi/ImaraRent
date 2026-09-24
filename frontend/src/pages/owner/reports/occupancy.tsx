import { ReportFilters } from '@/features/reports/components/report-filters';
import { OccupancyReportView } from '@/features/reports/components/occupancy-report';
import { useOccupancyReport } from '@/features/reports/hooks/use-reports';
import type { ReportRequest } from '@/features/reports/types/report.types';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { PageLoader } from '@/components/shared/page-loader';

export default function OccupancyPage() {
  const navigate = useNavigate();
  const occupancyReport = useOccupancyReport();

  const handleGenerate = (data: ReportRequest) => {
    occupancyReport.mutate(data);
  };

  const isLoading = occupancyReport.isPending;

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
            Occupancy Report
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Property occupancy rates
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
      ) : occupancyReport.data ? (
        <OccupancyReportView
          data={occupancyReport.data}
          isLoading={isLoading}
        />
      ) : (
        <div className="flex h-[200px] items-center justify-center rounded-lg border-2 border-dashed border-neutral-200 dark:border-neutral-800">
          <p className="text-neutral-500 dark:text-neutral-400">
            Select filters and click "Generate Report" to view the occupancy report
          </p>
        </div>
      )}
    </div>
  );
}