import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrent?: boolean;
}

export const Breadcrumb = () => {
  const location = useLocation();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    if (paths.length === 0) {
      return [{ label: 'Dashboard', href: '/', isCurrent: true }];
    }

    let currentPath = '';
    breadcrumbs.push({ label: 'Dashboard', href: '/' });

    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      const isLast = index === paths.length - 1;

      let label = path
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());

      // Handle dynamic segments like [id]
      if (label.startsWith('[') && label.endsWith(']')) {
        label = 'Details';
      }

      breadcrumbs.push({
        label,
        href: currentPath,
        isCurrent: isLast,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-neutral-500 dark:text-neutral-400">
      {breadcrumbs.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="mx-1 h-4 w-4 text-neutral-300 dark:text-neutral-600" />
          )}
          {item.isCurrent ? (
            <span className="font-medium text-neutral-900 dark:text-neutral-100">
              {item.label}
            </span>
          ) : (
            <Link
              to={item.href}
              className="transition-colors hover:text-brand-600 dark:hover:text-brand-400"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};