import { Badge } from '../ui/Badge';

interface StatusBadgeProps {
  status: 'Live' | 'Archived' | 'Pending Deletion';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const tone = status === 'Live' ? 'success' : status === 'Archived' ? 'neutral' : 'warning';
  return <Badge tone={tone}>{status}</Badge>;
}
