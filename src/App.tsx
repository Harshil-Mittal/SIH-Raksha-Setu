import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import SplashScreen from "./components/SplashScreen";
import WindowFrame from "./components/WindowFrame";
import useUIStore from "./state/uiStore";
import Index from "./pages/Index";
import TouristPage from "./pages/TouristPage";
import DashboardPage from "./pages/DashboardPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(false);
  const { openWindows } = useUIStore();

  useEffect(() => {
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
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/tourist" element={<TouristPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          
          {/* Render open windows */}
          {openWindows.map(window => (
            <WindowFrame key={window.id} window={window} />
          ))}
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
