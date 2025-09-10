import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [showLogo, setShowLogo] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Start animation immediately
    setShowLogo(true);

    // Complete animation after 1.5s
    const timer = setTimeout(() => {
      setAnimationComplete(true);
      setTimeout(onComplete, 300);
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-300 ${
      animationComplete ? 'opacity-0' : 'opacity-100'
    }`}>
      <div className="text-center">
        {/* Brand Logo Animation */}
        <div className="relative mb-8">
          <div className="overflow-hidden">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
              <span
                className={`inline-block text-raksha-blue transition-transform duration-600 ease-bounce ${
                  showLogo ? 'animate-slide-left' : ''
                }`}
              >
                Raksha
              </span>
              <span
                className={`inline-block text-setu-orange transition-transform duration-600 ease-bounce ${
                  showLogo ? 'animate-slide-right' : ''
                }`}
              >
                Setu
              </span>
            </h1>
          </div>
          
          {/* Tagline */}
          <p
            className={`mt-4 text-lg text-muted-foreground transition-all duration-400 ${
              showLogo ? 'animate-scale-pop' : 'opacity-0'
            }`}
          >
            Your digital companion for a safe journey
          </p>
        </div>

        {/* Loading Indicator */}
        <div
          className={`w-16 h-1 bg-gradient-brand rounded-full transition-all duration-400 mx-auto ${
            showLogo ? 'animate-scale-pop' : 'opacity-0'
          }`}
        >
          <div className="w-full h-full bg-gradient-brand rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;