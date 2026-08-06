import { APP_NAME, APP_VERSION } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-3 flex items-center justify-between text-xs text-muted-foreground flex-shrink-0">
      <span>
        {APP_NAME} · v{APP_VERSION}
      </span>
      <span>GitHub Repository Lifecycle Management</span>
    </footer>
  );
}
