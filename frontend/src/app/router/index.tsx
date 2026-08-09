import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AppLayout } from '@/components/layout';
import { ProtectedRoute } from './protected-route';
import { RoleBasedRoute } from './role-based-route';
import { PublicRoute } from './public-route';

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
const OwnerProfilePage = lazy(() => import('@/pages/owner/profile'));

// Manager pages
const ManagerDashboardPage = lazy(() => import('@/pages/manager/dashboard'));
const ManagerPropertiesPage = lazy(() => import('@/pages/manager/properties'));
const ManagerUnitsPage = lazy(() => import('@/pages/manager/units'));
const ManagerTenantsPage = lazy(() => import('@/pages/manager/tenants'));
const ManagerLeasesPage = lazy(() => import('@/pages/manager/leases'));

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
            {/* Dashboard - All roles */}
            <Route
              path="/dashboard"
              element={
                <RoleBasedRoute allowedRoles={['OWNER', 'MANAGER', 'TENANT']}>
                  <OwnerDashboardPage />
                </RoleBasedRoute>
              }
            />
            
            {/* ============================================ */}
            {/* OWNER ROUTES */}
            {/* ============================================ */}
            <Route
              path="/owner/dashboard"
              element={
                <RoleBasedRoute allowedRoles={['OWNER']}>
                  <OwnerDashboardPage />
                </RoleBasedRoute>
              }
            />
            
            {/* Management */}
            <Route
              path="/properties"
              element={
                <RoleBasedRoute allowedRoles={['OWNER']}>
                  <PropertiesPage />
                </RoleBasedRoute>
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
                <RoleBasedRoute allowedRoles={['OWNER']}>
                  <PropertyDetailPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/units"
              element={
                <RoleBasedRoute allowedRoles={['OWNER']}>
                  <UnitsPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/units/new"
              element={
                <RoleBasedRoute allowedRoles={['OWNER']}>
                  <NewUnitPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/units/:id"
              element={
                <RoleBasedRoute allowedRoles={['OWNER']}>
                  <UnitDetailPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/tenants"
              element={
                <RoleBasedRoute allowedRoles={['OWNER']}>
                  <TenantsPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/tenants/new"
              element={
                <RoleBasedRoute allowedRoles={['OWNER']}>
                  <NewTenantPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/tenants/:id"
              element={
                <RoleBasedRoute allowedRoles={['OWNER']}>
                  <TenantDetailPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/leases"
              element={
                <RoleBasedRoute allowedRoles={['OWNER']}>
                  <LeasesPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/leases/new"
              element={
                <RoleBasedRoute allowedRoles={['OWNER']}>
                  <NewLeasePage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/leases/:id"
              element={
                <RoleBasedRoute allowedRoles={['OWNER']}>
                  <LeaseDetailPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/leases/:id/edit"
              element={
                <RoleBasedRoute allowedRoles={['OWNER']}>
                  <LeaseEditPage />
                </RoleBasedRoute>
              }
            />

            {/* Finance */}
            <Route
              path="/billing/invoices"
              element={
                <RoleBasedRoute allowedRoles={['OWNER']}>
                  <InvoicesPage />
                </RoleBasedRoute>
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
            <Route
              path="/payments"
              element={
                <RoleBasedRoute allowedRoles={['OWNER']}>
                  <PaymentsPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/payments/:id"
              element={
                <RoleBasedRoute allowedRoles={['OWNER']}>
                  <PaymentDetailPage />
                </RoleBasedRoute>
              }
            />

            {/* Operations */}
            <Route
              path="/maintenance"
              element={
                <RoleBasedRoute allowedRoles={['OWNER']}>
                  <OwnerMaintenancePage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/maintenance/:id"
              element={
                <RoleBasedRoute allowedRoles={['OWNER']}>
                  <OwnerTicketDetailPage />
                </RoleBasedRoute>
              }
            />

            {/* Reports */}
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

            {/* Settings */}
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
                <RoleBasedRoute allowedRoles={['OWNER', 'MANAGER', 'TENANT']}>
                  <OwnerProfilePage />
                </RoleBasedRoute>
              }
            />

            {/* ============================================ */}
            {/* MANAGER ROUTES */}
            {/* ============================================ */}
            <Route
              path="/manager/dashboard"
              element={
                <RoleBasedRoute allowedRoles={['MANAGER']}>
                  <ManagerDashboardPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/properties"
              element={
                <RoleBasedRoute allowedRoles={['MANAGER']}>
                  <ManagerPropertiesPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/units"
              element={
                <RoleBasedRoute allowedRoles={['MANAGER']}>
                  <ManagerUnitsPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/tenants"
              element={
                <RoleBasedRoute allowedRoles={['MANAGER']}>
                  <ManagerTenantsPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/leases"
              element={
                <RoleBasedRoute allowedRoles={['MANAGER']}>
                  <ManagerLeasesPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/billing/invoices"
              element={
                <RoleBasedRoute allowedRoles={['MANAGER']}>
                  <ManagerInvoicesPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/payments"
              element={
                <RoleBasedRoute allowedRoles={['MANAGER']}>
                  <ManagerPaymentsPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/maintenance"
              element={
                <RoleBasedRoute allowedRoles={['MANAGER']}>
                  <ManagerMaintenancePage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/maintenance/:id"
              element={
                <RoleBasedRoute allowedRoles={['MANAGER']}>
                  <ManagerTicketDetailPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <RoleBasedRoute allowedRoles={['MANAGER']}>
                  <ManagerProfilePage />
                </RoleBasedRoute>
              }
            />

            {/* ============================================ */}
            {/* TENANT ROUTES */}
            {/* ============================================ */}
            <Route
              path="/tenant/dashboard"
              element={
                <RoleBasedRoute allowedRoles={['TENANT']}>
                  <TenantDashboardPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <RoleBasedRoute allowedRoles={['TENANT']}>
                  <TenantDashboardPage />
                </RoleBasedRoute>
              }
            />
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
              path="/payments"
              element={
                <RoleBasedRoute allowedRoles={['TENANT']}>
                  <TenantPaymentsPage />
                </RoleBasedRoute>
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
              path="/maintenance"
              element={
                <RoleBasedRoute allowedRoles={['TENANT']}>
                  <TenantMaintenancePage />
                </RoleBasedRoute>
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
                <RoleBasedRoute allowedRoles={['TENANT']}>
                  <TenantTicketDetailPage />
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
            <Route
              path="/profile"
              element={
                <RoleBasedRoute allowedRoles={['TENANT']}>
                  <TenantProfilePage />
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