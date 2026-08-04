import type { CSSProperties, ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
}

const badgeStyles: Record<NonNullable<BadgeProps['tone']>, CSSProperties> = {
  neutral: { background: '#e2e8f0', color: '#0f172a' },
  success: { background: '#dcfce7', color: '#166534' },
  warning: { background: '#fef3c7', color: '#92400e' },
  danger: { background: '#fee2e2', color: '#991b1b' },
};

export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 999,
        padding: '0.35rem 0.75rem',
        fontSize: '0.875rem',
        fontWeight: 600,
        ...badgeStyles[tone],
      }}
    >
      {children}
    </span>
  );
}
