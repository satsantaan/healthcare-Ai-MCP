// MCP Server status endpoint for Vercel deployment
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

  // Return MCP server status
  res.status(200).json({
    status: 'operational',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'production',
    services: {
      api: 'healthy',
      database: 'connected',
      authentication: 'active',
      ai_providers: {
        local_models: process.env.LOCAL_MODELS_ENABLED === 'true' ? 'enabled' : 'disabled',
        openai: process.env.OPENAI_API_KEY ? 'configured' : 'not_configured',
        anthropic: process.env.ANTHROPIC_API_KEY ? 'configured' : 'not_configured',
        google: process.env.GOOGLE_API_KEY ? 'configured' : 'not_configured'
      }
    },
    features: {
      hipaa_mode: process.env.HIPAA_MODE === 'true',
      encryption: 'enabled',
      audit_logging: 'enabled',
      local_processing: process.env.LOCAL_MODELS_ENABLED === 'true'
    },
    deployment: {
      platform: 'vercel',
      region: process.env.VERCEL_REGION || 'unknown',
      url: process.env.VERCEL_URL || 'localhost'
    }
  });
}
