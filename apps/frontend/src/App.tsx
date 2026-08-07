import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { Repositories } from '@/pages/Repositories';
import { RepositoryDetails } from '@/pages/RepositoryDetails';
import { Settings } from '@/pages/Settings';
import { AuditLog } from '@/pages/AuditLog';
import { NotFound } from '@/pages/NotFound';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />

        {/* Protected app shell routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ErrorBoundary>
                  <Dashboard />
                </ErrorBoundary>
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/repositories"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ErrorBoundary>
                  <Repositories />
                </ErrorBoundary>
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/repositories/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ErrorBoundary>
                  <RepositoryDetails />
                </ErrorBoundary>
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ErrorBoundary>
                  <Settings />
                </ErrorBoundary>
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/audit-log"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ErrorBoundary>
                  <AuditLog />
                </ErrorBoundary>
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
