import { LogOut, Settings, User, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { Button } from '@/components/ui/Button';
import { getInitials } from '@/lib/utils';
import type { AuthUser } from '@/services/auth.service';

interface UserDropdownProps {
  user?: AuthUser | null;
}

export function UserDropdown({ user }: UserDropdownProps) {
  const displayName = user?.name ?? 'Tech Lead';
  const username = user?.username ?? '—';
  const initials = getInitials(displayName);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-2 h-9"
          id="user-dropdown"
          aria-label="User menu"
        >
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={displayName}
              className="h-7 w-7 rounded-full object-cover ring-2 ring-border"
            />
          ) : (
            <span className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold ring-2 ring-border">
              {initials}
            </span>
          )}
          <span className="hidden sm:block text-sm font-medium text-foreground max-w-[120px] truncate">
            {displayName}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-foreground leading-none">{displayName}</p>
            <p className="text-xs text-muted-foreground leading-none">@{username}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex items-center gap-2 cursor-pointer">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="#profile" className="flex items-center gap-2 cursor-pointer">
            <User className="h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive gap-2 cursor-pointer">
          <LogOut className="h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
