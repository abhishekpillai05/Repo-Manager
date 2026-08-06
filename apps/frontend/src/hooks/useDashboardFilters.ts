import { useMemo, useState } from 'react';

export type AccessStatusFilter = '' | 'Active' | 'Revoked';
export type RepoStatusFilter = '' | 'Live' | 'Archived' | 'Pending Deletion';
export type SortField = 'name' | 'createdAt' | 'daysUntilDeletion' | 'candidateName';
export type SortOrder = 'asc' | 'desc';

export interface DashboardFilters {
  query: string;
  accessStatus: AccessStatusFilter;
  repoStatus: RepoStatusFilter;
  sortBy: SortField;
  sortOrder: SortOrder;
  page: number;
  limit: number;
}

export function useDashboardFilters() {
  const [filters, setFilters] = useState<DashboardFilters>({
    query: '',
    accessStatus: '',
    repoStatus: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 20,
  });

  return useMemo(
    () => ({
      filters,
      setQuery: (query: string) => setFilters((f) => ({ ...f, query, page: 1 })),
      setAccessStatus: (accessStatus: AccessStatusFilter) =>
        setFilters((f) => ({ ...f, accessStatus, page: 1 })),
      setRepoStatus: (repoStatus: RepoStatusFilter) =>
        setFilters((f) => ({ ...f, repoStatus, page: 1 })),
      setSortBy: (sortBy: SortField) =>
        setFilters((f) => ({ ...f, sortBy })),
      toggleSortOrder: () =>
        setFilters((f) => ({ ...f, sortOrder: f.sortOrder === 'asc' ? 'desc' : 'asc' })),
      setPage: (page: number) => setFilters((f) => ({ ...f, page })),
      setLimit: (limit: number) => setFilters((f) => ({ ...f, limit, page: 1 })),
      resetFilters: () =>
        setFilters({
          query: '',
          accessStatus: '',
          repoStatus: '',
          sortBy: 'createdAt',
          sortOrder: 'desc',
          page: 1,
          limit: 20,
        }),
    }),
    [filters],
  );
}
