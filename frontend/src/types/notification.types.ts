export type NotificationType =
  | 'TENANT_INVITATION'
  | 'RENT_DUE'
  | 'PAYMENT_RECEIVED'
  | 'LEASE_EXPIRING'
  | 'MAINTENANCE_UPDATE'
  | 'ANNOUNCEMENT';

export type NotificationChannel = 'EMAIL' | 'SMS' | 'IN_APP';

export type NotificationStatus = 'PENDING' | 'SENT' | 'FAILED';

export interface AppNotification {
  id: string;
  type: NotificationType;
  channel: NotificationChannel;
  recipient: string;
  subject: string | null;
  content: string;
  status: NotificationStatus;
  sentAt: string | null;
  error: string | null;
  retryCount: number;
  createdAt: string;
  tenantId: string | null;
  userId: string | null;
  /** Present on tenant-portal notifications, which are read-tracked. */
  read?: boolean;
  readAt?: string | null;
  title?: string;
  body?: string;
}

export interface SendNotificationData {
  type: NotificationType;
  channel: NotificationChannel;
  recipient: string;
  subject?: string;
  content: string;
  tenantId?: string;
  userId?: string;
}

export interface BulkNotificationData extends Omit<SendNotificationData, 'recipient' | 'tenantId'> {
  recipients: string[];
  tenantIds?: string[];
}

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  TENANT_INVITATION: 'Invitation',
  RENT_DUE: 'Rent due',
  PAYMENT_RECEIVED: 'Payment received',
  LEASE_EXPIRING: 'Lease expiring',
  MAINTENANCE_UPDATE: 'Maintenance update',
  ANNOUNCEMENT: 'Announcement',
};
