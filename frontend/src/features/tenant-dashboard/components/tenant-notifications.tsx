import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime } from '@/lib/formatters';
import { Bell } from 'lucide-react';

interface Notification {
  id: string;
  type: string;
  content: string;
  createdAt: string;
  read?: boolean;
}

interface TenantNotificationsProps {
  notifications: Notification[];
  isLoading?: boolean;
  limit?: number;
  onMarkRead?: (id: string) => void;
}

export const TenantNotifications = ({
  notifications,
  isLoading = false,
  limit = 5,
  onMarkRead,
}: TenantNotificationsProps) => {
  const displayNotifications = notifications.slice(0, limit);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (displayNotifications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Bell className="h-12 w-12 text-neutral-400" />
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              No notifications yet
            </p>
            <p className="text-xs text-neutral-400">
              We'll notify you when there's an update
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Recent Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {displayNotifications.map((notification) => (
          <div
            key={notification.id}
            className="flex items-start gap-3 rounded-lg border border-neutral-100 p-3 dark:border-neutral-800"
          >
            <div className="flex-1">
              <p className="text-sm text-neutral-900 dark:text-white">
                {notification.content}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {formatRelativeTime(notification.createdAt)}
                </span>
                {notification.read === false && (
                  <Badge variant="brand" className="text-[10px]">
                    New
                  </Badge>
                )}
              </div>
            </div>
            {onMarkRead && notification.read === false && (
              <button
                onClick={() => onMarkRead(notification.id)}
                className="text-xs text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Mark read
              </button>
            )}
          </div>
        ))}
        {notifications.length > limit && (
          <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
            + {notifications.length - limit} more notifications
          </p>
        )}
      </CardContent>
    </Card>
  );
};