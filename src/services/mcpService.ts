// MCP (Model-Client-Provider) Service Layer

import { apiClient, ApiResponse } from "./api";
import { mockMcpService } from "./mockServices";

// MCP Types
export interface MCPFunction {
  name: string;
  description: string;
  server: string;
  category: string;
  parameters?: Record<string, any>;
  returns?: Record<string, any>;
}

export interface MCPServer {
  id: string;
  name: string;
  status: "healthy" | "warning" | "error";
  load: number;
  requests: number;
  avgTime: number;
  errors: number;
  functions: MCPFunction[];
}

export interface MCPMetrics {
  activeConnections: number;
  totalRequests: number;
  avgResponseTime: number;
  errorRate: number;
  throughput: number;
  uptime: number;
}

export interface MCPSystemHealth {
  overall: number;
  client: number;
  server: number;
  models: number;
}

export interface MCPFunctionCall {
  functionName: string;
  parameters: Record<string, any>;
  clientId: string;
  timestamp: string;
}

export interface MCPFunctionResult {
  id: string;
  functionName: string;
  result: any;
  duration: number;
  success: boolean;
  error?: string;
  timestamp: string;
}

class MCPService {
  private useMockData =
    import.meta.env.DEV || !import.meta.env.VITE_API_BASE_URL;

  // Get MCP system status
  async getSystemStatus(): Promise<ApiResponse<MCPMetrics>> {
    if (this.useMockData) {
      return mockMcpService.getSystemStatus();
    }
    return apiClient.get<MCPMetrics>("/mcp/status");
  }

  // Get MCP server status
  async getServerStatus(): Promise<ApiResponse<MCPServer[]>> {
    if (this.useMockData) {
      return mockMcpService.getServerStatus();
    }
    return apiClient.get<MCPServer[]>("/mcp/servers");
  }

  // Get system health metrics
  async getSystemHealth(): Promise<ApiResponse<MCPSystemHealth>> {
    if (this.useMockData) {
      return mockMcpService.getSystemHealth();
    }
    return apiClient.get<MCPSystemHealth>("/mcp/health");
  }

  // Get available MCP functions
  async getFunctions(): Promise<ApiResponse<MCPFunction[]>> {
    if (this.useMockData) {
      return mockMcpService.getFunctions();
    }
    return apiClient.get<MCPFunction[]>("/mcp/functions");
  }

  // Execute MCP function
  async executeFunction(
    call: MCPFunctionCall,
  ): Promise<ApiResponse<MCPFunctionResult>> {
    if (this.useMockData) {
      return mockMcpService.executeFunction(call);
    }
    return apiClient.post<MCPFunctionResult>("/mcp/execute", call);
  }

  // Get function execution history
  async getFunctionHistory(
    limit = 100,
  ): Promise<ApiResponse<MCPFunctionResult[]>> {
    if (this.useMockData) {
      return mockMcpService.getFunctionHistory(limit);
    }
    return apiClient.get<MCPFunctionResult[]>("/mcp/history", { limit });
  }

  // Health check for MCP servers
  async healthCheck(): Promise<
    ApiResponse<{ status: string; servers: Record<string, boolean> }>
  > {
    if (this.useMockData) {
      return mockMcpService.healthCheck();
    }
    return apiClient.get("/mcp/health-check");
  }
}

export const mcpService = new MCPService();
