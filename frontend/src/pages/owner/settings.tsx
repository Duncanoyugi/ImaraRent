import { Link } from 'react-router-dom';
import { CreditCard, ExternalLink, Smartphone } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  OrganizationMembers,
  OrganizationSettings,
  OrganizationStats,
} from '@/features/organizations';
import { mpesaConfig } from '@/config/mpesa.config';
import { featureFlags } from '@/config/feature-flags';

/**
 * Owner settings: organization profile, team access, and a read-only view of
 * how payments are configured. Payment credentials are deliberately not
 * editable here — they live on the server and are never sent to the browser.
 */
export default function OwnerSettingsPage() {
  return (
    <div className="page-stack">
      <PageHeader
        title="Settings"
        description="Your organization's details, who has access, and how tenants pay you."
      />

      <OrganizationStats />

      <OrganizationSettings />

      <OrganizationMembers />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
              <CreditCard className="h-4.5 w-4.5" />
            </span>
            <div>
              <CardTitle>Payments</CardTitle>
              <CardDescription>How tenants settle their invoices.</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-start justify-between gap-4 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
            <div className="flex min-w-0 gap-3">
              <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-neutral-400" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  M-Pesa
                </p>
                <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                  {mpesaConfig.enabled
                    ? 'Tenants can pay from their dashboard with an STK push.'
                    : 'Turned off. Tenants can still be recorded as paying by cash or bank transfer.'}
                </p>
                {mpesaConfig.enabled && mpesaConfig.shortCode && (
                  <p className="mt-1 text-xs text-neutral-500 tabular dark:text-neutral-400">
                    Paybill {mpesaConfig.shortCode} · account: {mpesaConfig.accountLabel}
                  </p>
                )}
              </div>
            </div>

            <Badge variant={mpesaConfig.enabled ? 'success' : 'default'}>
              {mpesaConfig.enabled ? 'On' : 'Off'}
            </Badge>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: 'Cash', on: true },
              { label: 'Bank transfer', on: true },
              { label: 'Card', on: false },
            ].map(({ label, on }) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2.5 dark:border-neutral-800"
              >
                <span className="text-sm text-neutral-700 dark:text-neutral-300">{label}</span>
                <Badge variant={on ? 'success' : 'default'}>{on ? 'On' : 'Off'}</Badge>
              </div>
            ))}
          </div>

          <Alert variant="info">
            <AlertDescription>
              M-Pesa credentials are held on the server and are never exposed to the browser.
              To change your paybill or go from sandbox to live, update the backend
              environment and redeploy. Currently running in{' '}
              <strong>{mpesaConfig.environment}</strong> mode.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
          <CardDescription>
            What is switched on for this deployment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 sm:grid-cols-2">
            {[
              { label: 'M-Pesa payments', on: featureFlags.mpesa.enabled },
              { label: 'Live updates', on: featureFlags.realtime.enabled },
              { label: 'Offline support', on: featureFlags.pwa.enabled },
              { label: 'Reports', on: featureFlags.reports.enabled },
              { label: 'Maintenance photos', on: featureFlags.maintenance.photoUpload },
              { label: 'Tenant portal', on: featureFlags.tenantPortal.enabled },
            ].map(({ label, on }) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2.5 dark:border-neutral-800"
              >
                <dt className="text-sm text-neutral-700 dark:text-neutral-300">{label}</dt>
                <dd>
                  <Badge variant={on ? 'success' : 'default'}>{on ? 'On' : 'Off'}</Badge>
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage property assignments</CardTitle>
          <CardDescription>
            Choose which properties each manager can see and work on.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            to="/settings/managers"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
          >
            Open manager access
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
