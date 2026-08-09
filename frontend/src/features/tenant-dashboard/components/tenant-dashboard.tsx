import { TenantBalanceCard } from './tenant-balance-card';
import { TenantLeaseDetails } from './tenant-lease-details';
import { TenantPaymentHistory } from './tenant-payment-history';
import { TenantMaintenanceTickets } from './tenant-maintenance-tickets';
import { TenantNotifications } from './tenant-notifications';
import { TenantPayRentButton } from './tenant-pay-rent-button';
import { useTenantDashboard, useMarkNotificationRead } from '../hooks/use-tenant-dashboard';
import { PageLoader } from '@/components/shared/page-loader';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Building2, User } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

export const TenantDashboard = () => {
  const { data, isLoading, error } = useTenantDashboard();
  const markRead = useMarkNotificationRead();

  if (isLoading) {
    return <PageLoader />;
  }

  if (error || !data) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-error-500">Failed to load dashboard</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {(error as Error)?.message || 'Please try again later'}
          </p>
        </div>
      </div>
    );
  }

  const { tenant, unit, activeLease, balance, recentInvoices, recentPayments, openMaintenanceTickets } = data;

  // Get the first pending invoice for "Pay Rent" button
  const pendingInvoice = recentInvoices.find(
    (inv) => inv.status === 'PENDING' || inv.status === 'PARTIALLY_PAID' || inv.status === 'OVERDUE'
  );

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="rounded-2xl bg-gradient-to-r from-brand-600 to-brand-400 p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {tenant.firstName}!
            </h1>
            <p className="text-brand-50">
              {unit ? `${unit.property.name} • Unit ${unit.number}` : 'No unit assigned'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-lg bg-white/20 px-3 py-1.5">
              <Building2 className="h-4 w-4" />
              <span className="text-sm font-medium">
                {unit?.property?.address || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Balance + Pay Rent */}
          <div className="grid gap-4 sm:grid-cols-2">
            <TenantBalanceCard balance={balance} />
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="rounded-full bg-brand-100 p-3 dark:bg-brand-900/30">
                  <Home className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                </div>
                <p className="mt-2 text-center text-sm text-neutral-500 dark:text-neutral-400">
                  {balance.totalBalance > 0 
                    ? `You have ${formatCurrency(balance.totalBalance)} outstanding` 
                    : 'Your balance is all clear!'}
                </p>
                <div className="mt-4 w-full">
                  <TenantPayRentButton 
                    invoiceId={pendingInvoice?.id} 
                    balance={balance.totalBalance} 
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lease Details */}
          <TenantLeaseDetails lease={activeLease} unit={unit} />

          {/* Payment History */}
          <TenantPaymentHistory payments={recentPayments} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Info */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-brand-100 p-2 dark:bg-brand-900/30">
                  <User className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Tenant</p>
                  <p className="font-medium text-neutral-900 dark:text-white">
                    {tenant.firstName} {tenant.lastName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-neutral-100 p-2 dark:bg-neutral-800">
                  <Home className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Unit</p>
                  <p className="font-medium text-neutral-900 dark:text-white">
                    {unit ? unit.number : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Tickets */}
          <TenantMaintenanceTickets tickets={openMaintenanceTickets} />

          {/* Notifications */}
          <TenantNotifications 
            notifications={data.notifications || []}
            onMarkRead={(id) => markRead.mutate(id)}
          />
        </div>
      </div>
    </div>
  );
};