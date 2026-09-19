import { BellOff, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { NotificationItem } from './notification-item';
import { useMarkAllNotificationsRead, useMarkNotificationRead } from '../hooks/use-notifications';
import { cn } from '@/lib/utils';
import type { AppNotification } from '../types/notification.types';

export interface NotificationListProps {
  notifications: AppNotification[] | undefined;
  isLoading?: boolean;
  compact?: boolean;
  /** Caps how many render — used by the header dropdown. */
  limit?: number;
  showMarkAll?: boolean;
  onSelect?: (notification: AppNotification) => void;
  className?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}

export const NotificationList = ({
  notifications,
  isLoading = false,
  compact = false,
  limit,
  showMarkAll = true,
  onSelect,
  className,
  emptyTitle = 'Nothing new',
  emptyDescription = 'Rent reminders, payment receipts and maintenance updates will appear here.',
}: NotificationListProps) => {
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();

  if (isLoading) {
    return (
      <div className={cn('space-y-1 p-2', className)}>
        {Array.from({ length: compact ? 3 : 5 }).map((_, i) => (
          <div key={i} className="flex gap-3 px-2 py-3">
            <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-2/5" />
              <Skeleton className="h-3 w-4/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const all = notifications ?? [];
  const visible = limit ? all.slice(0, limit) : all;
  const unreadIds = all.filter((n) => n.read === false).map((n) => n.id);

  if (visible.length === 0) {
    return (
      <EmptyState
        icon={BellOff}
        title={emptyTitle}
        description={emptyDescription}
        compact={compact}
        className={className}
      />
    );
  }

  const handleSelect = (notification: AppNotification) => {
    if (notification.read === false) markRead.mutate(notification.id);
    onSelect?.(notification);
  };

  return (
    <div className={className}>
      {showMarkAll && unreadIds.length > 0 && (
        <div className="flex items-center justify-between gap-2 border-b border-neutral-200 px-4 py-2 dark:border-neutral-800">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {unreadIds.length} unread
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 text-xs"
            loading={markAll.isPending}
            onClick={() => markAll.mutate(unreadIds)}
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all read
          </Button>
        </div>
      )}

      <ul className={cn('divide-y divide-neutral-100 dark:divide-neutral-800', compact && 'p-1')}>
        {visible.map((notification) => (
          <li key={notification.id}>
            <NotificationItem
              notification={notification}
              compact={compact}
              onSelect={handleSelect}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

NotificationList.displayName = 'NotificationList';
