import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

interface ConfirmDeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  repoName: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function ConfirmDeleteModal({
  open,
  onOpenChange,
  repoName,
  onConfirm,
  isLoading = false,
}: ConfirmDeleteModalProps) {
  const [inputValue, setInputValue] = useState('');
  const isMatch = inputValue === repoName;

  const handleConfirm = () => {
    if (!isMatch) return;
    onConfirm();
  };

  const handleOpenChange = (v: boolean) => {
    if (!v) setInputValue('');
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10 flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle className="text-base">Delete repository</DialogTitle>
          </div>
          <DialogDescription className="leading-relaxed">
            This action is <strong>permanent and irreversible</strong>. The repository and all its
            contents will be permanently deleted from GitHub.
          </DialogDescription>
        </DialogHeader>

        <div className="my-1 rounded-md border border-border bg-muted/50 px-4 py-3">
          <p className="font-mono text-sm font-medium text-foreground">{repoName}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-repo-name" className="text-sm text-muted-foreground">
            Type <strong className="text-foreground">{repoName}</strong> to confirm
          </Label>
          <Input
            id="confirm-repo-name"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={repoName}
            className={isMatch ? 'border-success ring-success/30' : ''}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isMatch || isLoading}
            id="confirm-delete-btn"
          >
            {isLoading ? 'Deleting…' : 'Delete repository'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
