import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [], 
  requireAuth = true 
}) => {
  const { auth } = useAuth();
  const location = useLocation();

  // If authentication is required but user is not authenticated
  if (requireAuth && !auth.isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If user is authenticated but role is not allowed
  if (requireAuth && auth.user && allowedRoles.length > 0) {
    if (!allowedRoles.includes(auth.user.role as UserRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // If user is authenticated but trying to access auth pages
  if (!requireAuth && auth.isAuthenticated) {
    // Redirect based on role
    switch (auth.user?.role) {
      case 'tourist':
        return <Navigate to="/tourist" replace />;
      case 'police':
      case 'tourism':
      case 'admin':
        return <Navigate to="/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
