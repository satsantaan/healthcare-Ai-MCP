// EMR Integration Status and Testing Module
const axios = require('axios');

class EMRIntegrationTester {
  constructor() {
    this.emrSystems = {
      openMRS: {
        name: 'OpenMRS',
        baseUrl: process.env.OPENMRS_URL || 'http://localhost:8080/openmrs',
        apiPath: '/ws/rest/v1',
        status: 'not_configured',
        testEndpoints: ['/patient', '/encounter', '/obs'],
        credentials: {
          username: process.env.OPENMRS_USER || 'admin',
          password: process.env.OPENMRS_PASS || 'Admin123'
        }
      },
      openEMR: {
        name: 'OpenEMR',
        baseUrl: process.env.OPENEMR_URL || 'http://localhost:8080/openemr',
        apiPath: '/apis/default',
        status: 'not_configured',
        testEndpoints: ['/patient', '/encounter', '/practitioner'],
        credentials: {
          clientId: process.env.OPENEMR_CLIENT_ID,
          clientSecret: process.env.OPENEMR_CLIENT_SECRET
        }
      },
      gnuHealth: {
        name: 'GNU Health',
        baseUrl: process.env.GNUHEALTH_URL || 'http://localhost:8000',
        apiPath: '/api/v1',
        status: 'not_configured',
        testEndpoints: ['/patient', '/appointment', '/health_professional'],
        credentials: {
          username: process.env.GNUHEALTH_USER || 'admin',
          password: process.env.GNUHEALTH_PASS || 'admin'
        }
      },
      freeMED: {
        name: 'FreeMED',
        baseUrl: process.env.FREEMED_URL || 'http://localhost:8080/freemed',
        apiPath: '/api',
        status: 'not_configured',
        testEndpoints: ['/patient', '/provider', '/facility'],
        credentials: {
          username: process.env.FREEMED_USER || 'admin',
          password: process.env.FREEMED_PASS || 'password'
        }
      },
      oscarEMR: {
        name: 'OSCAR EMR',
        baseUrl: process.env.OSCAR_URL || 'http://localhost:8080/oscar',
        apiPath: '/ws',
        status: 'not_configured',
        testEndpoints: ['/DemographicService', '/ProviderService'],
        credentials: {
          username: process.env.OSCAR_USER || 'admin',
          password: process.env.OSCAR_PASS || 'password'
        }
      }
    };
  }

  async testEMRConnections() {
    console.log('\n🏥 Testing Open Source EMR Connections...');
    console.log('================================================');
    
    const results = {};
    
    for (const [key, emr] of Object.entries(this.emrSystems)) {
      console.log(`\n📋 Testing ${emr.name}...`);
      
      try {
        const connectionResult = await this.testEMRConnection(emr);
        results[key] = connectionResult;
        
        if (connectionResult.connected) {
          console.log(`  ✅ ${emr.name}: Connected`);
          console.log(`     Base URL: ${emr.baseUrl}`);
          console.log(`     Response Time: ${connectionResult.responseTime}ms`);
          
          // Test data extraction
          const dataResult = await this.testDataExtraction(emr);
          results[key].dataExtraction = dataResult;
          
          if (dataResult.success) {
            console.log(`  📊 Data Extraction: Success`);
            console.log(`     Records Found: ${dataResult.recordCount}`);
          } else {
            console.log(`  ⚠️  Data Extraction: ${dataResult.error}`);
          }
        } else {
          console.log(`  ❌ ${emr.name}: ${connectionResult.error}`);
          console.log(`     This is expected if ${emr.name} is not installed locally`);
        }
      } catch (error) {
        console.log(`  ❌ ${emr.name}: Connection failed - ${error.message}`);
        results[key] = {
          connected: false,
          error: error.message,
          expected: true // Expected failure for demo purposes
        };
      }
    }
    
    return results;
  }

