import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download, RefreshCw } from 'lucide-react';
import type { ReportPeriod, ReportFormat, ReportRequest } from '../types/report.types';

interface ReportFiltersProps {
  onGenerate: (filters: ReportRequest) => void;
  onExport?: (format: ReportFormat) => void;
  isLoading?: boolean;
  showExport?: boolean;
  defaultPeriod?: ReportPeriod;
}

export const ReportFilters = ({
  onGenerate,
  onExport,
  isLoading = false,
  showExport = false,
  defaultPeriod = 'MONTH',
}: ReportFiltersProps) => {
  const [period, setPeriod] = useState<ReportPeriod>(defaultPeriod);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [propertyId, setPropertyId] = useState('');

  const handleGenerate = () => {
    const filters: ReportRequest = {
      period,
      propertyId: propertyId || undefined,
    };

    if (period === 'CUSTOM') {
      if (!startDate || !endDate) {
        alert('Please select both start and end dates');
        return;
      }
      filters.startDate = startDate;
      filters.endDate = endDate;
    }

    onGenerate(filters);
  };

  const handleExport = (format: ReportFormat) => {
    onExport?.(format);
  };

  return (
    <div className="space-y-4 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Period */}
        <div className="space-y-2">
          <Label htmlFor="period">Period</Label>
          <Select
            value={period}
            onValueChange={(value) => setPeriod(value as ReportPeriod)}
          >
            <SelectTrigger id="period" className="h-10">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MONTH">This Month</SelectItem>
              <SelectItem value="QUARTER">This Quarter</SelectItem>
              <SelectItem value="YEAR">This Year</SelectItem>
              <SelectItem value="CUSTOM">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Custom Date Range */}
        {period === 'CUSTOM' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-10"
              />
            </div>
          </>
        )}

        {/* Property Filter (Optional) */}
        <div className="space-y-2">
          <Label htmlFor="property">Property</Label>
          <Select value={propertyId} onValueChange={setPropertyId}>
            <SelectTrigger id="property" className="h-10">
              <SelectValue placeholder="All Properties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Properties</SelectItem>
              {/* Properties will be populated from parent */}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={handleGenerate}
          loading={isLoading}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          {isLoading ? 'Generating...' : 'Generate Report'}
        </Button>

        {showExport && onExport && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleExport('CSV')}
              className="gap-2"
              disabled={isLoading}
            >
              <Download className="h-4 w-4" />
              CSV
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport('PDF')}
              className="gap-2"
              disabled={isLoading}
            >
              <Download className="h-4 w-4" />
              PDF
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};