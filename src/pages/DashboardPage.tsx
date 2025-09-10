import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import TopBar from '@/components/layout/TopBar';
import Dashboard from '@/components/dashboard/Dashboard';

const DashboardPage: React.FC = () => {
  const { auth } = useAuth();

  // Redirect if not authenticated
  if (!auth.isAuthenticated || !auth.user) {
    return <Navigate to="/" replace />;
  }

  // Only allow police, tourism, and admin roles
  if (!['police', 'tourism', 'admin'].includes(auth.user.role)) {
    return <Navigate to="/tourist" replace />;
  }

  return (
    <>
      <TopBar />
      <Dashboard />
    </>
  );
};

export default DashboardPage;