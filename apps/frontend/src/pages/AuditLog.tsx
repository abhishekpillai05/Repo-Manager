import { useState } from 'react';
import { Download, Filter, X, Calendar } from 'lucide-react';
import type { AuditLog } from '@pt-repo-manager/shared-types';
import { PageHeader } from '@/components/common/PageHeader';
import { SearchBar } from '@/components/common/SearchBar';
import { EmptyState } from '@/components/common/EmptyState';
import { Pagination } from '@/components/common/Pagination';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/Select';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Card, CardContent } from '@/components/ui/Card';
import { AUDIT_ACTION_LABELS } from '@/lib/constants';
import { formatDateTime } from '@/lib/utils';

const ACTION_OPTIONS = [
  { label: 'All actions', value: '' },
  { label: 'Config Updated', value: 'CONFIG_UPDATED' },
  { label: 'Override Created', value: 'OVERRIDE_CREATED' },
  { label: 'Override Updated', value: 'OVERRIDE_UPDATED' },
  { label: 'Override Deleted', value: 'OVERRIDE_DELETED' },
  { label: 'Repository Deleted', value: 'REPOSITORY_DELETED' },
  { label: 'Repository Archived', value: 'REPOSITORY_ARCHIVED' },
  { label: 'Collaborator Revoked', value: 'COLLABORATOR_REVOKED' },
];

function actionBadgeVariant(action: string) {
  if (action.includes('DELETED')) return 'destructive' as const;
  if (action.includes('REVOKED')) return 'warning' as const;
  if (action.includes('ARCHIVED')) return 'muted' as const;
  return 'secondary' as const;
}

const SKELETON_ROWS = 8;

export function AuditLog() {
  // ─── Filter state ──────────────────────────────────────────
  const [query, setQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);

  // ─── Data state (ready for API) ────────────────────────────
  const rows: AuditLog[] = [];
  const totalPages = 0;
  const totalItems = 0;
  const isLoading = false;

  const hasActiveFilters = !!query || !!actionFilter || !!dateFrom || !!dateTo;

  const resetFilters = () => {
    setQuery('');
    setActionFilter('');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Log"
        description="Tamper-evident, append-only history of all actions performed in the system."
        actions={
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            id="export-csv-btn"
            onClick={() => {
              /* auditService.exportCsv({ dateFrom, dateTo, action: actionFilter }) */
            }}
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>
        }
      />

      {/* ─── Filters ─────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-5 pb-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[220px]">
              <Label className="text-xs mb-1.5 block text-muted-foreground">Search</Label>
              <SearchBar
                value={query}
                onChange={(v) => { setQuery(v); setPage(1); }}
                placeholder="Search actor, repository…"
              />
            </div>

            <div className="min-w-[180px]">
              <Label className="text-xs mb-1.5 block text-muted-foreground">Action type</Label>
              <Select value={actionFilter} onValueChange={(v) => { setActionFilter(v === '__all__' ? '' : v); setPage(1); }}>
                <SelectTrigger className="h-9" id="audit-action-filter">
                  <SelectValue placeholder="All actions" />
                </SelectTrigger>
                <SelectContent>
                  {ACTION_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value || '__all__'} value={opt.value || '__all__'}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs mb-1.5 block text-muted-foreground">From</Label>
              <Input
                id="date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
                className="h-9 w-36"
              />
            </div>

            <div>
              <Label className="text-xs mb-1.5 block text-muted-foreground">To</Label>
              <Input
                id="date-to"
                type="date"
                value={dateTo}
                onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
                className="h-9 w-36"
              />
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="gap-1.5 text-muted-foreground h-9"
                id="reset-audit-filters"
              >
                <X className="h-3.5 w-3.5" />
                Reset
              </Button>
            )}
          </div>

          {hasActiveFilters && (
            <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
              <Filter className="h-3 w-3" />
              Filters active
            </div>
          )}
        </CardContent>
      </Card>

      {/* ─── Audit table ─────────────────────────────────────── */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Timestamp</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Repository</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: SKELETON_ROWS }).map((_, idx) => (
                  <TableRow key={idx} className="hover:bg-transparent">
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-36 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  </TableRow>
                ))
              : rows.length === 0
                ? (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={5} className="p-0">
                        <EmptyState
                          icon={Calendar}
                          title="No audit entries found"
                          description={
                            hasActiveFilters
                              ? 'No entries match the current filters. Try adjusting your search or date range.'
                              : 'Audit entries will appear here as actions are performed in the system.'
                          }
                        />
                      </TableCell>
                    </TableRow>
                  )
                : rows.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap font-mono">
                        {formatDateTime(log.createdAt)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {log.userId ? (
                          <span className="font-medium">@{log.userId}</span>
                        ) : (
                          <span className="text-muted-foreground italic">System</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={actionBadgeVariant(log.action)}>
                          {AUDIT_ACTION_LABELS[log.action] ?? log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {log.repositoryName ? (
                          <span className="font-mono text-xs">{log.repositoryName}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                        {log.details ? JSON.stringify(log.details) : '—'}
                      </TableCell>
                    </TableRow>
                  ))}
          </TableBody>
        </Table>
      </div>

      {/* ─── Pagination ──────────────────────────────────────── */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={20}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
