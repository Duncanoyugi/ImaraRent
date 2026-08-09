import { useTenantNotifications, useMarkNotificationRead } from '@/features/tenant-dashboard/hooks/use-tenant-dashboard';
import { TenantNotifications } from '@/features/tenant-dashboard/components/tenant-notifications';
import { PageLoader } from '@/components/shared/page-loader';

export default function TenantNotificationsPage() {
  const { data: notifications, isLoading } = useTenantNotifications();
  const markRead = useMarkNotificationRead();

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Notifications
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Stay updated with your property alerts
        </p>
      </div>

      <TenantNotifications
        notifications={notifications || []}
        onMarkRead={(id) => markRead.mutate(id)}
      />
    </div>
  );
}
