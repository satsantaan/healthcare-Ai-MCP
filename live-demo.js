// Live Demonstration of AI-Powered MCP Server
const axios = require('axios');

class LiveDemo {
  constructor() {
    this.baseUrl = 'http://localhost:3001/api';
    this.authToken = null;
  }

  async authenticate() {
    console.log('🔐 Authenticating with MCP Server...');
    try {
      const response = await axios.post(`${this.baseUrl}/auth/login`, {
        username: 'admin',
        password: 'admin123456'
      });
      
      if (response.data.success) {
        this.authToken = response.data.data.token;
        console.log('✅ Authentication successful');
        console.log(`   User: ${response.data.data.user.username} (${response.data.data.user.role})`);
        return true;
      }
      return false;
    } catch (error) {
      console.log('❌ Authentication failed:', error.message);
      return false;
    }
  }

  async demonstrateEMRIntegration() {
    console.log('\n📋 EMR Integration Demonstration');
    console.log('================================');
    
    try {
      // Get EMR systems
      const emrResponse = await axios.get(`${this.baseUrl}/emr/systems`, {
        headers: { Authorization: `Bearer ${this.authToken}` }
      });
      
      if (emrResponse.data.success) {
        console.log(`✅ Connected to ${emrResponse.data.data.length} EMR systems:`);
        emrResponse.data.data.forEach(emr => {
          console.log(`   📊 ${emr.name} v${emr.version} - Status: ${emr.status}`);
          console.log(`      Features: ${emr.features.join(', ')}`);
        });
        
        // Get EMR metrics
        const metricsResponse = await axios.get(`${this.baseUrl}/emr/metrics`, {
          headers: { Authorization: `Bearer ${this.authToken}` }
        });
        
        if (metricsResponse.data.success) {
          const metrics = metricsResponse.data.data;
          console.log('\n📊 EMR System Metrics:');
          console.log(`   HL7 Messages Processed: ${metrics.hl7Messages}`);
          console.log(`   FHIR Resources: ${metrics.fhirResources}`);
          console.log(`   Active Connections: ${metrics.activeConnections}`);
          console.log(`   Last Activity: ${new Date(metrics.lastActivity).toLocaleString()}`);
        }
        
        return true;
      }
    } catch (error) {
      console.log('❌ EMR integration failed:', error.message);
      return false;
    }
  }

  async demonstrateAIProcessing() {
    console.log('\n🤖 AI Processing Demonstration');
    console.log('==============================');
    
    try {
      // Get AI providers
      const aiResponse = await axios.get(`${this.baseUrl}/ai/providers`, {
        headers: { Authorization: `Bearer ${this.authToken}` }
      });
      
      if (aiResponse.data.success) {
        console.log(`✅ Available AI providers: ${aiResponse.data.data.length}`);
        aiResponse.data.data.forEach(provider => {
          console.log(`   🔗 ${provider.name}: ${provider.status} (${provider.models.length} models)`);
        });
        
        // Get AI models
        const modelsResponse = await axios.get(`${this.baseUrl}/ai/models`, {
          headers: { Authorization: `Bearer ${this.authToken}` }
        });
        
        if (modelsResponse.data.success) {
          console.log('\n🧠 Available AI Models:');
          modelsResponse.data.data.forEach(model => {
            console.log(`   📱 ${model.name} (${model.provider}) - ${model.status}`);
            console.log(`      Capabilities: ${model.capabilities.join(', ')}`);
          });
        }
        
        return true;
      }
    } catch (error) {
      console.log('❌ AI processing failed:', error.message);
      return false;
    }
  }

