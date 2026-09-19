import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { realtime } from './websocket';
import { SOCKET_EVENTS, type NotificationEvent } from './events';
import { featureFlags } from '@/config/feature-flags';
import { showToast } from '@/app/providers/toast-provider';
import { NOTIFICATIONS_QUERY_KEY } from '@/features/notifications/hooks/use-notifications';

/**
 * Opens the realtime channel for the signed-in user and folds incoming
 * events back into the React Query cache, so a pushed notification and a
 * refetched one are indistinguishable to the UI.
 *
 * Mounted once, from `AppLayout`.
 */
export const useNotificationSocket = (enabled: boolean) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled || !featureFlags.realtime.enabled) return;

    realtime.connect();

    const invalidate = () =>
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });

    const unsubscribers = [
      realtime.on(SOCKET_EVENTS.NOTIFICATION_NEW, (payload) => {
        const notification = payload as NotificationEvent;
        invalidate();
        if (notification?.title) {
          showToast.info(notification.title, notification.body);
        }
      }),
      realtime.on(SOCKET_EVENTS.NOTIFICATION_READ, invalidate),
      realtime.on(SOCKET_EVENTS.PAYMENT_RECEIVED, () => {
        queryClient.invalidateQueries({ queryKey: ['payments'] });
        queryClient.invalidateQueries({ queryKey: ['invoices'] });
        queryClient.invalidateQueries({ queryKey: ['tenant-dashboard'] });
        invalidate();
      }),
      realtime.on(SOCKET_EVENTS.INVOICE_CREATED, () => {
        queryClient.invalidateQueries({ queryKey: ['invoices'] });
      }),
      realtime.on(SOCKET_EVENTS.INVOICE_UPDATED, () => {
        queryClient.invalidateQueries({ queryKey: ['invoices'] });
      }),
      realtime.on(SOCKET_EVENTS.MAINTENANCE_CREATED, () => {
        queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      }),
      realtime.on(SOCKET_EVENTS.MAINTENANCE_UPDATED, () => {
        queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      }),
    ];

    return () => {
      unsubscribers.forEach((off) => off());
      realtime.disconnect();
    };
  }, [enabled, queryClient]);
};
