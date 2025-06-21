// Local Model Testing and Validation Script
// Tests local AI models for healthcare applications without requiring external API keys

const axios = require('axios');
const fs = require('fs');
const path = require('path');

class LocalModelTester {
  constructor() {
    this.baseUrl = 'http://localhost:3001/api';
    this.authToken = null;
    this.testResults = [];
    
    // Healthcare test scenarios
    this.testScenarios = {
      clinicalDocumentation: {
        name: 'Clinical Documentation',
        prompt: `Generate a clinical note for the following patient encounter:

Patient: 65-year-old male
Chief Complaint: Chest pain and shortness of breath
Vital Signs: BP 150/95, HR 88, RR 20, Temp 98.6°F
History: Hypertension, Type 2 diabetes
Physical Exam: Chest clear, heart regular rhythm, no murmurs
Assessment: Stable angina, hypertension
Plan: Continue current medications, follow-up in 2 weeks

Please format as a standard SOAP note.`,
        expectedKeywords: ['SOAP', 'Assessment', 'Plan', 'chest pain', 'hypertension'],
        type: 'text'
      },
      
      icdCoding: {
        name: 'ICD-10 Coding',
        prompt: `Extract ICD-10 diagnosis codes for the following clinical documentation:

Patient presents with:
1. Essential hypertension, well controlled
2. Type 2 diabetes mellitus without complications
3. Stable angina pectoris
4. Hyperlipidemia

Please provide the appropriate ICD-10 codes with descriptions.`,
        expectedKeywords: ['I10', 'E11', 'I20', 'E78', 'hypertension', 'diabetes'],
        type: 'text'
      },
      
      drugInteractions: {
        name: 'Drug Interaction Analysis',
        prompt: `Analyze potential drug interactions for the following medication list:

1. Warfarin 5mg daily
2. Metformin 1000mg twice daily
3. Lisinopril 10mg daily
4. Atorvastatin 20mg daily
5. Aspirin 81mg daily

Identify any significant interactions and provide recommendations.`,
        expectedKeywords: ['warfarin', 'interaction', 'bleeding', 'monitoring'],
        type: 'text'
      },
      
      medicalImageAnalysis: {
        name: 'Medical Image Analysis',
        prompt: `Analyze this chest X-ray image and provide a structured radiology report including:

1. Technical quality assessment
2. Anatomical structures visible
3. Any abnormalities detected
4. Clinical impression
5. Recommendations

Format as a standard radiology report.`,
        expectedKeywords: ['chest', 'lungs', 'heart', 'impression', 'normal'],
        type: 'vision',
        requiresImage: true
      }
    };
  }

  async authenticate() {
    try {
      const response = await axios.post(`${this.baseUrl}/auth/login`, {
        username: 'admin',
        password: 'admin123456'
      });
      
      if (response.data.success) {
        this.authToken = response.data.data.token;
        console.log('✅ Authentication successful');
        return true;
      }
      return false;
    } catch (error) {
      console.log('❌ Authentication failed:', error.message);
      return false;
    }
  }

  async checkLocalModelStatus() {
    console.log('\n🔍 Checking Local Model Service Status...');
    
    try {
      const response = await axios.get(`${this.baseUrl}/local/status`, {
        headers: { Authorization: `Bearer ${this.authToken}` }
      });
      
      if (response.data.success) {
        const status = response.data.data;
        console.log(`✅ Ollama Service: ${status.ollamaRunning ? 'Running' : 'Not Running'}`);
        console.log(`📊 Installed Models: ${status.installedModels.length}`);
        console.log(`🖥️  System: ${status.systemInfo.platform} ${status.systemInfo.arch}`);
        console.log(`💾 Memory: ${status.systemInfo.freeMemory}/${status.systemInfo.totalMemory}`);
        console.log(`🔧 CPU Cores: ${status.systemInfo.cpuCount}`);
        console.log(`🎮 GPU Available: ${status.systemInfo.hasGPU ? 'Yes' : 'No'}`);
        
        return status;
      }
    } catch (error) {
      console.log('❌ Failed to check local model status:', error.message);
      return null;
    }
  }

  async getAvailableModels() {
    console.log('\n📋 Available Healthcare Models...');
    
    try {
      const response = await axios.get(`${this.baseUrl}/local/models`, {
        headers: { Authorization: `Bearer ${this.authToken}` }
      });
      
      if (response.data.success) {
        const models = response.data.data;
        console.log(`📊 Total Healthcare Models: ${models.length}`);
        
        models.forEach(model => {
          const status = model.installed ? '✅ Installed' : '⬇️  Available';
          console.log(`  ${status} ${model.displayName} (${model.size})`);
          console.log(`    Type: ${model.type} | Capabilities: ${model.capabilities.join(', ')}`);
          console.log(`    Description: ${model.description}`);
        });
        
        return models;
      }
    } catch (error) {
      console.log('❌ Failed to get available models:', error.message);
      return [];
    }
  }

