// Mock Services for Development and Testing

import { ApiResponse } from "./api";
import {
  MCPFunction,
  MCPServer,
  MCPMetrics,
  MCPSystemHealth,
  MCPFunctionCall,
  MCPFunctionResult,
} from "./mcpService";
import {
  EMRSystem,
  EMRConnection,
  HL7Message,
  FHIRResource,
  EMRMetrics,
} from "./emrService";
import {
  AIModel,
  AIProvider,
  TokenUsage,
  BudgetConfig,
  BudgetStatus,
  AIRequest,
  AISuggestion,
} from "./aiService";
import {
  AuditLog,
  ComplianceReport,
  BillingRecord,
  RevenueMetrics,
  SecurityEvent,
} from "./auditService";

// Utility function to create mock API response
function createMockResponse<T>(data: T): Promise<ApiResponse<T>> {
  return new Promise((resolve) => {
    setTimeout(
      () => {
        resolve({
          data,
          success: true,
          timestamp: new Date().toISOString(),
        });
      },
      Math.random() * 500 + 100,
    ); // Random delay 100-600ms
  });
}

// Mock MCP Service
export const mockMcpService = {
  async getSystemStatus(): Promise<ApiResponse<MCPMetrics>> {
    const data: MCPMetrics = {
      activeConnections: 47 + Math.floor(Math.random() * 10) - 5,
      totalRequests: 164892 + Math.floor(Math.random() * 100),
      avgResponseTime: 127 + Math.floor(Math.random() * 20) - 10,
      errorRate: 0.12 + Math.random() * 0.1,
      throughput: 1247 + Math.floor(Math.random() * 200) - 100,
      uptime: 99.9,
    };
    return createMockResponse(data);
  },

  async getServerStatus(): Promise<ApiResponse<MCPServer[]>> {
    const servers: MCPServer[] = [
      {
        id: "clinical-doc",
        name: "Clinical Documentation Server",
        status: "healthy",
        load: 68 + Math.floor(Math.random() * 10) - 5,
        requests: 45200 + Math.floor(Math.random() * 100),
        avgTime: 120,
        errors: 0.08,
        functions: [],
      },
      {
        id: "billing-coding",
        name: "Billing & Coding Server",
        status: "healthy",
        load: 72 + Math.floor(Math.random() * 10) - 5,
        requests: 38900 + Math.floor(Math.random() * 100),
        avgTime: 85,
        errors: 0.05,
        functions: [],
      },
      {
        id: "summary-gen",
        name: "Summary Generation Server",
        status: "healthy",
        load: 45 + Math.floor(Math.random() * 10) - 5,
        requests: 28400 + Math.floor(Math.random() * 100),
        avgTime: 95,
        errors: 0.15,
        functions: [],
      },
    ];
    return createMockResponse(servers);
  },

  async getSystemHealth(): Promise<ApiResponse<MCPSystemHealth>> {
    const data: MCPSystemHealth = {
      overall: 98.7,
      client: 99.2,
      server: 98.1,
      models: 97.8,
    };
    return createMockResponse(data);
  },

  async getFunctions(): Promise<ApiResponse<MCPFunction[]>> {
    const functions: MCPFunction[] = [
      {
        name: "generate_clinical_note",
        description: "Generate clinical documentation from patient data",
        server: "Clinical Documentation",
        category: "documentation",
      },
      {
        name: "extract_icd_codes",
        description: "Extract ICD-10 codes from clinical text",
        server: "Billing & Coding",
        category: "coding",
      },
      {
        name: "summarize_patient_history",
        description: "Create patient history summaries",
        server: "Summary Generation",
        category: "summary",
      },
    ];
    return createMockResponse(functions);
  },

  async executeFunction(
    call: MCPFunctionCall,
  ): Promise<ApiResponse<MCPFunctionResult>> {
    const result: MCPFunctionResult = {
      id: `exec_${Date.now()}`,
      functionName: call.functionName,
      result: { success: true, data: "Mock result data" },
      duration: Math.floor(Math.random() * 200) + 50,
      success: Math.random() > 0.05,
      timestamp: new Date().toISOString(),
    };
    return createMockResponse(result);
  },

  async getFunctionHistory(
    limit: number,
  ): Promise<ApiResponse<MCPFunctionResult[]>> {
    const history: MCPFunctionResult[] = Array.from(
      { length: Math.min(limit, 20) },
      (_, i) => ({
        id: `hist_${i}`,
        functionName: [
          "generate_clinical_note",
          "extract_icd_codes",
          "summarize_patient_history",
        ][i % 3],
        result: { success: true, data: `Mock result ${i}` },
        duration: Math.floor(Math.random() * 200) + 50,
        success: Math.random() > 0.05,
        timestamp: new Date(Date.now() - i * 60000).toISOString(),
      }),
    );
    return createMockResponse(history);
  },

  async healthCheck(): Promise<
    ApiResponse<{ status: string; servers: Record<string, boolean> }>
  > {
    const data = {
      status: "healthy",
      servers: {
        "clinical-doc": true,
        "billing-coding": true,
        "summary-gen": true,
      },
    };
    return createMockResponse(data);
  },
};

