import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatCurrency } from '@/lib/formatters';
import { Home, Calendar, CreditCard, FileText } from 'lucide-react';

interface TenantLeaseDetailsProps {
  lease: {
    id: string;
    startDate: string;
    endDate: string | null;
    rentAmount: number;
    status: string;
    depositAmount: number;
    depositPaid: boolean;
  } | null;
  unit: {
    id: string;
    number: string;
    rentAmount: number;
    property: {
      id: string;
      name: string;
      address: string;
      phone: string | null;
    };
  } | null;
  isLoading?: boolean;
}

export const TenantLeaseDetails = ({ lease, unit, isLoading = false }: TenantLeaseDetailsProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">My Lease</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-8 w-32 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!lease || !unit) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">My Lease</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Home className="h-12 w-12 text-neutral-400" />
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              No active lease found
            </p>
            <p className="text-xs text-neutral-400">
              Please contact your property manager
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">My Lease</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Property Info */}
        <div>
          <p className="text-sm font-medium text-neutral-900 dark:text-white">
            {unit.property.name}
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Unit {unit.number} • {unit.property.address}
          </p>
        </div>

        {/* Lease Details */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800/50">
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 text-neutral-400" />
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Start Date</p>
            </div>
            <p className="text-sm font-medium text-neutral-900 dark:text-white">
              {formatDate(lease.startDate)}
            </p>
          </div>
          <div className="rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800/50">
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 text-neutral-400" />
              <p className="text-xs text-neutral-500 dark:text-neutral-400">End Date</p>
            </div>
            <p className="text-sm font-medium text-neutral-900 dark:text-white">
              {lease.endDate ? formatDate(lease.endDate) : 'Open-ended'}
            </p>
          </div>
        </div>

        {/* Rent & Deposit */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-brand-50 p-3 dark:bg-brand-950/20">
            <div className="flex items-center gap-2">
              <CreditCard className="h-3 w-3 text-brand-500" />
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Monthly Rent</p>
            </div>
            <p className="text-lg font-bold text-brand-600 dark:text-brand-400">
              {formatCurrency(lease.rentAmount)}
            </p>
          </div>
          <div className="rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800/50">
            <div className="flex items-center gap-2">
              <FileText className="h-3 w-3 text-neutral-400" />
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Deposit</p>
            </div>
            <p className="text-sm font-medium text-neutral-900 dark:text-white">
              {formatCurrency(lease.depositAmount)}
              <Badge
                variant={lease.depositPaid ? 'success' : 'warning'}
                className="ml-2 text-[10px]"
              >
                {lease.depositPaid ? 'Paid' : 'Pending'}
              </Badge>
            </p>
          </div>
        </div>

        {/* Status */}
        <Badge
          variant={lease.status === 'ACTIVE' ? 'success' : 'warning'}
          className="w-full justify-center py-1"
        >
          {lease.status === 'ACTIVE' ? 'Active Lease' : lease.status}
        </Badge>
      </CardContent>
    </Card>
  );
};