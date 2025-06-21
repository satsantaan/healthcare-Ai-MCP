// Local AI Model Service for Healthcare Organizations
// Provides on-premises AI capabilities for HIPAA compliance and data sovereignty

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');
const EventEmitter = require('events');

class LocalModelService extends EventEmitter {
  constructor() {
    super();
    this.ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
    this.modelsDir = path.join(__dirname, '../../data/models');
    this.configFile = path.join(this.modelsDir, 'model-config.json');
    this.isOllamaRunning = false;
    this.installedModels = new Map();
    this.activeModels = new Map();
    
    // Healthcare-specific model configurations
    this.healthcareModels = {
      'llama2-medical': {
        name: 'llama2-medical',
        displayName: 'Llama2 Medical 7B',
        size: '3.8GB',
        type: 'text',
        capabilities: ['clinical_notes', 'medical_qa', 'diagnosis_assistance'],
        quantization: 'q4_0',
        description: 'Medical-trained Llama2 model for clinical text processing',
        modelfile: this.generateMedicalModelfile('llama2:7b'),
        downloadUrl: 'llama2:7b' // Base model, will be fine-tuned
      },
      'mistral-medical': {
        name: 'mistral-medical',
        displayName: 'Mistral Medical 7B',
        size: '4.1GB',
        type: 'text',
        capabilities: ['clinical_documentation', 'icd_coding', 'drug_interactions'],
        quantization: 'q4_0',
        description: 'Mistral model optimized for medical coding and documentation',
        modelfile: this.generateMedicalModelfile('mistral:7b'),
        downloadUrl: 'mistral:7b'
      },
      'llava-medical': {
        name: 'llava-medical',
        displayName: 'LLaVA Medical Vision',
        size: '4.7GB',
        type: 'multimodal',
        capabilities: ['medical_imaging', 'xray_analysis', 'radiology_reports'],
        quantization: 'q4_0',
        description: 'Vision-language model for medical image analysis',
        modelfile: this.generateVisionModelfile('llava:7b'),
        downloadUrl: 'llava:7b'
      },
      'codellama-clinical': {
        name: 'codellama-clinical',
        displayName: 'CodeLlama Clinical',
        size: '3.8GB',
        type: 'text',
        capabilities: ['hl7_parsing', 'fhir_generation', 'clinical_coding'],
        quantization: 'q4_0',
        description: 'Code-specialized model for healthcare data standards',
        modelfile: this.generateClinicalCodeModelfile('codellama:7b'),
        downloadUrl: 'codellama:7b'
      }
    };
    
    this.initializeService();
  }

  async initializeService() {
    try {
      // Create models directory
      if (!fs.existsSync(this.modelsDir)) {
        fs.mkdirSync(this.modelsDir, { recursive: true });
      }
      
      // Load existing configuration
      await this.loadModelConfiguration();
      
      // Check Ollama status
      await this.checkOllamaStatus();
      
      // Load installed models
      await this.loadInstalledModels();
      
      console.log('✅ Local Model Service initialized');
      this.emit('initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Local Model Service:', error.message);
      this.emit('error', error);
    }
  }

  async checkOllamaStatus() {
    try {
      const response = await axios.get(`${this.ollamaUrl}/api/tags`, { timeout: 5000 });
      this.isOllamaRunning = true;
      console.log('✅ Ollama service is running');
      return true;
    } catch (error) {
      this.isOllamaRunning = false;
      console.log('⚠️  Ollama service not running. Install with: curl -fsSL https://ollama.ai/install.sh | sh');
      return false;
    }
  }

