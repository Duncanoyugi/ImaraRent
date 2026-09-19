import { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './header';
import { OwnerSidebar } from './owner-sidebar';
import { ManagerSidebar } from './manager-sidebar';
import { TenantSidebar } from './tenant-sidebar';
import { MobileNav } from './mobile-nav';
import { AppCommandPalette } from './app-command-palette';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useNotificationSocket } from '@/lib/realtime/notifications.socket';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children?: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  // Realtime is behind a flag; the hook no-ops when it is off.
  useNotificationSocket(!!user);

  // Navigating on mobile should close the drawer, or it covers the new page.
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Escape closes the drawer — expected of any overlay.
  useEffect(() => {
    if (!sidebarOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [sidebarOpen]);

  const renderSidebar = useCallback(() => {
    switch (user?.role) {
      case 'MANAGER':
        return <ManagerSidebar />;
      case 'TENANT':
        return <TenantSidebar />;
      case 'OWNER':
      default:
        return <OwnerSidebar />;
    }
  }, [user?.role]);

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50 dark:bg-neutral-950">
      {/* Skip link: first tab stop, jumps past the nav to the page content. */}
      <a
        href="#main-content"
        className="sr-only-focusable absolute left-4 top-4 z-50 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white"
      >
        Skip to content
      </a>

      <div className="hidden lg:block">{renderSidebar()}</div>

      {/* Mobile drawer */}
      <div
        className={cn('fixed inset-0 z-40 lg:hidden', sidebarOpen ? 'block' : 'hidden')}
        aria-hidden={!sidebarOpen}
      >
        <div
          className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          className="fixed inset-y-0 left-0 w-64 max-w-[85vw] bg-white shadow-2xl dark:bg-neutral-900"
        >
          {renderSidebar()}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 overflow-y-auto p-4 pb-20 md:p-6 lg:pb-6"
        >
          <div className="mx-auto max-w-7xl">{children ?? <Outlet />}</div>
        </main>

        <MobileNav />
      </div>

      <AppCommandPalette />
    </div>
  );
};

AppLayout.displayName = 'AppLayout';
