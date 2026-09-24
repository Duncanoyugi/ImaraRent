import { Suspense, lazy } from 'react';
import { type ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AppLayout } from '@/components/layout';
import { ProtectedRoute } from './protected-route';
import { RoleBasedRoute } from './role-based-route';
import { PublicRoute } from './public-route';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { type UserRole } from '@/types/user.types';

// Lazy load pages
const LoginPage = lazy(() => import('@/pages/auth/login'));
const RegisterPage = lazy(() => import('@/pages/auth/register'));
const AcceptInvitationPage = lazy(() => import('@/pages/auth/accept-invitation'));

// Owner pages
const OwnerDashboardPage = lazy(() => import('@/pages/owner/dashboard'));
const PropertiesPage = lazy(() => import('@/pages/owner/properties'));
const NewPropertyPage = lazy(() => import('@/pages/owner/properties/new'));
const PropertyDetailPage = lazy(() => import('@/pages/owner/properties/[id]'));
const UnitsPage = lazy(() => import('@/pages/owner/units'));
const NewUnitPage = lazy(() => import('@/pages/owner/units/new'));
const UnitDetailPage = lazy(() => import('@/pages/owner/units/[id]'));
const TenantsPage = lazy(() => import('@/pages/owner/tenants'));
const NewTenantPage = lazy(() => import('@/pages/owner/tenants/new'));
const TenantDetailPage = lazy(() => import('@/pages/owner/tenants/[id]'));
const LeasesPage = lazy(() => import('@/pages/owner/leases'));
const NewLeasePage = lazy(() => import('@/pages/owner/leases/new'));
const LeaseDetailPage = lazy(() => import('@/pages/owner/leases/[id]'));
const LeaseEditPage = lazy(() => import('@/pages/owner/leases/edit'));

// Owner Billing pages
const InvoicesPage = lazy(() => import('@/pages/owner/billing/invoices'));
const InvoiceDetailPage = lazy(() => import('@/pages/owner/billing/invoice/[id]'));
const NewInvoicePage = lazy(() => import('@/pages/owner/billing/new'));

// Owner Payment pages
const PaymentsPage = lazy(() => import('@/pages/owner/payments'));
const PaymentDetailPage = lazy(() => import('@/pages/owner/payments/[id]'));

// Owner Maintenance pages
const OwnerMaintenancePage = lazy(() => import('@/pages/owner/maintenance'));
const OwnerTicketDetailPage = lazy(() => import('@/pages/owner/maintenance/[id]'));

// Owner Report pages
const ReportsIndexPage = lazy(() => import('@/pages/owner/reports'));
const IncomeStatementPage = lazy(() => import('@/pages/owner/reports/income-statement'));
const RentRollPage = lazy(() => import('@/pages/owner/reports/rent-roll'));
const ArrearsAgingPage = lazy(() => import('@/pages/owner/reports/arrears-aging'));
const OccupancyPage = lazy(() => import('@/pages/owner/reports/occupancy'));
const MaintenanceReportPage = lazy(() => import('@/pages/owner/reports/maintenance'));

// Owner Settings pages
const OwnerSettingsPage = lazy(() => import('@/pages/owner/settings'));
const OwnerManagersPage = lazy(() => import('@/pages/owner/settings/managers'));
const OwnerProfilePage = lazy(() => import('@/pages/owner/profile'));

// Manager pages
const ManagerDashboardPage = lazy(() => import('@/pages/manager/dashboard'));
const ManagerPropertiesPage = lazy(() => import('@/pages/manager/properties'));
const ManagerPropertyDetailPage = lazy(() => import('@/pages/manager/properties/[id]'));
const ManagerUnitsPage = lazy(() => import('@/pages/manager/units'));
const ManagerUnitsDetailPage = lazy(() => import('@/pages/manager/units/[id]'));
const ManagerTenantsPage = lazy(() => import('@/pages/manager/tenants'));
const ManagerTenantDetailPage = lazy(() => import('@/pages/manager/tenants/[id]'));
const ManagerLeasesPage = lazy(() => import('@/pages/manager/leases'));
const ManagerLeaseDetailPage = lazy(() => import('@/pages/manager/leases/[id]'));

// Manager Billing pages
const ManagerInvoicesPage = lazy(() => import('@/pages/manager/billing/invoices'));

// Manager Payment pages
const ManagerPaymentsPage = lazy(() => import('@/pages/manager/payments'));

// Manager Maintenance pages
const ManagerMaintenancePage = lazy(() => import('@/pages/manager/maintenance'));
const ManagerTicketDetailPage = lazy(() => import('@/pages/manager/maintenance/[id]'));

// Manager Profile page
const ManagerProfilePage = lazy(() => import('@/pages/manager/profile'));

// Tenant pages
const TenantDashboardPage = lazy(() => import('@/pages/tenant/dashboard'));
const TenantLeasePage = lazy(() => import('@/pages/tenant/lease'));

