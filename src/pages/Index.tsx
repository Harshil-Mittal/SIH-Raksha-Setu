import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import SplashScreen from '@/components/SplashScreen';
import AuthPage from '@/components/auth/AuthPage';
import TouristHome from '@/components/tourist/TouristHome';
import Dashboard from '@/components/dashboard/Dashboard';
import TopBar from '@/components/layout/TopBar';

const Index = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Redirect based on role after authentication
    if (auth.isAuthenticated && auth.user && !showSplash) {
      switch (auth.user.role) {
        case 'tourist':
          navigate('/tourist', { replace: true });
          break;
        case 'police':
        case 'tourism':
        case 'admin':
          navigate('/dashboard', { replace: true });
          break;
      }
    }
  }, [auth.isAuthenticated, auth.user, navigate, showSplash]);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (!auth.isAuthenticated) {
    return <AuthPage />;
  }

  // Render role-specific content
  const renderContent = () => {
    switch (auth.user?.role) {
      case 'tourist':
        return <TouristHome />;
      case 'police':
      case 'tourism':
      case 'admin':
        return <Dashboard />;
      default:
        return <AuthPage />;
    }
  };

  return (
    <>
      <TopBar />
      {renderContent()}
    </>
  );
};

export default Index;