// Mock EMR Service
export const mockEmrService = {
  async getConnectedSystems(): Promise<ApiResponse<EMRSystem[]>> {
    const systems: EMRSystem[] = [
      {
        id: "1",
        name: "MedFlow EMR",
        version: "v4.2.1",
        status: "active",
        lastSync: new Date().toLocaleString(),
        apiCalls: 45200 + Math.floor(Math.random() * 100),
        type: "commercial",
        features: ["HL7", "FHIR", "Clinical Documentation"],
      },
      {
        id: "2",
        name: "HealthTech Pro",
        version: "v3.8.0",
        status: "active",
        lastSync: new Date().toLocaleString(),
        apiCalls: 38900 + Math.floor(Math.random() * 100),
        type: "commercial",
        features: ["HL7", "FHIR", "Billing"],
      },
      {
        id: "3",
        name: "OpenMRS",
        version: "v3.0.0",
        status: "active",
        lastSync: new Date().toLocaleString(),
        apiCalls: 12470 + Math.floor(Math.random() * 100),
        type: "open_source",
        features: ["FHIR", "Patient Management"],
        isDemo: true,
      },
    ];
    return createMockResponse(systems);
  },

  async getSystem(id: string): Promise<ApiResponse<EMRSystem>> {
    const systems = await this.getConnectedSystems();
    const system = systems.data.find((s) => s.id === id);
    if (!system) {
      throw new Error("System not found");
    }
    return createMockResponse(system);
  },

  async getConnectionStatus(
    systemId: string,
  ): Promise<ApiResponse<EMRConnection>> {
    const connection: EMRConnection = {
      id: `conn_${systemId}`,
      systemId,
      endpoint: `https://api.emr-${systemId}.com/v1`,
      status: "connected",
      lastHeartbeat: new Date().toISOString(),
      configuration: { timeout: 30000, retries: 3 },
    };
    return createMockResponse(connection);
  },

  async getMetrics(): Promise<ApiResponse<EMRMetrics>> {
    const metrics: EMRMetrics = {
      hl7Messages: 1247 + Math.floor(Math.random() * 10),
      fhirResources: 892 + Math.floor(Math.random() * 5),
      activeConnections: 24 + Math.floor(Math.random() * 6) - 3,
      lastActivity: new Date().toLocaleString(),
      totalSystems: 3,
      healthySystems: 3,
    };
    return createMockResponse(metrics);
  },

  async getHL7Messages(
    systemId?: string,
    limit = 50,
  ): Promise<ApiResponse<HL7Message[]>> {
    const messages: HL7Message[] = Array.from(
      { length: Math.min(limit, 10) },
      (_, i) => ({
        id: `hl7_${i}`,
        type: ["ADT^A01", "ORU^R01", "MDM^T02"][i % 3],
        content: `Mock HL7 message content ${i}`,
        timestamp: new Date(Date.now() - i * 30000).toISOString(),
        processed: true,
        emrSystemId: systemId || "1",
      }),
    );
    return createMockResponse(messages);
  },

  async getFHIRResources(
    systemId?: string,
    resourceType?: string,
    limit = 50,
  ): Promise<ApiResponse<FHIRResource[]>> {
    const resources: FHIRResource[] = Array.from(
      { length: Math.min(limit, 10) },
      (_, i) => ({
        id: `fhir_${i}`,
        resourceType:
          resourceType || ["Patient", "Observation", "DiagnosticReport"][i % 3],
        data: { id: `resource_${i}`, status: "active" },
        timestamp: new Date(Date.now() - i * 45000).toISOString(),
        emrSystemId: systemId || "1",
      }),
    );
    return createMockResponse(resources);
  },

  async testConnection(
    systemId: string,
  ): Promise<
    ApiResponse<{ success: boolean; latency: number; message: string }>
  > {
    const result = {
      success: Math.random() > 0.1,
      latency: Math.floor(Math.random() * 100) + 50,
      message: "Connection test successful",
    };
    return createMockResponse(result);
  },

  async addSystem(
    system: Omit<EMRSystem, "id" | "lastSync" | "apiCalls">,
  ): Promise<ApiResponse<EMRSystem>> {
    const newSystem: EMRSystem = {
      ...system,
      id: `sys_${Date.now()}`,
      lastSync: new Date().toISOString(),
      apiCalls: 0,
    };
    return createMockResponse(newSystem);
  },

  async updateSystem(
    id: string,
    updates: Partial<EMRSystem>,
  ): Promise<ApiResponse<EMRSystem>> {
    const systems = await this.getConnectedSystems();
    const system = systems.data.find((s) => s.id === id);
    if (!system) {
      throw new Error("System not found");
    }
    const updatedSystem = { ...system, ...updates };
    return createMockResponse(updatedSystem);
  },

  async removeSystem(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return createMockResponse({ success: true });
  },
};

