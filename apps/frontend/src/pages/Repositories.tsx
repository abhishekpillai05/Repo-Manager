import { useState } from 'react';
import { GitFork, Trash2, ShieldOff } from 'lucide-react';
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

export function Repositories() {
  const {
    filters,
    setQuery, setAccessStatus, setRepoStatus,
    setSortBy, toggleSortOrder, setPage, resetFilters,
  } = useDashboardFilters();

  // ─── Data placeholders (API-ready) ─────────────────────────
  const rows: RepoSummary[] = [];
  const totalPages = 0;
  const totalItems = 0;
  const isLoading = false;

  // ─── Selection state ───────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleSelectAll = () =>
    setSelectedIds(
      rows.every((r) => selectedIds.has(r.id))
        ? new Set()
        : new Set(rows.map((r) => r.id)),
    );

  // ─── Modal state ───────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<RepoSummary | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<RepoSummary | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<RepoSummary | null>(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Repositories"
        description="All pt- prefixed repositories in the connected GitHub organization."
      />

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

      <BulkActionToolbar
        selectedCount={selectedIds.size}
        onRevokeAccess={() => {}}
        onArchive={() => {}}
        onDelete={() => {}}
        onClearSelection={() => setSelectedIds(new Set())}
      />

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

      {totalPages > 1 && (
        <Pagination
          currentPage={filters.page}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={filters.limit}
          onPageChange={setPage}
        />
      )}

      <ConfirmDeleteModal
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        repoName={deleteTarget?.name ?? ''}
        onConfirm={() => setDeleteTarget(null)}
      />
      <RevokeAccessModal
        open={!!revokeTarget}
        onOpenChange={(v) => !v && setRevokeTarget(null)}
        repoName={revokeTarget?.name ?? ''}
        isAll
        onConfirm={() => setRevokeTarget(null)}
      />
      <ArchiveRepoModal
        open={!!archiveTarget}
        onOpenChange={(v) => !v && setArchiveTarget(null)}
        repoName={archiveTarget?.name ?? ''}
        onConfirm={() => setArchiveTarget(null)}
      />
    </div>
  );
}
