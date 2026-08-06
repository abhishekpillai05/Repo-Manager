import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  repositories: 'Repositories',
  settings: 'Settings',
  'audit-log': 'Audit Log',
  'not-found': 'Not Found',
};

export function Breadcrumbs() {
  const { pathname } = useLocation();

  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  const crumbs = segments.map((seg, idx) => {
    const href = '/' + segments.slice(0, idx + 1).join('/');
    const label = routeLabels[seg] ?? seg;
    const isLast = idx === segments.length - 1;
    return { href, label, isLast };
  });

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-muted-foreground">
      <Link
        to="/dashboard"
        className="flex items-center hover:text-foreground transition-colors"
        aria-label="Home"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>
      {crumbs.map((crumb) => (
        <span key={crumb.href} className="flex items-center gap-1">
          <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
          {crumb.isLast ? (
            <span className="font-medium text-foreground" aria-current="page">
              {crumb.label}
            </span>
          ) : (
            <Link
              to={crumb.href}
              className={cn('hover:text-foreground transition-colors')}
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
