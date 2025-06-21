// AI Service Layer for Model Management and Execution

import { apiClient, ApiResponse } from "./api";
import { mockAiService } from "./mockServices";

// AI Types
export interface AIModel {
  id: string;
  name: string;
  provider: "openai" | "anthropic" | "google" | "local";
  type: "cloud" | "local";
  status: "active" | "idle" | "standby" | "error";
  requests: number;
  avgTime: number;
  accuracy: number;
  cost: number;
  capabilities: string[];
}

export interface AIProvider {
  id: string;
  name: string;
  type: "cloud" | "local";
  status: "connected" | "disconnected" | "error";
  apiKey?: string;
  endpoint?: string;
  models: AIModel[];
}

export interface TokenUsage {
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  inputCost: number;
  outputCost: number;
  totalCost: number;
  percentage: number;
}

export interface BudgetConfig {
  daily: number;
  weekly: number;
  monthly: number;
  alertThresholds: {
    warning: number;
    critical: number;
  };
}

export interface BudgetStatus {
  period: "daily" | "weekly" | "monthly";
  spent: number;
  budget: number;
  percentage: number;
  projected?: number;
}

export interface AIRequest {
  id: string;
  model: string;
  prompt: string;
  response: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  duration: number;
  timestamp: string;
  success: boolean;
  error?: string;
}

export interface AISuggestion {
  id: string;
  text: string;
  confidence: number;
  source: string;
  category: "documentation" | "coding" | "summary" | "analysis";
  timestamp: string;
}

class AIService {
  private useMockData =
    import.meta.env.DEV || !import.meta.env.VITE_API_BASE_URL;

  // Get available AI models
  async getModels(): Promise<ApiResponse<AIModel[]>> {
    if (this.useMockData) {
      return mockAiService.getModels();
    }
    return apiClient.get<AIModel[]>("/ai/models");
  }

  // Get AI providers
  async getProviders(): Promise<ApiResponse<AIProvider[]>> {
    if (this.useMockData) {
      return mockAiService.getProviders();
    }
    return apiClient.get<AIProvider[]>("/ai/providers");
  }

  // Get token usage statistics
  async getTokenUsage(period = "24h"): Promise<ApiResponse<TokenUsage[]>> {
    if (this.useMockData) {
      return mockAiService.getTokenUsage(period);
    }
    return apiClient.get<TokenUsage[]>("/ai/token-usage", { period });
  }

  // Get budget status
  async getBudgetStatus(): Promise<ApiResponse<BudgetStatus[]>> {
    if (this.useMockData) {
      return mockAiService.getBudgetStatus();
    }
    return apiClient.get<BudgetStatus[]>("/ai/budget-status");
  }

  // Update budget configuration
  async updateBudgetConfig(
    config: BudgetConfig,
  ): Promise<ApiResponse<BudgetConfig>> {
    if (this.useMockData) {
      return mockAiService.updateBudgetConfig(config);
    }
    return apiClient.put<BudgetConfig>("/ai/budget-config", config);
  }

  // Get AI suggestions
  async getSuggestions(
    category?: string,
    limit = 10,
  ): Promise<ApiResponse<AISuggestion[]>> {
    if (this.useMockData) {
      return mockAiService.getSuggestions(category, limit);
    }
    const params = { limit, ...(category && { category }) };
    return apiClient.get<AISuggestion[]>("/ai/suggestions", params);
  }

  // Execute AI request
  async executeRequest(
    modelId: string,
    prompt: string,
    options?: Record<string, any>,
  ): Promise<ApiResponse<AIRequest>> {
    if (this.useMockData) {
      return mockAiService.executeRequest(modelId, prompt, options);
    }
    return apiClient.post<AIRequest>("/ai/execute", {
      modelId,
      prompt,
      options,
    });
  }

  // Get request history
  async getRequestHistory(limit = 100): Promise<ApiResponse<AIRequest[]>> {
    if (this.useMockData) {
      return mockAiService.getRequestHistory(limit);
    }
    return apiClient.get<AIRequest[]>("/ai/history", { limit });
  }

  // Add AI provider
  async addProvider(
    provider: Omit<AIProvider, "id" | "models">,
  ): Promise<ApiResponse<AIProvider>> {
    if (this.useMockData) {
      return mockAiService.addProvider(provider);
    }
    return apiClient.post<AIProvider>("/ai/providers", provider);
  }

  // Update AI provider
  async updateProvider(
    id: string,
    updates: Partial<AIProvider>,
  ): Promise<ApiResponse<AIProvider>> {
    if (this.useMockData) {
      return mockAiService.updateProvider(id, updates);
    }
    return apiClient.put<AIProvider>(`/ai/providers/${id}`, updates);
  }

  // Test AI provider connection
  async testProvider(
    id: string,
  ): Promise<
    ApiResponse<{ success: boolean; latency: number; message: string }>
  > {
    if (this.useMockData) {
      return mockAiService.testProvider(id);
    }
    return apiClient.post(`/ai/providers/${id}/test`);
  }
}

export const aiService = new AIService();
