declare module 'react' {
  export type ReactNode = unknown;
  export type CSSProperties = Record<string, string | number>;

  export interface ButtonHTMLAttributes<T> {
    [key: string]: unknown;
  }

  export interface HTMLAttributes<T> {
    [key: string]: unknown;
  }

  export const StrictMode: unknown;

  const React: {
    StrictMode: typeof StrictMode;
  };

  export default React;
}

declare module 'react/jsx-runtime' {
  export const Fragment: unknown;
  export const jsx: unknown;
  export const jsxs: unknown;
}

declare module 'react-dom/client' {
  export function createRoot(container: HTMLElement): {
    render(node: unknown): void;
  };
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elementName: string]: unknown;
    }
  }
}