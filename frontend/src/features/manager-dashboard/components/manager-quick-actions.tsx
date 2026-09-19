import { Link } from 'react-router-dom';
import { CreditCard, ScrollText, UserPlus, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const ACTIONS = [
  {
    label: 'Add a tenant',
    description: 'Invite someone to a unit',
    to: '/tenants/new',
    icon: UserPlus,
    tone: 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400',
  },
  {
    label: 'Create a lease',
    description: 'Put an agreement in place',
    to: '/leases/new',
    icon: ScrollText,
    tone: 'bg-info-50 text-info-600 dark:bg-info-900/30 dark:text-info-400',
  },
  {
    label: 'Record a payment',
    description: 'Log cash or a bank transfer',
    to: '/payments',
    icon: CreditCard,
    tone: 'bg-success-50 text-success-600 dark:bg-success-900/30 dark:text-success-400',
  },
  {
    label: 'Maintenance',
    description: 'Assign and close tickets',
    to: '/maintenance',
    icon: Wrench,
    tone: 'bg-warning-50 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400',
  },
];

export const ManagerQuickActions = () => (
  <Card>
    <CardHeader>
      <CardTitle>Quick actions</CardTitle>
    </CardHeader>
    <CardContent className="grid gap-2 sm:grid-cols-2">
      {ACTIONS.map(({ label, description, to, icon: Icon, tone }) => (
        <Link
          key={to}
          to={to}
          className="flex items-center gap-3 rounded-xl border border-neutral-200 p-3 transition-colors hover:border-brand-300 hover:bg-brand-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-neutral-800 dark:hover:bg-neutral-800/60"
        >
          <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', tone)}>
            <Icon className="h-4.5 w-4.5" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {label}
            </span>
            <span className="block truncate text-xs text-neutral-500 dark:text-neutral-400">
              {description}
            </span>
          </span>
        </Link>
      ))}
    </CardContent>
  </Card>
);

ManagerQuickActions.displayName = 'ManagerQuickActions';
