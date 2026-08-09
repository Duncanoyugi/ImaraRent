import { ReportViewer, ReportSummaryCards } from './report-viewer';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import type { IncomeStatementReport } from '../types/report.types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface IncomeStatementReportProps {
  data: IncomeStatementReport;
  isLoading?: boolean;
}

export const IncomeStatementReportView = ({ data, isLoading = false }: IncomeStatementReportProps) => {
  if (!data) return null;

  const { metadata, summary, monthlyBreakdown, propertyBreakdown } = data;

  const summaryItems = [
    {
      label: 'Total Rent Collected',
      value: formatCurrency(summary.totalRentCollected),
      variant: 'success' as const,
    },
    {
      label: 'Total Rent Expected',
      value: formatCurrency(summary.totalRentExpected),
      variant: 'info' as const,
    },
    {
      label: 'Collection Rate',
      value: formatPercentage(summary.collectionRate),
      variant: summary.collectionRate > 80 ? ('success' as const) : ('warning' as const),
    },
    {
      label: 'Net Income',
      value: formatCurrency(summary.netIncome),
      variant: summary.netIncome > 0 ? ('success' as const) : ('error' as const),
    },
  ];

  return (
    <ReportViewer
      title="Income Statement"
      subtitle="Revenue summary for the selected period"
      isLoading={isLoading}
      metadata={metadata}
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <ReportSummaryCards items={summaryItems} />

        {/* Monthly Breakdown */}
        <div>
          <h4 className="mb-3 text-sm font-medium text-neutral-900 dark:text-white">
            Monthly Breakdown
          </h4>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Expected</TableHead>
                  <TableHead className="text-right">Collected</TableHead>
                  <TableHead className="text-right">Late Fees</TableHead>
                  <TableHead className="text-right">Utilities</TableHead>
                  <TableHead className="text-right">Collection Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyBreakdown.map((month) => (
                  <TableRow key={month.month}>
                    <TableCell className="font-medium">{month.month}</TableCell>
                    <TableCell className="text-right">{formatCurrency(month.expected)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(month.collected)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(month.lateFees)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(month.utilities)}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={month.collectionRate > 80 ? 'success' : 'warning'}
                      >
                        {formatPercentage(month.collectionRate)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
                  <TableHead className="text-right">Expected</TableHead>
                  <TableHead className="text-right">Collected</TableHead>
                  <TableHead className="text-right">Collection Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {propertyBreakdown.map((property) => (
                  <TableRow key={property.propertyId}>
                    <TableCell className="font-medium">{property.propertyName}</TableCell>
                    <TableCell className="text-right">{formatCurrency(property.expected)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(property.collected)}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={property.collectionRate > 80 ? 'success' : 'warning'}
                      >
                        {formatPercentage(property.collectionRate)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </ReportViewer>
  );
};