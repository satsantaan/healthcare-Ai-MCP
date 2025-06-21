# 🏥 AI-Powered MCP Server for Healthcare

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![HIPAA](https://img.shields.io/badge/HIPAA-Compliant-blue.svg)](https://www.hhs.gov/hipaa/)
[![Local AI](https://img.shields.io/badge/Local%20AI-Supported-purple.svg)](https://ollama.ai/)

A comprehensive AI-powered Model Context Protocol (MCP) server designed specifically for healthcare organizations, providing secure, HIPAA-compliant AI processing for Electronic Medical Records (EMR) and Hospital Information Systems (HIS) with both cloud-based and local AI model support for complete data sovereignty.

## 🚀 Features

### Core Capabilities
- **MCP Architecture Integration**: Seamless connection between EMR systems and specialized AI servers
- **Multi-Model AI Support**: Integration with local models, cloud APIs (OpenAI, Anthropic, Google), and federated learning systems
- **Real-time Monitoring**: Comprehensive dashboards for system health, performance metrics, and usage analytics
- **HIPAA Compliance**: Built-in privacy controls, data anonymization, and audit logging
- **Revenue Tracking**: Detailed billing and usage analytics for B2B monetization

### AI Modules
- **Clinical Documentation**: AI-powered clinical note generation and medical documentation
- **Billing & Coding**: Automated ICD-10 and CPT code extraction and validation
- **Summary Generation**: Patient history summarization and care plan creation
- **Medical Imaging**: AI-assisted image analysis (configurable)

### Integration Features
- **HL7/FHIR Compliance**: Full support for healthcare data standards
- **Multi-EMR Support**: Connect multiple EMR systems simultaneously
- **API Management**: Centralized API key management for various AI providers
- **Auto-scaling**: Containerized deployment with Kubernetes support

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: Radix UI + Tailwind CSS + shadcn/ui
- **State Management**: React Hooks + Context API
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **Date Handling**: date-fns
- **Development**: Tempo DevTools for enhanced development experience

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Modern web browser with ES2020+ support
- Git for version control

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/emr-ai-enhancement-system.git
cd emr-ai-enhancement-system
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Development Environment
VITE_TEMPO=true

# API Configuration (Optional - for production)
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
VITE_GOOGLE_API_KEY=your_google_api_key_here

# EMR Integration (Optional)
VITE_HL7_ENDPOINT=your_hl7_endpoint
VITE_FHIR_ENDPOINT=your_fhir_endpoint

# Security (Production)
VITE_ENCRYPTION_KEY=your_encryption_key
VITE_AUDIT_WEBHOOK=your_audit_webhook_url
```

### 4. Start Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components (shadcn/ui)
│   ├── AIAssistancePanel.tsx  # AI assistance sidebar
│   ├── EMRWorkspace.tsx       # Main EMR integration workspace
│   ├── MCPStatusDashboard.tsx # MCP system monitoring
│   └── home.tsx              # Main dashboard component
├── lib/
│   └── utils.ts              # Utility functions
├── types/
│   └── supabase.ts           # Type definitions
├── stories/                  # Component stories for development
├── tempobook/               # Tempo development storyboards
├── App.tsx                  # Main application component
├── main.tsx                 # Application entry point
└── index.css               # Global styles
```

## 🔧 Configuration

### API Key Management

The system supports multiple AI providers:

1. **OpenAI GPT-4**: For advanced clinical documentation
2. **Anthropic Claude**: For medical analysis and coding
3. **Google Gemini**: For multi-modal medical data processing
4. **Local Models**: Support for self-hosted models (Llama, Med-Llama)

### EMR System Integration

Supported EMR systems:
- MedFlow EMR
- HealthTech Pro
- ClinicalSoft
- DocuMed
- CarePlus EMR

### MCP Functions

Available MCP functions:
- `generate_clinical_note`
- `extract_icd_codes`
- `summarize_patient_history`
- `analyze_lab_results`
- `generate_discharge_summary`
- `validate_medication_dosage`

## 🚀 Deployment

### Deploy to Vercel

1. **One-Click Deploy**:
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/emr-ai-enhancement-system)

2. **Manual Deploy**:
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Environment Variables in Vercel**:
   - Go to your Vercel dashboard
   - Navigate to Settings → Environment Variables
   - Add your production environment variables

### Deploy to Netlify

1. **One-Click Deploy**:
   [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/emr-ai-enhancement-system)

2. **Manual Deploy**:
   ```bash
   npm run build
   npx netlify-cli deploy --prod --dir=dist
   ```

3. **Netlify Configuration** (`netlify.toml`):
   ```toml
   [build]
     publish = "dist"
     command = "npm run build"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

### Docker Deployment

```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔒 Security & Compliance

### HIPAA Compliance Features
- **Data Anonymization**: Automatic PII removal before AI processing
- **Audit Logging**: Comprehensive tracking of all system interactions
- **Access Control**: Role-based permissions and session management
- **Encryption**: End-to-end encryption for data in transit and at rest

### Security Best Practices
- API keys stored securely in environment variables
- HTTPS enforcement in production
- Content Security Policy (CSP) headers
- Regular security audits and dependency updates

## 📊 Monitoring & Analytics

### System Metrics
- **Performance**: Response times, throughput, error rates
- **Usage**: API calls, active sessions, function executions
- **Revenue**: Billing analytics, cost optimization, client usage
- **Health**: System uptime, resource utilization, alerts

### Available Dashboards
1. **EMR Workspace**: Main integration interface
2. **MCP Status**: System architecture monitoring
3. **Model Dashboard**: AI model performance and costs
4. **Function Analytics**: MCP function usage and optimization
5. **Audit & Billing**: Revenue tracking and compliance reporting
6. **System Settings**: Configuration and API management

## 🧪 Development & Testing

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Type Checking
npm run build        # Includes TypeScript compilation

# Testing (when implemented)
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests
npm run test:coverage # Generate coverage report
```

### Quality Assurance Checklist

Before deploying, ensure:

- [ ] All components render without errors
- [ ] AI assistance panel shows suggestions
- [ ] MCP status dashboard updates in real-time
- [ ] EMR workspace connects to mock systems
- [ ] All tabs and navigation work correctly
- [ ] Responsive design works on mobile/tablet
- [ ] Build process completes without errors
- [ ] Environment variables are properly configured
- [ ] Security headers are implemented
- [ ] Performance metrics meet requirements (Lighthouse score 90+)

### Testing Components

1. **Home Dashboard**: Test all 6 tabs and their functionality
2. **EMR Workspace**: Verify system connection and data updates
3. **AI Assistance**: Check suggestion generation and interactions
4. **MCP Status**: Confirm real-time monitoring displays
5. **API Management**: Test modal and configuration flows
6. **Responsive Design**: Verify mobile and tablet layouts

### Component Development

The project uses Tempo DevTools for enhanced component development:

1. **Storyboards**: Visual component development and testing
2. **Hot Reload**: Instant updates during development
3. **Component Isolation**: Test components in isolation
4. **Design System**: Consistent UI component library

### Adding New AI Models

1. Update the model configuration in `src/components/home.tsx`
2. Add API integration logic
3. Update the settings panel for new provider
4. Test integration with MCP functions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use semantic commit messages
- Add tests for new features
- Update documentation as needed
- Ensure HIPAA compliance for healthcare features

## 📝 API Documentation

### MCP Function Endpoints

```typescript
// Clinical Documentation
POST /api/mcp/generate_clinical_note
{
  "patientData": "...",
  "template": "progress_note",
  "aiModel": "gpt-4"
}

// Billing & Coding
POST /api/mcp/extract_icd_codes
{
  "clinicalText": "...",
  "codeVersion": "ICD-10"
}

// Summary Generation
POST /api/mcp/summarize_patient_history
{
  "patientId": "...",
  "timeRange": "30d"
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**: Ensure Node.js 18+ and clean `node_modules`
2. **API Connection**: Verify environment variables and API keys
3. **CORS Issues**: Configure proper CORS settings for your domain
4. **Performance**: Check network requests and optimize bundle size

### Support

- 📧 Email: support@emr-ai-system.com
- 💬 Discord: [Join our community](https://discord.gg/emr-ai)
- 📖 Documentation: [Full docs](https://docs.emr-ai-system.com)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/emr-ai-enhancement-system/issues)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Radix UI](https://www.radix-ui.com/) for accessible UI components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [shadcn/ui](https://ui.shadcn.com/) for beautiful component library
- [Tempo DevTools](https://tempo.new/) for enhanced development experience
- Healthcare community for feedback and requirements

---

**Built with ❤️ for Healthcare Innovation**

*Empowering healthcare providers with AI-driven EMR enhancements while maintaining the highest standards of privacy and compliance.*
