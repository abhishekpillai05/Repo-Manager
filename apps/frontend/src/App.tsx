import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
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
            <AppLayout>
              <Dashboard />
            </AppLayout>
          }
        />
        <Route
          path="/repositories"
          element={
            <AppLayout>
              <Repositories />
            </AppLayout>
          }
        />
        <Route
          path="/repositories/:id"
          element={
            <AppLayout>
              <RepositoryDetails />
            </AppLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <AppLayout>
              <Settings />
            </AppLayout>
          }
        />
        <Route
          path="/audit-log"
          element={
            <AppLayout>
              <AuditLog />
            </AppLayout>
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
