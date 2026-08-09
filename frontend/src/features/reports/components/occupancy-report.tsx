import { ReportViewer, ReportSummaryCards } from './report-viewer';
import { formatPercentage } from '@/lib/formatters';
import type { OccupancyReport } from '../types/report.types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface OccupancyReportProps {
  data: OccupancyReport;
  isLoading?: boolean;
}

export const OccupancyReportView = ({ data, isLoading = false }: OccupancyReportProps) => {
  if (!data) return null;

  const { metadata, summary, propertyDetails } = data;

  const summaryItems = [
    {
      label: 'Total Properties',
      value: summary.totalProperties,
      variant: 'info' as const,
    },
    {
      label: 'Total Units',
      value: summary.totalUnits,
      variant: 'info' as const,
    },
    {
      label: 'Occupancy Rate',
      value: formatPercentage(summary.occupancyRate),
      variant: summary.occupancyRate > 80 ? ('success' as const) : ('warning' as const),
    },
    {
      label: 'Vacancy Rate',
      value: formatPercentage(summary.vacancyRate),
      variant: summary.vacancyRate > 20 ? ('warning' as const) : ('success' as const),
    },
  ];

  return (
    <ReportViewer
      title="Occupancy Report"
      subtitle="Property occupancy summary"
      isLoading={isLoading}
      metadata={metadata}
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <ReportSummaryCards items={summaryItems} />

        {/* Property Details */}
        <div>
          <h4 className="mb-3 text-sm font-medium text-neutral-900 dark:text-white">
            Property Breakdown
          </h4>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead className="text-center">Total Units</TableHead>
                  <TableHead className="text-center">Occupied</TableHead>
                  <TableHead className="text-center">Vacant</TableHead>
                  <TableHead className="text-center">Maintenance</TableHead>
                  <TableHead className="text-center">Occupancy Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {propertyDetails.map((property) => (
                  <TableRow key={property.propertyId}>
                    <TableCell className="font-medium">{property.propertyName}</TableCell>
                    <TableCell className="text-center">{property.totalUnits}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="success">{property.occupied}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={property.vacant > 0 ? 'warning' : 'default'}>
                        {property.vacant}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={property.maintenance > 0 ? 'warning' : 'default'}>
                        {property.maintenance}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <Progress value={property.occupancyRate} className="h-2" />
                        <span className="text-sm font-medium">
                          {formatPercentage(property.occupancyRate)}
                        </span>
                      </div>
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