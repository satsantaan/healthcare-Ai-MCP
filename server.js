const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Database setup
const dbDir = path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
const dbPath = path.join(dbDir, 'mcp_server.db');
let db = null;

// Initialize database
function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
        return;
      }
      
      console.log('Connected to SQLite database');
      
      // Create tables
      const tables = [
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'user',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          is_active BOOLEAN DEFAULT 1
        )`,
        `CREATE TABLE IF NOT EXISTS emr_systems (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          version TEXT,
          status TEXT NOT NULL DEFAULT 'offline',
          type TEXT NOT NULL DEFAULT 'commercial',
          features TEXT,
          is_demo BOOLEAN DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS ai_models (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          provider TEXT NOT NULL,
          type TEXT NOT NULL DEFAULT 'cloud',
          status TEXT NOT NULL DEFAULT 'idle',
          capabilities TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS mcp_functions (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          server TEXT NOT NULL,
          category TEXT,
          parameters TEXT,
          returns TEXT,
          is_active BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`
      ];
      
      let completed = 0;
      tables.forEach(table => {
        db.run(table, (err) => {
          if (err) {
            console.error('Error creating table:', err);
            reject(err);
          } else {
            completed++;
            if (completed === tables.length) {
              seedDatabase().then(resolve).catch(reject);
            }
          }
        });
      });
    });
  });
}

// Seed database with sample data
async function seedDatabase() {
  console.log('Seeding database...');
  
  // Seed admin user
  const adminPassword = await bcrypt.hash('admin123456', 12);
  db.run(
    'INSERT OR IGNORE INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
    ['admin', 'admin@mcpserver.com', adminPassword, 'admin']
  );
  
  // Seed EMR systems
  const emrSystems = [
    {
      id: 'medflow-emr',
      name: 'MedFlow EMR',
      version: '2.1.0',
      status: 'active',
      type: 'commercial',
      features: JSON.stringify(['HL7', 'FHIR', 'Clinical Documentation']),
      is_demo: 1
    },
    {
      id: 'healthtech-pro',
      name: 'HealthTech Pro',
      version: '3.0.2',
      status: 'active',
      type: 'commercial',
      features: JSON.stringify(['FHIR', 'Lab Integration']),
      is_demo: 1
    }
  ];
  
  emrSystems.forEach(system => {
    db.run(
      'INSERT OR REPLACE INTO emr_systems (id, name, version, status, type, features, is_demo) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [system.id, system.name, system.version, system.status, system.type, system.features, system.is_demo]
    );
  });
  
  // Seed AI models
  const aiModels = [
    {
      id: 'gpt-4-clinical',
      name: 'GPT-4 Clinical',
      provider: 'openai',
      type: 'cloud',
      status: 'active',
      capabilities: JSON.stringify(['clinical_documentation', 'diagnosis_assistance'])
    },
    {
      id: 'claude-3-medical',
      name: 'Claude-3 Medical',
      provider: 'anthropic',
      type: 'cloud',
      status: 'active',
      capabilities: JSON.stringify(['medical_coding', 'clinical_analysis'])
    }
  ];
  
  aiModels.forEach(model => {
    db.run(
      'INSERT OR REPLACE INTO ai_models (id, name, provider, type, status, capabilities) VALUES (?, ?, ?, ?, ?, ?)',
      [model.id, model.name, model.provider, model.type, model.status, model.capabilities]
    );
  });
  
  // Seed MCP functions
  const mcpFunctions = [
    {
      id: 'generate-clinical-note',
      name: 'generate_clinical_note',
      description: 'Generate clinical documentation from patient encounter data',
      server: 'clinical-ai-server',
      category: 'documentation',
      parameters: JSON.stringify({ patientData: { type: 'object', required: true } }),
      returns: JSON.stringify({ note: { type: 'string' } })
    },
    {
      id: 'extract-icd-codes',
      name: 'extract_icd_codes',
      description: 'Extract ICD-10 diagnosis codes from clinical text',
      server: 'billing-ai-server',
      category: 'coding',
      parameters: JSON.stringify({ clinicalText: { type: 'string', required: true } }),
      returns: JSON.stringify({ codes: { type: 'array' } })
    }
  ];
  
  mcpFunctions.forEach(func => {
    db.run(
      'INSERT OR REPLACE INTO mcp_functions (id, name, description, server, category, parameters, returns) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [func.id, func.name, func.description, func.server, func.category, func.parameters, func.returns]
    );
  });
  
  console.log('Database seeded successfully');
}

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Simple logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// JWT middleware
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function authenticateToken(req, res, next) {
  // Skip auth for health and auth routes
  if (req.path.startsWith('/api/health') || req.path.startsWith('/api/auth')) {
    return next();
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// Apply auth middleware
app.use('/api', authenticateToken);

// Health endpoints
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime()
  });
});

app.get('/api/health/detailed', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime(),
    services: {
      database: { status: 'healthy', message: 'Connected' },
      memory: { status: 'healthy', usage: process.memoryUsage() }
    }
  });
});

// Auth endpoints
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Username and password required' });
  }
  
  db.get(
    'SELECT * FROM users WHERE (username = ? OR email = ?) AND is_active = 1',
    [username, username],
    async (err, user) => {
      if (err) {
        return res.status(500).json({ success: false, error: 'Database error' });
      }
      
      if (!user || !await bcrypt.compare(password, user.password_hash)) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }
      
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({
        success: true,
        data: {
          user: { id: user.id, username: user.username, role: user.role },
          token
        }
      });
    }
  );
});

app.get('/api/auth/profile', (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

// EMR endpoints
app.get('/api/emr/systems', (req, res) => {
  db.all('SELECT * FROM emr_systems ORDER BY name', (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Database error' });
    }
    
    const systems = rows.map(row => ({
      ...row,
      features: JSON.parse(row.features || '[]'),
      isDemo: Boolean(row.is_demo)
    }));
    
    res.json({ success: true, data: systems });
  });
});

app.get('/api/emr/metrics', (req, res) => {
  res.json({
    success: true,
    data: {
      hl7Messages: Math.floor(Math.random() * 100),
      fhirResources: Math.floor(Math.random() * 200),
      activeConnections: 2,
      lastActivity: new Date().toISOString()
    }
  });
});

// AI endpoints
app.get('/api/ai/models', (req, res) => {
  db.all('SELECT * FROM ai_models ORDER BY provider, name', (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Database error' });
    }
    
    const models = rows.map(row => ({
      ...row,
      capabilities: JSON.parse(row.capabilities || '[]')
    }));
    
    res.json({ success: true, data: models });
  });
});

app.get('/api/ai/providers', (req, res) => {
  const providers = [
    {
      id: 'openai',
      name: 'OpenAI',
      type: 'cloud',
      status: process.env.OPENAI_API_KEY ? 'connected' : 'disconnected',
      models: ['gpt-4', 'gpt-3.5-turbo']
    },
    {
      id: 'anthropic',
      name: 'Anthropic',
      type: 'cloud',
      status: process.env.ANTHROPIC_API_KEY ? 'connected' : 'disconnected',
      models: ['claude-3-opus', 'claude-3-sonnet']
    }
  ];
  
  res.json({ success: true, data: providers });
});

// MCP endpoints
app.get('/api/mcp/status', (req, res) => {
  res.json({
    success: true,
    data: {
      activeConnections: Math.floor(Math.random() * 50) + 10,
      totalRequests: Math.floor(Math.random() * 1000),
      avgResponseTime: Math.floor(Math.random() * 500) + 100,
      errorRate: (Math.random() * 5).toFixed(2),
      uptime: process.uptime()
    }
  });
});

app.get('/api/mcp/functions', (req, res) => {
  db.all('SELECT * FROM mcp_functions WHERE is_active = 1 ORDER BY category, name', (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Database error' });
    }
    
    const functions = rows.map(row => ({
      ...row,
      parameters: JSON.parse(row.parameters || '{}'),
      returns: JSON.parse(row.returns || '{}')
    }));
    
    res.json({ success: true, data: functions });
  });
});

app.post('/api/mcp/execute', async (req, res) => {
  const { functionName, parameters } = req.body;
  
  if (!functionName || !parameters) {
    return res.status(400).json({ success: false, error: 'Function name and parameters required' });
  }
  
  // Mock execution
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 100));
  
  let result;
  switch (functionName) {
    case 'generate_clinical_note':
      result = {
        note: `Clinical note generated for patient. Chief complaint: ${parameters.patientData?.complaint || 'General consultation'}. Assessment and plan documented.`,
        confidence: 0.95,
        wordCount: 150
      };
      break;
    case 'extract_icd_codes':
      result = {
        codes: [
          { code: 'Z00.00', description: 'Encounter for general adult medical examination without abnormal findings' },
          { code: 'I10', description: 'Essential hypertension' }
        ],
        confidence: 0.88
      };
      break;
    default:
      result = {
        message: `Function ${functionName} executed successfully`,
        parameters,
        timestamp: new Date().toISOString()
      };
  }
  
  res.json({
    success: true,
    data: {
      id: uuidv4(),
      functionName,
      result,
      duration: Math.floor(Math.random() * 1000) + 100,
      timestamp: new Date().toISOString()
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Start server
async function startServer() {
  try {
    await initializeDatabase();
    console.log('Database initialized successfully');
    
    app.listen(PORT, () => {
      console.log(`🚀 MCP Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔒 HIPAA Mode: ${process.env.HIPAA_MODE === 'true' ? 'Enabled' : 'Disabled'}`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
      console.log(`📖 Health Check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
