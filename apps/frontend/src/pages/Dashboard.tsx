import { useState } from 'react';
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

  // ─── State: data (empty — ready for API) ───────────────────
  const rows: RepoSummary[] = [];
  const totalPages = 0;
  const totalItems = 0;
  const isLoading = false;
  const stats: DashboardStats = {
    totalRepos: null,
    pendingDeletion: null,
    accessRevoked: null,
    archived: null,
  };

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
        onRevokeAccess={() => {/* bulk revoke placeholder */}}
        onArchive={() => {/* bulk archive placeholder */}}
        onDelete={() => {/* bulk delete placeholder */}}
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
        onConfirm={() => {
          /* repoService.deleteRepo(deleteTarget.id) */
          setDeleteTarget(null);
        }}
      />
      <RevokeAccessModal
        open={!!revokeTarget}
        onOpenChange={(v) => !v && setRevokeTarget(null)}
        repoName={revokeTarget?.name ?? ''}
        isAll={true}
        onConfirm={() => {
          /* repoService.revokeAllAccess(revokeTarget.id) */
          setRevokeTarget(null);
        }}
      />
      <ArchiveRepoModal
        open={!!archiveTarget}
        onOpenChange={(v) => !v && setArchiveTarget(null)}
        repoName={archiveTarget?.name ?? ''}
        onConfirm={() => {
          /* repoService.archiveRepo(archiveTarget.id) */
          setArchiveTarget(null);
        }}
      />
    </div>
  );
}
