import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Languages, 
  Volume2, 
  Mic, 
  MicOff, 
  Globe, 
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import LanguageSelector from '@/components/language/LanguageSelector';
import TranslationWidget from '@/components/language/TranslationWidget';
import { useLanguageApi, useTranslation } from '@/hooks/useLanguageApi';

const LanguageDemoPage: React.FC = () => {
  const { 
    supportedLanguages, 
    isLoading, 
    error, 
    speakText, 
    startListening, 
    stopListening, 
    isSpeaking, 
    isListening,
    getVoicesForLanguage 
  } = useLanguageApi();

  const { translateText, detectLanguage } = useTranslation();
  
  const [demoText, setDemoText] = useState('Welcome to RakshaSetu - Your digital companion for safe travel');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [translationResult, setTranslationResult] = useState('');
  const [detectionResult, setDetectionResult] = useState<any>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  const handleTranslateDemo = async () => {
    if (!demoText.trim()) return;
    
    setIsTranslating(true);
    try {
      const result = await translateText({
        text: demoText,
        sourceLanguage: 'en',
        targetLanguage: selectedLanguage
      });
      setTranslationResult(result.translatedText);
    } catch (error: any) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleDetectLanguage = async () => {
    if (!demoText.trim()) return;
    
    setIsDetecting(true);
    try {
      const result = await detectLanguage({ text: demoText });
      setDetectionResult(result);
    } catch (error: any) {
      console.error('Detection error:', error);
    } finally {
      setIsDetecting(false);
    }
  };

  const handleSpeakDemo = async () => {
    if (!demoText.trim()) return;
    
    try {
      await speakText(demoText, selectedLanguage);
    } catch (error: any) {
      console.error('TTS error:', error);
    }
  };

  const handleListenDemo = async () => {
    try {
      if (isListening) {
        stopListening();
      } else {
        const result = await startListening(selectedLanguage);
        setDemoText(result);
      }
    } catch (error: any) {
      console.error('STT error:', error);
    }
  };

  const getLanguageName = (code: string) => {
    const language = supportedLanguages.find(lang => lang.code === code);
    return language ? language.name : code;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Languages className="w-8 h-8" />
          Language Features Demo
        </h1>
        <p className="text-muted-foreground">
          Experience the multilingual capabilities of RakshaSetu
        </p>
      </div>

      {/* API Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            API Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : error ? (
                <AlertCircle className="w-4 h-4 text-destructive" />
              ) : (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
              <span className="text-sm">
                {isLoading ? 'Loading...' : error ? 'Error' : 'Connected'}
              </span>
            </div>
            <Badge variant="secondary">
              {supportedLanguages.length} languages supported
            </Badge>
          </div>
          {error && (
            <p className="text-sm text-destructive mt-2">{error}</p>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="translation" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="translation">Translation</TabsTrigger>
          <TabsTrigger value="tts">Text-to-Speech</TabsTrigger>
          <TabsTrigger value="stt">Speech-to-Text</TabsTrigger>
          <TabsTrigger value="detection">Language Detection</TabsTrigger>
        </TabsList>

        {/* Translation Tab */}
        <TabsContent value="translation">
          <TranslationWidget />
        </TabsContent>

        {/* TTS Tab */}
        <TabsContent value="tts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                Text-to-Speech Demo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <LanguageSelector
                onLanguageChange={setSelectedLanguage}
                showTTS={true}
              />
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Demo Text</label>
                <textarea
                  value={demoText}
                  onChange={(e) => setDemoText(e.target.value)}
                  className="w-full p-3 border rounded-md min-h-[100px]"
                  placeholder="Enter text to speak..."
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSpeakDemo}
                  disabled={!demoText.trim() || isSpeaking}
                  className="flex-1"
                >
                  {isSpeaking ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Speaking...
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 mr-2" />
                      Speak Text
                    </>
                  )}
                </Button>
              </div>

              {translationResult && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Translated Text</label>
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm">{translationResult}</p>
                  </div>
                  <Button
                    onClick={() => speakText(translationResult, selectedLanguage)}
                    disabled={isSpeaking}
                    variant="outline"
                    size="sm"
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    Speak Translation
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* STT Tab */}
        <TabsContent value="stt">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="w-5 h-5" />
                Speech-to-Text Demo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <LanguageSelector
                onLanguageChange={setSelectedLanguage}
                showSTT={true}
              />
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Recognized Text</label>
                <textarea
                  value={demoText}
                  onChange={(e) => setDemoText(e.target.value)}
                  className="w-full p-3 border rounded-md min-h-[100px]"
                  placeholder="Click the microphone to start listening..."
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleListenDemo}
                  variant={isListening ? "destructive" : "default"}
                  className="flex-1"
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-4 h-4 mr-2" />
                      Stop Listening
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 mr-2" />
                      Start Listening
                    </>
                  )}
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>• Make sure your microphone is enabled</p>
                <p>• Speak clearly in {getLanguageName(selectedLanguage)}</p>
                <p>• Click "Start Listening" to begin voice recognition</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Language Detection Tab */}
        <TabsContent value="detection">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Language Detection Demo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Text to Analyze</label>
                <textarea
                  value={demoText}
                  onChange={(e) => setDemoText(e.target.value)}
                  className="w-full p-3 border rounded-md min-h-[100px]"
                  placeholder="Enter text in any language to detect..."
                />
              </div>

              <Button
                onClick={handleDetectLanguage}
                disabled={!demoText.trim() || isDetecting}
                className="w-full"
              >
                {isDetecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Detecting...
                  </>
                ) : (
                  'Detect Language'
                )}
              </Button>

              {detectionResult && (
                <div className="space-y-3">
                  <div className="p-4 bg-muted rounded-md">
                    <h4 className="font-medium mb-2">Detection Results</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Detected Language:</span>
                        <Badge variant="secondary">
                          {getLanguageName(detectionResult.language)}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Confidence:</span>
                        <span className="text-sm font-medium">
                          {Math.round(detectionResult.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {detectionResult.alternatives && detectionResult.alternatives.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Alternative Languages:</h5>
                      <div className="space-y-1">
                        {detectionResult.alternatives.map((alt: any, index: number) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span>{getLanguageName(alt.language)}</span>
                            <span className="text-muted-foreground">
                              {Math.round(alt.confidence * 100)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LanguageDemoPage;
