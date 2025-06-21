// AI models endpoint for Vercel deployment
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Return available AI models
  const models = {
    cloud_providers: {
      openai: {
        available: !!process.env.OPENAI_API_KEY,
        models: process.env.OPENAI_API_KEY ? [
          {
            id: 'gpt-4',
            name: 'GPT-4',
            description: 'Advanced language model for complex healthcare tasks',
            capabilities: ['clinical_documentation', 'medical_coding', 'diagnosis_assistance']
          },
          {
            id: 'gpt-3.5-turbo',
            name: 'GPT-3.5 Turbo',
            description: 'Fast and efficient model for routine healthcare tasks',
            capabilities: ['clinical_documentation', 'medical_coding']
          }
        ] : []
      },
      anthropic: {
        available: !!process.env.ANTHROPIC_API_KEY,
        models: process.env.ANTHROPIC_API_KEY ? [
          {
            id: 'claude-3-opus',
            name: 'Claude 3 Opus',
            description: 'High-accuracy model for complex medical analysis',
            capabilities: ['clinical_documentation', 'medical_coding', 'research_analysis']
          },
          {
            id: 'claude-3-sonnet',
            name: 'Claude 3 Sonnet',
            description: 'Balanced model for general healthcare applications',
            capabilities: ['clinical_documentation', 'medical_coding']
          }
        ] : []
      },
      google: {
        available: !!process.env.GOOGLE_API_KEY,
        models: process.env.GOOGLE_API_KEY ? [
          {
            id: 'gemini-pro',
            name: 'Gemini Pro',
            description: 'Google\'s advanced model for healthcare applications',
            capabilities: ['clinical_documentation', 'medical_coding', 'data_analysis']
          }
        ] : []
      }
    },
    local_models: {
      available: process.env.LOCAL_MODELS_ENABLED === 'true',
      models: process.env.LOCAL_MODELS_ENABLED === 'true' ? [
        {
          id: 'llama2-medical-7b',
          name: 'Llama2 Medical 7B',
          description: 'Local medical model for clinical documentation',
          capabilities: ['clinical_documentation', 'medical_qa'],
          status: 'available'
        },
        {
          id: 'mistral-medical-7b',
          name: 'Mistral Medical 7B',
          description: 'Local model for clinical documentation and coding',
          capabilities: ['clinical_documentation', 'medical_coding'],
          status: 'available'
        },
        {
          id: 'llava-medical',
          name: 'LLaVA Medical Vision',
          description: 'Local vision model for medical image analysis',
          capabilities: ['medical_imaging', 'radiology_reports'],
          status: 'available'
        },
        {
          id: 'codellama-clinical',
          name: 'CodeLlama Clinical',
          description: 'Local model for HL7/FHIR processing',
          capabilities: ['hl7_processing', 'fhir_processing', 'medical_coding'],
          status: 'available'
        }
      ] : []
    },
    total_models: 0,
    capabilities: [
      'clinical_documentation',
      'medical_coding',
      'diagnosis_assistance',
      'medical_imaging',
      'hl7_processing',
      'fhir_processing',
      'research_analysis',
      'data_analysis'
    ]
  };

  // Calculate total models
  models.total_models = 
    models.cloud_providers.openai.models.length +
    models.cloud_providers.anthropic.models.length +
    models.cloud_providers.google.models.length +
    models.local_models.models.length;

  res.status(200).json({
    success: true,
    data: models,
    timestamp: new Date().toISOString()
  });
}
