import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { NotificationBell } from '@/components/common/NotificationBell';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { UserDropdown } from '@/components/common/UserDropdown';
import { Separator } from '@/components/ui/Separator';
import { TooltipProvider } from '@/components/ui/Tooltip';

export function Navbar() {
  return (
    <TooltipProvider>
      <header className="sticky top-0 z-40 flex h-14 items-center border-b border-border bg-background/95 backdrop-blur-sm px-6 gap-4 flex-shrink-0">
        {/* Breadcrumbs */}
        <div className="flex-1 min-w-0">
          <Breadcrumbs />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          <NotificationBell count={0} />
          <ThemeToggle />
          <Separator orientation="vertical" className="h-5 mx-1" />
          <UserDropdown user={null} />
        </div>
      </header>
    </TooltipProvider>
  );
}
