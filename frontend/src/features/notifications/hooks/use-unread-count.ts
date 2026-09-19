import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { notificationService } from '../services/notification.service';
import { useNotifications, NOTIFICATIONS_QUERY_KEY } from './use-notifications';
import { useAuth } from '@/features/auth/hooks/use-auth';

/**
 * Unread badge count.
 *
 * Tenants have a dedicated endpoint, so we use it and poll gently. Owners and
 * managers have no read-state column on the delivery log, so "unread" is
 * derived from the feed — anything not yet marked `read` and sent in the last
 * 30 days counts.
 */
export const useUnreadCount = (): number => {
  const { user } = useAuth();
  const isTenant = user?.role === 'TENANT';

  const { data: tenantCount } = useQuery({
    queryKey: [...NOTIFICATIONS_QUERY_KEY, 'unread-count'],
    queryFn: () => notificationService.getUnreadCount(),
    enabled: !!user && isTenant,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
    refetchOnWindowFocus: true,
  });

  const { data: feed } = useNotifications();

  const derived = useMemo(() => {
    if (!feed) return 0;
    const cutoff = Date.now() - 30 * 86_400_000;
    return feed.filter((n) => !n.read && new Date(n.createdAt).getTime() > cutoff).length;
  }, [feed]);

  return isTenant ? (tenantCount ?? 0) : derived;
};
