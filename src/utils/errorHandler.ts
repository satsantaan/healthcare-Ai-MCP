// Error handling utilities

import { ApiError } from "../services/api";

// Error types
export enum ErrorType {
  NETWORK = "NETWORK",
  AUTHENTICATION = "AUTHENTICATION",
  AUTHORIZATION = "AUTHORIZATION",
  VALIDATION = "VALIDATION",
  SERVER = "SERVER",
  UNKNOWN = "UNKNOWN",
}

// Error severity levels
export enum ErrorSeverity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

// Enhanced error interface
export interface EnhancedError extends ApiError {
  type: ErrorType;
  severity: ErrorSeverity;
  userMessage: string;
  retryable: boolean;
  context?: Record<string, any>;
}

// Error classification
export function classifyError(error: ApiError): EnhancedError {
  let type = ErrorType.UNKNOWN;
  let severity = ErrorSeverity.MEDIUM;
  let userMessage = "An unexpected error occurred";
  let retryable = false;

  // Classify by HTTP status code
  if (error.code) {
    if (error.code >= 400 && error.code < 500) {
      // Client errors
      switch (error.code) {
        case 401:
          type = ErrorType.AUTHENTICATION;
          severity = ErrorSeverity.HIGH;
          userMessage = "Authentication required. Please log in again.";
          retryable = false;
          break;
        case 403:
          type = ErrorType.AUTHORIZATION;
          severity = ErrorSeverity.HIGH;
          userMessage = "You do not have permission to perform this action.";
          retryable = false;
          break;
        case 404:
          type = ErrorType.VALIDATION;
          severity = ErrorSeverity.LOW;
          userMessage = "The requested resource was not found.";
          retryable = false;
          break;
        case 422:
          type = ErrorType.VALIDATION;
          severity = ErrorSeverity.LOW;
          userMessage = "Please check your input and try again.";
          retryable = false;
          break;
        case 429:
          type = ErrorType.SERVER;
          severity = ErrorSeverity.MEDIUM;
          userMessage =
            "Too many requests. Please wait a moment and try again.";
          retryable = true;
          break;
        default:
          type = ErrorType.VALIDATION;
          severity = ErrorSeverity.MEDIUM;
          userMessage = "There was a problem with your request.";
          retryable = false;
      }
    } else if (error.code >= 500) {
      // Server errors
      type = ErrorType.SERVER;
      severity = ErrorSeverity.HIGH;
      userMessage = "Server error. Please try again later.";
      retryable = true;
    }
  }

  // Classify by error message
  if (error.error) {
    const errorMessage = error.error.toLowerCase();

    if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
      type = ErrorType.NETWORK;
      severity = ErrorSeverity.MEDIUM;
      userMessage =
        "Network connection error. Please check your internet connection.";
      retryable = true;
    } else if (errorMessage.includes("timeout")) {
      type = ErrorType.NETWORK;
      severity = ErrorSeverity.MEDIUM;
      userMessage = "Request timed out. Please try again.";
      retryable = true;
    } else if (errorMessage.includes("abort")) {
      type = ErrorType.NETWORK;
      severity = ErrorSeverity.LOW;
      userMessage = "Request was cancelled.";
      retryable = true;
    }
  }

  return {
    ...error,
    type,
    severity,
    userMessage,
    retryable,
  };
}

// Error logging
export function logError(error: EnhancedError, context?: Record<string, any>) {
  const logData = {
    timestamp: new Date().toISOString(),
    error: {
      message: error.error,
      code: error.code,
      type: error.type,
      severity: error.severity,
      stack: error.details?.stack,
    },
    context: {
      ...error.context,
      ...context,
      userAgent: navigator.userAgent,
      url: window.location.href,
    },
  };

  // Log to console in development
  if (import.meta.env.DEV) {
    console.error("API Error:", logData);
  }

  // Send to error tracking service in production
  if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
    // This would integrate with Sentry or similar service
    // Sentry.captureException(error, { extra: logData });
  }

  // Send to audit service for security events
  if (
    error.type === ErrorType.AUTHENTICATION ||
    error.type === ErrorType.AUTHORIZATION
  ) {
    // This would send to audit service
    // auditService.createSecurityEvent({ ... });
  }
}

