// Custom React hooks for API integration

import { useState, useEffect, useCallback } from "react";
import { ApiResponse, ApiError } from "../services/api";

// Generic API hook
export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = [],
  options: {
    immediate?: boolean;
    refreshInterval?: number;
  } = {},
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const { immediate = true, refreshInterval } = options;

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();
      setData(response.data);
      setLastFetch(new Date());
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  const refresh = useCallback(() => {
    execute();
  }, [execute]);

  // Initial load
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  // Auto-refresh interval
  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(execute, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [execute, refreshInterval]);

  return {
    data,
    loading,
    error,
    lastFetch,
    execute,
    refresh,
  };
}

// Mutation hook for POST/PUT/DELETE operations
export function useMutation<TData, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>,
) {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const mutate = useCallback(
    async (variables: TVariables) => {
      setLoading(true);
      setError(null);

      try {
        const response = await mutationFn(variables);
        setData(response.data);
        return response;
      } catch (err) {
        const error = err as ApiError;
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [mutationFn],
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    mutate,
    reset,
  };
}

// Paginated data hook
export function usePaginatedApi<T>(
  apiCall: (
    page: number,
    limit: number,
  ) => Promise<
    ApiResponse<{ items: T[]; total: number; page: number; limit: number }>
  >,
  initialLimit = 20,
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchPage = useCallback(
    async (pageNum: number, reset = false) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiCall(pageNum, limit);
        const { items, total: totalItems } = response.data;

        setData((prev) => (reset ? items : [...prev, ...items]));
        setTotal(totalItems);
        setPage(pageNum);
        setHasMore(pageNum * limit < totalItems);
      } catch (err) {
        setError(err as ApiError);
      } finally {
        setLoading(false);
      }
    },
    [apiCall, limit],
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchPage(page + 1, false);
    }
  }, [fetchPage, page, loading, hasMore]);

  const refresh = useCallback(() => {
    fetchPage(1, true);
  }, [fetchPage]);

  // Initial load
  useEffect(() => {
    fetchPage(1, true);
  }, [fetchPage]);

  return {
    data,
    loading,
    error,
    page,
    limit,
    total,
    hasMore,
    loadMore,
    refresh,
    setLimit,
  };
}

// Real-time data hook with WebSocket support
export function useRealTimeData<T>(
  initialApiCall: () => Promise<ApiResponse<T>>,
  wsEndpoint?: string,
  refreshInterval = 30000,
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [connected, setConnected] = useState(false);

  // Initial data fetch
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await initialApiCall();
      setData(response.data);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }, [initialApiCall]);

  // WebSocket connection
  useEffect(() => {
    if (!wsEndpoint) return;

    const ws = new WebSocket(wsEndpoint);

    ws.onopen = () => {
      setConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const update = JSON.parse(event.data);
        setData(update);
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    };

    ws.onclose = () => {
      setConnected(false);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [wsEndpoint]);

  // Fallback polling when WebSocket is not available
  useEffect(() => {
    if (wsEndpoint && connected) return; // Skip polling if WebSocket is connected

    fetchData(); // Initial fetch

    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval, wsEndpoint, connected]);

  return {
    data,
    loading,
    error,
    connected,
    refresh: fetchData,
  };
}

// Local storage cache hook
export function useCachedApi<T>(
  key: string,
  apiCall: () => Promise<ApiResponse<T>>,
  cacheTime = 5 * 60 * 1000, // 5 minutes
) {
  const [data, setData] = useState<T | null>(() => {
    try {
      const cached = localStorage.getItem(key);
      if (cached) {
        const { data: cachedData, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < cacheTime) {
          return cachedData;
        }
      }
    } catch (err) {
      console.error("Failed to load cached data:", err);
    }
    return null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchData = useCallback(
    async (forceRefresh = false) => {
      // Check cache first
      if (!forceRefresh && data) {
        try {
          const cached = localStorage.getItem(key);
          if (cached) {
            const { timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < cacheTime) {
              return; // Use cached data
            }
          }
        } catch (err) {
          console.error("Failed to check cache:", err);
        }
      }

      setLoading(true);
      setError(null);

      try {
        const response = await apiCall();
        setData(response.data);

        // Cache the data
        localStorage.setItem(
          key,
          JSON.stringify({
            data: response.data,
            timestamp: Date.now(),
          }),
        );
      } catch (err) {
        setError(err as ApiError);
      } finally {
        setLoading(false);
      }
    },
    [key, apiCall, cacheTime, data],
  );

  const clearCache = useCallback(() => {
    localStorage.removeItem(key);
    setData(null);
  }, [key]);

  // Initial load
  useEffect(() => {
    if (!data) {
      fetchData();
    }
  }, [fetchData, data]);

  return {
    data,
    loading,
    error,
    refresh: () => fetchData(true),
    clearCache,
  };
}
