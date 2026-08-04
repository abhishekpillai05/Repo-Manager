import { Badge } from '../ui/Badge';

interface CountdownBadgeProps {
  daysLeft: number;
}

export function CountdownBadge({ daysLeft }: CountdownBadgeProps) {
  const tone = daysLeft > 30 ? 'success' : daysLeft >= 10 ? 'warning' : 'danger';
  return <Badge tone={tone}>{daysLeft} days left</Badge>;
}
