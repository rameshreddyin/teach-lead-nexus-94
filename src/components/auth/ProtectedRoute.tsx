
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/authContext';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  allowedRoles = []
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If there are allowed roles and the user doesn't have one of them
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    // Redirect to a forbidden page or home page
    return <Navigate to="/" replace />;
  }

  // User is authenticated and authorized, render the outlet (child routes)
  return <Outlet />;
};

export default ProtectedRoute;
