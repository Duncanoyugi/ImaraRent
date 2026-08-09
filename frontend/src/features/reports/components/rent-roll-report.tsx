import { ReportViewer, ReportSummaryCards } from './report-viewer';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import type { RentRollReport } from '../types/report.types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface RentRollReportProps {
  data: RentRollReport;
  isLoading?: boolean;
}

export const RentRollReportView = ({ data, isLoading = false }: RentRollReportProps) => {
  if (!data) return null;

  const { metadata, summary, properties } = data;

  const summaryItems = [
    {
      label: 'Total Units',
      value: summary.totalUnits,
      variant: 'info' as const,
    },
    {
      label: 'Occupied Units',
      value: summary.occupiedUnits,
      variant: 'success' as const,
    },
    {
      label: 'Vacant Units',
      value: summary.vacantUnits,
      variant: summary.vacantUnits > 0 ? ('warning' as const) : ('success' as const),
    },
    {
      label: 'Occupancy Rate',
      value: formatPercentage(summary.occupancyRate),
      variant: summary.occupancyRate > 80 ? ('success' as const) : ('warning' as const),
    },
    {
      label: 'Total Monthly Rent',
      value: formatCurrency(summary.totalMonthlyRent),
      variant: 'info' as const,
    },
    {
      label: 'Average Rent',
      value: formatCurrency(summary.averageRent),
      variant: 'default' as const,
    },
  ];

  return (
    <ReportViewer
      title="Rent Roll"
      subtitle="Current rental income summary"
      isLoading={isLoading}
      metadata={metadata}
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <ReportSummaryCards items={summaryItems} />

        {/* Property Details */}
        {properties.map((property) => (
          <div key={property.propertyId}>
            <h4 className="mb-3 text-sm font-medium text-neutral-900 dark:text-white">
              {property.propertyName}
            </h4>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Unit</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead className="text-right">Rent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Lease Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {property.units.map((unit) => (
                    <TableRow key={unit.unitId}>
                      <TableCell className="font-medium">{unit.unitNumber}</TableCell>
                      <TableCell>{unit.tenantName || '-'}</TableCell>
                      <TableCell className="text-right">{formatCurrency(unit.rentAmount)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            unit.status === 'OCCUPIED'
                              ? 'success'
                              : unit.status === 'VACANT'
                              ? 'default'
                              : 'warning'
                          }
                        >
                          {unit.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {unit.leaseStatus ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="default">No Lease</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ))}
      </div>
    </ReportViewer>
  );
};