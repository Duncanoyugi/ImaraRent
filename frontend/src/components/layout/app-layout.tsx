import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './header';
import { OwnerSidebar } from './owner-sidebar';
import { ManagerSidebar } from './manager-sidebar';
import { TenantSidebar } from './tenant-sidebar';
import { MobileNav } from './mobile-nav';
import { useAuth } from '@/features/auth/hooks/use-auth';

interface AppLayoutProps {
  children?: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const getSidebar = () => {
    switch (user?.role) {
      case 'OWNER':
        return <OwnerSidebar />;
      case 'MANAGER':
        return <ManagerSidebar />;
      case 'TENANT':
        return <TenantSidebar />;
      default:
        return <OwnerSidebar />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50 dark:bg-neutral-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        {getSidebar()}
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
      >
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-neutral-900">
          {getSidebar()}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-neutral-50 p-4 md:p-6 dark:bg-neutral-900">
          <div className="mx-auto max-w-7xl">
            {children || <Outlet />}
          </div>
        </main>
        <MobileNav />
      </div>
    </div>
  );
};