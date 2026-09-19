import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PageHeader } from '@/components/shared/page-header';
import { ManagerStatCards } from './manager-stat-cards';
import { ManagerTaskList } from './manager-task-list';
import { ManagerMaintenanceQueue } from './manager-maintenance-queue';
import { ManagerVacantUnits } from './manager-vacant-units';
import { ManagerTenantCheckins } from './manager-tenant-checkins';
import { ManagerQuickActions } from './manager-quick-actions';
import { useManagerDashboard } from '../hooks/use-manager-dashboard';
import { useAuth } from '@/features/auth/hooks/use-auth';

const greeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export const ManagerDashboard = () => {
  const { user } = useAuth();
  const { data, isLoading, isError, refetch, isFetching } = useManagerDashboard();

  return (
    <div className="page-stack">
      <PageHeader
        title={`${greeting()}, ${user?.firstName ?? 'there'}`}
        description="Here is what is happening across the properties you manage."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            loading={isFetching && !isLoading}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        }
      />

      {isError && (
        <Alert variant="error">
          <AlertTitle>Could not load your dashboard</AlertTitle>
          <AlertDescription>
            The server did not respond. Check your connection, then try again.
            <Button variant="outline" size="sm" className="mt-3 gap-2" onClick={() => refetch()}>
              <AlertCircle className="h-4 w-4" />
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <ManagerStatCards stats={data?.stats} isLoading={isLoading} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ManagerTaskList tasks={data?.tasks} isLoading={isLoading} />
          <ManagerMaintenanceQueue tickets={data?.tickets} isLoading={isLoading} />
        </div>

        <div className="space-y-6">
          <ManagerQuickActions />
          <ManagerVacantUnits units={data?.vacantUnits} isLoading={isLoading} />
          <ManagerTenantCheckins checkins={data?.checkins} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

ManagerDashboard.displayName = 'ManagerDashboard';
