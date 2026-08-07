import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '@/services/auth.service';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Wraps protected routes. Checks JWT cookie via GET /api/auth/me.
 * - Authenticated  → renders children
 * - Unauthenticated → redirects to /
 * - Pending check  → shows a subtle full-screen spinner
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [status, setStatus] = useState<'loading' | 'authed' | 'unauthed'>('loading');

  useEffect(() => {
    authService
      .isAuthenticated()
      .then((ok) => setStatus(ok ? 'authed' : 'unauthed'));
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (status === 'unauthed') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
