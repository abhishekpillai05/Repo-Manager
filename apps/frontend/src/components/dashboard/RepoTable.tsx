import { ArrowUpDown, ArrowUp, ArrowDown, ExternalLink, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { RepoSummary } from '@pt-repo-manager/shared-types';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { Checkbox } from '@/components/ui/Checkbox';
import { RepoStatusBadge, AccessStatusBadge } from '@/components/common/StatusBadge';
import { CountdownBadge } from '@/components/common/CountdownBadge';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDate } from '@/lib/utils';
import type { SortField, SortOrder } from '@/hooks/useDashboardFilters';

interface RepoTableProps {
  rows: RepoSummary[];
  isLoading?: boolean;
  selectedIds?: Set<string>;
  sortBy?: SortField;
  sortOrder?: SortOrder;
  onSort?: (field: SortField) => void;
  onToggleSelect?: (id: string) => void;
  onToggleSelectAll?: () => void;
  onArchive?: (repo: RepoSummary) => void;
  onDelete?: (repo: RepoSummary) => void;
  onRevokeAccess?: (repo: RepoSummary) => void;
}

function SortIcon({ field, sortBy, sortOrder }: { field: SortField; sortBy?: SortField; sortOrder?: SortOrder }) {
  if (field !== sortBy) return <ArrowUpDown className="h-3.5 w-3.5 ml-1 opacity-40" />;
  return sortOrder === 'asc'
    ? <ArrowUp className="h-3.5 w-3.5 ml-1 text-primary" />
    : <ArrowDown className="h-3.5 w-3.5 ml-1 text-primary" />;
}

const SKELETON_ROWS = 6;

export function RepoTable({
  rows,
  isLoading = false,
  selectedIds = new Set(),
  sortBy,
  sortOrder,
  onSort,
  onToggleSelect,
  onToggleSelectAll,
  onArchive,
  onDelete,
  onRevokeAccess,
}: RepoTableProps) {
  const allSelected = rows.length > 0 && rows.every((r) => selectedIds.has(r.id));
  const someSelected = rows.some((r) => selectedIds.has(r.id));

  if (!isLoading && rows.length === 0) {
    return (
      <EmptyState
        title="No repositories found"
        description="No pt- repositories match your current filters. Try adjusting your search or filter criteria."
        action={undefined}
      />
    );
  }

  const SortableHead = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead
      className="cursor-pointer select-none hover:text-foreground whitespace-nowrap"
      onClick={() => onSort?.(field)}
    >
      <span className="inline-flex items-center">
        {children}
        <SortIcon field={field} sortBy={sortBy} sortOrder={sortOrder} />
      </span>
    </TableHead>
  );

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-10">
              <Checkbox
                checked={allSelected}
                ref={undefined}
                onCheckedChange={onToggleSelectAll}
                aria-label="Select all"
                className={someSelected && !allSelected ? 'opacity-50' : ''}
              />
            </TableHead>
            <SortableHead field="name">Repository</SortableHead>
            <SortableHead field="candidateName">Candidate</SortableHead>
            <TableHead>Role</TableHead>
            <SortableHead field="createdAt">Created</SortableHead>
            <TableHead>Access</TableHead>
            <TableHead>Status</TableHead>
            <SortableHead field="daysUntilDeletion">Countdown</SortableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: SKELETON_ROWS }).map((_, idx) => (
                <TableRow key={idx} className="hover:bg-transparent">
                  <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24 rounded-full" /></TableCell>
                  <TableCell />
                </TableRow>
              ))
            : rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={selectedIds.has(row.id) ? 'selected' : undefined}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(row.id)}
                      onCheckedChange={() => onToggleSelect?.(row.id)}
                      aria-label={`Select ${row.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/repositories/${row.id}`}
                        className="font-mono text-xs font-medium text-foreground hover:text-primary transition-colors"
                      >
                        {row.name}
                      </Link>
                      <a
                        href={`https://github.com/${row.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={`Open ${row.name} on GitHub`}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{row.candidateName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{row.role}</TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(row.createdAt)}
                  </TableCell>
                  <TableCell>
                    <AccessStatusBadge status={row.accessStatus} />
                  </TableCell>
                  <TableCell>
                    <RepoStatusBadge status={row.repoStatus} />
                  </TableCell>
                  <TableCell>
                    <CountdownBadge daysLeft={row.daysUntilDeletion} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Actions for ${row.name}`}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/repositories/${row.id}`}>View details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onRevokeAccess?.(row)}
                          disabled={row.accessStatus === 'Revoked'}
                        >
                          Revoke access
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onArchive?.(row)}
                          disabled={row.repoStatus === 'Archived'}
                        >
                          Archive repo
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete?.(row)}
                          className="text-destructive focus:text-destructive"
                        >
                          Delete repo
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
