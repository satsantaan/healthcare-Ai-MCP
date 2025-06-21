// AI Provider Integration Testing Module
const axios = require('axios');
require('dotenv').config();

class AIProviderTester {
  constructor() {
    this.providers = {
      openai: {
        name: 'OpenAI',
        baseUrl: 'https://api.openai.com/v1',
        apiKey: process.env.OPENAI_API_KEY,
        testEndpoint: '/models',
        chatEndpoint: '/chat/completions',
        status: 'not_tested',
        models: ['gpt-4', 'gpt-3.5-turbo']
      },
      anthropic: {
        name: 'Anthropic',
        baseUrl: 'https://api.anthropic.com/v1',
        apiKey: process.env.ANTHROPIC_API_KEY,
        testEndpoint: '/messages',
        chatEndpoint: '/messages',
        status: 'not_tested',
        models: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229']
      },
      google: {
        name: 'Google Gemini',
        baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
        apiKey: process.env.GOOGLE_API_KEY,
        testEndpoint: '/models',
        chatEndpoint: '/models/gemini-pro:generateContent',
        status: 'not_tested',
        models: ['gemini-pro', 'gemini-pro-vision']
      },
      local: {
        name: 'Local Model (Ollama)',
        baseUrl: process.env.OLLAMA_URL || 'http://localhost:11434',
        apiKey: null, // No API key needed for local
        testEndpoint: '/api/tags',
        chatEndpoint: '/api/generate',
        status: 'not_tested',
        models: ['llama2', 'mistral', 'codellama']
      }
    };
  }

  async testAllProviders() {
    console.log('\n🤖 Testing AI Provider Integrations...');
    console.log('=====================================');
    
    const results = {};
    
    for (const [key, provider] of Object.entries(this.providers)) {
      console.log(`\n🔍 Testing ${provider.name}...`);
      
      try {
        const connectionResult = await this.testProviderConnection(provider);
        results[key] = connectionResult;
        
        if (connectionResult.connected) {
          console.log(`  ✅ ${provider.name}: Connected`);
          console.log(`     Response Time: ${connectionResult.responseTime}ms`);
          
          // Test AI inference
          const inferenceResult = await this.testAIInference(provider);
          results[key].inference = inferenceResult;
          
          if (inferenceResult.success) {
            console.log(`  🧠 AI Inference: Success`);
            console.log(`     Response Length: ${inferenceResult.responseLength} chars`);
            console.log(`     Model Used: ${inferenceResult.model}`);
          } else {
            console.log(`  ⚠️  AI Inference: ${inferenceResult.error}`);
          }
        } else {
          console.log(`  ❌ ${provider.name}: ${connectionResult.error}`);
          if (connectionResult.reason === 'no_api_key') {
            console.log(`     Reason: API key not configured`);
          } else if (connectionResult.reason === 'service_unavailable') {
            console.log(`     Reason: Service not available`);
          }
        }
      } catch (error) {
        console.log(`  ❌ ${provider.name}: Unexpected error - ${error.message}`);
        results[key] = {
          connected: false,
          error: error.message,
          reason: 'unexpected_error'
        };
      }
    }
    
    return results;
  }

  async testProviderConnection(provider) {
    const startTime = Date.now();
    
    try {
      // Skip if no API key for cloud providers
      if (!provider.apiKey && provider.name !== 'Local Model (Ollama)') {
        return {
          connected: false,
          error: 'API key not configured',
          reason: 'no_api_key',
          responseTime: 0
        };
      }
      
      const headers = {};
      
      // Set up authentication headers
      if (provider.name === 'OpenAI') {
        headers['Authorization'] = `Bearer ${provider.apiKey}`;
      } else if (provider.name === 'Anthropic') {
        headers['x-api-key'] = provider.apiKey;
        headers['anthropic-version'] = '2023-06-01';
      } else if (provider.name === 'Google Gemini') {
        // Google uses API key as query parameter
      }
      
      headers['Content-Type'] = 'application/json';
      
      let url = `${provider.baseUrl}${provider.testEndpoint}`;
      if (provider.name === 'Google Gemini') {
        url += `?key=${provider.apiKey}`;
      }
      
      const response = await axios.get(url, {
        headers,
        timeout: 10000,
        validateStatus: (status) => status < 500
      });
      
      const responseTime = Date.now() - startTime;
      
      return {
        connected: response.status < 400,
        status: response.status,
        responseTime,
        data: response.data,
        availableModels: this.extractModels(response.data, provider.name)
      };
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      if (error.code === 'ECONNREFUSED') {
        return {
          connected: false,
          error: 'Service not available',
          reason: 'service_unavailable',
          responseTime
        };
      } else if (error.response?.status === 401) {
        return {
          connected: false,
          error: 'Authentication failed',
          reason: 'invalid_api_key',
          responseTime
        };
      } else {
        return {
          connected: false,
          error: error.message,
          reason: 'connection_error',
          responseTime
        };
      }
    }
  }

