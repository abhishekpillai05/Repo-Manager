import { useState, useEffect, useCallback } from 'react';
import { Download, X, Calendar, Shield, Archive, Trash2, Settings, RefreshCw } from 'lucide-react';
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
import { auditService } from '@/services/audit.service';

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
  if (action.includes('CONFIG') || action.includes('OVERRIDE')) return 'secondary' as const;
  return 'secondary' as const;
}

function actionIcon(action: string) {
  if (action.includes('DELETED')) return <Trash2 className="h-3 w-3" />;
  if (action.includes('REVOKED')) return <Shield className="h-3 w-3" />;
  if (action.includes('ARCHIVED')) return <Archive className="h-3 w-3" />;
  if (action.includes('CONFIG') || action.includes('OVERRIDE')) return <Settings className="h-3 w-3" />;
  return null;
}

/** Render details object as readable key:value pairs */
function renderDetails(details: Record<string, unknown> | null | undefined): string {
  if (!details) return '—';
  // Filter out redundant repositoryName (already shown in repo column)
  const entries = Object.entries(details).filter(([k]) => k !== 'repositoryName');
  if (entries.length === 0) return '—';
  return entries
    .map(([k, v]) => {
      const label = k
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (s) => s.toUpperCase())
        .trim();
      return `${label}: ${v ?? '—'}`;
    })
    .join(' · ');
}

const SKELETON_ROWS = 8;

export function AuditLog() {
  // ─── Filter state ──────────────────────────────────────────
  const [query, setQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);

  // ─── Data state ────────────────────────────────────────────
  const [rows, setRows] = useState<AuditLog[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await auditService.getLogs({
        page,
        limit: 20,
        userId: query || undefined,
        action: actionFilter || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });
      setRows(res.data);
      setTotalPages(res.totalPages);
      setTotalItems(res.total);
    } catch (err: any) {
      console.error('Failed to fetch audit logs', err);
      setError('Failed to load audit logs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [page, query, actionFilter, dateFrom, dateTo]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const hasActiveFilters = !!query || !!actionFilter || !!dateFrom || !!dateTo;

  const resetFilters = () => {
    setQuery('');
    setActionFilter('');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  const handleExportCsv = async () => {
    try {
      const blob = await auditService.exportCsv({
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        action: actionFilter || undefined,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export CSV', err);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Log"
        description="Tamper-evident, append-only history of all actions performed in the system."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              id="refresh-audit-btn"
              onClick={fetchData}
              disabled={isLoading}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              id="export-csv-btn"
              onClick={handleExportCsv}
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </Button>
          </div>
        }
      />

      {/* ─── Error banner ─────────────────────────────────────── */}
      {error && (
        <div style={{ padding: '1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '0.875rem', color: '#ef4444', margin: 0 }}>{error}</p>
          <button onClick={fetchData} style={{ fontSize: '0.75rem', color: '#ef4444', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>Retry</button>
        </div>
      )}

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
                Reset filters
              </Button>
            )}
          </div>

          {/* Summary line */}
          {!isLoading && totalItems > 0 && (
            <p className="text-xs text-muted-foreground mt-3">
              {totalItems} {totalItems === 1 ? 'entry' : 'entries'}
              {hasActiveFilters && ' matching current filters'}
            </p>
          )}
        </CardContent>
      </Card>

      {/* ─── Audit table ─────────────────────────────────────── */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-44">Timestamp</TableHead>
              <TableHead className="w-36">Actor</TableHead>
              <TableHead className="w-44">Action</TableHead>
              <TableHead className="w-52">Repository</TableHead>
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
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
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
                      {/* Timestamp */}
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap font-mono">
                        {formatDateTime(log.createdAt)}
                      </TableCell>

                      {/* Actor */}
                      <TableCell className="text-sm">
                        {log.userId ? (
                          <span className="font-medium">@{log.userId}</span>
                        ) : (
                          <span className="text-muted-foreground italic">System</span>
                        )}
                      </TableCell>

                      {/* Action badge */}
                      <TableCell>
                        <Badge variant={actionBadgeVariant(log.action)} className="gap-1.5">
                          {actionIcon(log.action)}
                          {AUDIT_ACTION_LABELS[log.action] ?? log.action}
                        </Badge>
                      </TableCell>

                      {/* Repository */}
                      <TableCell>
                        {log.repositoryName ? (
                          <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                            {log.repositoryName}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>

                      {/* Details — human readable */}
                      <TableCell className="text-xs text-muted-foreground max-w-sm">
                        <span className="line-clamp-2">{renderDetails(log.details as any)}</span>
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