  async testEMRConnection(emr) {
    const startTime = Date.now();
    
    try {
      // Test basic connectivity
      const response = await axios.get(`${emr.baseUrl}${emr.apiPath}`, {
        timeout: 5000,
        auth: emr.credentials.username ? {
          username: emr.credentials.username,
          password: emr.credentials.password
        } : undefined,
        validateStatus: () => true // Accept any status code
      });
      
      const responseTime = Date.now() - startTime;
      
      return {
        connected: response.status < 500,
        status: response.status,
        responseTime,
        headers: response.headers,
        version: response.headers['x-api-version'] || 'unknown'
      };
    } catch (error) {
      return {
        connected: false,
        error: error.code === 'ECONNREFUSED' ? 'Service not running' : error.message,
        responseTime: Date.now() - startTime
      };
    }
  }

  async testDataExtraction(emr) {
    try {
      // Test patient data extraction
      const patientResponse = await axios.get(
        `${emr.baseUrl}${emr.apiPath}${emr.testEndpoints[0]}`,
        {
          timeout: 10000,
          auth: emr.credentials.username ? {
            username: emr.credentials.username,
            password: emr.credentials.password
          } : undefined,
          params: { limit: 10 }
        }
      );
      
      const data = patientResponse.data;
      
      return {
        success: true,
        recordCount: Array.isArray(data) ? data.length : (data.results ? data.results.length : 1),
        sampleData: this.sanitizePatientData(data),
        fields: this.extractFieldNames(data)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  sanitizePatientData(data) {
    // Remove sensitive information for demo purposes
    if (Array.isArray(data)) {
      return data.slice(0, 2).map(item => this.sanitizeRecord(item));
    } else if (data.results) {
      return data.results.slice(0, 2).map(item => this.sanitizeRecord(item));
    } else {
      return this.sanitizeRecord(data);
    }
  }

  sanitizeRecord(record) {
    const sanitized = { ...record };
    
    // Remove or mask sensitive fields
    const sensitiveFields = ['ssn', 'socialSecurityNumber', 'phone', 'email', 'address'];
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });
    
    // Mask names
    if (sanitized.name) {
      sanitized.name = 'Patient [REDACTED]';
    }
    if (sanitized.firstName) {
      sanitized.firstName = '[REDACTED]';
    }
    if (sanitized.lastName) {
      sanitized.lastName = '[REDACTED]';
    }
    
    return sanitized;
  }

  extractFieldNames(data) {
    const sample = Array.isArray(data) ? data[0] : (data.results ? data.results[0] : data);
    return sample ? Object.keys(sample) : [];
  }

  generateEMRIntegrationReport(results) {
    console.log('\n📊 EMR Integration Status Report');
    console.log('================================');
    
    const totalSystems = Object.keys(results).length;
    const connectedSystems = Object.values(results).filter(r => r.connected).length;
    const successRate = ((connectedSystems / totalSystems) * 100).toFixed(1);
    
    console.log(`Total EMR Systems Tested: ${totalSystems}`);
    console.log(`Successfully Connected: ${connectedSystems}`);
    console.log(`Connection Success Rate: ${successRate}%`);
    
    console.log('\n📋 Individual System Status:');
    Object.entries(results).forEach(([key, result]) => {
      const emr = this.emrSystems[key];
      console.log(`\n${emr.name}:`);
      console.log(`  Status: ${result.connected ? '✅ Connected' : '❌ Disconnected'}`);
      console.log(`  URL: ${emr.baseUrl}`);
      
      if (result.connected) {
        console.log(`  Response Time: ${result.responseTime}ms`);
        console.log(`  API Version: ${result.version}`);
        
        if (result.dataExtraction?.success) {
          console.log(`  Data Records: ${result.dataExtraction.recordCount}`);
          console.log(`  Available Fields: ${result.dataExtraction.fields.length}`);
        }
      } else {
        console.log(`  Error: ${result.error}`);
        if (result.expected) {
          console.log(`  Note: This is expected for demo environment`);
        }
      }
    });
    
    return {
      totalSystems,
      connectedSystems,
      successRate,
      details: results
    };
  }
}

// Mock EMR data for demonstration when real EMRs aren't available
class MockEMRDataGenerator {
  generateMockPatientData() {
    return {
      patients: [
        {
          id: 'patient-001',
          mrn: 'MRN123456',
          demographics: {
            ageGroup: 'adult',
            gender: 'M',
            zipCode: '12345'
          },
          vitals: {
            bloodPressure: '120/80',
            heartRate: 72,
            temperature: 98.6,
            weight: 180,
            height: 70
          },
          conditions: ['Hypertension', 'Type 2 Diabetes'],
          medications: ['Metformin 500mg', 'Lisinopril 10mg'],
          allergies: ['Penicillin'],
          lastVisit: '2025-06-15'
        },
        {
          id: 'patient-002',
          mrn: 'MRN789012',
          demographics: {
            ageGroup: 'geriatric',
            gender: 'F',
            zipCode: '67890'
          },
          vitals: {
            bloodPressure: '140/90',
            heartRate: 85,
            temperature: 99.1,
            weight: 145,
            height: 65
          },
          conditions: ['Osteoarthritis', 'Hyperlipidemia'],
          medications: ['Atorvastatin 20mg', 'Ibuprofen 400mg'],
          allergies: [],
          lastVisit: '2025-06-20'
        }
      ],
      encounters: [
        {
          id: 'encounter-001',
          patientId: 'patient-001',
          type: 'office-visit',
          date: '2025-06-15',
          provider: 'Dr. Smith',
          chiefComplaint: 'Routine follow-up',
          diagnosis: ['Essential hypertension', 'Type 2 diabetes mellitus'],
          procedures: ['Blood pressure check', 'Blood glucose test']
        }
      ],
      observations: [
        {
          id: 'obs-001',
          patientId: 'patient-001',
          type: 'vital-signs',
          date: '2025-06-15',
          values: {
            systolic: 125,
            diastolic: 82,
            pulse: 74
          }
        }
      ]
    };
  }

