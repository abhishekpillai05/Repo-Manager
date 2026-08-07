import { useState, useEffect, useCallback } from 'react';
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
import { repoService } from '@/services/repo.service';

export function Repositories() {
  const {
    filters,
    setQuery, setAccessStatus, setRepoStatus,
    setSortBy, toggleSortOrder, setPage, resetFilters,
  } = useDashboardFilters();

  // ─── Data state ─────────────────────────────────────────────
  const [rows, setRows] = useState<RepoSummary[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await repoService.listRepos(filters as any);
      setRows(res.data);
      setTotalPages(res.totalPages);
      setTotalItems(res.total);
    } catch (err: any) {
      console.error('Failed to fetch repos', err);
      setError(`Failed to load repositories: ${err?.message ?? 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

      {/* ─── Error banner ────────────────────────────────────── */}
      {error && (
        <div style={{ padding: '1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#ef4444', margin: 0 }}>{error}</p>
          <button onClick={fetchData} style={{ fontSize: '0.75rem', color: '#ef4444', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
            Retry
          </button>
        </div>
      )}

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
        isAll
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
