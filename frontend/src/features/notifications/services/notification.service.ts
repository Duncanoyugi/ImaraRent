import { api } from '@/lib/api/client';
import { API_ROUTES } from '@/lib/constants';
import type {
  AppNotification,
  SendNotificationData,
  UnreadCountResponse,
} from '../types/notification.types';

/**
 * Notifications come from two places depending on who is asking:
 *
 * - staff (OWNER/MANAGER) read `/notifications/user/me`
 * - tenants read `/tenant-portal/notifications`, which is the only feed that
 *   tracks read state and exposes an unread count
 *
 * The service exposes both and the hooks pick based on the signed-in role,
 * so components never branch on it themselves.
 */
export const notificationService = {
  /** Staff feed — delivery log for the signed-in user. */
  getMine: async (): Promise<AppNotification[]> =>
    api.get<AppNotification[]>(API_ROUTES.NOTIFICATIONS.MY),

  /** Tenant feed — read-tracked, paginated. */
  getTenantFeed: async (limit = 50, offset = 0): Promise<AppNotification[]> =>
    api.get<AppNotification[]>(
      `${API_ROUTES.TENANT_PORTAL.NOTIFICATIONS}?limit=${limit}&offset=${offset}`
    ),

  getUnreadCount: async (): Promise<number> => {
    const result = await api.get<UnreadCountResponse | number>(
      `${API_ROUTES.TENANT_PORTAL.NOTIFICATIONS}/unread-count`
    );
    // The endpoint has returned both a bare number and `{ count }`; accept both.
    return typeof result === 'number' ? result : (result?.count ?? 0);
  },

  markRead: async (id: string): Promise<AppNotification> =>
    api.post<AppNotification>(`${API_ROUTES.TENANT_PORTAL.NOTIFICATIONS}/${id}/read`),

  getByTenant: async (tenantId: string): Promise<AppNotification[]> =>
    api.get<AppNotification[]>(API_ROUTES.NOTIFICATIONS.TENANT.replace(':tenantId', tenantId)),

  getStatus: async (id: string): Promise<AppNotification> =>
    api.get<AppNotification>(API_ROUTES.NOTIFICATIONS.STATUS.replace(':id', id)),

  send: async (data: SendNotificationData): Promise<AppNotification> =>
    api.post<AppNotification>(API_ROUTES.NOTIFICATIONS.SEND, data),

  sendBulk: async (items: SendNotificationData[]): Promise<AppNotification[]> =>
    api.post<AppNotification[]>(API_ROUTES.NOTIFICATIONS.BULK, items),

  retry: async (id: string): Promise<AppNotification> =>
    api.post<AppNotification>(API_ROUTES.NOTIFICATIONS.RETRY.replace(':id', id)),
};
