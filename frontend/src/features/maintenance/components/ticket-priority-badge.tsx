import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TicketPriorityBadgeProps {
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  className?: string;
}

const priorityConfig = {
  LOW: {
    label: 'Low',
    variant: 'success' as const,
    className: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300',
  },
  MEDIUM: {
    label: 'Medium',
    variant: 'info' as const,
    className: 'bg-info-100 text-info-700 dark:bg-info-900/30 dark:text-info-300',
  },
  HIGH: {
    label: 'High',
    variant: 'warning' as const,
    className: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300',
  },
  URGENT: {
    label: 'Urgent',
    variant: 'destructive' as const,
    className: 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-300',
  },
};

export const TicketPriorityBadge = ({ priority, className }: TicketPriorityBadgeProps) => {
  const config = priorityConfig[priority];

  return (
    <Badge
      variant={config.variant}
      className={cn('font-medium', config.className, className)}
    >
      {config.label}
    </Badge>
  );
};