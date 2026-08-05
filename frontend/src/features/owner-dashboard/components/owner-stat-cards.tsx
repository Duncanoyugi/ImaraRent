import { Building2, Home, Users, CreditCard, Wrench, Receipt } from 'lucide-react';
import { StatCard } from '@/features/dashboard/components/stat-card';
import { formatCurrency } from '@/lib/formatters';

interface Stats {
  totalProperties: number;
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
  totalRentCollected: number;
  collectionRate: number;
  occupancyRate: number;
  totalTenants: number;
  openMaintenanceTickets: number;
  overdueInvoices: number;
}

interface OwnerStatCardsProps {
  stats: Stats;
  isLoading?: boolean;
}

export const OwnerStatCards = ({ stats, isLoading = false }: OwnerStatCardsProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Properties"
        value={stats.totalProperties}
        icon={<Building2 className="h-5 w-5" />}
        description={`${stats.totalUnits} total units`}
        variant="default"
      />
      <StatCard
        title="Occupancy Rate"
        value={`${stats.occupancyRate.toFixed(1)}%`}
        icon={<Home className="h-5 w-5" />}
        description={`${stats.occupiedUnits} occupied / ${stats.vacantUnits} vacant`}
        variant={stats.occupancyRate > 70 ? 'success' : 'warning'}
        trend={{
          value: stats.occupancyRate > 50 ? 5 : -3,
          isPositive: stats.occupancyRate > 50,
        }}
      />
      <StatCard
        title="Total Tenants"
        value={stats.totalTenants}
        icon={<Users className="h-5 w-5" />}
        description="Active tenants"
        variant="info"
      />
      <StatCard
        title="Revenue Collected"
        value={formatCurrency(stats.totalRentCollected)}
        icon={<CreditCard className="h-5 w-5" />}
        description={`${stats.collectionRate.toFixed(1)}% collection rate`}
        variant={stats.collectionRate > 80 ? 'success' : 'warning'}
        trend={{
          value: stats.collectionRate > 70 ? 8 : -5,
          isPositive: stats.collectionRate > 70,
        }}
      />
      <StatCard
        title="Open Maintenance"
        value={stats.openMaintenanceTickets}
        icon={<Wrench className="h-5 w-5" />}
        description="Tickets awaiting resolution"
        variant={stats.openMaintenanceTickets > 3 ? 'warning' : 'success'}
      />
      <StatCard
        title="Overdue Invoices"
        value={stats.overdueInvoices}
        icon={<Receipt className="h-5 w-5" />}
        description="Payments past due"
        variant={stats.overdueInvoices > 0 ? 'error' : 'success'}
      />
    </div>
  );
};