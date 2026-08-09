import { ReportViewer, ReportSummaryCards } from './report-viewer';
import { formatCurrency } from '@/lib/formatters';
import type { ArrearsAgingReport } from '../types/report.types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface ArrearsAgingReportProps {
  data: ArrearsAgingReport;
  isLoading?: boolean;
}

export const ArrearsAgingReportView = ({ data, isLoading = false }: ArrearsAgingReportProps) => {
  if (!data) return null;

  const { metadata, summary, agingBuckets, tenants } = data;

  const summaryItems = [
    {
      label: 'Total Arrears',
      value: formatCurrency(summary.totalArrears),
      variant: summary.totalArrears > 0 ? ('error' as const) : ('success' as const),
    },
    {
      label: 'Total Tenants',
      value: summary.totalTenants,
      variant: 'info' as const,
    },
    {
      label: 'Tenants with Arrears',
      value: summary.tenantsWithArrears,
      variant: summary.tenantsWithArrears > 0 ? ('warning' as const) : ('success' as const),
    },
  ];

  return (
    <ReportViewer
      title="Arrears Aging"
      subtitle="Outstanding balances by age"
      isLoading={isLoading}
      metadata={metadata}
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <ReportSummaryCards items={summaryItems} />

        {/* Aging Buckets */}
        <div>
          <h4 className="mb-3 text-sm font-medium text-neutral-900 dark:text-white">
            Aging Summary
          </h4>
          <div className="grid gap-3 sm:grid-cols-4">
            {agingBuckets.map((bucket) => (
              <div
                key={bucket.bucket}
                className={`rounded-lg border p-3 ${
                  bucket.bucket === '90+ Days'
                    ? 'border-error-200 bg-error-50 dark:border-error-800 dark:bg-error-950/20'
                    : bucket.bucket === '61-90 Days'
                    ? 'border-warning-200 bg-warning-50 dark:border-warning-800 dark:bg-warning-950/20'
                    : 'border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800/50'
                }`}
              >
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {bucket.bucket}
                </p>
                <p className="text-xl font-bold text-neutral-900 dark:text-white">
                  {formatCurrency(bucket.amount)}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {bucket.tenantCount} tenant{bucket.tenantCount !== 1 ? 's' : ''}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tenant Details */}
        <div>
          <h4 className="mb-3 text-sm font-medium text-neutral-900 dark:text-white">
            Tenant Details
          </h4>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead className="text-right">Total Due</TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead className="text-right">Days Overdue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.map((tenant) => (
                  <TableRow key={tenant.tenantId}>
                    <TableCell className="font-medium">{tenant.tenantName}</TableCell>
                    <TableCell>{tenant.propertyName}</TableCell>
                    <TableCell>{tenant.unitNumber}</TableCell>
                    <TableCell className="text-right">{formatCurrency(tenant.totalDue)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(tenant.totalPaid)}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={tenant.balance > 0 ? 'error' : 'success'}>
                        {formatCurrency(tenant.balance)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {tenant.daysOverdue > 0 ? (
                        <Badge variant={tenant.daysOverdue > 60 ? 'error' : 'warning'}>
                          {tenant.daysOverdue} days
                        </Badge>
                      ) : (
                        '-'
                      )}
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