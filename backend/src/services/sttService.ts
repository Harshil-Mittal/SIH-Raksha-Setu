import { logger } from '../utils/logger';

export interface STTRequest {
  audioData?: string; // Base64 encoded audio
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

class STTService {
  private supportedLanguages: Map<string, string> = new Map([
    ['en', 'en-US'],
    ['hi', 'hi-IN'],
    ['as', 'as-IN'],
    ['bn', 'bn-IN'],
    ['ta', 'ta-IN'],
    ['te', 'te-IN'],
    ['mr', 'mr-IN'],
    ['gu', 'gu-IN'],
    ['mni', 'mni-IN'],
    ['kha', 'kha-IN'],
    ['nsm', 'nsm-IN'],
    ['brx', 'brx-IN']
  ]);

  private supportedFormats: string[] = [
    'audio/wav',
    'audio/mp3',
    'audio/ogg',
    'audio/webm',
    'audio/m4a'
  ];

  // Process speech-to-text using Web Speech API (client-side)
  processSTTInstructions(request: STTRequest): STTResponse {
    const webSpeechLanguage = this.getWebSpeechLanguage(request.language);
    
    return {
      text: '', // Will be filled by client-side implementation
      confidence: 0.8, // Default confidence
      language: request.language,
      // Instructions for client-side implementation
      alternatives: []
    };
  }

  // Get Web Speech API language code
  getWebSpeechLanguage(language: string): string {
    return this.supportedLanguages.get(language) || 'en-US';
  }

  // Get all supported languages
  getSupportedLanguages(): string[] {
    return Array.from(this.supportedLanguages.keys());
  }

  // Get supported audio formats
  getSupportedFormats(): string[] {
    return this.supportedFormats;
  }

  // Validate language for STT
  isValidLanguage(language: string): boolean {
    return this.supportedLanguages.has(language);
  }

  // Validate audio format
  isValidFormat(format: string): boolean {
    return this.supportedFormats.includes(format);
  }

  // Generate Web Speech API configuration
  generateWebSpeechConfig(language: string): {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    maxAlternatives: number;
  } {
    return {
      lang: this.getWebSpeechLanguage(language),
      continuous: true,
      interimResults: true,
      maxAlternatives: 3
    };
  }

  // Process audio file (placeholder for future external service integration)
  async processAudioFile(request: STTRequest): Promise<STTResponse> {
    // This would integrate with external STT services like:
    // - Google Cloud Speech-to-Text
    // - Azure Speech Services
    // - AWS Transcribe
    // - Deepgram
    // - AssemblyAI
    
    logger.info('Audio file processing requested', {
      language: request.language,
      format: request.format,
      hasAudioData: !!request.audioData,
      hasAudioUrl: !!request.audioUrl
    });

    // For now, return instructions for client-side processing
    return this.processSTTInstructions(request);
  }

  // Get STT capabilities
  getCapabilities(): {
    supportedLanguages: string[];
    supportedFormats: string[];
    maxAudioDuration: number; // in seconds
    maxFileSize: number; // in bytes
  } {
    return {
      supportedLanguages: this.getSupportedLanguages(),
      supportedFormats: this.supportedFormats,
      maxAudioDuration: 300, // 5 minutes
      maxFileSize: 25 * 1024 * 1024 // 25MB
    };
  }

  // Validate audio file
  validateAudioFile(audioData: string, format: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Check if audio data is valid base64
    try {
      const buffer = Buffer.from(audioData, 'base64');
      if (buffer.length === 0) {
        errors.push('Audio data is empty');
      }
    } catch (error) {
      errors.push('Invalid base64 audio data');
    }

    // Check format
    if (!this.isValidFormat(format)) {
      errors.push(`Unsupported audio format: ${format}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export const sttService = new STTService();
