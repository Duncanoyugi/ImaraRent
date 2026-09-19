export type {
  AppNotification,
  NotificationType,
  NotificationChannel,
  NotificationStatus,
  SendNotificationData,
  BulkNotificationData,
} from '@/types/notification.types';

export { NOTIFICATION_TYPE_LABELS } from '@/types/notification.types';

/** Shape returned by `GET /tenant-portal/notifications/unread-count`. */
export interface UnreadCountResponse {
  count: number;
}