  async demonstrateMCPFunctions() {
    console.log('\n⚡ MCP Functions Demonstration');
    console.log('==============================');
    
    try {
      // Get MCP status
      const statusResponse = await axios.get(`${this.baseUrl}/mcp/status`, {
        headers: { Authorization: `Bearer ${this.authToken}` }
      });
      
      if (statusResponse.data.success) {
        const status = statusResponse.data.data;
        console.log('📊 MCP Server Status:');
        console.log(`   Active Connections: ${status.activeConnections}`);
        console.log(`   Total Requests: ${status.totalRequests}`);
        console.log(`   Average Response Time: ${status.avgResponseTime}ms`);
        console.log(`   Error Rate: ${status.errorRate}%`);
        console.log(`   Throughput: ${status.throughput} req/min`);
      }
      
      // Get available functions
      const functionsResponse = await axios.get(`${this.baseUrl}/mcp/functions`, {
        headers: { Authorization: `Bearer ${this.authToken}` }
      });
      
      if (functionsResponse.data.success) {
        console.log(`\n🔧 Available MCP Functions: ${functionsResponse.data.data.length}`);
        functionsResponse.data.data.forEach(func => {
          console.log(`   📝 ${func.name} (${func.category})`);
          console.log(`      Description: ${func.description}`);
          console.log(`      Server: ${func.server}`);
        });
        
        return functionsResponse.data.data;
      }
    } catch (error) {
      console.log('❌ MCP functions failed:', error.message);
      return [];
    }
  }

  async demonstrateEndToEndWorkflow() {
    console.log('\n🔄 End-to-End Medical Data Processing Workflow');
    console.log('===============================================');
    
    // Mock patient data (HIPAA-compliant - no real patient information)
    const mockPatientData = {
      encounter: {
        id: 'enc-demo-001',
        date: '2025-06-21',
        type: 'office-visit',
        provider: 'Dr. Demo',
        chiefComplaint: 'Routine follow-up for hypertension and diabetes'
      },
      patient: {
        id: 'pat-demo-001',
        ageGroup: 'adult',
        gender: 'M',
        conditions: ['Essential Hypertension', 'Type 2 Diabetes Mellitus']
      },
      vitals: {
        bloodPressure: '145/92',
        heartRate: 88,
        temperature: 98.6,
        weight: 185,
        height: 70,
        bmi: 26.5
      },
      medications: [
        'Metformin 1000mg BID',
        'Lisinopril 10mg daily',
        'Atorvastatin 20mg daily'
      ],
      labResults: {
        hba1c: 7.2,
        glucose: 145,
        cholesterol: 195,
        ldl: 110,
        hdl: 45
      }
    };
    
    console.log('📋 Processing Mock Patient Data:');
    console.log(`   Patient ID: ${mockPatientData.patient.id}`);
    console.log(`   Chief Complaint: ${mockPatientData.encounter.chiefComplaint}`);
    console.log(`   Conditions: ${mockPatientData.patient.conditions.join(', ')}`);
    console.log(`   Vitals: BP ${mockPatientData.vitals.bloodPressure}, HR ${mockPatientData.vitals.heartRate}`);
    
    const workflows = [
      {
        name: 'Clinical Documentation',
        function: 'generate_clinical_note',
        parameters: { patientData: mockPatientData }
      },
      {
        name: 'ICD-10 Code Extraction',
        function: 'extract_icd_codes',
        parameters: {
          clinicalText: `Patient presents for routine follow-up. Diagnosed with ${mockPatientData.patient.conditions.join(' and ')}.`
        }
      }
    ];
    
    const results = [];
    
    for (const workflow of workflows) {
      console.log(`\n🔄 Executing: ${workflow.name}`);
      console.log(`   Function: ${workflow.function}`);
      
      try {
        const startTime = Date.now();
        const response = await axios.post(`${this.baseUrl}/mcp/execute`, {
          functionName: workflow.function,
          parameters: workflow.parameters
        }, {
          headers: { Authorization: `Bearer ${this.authToken}` }
        });
        
        const duration = Date.now() - startTime;
        
        if (response.data.success) {
          console.log(`   ✅ Success (${duration}ms)`);
          console.log(`   📊 Execution ID: ${response.data.data.id}`);
          
          const result = response.data.data.result;
          
          if (workflow.function === 'generate_clinical_note') {
            console.log(`   📝 Generated Clinical Note:`);
            console.log(`      ${result.note.substring(0, 200)}...`);
            console.log(`   📈 Confidence: ${(result.confidence * 100).toFixed(1)}%`);
            console.log(`   📊 Word Count: ${result.wordCount}`);
          } else if (workflow.function === 'extract_icd_codes') {
            console.log(`   🏷️  Extracted ICD-10 Codes:`);
            result.codes.forEach(code => {
              console.log(`      ${code.code}: ${code.description}`);
            });
            console.log(`   📈 Confidence: ${(result.confidence * 100).toFixed(1)}%`);
          }
          
          results.push({
            workflow: workflow.name,
            success: true,
            duration,
            result
          });
        } else {
          console.log(`   ❌ Failed: ${response.data.error}`);
          results.push({
            workflow: workflow.name,
            success: false,
            error: response.data.error
          });
        }
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        results.push({
          workflow: workflow.name,
          success: false,
          error: error.message
        });
      }
    }
    
    return results;
  }

