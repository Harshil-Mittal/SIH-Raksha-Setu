import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Globe, Volume2, Mic, MicOff, Loader2 } from 'lucide-react';
import { useLanguageApi } from '@/hooks/useLanguageApi';
import { useLanguage } from '@/context/LanguageContext';

interface LanguageSelectorProps {
  onLanguageChange?: (language: string) => void;
  showTTS?: boolean;
  showSTT?: boolean;
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  onLanguageChange,
  showTTS = false,
  showSTT = false,
  className = ''
}) => {
  const { currentLanguage, changeLanguage, isChanging } = useLanguage();
  const { 
    supportedLanguages, 
    isLoading, 
    error, 
    speakText, 
    startListening, 
    stopListening, 
    isSpeaking, 
    isListening,
    clearError 
  } = useLanguageApi();

  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
  const [testText, setTestText] = useState('');

  // Update selected language when current language changes
  useEffect(() => {
    setSelectedLanguage(currentLanguage);
  }, [currentLanguage]);

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    changeLanguage(languageCode);
    onLanguageChange?.(languageCode);
  };

  const handleTTS = async () => {
    if (!testText.trim()) return;
    
    try {
      await speakText(testText, selectedLanguage);
    } catch (error) {
      console.error('TTS error:', error);
    }
  };

  const handleSTT = async () => {
    try {
      if (isListening) {
        stopListening();
      } else {
        const result = await startListening(selectedLanguage);
        setTestText(result);
      }
    } catch (error) {
      console.error('STT error:', error);
    }
  };

  const getLanguageName = (code: string) => {
    const language = supportedLanguages.find(lang => lang.code === code);
    return language ? `${language.name} (${language.code})` : code;
  };

  if (error) {
    return (
      <div className={`p-4 border border-destructive rounded-lg ${className}`}>
        <div className="flex items-center gap-2 text-destructive">
          <Globe className="w-4 h-4" />
          <span className="text-sm">Language service unavailable</span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={clearError}
          className="mt-2"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Language Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Language
        </label>
        <Select 
          value={selectedLanguage} 
          onValueChange={handleLanguageChange}
          disabled={isLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {supportedLanguages.map((language) => (
              <SelectItem key={language.code} value={language.code}>
                <div className="flex flex-col">
                  <span className="text-sm">{language.name}</span>
                  <span className="text-xs text-muted-foreground">{language.code}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading languages...
          </div>
        )}
      </div>

      {/* Test Text Input */}
      {(showTTS || showSTT) && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Test Text</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="Enter text to test..."
              className="flex-1 px-3 py-2 border rounded-md text-sm"
            />
            {showTTS && (
              <Button
                onClick={handleTTS}
                disabled={!testText.trim() || isSpeaking}
                size="sm"
                variant="outline"
              >
                {isSpeaking ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
            )}
            {showSTT && (
              <Button
                onClick={handleSTT}
                disabled={isSpeaking}
                size="sm"
                variant={isListening ? "destructive" : "outline"}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Language Info */}
      <div className="text-xs text-muted-foreground">
        {supportedLanguages.length} languages supported
      </div>
    </div>
  );
};

export default LanguageSelector;
