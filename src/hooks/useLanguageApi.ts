import { useState, useCallback, useEffect } from 'react';
import { 
  languageApi, 
  WebSpeechUtils,
  TranslationRequest,
  TranslationResponse,
  LanguageDetectionRequest,
  LanguageDetectionResponse,
  TTSRequest,
  TTSResponse,
  STTRequest,
  STTResponse,
  SupportedLanguage
} from '@/services/languageApi';

interface UseLanguageApiReturn {
  // State
  supportedLanguages: SupportedLanguage[];
  isLoading: boolean;
  error: string | null;
  isSpeaking: boolean;
  isListening: boolean;

  // Translation functions
  translateText: (request: TranslationRequest) => Promise<TranslationResponse>;
  translateBatch: (translations: TranslationRequest[]) => Promise<TranslationResponse[]>;
  detectLanguage: (request: LanguageDetectionRequest) => Promise<LanguageDetectionResponse>;

  // TTS functions
  speakText: (text: string, language: string, options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    voice?: string;
  }) => Promise<void>;
  stopSpeaking: () => void;

  // STT functions
  startListening: (language: string, options?: {
    continuous?: boolean;
    interimResults?: boolean;
    maxAlternatives?: number;
  }) => Promise<string>;
  stopListening: () => void;

  // Utility functions
  getVoicesForLanguage: (language: string) => SpeechSynthesisVoice[];
  clearError: () => void;
}

export const useLanguageApi = (): UseLanguageApiReturn => {
  const [supportedLanguages, setSupportedLanguages] = useState<SupportedLanguage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Load supported languages on mount
  useEffect(() => {
    loadSupportedLanguages();
  }, []);

  const loadSupportedLanguages = useCallback(async () => {
    try {
      setIsLoading(true);
      const languages = await languageApi.getSupportedLanguages();
      setSupportedLanguages(languages);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Translation functions
  const translateText = useCallback(async (request: TranslationRequest): Promise<TranslationResponse> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await languageApi.translateText(request);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const translateBatch = useCallback(async (translations: TranslationRequest[]): Promise<TranslationResponse[]> => {
    try {
      setIsLoading(true);
      setError(null);
      const results = await languageApi.translateBatch(translations);
      return results;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const detectLanguage = useCallback(async (request: LanguageDetectionRequest): Promise<LanguageDetectionResponse> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await languageApi.detectLanguage(request);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // TTS functions
  const speakText = useCallback(async (
    text: string, 
    language: string, 
    options: {
      rate?: number;
      pitch?: number;
      volume?: number;
      voice?: string;
    } = {}
  ): Promise<void> => {
    try {
      setIsSpeaking(true);
      setError(null);
      await WebSpeechUtils.speakText(text, language, options);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsSpeaking(false);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    WebSpeechUtils.stopSpeaking();
    setIsSpeaking(false);
  }, []);

  // STT functions
  const startListening = useCallback(async (
    language: string, 
    options: {
      continuous?: boolean;
      interimResults?: boolean;
      maxAlternatives?: number;
    } = {}
  ): Promise<string> => {
    try {
      setIsListening(true);
      setError(null);
      const result = await WebSpeechUtils.startListening(language, options);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsListening(false);
    }
  }, []);

  const stopListening = useCallback(() => {
    WebSpeechUtils.stopListening();
    setIsListening(false);
  }, []);

  // Utility functions
  const getVoicesForLanguage = useCallback((language: string): SpeechSynthesisVoice[] => {
    return WebSpeechUtils.getVoicesForLanguage(language);
  }, []);

  return {
    // State
    supportedLanguages,
    isLoading,
    error,
    isSpeaking,
    isListening,

    // Translation functions
    translateText,
    translateBatch,
    detectLanguage,

    // TTS functions
    speakText,
    stopSpeaking,

    // STT functions
    startListening,
    stopListening,

    // Utility functions
    getVoicesForLanguage,
    clearError,
  };
};

// Hook for translation with caching
export const useTranslation = () => {
  const { translateText, translateBatch, detectLanguage, isLoading, error } = useLanguageApi();
  const [translationCache, setTranslationCache] = useState<Map<string, TranslationResponse>>(new Map());

  const translateWithCache = useCallback(async (request: TranslationRequest): Promise<TranslationResponse> => {
    const cacheKey = `${request.text}-${request.sourceLanguage}-${request.targetLanguage}`;
    
    // Check cache first
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey)!;
    }

    // Translate and cache result
    const result = await translateText(request);
    setTranslationCache(prev => new Map(prev).set(cacheKey, result));
    
    return result;
  }, [translateText, translationCache]);

  const clearCache = useCallback(() => {
    setTranslationCache(new Map());
  }, []);

  return {
    translateText: translateWithCache,
    translateBatch,
    detectLanguage,
    isLoading,
    error,
    clearCache,
    cacheSize: translationCache.size
  };
};

// Hook for TTS with queue management
export const useTTS = () => {
  const { speakText, stopSpeaking, isSpeaking, getVoicesForLanguage } = useLanguageApi();
  const [queue, setQueue] = useState<Array<{ text: string; language: string; options?: any }>>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const speakQueued = useCallback(async () => {
    if (queue.length === 0 || isProcessing) return;

    setIsProcessing(true);
    const item = queue[0];
    
    try {
      await speakText(item.text, item.language, item.options);
      setQueue(prev => prev.slice(1));
    } catch (error) {
      console.error('TTS queue error:', error);
      setQueue(prev => prev.slice(1));
    } finally {
      setIsProcessing(false);
    }
  }, [queue, isProcessing, speakText]);

  const addToQueue = useCallback((text: string, language: string, options?: any) => {
    setQueue(prev => [...prev, { text, language, options }]);
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
    stopSpeaking();
  }, [stopSpeaking]);

  // Process queue when items are added
  useEffect(() => {
    if (queue.length > 0 && !isProcessing && !isSpeaking) {
      speakQueued();
    }
  }, [queue, isProcessing, isSpeaking, speakQueued]);

  return {
    speakText,
    addToQueue,
    clearQueue,
    stopSpeaking,
    isSpeaking: isSpeaking || isProcessing,
    queueLength: queue.length,
    getVoicesForLanguage
  };
};
