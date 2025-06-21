// EMR Integration Service Layer

import { apiClient, ApiResponse } from "./api";
import { mockEmrService } from "./mockServices";

// EMR Types
export interface EMRSystem {
  id: string;
  name: string;
  version: string;
  status: "active" | "maintenance" | "offline";
  lastSync: string;
  apiCalls: number;
  type: "commercial" | "open_source";
  features: string[];
  isDemo?: boolean;
}

export interface EMRConnection {
  id: string;
  systemId: string;
  endpoint: string;
  status: "connected" | "disconnected" | "error";
  lastHeartbeat: string;
  configuration: Record<string, any>;
}

export interface HL7Message {
  id: string;
  type: string;
  content: string;
  timestamp: string;
  processed: boolean;
  emrSystemId: string;
}

export interface FHIRResource {
  id: string;
  resourceType: string;
  data: Record<string, any>;
  timestamp: string;
  emrSystemId: string;
}

export interface EMRMetrics {
  hl7Messages: number;
  fhirResources: number;
  activeConnections: number;
  lastActivity: string;
  totalSystems: number;
  healthySystems: number;
}

class EMRService {
  private useMockData =
    import.meta.env.DEV || !import.meta.env.VITE_API_BASE_URL;

  // Get connected EMR systems
  async getConnectedSystems(): Promise<ApiResponse<EMRSystem[]>> {
    if (this.useMockData) {
      return mockEmrService.getConnectedSystems();
    }
    return apiClient.get<EMRSystem[]>("/emr/systems");
  }

  // Get EMR system by ID
  async getSystem(id: string): Promise<ApiResponse<EMRSystem>> {
    if (this.useMockData) {
      return mockEmrService.getSystem(id);
    }
    return apiClient.get<EMRSystem>(`/emr/systems/${id}`);
  }

  // Get EMR connection status
  async getConnectionStatus(
    systemId: string,
  ): Promise<ApiResponse<EMRConnection>> {
    if (this.useMockData) {
      return mockEmrService.getConnectionStatus(systemId);
    }
    return apiClient.get<EMRConnection>(`/emr/connections/${systemId}`);
  }

  // Get EMR metrics
  async getMetrics(): Promise<ApiResponse<EMRMetrics>> {
    if (this.useMockData) {
      return mockEmrService.getMetrics();
    }
    return apiClient.get<EMRMetrics>("/emr/metrics");
  }

  // Get recent HL7 messages
  async getHL7Messages(
    systemId?: string,
    limit = 50,
  ): Promise<ApiResponse<HL7Message[]>> {
    if (this.useMockData) {
      return mockEmrService.getHL7Messages(systemId, limit);
    }
    const params = { limit, ...(systemId && { systemId }) };
    return apiClient.get<HL7Message[]>("/emr/hl7-messages", params);
  }

  // Get FHIR resources
  async getFHIRResources(
    systemId?: string,
    resourceType?: string,
    limit = 50,
  ): Promise<ApiResponse<FHIRResource[]>> {
    if (this.useMockData) {
      return mockEmrService.getFHIRResources(systemId, resourceType, limit);
    }
    const params = {
      limit,
      ...(systemId && { systemId }),
      ...(resourceType && { resourceType }),
    };
    return apiClient.get<FHIRResource[]>("/emr/fhir-resources", params);
  }

  // Test EMR connection
  async testConnection(
    systemId: string,
  ): Promise<
    ApiResponse<{ success: boolean; latency: number; message: string }>
  > {
    if (this.useMockData) {
      return mockEmrService.testConnection(systemId);
    }
    return apiClient.post(`/emr/test-connection/${systemId}`);
  }

  // Add new EMR system
  async addSystem(
    system: Omit<EMRSystem, "id" | "lastSync" | "apiCalls">,
  ): Promise<ApiResponse<EMRSystem>> {
    if (this.useMockData) {
      return mockEmrService.addSystem(system);
    }
    return apiClient.post<EMRSystem>("/emr/systems", system);
  }

  // Update EMR system
  async updateSystem(
    id: string,
    updates: Partial<EMRSystem>,
  ): Promise<ApiResponse<EMRSystem>> {
    if (this.useMockData) {
      return mockEmrService.updateSystem(id, updates);
    }
    return apiClient.put<EMRSystem>(`/emr/systems/${id}`, updates);
  }

  // Remove EMR system
  async removeSystem(id: string): Promise<ApiResponse<{ success: boolean }>> {
    if (this.useMockData) {
      return mockEmrService.removeSystem(id);
    }
    return apiClient.delete(`/emr/systems/${id}`);
  }
}

export const emrService = new EMRService();
