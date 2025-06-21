// Audit and Compliance Service Layer

import { apiClient, ApiResponse } from "./api";
import { mockAuditService } from "./mockServices";

// Audit Types
export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  resource: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  error?: string;
}

export interface ComplianceReport {
  id: string;
  type: "hipaa" | "gdpr" | "sox" | "custom";
  period: {
    start: string;
    end: string;
  };
  status: "compliant" | "non_compliant" | "warning";
  findings: ComplianceFinding[];
  generatedAt: string;
  generatedBy: string;
}

export interface ComplianceFinding {
  id: string;
  severity: "low" | "medium" | "high" | "critical";
  category: string;
  description: string;
  recommendation: string;
  affectedResources: string[];
  status: "open" | "in_progress" | "resolved";
}

export interface BillingRecord {
  id: string;
  timestamp: string;
  client: string;
  function: string;
  duration: number;
  cost: number;
  status: "success" | "error";
  reference: string;
  metadata: Record<string, any>;
}

export interface RevenueMetrics {
  today: number;
  week: number;
  month: number;
  year: number;
  growth: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  topClients: Array<{
    name: string;
    revenue: number;
    percentage: number;
  }>;
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  type:
    | "authentication"
    | "authorization"
    | "data_access"
    | "system"
    | "network";
  severity: "info" | "warning" | "error" | "critical";
  source: string;
  description: string;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
}

class AuditService {
  private useMockData =
    import.meta.env.DEV || !import.meta.env.VITE_API_BASE_URL;

  // Get audit logs
  async getAuditLogs(filters?: {
    startDate?: string;
    endDate?: string;
    userId?: string;
    action?: string;
    limit?: number;
  }): Promise<ApiResponse<AuditLog[]>> {
    if (this.useMockData) {
      return mockAuditService.getAuditLogs(filters);
    }
    return apiClient.get<AuditLog[]>("/audit/logs", filters);
  }

  // Create audit log entry
  async createAuditLog(
    log: Omit<AuditLog, "id" | "timestamp">,
  ): Promise<ApiResponse<AuditLog>> {
    if (this.useMockData) {
      return mockAuditService.createAuditLog(log);
    }
    return apiClient.post<AuditLog>("/audit/logs", log);
  }

  // Get compliance reports
  async getComplianceReports(
    type?: string,
  ): Promise<ApiResponse<ComplianceReport[]>> {
    if (this.useMockData) {
      return mockAuditService.getComplianceReports(type);
    }
    const params = type ? { type } : undefined;
    return apiClient.get<ComplianceReport[]>(
      "/audit/compliance-reports",
      params,
    );
  }

  // Generate compliance report
  async generateComplianceReport(
    type: string,
    period: { start: string; end: string },
  ): Promise<ApiResponse<ComplianceReport>> {
    if (this.useMockData) {
      return mockAuditService.generateComplianceReport(type, period);
    }
    return apiClient.post<ComplianceReport>("/audit/compliance-reports", {
      type,
      period,
    });
  }

  // Get billing records
  async getBillingRecords(filters?: {
    startDate?: string;
    endDate?: string;
    client?: string;
    limit?: number;
  }): Promise<ApiResponse<BillingRecord[]>> {
    if (this.useMockData) {
      return mockAuditService.getBillingRecords(filters);
    }
    return apiClient.get<BillingRecord[]>("/audit/billing", filters);
  }

  // Get revenue metrics
  async getRevenueMetrics(): Promise<ApiResponse<RevenueMetrics>> {
    if (this.useMockData) {
      return mockAuditService.getRevenueMetrics();
    }
    return apiClient.get<RevenueMetrics>("/audit/revenue-metrics");
  }

  // Get security events
  async getSecurityEvents(filters?: {
    startDate?: string;
    endDate?: string;
    type?: string;
    severity?: string;
    resolved?: boolean;
    limit?: number;
  }): Promise<ApiResponse<SecurityEvent[]>> {
    if (this.useMockData) {
      return mockAuditService.getSecurityEvents(filters);
    }
    return apiClient.get<SecurityEvent[]>("/audit/security-events", filters);
  }

  // Create security event
  async createSecurityEvent(
    event: Omit<SecurityEvent, "id" | "timestamp" | "resolved">,
  ): Promise<ApiResponse<SecurityEvent>> {
    if (this.useMockData) {
      return mockAuditService.createSecurityEvent(event);
    }
    return apiClient.post<SecurityEvent>("/audit/security-events", event);
  }

  // Export audit data
  async exportAuditData(
    format: "csv" | "json" | "pdf",
    filters?: Record<string, any>,
  ): Promise<ApiResponse<{ downloadUrl: string }>> {
    if (this.useMockData) {
      return mockAuditService.exportAuditData(format, filters);
    }
    return apiClient.post("/audit/export", { format, filters });
  }
}

export const auditService = new AuditService();
