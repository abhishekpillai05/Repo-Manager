import { useState, useEffect, useCallback } from 'react';
import { GitFork, GitBranch, ShieldOff, Trash2 } from 'lucide-react';
import type { RepoSummary } from '@pt-repo-manager/shared-types';
import { StatsCard } from '@/components/common/StatsCard';
import { PageHeader } from '@/components/common/PageHeader';
import { Pagination } from '@/components/common/Pagination';
import { RepoTable } from '@/components/dashboard/RepoTable';
import { DashboardToolbar } from '@/components/dashboard/DashboardToolbar';
import { BulkActionToolbar } from '@/components/dashboard/BulkActionToolbar';
import { ConfirmDeleteModal } from '@/components/modals/ConfirmDeleteModal';
import { RevokeAccessModal } from '@/components/modals/RevokeAccessModal';
import { ArchiveRepoModal } from '@/components/modals/ArchiveRepoModal';
import { useDashboardFilters } from '@/hooks/useDashboardFilters';
import { repoService } from '@/services/repo.service';

// ─── Dashboard stats type (ready for API) ──────────────────────
interface DashboardStats {
  totalRepos: number | null;
  pendingDeletion: number | null;
  accessRevoked: number | null;
  archived: number | null;
}

export function Dashboard() {
  const {
    filters,
    setQuery, setAccessStatus, setRepoStatus,
    setSortBy, toggleSortOrder, setPage, resetFilters,
  } = useDashboardFilters();

  // ─── State: data ───────────────────
  const [rows, setRows] = useState<RepoSummary[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalRepos: null,
    pendingDeletion: null,
    accessRevoked: null,
    archived: null,
  });

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await repoService.listRepos(filters as any);
      setRows(res.data);
      setTotalPages(res.totalPages);
      setTotalItems(res.total);

      setStats({
        totalRepos: res.total,
        pendingDeletion: res.data.filter((r) => r.daysUntilDeletion !== null && r.daysUntilDeletion <= 3).length,
        accessRevoked: res.data.filter((r) => r.accessStatus === 'Revoked').length,
        archived: res.data.filter((r) => r.repoStatus === 'Archived').length,
      });
    } catch (err: any) {
      console.error('Failed to fetch repos', err);
      const status = err?.status;
      if (status === 401 || status === 403) {
        setError('Your session has expired. Please sign out and sign in again.');
      } else {
        setError(`Failed to load repositories: ${err?.message ?? 'Unknown error'}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ─── State: selection ──────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleSelectAll = () => {
    if (rows.every((r) => selectedIds.has(r.id))) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(rows.map((r) => r.id)));
    }
  };

  const clearSelection = () => setSelectedIds(new Set());

  // ─── State: modals ─────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<RepoSummary | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<RepoSummary | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<RepoSummary | null>(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Monitor and manage all pt- prefixed candidate repositories."
      />

      {/* ─── Error banner ────────────────────────────────────── */}
      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-5 py-4 flex items-center justify-between gap-4">
          <p className="text-sm text-destructive font-medium">{error}</p>
          <button
            onClick={fetchData}
            className="text-xs underline text-destructive hover:text-destructive/80 shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* ─── Stats grid ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Total repositories"
          value={stats.totalRepos}
          icon={GitFork}
          isLoading={isLoading}
          description="Active pt- prefixed repos"
        />
        <StatsCard
          title="Pending deletion"
          value={stats.pendingDeletion}
          icon={Trash2}
          isLoading={isLoading}
          description="Approaching auto-delete threshold"
        />
        <StatsCard
          title="Access revoked"
          value={stats.accessRevoked}
          icon={ShieldOff}
          isLoading={isLoading}
          description="Candidates without repo access"
        />
        <StatsCard
          title="Archived"
          value={stats.archived}
          icon={GitBranch}
          isLoading={isLoading}
          description="Read-only archived repositories"
        />
      </div>

      {/* ─── Toolbar ───────────────────────────────────────── */}
      <DashboardToolbar
        query={filters.query}
        accessStatus={filters.accessStatus}
        repoStatus={filters.repoStatus}
        sortBy={filters.sortBy}
        sortOrder={filters.sortOrder}
        onQueryChange={setQuery}
        onAccessStatusChange={setAccessStatus}
        onRepoStatusChange={setRepoStatus}
        onSortByChange={setSortBy}
        onToggleSortOrder={toggleSortOrder}
        onReset={resetFilters}
      />

      {/* ─── Bulk action bar ───────────────────────────────── */}
      <BulkActionToolbar
        selectedCount={selectedIds.size}
        onRevokeAccess={() => {/* bulk revoke placeholder */ }}
        onArchive={() => {/* bulk archive placeholder */ }}
        onDelete={() => {/* bulk delete placeholder */ }}
        onClearSelection={clearSelection}
      />

      {/* ─── Repository table ──────────────────────────────── */}
      <RepoTable
        rows={rows}
        isLoading={isLoading}
        selectedIds={selectedIds}
        sortBy={filters.sortBy}
        sortOrder={filters.sortOrder}
        onSort={setSortBy}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
        onArchive={setArchiveTarget}
        onDelete={setDeleteTarget}
        onRevokeAccess={setRevokeTarget}
      />

      {/* ─── Pagination ────────────────────────────────────── */}
      {totalPages > 1 && (
        <Pagination
          currentPage={filters.page}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={filters.limit}
          onPageChange={setPage}
        />
      )}

      {/* ─── Modals ────────────────────────────────────────── */}
      <ConfirmDeleteModal
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        repoName={deleteTarget?.name ?? ''}
        onConfirm={async () => {
          if (deleteTarget) {
            await repoService.deleteRepo(deleteTarget.name);
            setDeleteTarget(null);
            fetchData();
          }
        }}
      />
      <RevokeAccessModal
        open={!!revokeTarget}
        onOpenChange={(v) => !v && setRevokeTarget(null)}
        repoName={revokeTarget?.name ?? ''}
        isAll={true}
        onConfirm={async () => {
          if (revokeTarget) {
            await repoService.revokeAllAccess(revokeTarget.name);
            setRevokeTarget(null);
            fetchData();
          }
        }}
      />
      <ArchiveRepoModal
        open={!!archiveTarget}
        onOpenChange={(v) => !v && setArchiveTarget(null)}
        repoName={archiveTarget?.name ?? ''}
        onConfirm={async () => {
          if (archiveTarget) {
            await repoService.archiveRepo(archiveTarget.name);
            setArchiveTarget(null);
            fetchData();
          }
        }}
      />
    </div>
  );
}
