# RakshaSetu Language API Backend

A comprehensive language services API for the RakshaSetu companion app, providing translation, text-to-speech, and speech-to-text capabilities for 12 Indian languages.

## Features

### 🌐 Translation Services
- **Multi-language Support**: 12 Indian languages (English, Hindi, Assamese, Bengali, Manipuri, Khasi, Nagamese, Bodo, Tamil, Telugu, Marathi, Gujarati)
- **Free API Integration**: Uses LibreTranslate for cost-effective translation
- **Batch Translation**: Translate multiple texts in a single request
- **Language Detection**: Automatically detect the language of input text

### 🔊 Text-to-Speech (TTS)
- **Web Speech API Integration**: Client-side TTS using browser capabilities
- **Multi-language Voice Support**: Native voices for each supported language
- **Customizable Parameters**: Speed, pitch, and voice selection
- **SSML Support**: Advanced speech synthesis markup

### 🎤 Speech-to-Text (STT)
- **Web Speech API Integration**: Client-side STT using browser capabilities
- **Multi-language Recognition**: Support for all 12 Indian languages
- **Real-time Processing**: Continuous speech recognition
- **Alternative Results**: Multiple recognition alternatives with confidence scores

## API Endpoints

### Health Check
- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Detailed system information

### Translation
- `GET /api/language/supported` - Get supported languages
- `POST /api/language/translate` - Translate text
- `POST /api/language/translate/batch` - Batch translate multiple texts
- `POST /api/language/detect` - Detect language of text

### Text-to-Speech
- `POST /api/language/tts` - Generate TTS instructions
- `GET /api/language/tts/capabilities` - Get TTS capabilities

### Speech-to-Text
- `POST /api/language/stt` - Process speech-to-text
- `GET /api/language/stt/capabilities` - Get STT capabilities
- `GET /api/language/web-speech/config` - Get Web Speech API configuration

## Installation

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Development**
   ```bash
   npm run dev
   ```

4. **Production Build**
   ```bash
   npm run build
   npm start
   ```

## Environment Variables

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Translation API Configuration
LIBRETRANSLATE_URL=https://libretranslate.de
LIBRETRANSLATE_API_KEY=

# Google Translate API (optional)
GOOGLE_TRANSLATE_API_KEY=

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

## Usage Examples

### Translate Text
```bash
curl -X POST http://localhost:3001/api/language/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, how are you?",
    "sourceLanguage": "en",
    "targetLanguage": "hi"
  }'
```

### Detect Language
```bash
curl -X POST http://localhost:3001/api/language/detect \
  -H "Content-Type: application/json" \
  -d '{
    "text": "नमस्ते, आप कैसे हैं?"
  }'
```

### Generate TTS Instructions
```bash
curl -X POST http://localhost:3001/api/language/tts \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Welcome to RakshaSetu",
    "language": "hi",
    "speed": 1.0,
    "pitch": 1.0
  }'
```

## Supported Languages

| Code | Language | Native Name |
|------|----------|-------------|
| en   | English  | English     |
| hi   | Hindi    | हिन्दी      |
| as   | Assamese | অসমীয়া     |
| bn   | Bengali  | বাংলা       |
| mni  | Manipuri | মণিপুরী     |
| kha  | Khasi    | খাসি        |
| nsm  | Nagamese | নাগামিজ     |
| brx  | Bodo     | बड़ो        |
| ta   | Tamil    | தமிழ்       |
| te   | Telugu   | తెలుగు      |
| mr   | Marathi  | मराठी       |
| gu   | Gujarati | ગુજરાતી     |

## Architecture

```
src/
├── index.ts              # Main server file
├── routes/               # API route handlers
│   ├── healthRoutes.ts   # Health check endpoints
│   └── languageRoutes.ts # Language service endpoints
├── services/             # Business logic services
│   ├── translationService.ts # Translation logic
│   ├── ttsService.ts     # Text-to-speech logic
│   └── sttService.ts     # Speech-to-text logic
├── middleware/           # Express middleware
│   ├── errorHandler.ts   # Error handling
│   └── notFoundHandler.ts # 404 handling
└── utils/                # Utility functions
    └── logger.ts         # Logging configuration
```

## Security Features

- **Helmet.js**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Request throttling
- **Input Validation**: Request validation
- **Error Handling**: Secure error responses

## Logging

The API uses Winston for structured logging with:
- Console output for development
- File logging for production
- Error-specific log files
- Request/response logging

## Future Enhancements

- [ ] Database integration for translation caching
- [ ] External TTS service integration (Google Cloud, Azure)
- [ ] External STT service integration
- [ ] Translation quality scoring
- [ ] Custom voice training
- [ ] Offline translation support
- [ ] Real-time translation streaming

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
