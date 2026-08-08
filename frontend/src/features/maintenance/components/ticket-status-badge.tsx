import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TicketStatusBadgeProps {
  status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED';
  className?: string;
}

const statusConfig = {
  OPEN: {
    label: 'Open',
    variant: 'info' as const,
    className: 'bg-info-100 text-info-700 dark:bg-info-900/30 dark:text-info-300',
  },
  ASSIGNED: {
    label: 'Assigned',
    variant: 'warning' as const,
    className: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    variant: 'info' as const,
    className: 'bg-info-100 text-info-700 dark:bg-info-900/30 dark:text-info-300',
  },
  COMPLETED: {
    label: 'Completed',
    variant: 'success' as const,
    className: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300',
  },
  CLOSED: {
    label: 'Closed',
    variant: 'default' as const,
    className: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
  },
};

export const TicketStatusBadge = ({ status, className }: TicketStatusBadgeProps) => {
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