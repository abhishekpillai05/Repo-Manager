import { Filter, X, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { SearchBar } from '@/components/common/SearchBar';
import { Button } from '@/components/ui/Button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/Select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/DropdownMenu';
import type {
  AccessStatusFilter, RepoStatusFilter, SortField, SortOrder,
} from '@/hooks/useDashboardFilters';

const ACCESS_OPTIONS: { label: string; value: AccessStatusFilter }[] = [
  { label: 'All Access', value: '' },
  { label: 'Active', value: 'Active' },
  { label: 'Revoked', value: 'Revoked' },
];

const STATUS_OPTIONS: { label: string; value: RepoStatusFilter }[] = [
  { label: 'All Status', value: '' },
  { label: 'Live', value: 'Live' },
  { label: 'Archived', value: 'Archived' },
  { label: 'Pending Deletion', value: 'Pending Deletion' },
];

const SORT_OPTIONS: { label: string; value: SortField }[] = [
  { label: 'Creation Date', value: 'createdAt' },
  { label: 'Days Until Deletion', value: 'daysUntilDeletion' },
  { label: 'Repo Name', value: 'name' },
  { label: 'Candidate Name', value: 'candidateName' },
];

interface DashboardToolbarProps {
  query: string;
  accessStatus: AccessStatusFilter;
  repoStatus: RepoStatusFilter;
  sortBy: SortField;
  sortOrder: SortOrder;
  onQueryChange: (v: string) => void;
  onAccessStatusChange: (v: AccessStatusFilter) => void;
  onRepoStatusChange: (v: RepoStatusFilter) => void;
  onSortByChange: (v: SortField) => void;
  onToggleSortOrder: () => void;
  onReset: () => void;
}

export function DashboardToolbar({
  query,
  accessStatus,
  repoStatus,
  sortBy,
  sortOrder,
  onQueryChange,
  onAccessStatusChange,
  onRepoStatusChange,
  onSortByChange,
  onToggleSortOrder,
  onReset,
}: DashboardToolbarProps) {
  const hasActiveFilters = !!query || !!accessStatus || !!repoStatus;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <SearchBar
        value={query}
        onChange={onQueryChange}
        placeholder="Search repos, candidates…"
        className="w-full sm:w-72"
      />

      {/* Access filter */}
      <Select value={accessStatus} onValueChange={(v) => onAccessStatusChange(v as AccessStatusFilter)}>
        <SelectTrigger className="h-9 w-36" id="filter-access">
          <SelectValue placeholder="All Access" />
        </SelectTrigger>
        <SelectContent>
          {ACCESS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value || '__all__'}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status filter */}
      <Select value={repoStatus} onValueChange={(v) => onRepoStatusChange(v as RepoStatusFilter)}>
        <SelectTrigger className="h-9 w-40" id="filter-status">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value || '__all__'}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sort */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5 h-9" id="sort-dropdown">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Sort
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSortByChange(opt.value)}
              className={`w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent transition-colors ${
                sortBy === opt.value ? 'font-medium text-primary' : 'text-foreground'
              }`}
            >
              {opt.label}
            </button>
          ))}
          <DropdownMenuSeparator />
          <button
            onClick={onToggleSortOrder}
            className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent transition-colors text-foreground"
          >
            {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
          </button>
        </DropdownMenuContent>
      </DropdownMenu>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="gap-1.5 h-9 text-muted-foreground hover:text-foreground"
          id="reset-filters"
        >
          <X className="h-3.5 w-3.5" />
          Reset
        </Button>
      )}

      {hasActiveFilters && (
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Filter className="h-3 w-3" />
          Filters active
        </span>
      )}
    </div>
  );
}
