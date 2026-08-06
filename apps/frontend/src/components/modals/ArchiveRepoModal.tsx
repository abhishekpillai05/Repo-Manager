import { Archive } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';

interface ArchiveRepoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  repoName: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function ArchiveRepoModal({
  open,
  onOpenChange,
  repoName,
  onConfirm,
  isLoading = false,
}: ArchiveRepoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted flex-shrink-0">
              <Archive className="h-5 w-5 text-muted-foreground" />
            </div>
            <DialogTitle className="text-base">Archive repository</DialogTitle>
          </div>
          <DialogDescription className="leading-relaxed">
            Archiving{' '}
            <strong className="text-foreground font-mono">{repoName}</strong> will make it
            read-only on GitHub. The code and history will be preserved, but all write access will
            be removed.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-md border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground space-y-1.5">
          <p>✓ Code history is preserved</p>
          <p>✓ Repository remains visible on GitHub</p>
          <p>✗ Write access is removed for all collaborators</p>
          <p>✗ No new branches, issues, or PRs can be created</p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="secondary"
            onClick={onConfirm}
            disabled={isLoading}
            id="confirm-archive-btn"
          >
            {isLoading ? 'Archiving…' : 'Archive repository'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
