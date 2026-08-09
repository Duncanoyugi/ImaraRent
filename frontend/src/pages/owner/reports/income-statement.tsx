import { AppLayout } from '@/components/layout/app-layout';
import { ReportFilters } from '@/features/reports/components/report-filters';
import { IncomeStatementReportView } from '@/features/reports/components/income-statement-report';
import { useIncomeStatement } from '@/features/reports/hooks/use-reports';
import type { ReportRequest } from '@/features/reports/types/report.types';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { PageLoader } from '@/components/shared/page-loader';

export default function IncomeStatementPage() {
  const navigate = useNavigate();
  const incomeStatement = useIncomeStatement();

  const handleGenerate = (data: ReportRequest) => {
    incomeStatement.mutate(data);
  };

  const isLoading = incomeStatement.isPending;

  return (
    <AppLayout>
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
              Income Statement
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Revenue summary and collection rates
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
        ) : incomeStatement.data ? (
          <IncomeStatementReportView
            data={incomeStatement.data}
            isLoading={isLoading}
          />
        ) : (
          <div className="flex h-[200px] items-center justify-center rounded-lg border-2 border-dashed border-neutral-200 dark:border-neutral-800">
            <p className="text-neutral-500 dark:text-neutral-400">
              Select filters and click "Generate Report" to view the income statement
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}