// Tenant Billing pages
const TenantInvoicesPage = lazy(() => import('@/pages/tenant/invoices'));

// Tenant Payment pages
const TenantPaymentsPage = lazy(() => import('@/pages/tenant/payments'));
const PayRentPage = lazy(() => import('@/pages/tenant/payments/pay'));

// Tenant Maintenance pages
const TenantMaintenancePage = lazy(() => import('@/pages/tenant/maintenance'));
const NewTicketPage = lazy(() => import('@/pages/tenant/maintenance/new'));
const TenantTicketDetailPage = lazy(() => import('@/pages/tenant/maintenance/[id]'));

// Tenant Billing / Payment detail pages
const TenantInvoiceDetailPage = lazy(() => import('@/pages/tenant/invoices/[id]'));
const TenantPaymentDetailPage = lazy(() => import('@/pages/tenant/payments/[id]'));

// Tenant Settings pages
const TenantNotificationsPage = lazy(() => import('@/pages/tenant/notifications'));
const TenantProfilePage = lazy(() => import('@/pages/tenant/profile'));

// Error pages
const NotFoundPage = lazy(() => import('@/components/errors/not-found'));

const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);

/**
 * Renders the page element matching the current user's role for a shared path.
 * Used so that routes like `/dashboard`, `/payments` and `/maintenance` resolve to the
 * correct role-specific page instead of always matching the first declared (owner) route.
 */
const RolePage = ({ pages }: { pages: Partial<Record<UserRole, ReactNode>> }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const page = user.role ? pages[user.role] : undefined;

  if (!page) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{page}</>;
};

