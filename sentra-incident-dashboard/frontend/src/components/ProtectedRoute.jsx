import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  // ──────────────────────────────────────────────
  //  Most important fix → respect loading state
  // ──────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Checking authentication...
      </div>
    );
  }

  // After loading is finished → decide
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role check (only after we know user exists)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />; // or to some "access denied" page
  }

  // All good → show content
  return children || <Outlet />;
};

export default ProtectedRoute;