  async runCompleteDemonstration() {
    console.log('🚀 AI-Powered MCP Server Live Demonstration');
    console.log('============================================');
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log(`Server: ${this.baseUrl}`);
    
    const demo = {
      timestamp: new Date().toISOString(),
      steps: [],
      success: false,
      duration: 0
    };
    
    const startTime = Date.now();
    
    try {
      // Step 1: Authentication
      const authSuccess = await this.authenticate();
      demo.steps.push({ name: 'Authentication', success: authSuccess });
      
      if (!authSuccess) {
        console.log('\n❌ Demo cannot continue without authentication');
        return demo;
      }
      
      // Step 2: EMR Integration
      const emrSuccess = await this.demonstrateEMRIntegration();
      demo.steps.push({ name: 'EMR Integration', success: emrSuccess });
      
      // Step 3: AI Processing
      const aiSuccess = await this.demonstrateAIProcessing();
      demo.steps.push({ name: 'AI Processing', success: aiSuccess });
      
      // Step 4: MCP Functions
      const mcpFunctions = await this.demonstrateMCPFunctions();
      demo.steps.push({ name: 'MCP Functions', success: mcpFunctions.length > 0 });
      
      // Step 5: End-to-End Workflow
      const workflowResults = await this.demonstrateEndToEndWorkflow();
      const workflowSuccess = workflowResults.every(r => r.success);
      demo.steps.push({ name: 'End-to-End Workflow', success: workflowSuccess, results: workflowResults });
      
      demo.duration = Date.now() - startTime;
      demo.success = demo.steps.every(step => step.success);
      
      // Summary
      console.log('\n📊 Demonstration Summary');
      console.log('========================');
      console.log(`Total Duration: ${demo.duration}ms`);
      console.log(`Steps Completed: ${demo.steps.length}`);
      
      demo.steps.forEach((step, index) => {
        const emoji = step.success ? '✅' : '❌';
        console.log(`${index + 1}. ${step.name}: ${emoji} ${step.success ? 'SUCCESS' : 'FAILED'}`);
      });
      
      console.log(`\nOverall Demo Status: ${demo.success ? '✅ SUCCESS' : '❌ PARTIAL SUCCESS'}`);
      
      if (demo.success) {
        console.log('\n🎉 DEMONSTRATION COMPLETE!');
        console.log('The AI-Powered MCP Server is fully functional and ready for healthcare deployment.');
      } else {
        console.log('\n⚠️  DEMONSTRATION PARTIALLY SUCCESSFUL');
        console.log('Some components need configuration (AI API keys) for full functionality.');
      }
      
    } catch (error) {
      console.log(`\n❌ Demo failed: ${error.message}`);
      demo.success = false;
      demo.duration = Date.now() - startTime;
    }
    
    return demo;
  }
}

module.exports = { LiveDemo };

// Run demonstration if this file is executed directly
if (require.main === module) {
  const demo = new LiveDemo();
  
  demo.runCompleteDemonstration()
    .then(result => {
      console.log('\n📄 Demo completed. Results available in the returned object.');
    })
    .catch(error => {
      console.error('Demo failed:', error.message);
    });
}
