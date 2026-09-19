import { ArrowDown, ArrowUp, Minus, TriangleAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { humanizeEnum } from '@/utils/string-helpers';

type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

const CONFIG: Record<Priority, { variant: 'default' | 'info' | 'warning' | 'error'; icon: React.ElementType }> = {
  LOW: { variant: 'default', icon: ArrowDown },
  MEDIUM: { variant: 'info', icon: Minus },
  HIGH: { variant: 'warning', icon: ArrowUp },
  URGENT: { variant: 'error', icon: TriangleAlert },
};

export interface PriorityBadgeProps {
  priority: string | null | undefined;
  showIcon?: boolean;
  className?: string;
}

/** Maintenance-ticket priority. Icon plus colour, so it survives greyscale. */
export const PriorityBadge = ({
  priority,
  showIcon = true,
  className,
}: PriorityBadgeProps) => {
  if (!priority) return null;
  const config = CONFIG[priority as Priority] ?? CONFIG.MEDIUM;
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={cn('gap-1 font-medium', className)}>
      {showIcon && <Icon className="h-3 w-3" />}
      {humanizeEnum(priority)}
    </Badge>
  );
};

PriorityBadge.displayName = 'PriorityBadge';
