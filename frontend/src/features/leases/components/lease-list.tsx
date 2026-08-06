import { Link } from 'react-router-dom';
import { Plus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LeaseStatusBadge } from './lease-status-badge';
import { LeaseTerminateButton } from './lease-terminate-button';
import { formatDate, formatCurrency } from '@/lib/formatters';
import { type Lease } from '../types/lease.types';

export interface LeaseListProps {
  leases: Lease[];
  isLoading?: boolean;
  onActivate?: (id: string) => void;
  onTerminate?: (id: string) => void;
}

export const LeaseList = ({
  leases,
  isLoading = false,
  onActivate,
  onTerminate,
}: LeaseListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-10 w-32 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>
        <div className="rounded-2xl border border-neutral-200 p-8 dark:border-neutral-800">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="mb-4 h-16 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800 last:mb-0" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Leases
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {leases.length} leases in your portfolio
          </p>
        </div>
        <Button asChild>
          <Link to="/leases/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Lease
          </Link>
        </Button>
      </div>

      {leases.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 p-12 dark:border-neutral-800">
          <FileText className="h-12 w-12 text-neutral-400" />
          <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-white">
            No leases found
          </h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Get started by creating your first lease
          </p>
          <Button asChild className="mt-4">
            <Link to="/leases/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Lease
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {leases.map((lease) => (
            <div
              key={lease.id}
              className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                      {lease.tenant?.firstName} {lease.tenant?.lastName}
                    </h3>
                    <LeaseStatusBadge status={lease.status} />
                  </div>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    Unit {lease.unit?.number} - {lease.unit?.property?.name}
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {formatCurrency(lease.rentAmount)}/month • {formatDate(lease.startDate)}
                    {lease.endDate && ` - ${formatDate(lease.endDate)}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/leases/${lease.id}`}>View Details</Link>
                  </Button>
                  {lease.status === 'DRAFT' && onActivate && (
                    <Button size="sm" onClick={() => onActivate(lease.id)}>
                      Activate
                    </Button>
                  )}
                  {lease.isActive && onTerminate && (
                    <LeaseTerminateButton leaseId={lease.id} onSuccess={() => {}} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
