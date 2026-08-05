import { OwnerStatCards } from './owner-stat-cards';
import { RevenueChart } from '@/features/dashboard/components/revenue-chart';
import { OccupancyChart } from '@/features/dashboard/components/occupancy-chart';
import { RecentActivity } from '@/features/dashboard/components/recent-activity';
import { UpcomingPayments } from '@/features/dashboard/components/upcoming-payments';
import { MaintenanceAlerts } from '@/features/dashboard/components/maintenance-alerts';
import { useOwnerDashboard } from '../hooks/use-owner-dashboard';
import { PageLoader } from '@/components/shared/page-loader';

export const OwnerDashboard = () => {
  const { data, isLoading, error } = useOwnerDashboard();

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-error-500">Failed to load dashboard data</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {(error as Error)?.message || 'Please try again later'}
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <p className="text-neutral-500 dark:text-neutral-400">No dashboard data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-neutral-500 dark:text-neutral-400">
          Welcome back! Here's an overview of your property portfolio.
        </p>
      </div>

      {/* Stats Cards */}
      <OwnerStatCards stats={data.stats} />

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart data={data.revenueData} />
        <OccupancyChart
          occupied={data.stats.occupiedUnits}
          vacant={data.stats.vacantUnits}
          maintenance={data.stats.maintenanceUnits}
        />
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity activities={data.recentActivity} />
        </div>
        <div className="space-y-6">
          <UpcomingPayments payments={data.upcomingPayments} />
          <MaintenanceAlerts alerts={data.maintenanceAlerts} />
        </div>
      </div>
    </div>
  );
};