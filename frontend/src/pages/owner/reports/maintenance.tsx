import { ReportFilters } from '@/features/reports/components/report-filters';
import { MaintenanceReportView } from '@/features/reports/components/maintenance-report';
import { useMaintenanceReport } from '@/features/reports/hooks/use-reports';
import type { ReportRequest } from '@/features/reports/types/report.types';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { PageLoader } from '@/components/shared/page-loader';

export default function MaintenanceReportPage() {
  const navigate = useNavigate();
  const maintenanceReport = useMaintenanceReport();

  const handleGenerate = (data: ReportRequest) => {
    maintenanceReport.mutate(data);
  };

  const isLoading = maintenanceReport.isPending;

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
            Maintenance Report
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Maintenance ticket summary
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
      ) : maintenanceReport.data ? (
        <MaintenanceReportView
          data={maintenanceReport.data}
          isLoading={isLoading}
        />
      ) : (
        <div className="flex h-[200px] items-center justify-center rounded-lg border-2 border-dashed border-neutral-200 dark:border-neutral-800">
          <p className="text-neutral-500 dark:text-neutral-400">
            Select filters and click "Generate Report" to view the maintenance report
          </p>
        </div>
      )}
    </div>
  );
}