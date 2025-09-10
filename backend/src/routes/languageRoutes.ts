import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger';
import { translationService } from '../services/translationService';
import { ttsService } from '../services/ttsService';
import { sttService } from '../services/sttService';

const router = Router();

// Get supported languages
router.get('/supported', async (req: Request, res: Response) => {
  try {
    const languages = await translationService.getSupportedLanguages();
    const providerStatus = translationService.getProviderStatus();
    
    res.json({
      success: true,
      data: {
        languages,
        count: languages.length,
        provider: providerStatus
      }
    });
  } catch (error) {
    logger.error('Failed to get supported languages', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch supported languages'
    });
  }
});

// Get translation provider status
router.get('/provider-status', (req: Request, res: Response) => {
  try {
    const status = translationService.getProviderStatus();
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    logger.error('Failed to get provider status', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to get provider status'
    });
  }
});

// Translate text
router.post('/translate', async (req: Request, res: Response) => {
  try {
    const { text, sourceLanguage, targetLanguage } = req.body;

    // Validation
    if (!text || !sourceLanguage || !targetLanguage) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: text, sourceLanguage, targetLanguage'
      });
    }

    if (!translationService.isValidLanguageCode(sourceLanguage) || 
        !translationService.isValidLanguageCode(targetLanguage)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid language code'
      });
    }

    const result = await translationService.translateText({
      text,
      sourceLanguage,
      targetLanguage
    });

    logger.info('Translation completed', {
      sourceLanguage,
      targetLanguage,
      textLength: text.length
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Translation failed', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Translation service unavailable'
    });
  }
});

// Batch translate
router.post('/translate/batch', async (req: Request, res: Response) => {
  try {
    const { translations } = req.body;

    if (!Array.isArray(translations) || translations.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'translations array is required and must not be empty'
      });
    }

    // Validate each translation request
    for (const translation of translations) {
      if (!translation.text || !translation.sourceLanguage || !translation.targetLanguage) {
        return res.status(400).json({
          success: false,
          error: 'Each translation must have text, sourceLanguage, and targetLanguage'
        });
      }
    }

    const results = await translationService.translateBatch(translations);

    logger.info('Batch translation completed', {
      count: translations.length
    });

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    logger.error('Batch translation failed', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Batch translation service unavailable'
    });
  }
});

// Detect language
router.post('/detect', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'text field is required'
      });
    }

    const result = await translationService.detectLanguage({ text });

    logger.info('Language detection completed', {
      detectedLanguage: result.language,
      confidence: result.confidence
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Language detection failed', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Language detection service unavailable'
    });
  }
});

// Text-to-Speech
router.post('/tts', async (req: Request, res: Response) => {
  try {
    const { text, language, voice, speed, pitch } = req.body;

    if (!text || !language) {
      return res.status(400).json({
        success: false,
        error: 'text and language fields are required'
      });
    }

    if (!ttsService.isValidLanguage(language)) {
      return res.status(400).json({
        success: false,
        error: 'Unsupported language for TTS'
      });
    }

    const result = ttsService.generateTTSInstructions({
      text,
      language,
      voice,
      speed,
      pitch
    });

    logger.info('TTS instructions generated', {
      language,
      textLength: text.length
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('TTS generation failed', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'TTS service unavailable'
    });
  }
});

// Get TTS capabilities
router.get('/tts/capabilities', (req: Request, res: Response) => {
  try {
    const capabilities = ttsService.getCapabilities();
    res.json({
      success: true,
      data: capabilities
    });
  } catch (error) {
    logger.error('Failed to get TTS capabilities', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch TTS capabilities'
    });
  }
});

// Speech-to-Text
router.post('/stt', async (req: Request, res: Response) => {
  try {
    const { audioData, audioUrl, language, format } = req.body;

    if (!language) {
      return res.status(400).json({
        success: false,
        error: 'language field is required'
      });
    }

    if (!sttService.isValidLanguage(language)) {
      return res.status(400).json({
        success: false,
        error: 'Unsupported language for STT'
      });
    }

    if (audioData) {
      // Validate audio data
      const validation = sttService.validateAudioFile(audioData, format || 'audio/wav');
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: 'Invalid audio data',
          details: validation.errors
        });
      }
    }

    const result = await sttService.processAudioFile({
      audioData,
      audioUrl,
      language,
      format
    });

    logger.info('STT processing completed', {
      language,
      hasAudioData: !!audioData,
      hasAudioUrl: !!audioUrl
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('STT processing failed', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'STT service unavailable'
    });
  }
});

// Get STT capabilities
router.get('/stt/capabilities', (req: Request, res: Response) => {
  try {
    const capabilities = sttService.getCapabilities();
    res.json({
      success: true,
      data: capabilities
    });
  } catch (error) {
    logger.error('Failed to get STT capabilities', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch STT capabilities'
    });
  }
});

// Get Web Speech API configuration
router.get('/web-speech/config', (req: Request, res: Response) => {
  try {
    const { language } = req.query;

    if (!language || typeof language !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'language query parameter is required'
      });
    }

    if (!sttService.isValidLanguage(language)) {
      return res.status(400).json({
        success: false,
        error: 'Unsupported language'
      });
    }

    const config = sttService.generateWebSpeechConfig(language);
    const ttsVoices = ttsService.getVoicesForLanguage(language);

    res.json({
      success: true,
      data: {
        stt: config,
        tts: {
          voices: ttsVoices,
          defaultVoice: ttsVoices[0]
        }
      }
    });
  } catch (error) {
    logger.error('Failed to get Web Speech config', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to generate Web Speech configuration'
    });
  }
});

export default router;
