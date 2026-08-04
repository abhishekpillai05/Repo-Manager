import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';

interface ConfirmDeleteModalProps {
  open: boolean;
  repoName: string;
}

export function ConfirmDeleteModal({ open, repoName }: ConfirmDeleteModalProps) {
  return (
    <Dialog open={open} title="Delete repository">
      <p className="muted">Type {repoName} to confirm permanent deletion.</p>
      <div className="stack" style={{ marginTop: '1rem' }}>
        <input style={{ padding: '0.875rem 1rem', borderRadius: 14, border: '1px solid #cbd5e1' }} placeholder={repoName} />
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <Button variant="secondary">Cancel</Button>
          <Button variant="danger">Delete</Button>
        </div>
      </div>
    </Dialog>
  );
}
