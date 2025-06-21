import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility functions for the EMR AI Enhancement System

/**
 * Format numbers with appropriate suffixes (K, M, B)
 */
export function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + "B";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

/**
 * Format currency values
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/**
 * Format percentage values
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format date/time for display
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format time duration in milliseconds to human readable format
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  if (ms < 60000) {
    return `${(ms / 1000).toFixed(1)}s`;
  }
  if (ms < 3600000) {
    return `${(ms / 60000).toFixed(1)}m`;
  }
  return `${(ms / 3600000).toFixed(1)}h`;
}

/**
 * Generate a random ID for mock data
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Validate API key format
 */
export function validateApiKey(key: string, provider: string): boolean {
  const patterns = {
    openai: /^sk-[a-zA-Z0-9]{48}$/,
    anthropic: /^sk-ant-[a-zA-Z0-9-]{95}$/,
    google: /^AIza[a-zA-Z0-9-_]{35}$/,
  };

  const pattern = patterns[provider as keyof typeof patterns];
  return pattern ? pattern.test(key) : key.length > 10;
}

/**
 * Simulate API delay for development
 */
export function simulateDelay(ms: number = 1000): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Get status color based on health percentage
 */
export function getHealthColor(health: number): string {
  if (health >= 95) return "text-green-600";
  if (health >= 85) return "text-yellow-600";
  if (health >= 70) return "text-orange-600";
  return "text-red-600";
}

/**
 * Get status badge variant based on status
 */
export function getStatusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status.toLowerCase()) {
    case "active":
    case "healthy":
    case "connected":
    case "online":
      return "default";
    case "warning":
    case "degraded":
      return "outline";
    case "error":
    case "offline":
    case "disconnected":
      return "destructive";
    default:
      return "secondary";
  }
}

/**
 * Debounce function for search and input handling
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for scroll and resize events
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Check if the application is running in development mode
 */
export function isDevelopment(): boolean {
  return import.meta.env.DEV;
}

/**
 * Check if Tempo is enabled
 */
export function isTempoEnabled(): boolean {
  return import.meta.env.VITE_TEMPO === "true";
}

/**
 * Get environment variable with fallback
 */
export function getEnvVar(key: string, fallback: string = ""): string {
  return import.meta.env[key] || fallback;
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Generate mock data for development and testing
 */
export function generateMockData<T>(generator: () => T, count: number): T[] {
  return Array.from({ length: count }, generator);
}

/**
 * Calculate uptime percentage
 */
export function calculateUptime(totalTime: number, downTime: number): number {
  return ((totalTime - downTime) / totalTime) * 100;
}

/**
 * Format bytes to human readable format
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

/**
 * Check if a URL is valid
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate a color based on a string (for consistent avatar colors, etc.)
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
}
