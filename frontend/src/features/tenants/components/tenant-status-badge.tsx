import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TenantStatusBadgeProps {
  status: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'EXPIRED';
  className?: string;
}

const statusConfig = {
  PENDING: {
    label: 'Pending',
    variant: 'warning' as const,
    className: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300',
  },
  ACTIVE: {
    label: 'Active',
    variant: 'success' as const,
    className: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300',
  },
  INACTIVE: {
    label: 'Inactive',
    variant: 'default' as const,
    className: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
  },
  CANCELLED: {
    label: 'Cancelled',
    variant: 'error' as const,
    className: 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-300',
  },
  EXPIRED: {
    label: 'Expired',
    variant: 'default' as const,
    className: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
  },
};

export const TenantStatusBadge = ({ status, className }: TenantStatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <Badge
      variant={config.variant}
      className={cn('font-medium', config.className, className)}
    >
      {config.label}
    </Badge>
  );
};