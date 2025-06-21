// Application constants and configuration

export const APP_CONFIG = {
  name: "EMR AI Enhancement System",
  version: "2.1.0",
  description: "AI-powered EMR integration platform for healthcare providers",
  author: "EMR AI Enhancement Team",
};

export const API_ENDPOINTS = {
  health: "/health",
  mcp: {
    status: "/api/mcp/status",
    functions: "/api/mcp/functions",
    generate_clinical_note: "/api/mcp/generate_clinical_note",
    extract_icd_codes: "/api/mcp/extract_icd_codes",
    summarize_patient_history: "/api/mcp/summarize_patient_history",
  },
};

export const REFRESH_INTERVALS = {
  dashboard: 30000, // 30 seconds
  mcpStatus: 15000, // 15 seconds
  aiAssistance: 20000, // 20 seconds
  systemHealth: 60000, // 1 minute
};

export const SYSTEM_LIMITS = {
  maxConcurrentRequests: 10,
  apiTimeout: 30000,
  maxRetries: 3,
  confidenceThreshold: 85,
};

export const FEATURE_FLAGS = {
  enableMedicalImaging: false,
  enableFederatedLearning: false,
  enableAdvancedAnalytics: true,
  enableRealTimeUpdates: true,
};

export const HIPAA_CONFIG = {
  enabled: true,
  auditLevel: "detailed",
  dataRetentionDays: 2555, // 7 years
  encryptionRequired: true,
  anonymizationEnabled: true,
};

export const MODEL_PROVIDERS = {
  openai: {
    name: "OpenAI",
    models: ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"],
    type: "cloud",
  },
  anthropic: {
    name: "Anthropic",
    models: ["claude-3-sonnet", "claude-3-haiku", "claude-2"],
    type: "cloud",
  },
  google: {
    name: "Google",
    models: ["gemini-pro", "gemini-pro-vision"],
    type: "cloud",
  },
  local: {
    name: "Local Models",
    models: ["llama-2-70b", "med-llama-7b", "clinical-bert"],
    type: "local",
  },
};

export const EMR_SYSTEMS = {
  medflow: {
    name: "MedFlow EMR",
    version: "v4.2.1",
    supported: true,
  },
  healthtech: {
    name: "HealthTech Pro",
    version: "v3.8.0",
    supported: true,
  },
  clinicalsoft: {
    name: "ClinicalSoft",
    version: "v5.1.2",
    supported: true,
  },
  documed: {
    name: "DocuMed",
    version: "v2.9.4",
    supported: true,
  },
  careplus: {
    name: "CarePlus EMR",
    version: "v1.8.7",
    supported: true,
  },
};

export const OPEN_SOURCE_EMR_SYSTEMS = {
  openmrs: {
    name: "OpenMRS",
    version: "v3.0.0",
    description: "Open-source medical record system platform",
    website: "https://openmrs.org",
    license: "Mozilla Public License 2.0",
    features: [
      "Patient Management",
      "Clinical Data",
      "Reporting",
      "API Integration",
    ],
    demoData: {
      patients: 1247,
      encounters: 8934,
      observations: 24567,
      providers: 89,
    },
    supported: true,
    integrationStatus: "active",
  },
  openemr: {
    name: "OpenEMR",
    version: "v7.0.2",
    description: "Full-featured electronic health records system",
    website: "https://www.open-emr.org",
    license: "GNU General Public License",
    features: ["EHR", "Practice Management", "Billing", "Telemedicine"],
    demoData: {
      patients: 892,
      encounters: 5634,
      observations: 18923,
      providers: 67,
    },
    supported: true,
    integrationStatus: "active",
  },
  gnuhealth: {
    name: "GNU Health",
    version: "v4.2.0",
    description: "Hospital and health information system",
    website: "https://www.gnuhealth.org",
    license: "GNU General Public License v3",
    features: ["Hospital Management", "Laboratory", "Pharmacy", "Genetics"],
    demoData: {
      patients: 634,
      encounters: 3421,
      observations: 12456,
      providers: 45,
    },
    supported: true,
    integrationStatus: "demo",
  },
};

export const TOKEN_BUDGET_CONFIG = {
  providers: {
    openai: {
      name: "OpenAI",
      models: {
        "gpt-4": { inputCost: 0.03, outputCost: 0.06, unit: "1K tokens" },
        "gpt-4-turbo": { inputCost: 0.01, outputCost: 0.03, unit: "1K tokens" },
        "gpt-3.5-turbo": {
          inputCost: 0.0015,
          outputCost: 0.002,
          unit: "1K tokens",
        },
      },
    },
    anthropic: {
      name: "Anthropic",
      models: {
        "claude-3-sonnet": {
          inputCost: 0.003,
          outputCost: 0.015,
          unit: "1K tokens",
        },
        "claude-3-haiku": {
          inputCost: 0.00025,
          outputCost: 0.00125,
          unit: "1K tokens",
        },
        "claude-2": { inputCost: 0.008, outputCost: 0.024, unit: "1K tokens" },
      },
    },
    google: {
      name: "Google",
      models: {
        "gemini-pro": {
          inputCost: 0.0005,
          outputCost: 0.0015,
          unit: "1K tokens",
        },
        "gemini-pro-vision": {
          inputCost: 0.0025,
          outputCost: 0.01,
          unit: "1K tokens",
        },
      },
    },
    local: {
      name: "Local Models",
      models: {
        "llama-2-70b": { inputCost: 0, outputCost: 0, unit: "Free" },
        "med-llama-7b": { inputCost: 0, outputCost: 0, unit: "Free" },
        "clinical-bert": { inputCost: 0, outputCost: 0, unit: "Free" },
      },
    },
  },
  budgetLimits: {
    daily: 500,
    weekly: 2500,
    monthly: 10000,
  },
  alertThresholds: {
    warning: 80, // 80% of budget
    critical: 95, // 95% of budget
  },
};

export const MCP_FUNCTIONS = [
  {
    name: "generate_clinical_note",
    description: "Generate clinical documentation from patient data",
    server: "Clinical Documentation",
    category: "documentation",
  },
  {
    name: "extract_icd_codes",
    description: "Extract ICD-10 codes from clinical text",
    server: "Billing & Coding",
    category: "coding",
  },
  {
    name: "summarize_patient_history",
    description: "Create patient history summaries",
    server: "Summary Generation",
    category: "summary",
  },
  {
    name: "analyze_lab_results",
    description: "Analyze and interpret laboratory results",
    server: "Clinical Analysis",
    category: "analysis",
  },
  {
    name: "generate_discharge_summary",
    description: "Generate discharge summaries",
    server: "Documentation",
    category: "documentation",
  },
  {
    name: "validate_medication_dosage",
    description: "Validate medication dosages for safety",
    server: "Safety Checks",
    category: "safety",
  },
];

export const SECURITY_HEADERS = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Content-Security-Policy":
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://api.tempolabs.ai https://storage.googleapis.com; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' data:; " +
    "connect-src 'self' https:;",
};
