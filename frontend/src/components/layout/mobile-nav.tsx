import { useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Home,
  Users,
  Receipt,
  CreditCard,
  Wrench,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/features/auth/hooks/use-auth';

interface NavItem {
  icon: typeof LayoutDashboard;
  label: string;
  href: string;
  visible: boolean;
}

export const MobileNav = () => {
  const location = useLocation();
  const { user } = useAuth();

  const getNavItems = (): NavItem[] => {
    const baseItems: NavItem[] = [
      {
        icon: LayoutDashboard,
        label: 'Dashboard',
        href: '/dashboard',
        visible: true,
      },
    ];

    if (user?.role === 'OWNER' || user?.role === 'MANAGER') {
      baseItems.push(
        {
          icon: Home,
          label: 'Properties',
          href: '/properties',
          visible: true,
        },
        {
          icon: Users,
          label: 'Tenants',
          href: '/tenants',
          visible: true,
        },
        {
          icon: Receipt,
          label: 'Billing',
          href: '/billing/invoices',
          visible: true,
        },
        {
          icon: CreditCard,
          label: 'Payments',
          href: '/payments',
          visible: true,
        },
        {
          icon: Wrench,
          label: 'Maintenance',
          href: '/maintenance',
          visible: true,
        }
      );
    }

    if (user?.role === 'TENANT') {
      baseItems.push(
        {
          icon: CreditCard,
          label: 'Payments',
          href: '/payments',
          visible: true,
        },
        {
          icon: Wrench,
          label: 'Maintenance',
          href: '/maintenance',
          visible: true,
        }
      );
    }

    baseItems.push({
      icon: User,
      label: 'Profile',
      href: '/profile',
      visible: true,
    });

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 lg:hidden">
      <div className="grid h-16 grid-cols-5 items-center">
        {navItems.slice(0, 5).map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 text-xs transition-colors',
                isActive
                  ? 'text-brand-600 dark:text-brand-400'
                  : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};