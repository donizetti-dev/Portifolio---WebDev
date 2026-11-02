import React, { Suspense, lazy, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProjectDetailPage } from '../pages/ProjectDetailPage';
import { ProtectedRoute } from './ProtectedRoute';

const LoginPage = lazy(() => import('../pages/LoginPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));

const RouteSuspenseFallback: React.FC = () => (
  <div
    className="container"
    style={{
      padding: '5rem 0',
      textAlign: 'center',
      fontFamily: 'var(--font-mono)',
      color: 'var(--text-secondary)',
    }}
    role="status"
    aria-live="polite"
  >
    Carregando módulo administrativo...
  </div>
);

const ScrollToTopOnNavigate: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return null;
};

export const AppRoutes: React.FC = () => {
  return (
    <>
      <ScrollToTopOnNavigate />
      <Suspense fallback={<RouteSuspenseFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/portifolio/:slug" element={<ProjectDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default AppRoutes;
