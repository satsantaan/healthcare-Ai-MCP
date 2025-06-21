const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';
let authToken = null;

// Test configuration
const TEST_RESULTS = [];

async function makeRequest(method, endpoint, data = null, useAuth = true) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {},
    };
    
    if (useAuth && authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    
    if (data) {
      config.data = data;
      config.headers['Content-Type'] = 'application/json';
    }
    
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status || 500,
    };
  }
}

async function testHealthEndpoints() {
  console.log('\n🏥 Testing Health Endpoints...');
  
  const result = await makeRequest('GET', '/health', null, false);
  console.log(`  ${result.success ? '✅' : '❌'} Health Check: ${result.success ? 'PASS' : 'FAIL'}`);
  if (result.success) {
    console.log(`    Status: ${result.data.status}, Uptime: ${result.data.uptime}s`);
  }
  
  TEST_RESULTS.push({
    test: 'Health Check',
    passed: result.success,
    details: result.success ? 'OK' : result.error
  });
}

async function testAuthentication() {
  console.log('\n🔐 Testing Authentication...');
  
  // Test login with admin user
  const loginResult = await makeRequest('POST', '/auth/login', {
    username: 'admin',
    password: 'admin123456',
  }, false);
  
  if (loginResult.success && loginResult.data.data.token) {
    authToken = loginResult.data.data.token;
    console.log(`  ✅ Login: PASS - Token received`);
  } else {
    console.log(`  ❌ Login: FAIL - ${loginResult.error}`);
  }
  
  TEST_RESULTS.push({
    test: 'User Login',
    passed: loginResult.success && authToken !== null,
    details: loginResult.success ? 'OK' : loginResult.error
  });
  
  // Test profile access
  if (authToken) {
    const profileResult = await makeRequest('GET', '/auth/profile');
    console.log(`  ${profileResult.success ? '✅' : '❌'} Profile Access: ${profileResult.success ? 'PASS' : 'FAIL'}`);
    
    TEST_RESULTS.push({
      test: 'Profile Access',
      passed: profileResult.success,
      details: profileResult.success ? 'OK' : profileResult.error
    });
  }
}

async function testEMREndpoints() {
  console.log('\n🏥 Testing EMR Endpoints...');
  
  const systemsResult = await makeRequest('GET', '/emr/systems');
  console.log(`  ${systemsResult.success ? '✅' : '❌'} EMR Systems: ${systemsResult.success ? 'PASS' : 'FAIL'}`);
  if (systemsResult.success) {
    console.log(`    Found ${systemsResult.data.data.length} EMR systems`);
  }
  
  const metricsResult = await makeRequest('GET', '/emr/metrics');
  console.log(`  ${metricsResult.success ? '✅' : '❌'} EMR Metrics: ${metricsResult.success ? 'PASS' : 'FAIL'}`);
  
  TEST_RESULTS.push(
    {
      test: 'EMR Systems',
      passed: systemsResult.success,
      details: systemsResult.success ? 'OK' : systemsResult.error
    },
    {
      test: 'EMR Metrics',
      passed: metricsResult.success,
      details: metricsResult.success ? 'OK' : metricsResult.error
    }
  );
}

async function testAIEndpoints() {
  console.log('\n🤖 Testing AI Endpoints...');
  
  const modelsResult = await makeRequest('GET', '/ai/models');
  console.log(`  ${modelsResult.success ? '✅' : '❌'} AI Models: ${modelsResult.success ? 'PASS' : 'FAIL'}`);
  if (modelsResult.success) {
    console.log(`    Found ${modelsResult.data.data.length} AI models`);
  }
  
  const providersResult = await makeRequest('GET', '/ai/providers');
  console.log(`  ${providersResult.success ? '✅' : '❌'} AI Providers: ${providersResult.success ? 'PASS' : 'FAIL'}`);
  
  TEST_RESULTS.push(
    {
      test: 'AI Models',
      passed: modelsResult.success,
      details: modelsResult.success ? 'OK' : modelsResult.error
    },
    {
      test: 'AI Providers',
      passed: providersResult.success,
      details: providersResult.success ? 'OK' : providersResult.error
    }
  );
}

async function testMCPEndpoints() {
  console.log('\n⚡ Testing MCP Endpoints...');
  
  const statusResult = await makeRequest('GET', '/mcp/status');
  console.log(`  ${statusResult.success ? '✅' : '❌'} MCP Status: ${statusResult.success ? 'PASS' : 'FAIL'}`);
  
  const functionsResult = await makeRequest('GET', '/mcp/functions');
  console.log(`  ${functionsResult.success ? '✅' : '❌'} MCP Functions: ${functionsResult.success ? 'PASS' : 'FAIL'}`);
  if (functionsResult.success) {
    console.log(`    Found ${functionsResult.data.data.length} MCP functions`);
  }
  
  // Test MCP function execution
  const executeResult = await makeRequest('POST', '/mcp/execute', {
    functionName: 'generate_clinical_note',
    parameters: {
      patientData: { complaint: 'Routine checkup' }
    }
  });
  console.log(`  ${executeResult.success ? '✅' : '❌'} MCP Execution: ${executeResult.success ? 'PASS' : 'FAIL'}`);
  
  TEST_RESULTS.push(
    {
      test: 'MCP Status',
      passed: statusResult.success,
      details: statusResult.success ? 'OK' : statusResult.error
    },
    {
      test: 'MCP Functions',
      passed: functionsResult.success,
      details: functionsResult.success ? 'OK' : functionsResult.error
    },
    {
      test: 'MCP Execution',
      passed: executeResult.success,
      details: executeResult.success ? 'OK' : executeResult.error
    }
  );
}

async function generateTestReport() {
  console.log('\n📊 Test Results Summary');
  console.log('========================');
  
  const totalTests = TEST_RESULTS.length;
  const passedTests = TEST_RESULTS.filter(r => r.passed).length;
  const failedTests = totalTests - passedTests;
  
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests} ✅`);
  console.log(`Failed: ${failedTests} ❌`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  if (failedTests > 0) {
    console.log('\n❌ Failed Tests:');
    TEST_RESULTS
      .filter(r => !r.passed)
      .forEach(r => {
        console.log(`  - ${r.test}: ${r.details}`);
      });
  }
  
  return passedTests === totalTests;
}

async function runTests() {
  console.log('🚀 Starting API Tests...');
  console.log(`Testing API at: ${BASE_URL}`);
  
  try {
    await testHealthEndpoints();
    await testAuthentication();
    
    if (authToken) {
      await testEMREndpoints();
      await testAIEndpoints();
      await testMCPEndpoints();
    } else {
      console.log('\n⚠️  Skipping authenticated tests (login failed)');
    }
    
    const allTestsPassed = await generateTestReport();
    
    if (allTestsPassed) {
      console.log('\n🎉 All tests passed! System is ready for deployment.');
    } else {
      console.log('\n⚠️  Some tests failed. Please review the issues above.');
    }
    
    return allTestsPassed;
    
  } catch (error) {
    console.error('\n💥 Test runner failed:', error.message);
    return false;
  }
}

// Check if server is running first
async function checkServerHealth() {
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

async function main() {
  console.log('🔍 Checking if server is running...');
  
  const serverRunning = await checkServerHealth();
  
  if (!serverRunning) {
    console.log('❌ Server is not running. Please start the server first with: npm run server');
    console.log('   Then run this test with: node test-api.js');
    process.exit(1);
  }
  
  console.log('✅ Server is running, proceeding with tests...');
  
  const success = await runTests();
  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  main();
}

module.exports = { runTests };