  async testAIInference(provider) {
    try {
      const testPrompt = "Summarize the following patient data: 45-year-old male with hypertension and diabetes, presenting for routine follow-up.";
      
      let requestData, headers = {};
      
      if (provider.name === 'OpenAI') {
        headers['Authorization'] = `Bearer ${provider.apiKey}`;
        headers['Content-Type'] = 'application/json';
        requestData = {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: testPrompt }],
          max_tokens: 150
        };
      } else if (provider.name === 'Anthropic') {
        headers['x-api-key'] = provider.apiKey;
        headers['anthropic-version'] = '2023-06-01';
        headers['Content-Type'] = 'application/json';
        requestData = {
          model: 'claude-3-sonnet-20240229',
          max_tokens: 150,
          messages: [{ role: 'user', content: testPrompt }]
        };
      } else if (provider.name === 'Google Gemini') {
        headers['Content-Type'] = 'application/json';
        requestData = {
          contents: [{ parts: [{ text: testPrompt }] }],
          generationConfig: { maxOutputTokens: 150 }
        };
      } else if (provider.name === 'Local Model (Ollama)') {
        headers['Content-Type'] = 'application/json';
        requestData = {
          model: 'llama2',
          prompt: testPrompt,
          stream: false
        };
      }
      
      let url = `${provider.baseUrl}${provider.chatEndpoint}`;
      if (provider.name === 'Google Gemini') {
        url += `?key=${provider.apiKey}`;
      }
      
      const response = await axios.post(url, requestData, {
        headers,
        timeout: 30000
      });
      
      const responseText = this.extractResponseText(response.data, provider.name);
      
