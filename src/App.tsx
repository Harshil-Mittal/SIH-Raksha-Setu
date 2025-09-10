import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import SplashScreen from "./components/SplashScreen";
import WindowFrame from "./components/WindowFrame";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import useUIStore from "./state/uiStore";
import Index from "./pages/Index";
import TouristPage from "./pages/TouristPage";
import DashboardPage from "./pages/DashboardPage";
import LanguageDemoPage from "./pages/LanguageDemoPage";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(false);
  const { openWindows } = useUIStore();

  useEffect(() => {
    // Clear any invalid authentication data on app start
    const token = localStorage.getItem('raksha_token');
    if (token && !token.startsWith('eyJ') && !token.startsWith('mock_jwt_token_')) {
      localStorage.removeItem('raksha_token');
      localStorage.removeItem('raksha_user');
    }
    
    const splashShown = localStorage.getItem('raksha_splash_shown');
    if (!splashShown) {
      setShowSplash(true);
    }
  }, []);

  const handleSplashComplete = () => {
    localStorage.setItem('raksha_splash_shown', '1');
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <LanguageProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={
                    <ProtectedRoute requireAuth={false}>
                      <Index />
                    </ProtectedRoute>
                  } />
                  <Route path="/tourist" element={
                    <ProtectedRoute allowedRoles={['tourist']}>
                      <TouristPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard" element={
                    <ProtectedRoute allowedRoles={['police', 'tourism', 'admin']}>
                      <DashboardPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/language-demo" element={
                    <ProtectedRoute>
                      <LanguageDemoPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
              
              {/* Render open windows */}
              {openWindows.map(window => (
                <WindowFrame key={window.id} window={window} />
              ))}
            </LanguageProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
