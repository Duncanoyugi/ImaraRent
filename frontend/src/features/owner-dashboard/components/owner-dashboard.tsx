import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PageHeader } from '@/components/shared/page-header';
import { OwnerStatCards } from './owner-stat-cards';
import { OwnerQuickActions } from './owner-quick-actions';
import { OwnerRevenueChart } from './owner-revenue-chart';
import { OwnerOccupancyGrid } from './owner-occupancy-grid';
import { OwnerArrearsSummary } from './owner-arrears-summary';
import { OwnerPropertyList } from './owner-property-list';
import { RecentActivity } from '@/features/dashboard/components/recent-activity';
import { UpcomingPayments } from '@/features/dashboard/components/upcoming-payments';
import { MaintenanceAlerts } from '@/features/dashboard/components/maintenance-alerts';
import { useOwnerDashboard } from '../hooks/use-owner-dashboard';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { errorMessage } from '@/utils/error-handlers';

const greeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export const OwnerDashboard = () => {
  const { user } = useAuth();
  const { data, isLoading, error, refetch, isFetching } = useOwnerDashboard();

  const stats = data?.stats;

  return (
    <div className="page-stack">
      <PageHeader
        title={`${greeting()}, ${user?.firstName ?? 'there'}`}
        description="How your portfolio is performing right now."
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

      {error && (
        <Alert variant="error">
          <AlertTitle>Could not load your dashboard</AlertTitle>
          <AlertDescription>
            {errorMessage(error)}
            <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <OwnerStatCards stats={stats} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <OwnerRevenueChart data={data?.revenueData} isLoading={isLoading} />
        </div>
        <OwnerOccupancyGrid
          occupied={stats?.occupiedUnits ?? 0}
          vacant={stats?.vacantUnits ?? 0}
          maintenance={stats?.maintenanceUnits ?? 0}
          isLoading={isLoading}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <OwnerArrearsSummary />
        <OwnerPropertyList />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity activities={data?.recentActivity ?? []} />
        </div>
        <div className="space-y-6">
          <OwnerQuickActions />
          <UpcomingPayments payments={data?.upcomingPayments ?? []} />
          <MaintenanceAlerts alerts={data?.maintenanceAlerts ?? []} />
        </div>
      </div>
    </div>
  );
};

OwnerDashboard.displayName = 'OwnerDashboard';