export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/accept-invitation" element={<AcceptInvitationPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            {/* Dashboard - role aware */}
            <Route
              path="/dashboard"
              element={
                <RolePage
                  pages={{
                    OWNER: <OwnerDashboardPage />,
                    MANAGER: <ManagerDashboardPage />,
                    TENANT: <TenantDashboardPage />,
                  }}
                />
              }
            />

            <Route
              path="/settings/managers"
              element={
                <RoleBasedRoute allowedRoles={['OWNER']}>
                  <OwnerManagersPage />
                </RoleBasedRoute>
              }
            />

            {/* Role-prefixed dashboards */}
            <Route
              path="/owner/dashboard"
              element={
                <RoleBasedRoute allowedRoles={['OWNER']}>
                  <OwnerDashboardPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/manager/dashboard"
              element={
                <RoleBasedRoute allowedRoles={['MANAGER']}>
                  <ManagerDashboardPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/tenant/dashboard"
              element={
                <RoleBasedRoute allowedRoles={['TENANT']}>
                  <TenantDashboardPage />
                </RoleBasedRoute>
              }
            />

            {/* ============================================ */}
            {/* PROPERTIES */}
            {/* ============================================ */}
            <Route
              path="/properties"
              element={
                <RolePage
                  pages={{
                    OWNER: <PropertiesPage />,
                    MANAGER: <ManagerPropertiesPage />,
                  }}
                />
              }
            />
            <Route
              path="/properties/new"
              element={
                <RoleBasedRoute allowedRoles={['OWNER']}>
                  <NewPropertyPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/properties/:id"
              element={
                <RolePage
                  pages={{
                    OWNER: <PropertyDetailPage />,
                    MANAGER: <ManagerPropertyDetailPage />,
                  }}
                />
              }
            />

            {/* ============================================ */}
            {/* UNITS */}
            {/* ============================================ */}
            <Route
              path="/units"
              element={
                <RolePage
                  pages={{
                    OWNER: <UnitsPage />,
                    MANAGER: <ManagerUnitsPage />,
                  }}
                />
              }
            />
            <Route
              path="/units/new"
              element={
                <RoleBasedRoute allowedRoles={['OWNER', 'MANAGER']}>
                  <NewUnitPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/units/:id"
              element={
                <RolePage
                  pages={{
                    OWNER: <UnitDetailPage />,
                    MANAGER: <ManagerUnitsDetailPage />,
                  }}
                />
              }
            />

            {/* ============================================ */}
            {/* TENANTS */}
            {/* ============================================ */}
            <Route
              path="/tenants"
              element={
                <RolePage
                  pages={{
                    OWNER: <TenantsPage />,
                    MANAGER: <ManagerTenantsPage />,
                  }}
                />
              }
            />
            <Route
              path="/tenants/new"
              element={
                <RoleBasedRoute allowedRoles={['OWNER', 'MANAGER']}>
                  <NewTenantPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/tenants/:id"
              element={
                <RolePage
                  pages={{
                    OWNER: <TenantDetailPage />,
                    MANAGER: <ManagerTenantDetailPage />,
                  }}
                />
              }
            />

            {/* ============================================ */}
            {/* LEASES */}
            {/* ============================================ */}
            <Route
              path="/leases"
              element={
                <RolePage
                  pages={{
                    OWNER: <LeasesPage />,
                    MANAGER: <ManagerLeasesPage />,
                  }}
                />
              }
            />
            <Route
              path="/leases/new"
              element={
                <RoleBasedRoute allowedRoles={['OWNER', 'MANAGER']}>
                  <NewLeasePage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/leases/:id"
              element={
                <RolePage
                  pages={{
                    OWNER: <LeaseDetailPage />,
                    MANAGER: <ManagerLeaseDetailPage />,
                  }}
                />
              }
            />
            <Route
              path="/leases/:id/edit"
              element={
                <RoleBasedRoute allowedRoles={['OWNER', 'MANAGER']}>
                  <LeaseEditPage />
                </RoleBasedRoute>
              }
            />

            {/* ============================================ */}
            {/* BILLING / INVOICES */}
            {/* ============================================ */}
            <Route
              path="/billing/invoices"
              element={
                <RolePage
                  pages={{
                    OWNER: <InvoicesPage />,
                    MANAGER: <ManagerInvoicesPage />,
                  }}
                />
              }
            />
            <Route
              path="/billing/invoices/:id"
              element={
                <RoleBasedRoute allowedRoles={['OWNER']}>
                  <InvoiceDetailPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/billing/invoices/new"
              element={
                <RoleBasedRoute allowedRoles={['OWNER', 'MANAGER']}>
                  <NewInvoicePage />
                </RoleBasedRoute>
              }
            />

            {/* ============================================ */}
            {/* PAYMENTS */}
            {/* ============================================ */}
            <Route
              path="/payments"
              element={
                <RolePage
                  pages={{
                    OWNER: <PaymentsPage />,
                    MANAGER: <ManagerPaymentsPage />,
                    TENANT: <TenantPaymentsPage />,
                  }}
                />
              }
            />
            <Route
              path="/payments/pay"
              element={
                <RoleBasedRoute allowedRoles={['TENANT']}>
                  <PayRentPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/payments/:id"
              element={
                <RolePage
                  pages={{
                    OWNER: <PaymentDetailPage />,
                    TENANT: <TenantPaymentDetailPage />,
                  }}
                />
              }
            />

            {/* ============================================ */}
            {/* MAINTENANCE */}
            {/* ============================================ */}
            <Route
              path="/maintenance"
              element={
                <RolePage
                  pages={{
                    OWNER: <OwnerMaintenancePage />,
                    MANAGER: <ManagerMaintenancePage />,
                    TENANT: <TenantMaintenancePage />,
                  }}
                />
              }
            />
            <Route
              path="/maintenance/new"
              element={
                <RoleBasedRoute allowedRoles={['TENANT']}>
                  <NewTicketPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/maintenance/:id"
              element={
                <RolePage
                  pages={{
                    OWNER: <OwnerTicketDetailPage />,
                    MANAGER: <ManagerTicketDetailPage />,
                    TENANT: <TenantTicketDetailPage />,
                  }}
                />
              }
            />

            {/* ============================================ */}
            {/* REPORTS (OWNER ONLY) */}
            {/* ============================================ */}
            <Route
              path="/reports"
              element={
                <RoleBasedRoute allowedRoles={['OWNER']}>
                  <ReportsIndexPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/reports/income-statement"
              element={
                <RoleBasedRoute allowedRoles={['OWNER']}>
                  <IncomeStatementPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/reports/rent-roll"
              element={
                <RoleBasedRoute allowedRoles={['OWNER']}>
                  <RentRollPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/reports/arrears-aging"
              element={
                <RoleBasedRoute allowedRoles={['OWNER']}>
                  <ArrearsAgingPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/reports/occupancy"
              element={
                <RoleBasedRoute allowedRoles={['OWNER']}>
                  <OccupancyPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/reports/maintenance"
              element={
                <RoleBasedRoute allowedRoles={['OWNER']}>
                  <MaintenanceReportPage />
                </RoleBasedRoute>
              }
            />

            {/* ============================================ */}
            {/* SETTINGS / PROFILE */}
            {/* ============================================ */}
            <Route
              path="/settings"
              element={
                <RoleBasedRoute allowedRoles={['OWNER']}>
                  <OwnerSettingsPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <RolePage
                  pages={{
                    OWNER: <OwnerProfilePage />,
                    MANAGER: <ManagerProfilePage />,
                    TENANT: <TenantProfilePage />,
                  }}
                />
              }
            />

            {/* ============================================ */}
            {/* TENANT-SPECIFIC ROUTES */}
            {/* ============================================ */}
            <Route
              path="/lease"
              element={
                <RoleBasedRoute allowedRoles={['TENANT']}>
                  <TenantLeasePage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/invoices"
              element={
                <RoleBasedRoute allowedRoles={['TENANT']}>
                  <TenantInvoicesPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/invoices/:id"
              element={
                <RoleBasedRoute allowedRoles={['TENANT']}>
                  <TenantInvoiceDetailPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <RoleBasedRoute allowedRoles={['TENANT']}>
                  <TenantNotificationsPage />
                </RoleBasedRoute>
              }
            />
          </Route>
        </Route>

        {/* 404 - Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};
