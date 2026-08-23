import {
  LayoutDashboard,
  Building2,
  Home,
  Users,
  FileText,
  Receipt,
  CreditCard,
  Wrench,
  BarChart3,
  Bell,
  UserPlus,
} from 'lucide-react';
import { Sidebar } from './sidebar';

const sections = [
  {
    items: [
      {
        icon: <LayoutDashboard className="h-5 w-5" />,
        label: 'Dashboard',
        href: '/dashboard',
      },
    ],
  },
  {
    title: 'Management',
    items: [
      {
        icon: <Building2 className="h-5 w-5" />,
        label: 'Properties',
        href: '/properties',
      },
      {
        icon: <Home className="h-5 w-5" />,
        label: 'Units',
        href: '/units',
      },
      {
        icon: <Users className="h-5 w-5" />,
        label: 'Tenants',
        href: '/tenants',
      },
      {
        icon: <FileText className="h-5 w-5" />,
        label: 'Leases',
        href: '/leases',
      },
    ],
  },
  {
    title: 'Finance',
    items: [
      {
        icon: <Receipt className="h-5 w-5" />,
        label: 'Billing',
        href: '/billing/invoices',
      },
      {
        icon: <CreditCard className="h-5 w-5" />,
        label: 'Payments',
        href: '/payments',
      },
    ],
  },
  {
    title: 'Operations',
    items: [
      {
        icon: <Wrench className="h-5 w-5" />,
        label: 'Maintenance',
        href: '/maintenance',
      },
      {
        icon: <BarChart3 className="h-5 w-5" />,
        label: 'Reports',
        href: '/reports',
      },
    ],
  },
  {
    title: 'Settings',
    items: [
      {
        icon: <Bell className="h-5 w-5" />,
        label: 'Notifications',
        href: '/notifications',
      },
      {
        icon: <UserPlus className="h-5 w-5" />,
        label: 'Manager Access',
        href: '/settings/managers',
      },
    ],
  },
];

export const OwnerSidebar = () => {
  return <Sidebar sections={sections} />;
};