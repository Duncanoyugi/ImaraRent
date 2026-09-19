import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notification.service';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { showToast } from '@/app/providers/toast-provider';
import { errorMessage } from '@/utils/error-handlers';
import type { AppNotification, SendNotificationData } from '../types/notification.types';

export const NOTIFICATIONS_QUERY_KEY = ['notifications'];

/**
 * The signed-in user's notification feed.
 *
 * Tenants get the read-tracked tenant-portal feed; owners and managers get
 * their delivery log. Refetched on window focus so a notification that
 * arrives while the tab is backgrounded shows up on return.
 */
export const useNotifications = () => {
  const { user } = useAuth();
  const isTenant = user?.role === 'TENANT';

  return useQuery<AppNotification[]>({
    queryKey: [...NOTIFICATIONS_QUERY_KEY, user?.role ?? 'anonymous'],
    queryFn: () => (isTenant ? notificationService.getTenantFeed() : notificationService.getMine()),
    enabled: !!user,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
  });
};

export const useTenantNotificationFeed = (limit = 50, offset = 0) =>
  useQuery<AppNotification[]>({
    queryKey: [...NOTIFICATIONS_QUERY_KEY, 'tenant', { limit, offset }],
    queryFn: () => notificationService.getTenantFeed(limit, offset),
    staleTime: 1000 * 60,
  });

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.markRead(id),
    // Optimistic: the badge should drop the moment the row is opened.
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      const snapshot = queryClient.getQueriesData<AppNotification[]>({
        queryKey: NOTIFICATIONS_QUERY_KEY,
      });

      queryClient.setQueriesData<AppNotification[]>(
        { queryKey: NOTIFICATIONS_QUERY_KEY },
        (current) =>
          current?.map((n) =>
            n.id === id ? { ...n, read: true, readAt: new Date().toISOString() } : n
          )
      );

      return { snapshot };
    },
    onError: (_error, _id, context) => {
      context?.snapshot.forEach(([key, data]) => queryClient.setQueryData(key, data));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map((id) => notificationService.markRead(id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
    onError: (error) => showToast.error('Could not update notifications', errorMessage(error)),
  });
};

export const useSendNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendNotificationData) => notificationService.send(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      showToast.success('Notification sent');
    },
    onError: (error) => showToast.error('Could not send notification', errorMessage(error)),
  });
};

export const useRetryNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.retry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      showToast.success('Notification queued for resend');
    },
    onError: (error) => showToast.error('Could not resend', errorMessage(error)),
  });
};

export const useTenantNotifications = (tenantId: string | undefined) =>
  useQuery<AppNotification[]>({
    queryKey: [...NOTIFICATIONS_QUERY_KEY, 'by-tenant', tenantId],
    queryFn: () => notificationService.getByTenant(tenantId!),
    enabled: !!tenantId,
  });
