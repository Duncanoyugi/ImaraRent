import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { NotificationBadge } from './notification-badge';
import { NotificationList } from './notification-list';
import { useNotifications } from '../hooks/use-notifications';
import { useUnreadCount } from '../hooks/use-unread-count';
import { useAuth } from '@/features/auth/hooks/use-auth';

/**
 * Header bell: unread count, and a popover with the most recent items.
 * Only tenants have a dedicated notifications page to link through to.
 */
export const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, isLoading } = useNotifications();
  const unread = useUnreadCount();

  const hasFullPage = user?.role === 'TENANT';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={unread > 0 ? `Notifications, ${unread} unread` : 'Notifications'}
        >
          <Bell className="h-5 w-5" />
          <NotificationBadge count={unread} />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-[22rem] max-w-[calc(100vw-2rem)] p-0">
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Notifications
          </h2>
        </div>

        <div className="max-h-96 overflow-y-auto">
          <NotificationList
            notifications={data}
            isLoading={isLoading}
            compact
            limit={8}
            showMarkAll={false}
          />
        </div>

        {hasFullPage && (data?.length ?? 0) > 0 && (
          <div className="border-t border-neutral-200 p-2 dark:border-neutral-800">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs"
              onClick={() => {
                setOpen(false);
                navigate('/notifications');
              }}
            >
              View all notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

NotificationBell.displayName = 'NotificationBell';
