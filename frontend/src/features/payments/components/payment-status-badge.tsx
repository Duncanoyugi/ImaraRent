import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PaymentStatusBadgeProps {
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  className?: string;
}

const statusConfig = {
  PENDING: {
    label: 'Pending',
    variant: 'warning' as const,
    className: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300',
  },
  COMPLETED: {
    label: 'Completed',
    variant: 'success' as const,
    className: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300',
  },
  FAILED: {
    label: 'Failed',
    variant: 'destructive' as const,
    className: 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-300',
  },
  REFUNDED: {
    label: 'Refunded',
    variant: 'default' as const,
    className: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
  },
};

export const PaymentStatusBadge = ({ status, className }: PaymentStatusBadgeProps) => {
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