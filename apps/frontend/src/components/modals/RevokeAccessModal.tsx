import { ShieldOff } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';

interface RevokeAccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  repoName: string;
  collaboratorName?: string;
  isAll?: boolean;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function RevokeAccessModal({
  open,
  onOpenChange,
  repoName,
  collaboratorName,
  isAll = false,
  onConfirm,
  isLoading = false,
}: RevokeAccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-warning/10 flex-shrink-0">
              <ShieldOff className="h-5 w-5 text-warning" />
            </div>
            <DialogTitle className="text-base">
              {isAll ? 'Revoke all access' : 'Revoke collaborator access'}
            </DialogTitle>
          </div>
          <DialogDescription className="leading-relaxed">
            {isAll ? (
              <>
                All external collaborators will lose access to{' '}
                <strong className="text-foreground font-mono">{repoName}</strong>. The repository
                itself will not be affected.
              </>
            ) : (
              <>
                <strong className="text-foreground">{collaboratorName ?? 'This collaborator'}</strong>{' '}
                will lose access to{' '}
                <strong className="text-foreground font-mono">{repoName}</strong>.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-md border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
          This action takes effect immediately via the GitHub API. The deletion countdown will
          continue independently.
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={onConfirm}
            disabled={isLoading}
            id="confirm-revoke-btn"
          >
            {isLoading ? 'Revoking…' : 'Revoke access'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
