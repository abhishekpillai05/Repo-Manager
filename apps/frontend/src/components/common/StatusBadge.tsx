import type { RepoSummary } from '@pt-repo-manager/shared-types';
import { Badge } from '@/components/ui/Badge';

type RepoStatus = RepoSummary['repoStatus'];
type AccessStatus = RepoSummary['accessStatus'];

const repoStatusConfig: Record<RepoStatus, { label: string; variant: 'success' | 'warning' | 'destructive' | 'muted' }> = {
  Live: { label: 'Live', variant: 'success' },
  Archived: { label: 'Archived', variant: 'muted' },
  'Pending Deletion': { label: 'Pending Deletion', variant: 'destructive' },
};

const accessStatusConfig: Record<AccessStatus, { label: string; variant: 'success' | 'warning' | 'destructive' | 'muted' }> = {
  Active: { label: 'Active', variant: 'success' },
  Revoked: { label: 'Revoked', variant: 'warning' },
};

interface RepoStatusBadgeProps {
  status: RepoStatus;
}

interface AccessStatusBadgeProps {
  status: AccessStatus;
}

export function RepoStatusBadge({ status }: RepoStatusBadgeProps) {
  const config = repoStatusConfig[status];
  return (
    <Badge variant={config.variant}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </Badge>
  );
}

export function AccessStatusBadge({ status }: AccessStatusBadgeProps) {
  const config = accessStatusConfig[status];
  return (
    <Badge variant={config.variant}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </Badge>
  );
}
