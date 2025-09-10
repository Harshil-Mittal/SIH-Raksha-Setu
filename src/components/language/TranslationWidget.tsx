import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowUpDown, 
  Volume2, 
  Copy, 
  Loader2, 
  CheckCircle,
  AlertCircle,
  Languages
} from 'lucide-react';
import { useTranslation } from '@/hooks/useLanguageApi';
import { useLanguageApi } from '@/hooks/useLanguageApi';
import { toast } from 'sonner';

interface TranslationWidgetProps {
  className?: string;
}

const TranslationWidget: React.FC<TranslationWidgetProps> = ({ className = '' }) => {
  const { translateText, detectLanguage, isLoading, error } = useTranslation();
  const { supportedLanguages, speakText, isSpeaking } = useLanguageApi();
  
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  const handleTranslate = useCallback(async () => {
    if (!sourceText.trim()) return;

    try {
      let actualSourceLanguage = sourceLanguage;
      
      // Auto-detect language if needed
      if (sourceLanguage === 'auto') {
        setIsDetecting(true);
        const detection = await detectLanguage({ text: sourceText });
        actualSourceLanguage = detection.language;
        setDetectedLanguage(detection.language);
        setIsDetecting(false);
      }

      const result = await translateText({
        text: sourceText,
        sourceLanguage: actualSourceLanguage,
        targetLanguage
      });

      setTranslatedText(result.translatedText);
      toast.success('Translation completed');
    } catch (error: any) {
      toast.error(`Translation failed: ${error.message}`);
    }
  }, [sourceText, sourceLanguage, targetLanguage, translateText, detectLanguage]);

  const handleSwapLanguages = useCallback(() => {
    if (detectedLanguage) {
      setSourceLanguage(detectedLanguage);
      setDetectedLanguage(null);
    } else {
      setSourceLanguage(targetLanguage);
    }
    setTargetLanguage(sourceLanguage === 'auto' ? 'en' : sourceLanguage);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  }, [sourceLanguage, targetLanguage, detectedLanguage, sourceText, translatedText]);

  const handleSpeakSource = useCallback(async () => {
    if (!sourceText.trim()) return;
    
    const language = detectedLanguage || sourceLanguage;
    if (language === 'auto') return;
    
    try {
      await speakText(sourceText, language);
    } catch (error: any) {
      toast.error(`TTS failed: ${error.message}`);
    }
  }, [sourceText, detectedLanguage, sourceLanguage, speakText]);

  const handleSpeakTarget = useCallback(async () => {
    if (!translatedText.trim()) return;
    
    try {
      await speakText(translatedText, targetLanguage);
    } catch (error: any) {
      toast.error(`TTS failed: ${error.message}`);
    }
  }, [translatedText, targetLanguage, speakText]);

  const handleCopySource = useCallback(() => {
    navigator.clipboard.writeText(sourceText);
    toast.success('Source text copied');
  }, [sourceText]);

  const handleCopyTarget = useCallback(() => {
    navigator.clipboard.writeText(translatedText);
    toast.success('Translated text copied');
  }, [translatedText]);

  const getLanguageName = (code: string) => {
    if (code === 'auto') return 'Auto-detect';
    const language = supportedLanguages.find(lang => lang.code === code);
    return language ? language.name : code;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="w-5 h-5" />
          Translation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Language Selection */}
        <div className="flex gap-2 items-center">
          <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto-detect</SelectItem>
              {supportedLanguages.map((language) => (
                <SelectItem key={language.code} value={language.code}>
                  {language.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleSwapLanguages}
            disabled={isLoading}
          >
            <ArrowUpDown className="w-4 h-4" />
          </Button>
          
          <Select value={targetLanguage} onValueChange={setTargetLanguage}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {supportedLanguages.map((language) => (
                <SelectItem key={language.code} value={language.code}>
                  {language.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Detected Language Badge */}
        {detectedLanguage && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              Detected: {getLanguageName(detectedLanguage)}
            </Badge>
            {isDetecting && <Loader2 className="w-4 h-4 animate-spin" />}
          </div>
        )}

        {/* Source Text */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              {getLanguageName(sourceLanguage)}
            </label>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSpeakSource}
                disabled={!sourceText.trim() || isSpeaking || sourceLanguage === 'auto'}
              >
                <Volume2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopySource}
                disabled={!sourceText.trim()}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Enter text to translate..."
            className="min-h-[100px]"
          />
        </div>

        {/* Translate Button */}
        <Button
          onClick={handleTranslate}
          disabled={!sourceText.trim() || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Translating...
            </>
          ) : (
            'Translate'
          )}
        </Button>

        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <span className="text-sm text-destructive">{error}</span>
          </div>
        )}

        {/* Translated Text */}
        {translatedText && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                {getLanguageName(targetLanguage)}
              </label>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSpeakTarget}
                  disabled={!translatedText.trim() || isSpeaking}
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyTarget}
                  disabled={!translatedText.trim()}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-3 bg-muted rounded-md min-h-[100px]">
              <p className="text-sm whitespace-pre-wrap">{translatedText}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TranslationWidget;
