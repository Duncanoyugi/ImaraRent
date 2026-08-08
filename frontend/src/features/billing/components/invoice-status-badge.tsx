import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface InvoiceStatusBadgeProps {
  status: 'PENDING' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  className?: string;
}

const statusConfig = {
  PENDING: {
    label: 'Pending',
    variant: 'warning' as const,
    className: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300',
  },
  PARTIALLY_PAID: {
    label: 'Partially Paid',
    variant: 'info' as const,
    className: 'bg-info-100 text-info-700 dark:bg-info-900/30 dark:text-info-300',
  },
  PAID: {
    label: 'Paid',
    variant: 'success' as const,
    className: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300',
  },
  OVERDUE: {
    label: 'Overdue',
    variant: 'destructive' as const,
    className: 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-300',
  },
  CANCELLED: {
    label: 'Cancelled',
    variant: 'default' as const,
    className: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
  },
};

export const InvoiceStatusBadge = ({ status, className }: InvoiceStatusBadgeProps) => {
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