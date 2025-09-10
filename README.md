# RakshaSetu Companion App

A comprehensive digital safety companion for tourists and travelers in India, featuring multilingual support, real-time safety monitoring, and emergency response capabilities.

## 🌟 Features

### 🛡️ Core Safety Features
- **Real-time Safety Monitoring**: Live alerts and incident tracking
- **Interactive Safety Map**: GPS-based zone management and tourist tracking
- **Emergency SOS**: One-tap emergency response system
- **Digital ID System**: Secure tourist identification and verification
- **E-FIR Management**: Digital First Information Report system for police

### 🌐 Multilingual Support (12 Languages)
- **English** - English
- **Hindi** - हिन्दी
- **Assamese** - অসমীয়া
- **Bengali** - বাংলা
- **Manipuri** - মণিপুরী
- **Khasi** - খাসি
- **Nagamese** - নাগামিজ
- **Bodo** - बड़ो
- **Tamil** - தமிழ்
- **Telugu** - తెలుగు
- **Marathi** - मराठी
- **Gujarati** - ગુજરાતી

### 🎯 Language Features
- **Real-time Translation**: Translate text between all supported languages
- **Text-to-Speech**: Convert text to speech in native voices
- **Speech-to-Text**: Voice input recognition in multiple languages
- **Language Detection**: Automatic language identification
- **Batch Translation**: Translate multiple texts simultaneously

### 👥 User Roles
- **Tourist**: Safety information, trip management, emergency features
- **Police Officer**: Incident management, tourist tracking, E-FIR processing
- **Tourism Department**: Analytics, zone management, tourist insights
- **System Admin**: User management, system monitoring, configuration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern web browser with microphone access (for voice features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd raksha-setu-companion-001-72
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Start development servers**
   ```bash
   npm run dev:full
   ```

   This will start both frontend (http://localhost:5173) and backend (http://localhost:3001) servers.

### Alternative Setup

**Frontend only:**
```bash
npm install
npm run dev
```

**Backend only:**
```bash
cd backend
npm install
npm run dev
```

## 📁 Project Structure

```
raksha-setu-companion-001-72/
├── src/                          # Frontend React application
│   ├── components/               # React components
│   │   ├── auth/                # Authentication components
│   │   ├── dashboard/           # Dashboard components
│   │   ├── language/            # Language feature components
│   │   ├── map/                 # Map components
│   │   ├── tourist/             # Tourist-specific components
│   │   └── ui/                  # Reusable UI components
│   ├── context/                 # React context providers
│   ├── hooks/                   # Custom React hooks
│   ├── i18n/                    # Internationalization files
│   ├── pages/                   # Page components
│   ├── services/                # API services
│   └── types/                   # TypeScript type definitions
├── backend/                     # Node.js/Express backend
│   ├── src/
│   │   ├── routes/              # API route handlers
│   │   ├── services/            # Business logic services
│   │   ├── middleware/          # Express middleware
│   │   └── utils/               # Utility functions
│   └── package.json
├── public/                      # Static assets
└── package.json                 # Frontend dependencies
```

## 🔧 API Endpoints

### Health Check
- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Detailed system information

### Language Services
- `GET /api/language/supported` - Get supported languages
- `POST /api/language/translate` - Translate text
- `POST /api/language/translate/batch` - Batch translate
- `POST /api/language/detect` - Detect language
- `POST /api/language/tts` - Text-to-speech
- `POST /api/language/stt` - Speech-to-text
- `GET /api/language/web-speech/config` - Web Speech API config

## 🎨 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **React Router** for navigation
- **i18next** for internationalization
- **Zustand** for state management
- **React Query** for data fetching

### Backend
- **Node.js** with TypeScript
- **Express.js** web framework
- **CORS** for cross-origin requests
- **Helmet** for security headers
- **Winston** for logging
- **Axios** for HTTP requests

### Language Services
- **LibreTranslate** for free translation
- **Web Speech API** for TTS/STT
- **i18next** for frontend localization

## 🌍 Environment Configuration

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

### Backend (.env)
```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
LIBRETRANSLATE_URL=https://libretranslate.de
LOG_LEVEL=info
```

## 🚀 Deployment

### Frontend
```bash
npm run build
# Deploy dist/ folder to your hosting service
```

### Backend
```bash
cd backend
npm run build
npm start
# Deploy to your server
```

## 🧪 Testing

### Frontend Testing
```bash
npm run lint
```

### Backend Testing
```bash
cd backend
npm test
```

## 📱 Usage Examples

### Translation API
```javascript
import { languageApi } from '@/services/languageApi';

// Translate text
const result = await languageApi.translateText({
  text: "Hello, how are you?",
  sourceLanguage: "en",
  targetLanguage: "hi"
});
console.log(result.translatedText); // "नमस्ते, आप कैसे हैं?"
```

### React Hook Usage
```javascript
import { useLanguageApi } from '@/hooks/useLanguageApi';

function MyComponent() {
  const { translateText, speakText, startListening } = useLanguageApi();
  
  const handleTranslate = async () => {
    const result = await translateText({
      text: "Welcome to India",
      sourceLanguage: "en",
      targetLanguage: "hi"
    });
    await speakText(result.translatedText, "hi");
  };
}
```

## 🔒 Security Features

- **CORS Protection**: Configured for specific origins
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: All inputs are validated
- **Error Handling**: Secure error responses
- **Helmet.js**: Security headers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **LibreTranslate** for free translation services
- **Radix UI** for accessible component primitives
- **Tailwind CSS** for utility-first styling
- **React Community** for excellent documentation and tools

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Roadmap

- [ ] Mobile app development (React Native)
- [ ] Offline translation support
- [ ] Advanced analytics dashboard
- [ ] Integration with emergency services
- [ ] AI-powered safety recommendations
- [ ] Multi-platform deployment
- [ ] Advanced voice recognition
- [ ] Real-time collaboration features

---

**RakshaSetu** - Your digital companion for safe travel in India 🇮🇳