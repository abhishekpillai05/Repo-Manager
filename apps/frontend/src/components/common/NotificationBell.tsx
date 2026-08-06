import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/Tooltip';

interface NotificationBellProps {
  count?: number;
}

export function NotificationBell({ count = 0 }: NotificationBellProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={`Notifications${count > 0 ? ` (${count} unread)` : ''}`}
          id="notification-bell"
        >
          <Bell className="h-4 w-4" />
          {count > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive" />
            </span>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {count > 0 ? `${count} upcoming deletions` : 'No notifications'}
      </TooltipContent>
    </Tooltip>
  );
}
