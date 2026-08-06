import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { COUNTDOWN_DANGER_DAYS, COUNTDOWN_WARNING_DAYS } from '@/lib/constants';

interface CountdownBadgeProps {
  daysLeft: number;
  className?: string;
}

export function CountdownBadge({ daysLeft, className }: CountdownBadgeProps) {
  const isExpired = daysLeft <= 0;
  const isDanger = daysLeft > 0 && daysLeft <= COUNTDOWN_DANGER_DAYS;
  const isWarning = daysLeft > COUNTDOWN_DANGER_DAYS && daysLeft <= COUNTDOWN_WARNING_DAYS;
  const isSafe = daysLeft > COUNTDOWN_WARNING_DAYS;

  const label = isExpired
    ? 'Expired'
    : daysLeft === 1
      ? '1 day left'
      : `${daysLeft} days left`;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border',
        {
          'bg-destructive/10 text-destructive border-destructive/20': isExpired || isDanger,
          'bg-warning/10 text-warning border-warning/20': isWarning,
          'bg-success/10 text-success border-success/20': isSafe,
        },
        className,
      )}
    >
      <Clock className="h-3 w-3" />
      {label}
    </span>
  );
}
