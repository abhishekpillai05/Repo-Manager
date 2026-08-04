import type { ReactNode } from 'react';

interface DialogProps {
  open: boolean;
  title: string;
  children: ReactNode;
}

export function Dialog({ open, title, children }: DialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.45)', display: 'grid', placeItems: 'center', padding: '1rem' }}>
      <div className="surface card" style={{ width: 'min(560px, 100%)' }}>
        <h2 className="section-title" style={{ marginBottom: '0.75rem' }}>{title}</h2>
        {children}
      </div>
    </div>
  );
}
