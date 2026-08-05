import {
  LayoutDashboard,
  CreditCard,
  FileText,
  Wrench,
  Bell,
  User,
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
    title: 'My Account',
    items: [
      {
        icon: <CreditCard className="h-5 w-5" />,
        label: 'Payments',
        href: '/payments',
      },
      {
        icon: <FileText className="h-5 w-5" />,
        label: 'My Lease',
        href: '/lease',
      },
      {
        icon: <Wrench className="h-5 w-5" />,
        label: 'Maintenance',
        href: '/maintenance',
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
        icon: <User className="h-5 w-5" />,
        label: 'Profile',
        href: '/profile',
      },
    ],
  },
];

export const TenantSidebar = () => {
  return <Sidebar sections={sections} />;
};