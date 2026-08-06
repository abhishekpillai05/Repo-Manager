import { Archive, Trash2, ShieldOff, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface BulkActionToolbarProps {
  selectedCount: number;
  onRevokeAccess: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onClearSelection: () => void;
  className?: string;
}

export function BulkActionToolbar({
  selectedCount,
  onRevokeAccess,
  onArchive,
  onDelete,
  onClearSelection,
  className,
}: BulkActionToolbarProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-2.5 rounded-lg border border-primary/20 bg-primary/5',
        className,
      )}
    >
      <span className="text-sm font-medium text-foreground">
        {selectedCount} {selectedCount === 1 ? 'repo' : 'repos'} selected
      </span>

      <div className="flex items-center gap-2 ml-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={onRevokeAccess}
          className="gap-1.5 h-8"
          id="bulk-revoke"
        >
          <ShieldOff className="h-3.5 w-3.5" />
          Revoke Access
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onArchive}
          className="gap-1.5 h-8"
          id="bulk-archive"
        >
          <Archive className="h-3.5 w-3.5" />
          Archive
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          className="gap-1.5 h-8"
          id="bulk-delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClearSelection}
          aria-label="Clear selection"
          className="text-muted-foreground h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
