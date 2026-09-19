import { useState } from 'react';
import { MoreHorizontal, ShieldOff, ShieldCheck, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { UserRoleBadge } from './user-role-badge';
import { useDeactivateUser, useReactivateUser } from '../hooks/use-user';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { initials } from '@/utils/string-helpers';
import { shortDate, relativeTime } from '@/utils/date-formatter';
import type { OrganizationUser } from '@/features/organizations/types/organization.types';

export interface UserListProps {
  users: OrganizationUser[] | undefined;
  isLoading?: boolean;
}

/**
 * Organization roster with access control. An owner cannot revoke their own
 * access — doing so would lock the organization out of its only owner seat.
 */
export const UserList = ({ users, isLoading }: UserListProps) => {
  const { user: currentUser } = useAuth();
  const deactivate = useDeactivateUser();
  const reactivate = useReactivateUser();
  const [pendingRevoke, setPendingRevoke] = useState<OrganizationUser | null>(null);

  if (isLoading) {
    return (
      <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-56" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No team members yet"
        description="Invite a manager to share the day-to-day work of running your properties."
      />
    );
  }

  return (
    <>
      <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
        {users.map((member) => {
          const isSelf = member.id === currentUser?.id;
          const assigned = member.managedProperties ?? [];

          return (
            <li key={member.id} className="flex items-center gap-3 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                {initials(member.firstName, member.lastName)}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {member.firstName} {member.lastName}
                  </span>
                  <UserRoleBadge role={member.role} />
                  {!member.isActive && <Badge variant="error">Access revoked</Badge>}
                  {isSelf && <Badge variant="outline">You</Badge>}
                </div>

                <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                  {member.email}
                  {member.lastLoginAt
                    ? ` · last signed in ${relativeTime(member.lastLoginAt)}`
                    : ' · has not signed in yet'}
                </p>

                {member.role === 'MANAGER' && (
                  <p className="mt-1 truncate text-xs text-neutral-400">
                    {assigned.length === 0
                      ? 'No properties assigned'
                      : assigned.map((a) => a.property.name).join(', ')}
                  </p>
                )}
              </div>

              <span className="hidden shrink-0 text-xs text-neutral-400 sm:block">
                Joined {shortDate(member.createdAt)}
              </span>

              {!isSelf && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label={`Actions for ${member.firstName}`}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {member.isActive ? (
                      <DropdownMenuItem
                        className="flex items-center gap-2 text-error-600 focus:text-error-600"
                        onClick={() => setPendingRevoke(member)}
                      >
                        <ShieldOff className="h-4 w-4" />
                        Revoke access
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        className="flex items-center gap-2"
                        onClick={() => reactivate.mutate(member.id)}
                      >
                        <ShieldCheck className="h-4 w-4" />
                        Restore access
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </li>
          );
        })}
      </ul>

      <AlertDialog
        open={!!pendingRevoke}
        onOpenChange={(open) => !open && setPendingRevoke(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Revoke access for {pendingRevoke?.firstName} {pendingRevoke?.lastName}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              They will be signed out and will not be able to sign back in. Their past
              activity — leases created, payments recorded — stays on the record. You can
              restore access at any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep access</AlertDialogCancel>
            <AlertDialogAction
              className="bg-error-500 text-white hover:bg-error-600"
              onClick={() => {
                if (pendingRevoke) deactivate.mutate(pendingRevoke.id);
                setPendingRevoke(null);
              }}
            >
              Revoke access
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

UserList.displayName = 'UserList';
