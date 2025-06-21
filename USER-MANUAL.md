# 📖 AI-Powered MCP Server - User Manual

## 🎯 **Table of Contents**

1. [Getting Started](#-getting-started)
2. [System Overview](#-system-overview)
3. [Installation Guide](#-installation-guide)
4. [Configuration](#-configuration)
5. [Using the System](#-using-the-system)
6. [AI Model Management](#-ai-model-management)
7. [EMR Integration](#-emr-integration)
8. [Security & Compliance](#-security--compliance)
9. [Troubleshooting](#-troubleshooting)
10. [Advanced Features](#-advanced-features)

---

## 🚀 **Getting Started**

### **What is the AI-Powered MCP Server?**

The AI-Powered MCP Server is a comprehensive healthcare AI platform that bridges Electronic Medical Records (EMR) systems with artificial intelligence capabilities. It provides:

- **Secure AI Processing** for clinical documentation, medical coding, and patient data analysis
- **HIPAA Compliance** with complete data sovereignty options
- **Local and Cloud AI Models** for flexibility and cost optimization
- **EMR Integration** with major healthcare systems
- **Air-Gapped Deployment** for maximum security environments

### **Who Should Use This System?**

- **Healthcare Organizations** requiring AI-powered clinical assistance
- **EMR Vendors** looking to integrate AI capabilities
- **Healthcare IT Departments** managing AI deployments
- **Compliance Officers** ensuring HIPAA adherence
- **Healthcare Administrators** optimizing operational costs

### **System Requirements**

#### **Minimum Requirements:**
- **CPU**: 4 cores, 2.5GHz+
- **RAM**: 16GB
- **Storage**: 100GB SSD
- **OS**: Linux, macOS, or Windows
- **Network**: 1Gbps LAN

#### **Recommended Requirements:**
- **CPU**: 8+ cores, 3.0GHz+
- **RAM**: 32GB+
- **Storage**: 500GB+ NVMe SSD
- **GPU**: NVIDIA RTX 4060+ (for local models)
- **Network**: 10Gbps LAN

---

## 🏗️ **System Overview**

### **Architecture Components**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Frontend  │    │  EMR Systems    │    │  AI Providers   │
│   Dashboard     │    │  (HL7/FHIR)     │    │  (Cloud/Local)  │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────┴───────────┐
                    │   MCP Server Core       │
                    │   - Authentication      │
                    │   - API Gateway         │
                    │   - Data Processing     │
                    │   - Security Layer      │
                    └─────────────┬───────────┘
                                 │
                    ┌─────────────┴───────────┐
                    │   Storage Layer         │
                    │   - Patient Data        │
                    │   - Audit Logs          │
                    │   - Model Configs       │
                    └─────────────────────────┘
```

### **Key Features**

#### **AI Processing Capabilities:**
- **Clinical Documentation**: Generate SOAP notes, discharge summaries, and clinical reports
- **Medical Coding**: Extract ICD-10 and CPT codes from clinical text
- **Drug Interaction Analysis**: Check medication interactions and contraindications
- **Medical Image Analysis**: Analyze X-rays, CT scans, and other medical images
- **Patient Summarization**: Create comprehensive patient history summaries

#### **Security & Compliance:**
- **HIPAA Compliance**: End-to-end encryption and audit logging
- **Data Sovereignty**: Local processing options for sensitive data
- **Access Controls**: Role-based permissions and authentication
- **Audit Trails**: Complete logging of all data access and processing

#### **Integration Options:**
- **Cloud AI Providers**: OpenAI, Anthropic, Google Gemini
- **Local AI Models**: Ollama-based healthcare models
- **EMR Systems**: HL7/FHIR compatible systems
- **Custom APIs**: Flexible integration options

---

## 📦 **Installation Guide**

### **Step 1: System Preparation**

#### **Install Prerequisites:**
```bash
# Install Node.js 18+ LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Git
sudo apt-get install -y git

# Install build tools
sudo apt-get install -y build-essential
```

#### **For Local AI Models (Optional):**
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Start Ollama service
ollama serve
```

### **Step 2: Download and Install**

```bash
# Clone the repository
git clone https://github.com/your-org/ai-mcp-healthcare-server.git
cd ai-mcp-healthcare-server

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env
```

### **Step 3: Configuration**

Edit the `.env` file with your specific settings:

```bash
# Basic Configuration
NODE_ENV=production
PORT=3001
FRONTEND_URL=http://localhost:5173

# Security (REQUIRED - Generate secure values)
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters
ENCRYPTION_KEY=your-64-character-hex-encryption-key-for-hipaa-compliance

# Database
DATABASE_URL=./data/mcp_server.db

# HIPAA Compliance
HIPAA_MODE=true
AUDIT_WEBHOOK=https://your-audit-webhook.com

# AI Providers (Optional - Add as needed)
OPENAI_API_KEY=sk-your-openai-api-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key
GOOGLE_API_KEY=your-google-api-key

# Local Models (If using Ollama)
OLLAMA_URL=http://localhost:11434
LOCAL_MODELS_ENABLED=true

# Budget Controls
DAILY_BUDGET=500
WEEKLY_BUDGET=2500
MONTHLY_BUDGET=10000
```

### **Step 4: Start the System**

```bash
# Start the MCP server
npm run server

# In another terminal, start the frontend (optional)
npm run dev

# Verify installation
curl http://localhost:3001/api/health
```

### **Step 5: Initial Setup**

1. **Access the system**: Open http://localhost:3001/api/health
2. **Login**: Use default credentials (admin/admin123456)
3. **Change password**: Update default credentials immediately
4. **Configure AI providers**: Add API keys or install local models
5. **Test functionality**: Run the test suite

---

## ⚙️ **Configuration**

### **Environment Variables Reference**

#### **Server Configuration**
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | development | No |
| `PORT` | Server port | 3001 | No |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5173 | No |

#### **Security Configuration**
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `JWT_SECRET` | JWT signing secret | - | **Yes** |
| `ENCRYPTION_KEY` | Data encryption key | - | **Yes** |
| `HIPAA_MODE` | Enable HIPAA features | false | No |
| `AUDIT_WEBHOOK` | Audit log webhook URL | - | No |

#### **AI Provider Configuration**
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `OPENAI_API_KEY` | OpenAI API key | - | No |
| `ANTHROPIC_API_KEY` | Anthropic API key | - | No |
| `GOOGLE_API_KEY` | Google API key | - | No |
| `OLLAMA_URL` | Ollama server URL | http://localhost:11434 | No |
| `LOCAL_MODELS_ENABLED` | Enable local models | false | No |

#### **Budget Configuration**
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DAILY_BUDGET` | Daily spending limit | 100 | No |
| `WEEKLY_BUDGET` | Weekly spending limit | 500 | No |
| `MONTHLY_BUDGET` | Monthly spending limit | 2000 | No |

### **Security Configuration**

#### **Generating Secure Keys:**
```bash
# Generate JWT secret (32+ characters)
openssl rand -base64 32

# Generate encryption key (64 hex characters)
openssl rand -hex 32
```

#### **HIPAA Mode Configuration:**
When `HIPAA_MODE=true`, the system enables:
- Enhanced audit logging
- Data encryption at rest
- Stricter access controls
- Automatic data anonymization
- Compliance reporting

---

## 🖥️ **Using the System**

### **Web Interface**

#### **Accessing the Dashboard:**
1. Open your browser to `http://localhost:5173` (frontend)
2. Login with your credentials
3. Navigate through the dashboard sections

#### **Dashboard Sections:**
- **Overview**: System status and key metrics
- **AI Models**: Manage cloud and local AI models
- **EMR Systems**: Configure EMR integrations
- **Processing**: Monitor AI processing tasks
- **Security**: Access controls and audit logs
- **Settings**: System configuration

### **API Usage**

#### **Authentication:**
```bash
# Login to get access token
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your-password"}'

# Use token in subsequent requests
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/health
```

#### **Common API Operations:**

##### **Generate Clinical Documentation:**
```bash
curl -X POST http://localhost:3001/api/mcp/execute \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "functionName": "generate_clinical_note",
    "parameters": {
      "patientData": {
        "complaint": "Chest pain and shortness of breath",
        "vitals": {"bp": "150/95", "hr": "88", "temp": "98.6"},
        "history": "Hypertension, Type 2 diabetes"
      }
    }
  }'
```

##### **Extract ICD-10 Codes:**
```bash
curl -X POST http://localhost:3001/api/mcp/execute \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "functionName": "extract_icd_codes",
    "parameters": {
      "clinicalText": "Patient diagnosed with essential hypertension and type 2 diabetes mellitus without complications"
    }
  }'
```

##### **Check Drug Interactions:**
```bash
curl -X POST http://localhost:3001/api/mcp/execute \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "functionName": "check_drug_interactions",
    "parameters": {
      "medications": ["Warfarin 5mg", "Metformin 1000mg", "Lisinopril 10mg"]
    }
  }'
```

### **System Monitoring**

#### **Health Checks:**
```bash
# Basic health check
curl http://localhost:3001/api/health

# Detailed system status
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/health/detailed

# Local model status
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/local/status
```

#### **Performance Monitoring:**
- **Response Times**: Monitor API response times
- **Throughput**: Track requests per minute
- **Error Rates**: Monitor system errors
- **Resource Usage**: CPU, memory, and storage utilization

---

## 🤖 **AI Model Management**

### **Cloud AI Providers**

#### **OpenAI Configuration:**
1. Obtain API key from OpenAI
2. Add to environment: `OPENAI_API_KEY=sk-your-key`
3. Restart the server
4. Verify: `curl -H "Authorization: Bearer TOKEN" http://localhost:3001/api/ai/providers`

#### **Anthropic Configuration:**
1. Obtain API key from Anthropic
2. Add to environment: `ANTHROPIC_API_KEY=sk-ant-your-key`
3. Restart the server
4. Test with Claude models

#### **Google Gemini Configuration:**
1. Obtain API key from Google Cloud
2. Add to environment: `GOOGLE_API_KEY=your-key`
3. Restart the server
4. Test with Gemini models

### **Local AI Models**

#### **Installing Ollama:**
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Start Ollama service
ollama serve

# Verify installation
ollama --version
```

#### **Installing Healthcare Models:**
```bash
# Install basic models
ollama pull mistral:7b
ollama pull llama2:7b
ollama pull codellama:7b

# Install vision model for medical imaging
ollama pull llava:7b

# Verify models
ollama list
```

#### **Using Local Models:**
```bash
# Check local model status
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/local/status

# List available models
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/local/models

# Process with local model
curl -X POST http://localhost:3001/api/local/process \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "modelName": "mistral:7b",
    "prompt": "Generate a SOAP note for a patient with chest pain",
    "type": "text"
  }'
```

### **Model Performance Optimization**

#### **GPU Acceleration:**
```bash
# Check GPU availability
nvidia-smi

# Configure GPU for Ollama
export CUDA_VISIBLE_DEVICES=0
ollama serve
```

#### **Memory Optimization:**
```bash
# Configure Ollama memory settings
export OLLAMA_MAX_LOADED_MODELS=2
export OLLAMA_NUM_PARALLEL=4
export OLLAMA_KEEP_ALIVE=30m
```

#### **Model Quantization:**
```bash
# Use quantized models for better performance
ollama pull mistral:7b-q4_0    # 4-bit quantization
ollama pull mistral:7b-q8_0    # 8-bit quantization
```

---

## 🏥 **EMR Integration**

### **Supported EMR Systems**

The system supports integration with major EMR systems through standardized protocols:

- **Epic**: HL7 FHIR R4 integration
- **Cerner**: HL7 v2.x and FHIR support
- **Allscripts**: Custom API integration
- **athenahealth**: RESTful API integration
- **OpenMRS**: Open-source EMR integration
- **OpenEMR**: Community EMR support

### **Integration Setup**

#### **HL7/FHIR Configuration:**
```bash
# Configure HL7 endpoint
export HL7_ENDPOINT=http://your-emr-system/hl7
export HL7_USERNAME=your-username
export HL7_PASSWORD=your-password

# Configure FHIR endpoint
export FHIR_ENDPOINT=http://your-emr-system/fhir/R4
export FHIR_CLIENT_ID=your-client-id
export FHIR_CLIENT_SECRET=your-client-secret
```

#### **Testing EMR Connection:**
```bash
# Test EMR connectivity
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/emr/systems

# Check EMR metrics
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/emr/metrics
```

### **Data Processing Workflows**

#### **Patient Data Processing:**
1. **Data Extraction**: Retrieve patient data from EMR
2. **Data Validation**: Ensure data integrity and format
3. **AI Processing**: Apply AI models for insights
4. **Result Integration**: Return processed data to EMR
5. **Audit Logging**: Log all operations for compliance

#### **Field-Level Processing:**
The system can process individual data fields for:
- **Clinical Notes**: AI-enhanced documentation
- **Diagnosis Codes**: Automated ICD-10 coding
- **Medication Lists**: Drug interaction checking
- **Lab Results**: Automated interpretation
- **Vital Signs**: Trend analysis and alerts

---

## 🔒 **Security & Compliance**

### **HIPAA Compliance Features**

#### **Data Protection:**
- **Encryption at Rest**: AES-256 encryption for stored data
- **Encryption in Transit**: TLS 1.3 for all communications
- **Data Minimization**: Process only necessary data
- **Data Anonymization**: Remove identifying information when possible

#### **Access Controls:**
- **Authentication**: JWT-based user authentication
- **Authorization**: Role-based access control (RBAC)
- **Session Management**: Secure session handling
- **Multi-Factor Authentication**: Optional MFA support

#### **Audit Logging:**
- **Complete Audit Trail**: Log all data access and modifications
- **Tamper-Proof Logs**: Cryptographically signed audit logs
- **Real-Time Monitoring**: Immediate alerts for suspicious activity
- **Compliance Reporting**: Automated HIPAA compliance reports

### **Security Configuration**

#### **Enable HIPAA Mode:**
```bash
# Set in .env file
HIPAA_MODE=true
AUDIT_WEBHOOK=https://your-audit-system.com/webhook
```

#### **Configure Audit Logging:**
```bash
# Enable comprehensive logging
LOG_LEVEL=info
AUDIT_LOG_RETENTION=7years
AUDIT_LOG_ENCRYPTION=true
```

#### **Network Security:**
```bash
# Configure firewall
sudo ufw allow 3001/tcp    # MCP Server
sudo ufw allow 11434/tcp   # Ollama (internal only)
sudo ufw deny 11434/tcp from any to any  # Block external access

# SSL/TLS configuration
# Use nginx reverse proxy with SSL certificates
```

### **User Management**

#### **User Roles:**
- **Admin**: Full system access and configuration
- **Provider**: Clinical AI functions and patient data access
- **Staff**: Limited access to specific functions
- **Auditor**: Read-only access to audit logs and reports

#### **Creating Users:**
```bash
# Create new user (via API)
curl -X POST http://localhost:3001/api/auth/users \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "dr.smith",
    "email": "dr.smith@hospital.com",
    "password": "secure-password",
    "role": "provider"
  }'
```

#### **Managing Permissions:**
```bash
# Update user role
curl -X PUT http://localhost:3001/api/auth/users/dr.smith \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}'

# Deactivate user
curl -X PUT http://localhost:3001/api/auth/users/dr.smith \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"active": false}'
```

---

## 🔧 **Troubleshooting**

### **Common Issues**

#### **Server Won't Start**
```bash
# Check port availability
netstat -tulpn | grep :3001

# Check Node.js version
node --version  # Should be 18+

# Check environment variables
cat .env | grep -E "(JWT_SECRET|ENCRYPTION_KEY)"

# Check logs
tail -f logs/server.log
```

#### **Authentication Issues**
```bash
# Verify JWT secret is set
echo $JWT_SECRET

# Check user credentials
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123456"}' -v

# Reset admin password (if needed)
npm run reset-admin-password
```

#### **AI Provider Connection Issues**
```bash
# Test OpenAI connection
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/models

# Test Anthropic connection
curl -H "x-api-key: $ANTHROPIC_API_KEY" \
  https://api.anthropic.com/v1/messages

# Check local model status
curl http://localhost:11434/api/tags
```

#### **Local Model Issues**
```bash
# Check Ollama service
systemctl status ollama

# Restart Ollama
sudo systemctl restart ollama

# Check available models
ollama list

# Test model directly
ollama run mistral:7b "Hello, how are you?"
```

#### **Performance Issues**
```bash
# Check system resources
htop
df -h
free -m

# Check GPU usage (if applicable)
nvidia-smi

# Monitor API response times
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3001/api/health
```

### **Log Analysis**

#### **Server Logs:**
```bash
# View server logs
tail -f logs/server.log

# View error logs
tail -f logs/error.log

# View audit logs (HIPAA mode)
tail -f logs/hipaa-audit.log
```

#### **Performance Logs:**
```bash
# View performance metrics
tail -f logs/performance.log

# Analyze response times
grep "response_time" logs/server.log | awk '{print $NF}' | sort -n
```

### **Getting Help**

#### **Documentation:**
- **API Documentation**: [API-DOCUMENTATION.md](./API-DOCUMENTATION.md)
- **Deployment Guide**: [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)
- **Local Models Guide**: [LOCAL-MODEL-DEPLOYMENT-GUIDE.md](./LOCAL-MODEL-DEPLOYMENT-GUIDE.md)

#### **Support Channels:**
- **Email**: support@mcpserver.com
- **Security Issues**: security@mcpserver.com
- **HIPAA Compliance**: compliance@mcpserver.com
- **GitHub Issues**: https://github.com/your-org/ai-mcp-healthcare-server/issues

#### **Community:**
- **Discussions**: GitHub Discussions
- **Documentation**: https://docs.mcpserver.com
- **Training**: https://training.mcpserver.com

---

## 🚀 **Advanced Features**

### **Custom AI Model Integration**

#### **Adding Custom Models:**
```javascript
// Add custom model configuration
const customModel = {
  name: 'custom-medical-model',
  provider: 'custom',
  endpoint: 'http://your-model-server/api',
  apiKey: 'your-api-key',
  capabilities: ['clinical_notes', 'diagnosis']
};

// Register model
await mcpServer.registerModel(customModel);
```

#### **Model Fallback Configuration:**
```javascript
// Configure fallback chain
const fallbackChain = [
  'local-mistral-7b',      // Try local model first
  'openai-gpt-4',          // Fallback to cloud if local fails
  'anthropic-claude-3'     // Final fallback
];

await mcpServer.configureFallback(fallbackChain);
```

### **Batch Processing**

#### **Bulk Document Processing:**
```bash
# Process multiple documents
curl -X POST http://localhost:3001/api/mcp/batch \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "functionName": "generate_clinical_note",
    "batch": [
      {"patientData": {"complaint": "Headache"}},
      {"patientData": {"complaint": "Back pain"}},
      {"patientData": {"complaint": "Fatigue"}}
    ]
  }'
```

### **Webhook Integration**

#### **Configure Webhooks:**
```bash
# Set webhook for processing completion
export PROCESSING_WEBHOOK=https://your-system.com/webhook

# Set webhook for audit events
export AUDIT_WEBHOOK=https://your-audit-system.com/webhook
```

### **API Rate Limiting**

#### **Configure Rate Limits:**
```bash
# Set rate limits in .env
API_RATE_LIMIT=100        # Requests per minute
API_BURST_LIMIT=20        # Burst requests
API_WINDOW_SIZE=60        # Window size in seconds
```

### **Custom Workflows**

#### **Define Custom Workflows:**
```javascript
// Define custom clinical workflow
const clinicalWorkflow = {
  name: 'comprehensive_assessment',
  steps: [
    'extract_chief_complaint',
    'generate_assessment',
    'suggest_treatment_plan',
    'extract_billing_codes'
  ],
  parallel: false,
  timeout: 300000  // 5 minutes
};

await mcpServer.registerWorkflow(clinicalWorkflow);
```

---

## 📞 **Support & Resources**

### **Getting Additional Help**

If you need assistance beyond this manual:

1. **Check the Documentation**: Review all provided documentation files
2. **Search Issues**: Check GitHub issues for similar problems
3. **Contact Support**: Reach out to our support team
4. **Professional Services**: Consider professional installation and training

### **Training & Certification**

- **Healthcare AI Deployment Certification**: 2-day intensive workshop
- **HIPAA Compliance for AI Systems**: 1-day compliance training
- **Local Model Administration Course**: 4-hour online training

### **Professional Services**

- **On-site Installation**: $2,500-5,000
- **Custom Model Training**: $10,000-25,000
- **24/7 Support Contract**: $5,000-15,000/year
- **HIPAA Compliance Audit**: $5,000-10,000

---

**🏥 This completes the comprehensive user manual. For the most up-to-date information, always refer to the latest documentation and release notes.**
