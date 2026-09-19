import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { humanizeEnum } from '@/utils/string-helpers';

type Variant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'brand' | 'outline';

/**
 * One mapping from every domain status to a colour, so a PAID invoice and an
 * ACTIVE lease read as the same kind of "good" wherever they appear.
 */
const VARIANTS: Record<string, Variant> = {
  // Shared
  ACTIVE: 'success',
  INACTIVE: 'default',
  PENDING: 'warning',
  CANCELLED: 'default',
  EXPIRED: 'default',

  // Invoice
  PAID: 'success',
  PARTIALLY_PAID: 'warning',
  OVERDUE: 'error',

  // Payment
  COMPLETED: 'success',
  FAILED: 'error',
  REFUNDED: 'info',

  // Lease
  DRAFT: 'default',
  TERMINATED: 'error',

  // Unit
  VACANT: 'default',
  OCCUPIED: 'success',
  MAINTENANCE: 'warning',
  RESERVED: 'info',

  // Maintenance
  OPEN: 'info',
  ASSIGNED: 'warning',
  IN_PROGRESS: 'info',
  CLOSED: 'default',

  // Notification delivery
  SENT: 'success',
};

export interface StatusBadgeProps {
  status: string | null | undefined;
  className?: string;
  /** Adds a leading dot — useful in dense tables where colour alone is subtle. */
  dot?: boolean;
}

const DOT_TONES: Record<Variant, string> = {
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  error: 'bg-error-500',
  info: 'bg-info-500',
  brand: 'bg-brand-500',
  default: 'bg-neutral-400',
  outline: 'bg-neutral-400',
};

export const StatusBadge = ({ status, className, dot = false }: StatusBadgeProps) => {
  if (!status) return null;
  const variant = VARIANTS[status] ?? 'default';

  return (
    <Badge variant={variant} className={cn('gap-1.5 font-medium', className)}>
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', DOT_TONES[variant])} />}
      {humanizeEnum(status)}
    </Badge>
  );
};

StatusBadge.displayName = 'StatusBadge';
