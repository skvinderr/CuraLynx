# CuraLynx

> Redefining clinical documentation with AI precision and empathy

CuraLynx is an AI-powered clinical documentation assistant that transforms doctor-patient conversations into structured medical notes, recommendations, and prescriptions in real-time.

## 🎯 What it Does

- **Live Transcription**: Captures natural doctor-patient conversations with speaker identification
- **AI Recommendations**: Suggests medications and diagnostic tests based on conversation context
- **Smart Documentation**: Generates structured clinical notes and prescriptions
- **Workflow Automation**: Automates clinical workflows with intelligent task management
- **Multi-language Support**: Built for Indian healthcare with English, Hindi, and code-mixed conversations


## 🌟 Key Features

### Real-time Intelligence
- Passive listening during consultations
- Automatic speaker detection (doctor vs patient)
- Context-aware medical terminology understanding
- Live medication and test recommendations

### Clinical Workflow
- Interactive patient dashboard
- Session management with appointment tracking
- Prescription generation with dosage recommendations
- Report generation and history tracking
- Autonomous workflow execution

### Privacy & Security
- Privacy-first architecture
- Local data processing options
- Secure patient information handling
- HIPAA-compliant design principles

## 🏗️ Architecture

```
CuraLynx/
├── client/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Route pages
│   │   ├── hooks/         # Custom hooks (speech recognition, etc.)
│   │   ├── contexts/      # React contexts for state management
│   │   └── services/      # API services and AI agents
├── server/                # Node.js backend
└── model/                 # AI model training and fine-tuning
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern browser with Web Speech API support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/skvinderr/CuraLynx.git
   cd CuraLynx
   ```

2. **Setup Frontend**
   ```bash
   cd client
   npm install
   npm run dev
   ```

3. **Setup Backend** (Optional)
   ```bash
   cd server
   npm install
   npm start
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Environment Setup

Create a `.env` file in the `client` directory:
```env
# Gemini API Key (for AI recommendations)
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## 📖 Usage

### For Healthcare Providers

1. **Start a Session**: Navigate to the dashboard and click "Start Session" for a patient
2. **Begin Conversation**: Speak naturally - CuraLynx listens passively in the background
3. **Review Recommendations**: AI-generated medication and test suggestions appear automatically
4. **Generate Prescription**: Use the built-in prescription builder with pre-filled recommendations
5. **Export Documentation**: Save or share structured clinical notes

### Demo Flow

1. Visit the landing page at `/`
2. Click "View live demo" to see the session interface
3. Start speaking (act as doctor or patient)
4. Watch real-time transcription and AI recommendations
5. Generate and review prescriptions

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons
- **Web Speech API** for voice recognition

### Backend
- **Node.js** with Express
- **WebSocket** for real-time communication

### AI & ML
- **Google Gemini API** for clinical recommendations
- **Custom Speech Recognition** tuned for medical conversations
- **Proactive Agent System** for workflow automation

### Key Libraries
- `react-joyride` - Interactive user tours
- `recharts` - Data visualization
- `react-simple-maps` - Geographic data display

## 🎨 Features Showcase

### Interactive Dashboard
- Patient management with real-time status
- Appointment scheduling and tracking
- Clinical metrics visualization
- Geographic patient distribution

### Smart Session Management
- Live transcription with speaker identification
- Real-time AI recommendations
- Prescription builder with dosage suggestions
- Historical session data

### User Experience
- Interactive onboarding tours
- Responsive design for all devices
- Accessible UI components
- Smooth animations and transitions

```

### Project Structure

```
client/src/
├── components/
│   ├── dashboard/           # Dashboard components
│   ├── todays-session/     # Session management
│   ├── ui/                 # Reusable UI components
│   └── icons/              # Custom icons
├── pages/                  # Route components
├── hooks/                  # Custom React hooks
├── contexts/               # React Context providers
├── services/               # API and AI services
├── types/                  # TypeScript type definitions
└── utils/                  # Utility functions
```

## 🎯 Use Cases

### Primary Healthcare
- **General Practitioners**: Streamline routine consultations
- **Specialists**: Focus on complex diagnoses while AI handles documentation
- **Clinics**: Improve efficiency across multiple practitioners

### Medical Education
- **Training**: Help medical students learn proper documentation
- **Simulation**: Practice with AI-generated scenarios
- **Assessment**: Evaluate clinical reasoning skills

### Telemedicine
- **Remote Consultations**: Document virtual appointments effectively
- **Follow-ups**: Maintain continuity of care documentation
- **Multi-language Support**: Serve diverse patient populations

## 🛡️ Privacy & Compliance

- **Data Minimization**: Only processes necessary clinical information
- **Local Processing**: Core transcription can run locally
- **Audit Trails**: Comprehensive logging for compliance
- **Access Controls**: Role-based permissions and authentication
- **Encryption**: End-to-end encryption for sensitive data

## 🚧 Roadmap

### Phase 1 (Current)
- ✅ Real-time transcription and AI recommendations
- ✅ Basic prescription generation
- ✅ Interactive dashboard and session management

### Phase 2 (Next)
- 🔄 EMR/EHR integration
- 🔄 Advanced workflow automation
- 🔄 Multi-provider collaboration features

### Phase 3 (Future)
- 📋 Regulatory compliance certification
- 📋 Mobile application
- 📋 Advanced analytics and insights

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for Indian healthcare systems and multilingual clinical conversations
- Designed with input from practicing healthcare professionals
- Powered by state-of-the-art AI and speech recognition technologies
---

**Team BODMAS** | *Transforming Healthcare Documentation*
