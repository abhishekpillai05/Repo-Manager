import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
  style?: CSSProperties;
}

const variantStyles: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: '#1d4ed8',
    color: 'white',
    borderColor: '#1d4ed8',
  },
  secondary: {
    background: 'white',
    color: '#0f172a',
    borderColor: '#cbd5e1',
  },
  danger: {
    background: '#fee2e2',
    color: '#991b1b',
    borderColor: '#fca5a5',
  },
};

export function Button({ variant = 'primary', children, style, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      style={{
        border: '1px solid',
        borderRadius: 999,
        padding: '0.75rem 1rem',
        fontWeight: 600,
        cursor: 'pointer',
        ...variantStyles[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
}
