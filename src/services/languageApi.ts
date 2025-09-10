import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Types
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

export interface TTSRequest {
  text: string;
  language: string;
  voice?: string;
  speed?: number;
  pitch?: number;
}

export interface TTSResponse {
  audioUrl?: string;
  audioData?: string;
  duration?: number;
  format: string;
  language: string;
  voice: string;
}

export interface STTRequest {
  audioData?: string;
  audioUrl?: string;
  language: string;
  format?: string;
}

export interface STTResponse {
  text: string;
  confidence: number;
  language: string;
  duration?: number;
  alternatives?: Array<{
    text: string;
    confidence: number;
  }>;
}

export interface SupportedLanguage {
  code: string;
  name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class LanguageApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('❌ API Response Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Health Check
  async checkHealth(): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.get('/health');
      return response.data;
    } catch (error: any) {
      throw new Error(`Health check failed: ${error.message}`);
    }
  }

  // Get supported languages
  async getSupportedLanguages(): Promise<SupportedLanguage[]> {
    try {
      const response = await this.api.get('/language/supported');
      return response.data.data.languages;
    } catch (error: any) {
      throw new Error(`Failed to fetch supported languages: ${error.message}`);
    }
  }

  // Translate text
  async translateText(request: TranslationRequest): Promise<TranslationResponse> {
    try {
      const response = await this.api.post('/language/translate', request);
      return response.data.data;
    } catch (error: any) {
      throw new Error(`Translation failed: ${error.response?.data?.error || error.message}`);
    }
  }

  // Batch translate
  async translateBatch(translations: TranslationRequest[]): Promise<TranslationResponse[]> {
    try {
      const response = await this.api.post('/language/translate/batch', { translations });
      return response.data.data;
    } catch (error: any) {
      throw new Error(`Batch translation failed: ${error.response?.data?.error || error.message}`);
    }
  }

  // Detect language
  async detectLanguage(request: LanguageDetectionRequest): Promise<LanguageDetectionResponse> {
    try {
      const response = await this.api.post('/language/detect', request);
      return response.data.data;
    } catch (error: any) {
      throw new Error(`Language detection failed: ${error.response?.data?.error || error.message}`);
    }
  }

  // Text-to-Speech
  async generateTTS(request: TTSRequest): Promise<TTSResponse> {
    try {
      const response = await this.api.post('/language/tts', request);
      return response.data.data;
    } catch (error: any) {
      throw new Error(`TTS generation failed: ${error.response?.data?.error || error.message}`);
    }
  }

  // Get TTS capabilities
  async getTTSCapabilities(): Promise<any> {
    try {
      const response = await this.api.get('/language/tts/capabilities');
      return response.data.data;
    } catch (error: any) {
      throw new Error(`Failed to get TTS capabilities: ${error.message}`);
    }
  }

  // Speech-to-Text
  async processSTT(request: STTRequest): Promise<STTResponse> {
    try {
      const response = await this.api.post('/language/stt', request);
      return response.data.data;
    } catch (error: any) {
      throw new Error(`STT processing failed: ${error.response?.data?.error || error.message}`);
    }
  }

  // Get STT capabilities
  async getSTTCapabilities(): Promise<any> {
    try {
      const response = await this.api.get('/language/stt/capabilities');
      return response.data.data;
    } catch (error: any) {
      throw new Error(`Failed to get STT capabilities: ${error.message}`);
    }
  }

  // Get Web Speech API configuration
  async getWebSpeechConfig(language: string): Promise<any> {
    try {
      const response = await this.api.get(`/language/web-speech/config?language=${language}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(`Failed to get Web Speech config: ${error.message}`);
    }
  }
}

// Web Speech API utilities
export class WebSpeechUtils {
  private static speechSynthesis = window.speechSynthesis;
  private static speechRecognition: any = null;

  // Initialize speech recognition
  static initSpeechRecognition(): any {
    if (!this.speechRecognition) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.speechRecognition = new SpeechRecognition();
      }
    }
    return this.speechRecognition;
  }

  // Text-to-Speech using Web Speech API
  static speakText(text: string, language: string, options: {
    rate?: number;
    pitch?: number;
    volume?: number;
    voice?: string;
  } = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.speechSynthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = options.rate || 1.0;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;

      // Set voice if specified
      if (options.voice) {
        const voices = this.speechSynthesis.getVoices();
        const selectedVoice = voices.find(voice => voice.name === options.voice);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));

      this.speechSynthesis.speak(utterance);
    });
  }

  // Speech-to-Text using Web Speech API
  static startListening(language: string, options: {
    continuous?: boolean;
    interimResults?: boolean;
    maxAlternatives?: number;
  } = {}): Promise<string> {
    return new Promise((resolve, reject) => {
      const recognition = this.initSpeechRecognition();
      if (!recognition) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      recognition.lang = language;
      recognition.continuous = options.continuous || false;
      recognition.interimResults = options.interimResults || false;
      recognition.maxAlternatives = options.maxAlternatives || 1;

      let finalTranscript = '';

      recognition.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
      };

      recognition.onend = () => {
        resolve(finalTranscript.trim());
      };

      recognition.onerror = (event: any) => {
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      recognition.start();
    });
  }

  // Get available voices
  static getVoices(): SpeechSynthesisVoice[] {
    return this.speechSynthesis.getVoices();
  }

  // Get voices for specific language
  static getVoicesForLanguage(language: string): SpeechSynthesisVoice[] {
    const voices = this.getVoices();
    return voices.filter(voice => voice.lang.startsWith(language));
  }

  // Stop current speech
  static stopSpeaking(): void {
    this.speechSynthesis.cancel();
  }

  // Stop current recognition
  static stopListening(): void {
    if (this.speechRecognition) {
      this.speechRecognition.stop();
    }
  }
}

// Create singleton instance
export const languageApi = new LanguageApiService();

// Export types
export type {
  TranslationRequest,
  TranslationResponse,
  LanguageDetectionRequest,
  LanguageDetectionResponse,
  TTSRequest,
  TTSResponse,
  STTRequest,
  STTResponse,
  SupportedLanguage,
  ApiResponse
};