// Error recovery strategies
export class ErrorRecovery {
  private static retryDelays = [1000, 2000, 4000, 8000]; // Exponential backoff

  static async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries = 3,
    shouldRetry?: (error: EnhancedError) => boolean,
  ): Promise<T> {
    let lastError: EnhancedError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        const enhancedError = classifyError(error as ApiError);
        lastError = enhancedError;

        // Don't retry if it's the last attempt
        if (attempt === maxRetries) {
          break;
        }

        // Don't retry if error is not retryable
        if (!enhancedError.retryable) {
          break;
        }

        // Don't retry if custom shouldRetry function returns false
        if (shouldRetry && !shouldRetry(enhancedError)) {
          break;
        }

        // Wait before retrying
        const delay =
          this.retryDelays[Math.min(attempt, this.retryDelays.length - 1)];
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  static async withCircuitBreaker<T>(
    operation: () => Promise<T>,
    options: {
      failureThreshold?: number;
      resetTimeout?: number;
      monitoringPeriod?: number;
    } = {},
  ): Promise<T> {
    const {
      failureThreshold = 5,
      resetTimeout = 60000,
      monitoringPeriod = 60000,
    } = options;

    // This would implement circuit breaker pattern
    // For now, just execute the operation
    return operation();
  }
}

// Error notification
export interface ErrorNotification {
  id: string;
  title: string;
  message: string;
  type: "error" | "warning" | "info";
  duration?: number;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

export function createErrorNotification(
  error: EnhancedError,
): ErrorNotification {
  return {
    id: `error_${Date.now()}`,
    title: getErrorTitle(error.type),
    message: error.userMessage,
    type: error.severity === ErrorSeverity.CRITICAL ? "error" : "warning",
    duration: error.severity === ErrorSeverity.LOW ? 3000 : undefined,
    actions: error.retryable
      ? [
          {
            label: "Retry",
            action: () => {
              // This would trigger a retry of the failed operation
              console.log("Retrying operation...");
            },
          },
        ]
      : undefined,
  };
}

function getErrorTitle(type: ErrorType): string {
  switch (type) {
    case ErrorType.NETWORK:
      return "Connection Error";
    case ErrorType.AUTHENTICATION:
      return "Authentication Error";
    case ErrorType.AUTHORIZATION:
      return "Permission Error";
    case ErrorType.VALIDATION:
      return "Validation Error";
    case ErrorType.SERVER:
      return "Server Error";
    default:
      return "Error";
  }
}

// Main error handler function
export function handleError(error: any, context?: string) {
  try {
    const apiError: ApiError = {
      error: error?.message || error?.toString() || "Unknown error",
      code: error?.code || error?.status || 0,
      details: {
        stack: error?.stack,
        context,
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    };

    const enhancedError = classifyError(apiError);
    logError(enhancedError, { context });

    return enhancedError;
  } catch (handlerError) {
    console.error("Error in error handler:", handlerError);
    return null;
  }
}

// Global error handler
export function setupGlobalErrorHandler() {
  // Handle unhandled promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    const error = event.reason;
    if (error && typeof error === "object" && "error" in error) {
      const enhancedError = classifyError(error as ApiError);
      logError(enhancedError, { source: "unhandledrejection" });
    }
  });

  // Handle global errors
  window.addEventListener("error", (event) => {
    const error: ApiError = {
      error: event.message,
      code: 0,
      details: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
      },
      timestamp: new Date().toISOString(),
    };

    const enhancedError = classifyError(error);
    logError(enhancedError, { source: "global" });
  });
}
