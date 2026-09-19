import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  CreditCard,
  DoorOpen,
  FileText,
  LayoutDashboard,
  Receipt,
  ScrollText,
  Settings,
  UserCircle,
  Users,
  Wrench,
} from 'lucide-react';
import { CommandPalette, useCommandShortcut, type CommandItem } from '@/components/ui/command';
import { useAppStore } from '@/app/store/app.store';
import { useAuth } from '@/features/auth/hooks/use-auth';
import type { UserRole } from '@/types/user.types';

interface Destination {
  label: string;
  path: string;
  group: string;
  icon: React.ElementType;
  roles: UserRole[];
  keywords?: string;
}

/**
 * Everywhere a user can jump to, filtered by role. Kept as data so the
 * palette and the sidebars cannot drift apart on what a role may reach.
 */
const DESTINATIONS: Destination[] = [
  { label: 'Dashboard', path: '/dashboard', group: 'Go to', icon: LayoutDashboard, roles: ['OWNER', 'MANAGER', 'TENANT'], keywords: 'home overview' },
  { label: 'Properties', path: '/properties', group: 'Go to', icon: Building2, roles: ['OWNER', 'MANAGER'], keywords: 'buildings estates' },
  { label: 'Units', path: '/units', group: 'Go to', icon: DoorOpen, roles: ['OWNER', 'MANAGER'], keywords: 'rooms houses apartments' },
  { label: 'Tenants', path: '/tenants', group: 'Go to', icon: Users, roles: ['OWNER', 'MANAGER'], keywords: 'renters occupants' },
  { label: 'Leases', path: '/leases', group: 'Go to', icon: ScrollText, roles: ['OWNER', 'MANAGER'], keywords: 'agreements contracts' },
  { label: 'Invoices', path: '/billing/invoices', group: 'Go to', icon: FileText, roles: ['OWNER', 'MANAGER'], keywords: 'billing bills' },
  { label: 'Payments', path: '/payments', group: 'Go to', icon: CreditCard, roles: ['OWNER', 'MANAGER', 'TENANT'], keywords: 'mpesa receipts money' },
  { label: 'Maintenance', path: '/maintenance', group: 'Go to', icon: Wrench, roles: ['OWNER', 'MANAGER', 'TENANT'], keywords: 'repairs tickets issues' },
  { label: 'Reports', path: '/reports', group: 'Go to', icon: FileText, roles: ['OWNER'], keywords: 'analytics statements' },

  { label: 'My lease', path: '/lease', group: 'Go to', icon: ScrollText, roles: ['TENANT'] },
  { label: 'My invoices', path: '/invoices', group: 'Go to', icon: Receipt, roles: ['TENANT'] },
  { label: 'Notifications', path: '/notifications', group: 'Go to', icon: Receipt, roles: ['TENANT'] },

  { label: 'Add a property', path: '/properties/new', group: 'Create', icon: Building2, roles: ['OWNER'] },
  { label: 'Add a unit', path: '/units/new', group: 'Create', icon: DoorOpen, roles: ['OWNER'] },
  { label: 'Add a tenant', path: '/tenants/new', group: 'Create', icon: Users, roles: ['OWNER'] },
  { label: 'Create a lease', path: '/leases/new', group: 'Create', icon: ScrollText, roles: ['OWNER'] },
  { label: 'Raise a maintenance request', path: '/maintenance/new', group: 'Create', icon: Wrench, roles: ['TENANT'] },
  { label: 'Pay rent', path: '/payments/pay', group: 'Create', icon: CreditCard, roles: ['TENANT'], keywords: 'mpesa stk' },

  { label: 'Your profile', path: '/profile', group: 'Account', icon: UserCircle, roles: ['OWNER', 'MANAGER', 'TENANT'] },
  { label: 'Settings', path: '/settings', group: 'Account', icon: Settings, roles: ['OWNER'] },
  { label: 'Team access', path: '/settings/managers', group: 'Account', icon: Users, roles: ['OWNER'], keywords: 'managers invite permissions' },
];

/** Global ⌘K navigator, mounted once by the app layout. */
export const AppCommandPalette = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const open = useAppStore((state) => state.commandPaletteOpen);
  const setOpen = useAppStore((state) => state.setCommandPaletteOpen);

  useCommandShortcut(useCallback(() => setOpen(true), [setOpen]));

  const items = useMemo<CommandItem[]>(() => {
    if (!user) return [];
    return DESTINATIONS.filter((entry) => entry.roles.includes(user.role)).map((entry) => ({
      id: entry.path + entry.label,
      label: entry.label,
      group: entry.group,
      icon: entry.icon,
      keywords: entry.keywords,
      onSelect: () => navigate(entry.path),
    }));
  }, [user, navigate]);

  if (!user) return null;

  return <CommandPalette open={open} onOpenChange={setOpen} items={items} />;
};

AppCommandPalette.displayName = 'AppCommandPalette';
