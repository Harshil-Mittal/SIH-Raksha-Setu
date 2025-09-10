# 🛡️ RakshaSetu Companion

**Your Digital Companion for Safe Journeys**

A unified safety portal for tourists, police, and tourism authorities featuring real-time safety monitoring, blockchain-based digital ID management, and comprehensive multi-language support.

## ✨ Features

### 🔐 **Blockchain & Digital Identity**
- **Real Blockchain Implementation**: Custom Proof-of-Work blockchain for digital ID management
- **Digital Wallet Generation**: Secure wallet creation with mnemonic phrases
- **QR Code Integration**: Generate QR codes for digital IDs
- **MongoDB Persistence**: Data storage with in-memory fallback

### 🌐 **Multi-Language Support**
- **12+ Indian Languages**: English, Hindi, Assamese, Bengali, Manipuri, Khasi, Nagamese, Bodo, Tamil, Telugu, Marathi, Gujarati
- **Real-time Translation**: Dynamic language switching across the entire application
- **Localized UI**: All components support multiple languages

### 👥 **Role-Based Access**
- **Tourist Dashboard**: Digital ID management, trip planning, emergency contacts
- **Police Dashboard**: Real-time monitoring, analytics, zone management
- **Tourism Authority**: Comprehensive oversight and reporting tools

### 🚨 **Safety Features**
- **Real-time Alerts**: Live safety notifications and emergency response
- **Zone Management**: Smart tourist zone monitoring and management
- **Emergency Contacts**: Quick access to emergency services
- **Safety Analytics**: Data-driven insights and reporting

### 🎨 **Modern UI/UX**
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark/Light Mode**: Toggle between themes
- **Custom Branding**: Professional RakshaSetu identity
- **Intuitive Navigation**: User-friendly interface design

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/raksha-setu-companion.git
   cd raksha-setu-companion
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Setup**
   ```bash
   # Copy environment files
   cp blockchain/.env.example blockchain/.env
   cp backend/.env.example backend/.env
   
   # Update MongoDB connection string in blockchain/.env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/raksha-setu
   ```

4. **Start the application**
   ```bash
   # Start all services
   npm run dev:full
   
   # Or start individually
   npm run dev:frontend    # Frontend (port 8080)
   npm run dev:backend     # Backend API (port 3001)
   npm run dev:blockchain  # Blockchain API (port 3002)
   ```

## 🏗️ Architecture

```
raksha-setu-companion/
├── src/                    # Frontend React application
│   ├── components/         # UI components
│   ├── context/           # React contexts
│   ├── hooks/             # Custom hooks
│   ├── i18n/              # Internationalization
│   ├── services/          # API services
│   └── types/             # TypeScript types
├── blockchain/            # Blockchain API service
│   ├── src/
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Blockchain services
│   │   └── config/        # Configuration
│   └── package.json
├── backend/               # Additional backend services
└── public/                # Static assets
```

## 🔧 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Full Stack
- `npm run dev:full` - Start all services
- `npm run build:full` - Build all services
- `npm run install:all` - Install all dependencies

### Blockchain
- `npm run dev:blockchain` - Start blockchain API
- `npm run build:blockchain` - Build blockchain service

## 🌍 Internationalization

The application supports 12+ Indian languages with real-time switching:

- **English** (en)
- **Hindi** (hi) - हिन्दी
- **Assamese** (as) - অসমীয়া
- **Bengali** (bn) - বাংলা
- **Manipuri** (mni) - মণিপুরী
- **Khasi** (kha) - খাসি
- **Nagamese** (nsm) - নাগামিজ
- **Bodo** (brx) - बड़ो
- **Tamil** (ta) - தமிழ்
- **Telugu** (te) - తెలుగు
- **Marathi** (mr) - मराठी
- **Gujarati** (gu) - ગુજરાતી

## 🔐 Authentication

- **JWT-based Authentication**: Secure token-based auth
- **Role-based Access Control**: Different dashboards for different user types
- **Session Management**: Persistent login sessions
- **Password Security**: Bcrypt hashing for passwords

## 🗄️ Database

- **MongoDB Atlas**: Cloud database for production
- **In-memory Fallback**: Local storage when MongoDB is unavailable
- **Data Models**: Users, Digital IDs, Sessions
- **Connection Management**: Automatic fallback and reconnection

## 🛡️ Security Features

- **CORS Protection**: Configured for secure cross-origin requests
- **Rate Limiting**: API rate limiting for security
- **Input Validation**: Joi schema validation
- **Error Handling**: Comprehensive error management
- **Logging**: Winston-based logging system

## 📱 Mobile Support

- **Responsive Design**: Works on all device sizes
- **Touch-friendly**: Optimized for mobile interactions
- **Progressive Web App**: PWA capabilities
- **Offline Support**: Basic offline functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with React, TypeScript, and Vite
- UI components from Shadcn/UI
- Blockchain implementation using Ethers.js
- Database management with MongoDB and Mongoose
- Internationalization with i18next

## 📞 Support

For support, email support@rakshasetu.com or create an issue in this repository.

---

**RakshaSetu** - Ensuring safe journeys for all travelers across India 🇮🇳