      return {
        success: true,
        responseLength: responseText.length,
        model: this.extractModelUsed(response.data, provider.name),
        sampleResponse: responseText.substring(0, 100) + '...',
        fullResponse: responseText
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  extractModels(data, providerName) {
    if (providerName === 'OpenAI' && data.data) {
      return data.data.map(model => model.id).slice(0, 5);
    } else if (providerName === 'Google Gemini' && data.models) {
      return data.models.map(model => model.name).slice(0, 5);
    } else if (providerName === 'Local Model (Ollama)' && data.models) {
      return data.models.map(model => model.name).slice(0, 5);
    }
    return [];
  }

  extractResponseText(data, providerName) {
    if (providerName === 'OpenAI') {
      return data.choices?.[0]?.message?.content || 'No response';
    } else if (providerName === 'Anthropic') {
      return data.content?.[0]?.text || 'No response';
    } else if (providerName === 'Google Gemini') {
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    } else if (providerName === 'Local Model (Ollama)') {
      return data.response || 'No response';
    }
    return 'Unknown response format';
  }

  extractModelUsed(data, providerName) {
    if (providerName === 'OpenAI') {
      return data.model || 'unknown';
    } else if (providerName === 'Anthropic') {
      return data.model || 'unknown';
    } else if (providerName === 'Google Gemini') {
      return 'gemini-pro';
    } else if (providerName === 'Local Model (Ollama)') {
      return data.model || 'unknown';
    }
    return 'unknown';
  }

  generateAIIntegrationReport(results) {
    console.log('\n📊 AI Provider Integration Report');
    console.log('=================================');
    
    const totalProviders = Object.keys(results).length;
    const connectedProviders = Object.values(results).filter(r => r.connected).length;
    const workingInference = Object.values(results).filter(r => r.inference?.success).length;
    
    console.log(`Total AI Providers Tested: ${totalProviders}`);
    console.log(`Successfully Connected: ${connectedProviders}`);
    console.log(`Working AI Inference: ${workingInference}`);
    console.log(`Connection Success Rate: ${((connectedProviders / totalProviders) * 100).toFixed(1)}%`);
    console.log(`Inference Success Rate: ${((workingInference / totalProviders) * 100).toFixed(1)}%`);
    
    console.log('\n📋 Provider Details:');
    Object.entries(results).forEach(([key, result]) => {
      const provider = this.providers[key];
      console.log(`\n${provider.name}:`);
      console.log(`  Connection: ${result.connected ? '✅ Connected' : '❌ Disconnected'}`);
      
      if (result.connected) {
        console.log(`  Response Time: ${result.responseTime}ms`);
        console.log(`  Available Models: ${result.availableModels?.length || 0}`);
        
        if (result.inference?.success) {
          console.log(`  AI Inference: ✅ Working`);
          console.log(`  Model Used: ${result.inference.model}`);
          console.log(`  Sample Response: "${result.inference.sampleResponse}"`);
        } else if (result.inference) {
          console.log(`  AI Inference: ❌ Failed - ${result.inference.error}`);
        }
      } else {
        console.log(`  Error: ${result.error}`);
        console.log(`  Reason: ${result.reason}`);
        
        if (result.reason === 'no_api_key') {
          console.log(`  Solution: Set ${key.toUpperCase()}_API_KEY environment variable`);
        }
      }
    });
    
    return {
      totalProviders,
      connectedProviders,
      workingInference,
      connectionSuccessRate: ((connectedProviders / totalProviders) * 100).toFixed(1),
      inferenceSuccessRate: ((workingInference / totalProviders) * 100).toFixed(1),
      details: results
    };
  }

  async testHealthcareSpecificPrompts() {
    console.log('\n🏥 Testing Healthcare-Specific AI Prompts...');
    console.log('============================================');
    
    const healthcarePrompts = [
      {
        name: 'Clinical Documentation',
        prompt: 'Generate a clinical note for: 65-year-old female with chest pain, BP 150/95, HR 88, presenting to ED.'
      },
      {
        name: 'ICD-10 Coding',
        prompt: 'Extract ICD-10 codes from: Patient diagnosed with essential hypertension and type 2 diabetes mellitus without complications.'
      },
      {
        name: 'Drug Interaction Check',
        prompt: 'Check for interactions between: Warfarin 5mg daily, Metformin 500mg BID, and Lisinopril 10mg daily.'
      }
    ];
    
    const workingProviders = Object.entries(this.providers).filter(([key, provider]) => 
      provider.apiKey || provider.name === 'Local Model (Ollama)'
    );
    
    if (workingProviders.length === 0) {
      console.log('⚠️  No API keys configured for healthcare prompt testing');
      return {};
    }
    
    const results = {};
    
    for (const [key, provider] of workingProviders.slice(0, 1)) { // Test only first available provider
      console.log(`\nTesting with ${provider.name}:`);
      results[key] = {};
      
      for (const prompt of healthcarePrompts) {
        console.log(`  📝 ${prompt.name}...`);
        
        try {
          const result = await this.testSpecificPrompt(provider, prompt.prompt);
          results[key][prompt.name] = result;
          
          if (result.success) {
            console.log(`    ✅ Success (${result.responseLength} chars)`);
            console.log(`    Preview: "${result.sampleResponse}"`);
          } else {
            console.log(`    ❌ Failed: ${result.error}`);
          }
        } catch (error) {
          console.log(`    ❌ Error: ${error.message}`);
          results[key][prompt.name] = { success: false, error: error.message };
        }
      }
    }
    
    return results;
  }

  async testSpecificPrompt(provider, prompt) {
    // Reuse the inference testing logic
    const originalChatEndpoint = provider.chatEndpoint;
    const result = await this.testAIInference({ ...provider, testPrompt: prompt });
    return result;
  }
}

module.exports = { AIProviderTester };

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new AIProviderTester();
  
  async function runAITests() {
    console.log('🚀 Starting AI Provider Integration Tests...');
    
    // Test all providers
    const results = await tester.testAllProviders();
    const report = tester.generateAIIntegrationReport(results);
    
    // Test healthcare-specific prompts
    const healthcareResults = await tester.testHealthcareSpecificPrompts();
    
    console.log('\n🎯 Test Summary:');
    console.log(`AI Providers Available: ${report.totalProviders}`);
    console.log(`Successfully Connected: ${report.connectedProviders}`);
    console.log(`Working AI Inference: ${report.workingInference}`);
    
    return { report, healthcareResults };
  }
  
  runAITests().catch(console.error);
}
