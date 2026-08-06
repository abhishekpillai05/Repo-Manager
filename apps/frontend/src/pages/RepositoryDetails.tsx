import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, ExternalLink, GitFork, User, Users, CalendarClock,
  ShieldOff, Archive, Trash2, RefreshCw, Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Separator } from '@/components/ui/Separator';
import { Skeleton } from '@/components/ui/Skeleton';
import { RepoStatusBadge, AccessStatusBadge } from '@/components/common/StatusBadge';
import { CountdownBadge } from '@/components/common/CountdownBadge';
import { ConfirmDeleteModal } from '@/components/modals/ConfirmDeleteModal';
import { RevokeAccessModal } from '@/components/modals/RevokeAccessModal';
import { ArchiveRepoModal } from '@/components/modals/ArchiveRepoModal';
import { ExtendDeadlineModal } from '@/components/modals/ExtendDeadlineModal';
import { ErrorState } from '@/components/common/ErrorState';
import { formatDate, formatDateTime } from '@/lib/utils';

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="text-xs text-muted-foreground min-w-[120px] flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-foreground text-right flex-1">{children}</span>
    </div>
  );
}

// ─── Skeleton for loading state ────────────────────────────────
function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-md" />
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-52" />
          <Skeleton className="h-3.5 w-36" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader><Skeleton className="h-4 w-28" /></CardHeader>
            <CardContent className="space-y-3 pt-0">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="flex justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-28" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function RepositoryDetails() {
  const { id } = useParams<{ id: string }>();

  // ─── State placeholders (ready for API) ────────────────────
  const isLoading = false;
  const error: string | null = null;
  const repo = null as null; // will be: RepoDetails | null from repoService.getRepoById(id)

  // ─── Modal state ───────────────────────────────────────────
  const [showDelete, setShowDelete] = useState(false);
  const [showRevoke, setShowRevoke] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [showExtend, setShowExtend] = useState(false);

  if (isLoading) return (
    <div className="space-y-6">
      <Link to="/repositories" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to repositories
      </Link>
      <DetailSkeleton />
    </div>
  );

  if (error) return (
    <div className="space-y-6">
      <Link to="/repositories" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to repositories
      </Link>
      <ErrorState title="Failed to load repository" description={error} onRetry={() => {}} />
    </div>
  );

  if (!repo) return (
    <div className="space-y-6">
      <Link to="/repositories" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to repositories
      </Link>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-4">
          <GitFork className="h-7 w-7 text-muted-foreground" />
        </div>
        <h3 className="text-sm font-semibold mb-1">Repository not loaded</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Connect the backend API to load repository details for ID:{' '}
          <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">{id}</code>
        </p>
      </div>
    </div>
  );

  // ─── When repo data is available (from API) ─────────────────
  // The following renders using real repo data
  return (
    <div className="space-y-6">
      {/* Back nav */}
      <Link
        to="/repositories"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to repositories
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary mt-0.5">
            <GitFork className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-foreground font-mono">{repo}</h1>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">Repository ID: {id}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExtend(true)}
            className="gap-1.5"
            id="extend-deadline-btn"
          >
            <CalendarClock className="h-3.5 w-3.5" />
            Override deadline
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRevoke(true)}
            className="gap-1.5"
            id="revoke-access-btn"
          >
            <ShieldOff className="h-3.5 w-3.5" />
            Revoke access
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowArchive(true)}
            className="gap-1.5"
            id="archive-repo-btn"
          >
            <Archive className="h-3.5 w-3.5" />
            Archive
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDelete(true)}
            className="gap-1.5"
            id="delete-repo-btn"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Repository info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitFork className="h-4 w-4 text-muted-foreground" />
              Repository
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="divide-y divide-border">
              <InfoRow label="Name"><span className="font-mono text-xs">—</span></InfoRow>
              <InfoRow label="Status"><RepoStatusBadge status="Live" /></InfoRow>
              <InfoRow label="Access"><AccessStatusBadge status="Active" /></InfoRow>
              <InfoRow label="Created">—</InfoRow>
              <InfoRow label="Description"><span className="text-muted-foreground italic">No description</span></InfoRow>
            </div>
          </CardContent>
        </Card>

        {/* Candidate info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              Candidate
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="divide-y divide-border">
              <InfoRow label="Name">—</InfoRow>
              <InfoRow label="Role">—</InfoRow>
              <InfoRow label="Days since creation">—</InfoRow>
            </div>
            <Separator className="my-3" />
            <p className="text-xs text-muted-foreground">
              Candidate details are parsed from the repository name using the{' '}
              <code className="font-mono bg-muted px-1 rounded">pt-role-name</code> naming convention.
            </p>
          </CardContent>
        </Card>

        {/* Lifecycle info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Lifecycle
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="divide-y divide-border">
              <InfoRow label="Days remaining"><CountdownBadge daysLeft={0} /></InfoRow>
              <InfoRow label="Scheduled deletion">—</InfoRow>
              <InfoRow label="Retention (days)">—</InfoRow>
              <InfoRow label="Override active">—</InfoRow>
              <InfoRow label="Override reason">—</InfoRow>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Collaborators */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              Collaborators
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              id="refresh-collaborators-btn"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Users className="h-8 w-8 text-muted-foreground/40 mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">No collaborators loaded</p>
            <p className="text-xs text-muted-foreground max-w-xs">
              Collaborator data will be fetched from the GitHub API when the backend is connected.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <ConfirmDeleteModal
        open={showDelete}
        onOpenChange={setShowDelete}
        repoName="repository-name"
        onConfirm={() => setShowDelete(false)}
      />
      <RevokeAccessModal
        open={showRevoke}
        onOpenChange={setShowRevoke}
        repoName="repository-name"
        isAll
        onConfirm={() => setShowRevoke(false)}
      />
      <ArchiveRepoModal
        open={showArchive}
        onOpenChange={setShowArchive}
        repoName="repository-name"
        onConfirm={() => setShowArchive(false)}
      />
      <ExtendDeadlineModal
        open={showExtend}
        onOpenChange={setShowExtend}
        repoName="repository-name"
        currentDaysLeft={0}
        currentRetentionDays={90}
        onConfirm={() => setShowExtend(false)}
      />
    </div>
  );
}