  generateHL7Message() {
    return `MSH|^~\\&|SENDING_APP|SENDING_FACILITY|RECEIVING_APP|RECEIVING_FACILITY|20250621080000||ADT^A01|MSG123456|P|2.5
EVN|A01|20250621080000
PID|1||MRN123456||DOE^JOHN^MIDDLE||19800101|M||2106-3|123 MAIN ST^^ANYTOWN^ST^12345||(555)123-4567||(555)987-6543||S||SSN123456789|DL123456789
PV1|1|I|ICU^101^1|E||123456^SMITH^JOHN^J^DR^MD|123456^JONES^MARY^M^DR^MD|MED||||19||123456^SMITH^JOHN^J^DR^MD|IP|A|||123456^SMITH^JOHN^J^DR^MD||V|||||||||||||||||||||20250621080000`;
  }

  generateFHIRResource() {
    return {
      resourceType: 'Patient',
      id: 'patient-001',
      active: true,
      name: [
        {
          use: 'official',
          family: '[REDACTED]',
          given: ['[REDACTED]']
        }
      ],
      gender: 'male',
      birthDate: '1980-01-01',
      address: [
        {
          use: 'home',
          line: ['[REDACTED]'],
          city: '[REDACTED]',
          state: '[REDACTED]',
          postalCode: '[REDACTED]'
        }
      ],
      telecom: [
        {
          system: 'phone',
          value: '[REDACTED]',
          use: 'home'
        }
      ]
    };
  }
}

module.exports = {
  EMRIntegrationTester,
  MockEMRDataGenerator
};

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new EMRIntegrationTester();
  const mockData = new MockEMRDataGenerator();
  
  async function runEMRTests() {
    console.log('🚀 Starting EMR Integration Tests...');
    
    // Test EMR connections
    const results = await tester.testEMRConnections();
    const report = tester.generateEMRIntegrationReport(results);
    
    // Show mock data capabilities
    console.log('\n📊 Mock EMR Data Capabilities:');
    console.log('==============================');
    
    const mockPatients = mockData.generateMockPatientData();
    console.log(`Mock Patients Available: ${mockPatients.patients.length}`);
    console.log(`Mock Encounters Available: ${mockPatients.encounters.length}`);
    console.log(`Mock Observations Available: ${mockPatients.observations.length}`);
    
    console.log('\n📋 Sample HL7 Message:');
    console.log(mockData.generateHL7Message().substring(0, 200) + '...');
    
    console.log('\n📋 Sample FHIR Resource:');
    console.log(JSON.stringify(mockData.generateFHIRResource(), null, 2));
    
    return report;
  }
  
  runEMRTests().catch(console.error);
}