  async installLightweightModel() {
    console.log('\n📥 Installing Lightweight Test Model...');
    
    // Try to install a small model for testing
    const testModel = 'mistral-medical'; // Smallest healthcare model
    
    try {
      console.log(`📦 Installing ${testModel}...`);
      console.log('⚠️  This may take several minutes depending on internet speed');
      
      const response = await axios.post(`${this.baseUrl}/local/install`, {
        modelName: testModel
      }, {
        headers: { Authorization: `Bearer ${this.authToken}` },
        timeout: 600000 // 10 minute timeout for model download
      });
      
      if (response.data.success) {
        console.log(`✅ ${testModel} installed successfully`);
        return testModel;
      }
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        console.log('⏱️  Model installation timed out - this is normal for large models');
        console.log('   The installation may still be running in the background');
      } else {
        console.log(`❌ Failed to install ${testModel}:`, error.message);
      }
      return null;
    }
  }

  async testModelProcessing(modelName, scenario) {
    console.log(`\n🧪 Testing: ${scenario.name}`);
    console.log(`📝 Model: ${modelName}`);
    
    try {
      const startTime = Date.now();
      
      let requestData = {
        modelName: modelName,
        prompt: scenario.prompt,
        type: scenario.type,
        options: {
          temperature: 0.3,
          max_tokens: 500
        }
      };
      
      // Add mock image data for vision tests
      if (scenario.type === 'vision' && scenario.requiresImage) {
        requestData.imageData = this.generateMockMedicalImage();
        console.log('📷 Using mock medical image for vision test');
      }
      
      const response = await axios.post(`${this.baseUrl}/local/process`, requestData, {
        headers: { Authorization: `Bearer ${this.authToken}` },
        timeout: 120000 // 2 minute timeout
      });
      
      const duration = Date.now() - startTime;
      
      if (response.data.success) {
        const result = response.data.data;
        console.log(`✅ Processing successful (${duration}ms)`);
        console.log(`📊 Tokens: ${result.tokens || 'N/A'}`);
        console.log(`⏱️  Model Duration: ${Math.round((result.duration || 0) / 1000000)}ms`);
        
        // Show response preview
        const responseText = result.response || '';
        console.log(`📄 Response Preview: "${responseText.substring(0, 150)}..."`);
        
        // Validate response quality
        const quality = this.validateResponse(responseText, scenario);
        console.log(`🎯 Quality Score: ${quality.score}/10`);
        
        if (quality.issues.length > 0) {
          console.log(`⚠️  Quality Issues: ${quality.issues.join(', ')}`);
        }
        
        return {
          success: true,
          scenario: scenario.name,
          model: modelName,
          duration,
          tokens: result.tokens,
          responseLength: responseText.length,
          quality: quality.score,
          response: responseText
        };
      }
    } catch (error) {
      console.log(`❌ Processing failed: ${error.message}`);
      return {
        success: false,
        scenario: scenario.name,
        model: modelName,
        error: error.message
      };
    }
  }

  validateResponse(response, scenario) {
    let score = 0;
    const issues = [];
    
    // Check response length
    if (response.length < 50) {
      issues.push('Response too short');
    } else if (response.length > 50) {
      score += 2;
    }
    
    // Check for expected keywords
    const foundKeywords = scenario.expectedKeywords.filter(keyword => 
      response.toLowerCase().includes(keyword.toLowerCase())
    );
    
    const keywordScore = (foundKeywords.length / scenario.expectedKeywords.length) * 4;
    score += keywordScore;
    
    if (keywordScore < 2) {
      issues.push('Missing key medical terms');
    }
    
    // Check for medical formatting
    if (scenario.name === 'Clinical Documentation') {
      if (response.includes('SOAP') || response.includes('Assessment') || response.includes('Plan')) {
        score += 2;
      } else {
        issues.push('Missing SOAP format');
      }
    }
    
    // Check for code format in ICD coding
    if (scenario.name === 'ICD-10 Coding') {
      const codePattern = /[A-Z]\d{2}(\.\d+)?/g;
      const codes = response.match(codePattern);
      if (codes && codes.length > 0) {
        score += 2;
      } else {
        issues.push('Missing ICD-10 code format');
      }
    }
    
    return {
      score: Math.min(Math.round(score), 10),
      issues,
      foundKeywords
    };
  }

  generateMockMedicalImage() {
    // Generate a simple base64 encoded placeholder image for vision testing
    // In a real scenario, this would be actual medical image data
    const mockImageData = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    return mockImageData;
  }

  async runComprehensiveTest() {
    console.log('🚀 Local Model Comprehensive Testing');
    console.log('====================================');
    console.log(`Timestamp: ${new Date().toISOString()}`);
    
    const testReport = {
      timestamp: new Date().toISOString(),
      authentication: false,
      localModelStatus: null,
      availableModels: [],
      installedModel: null,
      testResults: [],
      summary: {
        totalTests: 0,
        successfulTests: 0,
        averageQuality: 0,
        averageResponseTime: 0
      }
    };
    
    try {
      // Step 1: Authentication
      testReport.authentication = await this.authenticate();
      if (!testReport.authentication) {
        console.log('❌ Cannot proceed without authentication');
        return testReport;
      }
      
      // Step 2: Check local model status
      testReport.localModelStatus = await this.checkLocalModelStatus();
      
      // Step 3: Get available models
      testReport.availableModels = await this.getAvailableModels();
      
      // Step 4: Install a lightweight model if none are installed
      const installedModels = testReport.availableModels.filter(m => m.installed);
      
      if (installedModels.length === 0) {
        console.log('\n⚠️  No models installed. Attempting to install lightweight model...');
        testReport.installedModel = await this.installLightweightModel();
        
        if (!testReport.installedModel) {
          console.log('\n📝 Manual Installation Instructions:');
          console.log('1. Install Ollama: curl -fsSL https://ollama.ai/install.sh | sh');
          console.log('2. Start Ollama: ollama serve');
          console.log('3. Install a model: ollama pull mistral:7b');
          console.log('4. Re-run this test');
          return testReport;
        }
      } else {
        testReport.installedModel = installedModels[0].name;
        console.log(`\n✅ Using installed model: ${testReport.installedModel}`);
      }
      
      // Step 5: Run test scenarios
      console.log('\n🧪 Running Healthcare Test Scenarios...');
      
      for (const [key, scenario] of Object.entries(this.testScenarios)) {
        // Skip vision tests if no vision model is available
        if (scenario.type === 'vision' && !testReport.installedModel.includes('llava')) {
          console.log(`⏭️  Skipping ${scenario.name} - requires vision model`);
          continue;
        }
        
        const result = await this.testModelProcessing(testReport.installedModel, scenario);
        testReport.testResults.push(result);
        testReport.summary.totalTests++;
        
        if (result.success) {
          testReport.summary.successfulTests++;
        }
      }
      
      // Calculate summary statistics
      const successfulResults = testReport.testResults.filter(r => r.success);
      if (successfulResults.length > 0) {
        testReport.summary.averageQuality = successfulResults.reduce((sum, r) => sum + (r.quality || 0), 0) / successfulResults.length;
        testReport.summary.averageResponseTime = successfulResults.reduce((sum, r) => sum + (r.duration || 0), 0) / successfulResults.length;
      }
      
      // Display final summary
      this.displayTestSummary(testReport);
      
    } catch (error) {
      console.error('❌ Test execution failed:', error.message);
    }
    
    return testReport;
  }

  displayTestSummary(report) {
    console.log('\n📊 Local Model Test Summary');
    console.log('===========================');
    console.log(`Authentication: ${report.authentication ? '✅ Success' : '❌ Failed'}`);
    console.log(`Ollama Service: ${report.localModelStatus?.ollamaRunning ? '✅ Running' : '❌ Not Running'}`);
    console.log(`Available Models: ${report.availableModels.length}`);
    console.log(`Test Model: ${report.installedModel || 'None'}`);
    console.log(`Total Tests: ${report.summary.totalTests}`);
    console.log(`Successful Tests: ${report.summary.successfulTests}`);
    console.log(`Success Rate: ${((report.summary.successfulTests / report.summary.totalTests) * 100).toFixed(1)}%`);
    console.log(`Average Quality: ${report.summary.averageQuality.toFixed(1)}/10`);
    console.log(`Average Response Time: ${Math.round(report.summary.averageResponseTime)}ms`);
    
    console.log('\n📋 Test Results:');
    report.testResults.forEach((result, index) => {
      const status = result.success ? '✅' : '❌';
      console.log(`${index + 1}. ${result.scenario}: ${status}`);
      if (result.success) {
        console.log(`   Quality: ${result.quality}/10, Duration: ${result.duration}ms`);
      } else {
        console.log(`   Error: ${result.error}`);
      }
    });
    
    if (report.summary.successfulTests === report.summary.totalTests && report.summary.totalTests > 0) {
      console.log('\n🎉 All local model tests passed! System ready for on-premises deployment.');
    } else if (report.summary.successfulTests > 0) {
      console.log('\n⚠️  Partial success. Some tests passed, system partially functional.');
    } else {
      console.log('\n❌ No tests passed. Check Ollama installation and model availability.');
    }
  }
}

module.exports = { LocalModelTester };

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new LocalModelTester();
  
  tester.runComprehensiveTest()
    .then(report => {
      console.log('\n📄 Test completed. Full report available in returned object.');
      
      // Save report to file
      const reportPath = path.join(__dirname, 'local-model-test-report.json');
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`📁 Detailed report saved to: ${reportPath}`);
    })
    .catch(error => {
      console.error('Test failed:', error.message);
    });
}