// Mock AI Service
export const mockAiService = {
  async getModels(): Promise<ApiResponse<AIModel[]>> {
    const models: AIModel[] = [
      {
        id: "gpt-4",
        name: "GPT-4",
        provider: "openai",
        type: "cloud",
        status: "active",
        requests: 8420,
        avgTime: 220,
        accuracy: 96.8,
        cost: 142.5,
        capabilities: ["text-generation", "analysis"],
      },
      {
        id: "claude-3-sonnet",
        name: "Claude-3 Sonnet",
        provider: "anthropic",
        type: "cloud",
        status: "active",
        requests: 2180,
        avgTime: 180,
        accuracy: 95.1,
        cost: 87.2,
        capabilities: ["text-generation", "analysis"],
      },
      {
        id: "local-clinical",
        name: "Local Clinical Model",
        provider: "local",
        type: "local",
        status: "active",
        requests: 12340,
        avgTime: 85,
        accuracy: 94.2,
        cost: 0,
        capabilities: ["clinical-documentation", "coding"],
      },
    ];
    return createMockResponse(models);
  },

  async getProviders(): Promise<ApiResponse<AIProvider[]>> {
    const providers: AIProvider[] = [
      {
        id: "openai",
        name: "OpenAI",
        type: "cloud",
        status: "connected",
        models: [],
      },
      {
        id: "anthropic",
        name: "Anthropic",
        type: "cloud",
        status: "connected",
        models: [],
      },
      {
        id: "local",
        name: "Local Models",
        type: "local",
        status: "connected",
        endpoint: "http://localhost:8080",
        models: [],
      },
    ];
    return createMockResponse(providers);
  },

  async getTokenUsage(period: string): Promise<ApiResponse<TokenUsage[]>> {
    const usage: TokenUsage[] = [
      {
        provider: "OpenAI",
        model: "GPT-4",
        inputTokens: 1247000,
        outputTokens: 892000,
        inputCost: 37.41,
        outputCost: 53.52,
        totalCost: 90.93,
        percentage: 36.7,
      },
      {
        provider: "Anthropic",
        model: "Claude-3 Sonnet",
        inputTokens: 892000,
        outputTokens: 634000,
        inputCost: 2.68,
        outputCost: 9.51,
        totalCost: 12.19,
        percentage: 4.9,
      },
      {
        provider: "Local",
        model: "Clinical Model",
        inputTokens: 2340000,
        outputTokens: 1560000,
        inputCost: 0,
        outputCost: 0,
        totalCost: 0,
        percentage: 0,
      },
    ];
    return createMockResponse(usage);
  },

  async getBudgetStatus(): Promise<ApiResponse<BudgetStatus[]>> {
    const status: BudgetStatus[] = [
      { period: "daily", spent: 247.5, budget: 500, percentage: 49.5 },
      { period: "weekly", spent: 1847, budget: 2500, percentage: 73.9 },
      {
        period: "monthly",
        spent: 6247,
        budget: 10000,
        percentage: 62.5,
        projected: 8420,
      },
    ];
    return createMockResponse(status);
  },

  async updateBudgetConfig(
    config: BudgetConfig,
  ): Promise<ApiResponse<BudgetConfig>> {
    return createMockResponse(config);
  },

  async getSuggestions(
    category?: string,
    limit = 10,
  ): Promise<ApiResponse<AISuggestion[]>> {
    const suggestions: AISuggestion[] = [
      {
        id: "sugg_1",
        text: "HL7 ADT^A01 message processing optimized - 15% faster patient admission workflows detected",
        confidence: 92,
        source: "Clinical Documentation Model",
        category: "documentation",
        timestamp: new Date().toISOString(),
      },
      {
        id: "sugg_2",
        text: "ICD-10 code extraction accuracy improved to 94.2% with latest model update",
        confidence: 89,
        source: "Billing & Coding Model",
        category: "coding",
        timestamp: new Date().toISOString(),
      },
    ];
    return createMockResponse(
      category
        ? suggestions.filter((s) => s.category === category)
        : suggestions,
    );
  },

  async executeRequest(
    modelId: string,
    prompt: string,
    options?: Record<string, any>,
  ): Promise<ApiResponse<AIRequest>> {
    const request: AIRequest = {
      id: `req_${Date.now()}`,
      model: modelId,
      prompt,
      response: `Mock AI response for: ${prompt.substring(0, 50)}...`,
      inputTokens: Math.floor(Math.random() * 1000) + 100,
      outputTokens: Math.floor(Math.random() * 500) + 50,
      cost: Math.random() * 5,
      duration: Math.floor(Math.random() * 200) + 50,
      timestamp: new Date().toISOString(),
      success: Math.random() > 0.05,
    };
    return createMockResponse(request);
  },

  async getRequestHistory(limit: number): Promise<ApiResponse<AIRequest[]>> {
    const history: AIRequest[] = Array.from(
      { length: Math.min(limit, 20) },
      (_, i) => ({
        id: `req_${i}`,
        model: ["gpt-4", "claude-3-sonnet", "local-clinical"][i % 3],
        prompt: `Mock prompt ${i}`,
        response: `Mock response ${i}`,
        inputTokens: Math.floor(Math.random() * 1000) + 100,
        outputTokens: Math.floor(Math.random() * 500) + 50,
        cost: Math.random() * 5,
        duration: Math.floor(Math.random() * 200) + 50,
        timestamp: new Date(Date.now() - i * 60000).toISOString(),
        success: Math.random() > 0.05,
      }),
    );
    return createMockResponse(history);
  },

  async addProvider(
    provider: Omit<AIProvider, "id" | "models">,
  ): Promise<ApiResponse<AIProvider>> {
    const newProvider: AIProvider = {
      ...provider,
      id: `prov_${Date.now()}`,
      models: [],
    };
    return createMockResponse(newProvider);
  },

  async updateProvider(
    id: string,
    updates: Partial<AIProvider>,
  ): Promise<ApiResponse<AIProvider>> {
    const providers = await this.getProviders();
    const provider = providers.data.find((p) => p.id === id);
    if (!provider) {
      throw new Error("Provider not found");
    }
    const updatedProvider = { ...provider, ...updates };
    return createMockResponse(updatedProvider);
  },

  async testProvider(
    id: string,
  ): Promise<
    ApiResponse<{ success: boolean; latency: number; message: string }>
  > {
    const result = {
      success: Math.random() > 0.1,
      latency: Math.floor(Math.random() * 200) + 100,
      message: "Provider connection test successful",
    };
    return createMockResponse(result);
  },
};

