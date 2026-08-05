import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/shared/logo';
import { Separator } from '@/components/ui/separator';

interface SidebarItem {
  icon: ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

interface SidebarProps {
  sections: SidebarSection[];
  className?: string;
}

export const Sidebar = ({ sections, className }: SidebarProps) => {
  const location = useLocation();

  return (
    <aside
      className={cn(
        'flex h-full w-64 flex-col border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900',
        className
      )}
    >
      <div className="flex h-16 items-center px-6">
        <Logo />
      </div>
      <Separator />
      <nav className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {section.title && (
              <p className="px-2 text-xs font-semibold uppercase text-neutral-400 dark:text-neutral-500">
                {section.title}
              </p>
            )}
            {section.items.map((item, itemIdx) => {
              const isActive =
                location.pathname === item.href ||
                (item.href !== '/' && location.pathname.startsWith(item.href));

              return (
                <Link
                  key={itemIdx}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100'
                  )}
                >
                  <span
                    className={cn(
                      'h-5 w-5',
                      isActive ? 'text-brand-600' : 'text-neutral-400'
                    )}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                  {item.active && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-brand-500" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <Separator />
      <div className="p-4">
        <p className="text-xs text-neutral-400 dark:text-neutral-500">
          ImaraRent v1.0.0
        </p>
      </div>
    </aside>
  );
};