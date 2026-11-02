import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Guardião de rota administrativa (RF06).
 * Redireciona imediatamente usuários não autenticados para `/login` com `replace`.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        className="container"
        style={{ padding: '5rem 0', textAlign: 'center', fontFamily: 'var(--font-mono)' }}
        role="status"
        aria-live="polite"
      >
        Verificando credenciais de acesso administrativo...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
