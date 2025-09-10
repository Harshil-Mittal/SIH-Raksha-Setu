import axios from 'axios';
import { logger } from '../utils/logger';

export interface TranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface TranslationResponse {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence?: number;
}

export interface LanguageDetectionRequest {
  text: string;
}

export interface LanguageDetectionResponse {
  language: string;
  confidence: number;
  alternatives?: Array<{
    language: string;
    confidence: number;
  }>;
}

class TranslationService {
  private libreTranslateUrl: string;
  private googleTranslateApiKey?: string;
  private useGoogleTranslate: boolean;

  constructor() {
    this.libreTranslateUrl = process.env.LIBRETRANSLATE_URL || 'https://libretranslate.de';
    this.googleTranslateApiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    this.useGoogleTranslate = !!this.googleTranslateApiKey;
  }

  // Get supported languages
  async getSupportedLanguages(): Promise<Array<{ code: string; name: string }>> {
    if (this.useGoogleTranslate) {
      return this.getGoogleTranslateLanguages();
    }
    
    try {
      const response = await axios.get(`${this.libreTranslateUrl}/languages`);
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch supported languages', { error: error.message });
      // Fallback to our predefined languages
      return this.getFallbackLanguages();
    }
  }

  // Get Google Translate supported languages
  private async getGoogleTranslateLanguages(): Promise<Array<{ code: string; name: string }>> {
    try {
      const response = await axios.get('https://translation.googleapis.com/language/translate/v2/languages', {
        params: {
          key: this.googleTranslateApiKey,
          target: 'en'
        }
      });
      
      return response.data.data.languages.map((lang: any) => ({
        code: lang.language,
        name: lang.name
      }));
    } catch (error) {
      logger.error('Failed to fetch Google Translate languages', { error: error.message });
      return this.getFallbackLanguages();
    }
  }

  // Translate text
  async translateText(request: TranslationRequest): Promise<TranslationResponse> {
    if (this.useGoogleTranslate) {
      return this.translateWithGoogle(request);
    }
    
    return this.translateWithLibreTranslate(request);
  }

  // Translate using Google Translate API
  private async translateWithGoogle(request: TranslationRequest): Promise<TranslationResponse> {
    try {
      const response = await axios.post('https://translation.googleapis.com/language/translate/v2', {
        q: request.text,
        source: request.sourceLanguage,
        target: request.targetLanguage,
        format: 'text'
      }, {
        params: {
          key: this.googleTranslateApiKey
        }
      });

      const translation = response.data.data.translations[0];
      
      return {
        translatedText: translation.translatedText,
        sourceLanguage: translation.detectedSourceLanguage || request.sourceLanguage,
        targetLanguage: request.targetLanguage,
        confidence: 0.95 // Google Translate typically has high confidence
      };
    } catch (error) {
      logger.error('Google Translate failed', { 
        error: error.message, 
        sourceLanguage: request.sourceLanguage,
        targetLanguage: request.targetLanguage 
      });
      throw new Error('Google Translate service unavailable');
    }
  }

  // Translate using LibreTranslate
  private async translateWithLibreTranslate(request: TranslationRequest): Promise<TranslationResponse> {
    try {
      const response = await axios.post(`${this.libreTranslateUrl}/translate`, {
        q: request.text,
        source: request.sourceLanguage,
        target: request.targetLanguage,
        format: 'text'
      });

      return {
        translatedText: response.data.translatedText,
        sourceLanguage: request.sourceLanguage,
        targetLanguage: request.targetLanguage,
        confidence: response.data.confidence || 0.8
      };
    } catch (error) {
      logger.error('LibreTranslate failed', { 
        error: error.message, 
        sourceLanguage: request.sourceLanguage,
        targetLanguage: request.targetLanguage 
      });
      throw new Error('Translation service unavailable');
    }
  }

  // Detect language
  async detectLanguage(request: LanguageDetectionRequest): Promise<LanguageDetectionResponse> {
    if (this.useGoogleTranslate) {
      return this.detectLanguageWithGoogle(request);
    }
    
    return this.detectLanguageWithLibreTranslate(request);
  }

