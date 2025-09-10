import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Home, 
  Settings, 
  Globe, 
  Moon, 
  Sun, 
  User, 
  LogOut,
  Menu,
  Shield
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SettingsDialog from '@/components/tourist/SettingsDialog';
import HomeDialog from '@/components/tourist/HomeDialog';

const TopBar: React.FC = () => {
  const { auth, logout } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [homeDialogOpen, setHomeDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [isDark, setIsDark] = useState(false);

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'mni', name: 'Manipuri', nativeName: 'মণিপুরী' },
    { code: 'kha', name: 'Khasi', nativeName: 'খাসি' },
    { code: 'nsm', name: 'Nagamese', nativeName: 'নাগামিজ' },
    { code: 'brx', name: 'Bodo', nativeName: 'बड़ो' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  ];

  const handleHome = () => {
    setHomeDialogOpen(true);
  };

  const handleSettings = () => {
    setSettingsOpen(true);
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    localStorage.setItem('raksha_language', languageCode);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b shadow-sm">
      <div className="flex items-center justify-between px-4 h-16">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Shield className="w-6 h-6 text-raksha-blue" />
            <span className="text-xl font-bold">
              <span className="text-raksha-blue">Raksha</span>
              <span className="text-setu-orange">Setu</span>
            </span>
          </div>
          <div className="hidden sm:block text-xs text-muted-foreground border-l pl-3 ml-1">
            {t('app.tagline')}
          </div>
        </div>

        {/* Right: Navigation */}
        <div className="flex items-center gap-2">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleHome}>
              <Home className="w-4 h-4 mr-2" />
              {t('topbar.home')}
            </Button>
            
            <Button variant="ghost" size="sm" onClick={handleSettings}>
              <Settings className="w-4 h-4 mr-2" />
              {t('topbar.settings')}
            </Button>
            
            <Select value={i18n.language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-24 h-8">
                <Globe className="w-4 h-4 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((language) => (
                  <SelectItem key={language.code} value={language.code}>
                    <div className="flex flex-col">
                      <span className="text-sm">{language.nativeName}</span>
                      <span className="text-xs text-muted-foreground">{language.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            
            <div className="flex items-center gap-2 ml-2 pl-2 border-l">
              <div className="text-sm">
                <div className="font-medium">{auth.user?.name}</div>
                <div className="text-xs text-muted-foreground capitalize">{auth.user?.role}</div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col gap-4 mt-8">
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">{auth.user?.name}</div>
                      <div className="text-sm text-muted-foreground capitalize">{auth.user?.role}</div>
                    </div>
                  </div>
                  
                  <Button variant="ghost" className="justify-start" onClick={handleHome}>
                    <Home className="w-4 h-4 mr-3" />
                    {t('topbar.home')}
                  </Button>
                  
                  <Button variant="ghost" className="justify-start" onClick={handleSettings}>
                    <Settings className="w-4 h-4 mr-3" />
                    {t('topbar.settings')}
                  </Button>
                  
                  <div className="px-3 py-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-4 h-4" />
                      <span className="text-sm font-medium">{t('topbar.language')}</span>
                    </div>
                    <Select value={i18n.language} onValueChange={handleLanguageChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((language) => (
                          <SelectItem key={language.code} value={language.code}>
                            <div className="flex flex-col">
                              <span className="text-sm">{language.nativeName}</span>
                              <span className="text-xs text-muted-foreground">{language.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button variant="ghost" className="justify-start" onClick={toggleTheme}>
                    {isDark ? <Sun className="w-4 h-4 mr-3" /> : <Moon className="w-4 h-4 mr-3" />}
                    {isDark ? 'Light Mode' : t('topbar.dark')}
                  </Button>
                  
                  <Button variant="ghost" className="justify-start text-destructive" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-3" />
                    {t('topbar.logout')}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
    
    {/* Dialogs - available for all users */}
    <SettingsDialog isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    <HomeDialog 
      isOpen={homeDialogOpen} 
      onClose={() => setHomeDialogOpen(false)}
      onNavigate={(view) => {
        setHomeDialogOpen(false);
        // Navigate based on user role
        if (auth.user?.role === 'tourist') {
          navigate('/tourist');
        } else {
          navigate('/dashboard');
        }
      }}
    />
    </>
  );
};

export default TopBar;