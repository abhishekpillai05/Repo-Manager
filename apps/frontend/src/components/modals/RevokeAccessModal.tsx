import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';

interface RevokeAccessModalProps {
  open: boolean;
  target: string;
}

export function RevokeAccessModal({ open, target }: RevokeAccessModalProps) {
  return (
    <Dialog open={open} title="Revoke access">
      <p className="muted">This will remove access for {target} without deleting the repository.</p>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <Button variant="secondary">Cancel</Button>
        <Button variant="danger">Revoke</Button>
      </div>
    </Dialog>
  );
}
