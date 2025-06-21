// API Service Layer for EMR AI Enhancement System

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

interface ApiError {
  error: string;
  code: number;
  details?: any;
  timestamp: string;
}

// Base API configuration
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || "30000"),
  maxRetries: 3,
};

// Generic API client
class ApiClient {
  private baseURL: string;
  private timeout: number;
  private maxRetries: number;

  constructor(config = API_CONFIG) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout;
    this.maxRetries = config.maxRetries;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0,
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        data,
        success: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (retryCount < this.maxRetries && error.name !== "AbortError") {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (retryCount + 1)),
        );
        return this.request<T>(endpoint, options, retryCount + 1);
      }

      throw {
        error: error.message || "Network error",
        code: error.status || 500,
        details: error,
        timestamp: new Date().toISOString(),
      } as ApiError;
    }
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, any>,
  ): Promise<ApiResponse<T>> {
    const url = new URL(endpoint, this.baseURL);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }
    return this.request<T>(url.pathname + url.search);
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    });
  }
}

// Create API client instance
export const apiClient = new ApiClient();

// Export types
export type { ApiResponse, ApiError };