  // Detect language using Google Translate API
  private async detectLanguageWithGoogle(request: LanguageDetectionRequest): Promise<LanguageDetectionResponse> {
    try {
      const response = await axios.post('https://translation.googleapis.com/language/translate/v2/detect', {
        q: request.text
      }, {
        params: {
          key: this.googleTranslateApiKey
        }
      });

      const detection = response.data.data.detections[0][0];
      
      return {
        language: detection.language,
        confidence: detection.confidence,
        alternatives: [] // Google Translate doesn't provide alternatives in detect API
      };
    } catch (error) {
      logger.error('Google Translate detection failed', { error: error.message });
      throw new Error('Language detection service unavailable');
    }
  }

  // Detect language using LibreTranslate
  private async detectLanguageWithLibreTranslate(request: LanguageDetectionRequest): Promise<LanguageDetectionResponse> {
    try {
      const response = await axios.post(`${this.libreTranslateUrl}/detect`, {
        q: request.text
      });

      const detectedLanguages = response.data;
      const primaryDetection = detectedLanguages[0];

      return {
        language: primaryDetection.language,
        confidence: primaryDetection.confidence,
        alternatives: detectedLanguages.slice(1).map((lang: any) => ({
          language: lang.language,
          confidence: lang.confidence
        }))
      };
    } catch (error) {
      logger.error('LibreTranslate detection failed', { error: error.message });
      throw new Error('Language detection service unavailable');
    }
  }

  // Batch translate multiple texts
  async translateBatch(requests: TranslationRequest[]): Promise<TranslationResponse[]> {
    if (this.useGoogleTranslate) {
      return this.translateBatchWithGoogle(requests);
    }
    
    const promises = requests.map(request => this.translateText(request));
    return Promise.all(promises);
  }

  // Batch translate using Google Translate API
  private async translateBatchWithGoogle(requests: TranslationRequest[]): Promise<TranslationResponse[]> {
    try {
      const response = await axios.post('https://translation.googleapis.com/language/translate/v2', {
        q: requests.map(req => req.text),
        source: requests[0].sourceLanguage, // Assuming all requests have same source language
        target: requests[0].targetLanguage, // Assuming all requests have same target language
        format: 'text'
      }, {
        params: {
          key: this.googleTranslateApiKey
        }
      });

      return response.data.data.translations.map((translation: any, index: number) => ({
        translatedText: translation.translatedText,
        sourceLanguage: translation.detectedSourceLanguage || requests[index].sourceLanguage,
        targetLanguage: requests[index].targetLanguage,
        confidence: 0.95
      }));
    } catch (error) {
      logger.error('Google Translate batch failed', { error: error.message });
      throw new Error('Batch translation service unavailable');
    }
  }

  // Get fallback languages (matching frontend languages)
  private getFallbackLanguages(): Array<{ code: string; name: string }> {
    return [
      { code: 'en', name: 'English' },
      { code: 'hi', name: 'Hindi' },
      { code: 'as', name: 'Assamese' },
      { code: 'bn', name: 'Bengali' },
      { code: 'mni', name: 'Manipuri' },
      { code: 'kha', name: 'Khasi' },
      { code: 'nsm', name: 'Nagamese' },
      { code: 'brx', name: 'Bodo' },
      { code: 'ta', name: 'Tamil' },
      { code: 'te', name: 'Telugu' },
      { code: 'mr', name: 'Marathi' },
      { code: 'gu', name: 'Gujarati' }
    ];
  }

  // Validate language codes
  isValidLanguageCode(code: string): boolean {
    const supportedLanguages = this.getFallbackLanguages();
    return supportedLanguages.some(lang => lang.code === code);
  }

  // Get current translation provider status
  getProviderStatus(): {
    provider: 'google' | 'libretranslate' | 'fallback';
    isConfigured: boolean;
    apiKeyPresent: boolean;
  } {
    return {
      provider: this.useGoogleTranslate ? 'google' : 'libretranslate',
      isConfigured: this.useGoogleTranslate || !!this.libreTranslateUrl,
      apiKeyPresent: !!this.googleTranslateApiKey
    };
  }
}

export const translationService = new TranslationService();
