import { Link } from 'react-router-dom';
import { ArrowLeft, GitFork } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 px-8 max-w-md">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
            <GitFork className="h-10 w-10 text-muted-foreground/60" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            404 — Page not found
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            This page doesn't exist
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The page you're looking for may have been moved, deleted, or never existed. Double-check
            the URL or navigate back to the dashboard.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <Button asChild variant="default" className="gap-2" id="go-home-btn">
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" id="go-audit-btn">
            <Link to="/audit-log">Audit Log</Link>
          </Button>
        </div>

        {/* Decorative code block */}
        <div className="rounded-lg border border-border bg-muted/30 p-4 text-left">
          <p className="text-xs font-mono text-muted-foreground">
            <span className="text-primary">GET</span> /api/page{' '}
            <span className="text-destructive">404 Not Found</span>
          </p>
        </div>
      </div>
    </div>
  );
}