// Mock Audit Service
export const mockAuditService = {
  async getAuditLogs(filters?: any): Promise<ApiResponse<AuditLog[]>> {
    const logs: AuditLog[] = Array.from({ length: 20 }, (_, i) => ({
      id: `log_${i}`,
      timestamp: new Date(Date.now() - i * 60000).toISOString(),
      userId: `user_${i % 5}`,
      action: ["login", "execute_function", "view_data", "export_data"][i % 4],
      resource: ["mcp_function", "emr_system", "ai_model", "audit_log"][i % 4],
      details: { mockData: true },
      ipAddress: `192.168.1.${100 + (i % 50)}`,
      userAgent: "Mozilla/5.0 (Mock Browser)",
      success: Math.random() > 0.05,
    }));
    return createMockResponse(logs);
  },

  async createAuditLog(
    log: Omit<AuditLog, "id" | "timestamp">,
  ): Promise<ApiResponse<AuditLog>> {
    const newLog: AuditLog = {
      ...log,
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    return createMockResponse(newLog);
  },

  async getComplianceReports(
    type?: string,
  ): Promise<ApiResponse<ComplianceReport[]>> {
    const reports: ComplianceReport[] = [
      {
        id: "report_1",
        type: "hipaa",
        period: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          end: new Date().toISOString(),
        },
        status: "compliant",
        findings: [],
        generatedAt: new Date().toISOString(),
        generatedBy: "system",
      },
    ];
    return createMockResponse(
      type ? reports.filter((r) => r.type === type) : reports,
    );
  },

  async generateComplianceReport(
    type: string,
    period: { start: string; end: string },
  ): Promise<ApiResponse<ComplianceReport>> {
    const report: ComplianceReport = {
      id: `report_${Date.now()}`,
      type: type as any,
      period,
      status: "compliant",
      findings: [],
      generatedAt: new Date().toISOString(),
      generatedBy: "system",
    };
    return createMockResponse(report);
  },

  async getBillingRecords(
    filters?: any,
  ): Promise<ApiResponse<BillingRecord[]>> {
    const records: BillingRecord[] = Array.from({ length: 50 }, (_, i) => ({
      id: `bill_${i}`,
      timestamp: new Date(Date.now() - i * 30000).toISOString(),
      client: ["MedFlow EMR", "HealthTech Pro", "ClinicalSoft"][i % 3],
      function: [
        "generate_clinical_note",
        "extract_icd_codes",
        "summarize_patient_history",
      ][i % 3],
      duration: Math.floor(Math.random() * 200) + 50,
      cost: Math.random() * 0.1,
      status: Math.random() > 0.05 ? "success" : "error",
      reference: `REF-${789000 + i}`,
      metadata: {},
    }));
    return createMockResponse(records);
  },

  async getRevenueMetrics(): Promise<ApiResponse<RevenueMetrics>> {
    const metrics: RevenueMetrics = {
      today: 8247,
      week: 42350,
      month: 156780,
      year: 1890450,
      growth: {
        daily: 12,
        weekly: 8,
        monthly: 23,
      },
      topClients: [
        { name: "MedFlow EMR", revenue: 45200, percentage: 28.8 },
        { name: "HealthTech Pro", revenue: 38900, percentage: 24.8 },
        { name: "ClinicalSoft", revenue: 28400, percentage: 18.1 },
      ],
    };
    return createMockResponse(metrics);
  },

  async getSecurityEvents(
    filters?: any,
  ): Promise<ApiResponse<SecurityEvent[]>> {
    const events: SecurityEvent[] = Array.from({ length: 10 }, (_, i) => ({
      id: `sec_${i}`,
      timestamp: new Date(Date.now() - i * 120000).toISOString(),
      type: ["authentication", "authorization", "data_access", "system"][
        i % 4
      ] as any,
      severity: ["info", "warning", "error"][i % 3] as any,
      source: `system_${i % 3}`,
      description: `Mock security event ${i}`,
      resolved: Math.random() > 0.3,
    }));
    return createMockResponse(events);
  },

  async createSecurityEvent(
    event: Omit<SecurityEvent, "id" | "timestamp" | "resolved">,
  ): Promise<ApiResponse<SecurityEvent>> {
    const newEvent: SecurityEvent = {
      ...event,
      id: `sec_${Date.now()}`,
      timestamp: new Date().toISOString(),
      resolved: false,
    };
    return createMockResponse(newEvent);
  },

  async exportAuditData(
    format: string,
    filters?: any,
  ): Promise<ApiResponse<{ downloadUrl: string }>> {
    const result = {
      downloadUrl: `https://mock-api.com/exports/audit-${Date.now()}.${format}`,
    };
    return createMockResponse(result);
  },
};
