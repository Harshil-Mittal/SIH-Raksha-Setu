import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import TopBar from '@/components/layout/TopBar';
import TouristHome from '@/components/tourist/TouristHome';

const TouristPage: React.FC = () => {
  const { auth } = useAuth();

  // Redirect if not authenticated or not a tourist
  if (!auth.isAuthenticated || !auth.user) {
    return <Navigate to="/" replace />;
  }

  if (auth.user.role !== 'tourist') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <TopBar />
      <TouristHome />
    </>
  );
};

export default TouristPage;