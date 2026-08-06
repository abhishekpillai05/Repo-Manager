import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Apply theme before first paint to prevent flash
(function initTheme() {
  try {
    const stored = localStorage.getItem('pt-repo-manager-theme');
    const theme = stored ?? 'system';
    const resolved =
      theme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : theme;
    document.documentElement.classList.toggle('dark', resolved === 'dark');
  } catch {
    // Fail silently in SSR or restricted environments
  }
})();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
