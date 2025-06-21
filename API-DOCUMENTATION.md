# AI-Powered MCP Server API Documentation

## 🔗 Base URL
```
Production: https://your-domain.com/api
Development: http://localhost:3001/api
```

## 🔐 Authentication

All endpoints except `/health` and `/auth` require authentication via JWT token.

### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## 📋 API Endpoints

### Health Endpoints

#### GET /health
Basic health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-06-21T08:02:36.510Z",
  "version": "1.0.0",
  "uptime": 17.164,
  "environment": "development"
}
```

#### GET /health/detailed
Detailed system health information.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-06-21T08:02:36.510Z",
  "version": "1.0.0",
  "uptime": 17.164,
  "services": {
    "database": {
      "status": "healthy",
      "message": "Connected"
    },
    "memory": {
      "status": "healthy",
      "usage": {
        "heapUsed": "45MB",
        "heapTotal": "67MB"
      }
    }
  }
}
```

### Authentication Endpoints

#### POST /auth/login
Authenticate user and receive JWT token.

**Request:**
```json
{
  "username": "admin",
  "password": "admin123456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### GET /auth/profile
Get current user profile information.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

### EMR Integration Endpoints

#### GET /emr/systems
Get list of connected EMR systems.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "medflow-emr",
      "name": "MedFlow EMR",
      "version": "2.1.0",
      "status": "active",
      "type": "commercial",
      "features": ["HL7", "FHIR", "Clinical Documentation"],
      "isDemo": true,
      "created_at": "2025-06-21T08:00:00.000Z"
    }
  ]
}
```

#### GET /emr/metrics
Get EMR system metrics and statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "hl7Messages": 75,
    "fhirResources": 150,
    "activeConnections": 2,
    "lastActivity": "2025-06-21T08:02:36.510Z",
    "totalSystems": 2,
    "healthySystems": 2
  }
}
```

### AI Processing Endpoints

#### GET /ai/models
Get list of available AI models.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "gpt-4-clinical",
      "name": "GPT-4 Clinical",
      "provider": "openai",
      "type": "cloud",
      "status": "active",
      "capabilities": ["clinical_documentation", "diagnosis_assistance"]
    }
  ]
}
```

#### GET /ai/providers
Get list of AI providers and their connection status.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "openai",
      "name": "OpenAI",
      "type": "cloud",
      "status": "disconnected",
      "models": ["gpt-4", "gpt-3.5-turbo"]
    },
    {
      "id": "anthropic",
      "name": "Anthropic",
      "type": "cloud",
      "status": "disconnected",
      "models": ["claude-3-opus", "claude-3-sonnet"]
    }
  ]
}
```

### MCP Function Endpoints

#### GET /mcp/status
Get MCP server status and metrics.

**Response:**
```json
{
  "success": true,
  "data": {
    "activeConnections": 25,
    "totalRequests": 750,
    "avgResponseTime": 250,
    "errorRate": "2.1",
    "uptime": 17.164,
    "throughput": 85
  }
}
```

#### GET /mcp/functions
Get list of available MCP functions.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "generate-clinical-note",
      "name": "generate_clinical_note",
      "description": "Generate clinical documentation from patient encounter data",
      "server": "clinical-ai-server",
      "category": "documentation",
      "parameters": {
        "patientData": {
          "type": "object",
          "required": true
        }
      },
      "returns": {
        "note": {
          "type": "string"
        }
      },
      "is_active": 1
    }
  ]
}
```

#### POST /mcp/execute
Execute an MCP function with specified parameters.

**Request:**
```json
{
  "functionName": "generate_clinical_note",
  "parameters": {
    "patientData": {
      "complaint": "Routine checkup"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "functionName": "generate_clinical_note",
    "result": {
      "note": "CLINICAL NOTE\n\nDate: 6/21/2025\nProvider: AI Assistant\n\nCHIEF COMPLAINT:\nRoutine checkup\n\nASSESSMENT AND PLAN:\nPatient presents for routine evaluation...",
      "confidence": 0.95,
      "wordCount": 150
    },
    "duration": 850,
    "timestamp": "2025-06-21T08:02:36.510Z",
    "success": true
  }
}
```

## 🔧 Integration Examples

### Healthcare Application Integration

#### Clinical Documentation Workflow
```javascript
// 1. Authenticate
const authResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'doctor',
    password: 'password'
  })
});
const { token } = authResponse.data;

// 2. Generate clinical note
const noteResponse = await fetch('/api/mcp/execute', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    functionName: 'generate_clinical_note',
    parameters: {
      patientData: {
        complaint: 'Patient reports chest pain',
        vitals: { bp: '140/90', hr: '85', temp: '98.6' },
        symptoms: ['chest pain', 'shortness of breath']
      }
    }
  })
});
```

#### ICD Code Extraction
```javascript
const codingResponse = await fetch('/api/mcp/execute', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    functionName: 'extract_icd_codes',
    parameters: {
      clinicalText: 'Patient presents with hypertension and type 2 diabetes mellitus without complications.'
    }
  })
});
```

### EMR System Integration

#### FHIR Resource Processing
```javascript
// Get EMR systems
const emrSystems = await fetch('/api/emr/systems', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Process patient data from EMR
const patientData = {
  resourceType: 'Patient',
  id: 'patient-123',
  name: [{ family: 'Doe', given: ['John'] }],
  gender: 'male',
  birthDate: '1980-01-01'
};

// Generate AI insights
const insights = await fetch('/api/mcp/execute', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    functionName: 'analyze_patient_data',
    parameters: { fhirResource: patientData }
  })
});
```

## 🚨 Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description",
  "timestamp": "2025-06-21T08:02:36.510Z"
}
```

### HTTP Status Codes
- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error

## 🔒 Security Considerations

### HIPAA Compliance
- All patient data is encrypted at rest and in transit
- Audit logs are maintained for all data access
- Access controls are enforced based on user roles
- Data anonymization is applied where appropriate

### Rate Limiting
- 100 requests per 15-minute window per user
- Higher limits available for enterprise customers
- Rate limit headers included in responses

### Data Validation
- All input data is validated and sanitized
- SQL injection protection enabled
- XSS protection implemented
- CSRF protection for state-changing operations

## 📊 Monitoring and Analytics

### Performance Metrics
- Response time monitoring
- Error rate tracking
- Usage analytics
- Cost tracking for AI model usage

### Health Monitoring
- Automated health checks every 30 seconds
- Database connection monitoring
- Memory and CPU usage tracking
- External service dependency monitoring

---

**For additional support or questions, contact: support@mcpserver.com**
