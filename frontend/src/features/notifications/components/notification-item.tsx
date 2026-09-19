import {
  AlertCircle,
  Bell,
  CalendarClock,
  Mail,
  Megaphone,
  Receipt,
  Wrench,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { relativeTime } from '@/utils/date-formatter';
import type { AppNotification, NotificationType } from '../types/notification.types';

const ICONS: Record<NotificationType, React.ElementType> = {
  TENANT_INVITATION: Mail,
  RENT_DUE: CalendarClock,
  PAYMENT_RECEIVED: Receipt,
  LEASE_EXPIRING: CalendarClock,
  MAINTENANCE_UPDATE: Wrench,
  ANNOUNCEMENT: Megaphone,
};

const TONES: Record<NotificationType, string> = {
  TENANT_INVITATION: 'bg-info-50 text-info-600 dark:bg-info-900/30 dark:text-info-400',
  RENT_DUE: 'bg-warning-50 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400',
  PAYMENT_RECEIVED: 'bg-success-50 text-success-600 dark:bg-success-900/30 dark:text-success-400',
  LEASE_EXPIRING: 'bg-warning-50 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400',
  MAINTENANCE_UPDATE: 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400',
  ANNOUNCEMENT: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300',
};

export interface NotificationItemProps {
  notification: AppNotification;
  onSelect?: (notification: AppNotification) => void;
  /** Tighter spacing for the header dropdown; roomier on the full page. */
  compact?: boolean;
}

export const NotificationItem = ({
  notification,
  onSelect,
  compact = false,
}: NotificationItemProps) => {
  const Icon = ICONS[notification.type] ?? Bell;
  const tone = TONES[notification.type] ?? TONES.ANNOUNCEMENT;
  const unread = notification.read === false;
  const failed = notification.status === 'FAILED';

  // The two feeds name these fields differently.
  const title = notification.title ?? notification.subject ?? 'Notification';
  const body = notification.body ?? notification.content;

  const Wrapper = onSelect ? 'button' : 'div';

  return (
    <Wrapper
      {...(onSelect
        ? { type: 'button' as const, onClick: () => onSelect(notification) }
        : {})}
      className={cn(
        'flex w-full gap-3 rounded-lg text-left transition-colors',
        compact ? 'px-3 py-2.5' : 'px-4 py-3.5',
        onSelect && 'hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:hover:bg-neutral-800/60',
        unread && 'bg-brand-50/40 dark:bg-brand-900/10'
      )}
    >
      <span
        className={cn(
          'flex shrink-0 items-center justify-center rounded-lg',
          compact ? 'h-8 w-8' : 'h-9 w-9',
          tone
        )}
      >
        <Icon className={compact ? 'h-4 w-4' : 'h-4.5 w-4.5'} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-2">
          <span
            className={cn(
              'block truncate text-sm text-neutral-900 dark:text-neutral-100',
              unread ? 'font-semibold' : 'font-medium'
            )}
          >
            {title}
          </span>
          <span className="shrink-0 whitespace-nowrap text-[11px] text-neutral-400">
            {relativeTime(notification.createdAt)}
          </span>
        </span>

        <span
          className={cn(
            'mt-0.5 block text-xs leading-relaxed text-neutral-500 dark:text-neutral-400',
            compact ? 'line-clamp-2' : 'line-clamp-3'
          )}
        >
          {body}
        </span>

        {failed && (
          <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-error-600">
            <AlertCircle className="h-3 w-3" />
            Delivery failed
            {notification.retryCount > 0 && ` after ${notification.retryCount} retries`}
          </span>
        )}
      </span>

      {unread && (
        <span
          aria-label="Unread"
          className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500"
        />
      )}
    </Wrapper>
  );
};

NotificationItem.displayName = 'NotificationItem';
