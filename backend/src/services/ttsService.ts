import { logger } from '../utils/logger';

export interface TTSRequest {
  text: string;
  language: string;
  voice?: string;
  speed?: number;
  pitch?: number;
}

export interface TTSResponse {
  audioUrl?: string;
  audioData?: string; // Base64 encoded audio
  duration?: number;
  format: string;
  language: string;
  voice: string;
}

class TTSService {
  private supportedLanguages: Map<string, string[]> = new Map([
    ['en', ['en-US', 'en-GB', 'en-AU']],
    ['hi', ['hi-IN']],
    ['as', ['as-IN']],
    ['bn', ['bn-IN', 'bn-BD']],
    ['ta', ['ta-IN']],
    ['te', ['te-IN']],
    ['mr', ['mr-IN']],
    ['gu', ['gu-IN']],
    ['mni', ['mni-IN']],
    ['kha', ['kha-IN']],
    ['nsm', ['nsm-IN']],
    ['brx', ['brx-IN']]
  ]);

  // Generate TTS using Web Speech API (client-side)
  generateTTSInstructions(request: TTSRequest): TTSResponse {
    const voice = this.getVoiceForLanguage(request.language);
    
    return {
      format: 'web_speech',
      language: request.language,
      voice: voice,
      // Instructions for client-side implementation
      audioUrl: this.generateWebSpeechInstructions(request, voice)
    };
  }

  // Get available voices for a language
  getVoicesForLanguage(language: string): string[] {
    return this.supportedLanguages.get(language) || ['en-US'];
  }

  // Get all supported languages
  getSupportedLanguages(): string[] {
    return Array.from(this.supportedLanguages.keys());
  }

  // Validate language for TTS
  isValidLanguage(language: string): boolean {
    return this.supportedLanguages.has(language);
  }

  // Get default voice for language
  private getVoiceForLanguage(language: string): string {
    const voices = this.supportedLanguages.get(language);
    return voices ? voices[0] : 'en-US';
  }

  // Generate Web Speech API instructions
  private generateWebSpeechInstructions(request: TTSRequest, voice: string): string {
    const instructions = {
      text: request.text,
      language: voice,
      rate: request.speed || 1.0,
      pitch: request.pitch || 1.0,
      volume: 1.0,
      // Web Speech API configuration
      webSpeechConfig: {
        lang: voice,
        rate: request.speed || 1.0,
        pitch: request.pitch || 1.0,
        volume: 1.0
      }
    };

    return JSON.stringify(instructions);
  }

  // Generate SSML for advanced TTS (if using external service)
  generateSSML(request: TTSRequest): string {
    const voice = this.getVoiceForLanguage(request.language);
    const rate = request.speed || 1.0;
    const pitch = request.pitch || 1.0;

    return `
      <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${voice}">
        <voice name="${voice}">
          <prosody rate="${rate}" pitch="${pitch}">
            ${request.text}
          </prosody>
        </voice>
      </speak>
    `.trim();
  }

  // Get TTS capabilities
  getCapabilities(): {
    supportedLanguages: string[];
    supportedVoices: Map<string, string[]>;
    supportedFormats: string[];
    maxTextLength: number;
  } {
    return {
      supportedLanguages: this.getSupportedLanguages(),
      supportedVoices: this.supportedLanguages,
      supportedFormats: ['web_speech', 'ssml'],
      maxTextLength: 5000
    };
  }
}

export const ttsService = new TTSService();
