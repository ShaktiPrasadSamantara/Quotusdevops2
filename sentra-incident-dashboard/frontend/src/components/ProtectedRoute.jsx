import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// In ProtectedRoute.jsx
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  console.log("[ProtectedRoute]", {
    loading,
    isAuthenticated: !!user,
    userRole: user?.role,
    requiredRoles: allowedRoles,
    currentPath: window.location.pathname
  });

  if (loading) return <div>Checking authentication...</div>;

  if (!user) {
    console.log("→ No user → redirect to login");
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log(`→ Role mismatch: has ${user.role}, needs one of ${allowedRoles}`);
    return <Navigate to="/login" replace />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;