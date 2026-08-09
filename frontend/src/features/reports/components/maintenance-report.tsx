import { ReportViewer, ReportSummaryCards } from './report-viewer';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import type { MaintenanceReport } from '../types/report.types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface MaintenanceReportProps {
  data: MaintenanceReport;
  isLoading?: boolean;
}

export const MaintenanceReportView = ({ data, isLoading = false }: MaintenanceReportProps) => {
  if (!data) return null;

  const { metadata, summary, priorityBreakdown, propertyBreakdown } = data;

  const summaryItems = [
    {
      label: 'Total Tickets',
      value: summary.totalTickets,
      variant: 'info' as const,
    },
    {
      label: 'Open Tickets',
      value: summary.openTickets,
      variant: summary.openTickets > 0 ? ('warning' as const) : ('success' as const),
    },
    {
      label: 'Completed',
      value: summary.completedTickets,
      variant: 'success' as const,
    },
    {
      label: 'Avg Resolution Time',
      value: `${summary.averageResolutionTime.toFixed(1)} hrs`,
      variant: summary.averageResolutionTime < 24 ? ('success' as const) : ('warning' as const),
    },
    {
      label: 'Total Cost',
      value: formatCurrency(summary.totalCost),
      variant: 'default' as const,
    },
  ];

  return (
    <ReportViewer
      title="Maintenance Report"
      subtitle="Maintenance ticket summary"
      isLoading={isLoading}
      metadata={metadata}
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <ReportSummaryCards items={summaryItems} />

        {/* Priority Breakdown */}
        <div>
          <h4 className="mb-3 text-sm font-medium text-neutral-900 dark:text-white">
            Priority Breakdown
          </h4>
          <div className="grid gap-3 sm:grid-cols-4">
            {priorityBreakdown.map((priority) => (
              <div
                key={priority.priority}
                className={`rounded-lg border p-3 ${
                  priority.priority === 'URGENT'
                    ? 'border-error-200 bg-error-50 dark:border-error-800 dark:bg-error-950/20'
                    : priority.priority === 'HIGH'
                    ? 'border-warning-200 bg-warning-50 dark:border-warning-800 dark:bg-warning-950/20'
                    : 'border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800/50'
                }`}
              >
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {priority.priority}
                </p>
                <p className="text-xl font-bold text-neutral-900 dark:text-white">
                  {priority.count}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Property Breakdown */}
        <div>
          <h4 className="mb-3 text-sm font-medium text-neutral-900 dark:text-white">
            Property Breakdown
          </h4>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead className="text-center">Total</TableHead>
                  <TableHead className="text-center">Open</TableHead>
                  <TableHead className="text-center">Completed</TableHead>
                  <TableHead className="text-center">Completion Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {propertyBreakdown.map((property) => {
                  const completionRate = property.total > 0
                    ? (property.completed / property.total) * 100
                    : 0;
                  return (
                    <TableRow key={property.propertyId}>
                      <TableCell className="font-medium">{property.propertyName}</TableCell>
                      <TableCell className="text-center">{property.total}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={property.open > 0 ? 'warning' : 'success'}>
                          {property.open}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="success">{property.completed}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={completionRate > 70 ? 'success' : 'warning'}>
                          {formatPercentage(completionRate)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </ReportViewer>
  );
};