  async installOllama() {
    console.log('📦 Installing Ollama...');
    
    return new Promise((resolve, reject) => {
      const installCommand = process.platform === 'win32' 
        ? 'powershell -Command "& {Invoke-WebRequest -Uri https://ollama.ai/install.ps1 -OutFile install.ps1; .\\install.ps1}"'
        : 'curl -fsSL https://ollama.ai/install.sh | sh';
      
      exec(installCommand, (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Ollama installation failed:', error.message);
          reject(error);
        } else {
          console.log('✅ Ollama installed successfully');
          console.log(stdout);
          resolve(true);
        }
      });
    });
  }

  async startOllamaService() {
    if (this.isOllamaRunning) {
      console.log('✅ Ollama service already running');
      return true;
    }
    
    console.log('🚀 Starting Ollama service...');
    
    return new Promise((resolve, reject) => {
      const ollamaProcess = spawn('ollama', ['serve'], {
        detached: true,
        stdio: 'ignore'
      });
      
      ollamaProcess.unref();
      
      // Wait a moment for service to start
      setTimeout(async () => {
        const isRunning = await this.checkOllamaStatus();
        if (isRunning) {
          resolve(true);
        } else {
          reject(new Error('Failed to start Ollama service'));
        }
      }, 3000);
    });
  }

  async loadInstalledModels() {
    if (!this.isOllamaRunning) {
      console.log('⚠️  Cannot load models - Ollama service not running');
      return;
    }
    
    try {
      const response = await axios.get(`${this.ollamaUrl}/api/tags`);
      const models = response.data.models || [];
      
      this.installedModels.clear();
      models.forEach(model => {
        this.installedModels.set(model.name, {
          name: model.name,
          size: model.size,
          modified: model.modified_at,
          digest: model.digest
        });
      });
      
      console.log(`📊 Found ${this.installedModels.size} installed models`);
    } catch (error) {
      console.error('❌ Failed to load installed models:', error.message);
    }
  }

  async downloadModel(modelName) {
    if (!this.isOllamaRunning) {
      throw new Error('Ollama service not running');
    }
    
    const modelConfig = this.healthcareModels[modelName];
    if (!modelConfig) {
      throw new Error(`Unknown model: ${modelName}`);
    }
    
    console.log(`📥 Downloading ${modelConfig.displayName} (${modelConfig.size})...`);
    this.emit('downloadStarted', { modelName, config: modelConfig });
    
    try {
      // First download the base model
      await this.pullBaseModel(modelConfig.downloadUrl);
      
      // Then create the healthcare-specific version
      await this.createHealthcareModel(modelName, modelConfig);
      
      console.log(`✅ ${modelConfig.displayName} installed successfully`);
      this.emit('downloadCompleted', { modelName, config: modelConfig });
      
      // Reload installed models
      await this.loadInstalledModels();
      
      return true;
    } catch (error) {
      console.error(`❌ Failed to download ${modelName}:`, error.message);
      this.emit('downloadFailed', { modelName, error: error.message });
      throw error;
    }
  }

  async pullBaseModel(modelUrl) {
    return new Promise((resolve, reject) => {
      const pullProcess = spawn('ollama', ['pull', modelUrl], {
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      pullProcess.stdout.on('data', (data) => {
        const progress = data.toString();
        console.log(`📥 ${progress.trim()}`);
        this.emit('downloadProgress', { progress });
      });
      
      pullProcess.stderr.on('data', (data) => {
        console.error(`⚠️  ${data.toString()}`);
      });
      
      pullProcess.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Model pull failed with code ${code}`));
        }
      });
    });
  }

  async createHealthcareModel(modelName, config) {
    const modelfilePath = path.join(this.modelsDir, `${modelName}.modelfile`);
    
    // Write the modelfile
    fs.writeFileSync(modelfilePath, config.modelfile);
    
    // Create the model using Ollama
    return new Promise((resolve, reject) => {
      const createProcess = spawn('ollama', ['create', modelName, '-f', modelfilePath], {
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      createProcess.stdout.on('data', (data) => {
        console.log(`🔧 ${data.toString().trim()}`);
      });
      
      createProcess.stderr.on('data', (data) => {
        console.error(`⚠️  ${data.toString()}`);
      });
      
      createProcess.on('close', (code) => {
        if (code === 0) {
          console.log(`✅ Healthcare model ${modelName} created successfully`);
          resolve();
        } else {
          reject(new Error(`Model creation failed with code ${code}`));
        }
      });
    });
  }

  generateMedicalModelfile(baseModel) {
    return `FROM ${baseModel}

# Medical-specific system prompt
SYSTEM """You are a medical AI assistant designed to help healthcare professionals with clinical tasks. You have been trained on medical literature and clinical guidelines. Always:

1. Provide accurate, evidence-based medical information
2. Include appropriate disclaimers about consulting healthcare professionals
3. Use proper medical terminology and formatting
4. Maintain patient confidentiality and HIPAA compliance
5. Structure clinical notes in standard SOAP format when applicable

Remember: You are an assistant tool and should not replace professional medical judgment."""

# Medical-specific parameters
PARAMETER temperature 0.3
PARAMETER top_p 0.9
PARAMETER top_k 40
PARAMETER repeat_penalty 1.1

# Medical response templates
TEMPLATE """{{ if .System }}{{ .System }}{{ end }}{{ if .Prompt }}

Medical Query: {{ .Prompt }}

Please provide a comprehensive medical response following clinical guidelines.

{{ end }}"""`;
  }

  generateVisionModelfile(baseModel) {
    return `FROM ${baseModel}

# Medical imaging system prompt
SYSTEM """You are a medical imaging AI assistant specialized in analyzing medical images including X-rays, CT scans, MRIs, and other radiological images. You help radiologists and healthcare professionals with:

1. Image analysis and interpretation
2. Abnormality detection and description
3. Differential diagnosis suggestions
4. Report generation in standard radiology format
5. Quality assessment of medical images

Always provide structured reports with:
- Clinical History
- Technique
- Findings
- Impression
- Recommendations

Remember: Your analysis should support, not replace, professional radiological interpretation."""

# Vision-specific parameters
PARAMETER temperature 0.2
PARAMETER top_p 0.8
PARAMETER top_k 30

TEMPLATE """{{ if .System }}{{ .System }}{{ end }}{{ if .Prompt }}

Image Analysis Request: {{ .Prompt }}

Please analyze the provided medical image and provide a structured radiology report.

{{ end }}"""`;
  }

  generateVisionModelfile(baseModel) {
    return `FROM ${baseModel}

# Medical imaging system prompt
SYSTEM """You are a medical imaging AI assistant specialized in analyzing medical images including X-rays, CT scans, MRIs, and other radiological images. You help radiologists and healthcare professionals with:

1. Image analysis and interpretation
2. Abnormality detection and description
3. Differential diagnosis suggestions
4. Report generation in standard radiology format
5. Quality assessment of medical images

Always provide structured reports with:
- Clinical History
- Technique
- Findings
- Impression
- Recommendations

Remember: Your analysis should support, not replace, professional radiological interpretation."""

# Vision-specific parameters
PARAMETER temperature 0.2
PARAMETER top_p 0.8
PARAMETER top_k 30

TEMPLATE """{{ if .System }}{{ .System }}{{ end }}{{ if .Prompt }}

Image Analysis Request: {{ .Prompt }}

Please analyze the provided medical image and provide a structured radiology report.

{{ end }}"""`;
  }

  generateClinicalCodeModelfile(baseModel) {
    return `FROM ${baseModel}

# Clinical coding system prompt
SYSTEM """You are a clinical coding AI assistant specialized in healthcare data standards and medical coding. You help with:

1. HL7 message parsing and generation
2. FHIR resource creation and validation
3. ICD-10 code assignment
4. CPT code identification
5. Clinical data transformation

Always ensure:
- Accurate code assignment based on clinical documentation
- Proper FHIR resource structure
- Valid HL7 message formatting
- Compliance with healthcare data standards
- Detailed explanations for code selections"""

# Coding-specific parameters
PARAMETER temperature 0.1
PARAMETER top_p 0.7
PARAMETER top_k 20

TEMPLATE """{{ if .System }}{{ .System }}{{ end }}{{ if .Prompt }}

Clinical Coding Task: {{ .Prompt }}

Please provide accurate medical coding or data transformation as requested.

{{ end }}"""`;
  }

  async loadModelConfiguration() {
    try {
      if (fs.existsSync(this.configFile)) {
        const config = JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
        // Merge with default configuration
        Object.assign(this.healthcareModels, config.customModels || {});
      }
    } catch (error) {
      console.log('⚠️  No existing model configuration found, using defaults');
    }
  }

  async saveModelConfiguration() {
    const config = {
      lastUpdated: new Date().toISOString(),
      healthcareModels: this.healthcareModels,
      installedModels: Array.from(this.installedModels.entries()),
      ollamaUrl: this.ollamaUrl
    };

    fs.writeFileSync(this.configFile, JSON.stringify(config, null, 2));
  }

  async processTextQuery(modelName, prompt, options = {}) {
    if (!this.isOllamaRunning) {
      throw new Error('Ollama service not running');
    }

    if (!this.installedModels.has(modelName)) {
      throw new Error(`Model ${modelName} not installed`);
    }

    try {
      const requestData = {
        model: modelName,
        prompt: prompt,
        stream: false,
        options: {
          temperature: options.temperature || 0.3,
          top_p: options.top_p || 0.9,
          top_k: options.top_k || 40,
          ...options
        }
      };

      const response = await axios.post(`${this.ollamaUrl}/api/generate`, requestData, {
        timeout: 60000 // 60 second timeout for local processing
      });

      return {
        success: true,
        response: response.data.response,
        model: modelName,
        tokens: response.data.eval_count || 0,
        duration: response.data.total_duration || 0,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Local model processing failed: ${error.message}`);
    }
  }

  async processVisionQuery(modelName, prompt, imageData, options = {}) {
    if (!this.isOllamaRunning) {
      throw new Error('Ollama service not running');
    }

    if (!this.installedModels.has(modelName)) {
      throw new Error(`Model ${modelName} not installed`);
    }

    try {
      const requestData = {
        model: modelName,
        prompt: prompt,
        images: [imageData], // Base64 encoded image
        stream: false,
        options: {
          temperature: options.temperature || 0.2,
          top_p: options.top_p || 0.8,
          ...options
        }
      };

      const response = await axios.post(`${this.ollamaUrl}/api/generate`, requestData, {
        timeout: 120000 // 2 minute timeout for vision processing
      });

      return {
        success: true,
        response: response.data.response,
        model: modelName,
        tokens: response.data.eval_count || 0,
        duration: response.data.total_duration || 0,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Local vision model processing failed: ${error.message}`);
    }
  }

  async getModelStatus() {
    const status = {
      ollamaRunning: this.isOllamaRunning,
      ollamaUrl: this.ollamaUrl,
      installedModels: Array.from(this.installedModels.entries()),
      availableModels: Object.keys(this.healthcareModels),
      activeModels: Array.from(this.activeModels.entries()),
      systemInfo: await this.getSystemInfo()
    };

    return status;
  }

  async getSystemInfo() {
    const os = require('os');

    return {
      platform: os.platform(),
      arch: os.arch(),
      totalMemory: Math.round(os.totalmem() / 1024 / 1024 / 1024) + 'GB',
      freeMemory: Math.round(os.freemem() / 1024 / 1024 / 1024) + 'GB',
      cpuCount: os.cpus().length,
      nodeVersion: process.version,
      hasGPU: await this.checkGPUAvailability()
    };
  }

  async checkGPUAvailability() {
    try {
      // Check for NVIDIA GPU
      const { exec } = require('child_process');
      return new Promise((resolve) => {
        exec('nvidia-smi', (error) => {
          resolve(!error);
        });
      });
    } catch {
      return false;
    }
  }

  async removeModel(modelName) {
    if (!this.installedModels.has(modelName)) {
      throw new Error(`Model ${modelName} not installed`);
    }

    try {
      await axios.delete(`${this.ollamaUrl}/api/delete`, {
        data: { name: modelName }
      });

      this.installedModels.delete(modelName);
      this.activeModels.delete(modelName);

      console.log(`✅ Model ${modelName} removed successfully`);
      return true;
    } catch (error) {
      throw new Error(`Failed to remove model ${modelName}: ${error.message}`);
    }
  }

  async getModelInfo(modelName) {
    if (!this.installedModels.has(modelName)) {
      throw new Error(`Model ${modelName} not installed`);
    }

    try {
      const response = await axios.post(`${this.ollamaUrl}/api/show`, {
        name: modelName
      });

      return response.data;
    } catch (error) {
      throw new Error(`Failed to get model info: ${error.message}`);
    }
  }
}

module.exports = { LocalModelService };
