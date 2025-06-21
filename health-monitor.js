// Comprehensive Health Monitoring System
const axios = require('axios');
const fs = require('fs');
const path = require('path');

class HealthMonitor {
  constructor() {
    this.baseUrl = process.env.API_BASE_URL || 'http://localhost:3001/api';
    this.components = {
      api: { name: 'API Server', endpoint: '/health' },
      database: { name: 'Database', endpoint: '/health/detailed' },
      emr: { name: 'EMR Systems', endpoint: '/emr/systems' },
      ai: { name: 'AI Providers', endpoint: '/ai/providers' },
      mcp: { name: 'MCP Functions', endpoint: '/mcp/status' }
    };
    this.authToken = null;
  }

  async authenticate() {
    try {
      const response = await axios.post(`${this.baseUrl}/auth/login`, {
        username: 'admin',
        password: 'admin123456'
      });
      
      if (response.data.success) {
        this.authToken = response.data.data.token;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Authentication failed:', error.message);
      return false;
    }
  }

  async checkComponentHealth(component) {
    const startTime = Date.now();
    
    try {
      const headers = {};
      if (this.authToken && !component.endpoint.includes('/health')) {
        headers.Authorization = `Bearer ${this.authToken}`;
      }
      
      const response = await axios.get(`${this.baseUrl}${component.endpoint}`, {
        headers,
        timeout: 10000
      });
      
      const responseTime = Date.now() - startTime;
      
      return {
        name: component.name,
        status: 'healthy',
        responseTime,
        statusCode: response.status,
        data: response.data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      return {
        name: component.name,
        status: 'unhealthy',
        responseTime,
        error: error.message,
        statusCode: error.response?.status || 0,
        timestamp: new Date().toISOString()
      };
    }
  }

  async performComprehensiveHealthCheck() {
    console.log('\n🏥 Comprehensive System Health Check');
    console.log('====================================');
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log(`Target API: ${this.baseUrl}`);
    
    const results = {
      overall: 'unknown',
      timestamp: new Date().toISOString(),
      components: {},
      summary: {
        total: 0,
        healthy: 0,
        unhealthy: 0,
        avgResponseTime: 0
      }
    };
    
    // Authenticate first
    console.log('\n🔐 Authenticating...');
    const authSuccess = await this.authenticate();
    if (authSuccess) {
      console.log('  ✅ Authentication successful');
    } else {
      console.log('  ❌ Authentication failed');
    }
    
    // Check each component
    console.log('\n📊 Component Health Checks:');
    
    const totalResponseTime = [];
    
    for (const [key, component] of Object.entries(this.components)) {
      console.log(`\n🔍 Checking ${component.name}...`);
      
      const health = await this.checkComponentHealth(component);
      results.components[key] = health;
      
      if (health.status === 'healthy') {
        console.log(`  ✅ ${component.name}: Healthy (${health.responseTime}ms)`);
        results.summary.healthy++;
        
        // Log specific component details
        if (key === 'emr' && health.data.success) {
          console.log(`     EMR Systems: ${health.data.data.length} configured`);
        } else if (key === 'ai' && health.data.success) {
          const connectedProviders = health.data.data.filter(p => p.status === 'connected').length;
          console.log(`     AI Providers: ${connectedProviders}/${health.data.data.length} connected`);
        } else if (key === 'mcp' && health.data.success) {
          console.log(`     Active Connections: ${health.data.data.activeConnections}`);
          console.log(`     Avg Response Time: ${health.data.data.avgResponseTime}ms`);
        }
      } else {
        console.log(`  ❌ ${component.name}: Unhealthy - ${health.error}`);
        results.summary.unhealthy++;
      }
      
      totalResponseTime.push(health.responseTime);
      results.summary.total++;
    }
    
    // Calculate overall health
    results.summary.avgResponseTime = Math.round(
      totalResponseTime.reduce((a, b) => a + b, 0) / totalResponseTime.length
    );
    
    const healthPercentage = (results.summary.healthy / results.summary.total) * 100;
    
    if (healthPercentage === 100) {
      results.overall = 'healthy';
    } else if (healthPercentage >= 80) {
      results.overall = 'warning';
    } else {
      results.overall = 'critical';
    }
    
    // Display summary
    console.log('\n📈 Health Check Summary:');
    console.log('========================');
    console.log(`Overall Status: ${this.getStatusEmoji(results.overall)} ${results.overall.toUpperCase()}`);
    console.log(`Components Checked: ${results.summary.total}`);
    console.log(`Healthy Components: ${results.summary.healthy} ✅`);
    console.log(`Unhealthy Components: ${results.summary.unhealthy} ❌`);
    console.log(`Health Percentage: ${healthPercentage.toFixed(1)}%`);
    console.log(`Average Response Time: ${results.summary.avgResponseTime}ms`);
    
    return results;
  }

  getStatusEmoji(status) {
    switch (status) {
      case 'healthy': return '✅';
      case 'warning': return '⚠️';
      case 'critical': return '❌';
      default: return '❓';
    }
  }

  async testEndToEndWorkflow() {
    console.log('\n🔄 End-to-End Workflow Test');
    console.log('============================');
    
    const workflow = {
      steps: [
        { name: 'Authentication', status: 'pending' },
        { name: 'EMR Data Retrieval', status: 'pending' },
        { name: 'AI Processing', status: 'pending' },
        { name: 'MCP Function Execution', status: 'pending' },
        { name: 'Result Validation', status: 'pending' }
      ],
      startTime: Date.now(),
      endTime: null,
      success: false
    };
    
    try {
      // Step 1: Authentication
      console.log('\n1️⃣ Testing Authentication...');
      const authResult = await this.authenticate();
      if (authResult) {
        workflow.steps[0].status = 'success';
        console.log('   ✅ Authentication successful');
      } else {
        workflow.steps[0].status = 'failed';
        console.log('   ❌ Authentication failed');
        return workflow;
      }
      
      // Step 2: EMR Data Retrieval
      console.log('\n2️⃣ Testing EMR Data Retrieval...');
      try {
        const emrResponse = await axios.get(`${this.baseUrl}/emr/systems`, {
          headers: { Authorization: `Bearer ${this.authToken}` }
        });
        
        if (emrResponse.data.success && emrResponse.data.data.length > 0) {
          workflow.steps[1].status = 'success';
          console.log(`   ✅ Retrieved ${emrResponse.data.data.length} EMR systems`);
        } else {
          workflow.steps[1].status = 'failed';
          console.log('   ❌ No EMR systems found');
        }
      } catch (error) {
        workflow.steps[1].status = 'failed';
        console.log(`   ❌ EMR retrieval failed: ${error.message}`);
      }
      
      // Step 3: AI Processing (Mock)
      console.log('\n3️⃣ Testing AI Processing...');
      try {
        const aiResponse = await axios.get(`${this.baseUrl}/ai/providers`, {
          headers: { Authorization: `Bearer ${this.authToken}` }
        });
        
        if (aiResponse.data.success) {
          workflow.steps[2].status = 'success';
          console.log(`   ✅ AI providers accessible (${aiResponse.data.data.length} providers)`);
        } else {
          workflow.steps[2].status = 'failed';
          console.log('   ❌ AI providers not accessible');
        }
      } catch (error) {
        workflow.steps[2].status = 'failed';
        console.log(`   ❌ AI processing failed: ${error.message}`);
      }
      
      // Step 4: MCP Function Execution
      console.log('\n4️⃣ Testing MCP Function Execution...');
      try {
        const mcpResponse = await axios.post(`${this.baseUrl}/mcp/execute`, {
          functionName: 'generate_clinical_note',
          parameters: {
            patientData: {
              complaint: 'Health check test',
              vitals: { bp: '120/80', hr: '72' }
            }
          }
        }, {
          headers: { Authorization: `Bearer ${this.authToken}` }
        });
        
        if (mcpResponse.data.success) {
          workflow.steps[3].status = 'success';
          console.log('   ✅ MCP function executed successfully');
          console.log(`   📝 Generated note: ${mcpResponse.data.data.result.note.substring(0, 100)}...`);
        } else {
          workflow.steps[3].status = 'failed';
          console.log('   ❌ MCP function execution failed');
        }
      } catch (error) {
        workflow.steps[3].status = 'failed';
        console.log(`   ❌ MCP execution failed: ${error.message}`);
      }
      
      // Step 5: Result Validation
      console.log('\n5️⃣ Validating Results...');
      const successfulSteps = workflow.steps.filter(step => step.status === 'success').length;
      const totalSteps = workflow.steps.length;
      
      if (successfulSteps === totalSteps) {
        workflow.steps[4].status = 'success';
        workflow.success = true;
        console.log('   ✅ All workflow steps completed successfully');
      } else {
        workflow.steps[4].status = 'partial';
        console.log(`   ⚠️  Partial success: ${successfulSteps}/${totalSteps} steps completed`);
      }
      
    } catch (error) {
      console.log(`   ❌ Workflow failed: ${error.message}`);
    }
    
    workflow.endTime = Date.now();
    workflow.duration = workflow.endTime - workflow.startTime;
    
    console.log('\n📊 Workflow Summary:');
    console.log('====================');
    workflow.steps.forEach((step, index) => {
      const emoji = step.status === 'success' ? '✅' : step.status === 'failed' ? '❌' : '⚠️';
      console.log(`${index + 1}. ${step.name}: ${emoji} ${step.status}`);
    });
    console.log(`Total Duration: ${workflow.duration}ms`);
    console.log(`Overall Success: ${workflow.success ? '✅ YES' : '❌ NO'}`);
    
    return workflow;
  }

  async generateHealthReport() {
    const healthCheck = await this.performComprehensiveHealthCheck();
    const workflowTest = await this.testEndToEndWorkflow();
    
    const report = {
      timestamp: new Date().toISOString(),
      system: {
        overall: healthCheck.overall,
        components: healthCheck.components,
        summary: healthCheck.summary
      },
      workflow: {
        success: workflowTest.success,
        duration: workflowTest.duration,
        steps: workflowTest.steps
      },
      recommendations: this.generateRecommendations(healthCheck, workflowTest)
    };
    
    // Save report to file
    const reportPath = path.join(__dirname, 'health-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Health report saved to: ${reportPath}`);
    
    return report;
  }

  generateRecommendations(healthCheck, workflowTest) {
    const recommendations = [];
    
    if (healthCheck.summary.unhealthy > 0) {
      recommendations.push('🔧 Fix unhealthy components before production deployment');
    }
    
    if (healthCheck.summary.avgResponseTime > 1000) {
      recommendations.push('⚡ Optimize response times - current average exceeds 1 second');
    }
    
    if (!workflowTest.success) {
      recommendations.push('🔄 Complete end-to-end workflow testing before going live');
    }
    
    const aiComponent = healthCheck.components.ai;
    if (aiComponent && aiComponent.data?.data) {
      const connectedProviders = aiComponent.data.data.filter(p => p.status === 'connected').length;
      if (connectedProviders === 0) {
        recommendations.push('🤖 Configure at least one AI provider API key for full functionality');
      }
    }
    
    if (recommendations.length === 0) {
      recommendations.push('🎉 System is healthy and ready for production deployment!');
    }
    
    return recommendations;
  }
}

module.exports = { HealthMonitor };

// Run health check if this file is executed directly
if (require.main === module) {
  const monitor = new HealthMonitor();
  
  async function runHealthCheck() {
    console.log('🚀 Starting Comprehensive Health Check...');
    
    try {
      const report = await monitor.generateHealthReport();
      
      console.log('\n🎯 Final Recommendations:');
      console.log('=========================');
      report.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });
      
      return report;
    } catch (error) {
      console.error('Health check failed:', error.message);
      return null;
    }
  }
  
  runHealthCheck().catch(console.error);
}
