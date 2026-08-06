import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface UnitStatusBadgeProps {
  status: 'VACANT' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED';
  className?: string;
}

const statusConfig = {
  VACANT: {
    label: 'Vacant',
    variant: 'default' as const,
    className: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
  },
  OCCUPIED: {
    label: 'Occupied',
    variant: 'success' as const,
    className: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300',
  },
  MAINTENANCE: {
    label: 'Maintenance',
    variant: 'warning' as const,
    className: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300',
  },
  RESERVED: {
    label: 'Reserved',
    variant: 'info' as const,
    className: 'bg-info-100 text-info-700 dark:bg-info-900/30 dark:text-info-300',
  },
};

export const UnitStatusBadge = ({ status, className }: UnitStatusBadgeProps) => {
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