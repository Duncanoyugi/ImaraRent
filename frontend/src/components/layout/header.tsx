import { LogOut, Menu, Search, Settings, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { NotificationBell } from '@/features/notifications/components/notification-bell';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useLogout } from '@/features/auth/hooks/use-logout';
import { useAppStore } from '@/app/store/app.store';
import { initials } from '@/utils/string-helpers';
import { longDate } from '@/utils/date-formatter';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const { user } = useAuth();
  const logout = useLogout();
  const navigate = useNavigate();
  const openCommandPalette = useAppStore((state) => state.setCommandPaletteOpen);

  const name = user ? `${user.firstName} ${user.lastName}` : 'User';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-2 border-b border-neutral-200 bg-white/80 px-4 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-900/80">
      <div className="flex min-w-0 items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <p className="hidden truncate text-sm text-neutral-500 sm:block dark:text-neutral-400">
          {longDate(new Date())}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {/* Search is a keyboard-first affordance; the button is for discovery. */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => openCommandPalette(true)}
          className="hidden h-9 gap-2 px-3 text-neutral-500 md:flex"
        >
          <Search className="h-4 w-4" />
          <span className="text-sm">Search</span>
          <kbd className="ml-2 rounded border border-neutral-200 px-1.5 py-0.5 text-[10px] dark:border-neutral-700">
            ⌘K
          </kbd>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => openCommandPalette(true)}
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </Button>

        <ThemeToggle className="hidden sm:flex" />
        <NotificationBell />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300">
                  {initials(user?.firstName, user?.lastName)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden max-w-32 truncate text-sm font-medium sm:inline-block">
                {name}
              </span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel>
              <div className="flex flex-col gap-1">
                <p className="truncate text-sm font-medium">{name}</p>
                <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                  {user?.email}
                </p>
                {user?.role && (
                  <Badge variant="brand" className="mt-1 w-fit text-[10px]">
                    {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                  </Badge>
                )}
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Your profile
              </Link>
            </DropdownMenuItem>

            {user?.role === 'OWNER' && (
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="flex items-center gap-2 text-error-600 focus:text-error-600"
              onClick={() =>
                logout.mutate(undefined, {
                  // Land on login even if the API call fails — the local
                  // session is cleared either way.
                  onSettled: () => navigate('/login', { replace: true }),
                })
              }
              disabled={logout.isPending}
            >
              <LogOut className="h-4 w-4" />
              {logout.isPending ? 'Signing out…' : 'Sign out'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

Header.displayName = 'Header';
