import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/types/user.types';

const VARIANTS: Record<UserRole, 'brand' | 'info' | 'default'> = {
  OWNER: 'brand',
  MANAGER: 'info',
  TENANT: 'default',
};

const LABELS: Record<UserRole, string> = {
  OWNER: 'Owner',
  MANAGER: 'Manager',
  TENANT: 'Tenant',
};

export const UserRoleBadge = ({
  role,
  className,
}: {
  role: UserRole;
  className?: string;
}) => (
  <Badge variant={VARIANTS[role] ?? 'default'} className={cn('font-medium', className)}>
    {LABELS[role] ?? role}
  </Badge>
);

UserRoleBadge.displayName = 'UserRoleBadge';
